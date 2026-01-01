# Quick Guide: Accessing the API on EC2

## Option 1: Quick Test (Temporary - Direct Access)

### Step 1: Open Port 3000 in Security Group

1. Go to AWS EC2 Console → Security Groups
2. Select your EC2 instance's security group
3. Click "Edit inbound rules"
4. Add rule:
   - Type: Custom TCP
   - Port: 3000
   - Source: Your IP (or 0.0.0.0/0 for testing only - **NOT recommended for production**)

### Step 2: Access the API

- API Base: `http://your-ec2-public-ip:3000/api`
- Swagger Docs: `http://your-ec2-public-ip:3000/api/docs`

**⚠️ Remember to close port 3000 after testing for security!**

---

## Option 2: Recommended - Via Nginx (Production Ready)

### Step 1: Install Nginx (if not already installed)

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install nginx -y

# Amazon Linux
sudo yum install nginx -y
```

### Step 2: Copy Nginx Configuration

```bash
sudo cp /home/ec2-user/app/growfitness-2.0/deploy/nginx/ec2.conf /etc/nginx/sites-available/growfitness
sudo ln -s /etc/nginx/sites-available/growfitness /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default  # Ubuntu
# OR
sudo rm /etc/nginx/conf.d/default.conf  # Amazon Linux (RHEL/CentOS)
```

**Note**: If you haven't built the frontend yet, you can temporarily comment out the `root` and `location /` sections, or create a simple test:

```bash
# Create a simple test directory
sudo mkdir -p /home/ec2-user/app/growfitness-2.0/apps/admin-web/dist
echo "API Proxy Test" | sudo tee /home/ec2-user/app/growfitness-2.0/apps/admin-web/dist/index.html
```

### Step 3: Test and Start Nginx

```bash
# Test configuration
sudo nginx -t

# If test passes, start/reload nginx
sudo systemctl start nginx      # Start nginx
sudo systemctl enable nginx     # Enable on boot
sudo systemctl reload nginx     # Reload configuration
```

### Step 4: Configure Security Group

Open port 80 (HTTP) in your EC2 Security Group:
- Type: HTTP
- Port: 80
- Source: 0.0.0.0/0 (or restrict to specific IPs)

### Step 5: Access the API

- API Base: `http://your-ec2-public-ip/api`
- Swagger Docs: `http://your-ec2-public-ip/api/docs`

---

## Option 3: SSH Tunnel (For Testing Only)

If you want to test without opening ports:

```bash
# On your local machine
ssh -L 3000:localhost:3000 ec2-user@your-ec2-public-ip
```

Then access: `http://localhost:3000/api` on your local machine

---

## Find Your EC2 Public IP

```bash
# On EC2 instance
curl http://169.254.169.254/latest/meta-data/public-ipv4

# Or check AWS Console → EC2 → Instances → Your Instance → Public IPv4 address
```

---

## Test the API

### Using curl:

```bash
# Health check (if you have one)
curl http://your-ec2-ip/api/health

# Or test via localhost on the EC2 instance
curl http://localhost:3000/api
```

### Using Browser:

- Visit: `http://your-ec2-ip/api/docs` for Swagger UI
- Or: `http://your-ec2-ip:3000/api/docs` (if using direct access)

---

## Troubleshooting

### Nginx 502 Bad Gateway

- Check API is running: `pm2 status`
- Check API logs: `pm2 logs grow-api`
- Test API directly: `curl http://localhost:3000/api`

### Permission Denied

- Ensure nginx can read files: `sudo chmod -R 755 /home/ec2-user/app/growfitness-2.0/apps/admin-web/dist`
- Check nginx user: `sudo cat /etc/nginx/nginx.conf | grep user`

### Port Already in Use

- Check if nginx is already running: `sudo systemctl status nginx`
- Check port 80: `sudo lsof -i :80`
- Check port 3000: `sudo lsof -i :3000`



