
# 📡 Real-Time Notification System

A real-time notification backend built with **Node.js**, **Express**, **MongoDB**, and **Socket.IO**. Users receive live notifications related to their posts, which are saved and delivered via WebSockets.

---

## 🚀 Features

- 🧑 User registration
- 📝 Post creation
- 🔔 Real-time event-triggered notifications
- 💬 Socket.IO integration for live updates
- 🧠 Unread notification tracking
- 📡 Automatic delivery of missed notifications upon reconnect

---

## 🛠️ Tech Stack

- **Node.js + Express** - Server
- **MongoDB + Mongoose** - Database
- **Socket.IO** - Real-time communication
- **CORS** - Cross-origin access support

---

## 🧱 MongoDB Schemas

- **User**
  ```js
  { username, email, password }
  ```
- **Post**
  ```js
  { userId, content }
  ```
- **Notification**
  ```js
  { title, postId, userId, read, timestamp }
  ```

---

## 📡 Socket.IO Events

- `new-user`: Register socket connection with `userId`
- `notification-read`: Mark notifications as read
- `old-notifications`: Emits unread notifications upon reconnect
- `notification`: Emits real-time notification to the user

---

## 🧪 REST API Endpoints

| Method | Endpoint            | Description               |
|--------|---------------------|---------------------------|
| POST   | `/user`             | Create a new user         |
| POST   | `/post`             | Create a new post         |
| POST   | `/event`            | Trigger a new notification event |
| GET    | `/notifications?userId=ID` | Get notifications for a user |

---

## ⚙️ Setup & Run

```bash
git clone https://github.com/your-username/realtime-notification-backend.git
cd realtime-notification-backend
npm install
```

### 🔐 Environment Variables

Create a `.env` file:
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/notification
```

### 🏃 Start Server

```bash
node index.js
```

Server runs on `http://localhost:4005`.

---

## 🧠 How It Works

1. A user connects via Socket.IO and registers their `userId`.
2. When a post-related event occurs, a notification is saved in MongoDB.
3. If the target user is connected, the server emits it instantly.
4. On reconnection, all unread notifications are sent.

---

## 🧩 Future Improvements

- Authentication with JWT
- Notification categorization
- Redis for scalable socket management
- Frontend UI for testing

---

## 📄 License

MIT


---

