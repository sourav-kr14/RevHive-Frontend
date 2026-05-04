# 🎨 RevHive Frontend

Frontend for **RevHive**, a modern social platform with AI-powered tools, real-time chat, and premium features.

---

## 🛠️ Tech Stack

* **React.js**
* **Tailwind CSS**
* **Framer Motion**
* **Axios (API calls)**
* **WebSocket (Real-time chat)**
* **Firebase (File Uploads)**

---

## 📌 Features

* 🔐 Authentication UI (Login / Register / Forgot Password)
* 🧠 AI Tools

  * Caption Generator
  * Hashtag Generator
  * Summarizer
* 💬 Real-time Chat Interface
* 👥 Follow-based interaction UI
* 💎 Premium UI (badges, access control)
* 📊 Admin Dashboard UI
* 📁 File Upload UI
* 🎨 Neon Theme UI

---

## ⚙️ Setup Instructions

### 1. Clone Repository

```bash id="zj7x0n"
git clone https://github.com/your-username/RevHive.git
cd RevHive/frontend
```

---

### 2. Install Dependencies

```bash id="l5r7dc"
npm install
```

---

### 3. Run Frontend

```bash id="4a4b3u"
npm run dev
```

App runs on:

```id="csmk7o"
http://localhost:5173
```

---

## 🌐 API Configuration

Update API base URL (inside your config / axios file):

```javascript id="k8rb3k"
const API = "http://localhost:8080/api";
```

---

## 💬 WebSocket Configuration

```javascript id="i9e9r2"
const socket = new WebSocket("ws://localhost:8080/ws");
```

---

## 🔐 Pages / Routes

* `/login` → Login
* `/signup` → Register
* `/forgot-password` → Email input
* `/reset-password` → Set new password
* `/dashboard` → Main app
* `/chat` → Messaging

---

## 🎨 UI Notes

* Built with **Tailwind CSS**
* Uses **Neon theme**
* Smooth animations via **Framer Motion**
* Responsive design

---

## 📂 Project Structure

```id="c4r1hc"
frontend/
│
├── components/     # Reusable UI components
├── pages/          # Main pages (Login, Dashboard, Chat)
├── context/        # Global state
├── services/       # API calls
├── utils/          # Helpers
└── App.jsx
```

---

## 🚧 Future Improvements

* Better UI consistency
* Dark/Light mode toggle
* Notifications UI
* Mobile responsiveness improvements

---

## 👨‍💻 Author

** Team RevHive**

---

## 📜 License

For learning and development purposes.
