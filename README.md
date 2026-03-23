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

## Notes & Improvements (Due to Time Constraints)

- Some features and API routes may have additional opportunities for refactoring or generalization as the project grows.
- Certain sections of the code include TODOs and further documentation for clarity and future work.
- Additional unit and integration tests could be added to improve coverage, especially for edge cases (due to time constraints, testing is barely covered sadly).
- Error handling and user feedback mechanisms can always benefit from iterative refinement.
- Handloading of asynchronous operations in the frontend can be further improved with better loading states and error messages.
- Styles (CSS/HTML) can be extended and made more accessible or responsive depending on project scope and feedback (focus was on functionality and state management here).
- The current project structure aims for clarity but may be adapted as new requirements emerge.

---

Thank you for reviewing the Blue Bear project!