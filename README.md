# 🚀 Intern Hub

**The Ultimate Platform for Aspiring Talent and Progressive Recruiters.**

Intern Hub is a premium, high-impact internship management platform designed to streamline the connection between students looking for career-starting opportunities and recruiters seeking top-tier talent. Built with a focus on **visual excellence**, **real-time data**, and **seamless user journeys**.

---

## ✨ Features

### 🎓 For Students
- **Activity Stream**: Track your application journey with a live, visual timeline from submission to offer.
- **Application Workspace**: A central dashboard to manage and filter your active roles.
- **Premium Detail Pages**: View job requirements, company culture, and eligibility in a beautiful, high-contrast interface.
- **One-Click Apply**: Submit applications instantly using your saved profile and resume.

### 💼 For Recruiters
- **Management Dashboard**: Overview of all active listings with real-time applicant counts.
- **Candidate Pipeline**: Review profiles, access resumes, and manage statuses (Shortlist/Hire/Reject) with a single click.
- **Efficient Posting**: A powerful 'Tag-Based' skill input system for creating detailed internship listings fast.
- **Status Control**: Reactivate or suspend listings instantly based on your hiring needs.

---

## 🛠️ Tech Stack

- **Frontend**: [Next.js 14+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with a Custom High-Contrast Design System
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

---

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- A Supabase Project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/intern-hub.git
   cd intern-hub
   ```

2. **Setup Frontend (`/app`)**
   ```bash
   cd app
   npm install
   cp .env.example .env.local
   # Add your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
   npm run dev
   ```

3. **Database Setup**
   - Run the provided `schema.sql` in your Supabase SQL Editor to initialize the tables (`users`, `student_profiles`, `recruiter_profiles`, `internships`, `applications`).

---

## 📊 Database Architecture

The system relies on a robust PostgreSQL schema:
- **`users`**: Core identity and role management.
- **`internships`**: Stores job details, requirements (using Postgres `TEXT[]` arrays), and statuses.
- **`applications`**: Manages the relationship between students and job posts with unique constraints to prevent duplicates.
- **`community_posts`**: A space for shared resources and announcements.

---

## 🎨 Design Philosophy

Intern Hub uses a **High-Contrast "Premium" Aesthetic**:
- **Primary Color Core**: `#383838` (Deep Charcoal) for professional intensity.
- **Interface**: Glassmorphism elements, rounded geometry (`rounded-[40px]`), and subtle micro-animations for responsiveness.
- **Accessibility**: Bold typography and clear hierarchical spacing ensuring readability at all times.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

Developed with ❤️ by the Intern Hub Team.
