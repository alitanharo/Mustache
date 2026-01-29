# Mustache Frontend

React + Vite frontend for the Mustache social networking app.

## ⚙️ Requirements

- Node.js 16+
- npm

## 🚀 Development

```bash
cd frontend
npm install
npm run dev
```

The app runs on http://localhost:8080 and expects the backend at http://localhost:5000.

## 🧰 Build for Production

```bash
npm run build
npm run preview
```

The production build outputs to `dist/`.

## 🔧 Configuration

- Update the backend URL in `src/lib/api.ts` if you deploy the API elsewhere.
- Ensure CORS in the backend allows your deployed frontend origin.

## 🧩 Tech Stack

- React 18
- Vite
- TypeScript
- Tailwind CSS
- shadcn/ui
