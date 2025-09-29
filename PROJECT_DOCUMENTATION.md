# 🏙️ CivicFlow - Community Issue Management System

## 📋 Project Overview

**CivicFlow** is a modern, full-stack web application that empowers citizens to report and track community issues while enabling local authorities, NGOs, and administrators to manage and resolve them efficiently. The platform bridges the gap between civic problems and their solutions through technology-driven community engagement.

---

## 🛠️ Complete Technology Stack

### **Backend Technologies**
- **☕ Java 17** - Core programming language
- **🍃 Spring Boot 3.5.5** - Application framework
- **🔐 Spring Security** - Authentication & authorization
- **💾 Spring Data JPA** - Data persistence layer
- **🐘 PostgreSQL** - Primary production database
- **🧪 H2 Database** - In-memory testing database
- **🔑 JWT** - Stateless authentication tokens
- **🔗 Hibernate ORM** - Object-relational mapping
- **📦 Maven** - Build tool & dependency management
- **✅ JUnit 5** - Unit testing framework
- **🎭 Mockito** - Mocking framework
- **⚡ JMeter** - Performance testing

### **Frontend Technologies**
- **⚛️ React 18** - UI library with JSX components
- **⚡ Vite 7.1.5** - Build tool & development server
- **🎨 Tailwind CSS 4.1.9** - Utility-first CSS framework
- **🧭 React Router DOM 7.8.2** - Client-side routing
- **📡 Axios** - HTTP client for API calls
- **🔔 React Toastify** - Toast notifications
- **🎯 Lucide React** - Modern icon library
- **🎪 Radix UI** - Headless UI components
- **📊 Recharts** - Chart library for analytics
- **📱 React Hook Form** - Form handling

### **Development & Build Tools**
- **🎯 ESLint** - Code linting
- ** PostCSS** - CSS processing
- **📦 pnpm** - Package management
- **🔄 Hot Module Replacement** - Fast development
- **📱 Responsive Design** - Mobile-first approach

---

## ✨ Working Features (Frontend ↔ Backend Integration)

### 🔐 **Authentication & User Management**
- **User Registration** - Signup with validation
- **User Login** - JWT-based authentication
- **NGO Registration** - Specialized NGO accounts
- **Role-based Access** - USER, NGO, ADMIN permissions
- **Protected Routes** - Route protection by authentication
- **Profile Management** - Complete user data CRUD
- **Password Updates** - Secure password changes
- **User Preferences** - Settings and notifications

### 📝 **Issue Management System**
- **Issue Creation** - Report community issues with rich forms
- **Image Upload** - Drag-and-drop attachments
- **Location Detection** - GPS coordinate capture
- **Issue Categories** - Infrastructure, Safety, Environment, Transportation
- **Status Tracking** - PENDING → IN_PROGRESS → RESOLVED
- **Real-time Search** - Text-based search functionality
- **Smart Filtering** - Filter by category, status, location
- **Issue Details** - Complete issue view with metadata
- **Issue Updates** - Edit and update functionality
- **Issue Deletion** - Remove with proper permissions

### 🗳️ **Community Voting System**
- **Upvote/Downvote** - Community issue prioritization
- **Vote Validation** - One vote per user per issue
- **Real-time Counts** - Live vote statistics
- **Popular Issues** - Sort by community engagement

### 🏠 **User Dashboard**
- **Personalized Welcome** - User-specific stats
- **Dashboard Statistics** - Issue counts, votes received
- **Recent Issues** - Latest reported issues
- **Quick Actions** - Fast access to features
- **Activity Feed** - Community activity updates

### 🏢 **Admin Panel**
- **User Management** - View, edit, delete users
- **Role Assignment** - Change roles (USER ↔ NGO ↔ ADMIN)
- **User Status Control** - Enable/disable accounts
- **Issue Oversight** - Monitor all platform issues
- **Issue Assignment** - Assign issues to NGOs
- **System Statistics** - Platform-wide analytics

