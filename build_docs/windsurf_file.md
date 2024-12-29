

Windsurf File for Project
Project Overview
Project Name: NextMethod.ai
Description: A web-based platform designed to help enterprise clients conduct AI readiness audits, automate processes, and provide custom upskill training to unlock the potential of AI.
Tech Stack: Frontend with Next.js 14, TypeScript, Tailwind CSS; Backend using Supabase for database, auth, and storage; Optionally integrating AI models like GPT-4 or Claude 3.5 Sonnet.
Key Features: 
- Secure User Accounts & Roles
- Real-Time Readiness & Analytics
- Automated AI Readiness & Compliance Checks
- Built-In Reporting & Exports
- Integration with Common Software Tools
- AI-Driven Skill Gap Analysis & Upskill Recommendations

Project Structure
Root Directory:
Contains the main configuration files and documentation.
/frontend:
Contains all frontend-related code, including components, styles, and assets.
/components:
- Dashboard Components
- Onboarding Wizard Steps
- Training Module Checklists
/assets:
- Logos and brand graphics
- Icon sets (e.g., Lucide Icons)
/styles:
- Tailwind CSS configuration
- Global style sheets
/backend:
Contains all backend-related code, including API routes and database models.
/controllers:
- Readiness Score Calculators
- Training Module Generators
/models:
- User Models
- Analytics Models
/routes:
- API endpoints for User Data
- Integration Webhooks
/config:
Configuration files for environment variables and application settings.
/tests:
Contains unit and integration tests for both frontend and backend.

Development Guidelines
Coding Standards: Follow standard TypeScript and JavaScript conventions with clear JSDoc comments. Focus on clean, maintainable code that adheres to modern best practices.
Component Organization: Group related components and ensure each component follows a reusable and modular design principle.

Windsurf IDE Integration
Setup Instructions: 
1. Clone the repository from version control.
2. Open the project in Windsurf IDE.
3. Follow the setup guide in the README for environment variables and dependencies.
Key Commands: 
- Run development server: `npm run dev`
- Build for production: `npm run build`

Additional Context
User Roles: 
- Admin: Full access including configuration and user management.
- Manager/Department Lead: Access to department-specific dashboards and training modules.
- Team Member: Access to personal tasks and learning plans.
- External Consultant: Limited access for audits.
Accessibility Considerations: Ensure all features maintain high usability standards; employ ARIA roles where appropriate and provide keyboard navigation as well as screen reader support.