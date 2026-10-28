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
        githubUserUrl: 'https://github.com/ashnike',
        githubApiUrl: 'https://api.github.com/users/ashnike/repos?sort=updated&per_page=8',
        whatsappUrl: 'https://wa.me/918275024922',
        localYoutubeApi: '/api/youtube',
        localBlogApi: '/api/blogs',
        staticYoutubeData: 'data/youtube.json',
        staticBlogData: 'data/blogs.json'
    };

    var currentGhIdx = 0;
    var ghProjects = [
        { name: 'VotingApp-spring-deploy', desc: 'Java SpringBoot Voting Application & Deploy', lang: 'Java', url: 'https://github.com/ashnike/VotingApp-spring-deploy' },
        { name: 'Mobaxterm_installation', desc: 'Automated MobaXterm Ubuntu Setup Script', lang: 'Shell', url: 'https://github.com/ashnike/Mobaxterm_installation' },
        { name: 'portfolio', desc: 'Windows Web 8 Metro UI Portfolio', lang: 'JavaScript', url: 'https://github.com/ashnike/portfolio' },
        { name: 'nest-hello', desc: 'NestJS TypeScript Backend Service', lang: 'TypeScript', url: 'https://github.com/ashnike/nest-hello' }
    ];

    var currentCredlyIdx = 0;
    var credlyBadges = [
        { name: 'AWS Certified Cloud', desc: 'Amazon Web Services \u2022 Practitioner', url: 'https://www.credly.com/org/amazon-web-services/badge/aws-certified-cloud-practitioner' },
        { name: 'GCP Kubernetes Apps', desc: 'Google Cloud \u2022 Deploy Applications', url: 'https://www.credly.com/org/google-cloud/badge/deploy-kubernetes-applications-on-google-cloud-skil' },
        { name: 'AWS Cloud Economics', desc: 'AWS Partner Network \u2022 FinOps', url: 'https://www.credly.com/org/amazon-web-services/badge/aws-partner-cloud-economics-essentials-training-bad' },
        { name: 'AWS Technical Partner', desc: 'AWS Partner Network \u2022 Accredited', url: 'https://www.credly.com/org/amazon-web-services/badge/aws-partner-technical-accredited-training-badge' },
        { name: 'GCP DevOps Workflows', desc: 'Google Cloud \u2022 Verified Skill', url: 'https://www.credly.com/org/google-cloud/badge/implement-devops-workflows-in-google-cloud-skill-badge' },
        { name: 'Secure Cloud Network', desc: 'Google Cloud \u2022 Security & VPC', url: 'https://www.credly.com/org/google-cloud/badge/build-a-secure-google-cloud-network-skill-badge' }
    ];

    // Helper: HTML escape special characters to prevent XSS
    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // Helper: Validate safe URL protocol
    function isSafeUrl(url) {
        if (!url || typeof url !== 'string') return false;
        var trimmed = url.trim().toLowerCase();
        return trimmed.startsWith('https://') || trimmed.startsWith('http://') || trimmed.startsWith('mailto:');
    }

    function updateCredlyTile(badge) {
        var $tile = $('.credly-tile');
        if (!$tile.length || !badge) return;
        var $rotator = $tile.find('.credly-badge-rotator');
        $rotator.css({ opacity: 0, transform: 'translateY(5px)' });
        setTimeout(function() {
            var url = badge.url || 'https://www.credly.com/users/ashnil-naik.b57d135a/badges';
            if (isSafeUrl(url)) {
                $tile.attr('data-url', url);
                $tile.find('a.tile-link').attr('href', url);
            }
            $tile.find('.credly-badge-title').text(badge.name || '');
            $tile.find('.credly-badge-desc').text(badge.desc || '');
            $rotator.css({ opacity: 1, transform: 'translateY(0)' });
        }, 200);
    }

    function updateGhTile(project) {
        var $tile = $('.github-tile');
        if (!$tile.length || !project) return;
        var $info = $tile.find('.gh-project-info');
        $info.css({ opacity: 0, transform: 'translateY(5px)' });
        setTimeout(function() {
            var url = project.url || project.html_url || CONFIG.githubUserUrl;
            if (isSafeUrl(url)) {
                $tile.attr('data-url', url);
                $tile.find('a.tile-link').attr('href', url);
            }
            $tile.find('.gh-project-title').text(project.name || '');
            var lang = escapeHtml(project.lang || project.language || '');
            var desc = escapeHtml(project.desc || project.description || '');
            var subtitle = lang ? ('<i class="ionicons ion-code-working"></i> ' + lang + (desc ? ' &bull; ' + desc : '')) : (desc || 'View Repository');
            $tile.find('.gh-project-desc').html(subtitle);
            $info.css({ opacity: 1, transform: 'translateY(0)' });
        }, 200);
    }

    function fetchGitHubProjects() {
        fetch(CONFIG.githubApiUrl)
            .then(function(res) {
                if (!res.ok) throw new Error('GitHub API unavailable');
                return res.json();
            })
            .then(function(repos) {
                if (repos && repos.length) {
                    var list = repos.map(function(r) {
                        return {
                            name: r.name,
                            desc: r.description || '',
                            lang: r.language || '',
                            url: r.html_url
                        };
                    });
                    ghProjects = list;
                    updateGhTile(ghProjects[0]);
                    try {
                        localStorage.setItem('ashnike_gh_cache', JSON.stringify(list));
                    } catch (e) {}
                }
            })
            .catch(function() {
                try {
                    var cached = localStorage.getItem('ashnike_gh_cache');
                    if (cached) {
                        ghProjects = JSON.parse(cached);
                        updateGhTile(ghProjects[0]);
                    }
                } catch (e) {}
            });
    }

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

            if (isSafeUrl(url)) {
                $tile.attr('data-url', url);
                $tile.find('a.tile-link').attr('href', url);
            }

            if (img && isSafeUrl(img)) {
                $tile.find('.tile-bg').css('background-image', 'url("' + encodeURI(img) + '")').show();
            }

            $tile.find('.tile-title').text(title).attr('title', title);
            if (date) {
                $tile.find('.tile-date').html('<i class="ionicons ion-calendar"></i> ' + escapeHtml(date));
            }

            $tile.addClass('feed-loaded');
        });

        try {
            localStorage.setItem('pinakaops_blog_cache', JSON.stringify(blogs));
        } catch (e) {}
    }

    // Fetch YouTube Feed
    function fetchYouTubeVideos() {
        var isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

        // 1. In local dev, query local server API first
        if (isLocal) {
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
                    loadStaticYouTubeData();
                });
        } else {
            // In production (static S3/CloudFront), load static JSON feed directly
            loadStaticYouTubeData();
        }
    }

    function loadStaticYouTubeData() {
        fetch(CONFIG.staticYoutubeData + '?t=' + Date.now())
            .then(function(res) { return res.json(); })
            .then(function(data) {
                renderYouTubeTiles(data);
            })
            .catch(function(err) {
                console.warn('Could not load YouTube feed from static JSON:', err);
            });
    }

    // Fetch Blog Posts from DevOpsTryHard
    function fetchBlogPosts() {
        var isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

        // 1. In local dev, query local server API first
        if (isLocal) {
            fetch(CONFIG.localBlogApi, { cache: 'no-store' })
                .then(function(res) {
                    if (!res.ok) throw new Error('Local API unavailable');
                    return res.json();
                })
                .then(function(data) {
                    if (data && data.length) {
                        renderBlogTiles(data);
                    } else {
                        throw new Error('Empty data');
                    }
                })
                .catch(function() {
                    loadStaticBlogData();
                });
        } else {
            // In production (static S3/CloudFront), load static JSON cache directly
            loadStaticBlogData();
        }
    }

    function loadStaticBlogData() {
        fetch(CONFIG.staticBlogData + '?t=' + Date.now())
            .then(function(res) { return res.json(); })
            .then(function(data) {
                if (data && data.length) {
                    renderBlogTiles(data);
                } else {
                    throw new Error('Empty static cache');
                }
            })
            .catch(function() {
                // 3. Fallback to direct WordPress REST API (when origin matches)
                fetch(CONFIG.blogApiUrl)
                    .then(function(res) {
                        if (!res.ok) throw new Error('WP API error');
                        return res.json();
                    })
                    .then(function(posts) {
                        if (!posts || !posts.length) return;
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
                        console.warn('Could not load blog feed:', err);
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
        fetchGitHubProjects();
        updateGhTile(ghProjects[0]);
        updateCredlyTile(credlyBadges[0]);

        // Rotate GitHub projects every 4 seconds
        setInterval(function() {
            if (ghProjects.length > 1) {
                currentGhIdx = (currentGhIdx + 1) % ghProjects.length;
                updateGhTile(ghProjects[currentGhIdx]);
            }
        }, 4000);

        // Rotate Credly badges every 3.5 seconds
        setInterval(function() {
            if (credlyBadges.length > 1) {
                currentCredlyIdx = (currentCredlyIdx + 1) % credlyBadges.length;
                updateCredlyTile(credlyBadges[currentCredlyIdx]);
            }
        }, 3500);

        // Handle tile clicks for dynamic feed tiles & social contact tiles
        $(document).on('click', '.youtube-feed-tile, .blog-feed-tile, .github-tile, .whatsapp-tile, .email-tile, .linkedin-tile, .aws-cert-tile, .gcp-k8s-tile, .aws-partner-tile, .booking-tile, .tidycal-tile', function(e) {
            e.stopPropagation();
            var url = $(this).attr('data-url') || $(this).find('a.tile-link').attr('href');
            if (isSafeUrl(url)) {
                if (url.trim().toLowerCase().startsWith('mailto:')) {
                    window.location.href = url;
                } else {
                    window.open(url, '_blank', 'noopener,noreferrer');
                }
            }
        });

        // Periodic live refresh every 5 minutes if page stays open
        setInterval(function() {
            fetchYouTubeVideos();
            fetchBlogPosts();
            fetchGitHubProjects();
        }, 5 * 60 * 1000);
    });

})(jQuery);

