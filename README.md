<div align="center">

# 🚀 Pathverse

### AI-Powered Career Development & Personalized Learning Platform

Pathverse helps students and aspiring developers discover the right career path, build personalized learning roadmaps, track progress, assess their skills, and improve their resumes with intelligent ATS analysis.

</div>

---

## 📖 About the Project

**Pathverse** is a full-stack AI-powered career development platform designed to turn career goals into structured and actionable learning journeys.

Users provide information about their education, existing skills, experience level, career goals, available learning time, and preferred learning style. Pathverse uses this information to generate a personalized career roadmap.

Users can complete roadmap tasks, monitor their progress through an interactive dashboard, take skill assessments, and analyze their resumes using an ATS scoring system.

The goal of Pathverse is to provide students and aspiring developers with one platform to **plan, learn, track progress, evaluate skills, and improve job readiness**.

---

## ✨ Key Features

* 🤖 **AI-Generated Career Roadmaps** — Personalized learning paths based on the user's skills, goals, experience, and available learning time.

* 📊 **Interactive Dashboard** — View career goals, roadmap progress, completed tasks, learning milestones, and overall progress.

* ✅ **Task & Progress Tracking** — Complete roadmap tasks and automatically update progress across the application.

* 🧠 **Skill Assessments** — Test knowledge, receive scores, and identify areas that need improvement.

* 📄 **Resume Analyzer** — Upload a resume and receive detailed analysis and improvement suggestions.

* 🎯 **ATS Scoring System** — Evaluates resume structure, skills, keyword matching, project relevance, formatting compatibility, content quality, and readability.

* 🔍 **Job Description Matching** — Compare resume skills and keywords with an optional job description for more relevant analysis.

* 💡 **Resume Insights** — View matched keywords, missing skills, strengths, weaknesses, and actionable recommendations.

* 🔐 **Secure Authentication** — User registration, login, protected routes, password hashing, and JWT-based authentication.

* 📱 **Responsive Design** — Optimized user experience across desktop, tablet, and mobile devices.

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* Axios
* React Router

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* REST APIs

### AI & Authentication

* Google Gemini API
* JSON Web Token (JWT)

---

## 📁 Project Structure

```text id="6kt9ah"
Pathverse/
│
├── frontend/          # React + Vite frontend application
│   ├── public/
│   ├── src/
│   └── package.json
│
├── backend/           # Node.js + Express backend API
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── server.js
│
├── .gitignore
├── README.md
└── package.json
```

---

## ⚙️ Environment Variables

Create a `.env` file inside the `frontend` directory:

```env id="n08pjc"
VITE_API_URL=http://localhost:5000/api
```

Create another `.env` file inside the `backend` directory:

```env id="m6r9xa"
PORT=5000
GEMINI_API_KEY=your_gemini_api_key
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
ALLOWED_ORIGINS=http://localhost:5173
```

> Never commit `.env` files or expose API keys, database credentials, or JWT secrets publicly.

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash id="du16ap"
git clone YOUR_REPOSITORY_URL
cd Pathverse
```

### 2. Install Dependencies

Install frontend dependencies:

```bash id="wmlbaf"
cd frontend
npm install
```

Install backend dependencies:

```bash id="f47gt2"
cd ../backend
npm install
```

### 3. Start the Backend Server

```bash id="v8vq7h"
cd backend
npm run dev
```

### 4. Start the Frontend

Open another terminal:

```bash id="ek5bpc"
cd frontend
npm run dev
```

The application will typically run at `http://localhost:5173`.

---

## 🧮 ATS Resume Analysis

Pathverse includes a backend-powered ATS scoring engine that analyzes resumes across multiple categories:

| Category                        | Maximum Score |
| ------------------------------- | ------------: |
| Resume Structure & Completeness |            20 |
| Skills & Keyword Match          |            25 |
| Experience & Project Relevance  |            20 |
| ATS Formatting Compatibility    |            15 |
| Impact & Content Quality        |            10 |
| Grammar & Readability           |            10 |
| **Total**                       |       **100** |

The scoring system is designed to provide consistent results and actionable feedback rather than displaying random or hardcoded scores.

---

## 🔄 How Pathverse Works

```text id="fw73pq"
Create Account
      ↓
Complete Career Profile
      ↓
Generate Personalized AI Roadmap
      ↓
Learn & Complete Tasks
      ↓
Take Skill Assessments
      ↓
Track Progress
      ↓
Analyze Resume & ATS Score
      ↓
Improve Skills and Job Readiness
```

---

## 🌐 Deployment

Pathverse uses a monorepo architecture that allows independent deployment of both applications.

* **Frontend:** Vercel
* **Backend:** Render
* **Database:** MongoDB Atlas

Production URLs and API endpoints are configured using environment variables.

---

## 🔮 Future Improvements

* AI-powered mock interviews
* Resume version comparison
* GitHub profile analysis
* Advanced career analytics
* Coding assessments
* Personalized learning resource recommendations

---

## 👨‍💻 Author

**Abhay Shaw**

B.Tech Computer Science & Engineering (AI & ML) Student

Full-Stack Web Developer | Aspiring Software Development Engineer

GitHub: **CodingWithAbhay**

---

## ⭐ Support

If you find Pathverse useful or interesting, consider giving the repository a ⭐.

Feedback, suggestions, and contributions are welcome.

<div align="center">

### Navigate Your Skills. Build Your Career.

</div>