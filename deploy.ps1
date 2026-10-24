# Deploy portfolio to AWS S3 & Invalidate CloudFront Cache
param(
    [Parameter(Mandatory=$true)]
    [string]$BucketName,

    [Parameter(Mandatory=$false)]
    [string]$DistributionId,

    [Parameter(Mandatory=$false)]
    [string]$Region = "us-east-1"
)

Write-Host "1. Running local feed sync (YouTube, Blogs, Credly)..." -ForegroundColor Cyan
python sync_feeds.py

Write-Host "2. Syncing static portfolio assets to s3://$BucketName..." -ForegroundColor Cyan
aws s3 sync . "s3://$BucketName" `
    --delete `
    --exclude ".git/*" `
    --exclude ".github/*" `
    --exclude "terraform/*" `
    --exclude ".kilo/*" `
    --exclude "*.py" `
    --exclude "__pycache__/*" `
    --exclude "README.md" `
    --exclude "LICENSE" `
    --exclude "stdout*" `
    --exclude "deploy.ps1" `
    --cache-control "public, max-age=3600" `
    --region "$Region"

Write-Host "3. Setting no-cache headers on index.html and JSON feeds..." -ForegroundColor Cyan
aws s3 cp index.html "s3://$BucketName/index.html" `
    --cache-control "public, max-age=0, must-revalidate" `
    --content-type "text/html" `
    --region "$Region"

aws s3 sync data/ "s3://$BucketName/data/" `
    --cache-control "public, max-age=60, must-revalidate" `
    --content-type "application/json" `
    --region "$Region"

if ($DistributionId) {
    Write-Host "4. Invalidating CloudFront cache for distribution $DistributionId..." -ForegroundColor Cyan
    aws cloudfront create-invalidation --distribution-id "$DistributionId" --paths "/*"
}

Write-Host "Deployment complete!" -ForegroundColor Green

