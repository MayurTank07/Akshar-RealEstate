# Akshar Real Estate — Frontend

React + Vite single-page application for Akshar Estate — a Gujarat-focused real estate advisory platform.

## Tech Stack

- **React 18** with React Router v6
- **Vite** build tool
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Axios** for API communication

## Key Features

- **Advanced Property Search** — smart natural-language parsing (BHK, city, type, deal mode), ranked results grouped into *Exact Matches / Similar Properties / In Other Cities*, live suggestions dropdown with recent and popular searches
- **Property Listings** — buy / rent / commercial with advanced filter sidebar (price range, area, BHK, property type)
- **Google OAuth** login and registration
- **Wishlist / Saved Properties** — persisted via backend user account
- **Admin Workspace** — property management, owner applications, enquiries, user management
- **Owner Portal** — submit and track property listing requests
- **CMS-driven content** — hero section, navbar areas, and site settings editable from admin

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Create `Frontend/.env.local` from `Frontend/.env.example`:

```bash
cp .env.example .env.local
```

Fill in the required variables:

| Variable | Required | Description |
|---|---|---|
| `VITE_API_BASE_URL` | ✅ | Backend API URL, e.g. `http://127.0.0.1:5000/api` |
| `VITE_GOOGLE_CLIENT_ID` | Optional | OAuth Web Client ID — Google button disabled if blank |
| `VITE_GOOGLE_MAPS_API_KEY` | Optional | Places autocomplete for location picker |
| `VITE_WHATSAPP_NUMBER` | Optional | Fallback WhatsApp contact number |
| `VITE_APP_NAME` | Optional | Displayed app name (default: Akshar Real Estate) |

3. Start Vite:

```bash
npm run dev
```

The default port is `5173`. Vite prints the actual URL if the port is already busy.

4. Useful checks:

```bash
npm run lint      # ESLint
npm run build     # production build to dist/
npm run preview   # preview the production build locally
```

## Security Notes

- **Never commit `.env` or `.env.local`** — they are in `.gitignore`.
- Only commit `.env.example` with placeholder values.
- `VITE_GOOGLE_CLIENT_ID` is a public key but should still be set per-environment to prevent OAuth misuse.
