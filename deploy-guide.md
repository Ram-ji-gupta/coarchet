# WoolCraft Studio — Complete Deployment Guide

---

## YOUR LOCAL CREDENTIALS (From .env)
- MySQL User: `root`
- MySQL Password: `rAmjig861@`
- MySQL Database: `woolcraft`
- JWT Secret: `change_this_to_a_strong_secret_key_in_production_123!@#$`

---

## 1. Export Your XAMPP MySQL Database

### Option 1: Using XAMPP MySQL Console (No phpMyAdmin)

Follow these steps if you only have the MySQL console:

1. **Open Command Prompt as Administrator**
   - Press `Win + X` and select "Windows Terminal (Admin)" or "Command Prompt (Admin)"

2. **Navigate to XAMPP MySQL bin folder**:
   ```cmd
   cd C:\xampp\mysql\bin
   ```
   (Adjust path if XAMPP is installed elsewhere)

3. **Export your database**:
   ```cmd
   mysqldump -u root -prAmjig861@ woolcraft > woolcraft-database.sql
   ```

4. Your database is now saved as `woolcraft-database.sql` in `C:\xampp\mysql\bin`—copy this to your project folder!

### Option 2: Using phpMyAdmin

If you have phpMyAdmin:
1. Open `http://localhost/phpmyadmin`
2. Select your database `woolcraft`
3. Click **Export**
4. Choose "Quick" export method, format "SQL"
5. Click **Go** and save as `woolcraft-database.sql`

---

## 2. Prepare Your Project for Deployment

1. **Create a Git repository** (GitHub, GitLab, etc.)
2. **Make sure `.gitignore` includes these**:
   ```
   node_modules/
   backend/node_modules/
   backend/.env
   backend/uploads/
   build/
   *.log
   .DS_Store
   ```
3. **Commit your code** and push to your Git repository

---

## 3. Choose a Hosting Solution

### Recommended Option 1: Free/Cheap (Vercel + Render + PlanetScale)
- **Frontend**: Vercel (Free)
- **Backend**: Render (Free tier available)
- **Database**: PlanetScale (Free tier for MySQL-compatible database)

### Recommended Option 2: Shared Hosting (CPanel)
- Providers: Hostinger, Bluehost, GoDaddy, etc.
- Includes PHP, MySQL, and cPanel for easy management

---

## 4. Deployment Guide — Option 1 (Vercel + Render + PlanetScale)

### Part 1: Deploy Frontend to Vercel
1. Go to https://vercel.com and sign up
2. Click "Add New Project" → Import your Git repository
3. Configure:
   - Root Directory: (leave as root)
   - Build Command: `npm run build`
   - Output Directory: `build`
4. Click "Deploy"!
5. Once deployed, you'll get a frontend URL like `https://your-project.vercel.app`

### Part 2: Set Up Database on PlanetScale
1. Go to https://planetscale.com, sign up, and create a new database
2. In PlanetScale dashboard:
   - Click "Connect" → Get your credentials (host, user, password, database name)
   - Click "Import" → Upload your `woolcraft-database.sql` file
3. Save your PlanetScale credentials for later

### Part 3: Deploy Backend to Render
1. Go to https://render.com, sign up
2. Click "New" → "Web Service"
3. Import your Git repository
4. Configure:
   - Root Directory: `backend`
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add Environment Variables (in Render dashboard, under "Environment"):
   ```
   PORT=10000
   DB_HOST=your-planetscale-host
   DB_USER=your-planetscale-user
   DB_PASSWORD=your-planetscale-password
   DB_NAME=your-planetscale-database
   JWT_SECRET=your-strong-jwt-secret-key-here
   ```
6. Click "Create Web Service"!
7. Once deployed, you'll get a backend URL like `https://your-project.onrender.com`

### Part 4: Update Frontend to Use Production Backend
- Open `js/config.js` and change `API_BASE` to your Render backend URL:
  ```javascript
  API_BASE: "https://your-project.onrender.com"
  ```

### Part 5: Update CORS in Backend
- Open `backend/server.js` and update the CORS origin to your Vercel frontend URL:
  ```javascript
  const corsOptions = {
    origin: ["https://your-project.vercel.app"], // Add your frontend URL here
    optionsSuccessStatus: 200
  };
  ```
- Commit and push this change—Vercel will auto-redeploy!

---

## 5. Deployment Guide — Option 2 (CPanel Hosting)

### Step 1: Upload Files to CPanel
1. Log in to your hosting account's cPanel
2. Open **File Manager**
3. Go to `public_html`
4. Upload your frontend files (or upload the `build/` folder contents)
5. Create a new folder (e.g., `api` or `backend`) in `public_html`
6. Upload your backend files to this new folder

### Step 2: Import Database to CPanel
1. In cPanel, go to **MySQL Databases**
2. Create a new database and user
3. Assign the user to the database with ALL PRIVILEGES
4. Go to **phpMyAdmin** in cPanel
5. Select your new database → Click **Import** → Upload `woolcraft-database.sql`

### Step 3: Configure Backend in CPanel
1. Update `backend/.env` with your cPanel MySQL credentials
2. In cPanel, go to **Terminal** or use SSH:
   ```bash
   cd api  # or whatever your backend folder is called
   npm install
   npm install -g pm2
   pm2 start server.js
   pm2 startup  # To make it auto-start on server reboot
   pm2 save
   ```

### Step 4: Update Frontend API URL
- Open `js/config.js` and change `API_BASE` to your backend URL:
  ```javascript
  API_BASE: "https://yourdomain.com/api"
  ```

---

## 6. Production Checklist

✅ Update API URLs in frontend
✅ Use a strong JWT_SECRET
✅ Enable HTTPS (SSL)
✅ Update CORS allowed origins
✅ Configure environment variables
✅ Test all features after deployment
✅ Disable debugging features
✅ Set proper file permissions

---

## 7. Need Help?

- Check your hosting provider's documentation
- If something breaks, check server logs!
