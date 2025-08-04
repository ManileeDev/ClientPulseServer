# Client Pulse - Backend API

A robust Node.js/Express backend API for the Client Pulse feedback management system.

## 📋 **Overview**

Client Pulse Backend provides a RESTful API for managing user feedback, features, and user authentication. It includes comprehensive user management, OTP-based email verification, JWT authentication, and role-based access control.

## 🛠️ **Tech Stack**

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Email**: Nodemailer for OTP verification
- **Security**: bcryptjs for password hashing
- **Validation**: Input validation and sanitization
- **Logging**: Morgan for HTTP request logging
- **CORS**: Cross-Origin Resource Sharing support

## 🚀 **Features**

### **Authentication & User Management**
- ✅ User registration with email verification
- ✅ OTP-based account activation
- ✅ JWT-based authentication
- ✅ Role-based access control (Client, Developer, Admin)
- ✅ Secure password hashing

### **Feedback Management**
- ✅ Create, read, update, delete feedback
- ✅ Category-based feedback organization
- ✅ Priority levels (Low, Medium, High, Urgent)
- ✅ Rating system (1-5 stars)
- ✅ User-specific feedback tracking

### **Feature Management**
- ✅ Developer-only feature creation
- ✅ Feature categorization (Feature, Story, Bug, Documentation)
- ✅ Priority and status tracking
- ✅ Feature versioning and estimation

### **Configuration API**
- ✅ Dynamic configuration endpoints
- ✅ Category and priority options
- ✅ Rating scale definitions

## 📦 **Installation**

### **Prerequisites**
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### **Setup**

1. **Clone and navigate to backend directory**
```bash
cd client-pulse-server
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment file**
```bash
cp .env.example .env
```

4. **Configure environment variables** (see Configuration section)

5. **Start the server**
```bash
# Development
npm run dev

# Production
npm start
```

## ⚙️ **Configuration**

Create a `.env` file in the root directory:

```env
# Database Configuration
MONG_URL=mongodb://localhost:27017/client-pulse
# For MongoDB Atlas:
# MONG_URL=mongodb+srv://username:password@cluster.mongodb.net/client-pulse

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-key-here-min-32-chars

# Email Configuration (for OTP verification)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

### **Email Setup (Gmail)**
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password: Google Account > Security > App passwords
3. Use the generated password in `EMAIL_PASS`

## 📚 **API Documentation**

### **Base URL**
```
http://localhost:5000/api
```

### **Authentication Endpoints**

#### **POST /signup**
Register a new user (sends OTP)
```json
{
  "fullname": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "client"
}
```

#### **POST /verify-otp**
Verify OTP and create account
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

#### **POST /login**
User login
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### **POST /resend-otp**
Resend OTP email
```json
{
  "email": "john@example.com"
}
```

### **Feedback Endpoints**

#### **GET /feedback**
Get all feedback (public)

#### **POST /feedback**
Create feedback (authenticated)
```json
{
  "title": "Feature Request",
  "description": "Detailed description",
  "category": "feature_request",
  "priority": "high",
  "rating": 4
}
```

#### **GET /feedback/user/:userId**
Get user's feedback (authenticated)

#### **PUT /feedback/:id**
Update feedback (authenticated, owner only)

#### **DELETE /feedback/:id**
Delete feedback (authenticated, owner only)

### **Feature Endpoints**

#### **GET /features**
Get all features (public)

#### **POST /features**
Create feature (developer only)
```json
{
  "name": "New Feature",
  "description": "Feature description",
  "category": "feature",
  "priority": "high",
  "estimatedHours": 40
}
```

#### **PUT /features/:id**
Update feature (developer only)

#### **DELETE /features/:id**
Delete feature (developer only)

### **Configuration Endpoints**

#### **GET /configurations/feedback-categories**
Get feedback categories

#### **GET /configurations/priorities**
Get priority options

#### **GET /configurations/ratings**
Get rating options

#### **GET /configurations/feature-categories**
Get feature categories

#### **GET /configurations/all**
Get all configurations

## 🔒 **Authentication**

### **JWT Token**
Include in request headers:
```
Authorization: Bearer <your-jwt-token>
```

### **User Roles**
- **client**: Can create and manage own feedback
- **developer**: Can manage features + client permissions
- **admin**: Full access to all resources

## 📝 **Available Scripts**

```bash
# Start development server with nodemon
npm run dev

# Start production server
npm start

# Run tests (if implemented)
npm test

# Check dependencies
npm audit
```

## 📁 **Project Structure**

```
client-pulse-server/
├── controllers/           # Route controllers
│   ├── feedbackController.js
│   ├── featureController.js
│   ├── userController.js
│   ├── otpController.js
│   └── configController.js
├── middleware/           # Custom middleware
│   ├── requireAuth.js
│   └── requireDeveloper.js
├── models/              # MongoDB schemas
│   ├── Feedback.js
│   ├── Feature.js
│   ├── OTP.js
│   └── userModel.js
├── routes/              # API routes
│   ├── feedbackRoute.js
│   ├── featureRoute.js
│   ├── userRoute.js
│   ├── Otp.js
│   └── configRoute.js
├── templates/           # Email templates
│   └── emailTemplates.js
├── server.js           # Main server file
├── package.json
└── .env               # Environment variables
```

## 🚀 **Deployment**

### **Local Deployment**
1. Ensure MongoDB is running
2. Set `NODE_ENV=production` in `.env`
3. Run `npm start`

### **Cloud Deployment**

#### **Heroku**
```bash
# Install Heroku CLI
npm install -g heroku

# Login and create app
heroku login
heroku create your-app-name

# Set environment variables
heroku config:set MONG_URL=your-mongodb-atlas-url
heroku config:set JWT_SECRET=your-jwt-secret
heroku config:set EMAIL_USER=your-email
heroku config:set EMAIL_PASS=your-app-password

# Deploy
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

#### **Railway/Render**
1. Connect your GitHub repository
2. Set environment variables in dashboard
3. Deploy automatically on push

### **Docker Deployment**
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 📊 **Database Schema**

### **User**
```javascript
{
  fullname: String,
  email: String (unique),
  password: String (hashed),
  role: String (client|developer|admin),
  createdAt: Date
}
```

### **Feedback**
```javascript
{
  title: String,
  description: String,
  category: String,
  priority: String,
  rating: Number,
  status: String,
  userId: ObjectId,
  userEmail: String,
  userName: String,
  createdAt: Date,
  updatedAt: Date
}
```

### **Feature**
```javascript
{
  name: String,
  description: String,
  category: String,
  priority: String,
  status: String,
  estimatedHours: Number,
  actualHours: Number,
  version: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔧 **Troubleshooting**

### **Common Issues**

1. **MongoDB Connection Failed**
   - Check MongoDB is running
   - Verify connection string in `.env`
   - Ensure network access for Atlas

2. **JWT Token Invalid**
   - Check JWT_SECRET is set
   - Verify token format in requests

3. **Email OTP Not Sending**
   - Verify email credentials
   - Check Gmail app password
   - Ensure SMTP settings are correct

4. **CORS Errors**
   - Update CORS_ORIGIN in `.env`
   - Check frontend URL matches

## 📄 **License**

This project is licensed under the MIT License.

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 **Support**

For issues and questions:
- Create an issue in the repository
- Check existing documentation
- Review API endpoints and examples

---

**Made with ❤️ for better feedback management** 