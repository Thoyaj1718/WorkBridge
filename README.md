# WorkBridge – Job Board Application

A full-stack job board web application where users can register, login, browse job listings, and apply for jobs.

## 🔗 Live Demo
[https://cheerful-charisma-production-6d68.up.railway.app](https://cheerful-charisma-production-6d68.up.railway.app)

## 🛠️ Tech Stack
- **Frontend:** React.js, Redux, React Router DOM, CSS
- **Backend:** Node.js, Express.js, JWT, bcryptjs
- **Database:** MySQL
- **Deployment:** Railway

## ✨ Features
- User registration and login with JWT authentication
- Browse 50+ job listings across 10 companies
- Filter jobs by employment type, salary, and location
- Apply for jobs
- Responsive UI for desktop and mobile

## 🗄️ Database Schema
- **users** – stores jobseeker and employer accounts
- **companies** – stores company details linked to employers
- **jobs** – stores job listings linked to companies
- **applications** – stores job applications linked to users and jobs

## 🚀 Getting Started

Clone the repo:
```bash
git clone https://github.com/vikramkonidhala/workbridge.git
```

Backend setup:
```bash
cd jobboard-api
npm install
node server.js
```

Frontend setup:
```bash
cd Jobby-App
npm install
npm start
```

DB_HOST=your_mysql_host
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=jobboard
PORT=5000


## 📄 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/jobs | Get all jobs |
| GET | /api/jobs/:id | Get job by ID |
| POST | /api/register | Register new user |
| POST | /api/login | Login user |
| POST | /api/applications | Apply for a job |

## 🔐 Environment Variables
Create a `.env` file in `jobboard-api` folder:
