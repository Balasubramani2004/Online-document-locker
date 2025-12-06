🔐 Online Document Locker (MERN Stack)

A secure, private web application for uploading, storing, and managing personal documents (PDFs, images, etc.). Built as a comprehensive full-stack project using the MERN stack.

🏛️ Project Architecture

This application follows a standard three-tier MERN architecture:

Frontend: React (UI, Routing, API calls)

Backend: Node.js/Express (REST API, JWT Authentication, Multer file handling)

Database: MongoDB (Stores user data and document metadata)

File Storage: Local File System (/backend/uploads)

✨ Key Features

Secure Authentication: User registration and login protected by JWT and bcrypt password hashing.

File Management (CRUD): Complete functionality for uploading, viewing, downloading, renaming, and permanently deleting documents.

File Handling: Uses Multer middleware to process multipart/form-data and save files securely to disk.

Access Control: Strict ownership enforcement—users can only access their own documents via protected routes.

🛠️ Prerequisites

Ensure you have the following installed on your system:

Node.js & npm: (Version 18+ recommended)

MongoDB: Either a local instance (via MongoDB Compass) or a cloud cluster (MongoDB Atlas).

Git

⚙️ Setup and Run Instructions

A. Backend Setup (Server)

Navigate to the backend directory:

cd backend


Install dependencies:

npm install


Create a .env file in the backend/ folder and add your configuration details:

PORT=5000
MONGO_URI="mongodb://localhost:27017/documentLockerDB" 
# OR your MongoDB Atlas URI
JWT_SECRET="YOUR_VERY_STRONG_SECRET_KEY_HERE"


Start the server:

npm run server


The server will run on http://localhost:5000.

B. Frontend Setup (Client)

Navigate to the frontend directory:

cd ../frontend


Install dependencies:

npm install


Start the React application:

npm start


The application will open in your browser at http://localhost:3000.

📂 Folder Structure

document-locker-mern/
├── backend/                     # Node/Express Server
│   ├── config/                  # DB connection
│   ├── controllers/             # Business logic
│   ├── middleware/              # JWT/Multer config
│   ├── models/                  # Mongoose Schemas
│   ├── routes/                  # API endpoints
│   ├── uploads/                 # Storage for physical files (Ignored by Git)
│   └── .env                     # Environment variables (Ignored by Git)
├── frontend/                    # React Client
│   ├── src/                     # Source files
│   │   ├── api/                 # Axios configuration
│   │   ├── components/          # UI components
│   │   └── pages/               # Main view pages
├── .gitignore                   # Files Git must ignore (CRITICAL!)
└── README.md                    # Project documentation
