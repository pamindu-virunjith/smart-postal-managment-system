import mongoose from "mongoose";

// Define the schema for tracking history
const trackingHistorySchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        index: true
    },
    location: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    updatedBy: {
        type: String, // Admin who updated the location
        required: true
    },
    notes: {
        type: String,
        default: ''
    }
});

// Index for better query performance
trackingHistorySchema.index({ orderId: 1, timestamp: -1 });

const TrackingHistory = mongoose.model("TrackingHistory", trackingHistorySchema);
export default TrackingHistory;
