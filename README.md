````markdown
# 🕒 SlotSwapper

**A peer-to-peer time-slot scheduling application** that allows users to mark calendar events as *swappable* and exchange them with others.  
Built as part of the **ServiceHive Full Stack Internship Challenge** to demonstrate end-to-end development — including authentication, database modeling, complex API logic, and frontend state management.

---

## 🚀 Live Demo

- **Frontend (Render)**: [https://slotswapper-frontend-hsl0.onrender.com](https://slotswapper-frontend-hsl0.onrender.com)  
- **Backend (Render API)**: [https://slotswapper-7y9v.onrender.com](https://slotswapper-7y9v.onrender.com)  
- **GitHub Repository**: [https://github.com/MuskanNITA/SlotSwapper](https://github.com/MuskanNITA/SlotSwapper)

---

## 🧠 Concept

SlotSwapper enables users to manage their personal calendar events and trade “busy” time slots with others.  

**Example scenario:**
- User A has a *Team Meeting* on Tuesday 10-11 AM and marks it as **Swappable**.  
- User B has a *Focus Block* on Wednesday 2-3 PM and marks it as **Swappable**.  
- User A requests to swap their Tuesday meeting with User B’s Wednesday focus block.  
- User B can **Accept** or **Reject** the swap request.  
- If accepted, both users’ event ownerships are swapped and marked as **BUSY** again.

---

## 🧩 Features Implemented

### 🔐 User Authentication
- Sign Up / Log In using **JWT (JSON Web Tokens)**.  
- Tokens stored securely on the frontend and sent as `Authorization: Bearer <token>` with all protected API calls.  
- Passwords hashed using bcrypt.  

### 📅 Event Management (Calendar)
- Users can:
  - Create new events (title, startTime, endTime)
  - View all their events
  - Change event status (BUSY ↔ SWAPPABLE)
- Backend API supports full CRUD for user-owned events.

### 🔄 Swap Logic (Core Functionality)
- **GET `/api/swappable-slots`** — fetches all *swappable* events from *other* users.
- **POST `/api/swap-request`** — creates a new swap request:
  - Verifies both slots exist and are currently SWAPPABLE.
  - Marks both slots as `SWAP_PENDING` to prevent double booking.
  - Creates a `SwapRequest` document in MongoDB.
- **POST `/api/swap-response/:requestId`** — responder accepts or rejects:
  - **If rejected** → both events revert to SWAPPABLE.
  - **If accepted** → event ownerships swap and both become BUSY again.

### 🖥️ Frontend (React)
- **Authentication pages:** Signup & Login forms.
- **Dashboard view:** Displays user events and allows marking as swappable.
- **Marketplace view:** Shows other users’ swappable events, with “Request Swap” interaction.
- **Requests view:** 
  - Incoming swap requests with Accept/Reject buttons.  
  - Outgoing swap requests showing live status updates (Pending/Accepted/Rejected).
- Built using React hooks (`useState`, `useEffect`) and Axios for API integration.

### 🗄️ Backend (Node.js + Express + MongoDB)
- Modular route structure: `auth`, `events`, and `swap` routes.
- Data models:
  - **User:** name, email, password.
  - **Event:** title, startTime, endTime, status (BUSY/SWAPPABLE/SWAP_PENDING), owner.
  - **SwapRequest:** mySlot, theirSlot, requester, responder, status (PENDING/ACCEPTED/REJECTED).
- Middleware for authentication and CORS handling.
- Connected to MongoDB Atlas for persistent cloud data storage.

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend | React.js (Create React App), Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB (Atlas) |
| Authentication | JWT (JSON Web Token), bcrypt |
| Deployment | Render (Backend), Render (Frontend) |
| Version Control | Git & GitHub |

---

## ⚙️ Local Setup Instructions

### 1️⃣ Clone the repository
```bash
git clone https://github.com/MuskanNITA/SlotSwapper.git
cd SlotSwapper
````

### 2️⃣ Setup backend

```bash
cd backend
npm install
```

Create a `.env` file:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

Run backend:

```bash
npm start
```

Server runs at: `http://localhost:5000`

---

### 3️⃣ Setup frontend

```bash
cd ../frontend
npm install
```

Create a `.env` file:

```
REACT_APP_API_URL=http://localhost:5000/api
```

Run frontend:

```bash
npm start
```

App runs at: `http://localhost:3000`

---

### 4️⃣ Test the APIs (Postman)

Import your endpoints or use:

* **POST /api/auth/signup**
* **POST /api/auth/login**
* **GET /api/events**
* **POST /api/events**
* **PUT /api/events/:id**
* **GET /api/swappable-slots**
* **POST /api/swap-request**
* **POST /api/swap-response/:requestId**

✅ Each request requires `Authorization: Bearer <token>` in headers.

---

## 📚 API Endpoints Summary

| Method | Endpoint                        | Description                      |
| ------ | ------------------------------- | -------------------------------- |
| `POST` | `/api/auth/signup`              | Register a new user              |
| `POST` | `/api/auth/login`               | Login and get JWT token          |
| `GET`  | `/api/events`                   | Get user’s events                |
| `POST` | `/api/events`                   | Create a new event               |
| `PUT`  | `/api/events/:id`               | Update event (mark swappable)    |
| `GET`  | `/api/swappable-slots`          | Get other users’ swappable slots |
| `POST` | `/api/swap-request`             | Request to swap two slots        |
| `POST` | `/api/swap-response/:requestId` | Accept/Reject swap request       |

---

## 💡 Design Choices & Thought Process

* Used **JWT Authentication** for stateless, scalable API calls.
* Chose **MongoDB** for flexible document modeling between Users, Events, and SwapRequests.
* Used **atomic updates** (`findOneAndUpdate`) to prevent race conditions during swaps.
* Structured backend into clean routes and models for clarity.
* Frontend uses a simple three-page layout for easy navigation.
* Deployment separated frontend and backend on Render for easier maintenance.

---

## 🧠 Challenges Faced

1. Handling atomicity of swap transactions — ensuring both slots update safely.
2. Dealing with token expiration and 401 errors during testing.
3. Managing cross-origin (CORS) between Render frontend and backend.
4. Fixing Vite compatibility initially, later switched to Create React App.
5. Ensuring smooth state synchronization after accept/reject swaps.

---

## 🧭 Future Enhancements (Optional)

* Real-time notifications using **WebSockets (Socket.IO)** for instant updates.
* Add a **calendar view (react-calendar or fullcalendar)** UI.
* Add email notifications on swap request/acceptance.
* Implement **Docker** for containerized setup.
* Include unit/integration tests using **Jest + Supertest**.

---

## 🧑‍💻 Developer

**Muskan Gupta**
🎓 Recent B.Tech gratuate, NIT Agartala || Prev Google Software Developer Intern
💻 Passionate about full-stack development, innovation, and clean design.

---

## 📄 License

This project is developed as part of a **technical assessment** for ServiceHive.
You are free to review and test it. All rights reserved © Muskan Gupta 2025.

---

### ✅ Quick Submission Checklist

* [x] Public GitHub repo
* [x] Working deployed frontend (Render)
* [x] Working deployed backend (Render)
* [x] Fully functional swap logic
* [x] README with setup, endpoints, and design decisions

````



Would you like me to also generate a **Postman collection export (`SlotSwapper.postman_collection.json`)** so you can upload it to GitHub too?
It’ll include all API endpoints with example bodies (signup, login, events, swap-request, swap-response).
