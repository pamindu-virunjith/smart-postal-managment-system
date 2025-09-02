# QR Code Scanning Feature for Postal Management System

## Overview

This feature allows admins to scan QR codes using their phone camera to automatically update order tracking locations in real-time. The system includes mobile QR scanning, backend API integration, and real-time dashboard updates.

## Features Implemented

### 1. 📱 Mobile QR Scanning

- **Component**: `src/pages/QRScanner.jsx`
- **Route**: `/qr-scanner`
- **Functionality**:
  - Camera-based QR code scanning
  - Automatic order ID extraction from QR codes
  - Real-time location updates
  - Success/error notifications
  - User authentication validation

### 2. 🖥️ Admin Panel Dashboard

- **Component**: `src/pages/admin/RealTimeDashboard.jsx`
- **Route**: `/admin/dashboard`
- **Features**:
  - Real-time order updates via Socket.io
  - Live notification system
  - Order status tracking
  - Connection status indicator
  - Recent updates panel

### 3. 🏷️ QR Code Generator

- **Component**: `src/pages/admin/QRCodeGenerator.jsx`
- **Route**: `/admin/qr-generator`
- **Features**:
  - Generate QR codes for order IDs
  - Download QR codes as PNG
  - Print QR codes with order information
  - Quick generate presets

### 4. 🚀 Backend API

- **New Models**:
  - `modules/order.js` - Order management
  - `modules/trackingHistory.js` - Tracking history
- **Controller**: `controller/orderController.js`
- **Router**: `router/orderRouter.js`
- **Socket.io Integration**: Real-time updates

## Database Schema

### Orders Collection

```javascript
{
  orderId: String (unique),
  parcelId: String,
  customerId: String,
  customerName: String,
  customerEmail: String,
  deliveryAddress: {
    addressLine1: String,
    city: String,
    district: String
  },
  currentLocation: String,
  status: String, // 'Pending', 'In Transit', 'Out for Delivery', 'Delivered', 'Returned'
  estimatedDeliveryDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Tracking History Collection

```javascript
{
  orderId: String,
  location: String,
  status: String,
  timestamp: Date,
  updatedBy: String,
  notes: String
}
```

### Updated User Model

- Added `postOfficeLocation` field for admin users

## API Endpoints

### Order Management

- `POST /api/orders/create` - Create new order
- `POST /api/orders/update-location` - Update order location via QR scan
- `GET /api/orders/:orderId` - Get order details
- `GET /api/orders` - Get all orders (paginated)
- `GET /api/orders/:orderId/tracking` - Get tracking history

## Real-time Updates

### Socket.io Events

- **Client → Server**: `joinAdminRoom` - Join admin room for updates
- **Server → Client**: `orderLocationUpdated` - Broadcast location updates

### Connection Flow

1. Admin dashboard connects to Socket.io
2. Joins admin room for real-time updates
3. Mobile QR scan triggers location update
4. Backend broadcasts update to all connected dashboards
5. Dashboards show notification and update order list

## Installation & Setup

### 1. Install Dependencies

**Backend:**

```bash
cd backend
npm install socket.io
```

**Frontend:**

```bash
cd my-first-react-app
npm install react-qr-reader socket.io-client qrcode --legacy-peer-deps
```

### 2. Environment Variables

Create `.env` file in backend directory:

```env
JWT_KEY=your_super_secret_jwt_key_here_123456789
MONGODB_URI=mongodb+srv://admin:123@cluster0.vaznqp4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

### 3. Sample Data

Run the sample data script to create test orders:

```bash
cd backend
node scripts/createSampleData.js
```

### 4. Start Services

**Backend:**

```bash
cd backend
npm start
```

**Frontend:**

```bash
cd my-first-react-app
npm run dev
```

## Usage Instructions

### For Administrators (Mobile QR Scanning)

1. **Login** to the system on your mobile device
2. Navigate to `/qr-scanner` route
3. Tap **"Start QR Scanner"** to activate camera
4. **Position** the parcel's QR code within the scanning frame
5. **Wait** for automatic detection and processing
6. **Confirm** the success message

### For Administrators (Desktop Dashboard)

1. **Login** to admin panel
2. Navigate to **"Live Dashboard"** from sidebar
3. **Monitor** real-time order updates
4. **View** recent location changes
5. **Track** order status changes

### QR Code Generation

1. Go to **"QR Generator"** in admin panel
2. **Enter** order ID (e.g., ORD-001234)
3. **Click** "Generate" to create QR code
4. **Download** or **Print** the QR code
5. **Attach** QR code to parcel

## Testing

### Sample Order IDs for Testing

- `ORD-001234` - John Doe (Pending)
- `ORD-001235` - Jane Smith (In Transit)
- `ORD-001236` - Bob Johnson (Out for Delivery)
- `ORD-001237` - Alice Wilson (Delivered)

### Test Workflow

1. **Generate** QR code for `ORD-001234`
2. **Open** `/qr-scanner` on mobile
3. **Scan** the generated QR code
4. **Check** real-time dashboard for updates
5. **Verify** tracking history is created

## Security Features

- **JWT Authentication** required for QR scanning
- **Role-based Access** (admin/postman only)
- **Input Validation** for order IDs
- **Error Handling** for invalid QR codes

## Technical Architecture

### Frontend Components

```
src/
├── pages/
│   ├── QRScanner.jsx           # Mobile QR scanning
│   └── admin/
│       ├── RealTimeDashboard.jsx  # Live dashboard
│       └── QRCodeGenerator.jsx    # QR code creation
```

### Backend Structure

```
backend/
├── modules/
│   ├── order.js                # Order model
│   └── trackingHistory.js      # Tracking model
├── controller/
│   └── orderController.js      # Order management
├── router/
│   └── orderRouter.js          # Order routes
└── scripts/
    └── createSampleData.js     # Test data
```

## Troubleshooting

### Common Issues

1. **Camera Permission**: Ensure browser has camera access
2. **Socket.io Connection**: Check if backend server is running
3. **QR Code Reading**: Ensure good lighting and stable camera position
4. **Real-time Updates**: Verify Socket.io connection status in dashboard

### Browser Compatibility

- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Camera access may require HTTPS
- **Mobile browsers**: Recommended for QR scanning

## Future Enhancements

- 📍 GPS location integration for automatic post office detection
- 🔔 Push notifications for order updates
- 📊 Analytics dashboard for scanning statistics
- 🎯 Batch QR code scanning
- 📱 Progressive Web App (PWA) for offline capability

## Support

For technical support or feature requests, please contact the development team.
