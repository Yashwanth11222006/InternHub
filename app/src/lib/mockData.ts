// ── Types ──
export type UserRole = 'student' | 'recruiter';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
    university?: string;
    company?: string;
    skills?: string[];
    bio?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
    education?: string;
    resumeUrl?: string;
}

export type ApplicationStatus = 'Applied' | 'Shortlisted' | 'Interview' | 'Selected' | 'Rejected' | 'offered';

export interface Internship {
    id: string;
    title: string;
    company: string;
    companyLogo?: string;
    duration: string;
    location: string;
    stipend: string;
    skills: string[];
    description: string;
    requirements: string[];
    deadline: string;
    postedDate: string;
    applicantCount: number;
    isOpen: boolean;
    eligibility?: string;
    level?: string;
    postedOn?: string;
}

export interface Application {
    id: string;
    internshipId: string;
    internshipTitle: string;
    company: string;
    status: ApplicationStatus;
    appliedDate: string;
    coverLetter: string;
    portfolioLink?: string;
    resumeUrl?: string;
    timeline: { status: string; date: string; note?: string }[];
}

export interface Applicant {
    id: string;
    name: string;
    email: string;
    university: string;
    skills: string[];
    appliedDate: string;
    status: ApplicationStatus;
    resumeUrl: string;
    coverLetter: string;
}

export interface CommunityPost {
    id: string;
    title: string;
    description: string;
    tags: string[];
    postedBy: string;
    postedDate: string;
    link?: string;
}

// ── Mock Users ──
export const currentStudent: User = {
    id: 'u1',
    name: 'Arjun Mehta',
    email: 'arjun@university.edu',
    role: 'student',
    university: 'IIT Delhi',
    skills: ['React', 'TypeScript', 'Node.js', 'Python', 'Figma'],
    bio: 'Final year CS student passionate about building products.',
    linkedin: 'https://linkedin.com/in/arjunmehta',
    github: 'https://github.com/arjunmehta',
    portfolio: 'https://arjun.dev',
    education: 'B.Tech Computer Science, IIT Delhi (2022–2026)',
    resumeUrl: '/resume.pdf',
};

export const currentRecruiter: User = {
    id: 'r1',
    name: 'Priya Sharma',
    email: 'priya@techcorp.com',
    role: 'recruiter',
    company: 'TechCorp Solutions',
};

// ── Mock Internships ──
export const internships: Internship[] = [
    {
        id: '1',
        title: 'Frontend Developer Intern',
        company: 'TechCorp Solutions',
        duration: '3 months',
        location: 'Remote',
        stipend: '₹25,000/month',
        skills: ['React', 'TypeScript', 'Tailwind CSS'],
        description: 'Join our frontend team to build modern web applications using React and TypeScript. You will work on real projects that impact thousands of users. This role offers hands-on experience with cutting-edge technologies and mentorship from senior engineers.',
        requirements: ['Strong fundamentals in HTML, CSS, JS', 'Experience with React', 'Knowledge of Git', 'Good communication skills'],
        deadline: '2026-03-15',
        postedDate: '2026-02-10',
        applicantCount: 47,
        isOpen: true,
        eligibility: 'Pre-final or final year students in CS/IT',
    },
    {
        id: '2',
        title: 'Backend Engineering Intern',
        company: 'DataFlow Inc.',
        duration: '6 months',
        location: 'Bangalore',
        stipend: '₹30,000/month',
        skills: ['Node.js', 'PostgreSQL', 'Docker', 'REST APIs'],
        description: 'Work with our backend team to design and build scalable APIs and microservices. You will gain experience with cloud deployment, database design, and performance optimization.',
        requirements: ['Proficiency in Node.js or Python', 'Understanding of databases', 'Familiarity with Docker', 'Problem-solving skills'],
        deadline: '2026-03-20',
        postedDate: '2026-02-12',
        applicantCount: 32,
        isOpen: true,
        eligibility: 'CS/IT/ECE students',
    },
    {
        id: '3',
        title: 'UI/UX Design Intern',
        company: 'DesignStudio Pro',
        duration: '2 months',
        location: 'Remote',
        stipend: '₹20,000/month',
        skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping'],
        description: 'Help create beautiful and intuitive user interfaces for our clients. You will participate in the full design process from research to high-fidelity prototypes.',
        requirements: ['Portfolio of design work', 'Proficiency in Figma', 'Understanding of design principles', 'Eye for detail'],
        deadline: '2026-03-01',
        postedDate: '2026-02-08',
        applicantCount: 58,
        isOpen: true,
    },
    {
        id: '4',
        title: 'Data Science Intern',
        company: 'AnalyticsHub',
        duration: '4 months',
        location: 'Hyderabad',
        stipend: '₹35,000/month',
        skills: ['Python', 'Pandas', 'Machine Learning', 'SQL'],
        description: 'Work on real-world data problems, build ML models, and create dashboards. You will be mentored by experienced data scientists.',
        requirements: ['Strong Python skills', 'Knowledge of statistics', 'Experience with ML libraries', 'Analytical mindset'],
        deadline: '2026-04-01',
        postedDate: '2026-02-15',
        applicantCount: 24,
        isOpen: true,
    },
    {
        id: '5',
        title: 'Mobile App Developer Intern',
        company: 'AppWorks Studio',
        duration: '3 months',
        location: 'Mumbai',
        stipend: '₹22,000/month',
        skills: ['React Native', 'JavaScript', 'Firebase'],
        description: 'Build cross-platform mobile applications using React Native. Ship features to production and work in an agile team.',
        requirements: ['Experience with React Native or Flutter', 'Understanding of mobile UI patterns', 'Knowledge of state management'],
        deadline: '2026-03-10',
        postedDate: '2026-02-14',
        applicantCount: 19,
        isOpen: true,
        level: 'Entry-level', // Added
        postedOn: '2026-02-14', // Added
    },
    {
        id: '6',
        title: 'DevOps Intern',
        company: 'CloudNine Tech',
        duration: '3 months',
        location: 'Remote',
        stipend: '₹28,000/month',
        skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
        description: 'Help automate infrastructure and improve deployment pipelines. Work with cutting-edge cloud technologies.',
        requirements: ['Linux fundamentals', 'Basic scripting skills', 'Understanding of cloud concepts'],
        deadline: '2026-02-28',
        postedDate: '2026-02-05',
        applicantCount: 12,
        isOpen: false,
    },
];

