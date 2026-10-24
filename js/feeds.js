/**
 * feeds.js
 * Dynamic feed loader for PinakaOps YouTube Channel and DevOpsTryHard Blog
 */

(function($) {
    'use strict';

    var CONFIG = {
        youtubeChannelUrl: 'https://www.youtube.com/@pinakaops',
        blogSiteUrl: 'https://devopstryhard.com/',
        blogApiUrl: 'https://devopstryhard.com/wp-json/wp/v2/posts?per_page=3&_embed=true',
        localYoutubeApi: '/api/youtube',
        localBlogApi: '/api/blogs',
        staticYoutubeData: 'data/youtube.json',
        staticBlogData: 'data/blogs.json'
    };

    // Helper: Format ISO date string to readable "Month Day, Year"
    function formatDate(dateStr) {
        if (!dateStr) return '';
        try {
            var d = new Date(dateStr);
            if (isNaN(d.getTime())) return dateStr;
            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
        } catch (e) {
            return dateStr;
        }
    }

    // Helper: Clean HTML entities
    function decodeHtml(html) {
        var txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }

    // Render YouTube Tiles
    function renderYouTubeTiles(videos) {
        if (!videos || !videos.length) return;

        $('.youtube-feed-tile').each(function(index) {
            var video = videos[index];
            if (!video) return;

            var $tile = $(this);
            var title = decodeHtml(video.title || 'Latest Video');
            var url = video.url || ('https://www.youtube.com/watch?v=' + video.id);
            var thumb = video.thumbnail || ('https://i.ytimg.com/vi/' + video.id + '/hqdefault.jpg');
            var isHero = $tile.hasClass('tile-hero');

            $tile.attr('data-url', url);
            $tile.find('a.tile-link').attr('href', url);

            // Update background image
            $tile.find('.tile-bg').css('background-image', 'url("' + thumb + '")');

            // Update title
            $tile.find('.tile-title').text(title).attr('title', title);

            // Update badge / time
            if (video.published) {
                $tile.find('.tile-date').text(video.published);
            }

            $tile.addClass('feed-loaded');
        });

        try {
            localStorage.setItem('pinakaops_yt_cache', JSON.stringify(videos));
        } catch (e) {}
    }

    // Render Blog Tiles
    function renderBlogTiles(blogs) {
        if (!blogs || !blogs.length) return;

        $('.blog-feed-tile').each(function(index) {
            var blog = blogs[index];
            if (!blog) return;

            var $tile = $(this);
            var title = decodeHtml(blog.title || 'Latest Blog Post');
            var url = blog.url || blog.link || CONFIG.blogSiteUrl;
            var img = blog.image || '';
            var date = formatDate(blog.date);

            $tile.attr('data-url', url);
            $tile.find('a.tile-link').attr('href', url);

            if (img) {
                $tile.find('.tile-bg').css('background-image', 'url("' + img + '")').show();
            }

            $tile.find('.tile-title').text(title).attr('title', title);
            if (date) {
                $tile.find('.tile-date').html('<i class="ionicons ion-calendar"></i> ' + date);
            }

            $tile.addClass('feed-loaded');
        });

        try {
            localStorage.setItem('pinakaops_blog_cache', JSON.stringify(blogs));
        } catch (e) {}
    }

    // Fetch YouTube Feed
    function fetchYouTubeVideos() {
        // 1. Try local server API
        fetch(CONFIG.localYoutubeApi, { cache: 'no-store' })
            .then(function(res) {
                if (!res.ok) throw new Error('Local API unavailable');
                return res.json();
            })
            .then(function(data) {
                if (data && data.length) {
                    renderYouTubeTiles(data);
                } else {
                    throw new Error('Empty data');
                }
            })
            .catch(function() {
                // 2. Fallback to static JSON
                fetch(CONFIG.staticYoutubeData + '?t=' + Date.now())
                    .then(function(res) { return res.json(); })
                    .then(function(data) {
                        renderYouTubeTiles(data);
                    })
                    .catch(function(err) {
                        console.warn('Could not load YouTube feed from static JSON:', err);
                    });
            });
    }

    // Fetch Blog Posts from DevOpsTryHard
    function fetchBlogPosts() {
        // 1. Try direct WordPress REST API (has native CORS)
        fetch(CONFIG.blogApiUrl)
            .then(function(res) {
                if (!res.ok) throw new Error('WP API error');
                return res.json();
            })
            .then(function(posts) {
                if (!posts || !posts.length) throw new Error('No posts returned');
                var blogs = posts.slice(0, 3).map(function(p) {
                    var media = p._embedded && p._embedded['wp:featuredmedia'];
                    var imgUrl = (media && media[0] && media[0].source_url) ? media[0].source_url : '';
                    return {
                        id: p.id,
                        title: p.title ? p.title.rendered : '',
                        url: p.link || CONFIG.blogSiteUrl,
                        image: imgUrl,
                        date: p.date
                    };
                });
                renderBlogTiles(blogs);
            })
            .catch(function(err) {
                console.log('Direct WP API failed, trying fallback...', err);
                // 2. Fallback to local server API or static JSON
                fetch(CONFIG.localBlogApi)
                    .then(function(res) { return res.json(); })
                    .then(function(data) {
                        renderBlogTiles(data);
                    })
                    .catch(function() {
                        fetch(CONFIG.staticBlogData + '?t=' + Date.now())
                            .then(function(res) { return res.json(); })
                            .then(function(data) {
                                renderBlogTiles(data);
                            })
                            .catch(function(err2) {
                                console.warn('Could not load blog feed:', err2);
                            });
                    });
            });
    }

    // Initialize cached feeds immediately for instant display
    function initCachedFeeds() {
        try {
            var ytCache = localStorage.getItem('pinakaops_yt_cache');
            if (ytCache) {
                renderYouTubeTiles(JSON.parse(ytCache));
            }
            var blogCache = localStorage.getItem('pinakaops_blog_cache');
            if (blogCache) {
                renderBlogTiles(JSON.parse(blogCache));
            }
        } catch (e) {}
    }

    // Document Ready setup
    $(document).ready(function() {
        initCachedFeeds();
        fetchYouTubeVideos();
        fetchBlogPosts();

        // Handle tile clicks for dynamic feed tiles
        $(document).on('click', '.youtube-feed-tile, .blog-feed-tile', function(e) {
            e.stopPropagation();
            var url = $(this).attr('data-url') || $(this).find('a.tile-link').attr('href');
            if (url) {
                window.open(url, '_blank', 'noopener,noreferrer');
            }
        });

        // Periodic live refresh every 5 minutes if page stays open
        setInterval(function() {
            fetchYouTubeVideos();
            fetchBlogPosts();
        }, 5 * 60 * 1000);
    });

})(jQuery);

