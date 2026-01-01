# EC2 Deployment Guide

This guide covers deploying both the API and Admin Web frontend to a single EC2 instance.

## Prerequisites

- EC2 instance running Ubuntu or Amazon Linux
- Node.js 20+ installed
- PM2 installed globally: `npm install -g pm2`
- Nginx installed: `sudo apt-get install nginx` (Ubuntu) or `sudo yum install nginx` (Amazon Linux)

## Deployment Steps

### 1. Build the Application

On your local machine or CI/CD, build the project:

```bash
# Install dependencies
pnpm install

# Build shared packages first (order matters)
pnpm --filter @grow-fitness/shared-types build
pnpm --filter @grow-fitness/shared-schemas build

# Build API
pnpm --filter @grow-fitness/api build

# Build Admin Web frontend
pnpm --filter @grow-fitness/admin-web build
```

### 2. Transfer Files to EC2

Upload the entire project directory to your EC2 instance:

```bash
# From your local machine
scp -r . ec2-user@your-ec2-ip:/home/ec2-user/app/growfitness-2.0
```

Or use rsync for better efficiency:

```bash
rsync -avz --exclude 'node_modules' --exclude '.git' \
  . ec2-user@your-ec2-ip:/home/ec2-user/app/growfitness-2.0
```

### 3. Install Dependencies on EC2

SSH into your EC2 instance and install dependencies:

```bash
ssh ec2-user@your-ec2-ip
cd /home/ec2-user/app/growfitness-2.0

# Install pnpm if not already installed
npm install -g pnpm

# Install dependencies (production only)
pnpm install --prod --frozen-lockfile
```

### 4. Set Up Environment Variables

Create environment file for the API:

```bash
cd /home/ec2-user/app/growfitness-2.0/apps/api
cp .env.example .env  # If you have an example file
```

Edit `.env` with your production values:

```env
PORT=3000
NODE_ENV=production
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
CORS_ORIGIN=http://your-domain.com
# ... other required environment variables
```

### 5. Start the API with PM2

```bash
cd /home/ec2-user/app/growfitness-2.0/apps/api

# Start the API
pm2 start "node dist/main.js" --name grow-api

# Save PM2 configuration to restart on reboot
pm2 save
pm2 startup  # Follow the instructions to enable startup on boot
```

Check that the API is running:

```bash
pm2 logs grow-api
pm2 status
```

### 6. Configure Nginx

Copy the EC2 nginx configuration:

```bash
sudo cp /home/ec2-user/app/growfitness-2.0/deploy/nginx/ec2.conf /etc/nginx/sites-available/growfitness
sudo ln -s /etc/nginx/sites-available/growfitness /etc/nginx/sites-enabled/

# Remove default nginx site if it exists
sudo rm /etc/nginx/sites-enabled/default  # Ubuntu
# or
sudo rm /etc/nginx/conf.d/default.conf  # Amazon Linux
```

**Important**: Update the `root` path in `/etc/nginx/sites-available/growfitness` to match your actual deployment path if different from `/home/ec2-user/app/growfitness-2.0/apps/admin-web/dist`.

Test nginx configuration:

```bash
sudo nginx -t
```

If the test passes, reload nginx:

```bash
sudo systemctl reload nginx
# or
sudo service nginx reload
```

### 7. Configure Firewall (Security Group)

In AWS EC2 Security Group, allow:
- Port 80 (HTTP) - for nginx
- Port 443 (HTTPS) - if using SSL
- Port 22 (SSH) - for management

### 8. Set Up SSL (Optional but Recommended)

For production, set up SSL using Let's Encrypt:

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx  # Ubuntu
# or
sudo yum install certbot python3-certbot-nginx  # Amazon Linux

# Get certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal is set up automatically
```

Update nginx config to listen on port 443 and redirect HTTP to HTTPS.

## Verification

1. **Check API**: Visit `http://your-ec2-ip/api` or `http://your-domain.com/api`
2. **Check Frontend**: Visit `http://your-ec2-ip` or `http://your-domain.com`
3. **Check API Health**: Visit `http://your-ec2-ip/api/health` (if you have a health endpoint)
4. **Check Swagger**: Visit `http://your-ec2-ip/api/docs`

## Troubleshooting

### API Not Starting

1. Check PM2 logs: `pm2 logs grow-api`
2. Check environment variables are set correctly
3. Ensure MongoDB is accessible
4. Check port 3000 is not in use: `sudo lsof -i :3000`

### Nginx Not Serving Frontend

1. Check nginx error logs: `sudo tail -f /var/log/nginx/error.log`
2. Verify the frontend build exists: `ls -la /home/ec2-user/app/growfitness-2.0/apps/admin-web/dist`
3. Check nginx can read the files: `sudo nginx -t`

### 502 Bad Gateway

This usually means nginx can't connect to the API:
1. Check API is running: `pm2 status`
2. Check API logs: `pm2 logs grow-api`
3. Test API directly: `curl http://localhost:3000/api`

### Module System Errors

If you see "exports is not defined" errors:
1. Ensure shared packages are rebuilt: `pnpm --filter @grow-fitness/shared-types build`
2. Check package.json files don't have `"type": "module"` (they should be removed)
3. Rebuild the API: `pnpm --filter @grow-fitness/api build`

## Useful Commands

```bash
# View API logs
pm2 logs grow-api

# Restart API
pm2 restart grow-api

# Stop API
pm2 stop grow-api

# View nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Reload nginx
sudo systemctl reload nginx

# Check running processes
pm2 list
ps aux | grep node
```

## Directory Structure on EC2

```
/home/ec2-user/app/growfitness-2.0/
├── apps/
│   ├── api/
│   │   ├── dist/          # Compiled API code
│   │   ├── .env           # API environment variables
│   │   └── ...
│   └── admin-web/
│       └── dist/          # Frontend build output
├── packages/
│   ├── shared-types/
│   │   └── dist/          # Compiled shared types
│   └── shared-schemas/
│       └── dist/          # Compiled shared schemas
└── ...
```