// ── Mock Applications ──
export const applications: Application[] = [
    {
        id: 'a1',
        internshipId: '1',
        internshipTitle: 'Frontend Developer Intern',
        company: 'TechCorp Solutions',
        status: 'Shortlisted',
        appliedDate: '2026-02-12',
        coverLetter: 'I am a passionate frontend developer with experience in React and TypeScript. I have built several projects including a task management app and an e-commerce dashboard. I am eager to contribute to TechCorp Solutions and learn from your experienced team.',
        portfolioLink: 'https://arjun.dev',
        resumeUrl: '/resume.pdf',
        timeline: [
            { status: 'Applied', date: '2026-02-12', note: 'Application submitted' },
            { status: 'Shortlisted', date: '2026-02-16', note: 'Profile shortlisted for next round' },
        ],
    },
    {
        id: 'a2',
        internshipId: '3',
        internshipTitle: 'UI/UX Design Intern',
        company: 'DesignStudio Pro',
        status: 'Interview',
        appliedDate: '2026-02-10',
        coverLetter: 'With a strong foundation in design thinking and proficiency in Figma, I am excited about the opportunity to work with DesignStudio Pro. My portfolio showcases various projects ranging from mobile apps to web dashboards.',
        portfolioLink: 'https://arjun.dev/design',
        timeline: [
            { status: 'Applied', date: '2026-02-10' },
            { status: 'Shortlisted', date: '2026-02-13' },
            { status: 'Interview', date: '2026-02-18', note: 'Interview scheduled for Feb 22' },
        ],
    },
    {
        id: 'a3',
        internshipId: '4',
        internshipTitle: 'Data Science Intern',
        company: 'AnalyticsHub',
        status: 'Applied',
        appliedDate: '2026-02-16',
        coverLetter: 'I have a strong background in Python and data analysis. I have completed several ML projects and am eager to apply my skills in a professional setting.',
        timeline: [
            { status: 'Applied', date: '2026-02-16', note: 'Application under review' },
        ],
    },
    {
        id: 'a4',
        internshipId: '6',
        internshipTitle: 'DevOps Intern',
        company: 'CloudNine Tech',
        status: 'Rejected',
        appliedDate: '2026-02-06',
        coverLetter: 'I am interested in cloud infrastructure and automation.',
        timeline: [
            { status: 'Applied', date: '2026-02-06' },
            { status: 'Rejected', date: '2026-02-20', note: 'Position closed' },
        ],
    },
];

