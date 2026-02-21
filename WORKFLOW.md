# Intern Hub — Application Workflow & Structure

This document outlines the architecture, page structure, and user flows of the Intern Hub platform.

## 🏗️ Architecture Overview
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4 (Modern theme engine)
- **Animations**: Framer Motion (Smooth UI transitions)
- **Components**: Custom library + Radix UI Primitives (Shadcn-style)
- **Data**: Mock data layer in `src/lib/mockData.ts`

## 🛤️ Page Structure

### 🌐 Public Pages (Route Group: `(public)`)
- `/` — **Landing Page**: Feature highlights, hero section, trust indicators.
- `/login` — **Login**: Dual-role login with demo access buttons.
- `/signup` — **Role Split**: Choose between Student or Recruiter signup.
- `/signup/student` — **Student Registration**: Profile creation for job seekers.
- `/signup/recruiter` — **Recruiter Registration**: Company profile setup.

### 🎓 Student Flow (Route Group: `(dashboard)`)
- `/dashboard/student` — **Student Home**: Dashboard with stats, recent apps, and recommended internships.
- `/internships` — **Browse Internships**: Search/Filterable listing of all open roles.
- `/internships/[id]` — **Job Details**: Full description, requirements, and "Apply" entry point.
- `/internships/[id]/apply` — **Application Form**: Submit cover letter and resume.
- `/applications` — **My Applications**: Track status (Applied -> Selected/Rejected).
- `/applications/[id]` — **App History**: Vertical timeline and submission details.

### 💼 Recruiter Flow (Route Group: `(dashboard)`)
- `/dashboard/recruiter` — **Recruiter Home**: Performance stats and internal internship list.
- `/recruiter/internships` — **Management**: List of all internships posted by the recruiter.
- `/recruiter/internships/new` — **Post Job**: Multi-section form for creating listings.
- `/recruiter/internships/[id]/edit` — **Update Job**: Edit existing job details.
- `/recruiter/internships/[id]/applicants` — **Applicant Tracking**: Review candidates, filter by status, and shortlisted talent via modal.

### 🤝 Shared/Community (Route Group: `(dashboard)`)
- `/community` — **Feed**: Peer-to-peer sharing of opportunities and events.
- `/community/new` — **Post**: Create a community update.
- `/community/[id]` — **Detail**: View specific community discussion.
- `/profile` — **Settings**: Edit personal/company info, upload resume, and social links.

## 🔄 Core User Workflows

### 1. The "Find & Apply" Workflow (Student)
1. Landing Page -> Signup/Login.
2. Navigate to **Browse Internships**.
3. Use Search/Filter to find a role.
4. View **Internship Detail**.
5. Click **Apply Now** -> Fill form -> Submit.
6. Redirect to **My Applications** to track the vertical timeline.

### 2. The "Hire" Workflow (Recruiter)
1. Recruiter Signup/Login.
2. Click **New Internship** on Dashboard.
3. Fill job details and publish.
4. Monitoring on **My Internships** (see applicant counts).
5. Click **View Applicants** to see the candidate table.
6. Open **Applicant Detail Modal** to review cover letters/resumes.
7. Update Status (Shortlist/Reject).

## 🎨 Design System & UI Components
- **Buttons**: Variable variants (Primary, Ghost, Secondary) with Framer Motion feedback.
- **Cards**: Animated entry and hover-lift states.
- **Badges**: Color-coded status indicators.
- **Tabs**: Radix-powered semantic switching for dashboard sections.
- **Vertical Timelines**: High-contrast tracking for application progress.
