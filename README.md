# Blue Bear Project

Welcome to **Blue Bear** repository.

## Overview

This project aims to demonstrate fullstack development skills, code organization, and engineering best practices across multiple languages. Due to time constraints, the codebase focuses on core functionalities with some areas intentionally left for future improvement.

## Repository Guide

- **Source organization:**  
  The repository is organized to clearly separate backend, frontend, and shared code where appropriate.
- **Features:**  
  - Student profile management
  - Course catalog browsing
  - Course enrollment with validation

## Backend (Spring Boot + Java)
  - **Enrollment Repository Customization:**  
  A custom enrollment repository implementation is used to properly retrieve generated keys (e.g., autoincremented IDs) on insert. This serves as a workaround for default repository limitations observed when mapping inserted entities with their generated keys in some JPA/JDBC contexts.

## Python Scripts
    - **Database Population:**  
    Python scripts are included to generate realistic data for the provided SQLite database. These scripts create course sections table, populate it with time slots, and generate student enrollments for the current semester while respecting prerequisites and other constraints. Script for generating course sections and time slots is `create_course_sections_2.py`, and the script for generating student enrollments is `create_enrollments.py`. The script for generating course sections and its algorithm can for sure be improved, but it should serve the purpose of creating a realistic dataset for testing the scheduling logic.

## Notes & Improvements (Due to Time Constraints)

- Some features and API routes may have additional opportunities for refactoring or generalization as the project grows.
- Certain sections of the code include TODOs and further documentation for clarity and future work.
- Additional unit and integration tests could be added to improve coverage, especially for edge cases (due to time constraints, testing is barely covered sadly).
- Error handling and user feedback mechanisms can always benefit from iterative refinement.
- Handling of asynchronous operations in the frontend can be further improved with better loading states/indicators and error messages.
- Styles (CSS/HTML) can be extended and made more accessible or responsive depending on project scope and feedback (focus was on functionality and state management here).
- Some files, especially on the frontend, may remain from initial project scaffolding and were not fully removed during the initial cleanup.
- The current project structure aims for clarity but may be adapted as new requirements emerge.

---

Thank you for reviewing the Blue Bear project!