### 🏢 **NGO Management System**
- **NGO Dashboard** - Specialized NGO interface
- **Assigned Issues** - View NGO-assigned issues
- **Status Updates** - Update issue progress
- **Issue Resolution** - Mark issues resolved
- **NGO Profile** - Organization information management

### 🎨 **Modern UI/UX Features**
- **Responsive Design** - Mobile-first approach
- **Toast Notifications** - Real-time feedback
- **Loading States** - Smooth indicators
- **Error Handling** - Graceful error states
- **Form Validation** - Client & server-side validation
- **Search & Filter UI** - Intuitive components
- **Role-based Navigation** - Dynamic menus
- **Accessibility** - WCAG compliant

### 📊 **Analytics & Reporting**
- **Dashboard Metrics** - User engagement stats
- **Issue Analytics** - Status & category breakdowns
- **User Statistics** - Registration & activity trends
- **Popular Issues** - Most voted issues
- **System Health** - Platform usage metrics

---

## 🏗️ System Architecture

### **Frontend Architecture**
```
Frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── auth/           # Authentication components
│   │   ├── common/         # Shared components (Button, Input, etc.)
│   │   ├── dashboard/      # Dashboard-specific components
│   │   ├── issues/         # Issue management components
│   │   ├── admin/          # Admin panel components
│   │   └── layout/         # Layout components
│   ├── pages/              # Route-level page components
│   ├── context/            # React Context providers
│   ├── services/           # API service layer
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   └── styles/             # Global styles
```

### **Backend Architecture**
```
src/main/java/com/civicflow/civicflow_backend/
├── Controller/             # REST API endpoints
├── service/               # Business logic layer
├── repository/            # Data access layer
├── model/                 # JPA entity classes
├── dto/                   # Data transfer objects
├── config/                # Configuration classes
└── security/              # Security configurations
```

---

## 🔌 API Integration

### **Authentication Endpoints**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/ngo/register` - NGO registration
- `POST /api/auth/ngo/login` - NGO login

### **Issue Management**
- `GET /api/issues` - Get all issues with filtering
- `POST /api/issues` - Create new issue
- `GET /api/issues/{id}` - Get specific issue
- `PUT /api/issues/{id}` - Update issue
- `DELETE /api/issues/{id}` - Delete issue

### **Voting System**
- `POST /api/issues/{id}/vote` - Vote on issue
- `GET /api/issues/{id}/votes` - Get vote statistics

### **User Management**
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/dashboard` - Get dashboard data

### **Admin Operations**
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/{id}/role` - Change user role
- `GET /api/admin/dashboard` - Get admin statistics

---

## 🎯 Key Technical Achievements

### **Security Implementation**
- JWT-based stateless authentication
- Password encryption using BCrypt
- CORS configuration for frontend integration
- Role-based access control at API level
- Protected routes in frontend

### **Database Design**
- Optimized PostgreSQL schema
- JPA relationships (One-to-Many, Many-to-One)
- Database indexing for performance
- Transaction management

### **Frontend Performance**
- Component-based architecture
- Efficient state management with React Context
- Optimized API calls with Axios interceptors
- Lazy loading and code splitting ready

### **Testing Framework**
- 24 comprehensive tests covering all layers
- Repository tests with H2 database
- Service layer tests with Mockito
- Controller integration tests with MockMvc
- Performance tests with JMeter

### **User Experience**
- Intuitive navigation and workflows
- Real-time feedback and notifications
- Responsive design for all screen sizes
- Accessibility considerations

---

## 🚀 Production-Ready Features

- **Scalable Architecture** - Modular, maintainable codebase
- **Error Handling** - Comprehensive error management
- **Logging** - Proper application logging
- **Validation** - Client and server-side data validation
- **Security** - Industry-standard security practices
- **Performance** - Optimized queries and efficient rendering
- **Documentation** - Comprehensive API and code documentation
- **Testing** - Extensive test coverage across all layers

---

**CivicFlow** represents a complete, production-ready full-stack application that demonstrates modern web development practices, clean architecture, and comprehensive feature implementation across both frontend and backend systems.