# NEURA-DEMO

A full-stack application composed of a Next.js frontend, an Express Node.js backend, and a Python FastAPI AI service.

## Project Structure

- **`frontend/`**: The user interface, built with Next.js and styled with Tailwind CSS.
- **`backend/`**: The primary Node.js server using Express and MongoDB (via Mongoose). Includes middleware and API routes.
- **`ai-service/`**: Python-based AI microservice using FastAPI and Uvicorn.
- **`docs/`**: API contracts, flow diagrams, and general application documentation.

## Branching Strategy

This repository uses a standard Git workflow to ensure stability:
- **`main`**: The production-ready branch. Code here should always be stable and deployable.
- **`dev`**: The active integration branch. All features merge here for testing before reaching production.
- **`feature/*`**: Feature branches. **All new work should happen in these branches.**

## How to Contribute

1. **Get the latest `dev` branch:**
   ```bash
   git checkout dev
   git pull origin dev
   ```

2. **Create a new feature branch:**
   Make sure you always branch off `dev`, not `main`.
   ```bash
   git checkout -b feature/short-description
   ```

3. **Make your changes:**
   Work on your specific frontend, backend, or ai-service tasks.

4. **Commit your work:**
   Commit with clear, descriptive messages.
   ```bash
   git add .
   git commit -m "Add meaningful description of the feature"
   ```

5. **Push and Create a Pull Request:**
   ```bash
   git push -u origin feature/short-description
   ```
   Open a Pull Request (PR) on GitHub against the **`dev`** branch to get your code code-reviewed and merged.
