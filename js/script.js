$(document).ready(function() {
    'use strict';
    var h, update, s;
    function checkSize() { h = window.innerHeight; }
    checkSize();
    $(window).resize(checkSize);
    
    update = setInterval(function() {
        var d = new Date(), hours = d.getHours(), min = d.getMinutes();
        var suffix = hours >= 12 ? "PM" : "AM";
        hours = hours >= 12 ? hours - 12 : hours;
        hours = hours === 0 ? 12 : hours;
        min = min < 10 ? "0" + min : min;
        var list_days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var list_months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var dayName = list_days[d.getDay()], monthName = list_months[d.getMonth()], date = d.getDate();
        $('.charms-info .time').html(hours + ":" + min);
        $('.charms-info .date').html(dayName + "<br>" + monthName + " " + date);
    }, 500);

    function launchStartMenu() {
        $('.boot-screen').fadeOut('slow', function() {
            $('.logon-splash-screen').fadeIn('fast');
            $('.start-menu').fadeIn('fast', function() {
                $('.metro-ui-grid').addClass('activate-metro-ui-grid');
            });
            $(document).one('click keydown', function() {
                $('.logon-splash-screen').addClass('dismissed');
            });
            try {
                var audio = document.getElementById('windows-logon-audio');
                if (audio) {
                    var playPromise = audio.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(function() {
                            // Autoplay blocked: play on first user interaction instead
                            $(document).one('click keydown', function() {
                                audio.play();
                            });
                        });
                    }
                }
            } catch(e) {}
        });
    }

    s = setInterval(function() {
        if ($('body').hasClass('pace-done')) {
            clearInterval(s);
            launchStartMenu();
        }
    }, 50);

    setTimeout(function() {
        clearInterval(s);
        if ($('.boot-screen').is(':visible')) {
            launchStartMenu();
        }
    }, 1200);

    // Mouse wheel scroll handler for metro-ui
    $('.metro-ui').on('mousewheel DOMMouseScroll', function(e) {
        var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail;
        var scrollAmount = 100;
        
        if (delta > 0) {
            // Scroll up/left
            this.scrollLeft -= scrollAmount;
        } else {
            // Scroll down/right
            this.scrollLeft += scrollAmount;
        }
        
        e.preventDefault();
    });

    if ($.fn.sortable) {
        $('.metro-ui-grid').sortable({
            revert: 'invalid',
            start: function (e, ui) { $(ui.placeholder).hide(300); },
            change: function (e, ui) { $(ui.placeholder).hide().show(300); }
        });
        $('.metro-ui-grid').disableSelection();
    }

    $('.start-menu .user').click(function(e) {
        e.stopPropagation();
        $('.start-menu .user-menu-dropdown').toggleClass('show-user-menu-dropdown');
    });

    $('.user-menu-dropdown').mouseleave(function() {
        $('.start-menu .user-menu-dropdown').removeClass('show-user-menu-dropdown');
    });

    $('.user-menu-dropdown .lock, .user-menu-dropdown .signout').click(function(e) {
        e.stopPropagation();
        $('.start-menu .user-menu-dropdown').removeClass('show-user-menu-dropdown');
    });

    $('.charms-bar-activator-top, .charms-bar-activator-bottom, .charms-bar-activator-middle').mouseenter(function() {
        $('.charms-bar').show().delay(300).animate({right: '0px'}, 200);
    });

    $('.charms-bar').mouseleave(function() {
        $('.charms-bar').fadeOut(function() { $('.charms-bar').css({right: '-85px'}); });
        $('.charms-info').fadeOut('fast');
    });

    $('.charms-bar').mouseenter(function() { $('.charms-info').fadeIn('fast'); });
    $('.charms-bar .show-start-menu').click(function() { $('.app').fadeOut('fast'); $('.start-menu').fadeIn('fast'); });

    $('.desktop-activator').click(function() {
        $('.start-menu').fadeOut('slow');
    });

    function openApp(appSelector) {
        $('.app').removeClass('active').addClass('inactive').fadeOut(150);
        var $app = $(appSelector);
        if ($app.length) {
            $app.removeClass('inactive').addClass('active').css({'z-index': 25}).fadeIn(200);
        }
    }

    // Modal activator buttons (in tiles, headers, and modal dialogs)
    $(document).on('click', '.open-booking, .open-booking-btn', function(e) {
        e.preventDefault();
        e.stopPropagation();
        openApp('#booking-app');
    });

    $(document).on('click', '.open-services', function(e) {
        e.preventDefault();
        e.stopPropagation();
        openApp('#services-app');
    });

    $(document).on('click', '.open-casestudies', function(e) {
        e.preventDefault();
        e.stopPropagation();
        openApp('#casestudies-app');
    });

    $(document).on('click', '.open-credly', function(e) {
        e.preventDefault();
        e.stopPropagation();
        openApp('#credly-app');
    });

    $('.metro-ui-grid li').click(function(e) {
        var $tile = $(this);

        // 1. Check for freelance modal actions first
        if ($tile.hasClass('open-credly')) {
            openApp('#credly-app');
            return;
        }

        if ($tile.hasClass('open-booking') || $tile.hasClass('resume-tile')) {
            openApp('#booking-app');
            return;
        }

        if ($tile.hasClass('open-casestudies') || $tile.hasClass('service-cases')) {
            openApp('#casestudies-app');
            return;
        }

        if ($tile.hasClass('open-services') || $tile.hasClass('service-k8s') || $tile.hasClass('service-cloud') ||
            $tile.hasClass('service-iac') || $tile.hasClass('service-cicd') || $tile.hasClass('service-cost') ||
            $tile.closest('.grid-services').length || $tile.hasClass('tech-tile') || $tile.closest('.grid-tech').length) {
            openApp('#services-app');
            return;
        }

        // 2. Check if dynamic live feed tile or external link tile with a valid destination
        var rawUrl = $tile.attr('data-url') || $tile.find('a.tile-link').attr('href');
        if (rawUrl) {
            var trimmedUrl = rawUrl.trim().toLowerCase();
            if (trimmedUrl.startsWith('https://') || trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('mailto:')) {
                if (trimmedUrl.startsWith('mailto:')) {
                    window.location.href = rawUrl;
                } else {
                    window.open(rawUrl, '_blank', 'noopener,noreferrer');
                }
                return;
            }
        }

        // 3. Fallback tile text handlers
        var tileText = $tile.find('.text').text().trim().toLowerCase();
        console.log('Metro UI Grid Li Clicked - tileText:', tileText);
        
        if (tileText === 'about me' || $tile.hasClass('aboutme-tile')) {
            console.log('About Me tile clicked - redirecting to profile/');
            window.location.href = 'profile/';
        } else if (tileText === 'share') {
            console.log('Opening share app');
            openApp('#share');
        } else if (tileText === 'adobe brackets' || tileText === 'code' || tileText === 'front-end tools' || 
                   tileText === 'html5' || tileText === 'css3' || tileText === 'sass/scss' || 
                   tileText === 'normalize.css' || tileText === 'js/jquery/jquery ui' || tileText === 'ionicons') {
            console.log('Opening specifics app');
            openApp('#specifics');
        } else if (tileText === 'about') {
            console.log('Opening about app - tileText was:', tileText);
            openApp('#about');
        } else {
            console.log('Showing alert for tile:', tileText);
            $('.alert').fadeIn(200);
        }
    });

    $('.app .action-buttons .close:not(.disabled), .app .btn-ok').click(function() {
        $(this).closest('.app').fadeOut('fast');
    });

    $('.app .action-buttons .minimize:not(.disabled)').click(function() {
        $(this).closest('.app').fadeOut('fast');
    });

    $('.app .action-buttons .maximize:not(.disabled)').click(function() {
        var $app = $(this).closest('.app');
        $app.toggleClass('maximized-app');
        if ($app.hasClass('maximized-app')) {
            $app.css({'width': '96vw', 'height': '92vh', 'top': '4vh', 'left': '2vw'});
        } else {
            $app.css({'width': '', 'height': '', 'top': '', 'left': ''});
        }
    });

    if ($.fn.draggable) {
        $('.app').draggable({ handle: '.title' });
    }

    $('.app').click(function() {
        $('.app').addClass('inactive').removeClass('active').css({'z-index': '14'});
        $(this).removeClass('inactive').addClass('active').css({'z-index': '15'});
    });
});