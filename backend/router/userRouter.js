import express from 'express';
import { getAllUsers, getUserByEmail, loginUser, saveUser } from '../controller/usercontrolle.js';

// Create a new router for user-related routes
const userRouter = express.Router();

// Define the route for saving a user
userRouter.post('/',saveUser)

// Define the route for logging in a user
userRouter.post('/login', loginUser)
userRouter.get('/email/:email', getUserByEmail)
userRouter.get('/', getAllUsers)

export default userRouter;