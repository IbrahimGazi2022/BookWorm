# 📚 BookWorm - Personalized Book Recommendation & Reading Tracker

A full-stack MERN application that helps users discover new books, track their reading progress, write reviews, and get personalized recommendations to enhance their reading habits.


## 🌟 Features

### 🔐 Authentication System
- Secure JWT-based authentication
- Photo upload during registration
- Role-based access control (Admin/User)
- Protected routes with automatic redirection

### 👨‍💼 Admin Features
- **Dashboard:** Visual statistics with interactive charts (books per genre, total users, pending reviews)
- **Book Management:** Complete CRUD operations with cover image upload
- **Genre Management:** Create and manage book categories
- **User Management:** View all users and promote/demote roles
- **Review Moderation:** Approve or delete user-submitted reviews
- **Tutorial Management:** Add and manage YouTube book tutorial links

### 👤 User Features
- **Personalized Dashboard:** 
  - Smart book recommendations based on reading history
  - Reading statistics (books this year, total pages, average rating, reading streak)
  - Interactive charts (favorite genres pie chart, monthly reading bar chart, pages progress line chart)
  - Annual reading goal with circular progress tracker
  
- **My Library:** 
  - Three shelves: Want to Read, Currently Reading, Read
  - Progress tracking for currently reading books (pages read/total pages)
  - Visual progress bars
  
- **Browse Books:** 
  - Advanced search by title/author
  - Multi-select genre filters
  - Rating range filter
  - Sort options (title, rating high/low)
  
- **Book Details:** 
  - Full book information with cover image
  - Average ratings and approved reviews
  - Add books to shelves
  - Write and submit reviews (1-5 star rating + comment)
  
- **Tutorials:** 
  - Embedded YouTube videos
  - Book recommendations and reading tips

### 🎯 Smart Recommendation Engine
- Analyzes user's "Read" shelf for most common genres
- Considers user's average ratings
- Prioritizes books with high community reviews
- Fallback: Shows popular books for new users
- "Why this book?" tooltip explaining recommendations

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library
- **Redux** - State Management
- **React Router** - Navigation
- **Axios** - HTTP requests
- **Recharts** - Data visualization
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Toastify** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads
- **Cloudinary** - Image hosting

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Cloudinary account (for image uploads)

### Backend Setup

1. Clone the repository
```bash
git clone https://github.com/IbrahimGazi2022/BookWorm
cd bookworm/backend
```

2. Install dependencies
```bash
npm install
```

3. Create `.env` file
```env
PORT=8080
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NODE_ENV=development
```

4. Start the server
```bash
npm start
```

### Frontend Setup

1. Navigate to frontend directory
```bash
cd ../frontend
```

2. Install dependencies
```bash
npm install
```

3. Create `.env.local` file
```env
VITE_API_URL=http://localhost:8080
```

4. Start the development server
```bash
npm run dev
```


## 🎨 Key Features Implementation

### Smart Recommendation Algorithm
- Analyzes genre preferences from read books
- Calculates user's average rating behavior
- Considers community approval metrics
- Provides explanatory tooltips

### Progress Tracking
- Real-time progress updates
- Visual progress bars
- Automatic completion detection
- Historical reading data

### Review System
- Three-tier review workflow (Pending → Approved → Published)
- Admin moderation queue
- Rating and comment system
- User profile integration


## 📄 License

This project is created as a job task for Programming Hero.

## 👨‍💻 Author

**Your Name**
- Email: coder.ibrahimgazi@gmail.com
- GitHub: https://github.com/IbrahimGazi2022
- LinkedIn: https://www.linkedin.com/in/ibrahimthecoder
