const express = require("express")
const http = require("http")
const cors = require("cors")
const { Server } = require("socket.io")
const mongoose = require("mongoose")

const PORT = 4005
const MONGO_URL = ""
const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:8000",
    methods: ["GET", "POST"],
  }
})

app.use(cors({
  origin: "http://localhost:8000"
}))
app.use(express.json())

const socketConnections = new Map()

// === Mongoose Schemas ===
const NotificationSchema = new mongoose.Schema({
  title: String,
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  read: { type: Boolean, default: false },
})

const PostSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  content: String,
})

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
})

const Notification = mongoose.model("Notification", NotificationSchema)
const Post = mongoose.model("Post", PostSchema)
const User = mongoose.model("User", UserSchema)


// === API Routes ===
app.post("/user", async (req, res) => {
  const { username, email, password } = req.body
  const user = new User({ username, email, password })
  await user.save()
  res.json(user)
})

app.post("/post", async (req, res) => {
  const { userId, content } = req.body
  const post = new Post({ userId, content })
  await post.save()
  res.json(post)
})

app.post("/event", async (req, res) => {
  const { title, postId, timestamp } = req.body
  const post = await Post.findById(postId)

  if (!post) return res.status(404).send("Post not found")

  await saveNotification(title, postId, post.userId, timestamp)
  res.send("Notification event handled")
})


app.get("/notifications", async (req, res) => {
  const notifications = await Notification.find()
  res.json(notifications)
})


// === Notification Logic ===
const sendNotificationToUser = (userId, notification) => {
  const socket = socketConnections.get(userId)
  if (socket) {
    socket.emit("notifications", notification)
  }
}

const sendOldNotificationsToUser = async (userId) => {
  const notifications = await Notification.find({ userId, read: false })
  const socket = socketConnections.get(userId)
  if (socket) {
    socket.emit("notifications", notifications)
  }
}

const saveNotification = async (title, postId, userId, timestamp) => {
  const notification = new Notification({
    title,
    postId,
    userId,
    timestamp,
  })
  await notification.save()
  sendNotificationToUser(userId, notification)
}


// === Socket.IO ===
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id)

  socket.on("new-user", (userId) => {
    console.log("User registered:", userId)
    socketConnections.set(userId, socket)
    sendOldNotificationsToUser(userId)

    socket.on("disconnect", () => {
      socketConnections.delete(userId)
      console.log("User disconnected:", userId)
    })
  })
})


// === Server Start ===
mongoose.connect(MONGO_URL).then(() => {
  server.listen(PORT, () => {
    console.log("Server running on port: ", `http://localhost:${PORT}`)
  })
})
