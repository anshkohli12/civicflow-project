# 🏙️ CivicFlow - Community Issue Management System

A modern full-stack web application that empowers citizens to report and track community issues, while enabling local authorities and NGOs to manage and resolve them efficiently.

## ✨ Features

### 🔐 **Authentication & Authorization**
- User registration and login with JWT authentication
- Role-based access control (USER, NGO, ADMIN)
- Secure password encryption
- Separate login portals for citizens and NGOs

### 📝 **Issue Management**
- Create, view, edit, and delete community issues
- Upload images to document problems
- Automatic location detection using browser geolocation
- Smart filtering and search capabilities
- Category-based organization (Infrastructure, Safety, Environment, etc.)
- Issue status tracking (PENDING, IN_PROGRESS, RESOLVED)
- Real-time issue assignment and tracking

### 🏢 **NGO Management System**
- **NGO Registration**: Comprehensive registration with organization details
- **NGO Dashboard**: Dedicated dashboard for assigned issues
- **Issue Assignment**: Admin can assign issues to specific NGOs
- **Status Updates**: NGOs can update issue progress and status
- **Location Services**: Current location detection for NGO registration
- **Issue Filtering**: Filter issues by status, priority, and category

### 🗳️ **Voting System**
- Vote up/down on issues to show community support
- Real-time vote counting
- Vote statistics and analytics

### 👤 **User Profiles**
- Comprehensive user profile management
- Personal information, contact details, and preferences
- User dashboard with personalized statistics
- Issue tracking and history

### 🏢 **Admin Panel**
- Complete user management system
- Issue oversight and status management
- NGO assignment and management
- System statistics and analytics
- Role assignment and permissions
- Bulk operations for user management

### 📱 **Modern UI/UX**
- Responsive design for all devices
- Modern React components with Tailwind CSS
- Intuitive navigation and user experience
- Toast notifications for user feedback
- Optimized layouts for better horizontal space usage

## 🛠️ Tech Stack

### **Backend**
- **Java 17** with **Spring Boot 3.5.5**
- **Spring Security** for authentication and authorization
- **Spring Data JPA** with **PostgreSQL** database
- **JWT** for stateless authentication
- **Maven** for dependency management
- **File upload** support for images

### **Frontend**
- **React 18** with modern hooks and context
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Router** for navigation
- **Axios** for API communication
- **React Toastify** for notifications

### **Database**
- **PostgreSQL** for reliable data storage
- **JPA/Hibernate** for ORM
- Optimized queries and relationships

## 🚀 Getting Started

### Prerequisites
- **Java 17** or higher
- **Node.js 20.19+** or **22.12+**
- **PostgreSQL** database
- **Maven** (included with wrapper)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/anshkohli12/civicflow.git
   cd civicflow
   ```

2. **Configure PostgreSQL Database**
   - Create a database named `civicflow`
   - Update `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/civicflow
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

3. **Run the Spring Boot application**
   ```bash
   ./mvnw spring-boot:run
   ```
   The backend will start on `http://localhost:8080`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   The frontend will start on `http://localhost:5173`

## 📱 Usage

### For Citizens
1. **Register/Login** to your account
2. **Report Issues** by providing details, location, and photos
3. **Vote** on existing issues to show support
4. **Track** the status of your reported issues
5. **Browse** community issues in your area

### For Administrators
1. **Login** with admin credentials
2. **Manage Users** - view, edit roles, and moderate accounts
3. **Oversee Issues** - update status, assign to departments
4. **View Analytics** - track system statistics and trends
5. **System Management** - monitor health and performance

## 🗂️ Project Structure

```
civicflow/
├── src/main/java/com/civicflow/civicflow_backend/
│   ├── Controller/          # REST API endpoints
│   ├── service/            # Business logic layer
│   ├── repository/         # Data access layer
│   ├── model/             # Entity classes
│   ├── dto/               # Data transfer objects
│   └── config/            # Configuration classes
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service layer
│   │   ├── context/       # React context providers
│   │   └── utils/         # Utility functions
│   └── public/            # Static assets
└── uploads/               # File storage directory
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/admin/login` - Admin login
- `POST /api/auth/ngo/register` - NGO registration
- `POST /api/auth/ngo/login` - NGO login

### Issues
- `GET /api/issues` - Get all issues (with filtering)
- `POST /api/issues` - Create new issue
- `GET /api/issues/{id}` - Get issue by ID
- `PUT /api/issues/{id}` - Update issue
- `DELETE /api/issues/{id}` - Delete issue
- `PUT /api/issues/{id}/status` - Update issue status
- `PUT /api/issues/{id}/assign` - Assign issue to NGO

### Voting
- `POST /api/issues/{id}/vote` - Vote on issue
- `GET /api/issues/{id}/votes` - Get vote summary

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/dashboard` - Get user dashboard data

### Admin
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/{id}/role` - Change user role
- `GET /api/admin/dashboard` - Get admin statistics
- `PUT /api/admin/issues/{id}/assign` - Assign issue to NGO

### NGO
- `GET /api/ngo/issues` - Get assigned issues for NGO
- `PUT /api/ngo/issues/{id}/status` - Update issue status as NGO
- `GET /api/ngo/dashboard` - Get NGO dashboard data

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Ansh Kohli** - [@anshkohli12](https://github.com/anshkohli12)

---

⭐ **Star this repository if you found it helpful!**
