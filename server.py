#!/usr/bin/env python3
"""
server.py
Local development server for Windows Web 8 Portfolio.
Serves static files and dynamic endpoints for YouTube and Blog feeds.
"""

import os
import sys
import time
import json
import threading
from http.server import SimpleHTTPRequestHandler, HTTPServer
import sync_feeds

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
HOST = sys.argv[2] if len(sys.argv) > 2 else '127.0.0.1'
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))

# Concurrency control & rate-limiting for background syncs
SYNC_COOLDOWN_SECONDS = 300  # 5 minutes
_sync_lock = threading.Lock()
_last_sync_timestamps = {"youtube": 0.0, "blogs": 0.0}

def should_refresh_cache(cache_file, feed_type):
    """Check if cache file does not exist or is older than the cooldown window."""
    now = time.time()
    if now - _last_sync_timestamps.get(feed_type, 0.0) < SYNC_COOLDOWN_SECONDS:
        return False
    if not os.path.exists(cache_file):
        return True
    try:
        mtime = os.path.getmtime(cache_file)
        return (now - mtime) > SYNC_COOLDOWN_SECONDS
    except OSError:
        return True

def trigger_background_sync(feed_type, sync_func):
    """Safely start a single background thread to refresh feeds without thread exhaustion."""
    if _sync_lock.acquire(blocking=False):
        _last_sync_timestamps[feed_type] = time.time()
        def _worker():
            try:
                sync_func()
            except Exception as e:
                print(f"[server] Error during background {feed_type} sync: {e}")
            finally:
                _sync_lock.release()
        threading.Thread(target=_worker, daemon=True).start()


class DynamicPortfolioHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT_DIR, **kwargs)

    def is_safe_path(self, raw_path):
        """Prevent directory traversal, dotfile access, and serving backend scripts."""
        clean = raw_path.split('?')[0].split('#')[0]
        segments = [p for p in clean.split('/') if p]
        
        # Block dotfiles or dot-directories (.git, .github, .agents, .gitignore, etc.)
        for seg in segments:
            if seg.startswith('.'):
                return False
        
        # Disallow serving backend scripts and workspace configs
        lower_path = clean.lower()
        blocked_extensions = ('.py', '.ps1', '.sh', '.yml', '.yaml', '.code-workspace')
        if any(lower_path.endswith(ext) for ext in blocked_extensions):
            return False

        return True

    def do_GET(self):
        clean_path = self.path.split('?')[0]

        if not self.is_safe_path(clean_path):
            self.send_error(403, "Access denied")
            return

        if clean_path == '/api/youtube':
            self.handle_api_youtube()
        elif clean_path == '/api/blogs':
            self.handle_api_blogs()
        elif clean_path == '/api/credly':
            self.handle_api_credly()
        elif clean_path == '/api/sync':
            self.handle_api_sync()
        else:
            super().do_GET()

    def send_json_response(self, data, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        # Bind CORS to local origin in dev
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def handle_api_youtube(self):
        cache_file = os.path.join(ROOT_DIR, 'data', 'youtube.json')
        try:
            if os.path.exists(cache_file):
                with open(cache_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                self.send_json_response(data)
                if should_refresh_cache(cache_file, 'youtube'):
                    trigger_background_sync('youtube', sync_feeds.sync_youtube)
                return
            
            # Fetch directly if no cache
            data = sync_feeds.sync_youtube()
            if data:
                self.send_json_response(data)
            else:
                self.send_json_response([], 500)
        except Exception as e:
            print(f"[server] handle_api_youtube error: {e}")
            self.send_json_response({"error": "Failed to fetch YouTube feed"}, 500)

    def handle_api_blogs(self):
        cache_file = os.path.join(ROOT_DIR, 'data', 'blogs.json')
        try:
            if os.path.exists(cache_file):
                with open(cache_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                self.send_json_response(data)
                if should_refresh_cache(cache_file, 'blogs'):
                    trigger_background_sync('blogs', sync_feeds.sync_blogs)
                return
            
            data = sync_feeds.sync_blogs()
            if data:
                self.send_json_response(data)
            else:
                self.send_json_response([], 500)
        except Exception as e:
            print(f"[server] handle_api_blogs error: {e}")
            self.send_json_response({"error": "Failed to fetch blog feed"}, 500)

    def handle_api_credly(self):
        cache_file = os.path.join(ROOT_DIR, 'data', 'credly.json')
        try:
            if os.path.exists(cache_file):
                with open(cache_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                self.send_json_response(data)
                return
            self.send_json_response([], 404)
        except Exception as e:
            print(f"[server] handle_api_credly error: {e}")
            self.send_json_response({"error": "Failed to fetch Credly badges"}, 500)

    def handle_api_sync(self):
        try:
            yt = sync_feeds.sync_youtube()
            bg = sync_feeds.sync_blogs()
            self.send_json_response({"youtube": yt, "blogs": bg, "status": "ok"})
        except Exception as e:
            print(f"[server] handle_api_sync error: {e}")
            self.send_json_response({"error": "Failed to run sync"}, 500)


def run_server():
    os.chdir(ROOT_DIR)
    server_address = (HOST, PORT)
    httpd = HTTPServer(server_address, DynamicPortfolioHandler)
    print(f"Windows Web 8 Portfolio server running at http://{HOST}:{PORT}")
    print(f"  - YouTube API: http://{HOST}:{PORT}/api/youtube")
    print(f"  - Blogs API:   http://{HOST}:{PORT}/api/blogs")
    print(f"  - Force Sync:  http://{HOST}:{PORT}/api/sync")
    print("Press Ctrl+C to stop.\n")
    
    # Run initial sync in background thread if needed
    trigger_background_sync('youtube', sync_feeds.sync_youtube)
    trigger_background_sync('blogs', sync_feeds.sync_blogs)

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server...")
        httpd.server_close()

if __name__ == '__main__':
    run_server()
