# App Store — Full Stack (EAS-Ready)

A professional-grade App Store built with **Express + JSON File Store** and a **React Native (Expo)** app.

---

## 🛠️ Build & Run (EAS Troubleshooting)

### 1. Fix: "Git command not found"
EAS CLI normally requires Git. If you don't have it installed, use this command to build:

**On Windows (CMD):**
```bash
set EAS_NO_VCS=1 && eas build --platform android --profile preview
```

**On Windows (PowerShell):**
```powershell
$env:EAS_NO_VCS=1; eas build --platform android --profile preview
```

### 2. Run Locally (Testing)
```bash
# Backend
cd backend && npm run dev

# Frontend
cd frontend && npm start
```

---

## 🚀 Key Features

### Backend
- **JSON File Store**: Zero-dependency local storage.
- **Auto-screening**: Toxicity/Safety scan via TensorFlow.

### Frontend
- **Design**: Premium Dark Mode (#0F0F1A).
- **Auth**: Automatic secure session restore.

---

## 🔐 Credits
Created by Antigravity AI.
