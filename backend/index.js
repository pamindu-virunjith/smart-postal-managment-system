import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import userRouter from './router/userRouter.js';
import parcelRouter from './router/parcelRouter.js';
import orderRouter from './router/orderRouter.js';
import authjwt from './middleware/auth.js';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "http://127.0.0.1:5173","https://smart-postal-managment-system.vercel.app"],
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Enable CORS for all routes
app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173","https://smart-postal-managment-system.vercel.app"],
    credentials: true
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://admin:123@cluster0.vaznqp4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then
(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("MongoDB connection error:", err);
});

// Middleware 
app.use(bodyParser.json());

// Add Socket.io to request object for real-time updates
app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use(authjwt);

// Routes
app.use("/api/user", userRouter);
app.use("/api/parcel", parcelRouter);
app.use("/api/orders", orderRouter);

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('Admin connected:', socket.id);

    socket.on('joinAdminRoom', () => {
        socket.join('adminPanel');
        console.log('Admin joined admin panel room');
    });

    socket.on('disconnect', () => {
        console.log('Admin disconnected:', socket.id);
    });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});

