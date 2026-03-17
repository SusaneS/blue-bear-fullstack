# Maplewood High School – Course Planning System

A full-stack web application that helps students browse courses, build their semester schedule, and track graduation progress.

## Features

- **Course Catalog** – Browse 43 courses across 8 subjects with prerequisites, credit info, and grade-level filters
- **Semester Planner** – Build a semester schedule with automatic conflict and prerequisite checks
- **Graduation Progress** – Track GPA, earned credits per subject, and overall progress toward the 24-credit graduation requirement

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS |
| Backend | Node.js + Express + TypeScript |
| Database | SQLite (better-sqlite3) |

## Quick Start

### Prerequisites
- Node.js ≥ 18

### 1. Install dependencies

```bash
npm run install:all
```

### 2. Start the backend (port 3001)

```bash
npm run dev:backend
```

### 3. Start the frontend (port 3000)

```bash
npm run dev:frontend
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts (root)

| Script | Description |
|--------|-------------|
| `npm run install:all` | Install all dependencies |
| `npm run dev:backend` | Start backend dev server |
| `npm run dev:frontend` | Start frontend dev server |
| `npm run build` | Build both backend and frontend |
| `npm run test` | Run frontend tests |

## Demo Student

The application seeds a demo student **Alex Johnson** (ID: `S001`, Grade 11) with 14 completed courses and a 3.58 GPA so you can explore all features immediately.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/courses` | List all courses (filterable) |
| `GET` | `/api/courses/subjects` | List all subjects |
| `GET` | `/api/students/:id/schedule` | Get semester schedule |
| `POST` | `/api/students/:id/schedule` | Add course (checks conflicts & prereqs) |
| `DELETE` | `/api/students/:id/schedule/:courseId` | Remove course from schedule |
| `GET` | `/api/students/:id/progress` | Get graduation progress & GPA |

