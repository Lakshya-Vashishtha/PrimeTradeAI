# TaskMaster Full-Stack (FastAPI + MySQL + React)

A secure, scalable full-stack application for task management, built with a modern tech stack.

## 🚀 Tech Stack

- **Backend**: FastAPI (Python), SQLAlchemy (Async), MySQL
- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Lucide Icons
- **Auth**: JWT (JSON Web Tokens) with Role-Based Access Control (RBAC)

## 🛠️ Features

- 🔐 **Secure Authentication**: Password hashing (bcrypt) and JWT-based session management.
- 👥 **Role-Based Access**:
  - `User`: Can create, view, and edit their own tasks.
  - `Admin`: Can view all tasks and delete any task.
- 📝 **Task CRUD**: Full Create, Read, Update, and Delete functionality.
- 🎨 **Premium UI**: Responsive design with liquid animations and modern typography.
- 📖 **API Documentation**: Automatic Swagger UI at `/docs`.

## 📦 Setup Instructions

### 1. Database Setup
- Ensure MySQL is running.
- Create a database named `fastapi_db`.
- Database credentials can be configured in `backend/.env`.

### 2. Backend Setup
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
- API will be live at `http://localhost:8000`.
- Documentation: `http://localhost:8000/docs`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
- Frontend will be live at `http://localhost:3000`.

## 📈 Scalability & Future Architecture

To take this from a prototype to a production-grade system handling millions of users, we would implement:

1.  **Horizontal Scaling (Microservices)**:
    *   Decouple the `Auth` and `Task` modules into independent services.
    *   Use a Message Broker (e.g., **RabbitMQ** or **Kafka**) for asynchronous communication between services.

2.  **Advanced Caching Layer**:
    *   Use **Redis** to cache user tokens and frequently accessed "active" tasks to reduce DB load by up to 90%.

3.  **Database Scalability**:
    *   Implement **Read Replicas** to offload `GET` requests from the Master database.
    *   As data grows, implement **Sharding** to distribute load across multiple MySQL instances.

4.  **Edge Performance & Load Balancing**:
    *   Deploy behind an **Nginx** reverse proxy or **AWS ALB** for SSL termination.
    *   Use a **CDN** for assets to reduce server bandwidth and improve global latency.
