# AI-Powered ATS (Applicant Tracking System)

## 📌 Project Description
AI-Powered ATS is a next-generation Applicant Tracking System that revolutionizes the recruitment process by seamlessly integrating Artificial Intelligence. Designed to solve the inefficiencies of traditional hiring, this platform delivers an end-to-end, highly automated, and data-driven experience for all stakeholders involved in the hiring lifecycle.

### 🌟 Core Value Proposition
- **Smart Matching**: AI algorithms analyze applicant resumes against job descriptions to provide instant suitability scores.
- **Automated Workflows**: Streamlines repetitive tasks like email notifications, status updates, and interview scheduling.
- **Data-Driven Insights**: Provides employers with actionable analytics to optimize their hiring pipeline.

### 🎭 Dedicated User Roles & Features

#### 👩‍💼 For Candidates
The candidate portal is designed to provide a frictionless job discovery and application experience.
- **Intelligent Job Search**: Context-aware search engine that recommends jobs based on the candidate's skills and search history.
- **Smart Profile & Resume Builder**: Candidates can upload their resumes, and the system automatically extracts and categorizes their experience, education, and skills.
- **Application Tracking**: A dedicated dashboard to monitor the real-time status of all submitted applications, upcoming interviews, and saved jobs.

#### 🏢 For Employers (HR & Recruiters)
A comprehensive command center for managing the entire hiring pipeline.
- **Job Management**: Effortlessly draft, publish, and manage job listings. Customize application forms per job.
- **Applicant Tracking System (ATS) Pipeline**: Visual Kanban-style board to drag and drop candidates through different hiring stages (Screening, Interview, Offer, Hired).
- **AI Screening & Shortlisting**: Instantly view AI-generated match scores and summaries for each applicant, significantly reducing manual resume screening time.
- **Interview Scheduling**: Built-in calendar integration to seamlessly schedule interviews and send automated invitations.
- **Team Collaboration**: Invite team members, assign specific roles, and leave internal notes/evaluations on applicant profiles.

#### 🛡️ For Administrators
The backbone of the platform, providing ultimate control over the system's operations.
- **Platform Analytics**: Monitor overall platform health, user registration metrics, and job posting trends.
- **User & Company Management**: Ability to verify legitimate employers, manage system-wide access, and handle support escalations.
- **System Configuration**: Manage global settings, predefined lists (e.g., job categories), and platform-wide role configurations.

## 🚀 Technology Stack (Frontend)
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v7
- **Animations & Interactions**: Motion (Framer Motion), @hello-pangea/dnd
- **Data Visualization**: Recharts
- **Containerization**: Docker & Docker Compose (Nginx for production serving)

## 📁 Frontend Project Structure
The frontend codebase follows a **feature-based modular architecture**. This keeps related code together, ensuring high maintainability and scalability as the application grows.

```text
frontend/
├── Dockerfile                  # Docker multi-stage build configuration
├── nginx.conf                  # Nginx configuration for serving the SPA
├── package.json                # Project dependencies and NPM scripts
├── vite.config.ts              # Vite bundler configuration
└── src/
    ├── app/                    # Application core (App entry, global providers, root routing setup)
    ├── assets/                 # Static assets (images, icons, global styles)
    ├── components/             # Global components
    │   ├── ui/                 # Basic dumb components (Button, Input, Badge, etc.)
    │   └── shared/             # Generic UX components (Loading, EmptyState, Pagination, etc.)
    ├── config/                 # Global configurations
    │   ├── constants.ts
    │   ├── env.ts
    │   ├── navigation.ts
    │   └── access-control/     # Role-based access control setup
    │       ├── permissions.ts
    │       ├── rolePermissions.ts
    │       └── roles.ts
    ├── features/               # Feature-based modules containing business logic
    │   ├── admin-companies/
    │   │   └── pages/AdminCompanies.tsx
    │   ├── admin-dashboard/
    │   │   └── pages/AdminDashboard.tsx
    │   ├── admin-users/
    │   │   └── pages/AdminUsers.tsx
    │   ├── applicant-tracking/
    │   │   └── pages/
    │   │       ├── ApplicantTracking.tsx
    │   │       └── InterviewCalendar.tsx
    │   ├── authentication/     # Example of a "thick" feature with API & State
    │   │   ├── api/auth.api.ts
    │   │   ├── store/auth.store.ts
    │   │   └── pages/
    │   │       ├── AcceptInvite.tsx
    │   │       ├── Login.tsx
    │   │       └── Register.tsx
    │   ├── candidate-applications/
    │   │   └── pages/
    │   │       ├── AppliedJobs.tsx
    │   │       └── SavedJobs.tsx
    │   ├── candidate-dashboard/
    │   │   └── pages/CandidateDashboard.tsx
    │   ├── candidate-profile/
    │   │   └── pages/ProfileSetup.tsx
    │   ├── company-management/
    │   │   └── pages/
    │   │       ├── CompanyProfile.tsx
    │   │       └── CompanyUsers.tsx
    │   ├── email-templates/
    │   │   └── pages/EmailTemplates.tsx
    │   ├── employer-dashboard/
    │   │   └── pages/EmployerDashboard.tsx
    │   ├── job-details/
    │   │   └── pages/
    │   │       ├── CandidateJobDetail.tsx
    │   │       └── JobDetail.tsx
    │   ├── job-management/     # Example of a "thick" feature with API
    │   │   ├── api/job.api.ts
    │   │   └── pages/
    │   │       ├── EmployerJobs.tsx
    │   │       └── PostJob.tsx
    │   ├── job-search/
    │   │   └── pages/
    │   │       ├── CandidateJobSearch.tsx
    │   │       ├── JobBoard.tsx
    │   │       └── PublicJobSearch.tsx
    │   ├── platform-settings/
    │   │   └── pages/AdminSettings.tsx
    │   └── user-settings/
    │       └── pages/Settings.tsx
    ├── hooks/                  # Global reusable React hooks
    ├── layouts/                # Shared page layouts
    │   ├── AdminLayout.tsx
    │   ├── AuthLayout.tsx
    │   ├── CandidateLayout.tsx
    │   ├── EmployerLayout.tsx
    │   └── PublicLayout.tsx
    ├── providers/              # React Providers
    │   ├── QueryProvider.tsx
    │   └── ThemeProvider.tsx
    ├── routes/                 # Application routing logic and guards
    │   ├── AppRouter.tsx
    │   └── RouteGuard.tsx
    ├── services/               # Core external services (Axios instance, QueryClient)
    ├── store/                  # Global state management (Theme, Notification, etc.)
    ├── types/                  # Global TypeScript type definitions
    │   ├── api.ts
    │   └── common.ts
    └── utils/                  # Global helper functions and utilities
```

## 🛠️ Getting Started

### Prerequisites
- Node.js (v20+ recommended)
- Docker & Docker Compose (optional, for containerized environments)

### Run Locally (Without Docker)
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set the required environment variables (if applicable):
   Copy `.env.example` to `.env` and fill in the appropriate values.
4. Run the development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:3000`.

### Run with Docker Compose
To build and run the entire application stack (including the frontend in a production-like Nginx container):
```bash
# From the root directory (d:\ai-powered-ats)
docker-compose up --build -d
```
