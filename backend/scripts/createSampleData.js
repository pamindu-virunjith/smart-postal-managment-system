import mongoose from 'mongoose';
import Order from '../modules/order.js';
import TrackingHistory from '../modules/trackingHistory.js';
import User from '../modules/user.js';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://admin:123@cluster0.vaznqp4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => {
    console.log("Connected to MongoDB");
    createSampleData();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

async function createSampleData() {
  try {
    // Clear existing data
    await Order.deleteMany({});
    await TrackingHistory.deleteMany({});
    
    // Create sample orders
    const sampleOrders = [
      {
        orderId: 'ORD-001234',
        parcelId: 'PCL-001234',
        customerId: 'CUST-001',
        customerName: 'John Doe',
        customerEmail: 'john.doe@email.com',
        deliveryAddress: {
          addressLine1: '123 Main Street',
          city: 'Colombo',
          district: 'Colombo'
        },
        currentLocation: 'Processing Center',
        status: 'Pending'
      },
      {
        orderId: 'ORD-001235',
        parcelId: 'PCL-001235',
        customerId: 'CUST-002',
        customerName: 'Jane Smith',
        customerEmail: 'jane.smith@email.com',
        deliveryAddress: {
          addressLine1: '456 Oak Avenue',
          city: 'Kandy',
          district: 'Kandy'
        },
        currentLocation: 'Kandy Distribution Center',
        status: 'In Transit'
      },
      {
        orderId: 'ORD-001236',
        parcelId: 'PCL-001236',
        customerId: 'CUST-003',
        customerName: 'Bob Johnson',
        customerEmail: 'bob.johnson@email.com',
        deliveryAddress: {
          addressLine1: '789 Pine Road',
          city: 'Galle',
          district: 'Galle'
        },
        currentLocation: 'Out for Delivery',
        status: 'Out for Delivery'
      },
      {
        orderId: 'ORD-001237',
        parcelId: 'PCL-001237',
        customerId: 'CUST-004',
        customerName: 'Alice Wilson',
        customerEmail: 'alice.wilson@email.com',
        deliveryAddress: {
          addressLine1: '321 Elm Street',
          city: 'Negombo',
          district: 'Gampaha'
        },
        currentLocation: 'Customer Address',
        status: 'Delivered'
      }
    ];

    // Insert sample orders
    for (const orderData of sampleOrders) {
      const order = new Order(orderData);
      await order.save();
      
      // Create initial tracking history
      const trackingEntry = new TrackingHistory({
        orderId: orderData.orderId,
        location: orderData.currentLocation,
        status: orderData.status,
        updatedBy: 'System',
        notes: `Order created with status: ${orderData.status}`
      });
      
      await trackingEntry.save();
    }

    // Update an admin user with postOfficeLocation if exists
    const adminUser = await User.findOne({ role: 'admin' });
    if (adminUser && !adminUser.postOfficeLocation) {
      adminUser.postOfficeLocation = 'Main Processing Center';
      await adminUser.save();
      console.log('Updated admin user with post office location');
    }

    console.log('Sample data created successfully!');
    console.log(`Created ${sampleOrders.length} orders with tracking history`);
    
    // List all orders
    const orders = await Order.find().sort({ createdAt: -1 });
    console.log('\nCreated Orders:');
    orders.forEach(order => {
      console.log(`- ${order.orderId}: ${order.customerName} -> ${order.currentLocation} (${order.status})`);
    });

    mongoose.connection.close();
    
  } catch (error) {
    console.error('Error creating sample data:', error);
    mongoose.connection.close();
    process.exit(1);
  }
}
