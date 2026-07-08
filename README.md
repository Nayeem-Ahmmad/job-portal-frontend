# 🏢 Job Portal BD — Full Stack Web Application

A complete job portal web application built with Django REST Framework and React.js

## 🔗 Links
- **Backend:** https://github.com/Nayeem-Ahmmad/job_portal
- **Frontend:** https://github.com/Nayeem-Ahmmad/job-portal-frontend

## 🛠️ Tech Stack

### Backend
- Python, Django, Django REST Framework
- JWT Authentication (SimpleJWT)
- Celery + Redis (Background tasks)
- SQLite (Development)

### Frontend
- React.js + Vite
- Tailwind CSS
- Axios
- React Router DOM

## ✨ Features

### Authentication
- JWT-based login/logout
- Role-based access (Job Seeker, Employer, Admin)
- Auto token refresh

### Job Seeker
- Profile management (bio, skills, education, experience)
- Job search with filters (title, location, salary, type)
- One-click job apply with cover letter
- Application tracking (pending/accepted/rejected)
- Save/bookmark jobs

### Employer
- Company profile management
- Post, update, delete jobs
- View applicants with cover letters
- Accept/reject applications

### Admin
- Dashboard with statistics
- Manage users, companies, jobs
- View all applications

### Notifications
- Real-time notifications via Django Signals
- Mark as read / Mark all as read

## 🚀 Installation

### Backend Setup
```bash
git clone https://github.com/Nayeem-Ahmmad/job_portal.git
cd job_portal
python -m venv env
source env/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend Setup
```bash
git clone https://github.com/Nayeem-Ahmmad/job-portal-frontend.git
cd job-portal-frontend
npm install
npm run dev
```

## 👨‍💻 Developer
**Nayeem Ahmmad**
- GitHub: [@Nayeem-Ahmmad](https://github.com/Nayeem-Ahmmad)
- Codeforces: [nayeem17](https://codeforces.com/profile/nayeem17)