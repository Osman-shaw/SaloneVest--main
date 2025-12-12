# 🚀 Deploying SaloneVest Backend to Render

Deploying the backend to **Render** is recommended because it supports **WebSockets** (required for real-time investment updates), which Vercel Serverless does not.

## 📋 Prerequisites

1.  Your code must be pushed to a GitHub/GitLab repository.
2.  You need a [Render.com](https://render.com) account.

## 🛠️ Option 1: Zero-Config Deployment (Recommended)

I have created a `render.yaml` file in your repository. This allows you to use **Blueprints** for one-click configuration.

1.  **Push your code** (including `render.yaml`) to GitHub.
2.  Go to the [Render Dashboard](https://dashboard.render.com/).
3.  Click **New +** and select **Blueprint**.
4.  Connect your `SaloneVest` repository.
5.  Render will automatically detect the `salonevest-backend` service configuration from `render.yaml`.
6.  **Environment Variables**: You will be prompted to enter the missing values:
    *   `MONGODB_URI`: Your MongoDB connection string.
    *   `JWT_SECRET`: A secure random string.
    *   `FRONTEND_URL`: Your Vercel Frontend URL (e.g., `https://salonevest-frontend.vercel.app`).
    *   `PROGRAM_ID`: Your deployed Solana program ID.
7.  Click **Apply**. Render will deploy your backend.

---

## 🛠️ Option 2: Manual Setup

If you prefer to configure it manually without the `render.yaml` file:

1.  Go to [Render Dashboard](https://dashboard.render.com/).
2.  Click **New +** -> **Web Service**.
3.  Connect your repository.
4.  **Settings**:
    *   **Name**: `salonevest-backend`
    *   **Root Directory**: `backend`
    *   **Runtime**: Node
    *   **Build Command**: `npm install && npm run build`
    *   **Start Command**: `npm start`
5.  **Environment Variables** (Add these):
    *   `NODE_ENV`: `production`
    *   `MONGODB_URI`: ...
    *   `JWT_SECRET`: ...
    *   `FRONTEND_URL`: ...
    *   `SOLANA_NETWORK`: `devnet`
    *   `SOLANA_RPC_URL`: `https://api.devnet.solana.com`
    *   `PROGRAM_ID`: ...

---

## 🔗 Final Step: Update Frontend

Once deployed, Render will give you a URL (e.g., `https://salonevest-backend.onrender.com`).

1.  Go back to your local terminal.
2.  Update the Vercel Frontend environment variable to point to the **Render** backend instead of the Vercel backend:
    ```powershell
    cd frontend
    npx vercel env add NEXT_PUBLIC_API_URL
    # Enter value: https://salonevest-backend.onrender.com
    # Select: Production, Preview, Development
    ```
3.  Redeploy the frontend:
    ```powershell
    npx vercel deploy --prod
    ```

✅ Now your frontend (Vercel) will talk to your backend (Render), enabling full WebSocket support!
