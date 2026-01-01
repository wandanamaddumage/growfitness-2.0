# Frontend Deployment Guide (API Gateway Setup)

This guide shows how to deploy the admin-web frontend to EC2 and configure it to work with your API Gateway.

## Your Current Setup

- **API Gateway URL**: `https://k05jtur8ml.execute-api.us-east-1.amazonaws.com/api`
- **API Docs**: `https://k05jtur8ml.execute-api.us-east-1.amazonaws.com/api/docs`

## Deployment Steps

### Step 1: Build Frontend with API Gateway URL

On your local machine or EC2, build the frontend with the API Gateway URL:

```bash
cd /home/ec2-user/app/growfitness-2.0/apps/admin-web

# Build with API Gateway URL as the API base
VITE_API_BASE_URL=https://k05jtur8ml.execute-api.us-east-1.amazonaws.com/api pnpm build

# Or export it first (Linux/Mac)
export VITE_API_BASE_URL=https://k05jtur8ml.execute-api.us-east-1.amazonaws.com/api
pnpm build
```

This creates the production build in `apps/admin-web/dist/`.

### Step 2: Install Nginx (if not already installed)

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install nginx -y

# Amazon Linux
sudo yum install nginx -y
```

### Step 3: Copy Frontend Build to Web Directory

```bash
# Option A: Serve from the project directory (recommended)
sudo mkdir -p /var/www/growfitness-admin
sudo cp -r /home/ec2-user/app/growfitness-2.0/apps/admin-web/dist/* /var/www/growfitness-admin/
sudo chown -R www-data:www-data /var/www/growfitness-admin  # Ubuntu
# OR
sudo chown -R nginx:nginx /var/www/growfitness-admin  # Amazon Linux

# Option B: Serve directly from project directory (simpler)
# Just ensure nginx can read the files
sudo chmod -R 755 /home/ec2-user/app/growfitness-2.0/apps/admin-web/dist
```

### Step 4: Create Nginx Configuration

Create `/etc/nginx/sites-available/growfitness-admin`:

```nginx
server {
    listen 80;
    server_name _;  # Replace with your domain or EC2 public IP

    # Root directory for frontend
    root /var/www/growfitness-admin;  # Or /home/ec2-user/app/growfitness-2.0/apps/admin-web/dist
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss 
               application/json application/javascript;

    # Serve static assets with cache headers
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    # SPA fallback - serve index.html for all routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

Enable the site:

```bash
# Ubuntu/Debian
sudo ln -s /etc/nginx/sites-available/growfitness-admin /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default  # Remove default

# Amazon Linux (RHEL/CentOS)
sudo cp /etc/nginx/sites-available/growfitness-admin /etc/nginx/conf.d/growfitness-admin.conf
sudo rm /etc/nginx/conf.d/default.conf
```

### Step 5: Test and Start Nginx

```bash
# Test configuration
sudo nginx -t

# If test passes, start/reload nginx
sudo systemctl start nginx
sudo systemctl enable nginx
sudo systemctl reload nginx
```

### Step 6: Configure Security Group

Open port 80 (HTTP) in your EC2 Security Group:
- Type: HTTP
- Port: 80
- Source: 0.0.0.0/0 (or restrict to specific IPs)

### Step 7: Access Your Frontend

- **Frontend**: `http://YOUR_EC2_PUBLIC_IP`
- **API**: `https://k05jtur8ml.execute-api.us-east-1.amazonaws.com/api`
- **API Docs**: `https://k05jtur8ml.execute-api.us-east-1.amazonaws.com/api/docs`

## Using a Custom Domain (Optional)

If you want to use a custom domain instead of the EC2 IP:

### Option A: Frontend on Custom Domain, API on API Gateway

1. Point your domain to EC2's public IP (A record in Route 53)
2. Update nginx `server_name` with your domain
3. Frontend is already configured to use API Gateway URL

### Option B: Both on Same Domain (Recommended)

1. Use API Gateway custom domain feature
2. Configure API Gateway to use your domain
3. Use CloudFront + S3 for frontend, or serve from EC2 with nginx
4. Use Route 53 to route:
   - `yourdomain.com` → Frontend (EC2 or CloudFront)
   - `api.yourdomain.com` → API Gateway custom domain

## SSL/HTTPS Setup (Recommended)

Use Let's Encrypt for free SSL:

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx  # Ubuntu
# OR
sudo yum install certbot python3-certbot-nginx  # Amazon Linux

# Get certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal is set up automatically
```

## Troubleshooting

### Frontend Shows Blank Page

1. Check browser console for errors
2. Verify API URL is correct in build: `grep -r "k05jtur8ml" /var/www/growfitness-admin`
3. Check CORS settings in API Gateway
4. Check nginx error logs: `sudo tail -f /var/log/nginx/error.log`

### API Calls Fail (CORS Errors)

Ensure API Gateway has CORS enabled for your frontend domain:
- In API Gateway console → Select your API → Actions → Enable CORS
- Add your frontend domain to allowed origins

### 404 Errors on Page Refresh

This is normal for SPAs - the nginx config should handle this with the `try_files` directive. Verify it's configured correctly.

### Permission Denied

```bash
# Fix permissions
sudo chown -R www-data:www-data /var/www/growfitness-admin  # Ubuntu
sudo chmod -R 755 /var/www/growfitness-admin
```

## Quick Build Script

Create a build script at `/home/ec2-user/app/growfitness-2.0/deploy/build-frontend.sh`:

```bash
#!/bin/bash
cd /home/ec2-user/app/growfitness-2.0/apps/admin-web
export VITE_API_BASE_URL=https://k05jtur8ml.execute-api.us-east-1.amazonaws.com/api
pnpm build
sudo cp -r dist/* /var/www/growfitness-admin/
sudo systemctl reload nginx
echo "Frontend deployed successfully!"
```

Make it executable:
```bash
chmod +x /home/ec2-user/app/growfitness-2.0/deploy/build-frontend.sh
```

