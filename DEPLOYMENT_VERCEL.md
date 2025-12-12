# 🚀 Deploying SaloneVest to Vercel

This guide explains how to deploy both the **Frontend** and **Backend** of SaloneVest to Vercel.

> [!WARNING]
> **Important Limitation**: Vercel Serverless Functions do **NOT** support persistent WebSocket connections (`socket.io`).  
> The backend deployment instructions below will enable the REST API to work on Vercel, but **real-time features (like live updates) will likely fail**.
> 
> **Recommended Alternative for Backend**: Deploy the `backend` folder to **Render**, **Railway**, or **Heroku**, which support persistent servers.

---

## 📦 Project Structure

We will deploy this as a **Monorepo** on Vercel, creating two separate Vercel Projects linked to the same GitHub repository:

1.  **Frontend Project**: Deploys the `frontend` folder (Next.js)
2.  **Backend Project**: Deploys the `backend` folder (Express API)

---

## 1️⃣ Deploying the Frontend

1.  **Push your code** to GitHub/GitLab/Bitbucket.
2.  Log in to [Vercel](https://vercel.com) and click **"Add New..." -> "Project"**.
3.  Import your repository (`SaloneVest`).
4.  **Configure Project**:
    *   **Project Name**: `salonevest-frontend`
    *   **Framework Preset**: Next.js
    *   **Root Directory**: Click "Edit" and select `frontend`.
5.  **Environment Variables**:
    *   Add the following (update values as needed):
        *   `NEXT_PUBLIC_API_URL`: `https://salonevest-backend.vercel.app/api` (You will get this URL *after* deploying the backend, use placeholder for now)
        *   `NEXT_PUBLIC_SOLANA_NETWORK`: `devnet`
        *   `NEXT_PUBLIC_SOLANA_RPC_URL`: `https://api.devnet.solana.com`
        *   `NEXT_PUBLIC_USDC_MINT`: `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v` (or Devnet equivalent)
        *   `NEXT_PUBLIC_PROGRAM_ID`: (Your deployed program ID)
6.  Click **Deploy**.

---

## 2️⃣ Deploying the Backend (Vercel Adapter)

> **Note**: I have added `backend/api/index.ts` and `backend/vercel.json` to make your Express app compatible with Vercel Serverless.

1.  Go to Vercel Dashboard and click **"Add New..." -> "Project"** (again).
2.  Import the **SAME** repository (`SaloneVest`).
3.  **Configure Project**:
    *   **Project Name**: `salonevest-backend`
    *   **Framework Preset**: Other
    *   **Root Directory**: Click "Edit" and select `backend`.
4.  **Environment Variables**:
    *   `MONGODB_URI`: (Your MongoDB Connection String)
    *   `JWT_SECRET`: (Your Secret Key)
    *   `FRONTEND_URL`: `https://salonevest-frontend.vercel.app` (Your frontend URL)
    *   `SOLANA_NETWORK`: `devnet`
    *   `SOLANA_RPC_URL`: `https://api.devnet.solana.com`
    *   `PROGRAM_ID`: (Your deployed program ID)
5.  Click **Deploy**.

---

## 3️⃣ Final Configuration

1.  Once Backend is deployed, copy its URL (e.g., `https://salonevest-backend.vercel.app`).
2.  Go back to your **Frontend Project** settings on Vercel.
3.  Update the `NEXT_PUBLIC_API_URL` environment variable with the backend URL.
    *   **Important**: Ensure you append `/api` if your backend routes require it, or just the base URL depending on your frontend logic.
    *   *Backend routes are served at `/api/...` in the code, but the Vercel rewrite maps everything.*
    *   The `vercel.json` rewrite maps `/(.*)` to the handler.
4.  Redeploy the Frontend.

---

## ⚠️ Known Issues on Vercel Backend

*   **Socket.IO**: Real-time updates for investments/portfolio will not work because Vercel kills the connection.
*   **Cold Starts**: The API might be slow on the first request after inactivity.
*   **Timeouts**: Vercel functions have a 10-60s timeout limit. Long running tasks (like blockchain syncing) might fail.

**For a Full-Feature Backend:**
Deploy the `backend` directory to **Render.com**:
1.  Connect GitHub repo.
2.  Root Directory: `backend`.
3.  Build Command: `npm install && npm run build`.
4.  Start Command: `npm start`.
5.  This supports WebSockets and Background Jobs!
