import Order from "../modules/order.js";
import TrackingHistory from "../modules/trackingHistory.js";
import User from "../modules/user.js";

// Create a new order
export const createOrder = async (req, res) => {
    try {
        const { 
            orderId, 
            parcelId, 
            customerId, 
            customerName, 
            customerEmail, 
            deliveryAddress,
            estimatedDeliveryDate 
        } = req.body;

        // Check if order already exists
        const existingOrder = await Order.findOne({ orderId });
        if (existingOrder) {
            return res.status(400).json({ 
                success: false, 
                message: "Order with this ID already exists" 
            });
        }

        const newOrder = new Order({
            orderId,
            parcelId,
            customerId,
            customerName,
            customerEmail,
            deliveryAddress,
            estimatedDeliveryDate
        });

        await newOrder.save();

        // Create initial tracking history entry
        const trackingEntry = new TrackingHistory({
            orderId,
            location: 'Processing Center',
            status: 'Pending',
            updatedBy: 'System',
            notes: 'Order created and received at processing center'
        });

        await trackingEntry.save();

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            data: newOrder
        });

    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Update order location via QR scan
export const updateOrderLocation = async (req, res) => {
    try {
        const { orderId, newLocation, notes } = req.body;
        const adminEmail = req.user?.email;

        // Validate required fields
        if (!orderId || !newLocation) {
            return res.status(400).json({
                success: false,
                message: "Order ID and new location are required"
            });
        }

        // Verify admin user and get their post office location
        const admin = await User.findOne({ email: adminEmail });
        if (!admin || (admin.role !== 'admin' && admin.role !== 'postman')) {
            return res.status(403).json({
                success: false,
                message: "Only admin users can update order locations"
            });
        }

        // Find the order
        const order = await Order.findOne({ orderId });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Update order location and status
        const previousLocation = order.currentLocation;
        order.currentLocation = newLocation;
        
        // Update status based on location
        if (newLocation.toLowerCase().includes('delivered')) {
            order.status = 'Delivered';
        } else if (newLocation.toLowerCase().includes('out for delivery')) {
            order.status = 'Out for Delivery';
        } else {
            order.status = 'In Transit';
        }

        await order.save();

        // Create tracking history entry
        const trackingEntry = new TrackingHistory({
            orderId,
            location: newLocation,
            status: order.status,
            updatedBy: admin.name,
            notes: notes || `Location updated from ${previousLocation} to ${newLocation}`
        });

        await trackingEntry.save();

        // Emit real-time update (Socket.io will be handled in index.js)
        req.io?.emit('orderLocationUpdated', {
            orderId,
            newLocation,
            status: order.status,
            updatedBy: admin.name,
            timestamp: new Date()
        });

        res.json({
            success: true,
            message: "Order location updated successfully",
            data: {
                orderId,
                previousLocation,
                newLocation,
                status: order.status,
                updatedBy: admin.name
            }
        });

    } catch (error) {
        console.error("Error updating order location:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Get order details
export const getOrderDetails = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findOne({ orderId });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Get tracking history
        const trackingHistory = await TrackingHistory.find({ orderId })
            .sort({ timestamp: -1 });

        res.json({
            success: true,
            data: {
                order,
                trackingHistory
            }
        });

    } catch (error) {
        console.error("Error fetching order details:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Get all orders with pagination
export const getAllOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalOrders = await Order.countDocuments();
        const totalPages = Math.ceil(totalOrders / limit);

        res.json({
            success: true,
            data: {
                orders,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalOrders,
                    hasNext: page < totalPages,
                    hasPrev: page > 1
                }
            }
        });

    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Get tracking history for an order
export const getOrderTrackingHistory = async (req, res) => {
    try {
        const { orderId } = req.params;

        const trackingHistory = await TrackingHistory.find({ orderId })
            .sort({ timestamp: -1 });

        if (trackingHistory.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No tracking history found for this order"
            });
        }

        res.json({
            success: true,
            data: trackingHistory
        });

    } catch (error) {
        console.error("Error fetching tracking history:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};
