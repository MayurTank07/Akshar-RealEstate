# Frontend Environment Setup Guide

## Environment Variables

The frontend uses Vite for building and requires environment variables prefixed with `VITE_`.

### Development Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Configure your `.env` file:
   ```env
   # For local development with production backend (Render)
   VITE_API_BASE_URL=https://akshar-realestate-backend.onrender.com/api
   VITE_APP_NAME=Akshar Real Estate
   VITE_ENV=development
   ```

   **OR** for local development with local backend:
   ```env
   VITE_API_BASE_URL=http://127.0.0.1:5001/api
   VITE_APP_NAME=Akshar Real Estate
   VITE_ENV=development
   ```

### Production Setup (Vercel)

The `.env.production` file is used for production builds. It's already configured to use the Render backend.

**Vercel Environment Variables:**

Go to your Vercel project settings and add:
- `VITE_API_BASE_URL`: `https://akshar-realestate-backend.onrender.com/api`
- `VITE_APP_NAME`: `Akshar Real Estate`
- `VITE_ENV`: `production`

## Running the Application

### Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Important Notes

- **Never commit `.env` files** - They are already gitignored
- The `.env.example` file should be committed as a template
- Environment variables are baked into the build at build time
- For Vercel deployments, set environment variables in the Vercel dashboard
- Changes to environment variables require a rebuild

## Deployment to Vercel

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy - Vercel will automatically use `.env.production` values during build

## Troubleshooting

### CORS Errors
- Ensure the backend CORS_ORIGIN includes your frontend URL
- Check that `VITE_API_BASE_URL` is correctly set

### API Connection Issues
- Verify `VITE_API_BASE_URL` points to the correct backend
- Check browser console for the actual API URL being used
- Ensure backend is running (for local development)
