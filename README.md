# RealtySarv Enterprise Console - Installation & Local Setup Guide

English and Hindi instructions below to help you set up and run this full-stack application on your computer, and push it to GitHub!

---

## 🇮🇳 हिंदी में सेटअप गाइड (Hinglish Setup Guide)

Aapne jab ZIP file download ki hai, toh usme aapko `node_modules` folder nahi dikhega. Yeh bilkul **normal** hai! Kisi bhi professional code setup me files ka size chhota rakhne ke liye libraries (`node_modules`) ko ZIP me nahi bheja jata. Unhe hum ek command se download karte hain.

Yeh ek **Full-Stack Application** hai jisme do parts hain:
1. **Frontend (Vite + React):** Jo main folder `/` me hai.
2. **Backend Server (Express + TypeScript):** Jo `/server` folder ke andar hai.

Apne computer par ise chalane ke liye aur GitHub par push karne ke liye neeche diye gaye steps follow karein:

### Step 1: Frontend Dependencies Install aur Run Karein
1. Apne computer me terminal ya Command Prompt (CMD) kholein.
2. Project ke main folder (root directory) me jayein.
3. Yeh command chalayein:
   ```bash
   npm install
   ```
4. Frontend ko start karne ke liye yeh command chalayein:
   ```bash
   npm run dev
   ```
   *(Yeh aapka frontend port `3000` par start kar dega)*

### Step 2: Backend Server Dependencies Install aur Run Karein
1. Ek aur naya terminal/CMD tab kholein.
2. `/server` folder ke andar jayein:
   ```bash
   cd server
   ```
3. Backend dependencies install karne ke liye yeh command chalayein:
   ```bash
   npm install
   ```
4. `.env.example` file ko copy karke `.env` naam ki nayi file banayein, ya `.env.example` ke andar jo aapne Godaddy API keys dali hain unhe check karein.
5. Server ko start karne ke liye yeh command chalayein:
   ```bash
   npm run dev
   ```
   *(Yeh aapka server port `4000` par start kar dega jo GoDaddy API aur database dynamic integration handle karta hai)*

### Step 3: Project ko GitHub par kaise Push karein?
Apne code ko Git repository me push karne ke liye:
1. Apne GitHub account par ek nayi **Empty Repository** banayein.
2. Apne computer ke terminal me (main root directory par) ye commands chalayein:
   ```bash
   # Git initialize karein
   git init

   # Saari files ko add karein
   git add .

   # Commit message likhein
   git commit -m "Initial commit of RealtySarv Enterprise Console"

   # Apni branch ko main set karein
   git branch -M main

   # Apne GitHub repo ka URL yahan link karein (GitHub se copy karein)
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

   # Code ko push karein
   git push -u origin main
   ```

---

## 🇬🇧 English Setup & Run Guide

To keep the download size small and follow professional software standards, **dependency folders like `node_modules` are excluded from the ZIP file**. You generate them automatically using the setup commands below.

Since this is a full-stack application, you need to run both the **Frontend Client** and the **Backend Server**.

### Step 1: Setting up the Frontend (Vite + React)
1. Open a terminal in the root directory of the project.
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *This will run the user interface at `http://localhost:3000`.*

### Step 2: Setting up the Backend (Express + Node.js)
1. Open a second, separate terminal tab.
2. Navigate to the server folder:
   ```bash
   cd server
   ```
3. Install the server dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file from the `.env.example` template:
   ```bash
   cp .env.example .env
   ```
   *(Verify your `GODADDY_API_KEY` and `GODADDY_API_SECRET` are correctly configured inside this file).*
5. Start the backend server:
   ```bash
   npm run dev
   ```
   *The backend runs on port `4000` and handles domain routing integrations.*

### Step 3: Pushing the Code to GitHub
To store your code in a personal GitHub repository:
1. Create a new empty repository on your GitHub account.
2. Open your terminal in the root directory and run:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of RealtySarv Enterprise Console"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

Congratulations! Your dynamic multi-tenant workspace is fully set up and ready to deploy.
