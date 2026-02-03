# Information Technology Department Website

## A.P. Shah Institute of Technology, Thane

---

### Overview

This repository contains the official website for the Information Technology Department at A.P. Shah Institute of Technology (APSIT). The platform serves as a comprehensive digital presence for the department, showcasing academic programs, student achievements, departmental events, and the Information Technology Students Association (ITSA).

Built with modern web technologies, the website delivers a seamless user experience while providing administrative capabilities for content management.

---

## Features

### Public Portal

| Feature                     | Description                                                                                                 |
| --------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Dynamic Hero Section**    | Auto-rotating image carousel highlighting department activities and announcements                           |
| **Department Overview**     | Comprehensive information about the IT Department including vision, mission, and statistics                 |
| **Value Addition Programs** | Industry partnerships and certification programs including NPTEL, SWAYAM, Oracle Academy, Cisco, and NVIDIA |
| **Hall of Fame**            | Recognition of outstanding student achievements and accomplishments                                         |
| **Media Gallery**           | Masonry-style grid layout with lightbox functionality for images and videos                                 |
| **Events Portal**           | Detailed event listings with individual event pages featuring posters and media galleries                   |
| **ITSA Section**            | Dedicated page for the Information Technology Students Association with podcasts and activities             |
| **Responsive Design**       | Optimized viewing experience across desktop, tablet, and mobile devices                                     |

---

## Technology Stack

| Category             | Technology                     |
| -------------------- | ------------------------------ |
| Framework            | Next.js 16 (React 19)          |
| Database and Storage | Supabase                       |
| Animation Library    | Framer Motion                  |
| Icon Library         | Lucide React                   |
| Styling              | CSS Modules with CSS Variables |

---

## Project Structure

```
├── public/
│   └── assets/              # Static images, logos, and assets
├── src/
│   ├── app/
│   │   ├── about/           # About department page
│   │   ├── admin/           # Administrative panel
│   │   ├── events/          # Events listing and detail pages
│   │   ├── itsa/            # ITSA dedicated page
│   │   ├── globals.css      # Global stylesheet
│   │   ├── layout.js        # Root layout component
│   │   └── page.js          # Homepage
│   ├── components/          # Reusable UI components
│   │   └── Navbar.jsx       # Navigation component
│   └── lib/
│       └── supabaseClient.js    # Supabase configuration
├── database/                # Database schema files
├── .env.local               # Environment variables (not in VCS)
├── .gitignore
├── package.json
└── README.md
```

---

## Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/feature-name`)
3. Commit changes with descriptive messages
4. Push to the feature branch (`git push origin feature/feature-name`)
5. Submit a Pull Request for review
