import mongoose from "mongoose";

// Define the schema for orders (extending the existing parcel model concept)
const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    parcelId: {
        type: String,
        required: true
    },
    customerId: {
        type: String,
        required: true
    },
    customerName: {
        type: String,
        required: true
    },
    customerEmail: {
        type: String,
        required: true
    },
    deliveryAddress: {
        addressLine1: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        district: {
            type: String,
            required: true
        }
    },
    currentLocation: {
        type: String,
        default: 'Processing Center'
    },
    status: {
        type: String,
        enum: ['Pending', 'In Transit', 'Out for Delivery', 'Delivered', 'Returned'],
        default: 'Pending'
    },
    estimatedDeliveryDate: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Pre-save middleware to update the updatedAt field
orderSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
