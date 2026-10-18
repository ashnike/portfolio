$(function () {
    // Update status bar time
    function updateTime() {
        const now = new Date();
        $('#current-time').text(now.toUTCString().replace('GMT', 'UTC'));
    }
    updateTime();
    setInterval(updateTime, 1000);

    // ASCII Banner
    const BANNER = `
[[b;#89b4fa;] ____ ___ _   _    _    _  __    _    ___  ____  ____  ]
[[b;#89b4fa;]|  _ \\_ _| \\ | |  / \\  | |/ /   / \\  / _ \\|  _ \\/ ___| ]
[[b;#89b4fa;]| |_) | ||  \\| | / _ \\ | ' /   / _ \\| | | | |_) \\___ \\ ]
[[b;#89b4fa;]|  __/| || |\\  |/ ___ \\| . \\  / ___ \\ |_| |  __/ ___) |]
[[b;#89b4fa;]|_|  |___|_| \\_/_/   \\_\\_|\\_\\/_/   \\_\\___/|_|   |____/ ]

[[;rgba(255,255,255,0.7);]╔══════════════════════════════════════════════════════════════════╗]
[[;rgba(255,255,255,0.7);]║] [[b;#a6e3a1;]Cloud Infrastructure & DevOps Engineer Portfolio]                 [[;rgba(255,255,255,0.7);]║]
[[;rgba(255,255,255,0.7);]║] AWS • Kubernetes • Terraform • Docker • CI/CD • Observability   [[;rgba(255,255,255,0.7);]║]
[[;rgba(255,255,255,0.7);]╚══════════════════════════════════════════════════════════════════╝]

Type [[b;#94e2d5;]'help'] to inspect all commands or [[b;#94e2d5;]'summary'] for a quick tour.
`;

    // Data models
    const COMMAND_LIST = [
        'help', 'about', 'skills', 'projects', 'certs', 'experience', 
        'contact', 'kubectl', 'docker', 'deploy', 'system', 'theme', 
        'summary', 'whoami', 'date', 'clear'
    ];

    const commands = {
        help: function() {
            this.echo(`
[[b;#89b4fa;]AVAILABLE COMMANDS:]

[[b;#f9e2af;]── Portfolio ──────────────────────────────────────────]
  [[b;#94e2d5;]about]        - Learn about my background and philosophy
  [[b;#94e2d5;]skills]       - View my tech stack & proficiency breakdown
  [[b;#94e2d5;]experience]   - Professional work history & achievements
  [[b;#94e2d5;]projects]     - Key DevOps, Cloud & IaC showcase projects
  [[b;#94e2d5;]certs]        - Industry certifications (AWS, CKA, HashiCorp)
  [[b;#94e2d5;]contact]      - Get in touch via Email, GitHub & LinkedIn
  [[b;#94e2d5;]summary]      - One-page quick executive overview

[[b;#f9e2af;]── Cloud & DevOps Sandbox ─────────────────────────────]
  [[b;#94e2d5;]kubectl]      - Simulate kubectl CLI (e.g. [[i;#cdd6f4;]kubectl get pods])
  [[b;#94e2d5;]docker]       - Simulate Docker commands (e.g. [[i;#cdd6f4;]docker ps])
  [[b;#94e2d5;]deploy]       - Run a live GitOps CI/CD pipeline simulation
  [[b;#94e2d5;]system]       - Display host architecture & cluster neofetch

[[b;#f9e2af;]── Utilities ──────────────────────────────────────────]
  [[b;#94e2d5;]theme]        - Switch themes: [[i;#cdd6f4;]theme catppuccin | matrix | dracula]
  [[b;#94e2d5;]whoami]       - View current authenticated user
  [[b;#94e2d5;]date]         - Print UTC date & server timestamp
  [[b;#94e2d5;]clear]        - Clear the terminal screen
`);
        },

        about: function() {
            this.echo(`
[[b;#a6e3a1;]## ABOUT ME]
I am a [[b;#89b4fa;]DevOps & Cloud Engineer] dedicated to building scalable, resilient, and 
automated cloud-native platforms. My core focus is bridging the gap between development 
and operations using Infrastructure as Code (IaC), GitOps pipelines, and microservice orchestration.

[[b;#f9e2af;]Highlights:]
  • [[b;#cdd6f4;]Focus Areas:] Multi-Cloud (AWS), Kubernetes Orchestration, Zero-Downtime CI/CD.
  • [[b;#cdd6f4;]Philosophy:] "Automate everything twice, measure everything once, treat infra as code."
  • [[b;#cdd6f4;]Specialties:] High Availability Architectures, Cost Optimization, SRE & Observability.
  • [[b;#cdd6f4;]Location:] Remote / Global.

Run [[b;#94e2d5;]'skills'] or [[b;#94e2d5;]'projects'] to see my toolchains and implementations.
`);
        },

        skills: function() {
            this.echo(`
[[b;#a6e3a1;]## TECHNICAL SKILLS & TOOLING]

[[b;#89b4fa;]Cloud & Virtualization]
  • AWS (EKS, ECS, VPC, IAM, S3, RDS, CloudWatch, Lambda, Route53) [██████████░] 92%
  • Google Cloud Platform (GKE, Cloud Run, IAM)                     [████████░░] 78%

[[b;#89b4fa;]Containers & Orchestration]
  • Kubernetes (Helm, Ingress-NGINX, Cilium, RBAC, Operators)       [█████████░] 90%
  • Docker / containerd / Podman (Multi-stage builds, Distroless)   [██████████] 95%

[[b;#89b4fa;]Infrastructure as Code & Config Mgmt]
  • Terraform / OpenTofu (Custom Modules, Terragrunt, State locks)  [██████████] 94%
  • Ansible (Playbooks, Vault, Rolling updates)                     [████████░░] 82%

[[b;#89b4fa;]CI/CD & GitOps]
  • GitHub Actions, GitLab CI, ArgoCD, FluxCD, Jenkins              [█████████░] 90%

[[b;#89b4fa;]Observability & Reliability]
  • Prometheus, Grafana, Alertmanager, OpenTelemetry, Datadog      [█████████░] 88%

[[b;#89b4fa;]Languages & Scripting]
  • Bash / Shell, Python (Boto3, Automation), Golang, YAML/HCL       [█████████░] 86%
`);
        },

        experience: function() {
            this.echo(`
[[b;#a6e3a1;]## WORK EXPERIENCE]

[[b;#89b4fa;]Senior DevOps / Platform Engineer] @ CloudScale Technologies
[[i;#6c7086;]2023 - Present]
  • Architected an enterprise-grade AWS EKS platform hosting 120+ microservices.
  • Cut deployment lead time by 65% by standardizing GitHub Actions & ArgoCD GitOps workflows.
  • Reduced AWS monthly spend by 30% via Graviton instances, Karpenter auto-scaling, and spot nodes.

[[b;#89b4fa;]DevOps / Cloud Engineer] @ Apex Digital Systems
[[i;#6c7086;]2021 - 2023]
  • Maintained Terraform modules across staging, sandbox, and multi-region production.
  • Implemented centralized log aggregation and APM with Prometheus, Loki, and Grafana.
  • Led migration of on-prem monolithic workloads into containerized Kubernetes clusters with 99.99% uptime.
`);
        },

        projects: function() {
            this.echo(`
[[b;#a6e3a1;]## FEATURED PROJECTS]

1. [[b;#89b4fa;]Enterprise GitOps with ArgoCD & EKS]
   [[i;#f9e2af;]Tech:] AWS EKS, ArgoCD, Helm, GitHub Actions, Terraform
   Fully automated GitOps pipeline managing multiple Kubernetes clusters across 
   environments with automated rollbacks and canary deployments using Argo Rollouts.

2. [[b;#89b4fa;]Terraform AWS Landing Zone & Multi-Account Architecture]
   [[i;#f9e2af;]Tech:] Terraform, AWS Organizations, Control Tower, GuardDuty, Transit Gateway
   Production-ready automated landing zone with security baselines, centralized VPC 
   networking, SSO, and audit logging.

3. [[b;#89b4fa;]Production Observability Stack (LGTM)]
   [[i;#f9e2af;]Tech:] Prometheus, Grafana, Loki, Tempo, OpenTelemetry
   End-to-end distributed tracing, log indexing, and SLO/SLA tracking dashboards 
   configured dynamically using Kubernetes Custom Resource Definitions (CRDs).

4. [[b;#89b4fa;]Zero-Trust Kubernetes Security Framework]
   [[i;#f9e2af;]Tech:] Cilium CNI, Kyverno, Trivy, Cosign
   Container image signing, vulnerability gating in CI, and eBPF-powered network policies.
`);
        },

        certs: function() {
            this.echo(`
[[b;#a6e3a1;]## CERTIFICATIONS & CREDENTIALS]

  ✔ [[b;#f9e2af;]AWS Certified Solutions Architect – Professional]
  ✔ [[b;#f9e2af;]Certified Kubernetes Administrator (CKA)] - Linux Foundation
  ✔ [[b;#f9e2af;]Certified Kubernetes Application Developer (CKAD)]
  ✔ [[b;#f9e2af;]HashiCorp Certified: Terraform Associate]
`);
        },

        contact: function() {
            this.echo(`
[[b;#a6e3a1;]## GET IN TOUCH]

  • [[b;#89b4fa;]Email:]     [[!url;mailto:contact@pinakaops.io;]contact@pinakaops.io]
  • [[b;#89b4fa;]GitHub:]    [[!url;https://github.com;]github.com/pinakaops]
  • [[b;#89b4fa;]LinkedIn:]  [[!url;https://linkedin.com;]linkedin.com/in/pinakaops]
  • [[b;#89b4fa;]Twitter:]   [[!url;https://twitter.com;]@pinakaops]

Feel free to reach out for platform consulting, cloud architecture, or hiring inquiries!
`);
        },

        summary: function() {
            this.echo(`
[[b;#89b4fa;]── QUICK EXECUTIVE SUMMARY ──────────────────────────]
• [[b;#a6e3a1;]Role:] DevOps / Cloud Infrastructure Architect
• [[b;#a6e3a1;]Core:] AWS, Kubernetes, Terraform, ArgoCD, Docker
• [[b;#a6e3a1;]Certifications:] AWS SAP, CKA, HashiCorp Terraform Associate
• [[b;#a6e3a1;]Status:] Available for platform engineering opportunities
• [[b;#a6e3a1;]Contact:] contact@pinakaops.io
───────────────────────────────────────────────────────
`);
        },

        whoami: function() {
            this.echo('ash - platform-engineer @ pinakaops-infra (permissions: cluster-admin)');
        },

        date: function() {
            this.echo(new Date().toUTCString());
        },

        system: function() {
            this.echo(`
[[b;#89b4fa;]         _nnnn_]         [[b;#a6e3a1;]ash@pinakaops-prod-node-01]
[[b;#89b4fa;]        dGGGGMMb]        ------------------------------
[[b;#89b4fa;]       @p~qp~~qMb]       [[b;#94e2d5;]OS:] Pinaka Linux (Cloud-Native Edition)
[[b;#89b4fa;]       M|@||@) M|]       [[b;#94e2d5;]Kernel:] 6.8.4-cloud-generic
[[b;#89b4fa;]       @,----.JM|]       [[b;#94e2d5;]Uptime:] 142 days, 18 hours, 32 mins
[[b;#89b4fa;]      (( \\ -- / ))]      [[b;#94e2d5;]Cluster:] k8s-prod-us-east-1 (v1.30.2)
[[b;#89b4fa;]       \\\\___//]         [[b;#94e2d5;]Nodes:] 18 (AWS m6i.2xlarge + Graviton3)
[[b;#89b4fa;]        ||  ||]         [[b;#94e2d5;]Pods Running:] 247/250 (Healthy)
[[b;#89b4fa;]                          Shell:] bash 5.2.21
                                 [[b;#94e2d5;]Memory:] 42.1 GiB / 128 GiB used
`);
        },

        kubectl: function(...args) {
            const sub = args.join(' ').trim();
            if (!sub || sub === 'help') {
                this.echo(`Available simulated subcommands:
  kubectl get pods
  kubectl get nodes
  kubectl get services`);
                return;
            }

            if (sub === 'get pods') {
                this.echo(`
NAME                                    READY   STATUS    RESTARTS   AGE
auth-service-7d6f58994-x7z1a            1/1     Running   0          18d
frontend-web-54cbdf846-9kj8q            1/1     Running   0          4d
api-gateway-8f89c4db-w2qlm              2/2     Running   0          12d
payment-processor-68fdcb5d7b-pl01n      1/1     Running   0          8d
argocd-server-58c745bd-m7vb2            1/1     Running   0          42d
prometheus-k8s-0                        2/2     Running   0          42d
`);
            } else if (sub === 'get nodes') {
                this.echo(`
NAME                                        STATUS   ROLES           AGE   VERSION
ip-10-0-12-44.ec2.internal (us-east-1a)     Ready    control-plane   85d   v1.30.2
ip-10-0-24-110.ec2.internal (us-east-1b)    Ready    node            85d   v1.30.2
ip-10-0-36-89.ec2.internal (us-east-1c)     Ready    node            85d   v1.30.2
`);
            } else if (sub === 'get svc' || sub === 'get services') {
                this.echo(`
NAME             TYPE           CLUSTER-IP       EXTERNAL-IP                               PORT(S)
kubernetes       ClusterIP      172.20.0.1       <none>                                    443/TCP
ingress-nginx    LoadBalancer   172.20.14.88     a8f93...us-east-1.elb.amazonaws.com       80:31245/TCP,443:32411/TCP
api-gateway      ClusterIP      172.20.89.123    <none>                                    8080/TCP
`);
            } else {
                this.error(`kubectl: command or resource not simulated: "${sub}". Try: 'kubectl get pods' or 'kubectl get nodes'`);
            }
        },

        docker: function(...args) {
            const sub = args.join(' ').trim();
            if (sub === 'ps' || sub === 'container ls') {
                this.echo(`
CONTAINER ID   IMAGE                          COMMAND                  CREATED        STATUS        PORTS                    NAMES
3a8c1f90de2b   pinakaops/api-service:v2.4.0   "/entrypoint.sh run"     3 hours ago    Up 3 hours    0.0.0.0:8080->8080/tcp   api-service
e4b77134aa10   redis:7-alpine                 "docker-entrypoint.s…"   2 days ago     Up 2 days     0.0.0.0:6379->6379/tcp   redis-cache
c990fe21bd04   envoyproxy/envoy:v1.29         "/docker-entrypoint…"    2 days ago     Up 2 days     0.0.0.0:443->443/tcp     edge-proxy
`);
            } else if (!sub || sub === 'help') {
                this.echo(`Available simulated subcommands:
  docker ps`);
            } else {
                this.error(`docker: "${sub}" is not supported in simulation. Try: 'docker ps'`);
            }
        },

        deploy: function() {
            const term = this;
            term.pause();
            term.echo('[[b;#f9e2af;][PIPELINE STARTED] Triggering GitOps pipeline for production...]');
            
            const steps = [
                { msg: '✔ [1/5] Validating Terraform manifests and Linting HCL...', delay: 600 },
                { msg: '✔ [2/5] Running SAST & Container security scan with Trivy (0 vulnerabilities)...', delay: 700 },
                { msg: '✔ [3/5] Building and tagging multi-arch image (AWS ECR push)...', delay: 800 },
                { msg: '✔ [4/5] Committing git release sha to deployment repo (GitOps trigger)...', delay: 600 },
                { msg: '✔ [5/5] ArgoCD synchronized! Rollout healthy on k8s-prod-us-east-1.', delay: 700 },
                { msg: '[[b;#a6e3a1;]🎉 DEPLOYMENT SUCCESSFUL: Zero downtime observed.]', delay: 300 }
            ];

            let index = 0;
            function runNext() {
                if (index < steps.length) {
                    const current = steps[index++];
                    setTimeout(() => {
                        term.echo(current.msg);
                        runNext();
                    }, current.delay);
                } else {
                    term.resume();
                }
            }
            runNext();
        },

        theme: function(name) {
            if (!name) {
                this.echo('Available themes: catppuccin, matrix, dracula. Example: [[b;#94e2d5;]theme matrix]');
                return;
            }
            name = name.toLowerCase();
            if (['catppuccin', 'matrix', 'dracula'].includes(name)) {
                $('body').removeClass('theme-catppuccin theme-matrix theme-dracula');
                $('body').addClass('theme-' + name);
                this.echo(`Theme switched to [[b;#94e2d5;]${name}]`);
            } else {
                this.error(`Unknown theme: ${name}. Available: catppuccin, matrix, dracula`);
            }
        },

        clear: function() {
            this.clear();
        }
    };

    // Terminal initialization
    const term = $('#terminal').terminal(commands, {
        greetings: BANNER,
        prompt: '[[b;#89b4fa;]ash@pinakaops][[;rgba(255,255,255,0.7);]:][[b;#f9e2af;]~/infra][[;rgba(255,255,255,0.7);]$] ',
        name: 'pinakaops-terminal',
        height: '100%',
        width: '100%',
        cursor: true,
        completion: function(string) {
            return COMMAND_LIST.filter(cmd => cmd.startsWith(string));
        },
        onInit: function(terminal) {
            terminal.focus();
        }
    });

    // Focus on window click
    $('.terminal-window').on('click', function() {
        term.focus();
    });
});