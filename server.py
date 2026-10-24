#!/usr/bin/env python3
"""
server.py
Local development server for Windows Web 8 Portfolio.
Serves static files and dynamic endpoints for YouTube and Blog feeds.
"""

import os
import sys
import json
import threading
from http.server import SimpleHTTPRequestHandler, HTTPServer
import sync_feeds

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))

class DynamicPortfolioHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT_DIR, **kwargs)

    def do_GET(self):
        clean_path = self.path.split('?')[0]

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
            # Check if cache exists
            if os.path.exists(cache_file):
                with open(cache_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                self.send_json_response(data)
                # Refresh in background if older than 5 minutes
                threading.Thread(target=sync_feeds.sync_youtube, daemon=True).start()
                return
            
            # Fetch directly if no cache
            data = sync_feeds.sync_youtube()
            if data:
                self.send_json_response(data)
            else:
                self.send_json_response([], 500)
        except Exception as e:
            self.send_json_response({"error": str(e)}, 500)

    def handle_api_blogs(self):
        cache_file = os.path.join(ROOT_DIR, 'data', 'blogs.json')
        try:
            if os.path.exists(cache_file):
                with open(cache_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                self.send_json_response(data)
                threading.Thread(target=sync_feeds.sync_blogs, daemon=True).start()
                return
            
            data = sync_feeds.sync_blogs()
            if data:
                self.send_json_response(data)
            else:
                self.send_json_response([], 500)
        except Exception as e:
            self.send_json_response({"error": str(e)}, 500)

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
            self.send_json_response({"error": str(e)}, 500)

    def handle_api_sync(self):
        try:
            yt = sync_feeds.sync_youtube()
            bg = sync_feeds.sync_blogs()
            self.send_json_response({"youtube": yt, "blogs": bg, "status": "ok"})
        except Exception as e:
            self.send_json_response({"error": str(e)}, 500)


def run_server():
    os.chdir(ROOT_DIR)
    server_address = ('', PORT)
    httpd = HTTPServer(server_address, DynamicPortfolioHandler)
    print(f"Windows Web 8 Portfolio server running at http://localhost:{PORT}")
    print(f"  - YouTube API: http://localhost:{PORT}/api/youtube")
    print(f"  - Blogs API:   http://localhost:{PORT}/api/blogs")
    print(f"  - Force Sync:  http://localhost:{PORT}/api/sync")
    print("Press Ctrl+C to stop.\n")
    
    # Run initial sync in background thread
    threading.Thread(target=sync_feeds.sync_youtube, daemon=True).start()
    threading.Thread(target=sync_feeds.sync_blogs, daemon=True).start()

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server...")
        httpd.server_close()

if __name__ == '__main__':
    run_server()

