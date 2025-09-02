import express from 'express';
import {
    createOrder,
    updateOrderLocation,
    getOrderDetails,
    getAllOrders,
    getOrderTrackingHistory
} from '../controller/orderController.js';

const orderRouter = express.Router();

// Create a new order
orderRouter.post('/create', createOrder);

// Update order location (QR scan endpoint)
orderRouter.post('/update-location', updateOrderLocation);

// Get order details
orderRouter.get('/:orderId', getOrderDetails);

// Get all orders with pagination
orderRouter.get('/', getAllOrders);

// Get tracking history for an order
orderRouter.get('/:orderId/tracking', getOrderTrackingHistory);

export default orderRouter;
