# Deployment Guide

This guide outlines how to deploy the Enterprise OCR Platform to various cloud providers.

## 1. Docker Compose (Any Cloud VM - AWS EC2, DigitalOcean Droplet, Azure VM)

The simplest way to deploy the application is using `docker-compose`.

### Prerequisites
- A virtual machine with Ubuntu 22.04 (or similar).
- Docker and Docker Compose installed.
- Git installed.

### Steps
1. Clone the repository to your server:
   ```bash
   git clone <your-repository-url>
   cd text-extractor
   ```

2. Configure environment variables (optional, defaults are provided in `docker-compose.yml`):
   ```bash
   export POSTGRES_PASSWORD=your_secure_password
   export SECRET_KEY=your_secure_jwt_secret
   ```

3. Build and start the containers in detached mode:
   ```bash
   docker-compose up -d --build
   ```

4. The application is now accessible at `http://<your-server-ip>`. The backend API and Swagger docs are available at `http://<your-server-ip>/api/v1/docs` (if NGINX is configured to forward properly, or `http://<your-server-ip>:8000/docs`).

## 2. AWS Elastic Container Service (ECS) with Fargate

For a fully managed, scalable deployment:

1. **Push Images to Amazon ECR:**
   - Create ECR repositories for `ocr-frontend` and `ocr-backend`.
   - Build, tag, and push your Docker images to ECR.

2. **Database:**
   - Provision an Amazon RDS PostgreSQL instance.
   - Note the endpoint URL, username, and password.

3. **Task Definition:**
   - Create a new Fargate Task Definition.
   - Add two containers: Frontend and Backend.
   - For Backend, pass the RDS credentials via environment variables (`POSTGRES_SERVER`, `POSTGRES_USER`, etc.).
   - Expose port 80 for the Frontend container.

4. **Service & Load Balancer:**
   - Create an ECS Service from your Task Definition.
   - Attach an Application Load Balancer (ALB) routing port 80 to the Frontend container.
   - Configure path-based routing on the ALB if you want `/api/*` to route directly to the backend container (port 8000), alternatively keep the NGINX proxy.

## 3. Google Cloud Run

Cloud Run is ideal for stateless containers. Since our backend stores images locally in `uploads/`, you must use **Cloud Storage** instead of local files for a true production deployment on Cloud Run.

1. Modify `routers/ocr.py` to upload files to a GCS bucket instead of the local filesystem.
2. Build and push your backend image to Google Artifact Registry.
3. Deploy to Cloud Run:
   ```bash
   gcloud run deploy ocr-backend --image gcr.io/your-project/ocr-backend --platform managed
   ```
4. Deploy the frontend separately on Firebase Hosting, Vercel, or another Cloud Run service.

## Security Considerations

- **Secrets Management:** Never hardcode `SECRET_KEY` or `POSTGRES_PASSWORD`. Use AWS Secrets Manager, Azure Key Vault, or simple environment variables.
- **HTTPS:** Always configure SSL/TLS. If using EC2/Droplet, install `certbot` and use Let's Encrypt with NGINX. If using ALBs, use AWS Certificate Manager (ACM).
- **Storage:** For production, move `uploads/` to AWS S3, Azure Blob Storage, or Google Cloud Storage to prevent data loss if the container restarts.





Method 1: Using Docker Compose (Recommended)
Since your backend relies on a PostgreSQL database, Docker Compose will automatically start the database alongside your frontend and backend, configure the network for them to communicate, and set up all the necessary environment variables.

Open your terminal and navigate to the root directory of your project (c:\Users\JN Chandana\OneDrive\Desktop\text-extractor).

Build and start the containers by running the following command:

docker-compose up --build

bash
docker-compose build --no-cache
docker-compose up

Note: --build ensures the images are built freshly, and -d runs the containers in the background (detached mode).

Check the status of your running containers:

bash
docker-compose ps
Access your application:

Frontend: Open your browser and go to http://localhost (or http://localhost:80)
Backend API Docs: Open http://localhost:8000/docs
To stop the containers when you're done:

bash
docker-compose down
Method 2: Building and Running Individually (Without Docker Compose)
If you want to build and run the frontend and backend Docker containers manually (e.g., for testing the images individually), you can use the standard Docker commands. Note that the backend container will likely fail to start fully if it cannot connect to a PostgreSQL database.

For the Backend:
Navigate to the backend directory:
bash
cd backend
Build the backend image:
bash
docker build -t text-extractor-backend -f Dockerfile.backend .
Run the backend container:
bash
docker run -d -p 8000:8000 --name text-backend text-extractor-backend
(Note: For the backend to work properly this way, you would also need to pass the Postgres environment variables like -e POSTGRES_SERVER=...)
For the Frontend:
Navigate to the frontend directory:
bash
cd frontend
Build the frontend image:
bash
docker build -t text-extractor-frontend -f Dockerfile.frontend .
Run the frontend container:
bash
docker run -d -p 80:80 --name text-frontend text-extractor-frontend



http://localhost

http://localhost:8000/docs 