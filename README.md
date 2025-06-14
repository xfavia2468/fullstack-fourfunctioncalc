# Fullstack Four Function Calculator App

This project is a simple fullstack web application built with a **React frontend** and a **Flask backend**, designed as a learning tool for practicing:

* Fullstack development using modern tools
* API design and consumption
* Frontend-backend integration with Docker

Users can enter mathematical expressions in the frontend, which are sent to the backend via an API for evaluation. The result is then returned and displayed.

This setup helps reinforce concepts like HTTP requests, REST APIs, state management, and containerization using Docker and Docker Compose.

---

## React + Flask App Setup

This project contains a React frontend and a Flask backend, running together using Docker Compose.

### Prerequisites

* [Docker](https://www.docker.com/products/docker-desktop)
* [Docker Compose](https://docs.docker.com/compose/install/)

### Project Structure

```
project-root/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── ...other backend files
├── frontend/
│   ├── src/
│   ├── vite.config.ts
│   └── ...other frontend files
├── docker-compose.yml
└── README.md
```

### How to Run the App

1. Clone the repository:

   ```bash
   git clone https://github.com/xfavia2468/fullstack-fourfunctioncalc.git
   cd fullstack-fourfunctioncalc
   ```

2. Build and start the app using Docker Compose:

   ```bash
   docker-compose up --build
   ```

3. Once running, open the following URL:
   * **Frontend (React)**: [http://localhost:3000](http://localhost:3000)
     Optional:
   * **Backend (Flask)**: [http://localhost:5000](http://localhost:5000)

### Stopping the App

To stop everything:

```bash
docker-compose down
```

### Environment Variables

The backend uses a secret key for session management. It's set in `docker-compose.yml` like this:

```yaml
environment:
  - FLASK_SECRET_KEY=your-secret-key
```

### Troubleshooting Tips

* Make sure the frontend uses `/api` routes (e.g., `/api/submit`).
* Vite proxy config in `vite.config.ts` should include:

```ts
proxy: {
  "/api": "http://backend:5000",
}
```

* If ports 3000 or 5000 are in use, you can change them in `docker-compose.yml`.

---
