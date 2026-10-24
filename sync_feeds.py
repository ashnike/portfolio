#!/usr/bin/env python3
"""
sync_feeds.py
Fetches latest videos from YouTube (@pinakaops) and blogs from DevOpsTryHard (devopstryhard.com)
and updates data/youtube.json and data/blogs.json.
"""

import os
import re
import json
import urllib.request
import urllib.error

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(ROOT_DIR, "data")

def sync_youtube():
    print("[1/2] Fetching YouTube videos for @pinakaops...")
    url = "https://www.youtube.com/@pinakaops"
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"}
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            html = resp.read().decode("utf-8", errors="ignore")

        # Extract lockupViewModels from ytInitialData
        m = re.search(r'var ytInitialData = ({.*?});</script>', html)
        if not m:
            m = re.search(r'window\["ytInitialData"\]\s*=\s*({.*?});', html)

        videos = []
        if m:
            data = json.loads(m.group(1))
            lockups = []
            def extract_lockups(o):
                if isinstance(o, dict):
                    if 'lockupViewModel' in o:
                        lockups.append(o['lockupViewModel'])
                    for v in o.values():
                        extract_lockups(v)
                elif isinstance(o, list):
                    for v in o:
                        extract_lockups(v)
            extract_lockups(data)

            for l in lockups:
                vid = l.get('contentId')
                meta = l.get('metadata', {}).get('lockupMetadataViewModel', {})
                title = meta.get('title', {}).get('content', '')
                if vid and title and not any(v['id'] == vid for v in videos):
                    videos.append({
                        "id": vid,
                        "title": title,
                        "url": f"https://www.youtube.com/watch?v={vid}",
                        "thumbnail": f"https://i.ytimg.com/vi/{vid}/hqdefault.jpg",
                        "published": "Latest Upload" if len(videos) == 0 else "Recent Video"
                    })
                    if len(videos) >= 6:
                        break

        # Fallback regex if lockupViewModel changed
        if not videos:
            vid_ids = re.findall(r'watch\?v=([a-zA-Z0-9_-]{11})', html)
            seen = set()
            for vid in vid_ids:
                if vid not in seen:
                    seen.add(vid)
                    videos.append({
                        "id": vid,
                        "title": f"Video {vid}",
                        "url": f"https://www.youtube.com/watch?v={vid}",
                        "thumbnail": f"https://i.ytimg.com/vi/{vid}/hqdefault.jpg",
                        "published": "Recent Video"
                    })
                    if len(videos) >= 3:
                        break

        if videos:
            os.makedirs(DATA_DIR, exist_ok=True)
            out_file = os.path.join(DATA_DIR, "youtube.json")
            with open(out_file, "w", encoding="utf-8") as f:
                json.dump(videos[:3], f, indent=2, ensure_ascii=False)
            print(f"Successfully saved {len(videos[:3])} YouTube videos to {out_file}")
            for i, v in enumerate(videos[:3]):
                print(f"  {i+1}. [{v['id']}] {v['title']}")
            return videos[:3]
        else:
            print("No YouTube videos found.")
    except Exception as e:
        print(f"Error fetching YouTube: {e}")
    return None


def sync_blogs():
    print("\n[2/2] Fetching latest blog posts from devopstryhard.com...")
    url = "https://devopstryhard.com/wp-json/wp/v2/posts?per_page=3&_embed=true"
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            posts = json.loads(resp.read().decode("utf-8"))

        blogs = []
        for p in posts:
            bid = p.get("id")
            title = p.get("title", {}).get("rendered", "")
            # Clean HTML entities from title
            title = title.replace("&#8217;", "'").replace("&amp;", "&").replace("&#8211;", "-").replace("&quot;", '"')
            link = p.get("link", "")
            date_raw = p.get("date", "")
            # Format date e.g. Sep 6, 2026
            date_str = date_raw[:10] if date_raw else ""
            
            media = p.get("_embedded", {}).get("wp:featuredmedia", [])
            img_url = media[0].get("source_url", "") if media and isinstance(media, list) else ""
            
            excerpt = p.get("excerpt", {}).get("rendered", "")
            excerpt = re.sub(r'<[^>]+>', '', excerpt).strip()
            excerpt = excerpt.replace("&#8217;", "'").replace("&amp;", "&").replace("&#8211;", "-").replace("&quot;", '"')

            blogs.append({
                "id": bid,
                "title": title,
                "url": link,
                "image": img_url,
                "date": date_str,
                "excerpt": excerpt[:140] + ("..." if len(excerpt) > 140 else "")
            })

        if blogs:
            os.makedirs(DATA_DIR, exist_ok=True)
            out_file = os.path.join(DATA_DIR, "blogs.json")
            with open(out_file, "w", encoding="utf-8") as f:
                json.dump(blogs[:3], f, indent=2, ensure_ascii=False)
            print(f"Successfully saved {len(blogs[:3])} blog posts to {out_file}")
            for i, b in enumerate(blogs[:3]):
                print(f"  {i+1}. [{b['id']}] {b['title']}")
            return blogs[:3]
    except Exception as e:
        print(f"Error fetching blogs: {e}")
    return None


if __name__ == "__main__":
    sync_youtube()
    sync_blogs()
    print("\nSync completed!")