// ── Mock Applicants (Recruiter View) ──
export const applicants: Applicant[] = [
    {
        id: 'ap1',
        name: 'Arjun Mehta',
        email: 'arjun@university.edu',
        university: 'IIT Delhi',
        skills: ['React', 'TypeScript', 'Node.js'],
        appliedDate: '2026-02-12',
        status: 'Shortlisted',
        resumeUrl: '/resume.pdf',
        coverLetter: 'Passionate frontend developer with React experience.',
    },
    {
        id: 'ap2',
        name: 'Sneha Gupta',
        email: 'sneha@college.edu',
        university: 'BITS Pilani',
        skills: ['React', 'JavaScript', 'CSS'],
        appliedDate: '2026-02-11',
        status: 'Applied',
        resumeUrl: '/resume.pdf',
        coverLetter: 'Enthusiastic learner with strong frontend fundamentals.',
    },
    {
        id: 'ap3',
        name: 'Rahul Verma',
        email: 'rahul@university.edu',
        university: 'NIT Trichy',
        skills: ['TypeScript', 'Next.js', 'Tailwind'],
        appliedDate: '2026-02-13',
        status: 'Interview',
        resumeUrl: '/resume.pdf',
        coverLetter: 'Full-stack developer with internship experience.',
    },
    {
        id: 'ap4',
        name: 'Kavya Nair',
        email: 'kavya@college.edu',
        university: 'VIT Vellore',
        skills: ['React', 'Python', 'Figma'],
        appliedDate: '2026-02-14',
        status: 'Selected',
        resumeUrl: '/resume.pdf',
        coverLetter: 'Creative developer with design background.',
    },
    {
        id: 'ap5',
        name: 'Manish Kumar',
        email: 'manish@uni.edu',
        university: 'IIIT Hyderabad',
        skills: ['Vue.js', 'JavaScript'],
        appliedDate: '2026-02-15',
        status: 'Rejected',
        resumeUrl: '/resume.pdf',
        coverLetter: 'Looking for frontend development opportunities.',
    },
];

// ── Mock Community Posts ──
export const communityPosts: CommunityPost[] = [
    {
        id: 'c1',
        title: 'Google Summer of Code 2026 Applications Open',
        description: 'GSoC 2026 applications are now open. Great opportunity for open-source enthusiasts. Apply before March 15.',
        tags: ['Open Source', 'Google', 'Summer Program'],
        postedBy: 'Priya Sharma',
        postedDate: '2026-02-18',
        link: 'https://summerofcode.withgoogle.com',
    },
    {
        id: 'c2',
        title: 'Free Full-Stack Development Bootcamp',
        description: 'A 6-week bootcamp covering React, Node.js, and PostgreSQL. Completely free for college students.',
        tags: ['Bootcamp', 'Free', 'Full-Stack'],
        postedBy: 'Arjun Mehta',
        postedDate: '2026-02-17',
        link: 'https://bootcamp.example.com',
    },
    {
        id: 'c3',
        title: 'Resume Writing Tips for Tech Internships',
        description: 'A comprehensive guide on crafting the perfect resume for tech internship applications. Key points on formatting, content, and ATS optimization.',
        tags: ['Career', 'Resume', 'Tips'],
        postedBy: 'Sneha Gupta',
        postedDate: '2026-02-15',
    },
    {
        id: 'c4',
        title: 'Hackathon Alert: BuildForIndia 2026',
        description: '48-hour hackathon focused on solving real Indian problems. Cash prizes worth ₹5 lakhs. Team size: 2-4 members.',
        tags: ['Hackathon', 'Competition', 'Prizes'],
        postedBy: 'Rahul Verma',
        postedDate: '2026-02-14',
        link: 'https://hackathon.example.com',
    },
    {
        id: 'c5',
        title: 'AWS Study Group — Starting Next Week',
        description: 'Forming a study group for AWS Cloud Practitioner certification. Weekly sessions on Sundays. Open for all skill levels.',
        tags: ['AWS', 'Cloud', 'Study Group'],
        postedBy: 'Kavya Nair',
        postedDate: '2026-02-13',
    },
];

// ── Recruiter Stats ──
export const recruiterStats = {
    activeListings: 3,
    totalApplicants: 98,
    shortlisted: 14,
    selected: 4,
};

// ── Student Stats ──
export const studentStats = {
    totalApplications: 4,
    shortlisted: 1,
    interviews: 1,
    offers: 0,
};
