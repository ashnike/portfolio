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

    $(document).on('click', '.open-calc', function(e) {
        e.preventDefault();
        e.stopPropagation();
        openApp('#calc-app');
    });

    $(document).on('click', '.open-terminal', function(e) {
        e.preventDefault();
        e.stopPropagation();
        openApp('#terminal-app');
        setTimeout(function() {
            $('.terminal-cmd-input').focus();
        }, 200);
    });

    $('.metro-ui-grid li').click(function(e) {
        var $tile = $(this);

        // 1. Check for freelance modal actions first
        if ($tile.hasClass('open-credly')) {
            openApp('#credly-app');
            return;
        }

        if ($tile.hasClass('open-calc') || $tile.hasClass('service-calc')) {
            openApp('#calc-app');
            return;
        }

        if ($tile.hasClass('open-terminal') || $tile.hasClass('service-terminal')) {
            openApp('#terminal-app');
            setTimeout(function() {
                $('.terminal-cmd-input').focus();
            }, 200);
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

    // ===== 1. CLOUD COST SAVINGS CALCULATOR LOGIC =====
    function updateCloudCalculator() {
        var spend = parseFloat($('#cloud-spend-slider').val()) || 10000;
        var formattedSpend = '$' + spend.toLocaleString();
        $('#spend-display').text(formattedSpend + ' / mo');

        var totalRate = 0;
        $('.calc-vector:checked').each(function() {
            totalRate += parseFloat($(this).val()) || 0;
        });

        // Cap maximum savings rate realistically at 60%, min 10%
        if (totalRate > 0.60) totalRate = 0.60;
        if (totalRate < 0.10) totalRate = 0.10;

        var monthlySavings = Math.round(spend * totalRate);
        var annualSavings = monthlySavings * 12;
        var percentText = '~' + Math.round(totalRate * 100) + '% bill reduction';

        $('#savings-monthly').text('$' + monthlySavings.toLocaleString() + ' / mo');
        $('#savings-annual').text('$' + annualSavings.toLocaleString() + ' / yr');
        $('#savings-percent').text(percentText);
    }

    $(document).on('input change', '#cloud-spend-slider, .calc-vector', function() {
        updateCloudCalculator();
    });
    updateCloudCalculator();

    // ===== 2. INTERACTIVE PINAKAOPS CLI TERMINAL =====
    var cmdHistory = [];
    var historyIndex = -1;

    var TERMINAL_COMMANDS = {
        help: "Available Commands:\n  skills      - View DevOps, Cloud & IaC competencies\n  services    - View productized engineering sprints\n  calc        - Open interactive Cloud Cost Calculator\n  audit       - Book free 20-min Cloud & FinOps audit (TidyCal)\n  whoami      - Consultant profile & credentials\n  contact     - Email, WhatsApp, and LinkedIn info\n  github      - Live open-source repositories\n  clear       - Clear terminal window\n  exit        - Close terminal",
        skills: "Cloud & DevOps Stack:\n  [+] Cloud:        AWS (Organizations, VPC, IAM, EKS, Lambda), Google Cloud (GKE, VPC)\n  [+] Containers:   Docker, Kubernetes, Helm, ArgoCD (GitOps)\n  [+] IaC:          Terraform, OpenTofu, Ansible\n  [+] CI/CD:        GitHub Actions, GitLab CI, Jenkins\n  [+] Observability:Prometheus, Grafana, CloudWatch, Loki\n  [+] FinOps:       fck-nat, Graviton3 migration, Spot automation, Karpenter\n  [+] Scripting:    Bash, Python, PowerShell",
        services: "Productized Sprints & Retainers:\n  1. FinOps & Cloud Cost Sprint (3-5 Days) - Guaranteed 30-60% bill cut\n  2. Production Kubernetes & GitOps (1-2 Weeks) - Turnkey EKS/GKE cluster\n  3. CI/CD Modernization (3-5 Days) - 10x faster deploys with GitHub Actions\n  4. Fractional DevOps Retainer (Monthly) - 15-25 hrs/mo senior SRE support",
        whoami: "Ashnil Naik - Senior Freelance DevOps & Cloud Solutions Architect\nSpecialist in FinOps (Cloud Cost Reduction) and Kubernetes Platform Engineering.\nCredly: 15 Verified Digital Credentials (AWS + Google Cloud)\nLocation: Global Remote",
        contact: "Get in Touch:\n  Email:    contact@pinakaops.io\n  WhatsApp: +91 82750 24922 (https://wa.me/918275024922)\n  TidyCal:  https://tidycal.com/ashnilnaik777\n  LinkedIn: https://www.linkedin.com/in/ashnilnaik\n  GitHub:   https://github.com/ashnike",
        github: "Active Repositories:\n  - VotingApp-spring-deploy  (Java SpringBoot & K8s deploy)\n  - Mobaxterm_installation   (Automated Ubuntu bash setup)\n  - portfolio                (Windows 8 Metro UI Cloud Portfolio)\n  - nest-hello               (NestJS TypeScript backend service)",
        calc: "Opening Cloud Cost Savings Calculator...",
        audit: "Opening TidyCal to schedule your free 20-min Cloud Architecture & FinOps Audit..."
    };

    function escapeTerminal(text) {
        return $('<div>').text(text).html();
    }

    $(document).on('keydown', '.terminal-cmd-input', function(e) {
        if (e.which === 13) { // Enter key
            var rawInput = $(this).val();
            var cmd = rawInput.trim().toLowerCase();
            $(this).val('');

            if (!cmd) return;

            cmdHistory.push(rawInput);
            historyIndex = cmdHistory.length;

            var $history = $('.terminal-history');
            $history.append('<div style="margin-top: 6px;"><span style="color: #00ff88; font-weight: bold;">pinakaops:~$</span> <span style="color: #ffffff;">' + escapeTerminal(rawInput) + '</span></div>');

            if (cmd === 'clear') {
                $history.empty();
            } else if (cmd === 'exit') {
                $('#terminal-app').fadeOut('fast');
            } else if (cmd === 'calc') {
                $history.append('<div style="color: #3bffc6; margin: 4px 0;">' + TERMINAL_COMMANDS.calc + '</div>');
                openApp('#calc-app');
            } else if (cmd === 'audit' || cmd === 'book') {
                $history.append('<div style="color: #ffd43b; margin: 4px 0;">' + TERMINAL_COMMANDS.audit + '</div>');
                window.open('https://tidycal.com/ashnilnaik777', '_blank', 'noopener,noreferrer');
            } else if (TERMINAL_COMMANDS[cmd]) {
                var responseHtml = escapeTerminal(TERMINAL_COMMANDS[cmd]).replace(/\n/g, '<br>');
                $history.append('<div style="color: #e0e0e0; margin: 4px 0 8px 0; font-family: inherit;">' + responseHtml + '</div>');
            } else {
                $history.append('<div style="color: #ff6b6b; margin: 4px 0;">Command not found: \'' + escapeTerminal(cmd) + '\'. Type <span style="color: #00ff88;">\'help\'</span> for available commands.</div>');
            }

            var container = $('.terminal-container')[0];
            if (container) {
                container.scrollTop = container.scrollHeight;
            }
        } else if (e.which === 38) { // Arrow Up (History Prev)
            if (historyIndex > 0) {
                historyIndex--;
                $(this).val(cmdHistory[historyIndex]);
            }
            e.preventDefault();
        } else if (e.which === 40) { // Arrow Down (History Next)
            if (historyIndex < cmdHistory.length - 1) {
                historyIndex++;
                $(this).val(cmdHistory[historyIndex]);
            } else {
                historyIndex = cmdHistory.length;
                $(this).val('');
            }
            e.preventDefault();
        }
    });

    $(document).on('click', '.terminal-container', function() {
        $('.terminal-cmd-input').focus();
    });

    // ===== 3. CLIENT TESTIMONIALS ROTATOR =====
    var testimonials = [
        { quote: '"Saved us 42% on AWS in 3 weeks"', author: '• Alex M., VP of Engineering' },
        { quote: '"Zero-downtime migration of 14 services to EKS"', author: '• Sarah T., CTO & Co-Founder' },
        { quote: '"Replaced NAT gateways, saving $3,800/mo"', author: '• David K., Head of Infra' },
        { quote: '"Deploy times cut from 45 min to 3.8 min"', author: '• Priya R., Lead DevOps Architect' }
    ];
    var currentTestimonialIdx = 0;
    setInterval(function() {
        if ($('.testimonial-quote').length) {
            currentTestimonialIdx = (currentTestimonialIdx + 1) % testimonials.length;
            var t = testimonials[currentTestimonialIdx];
            $('.testimonial-quote').fadeOut(250, function() {
                $(this).text(t.quote).fadeIn(250);
            });
            $('.testimonial-author').fadeOut(250, function() {
                $(this).text(t.author).fadeIn(250);
            });
        }
    }, 4500);
});