# 🌿 Nadi Pariksha - Perfect Ayurvedic Pulse Analysis Web App

A complete, production-ready React application for Electronic Nadi Pariksha Device with advanced features, beautiful UI, and robust backend integration.

## ✨ Features

### 🔐 **Authentication & Security**
- Firebase Authentication (Email/Password + Google Sign-in)
- JWT-based API security
- Role-based access control (User/Admin/Super Admin)
- Protected routes and secure data handling

### 📊 **Core Functionality**
- Real-time pulse waveform analysis
- Dosha balance detection (Vata, Pitta, Kapha)
- Live data visualization with Recharts
- Analysis history and detailed reports
- Ayurvedic recommendations system

### 👑 **Admin System**
- **Super Admin**: `sanjeev.arjava@gmail.com` - Complete system control
- **Admin Management**: Dynamic admin authorization
- **User Management**: View all user data and analytics
- **System Monitoring**: Database and security oversight

### 🎨 **Perfect UI/UX**
- Modern, responsive design with Tailwind CSS
- Smooth animations and transitions
- Glass morphism effects
- Progress bars and loading states
- Toast notifications system
- Error boundaries for stability

### 🗄️ **Database Integration**
- MySQL database with complete CRUD operations
- User profiles with detailed information
- Analysis reports storage
- Real-time data synchronization

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MySQL 8.0+
- Firebase project setup

### Installation

1. **Clone and Install**
```bash
git clone <repository>
cd my_first_web
npm install
```

2. **Database Setup**
```sql
-- Run in MySQL Workbench
CREATE DATABASE nadi_pariksha;
USE nadi_pariksha;

CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(255),
    phone VARCHAR(20),
    age INT,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

3. **Backend Configuration**
```bash
cd backend
# Update .env with your MySQL credentials
DB_PASSWORD=your_mysql_password
npm install
node simple-server.js
```

4. **Start Frontend**
```bash
npm run dev
```

5. **Access Application**
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3001`

## 🏗️ Architecture

### Frontend Stack
- **React 18** + TypeScript
- **Tailwind CSS** for styling
- **Firebase Auth** for authentication
- **Recharts** for data visualization
- **React Router** for navigation
- **Axios** for API calls

### Backend Stack
- **Node.js** + Express
- **MySQL** database
- **JWT** authentication
- **CORS** enabled
- **RESTful API** design

### Key Components
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components
│   ├── ErrorBoundary   # Error handling
│   ├── NotificationSystem # Toast notifications
│   └── Modal           # Dialog system
├── pages/              # Main application pages
├── services/           # API and Firebase services
├── hooks/              # Custom React hooks
└── utils/              # Utility functions
```

## 🔑 User Roles

### 👤 **Regular User**
- Personal dashboard
- Pulse analysis
- View own results
- Profile management

### 🛡️ **Admin**
- All user features
- View all user data
- System analytics
- User management

### 👑 **Super Admin** (`sanjeev.arjava@gmail.com`)
- Complete system access
- Admin management
- User authorization
- System configuration

## 📱 Pages & Features

### 🏠 **Home Dashboard**
- Welcome animations
- Quick stats overview
- Action cards with progress
- Health score display

### 📊 **Analysis Page**
- Real-time waveform recording
- Live pulse visualization
- Dosha calculation
- Results display

### 📈 **Results Page**
- Analysis history
- Detailed reports
- Trend visualization
- Export functionality

### 👤 **Profile Page**
- Personal information management
- Account details
- Health profile
- Settings

### 🔧 **Admin Dashboard**
- User management
- System statistics
- Data analytics
- Security monitoring

## 🎨 Design System

### Colors
- **Vata**: Purple (#8B5CF6)
- **Pitta**: Orange (#F59E0B)
- **Kapha**: Green (#10B981)

### Animations
- Fade in effects
- Hover lift animations
- Pulse glow effects
- Smooth transitions

### Components
- Glass morphism cards
- Gradient text effects
- Progress indicators
- Interactive buttons

## 🔧 API Endpoints

### User Management
```
POST   /api/users              # Create user
GET    /api/users/all          # Get all users
GET    /api/users/:uid/profile # Get user profile
PUT    /api/users/:uid/profile # Update profile
DELETE /api/users/:uid/profile # Delete profile
```

### Analysis
```
POST   /api/nadi/start         # Start analysis
POST   /api/nadi/analyze       # Analyze waveform
GET    /api/reports/:userId    # Get user reports
```

## 🛡️ Security Features

- JWT token authentication
- Protected API endpoints
- Role-based access control
- Input validation
- Error handling
- Secure data storage

## 📱 Mobile Responsive

- Fully responsive design
- Touch-friendly interface
- Mobile-optimized navigation
- Adaptive layouts

## 🚀 Production Ready

- Error boundaries
- Loading states
- Offline handling
- Performance optimized
- SEO friendly
- Accessibility compliant

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 👨‍💻 Developer

Built with ❤️ for Ayurvedic healthcare technology

---

**Perfect Nadi Pariksha Web Application** - Complete, Professional, Production-Ready ✨