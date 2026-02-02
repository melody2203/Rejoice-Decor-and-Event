# Rejoice Events & Decor – Readme
## Rejoice Events & Decor Platform

A full-stack, production-ready web platform for event décor booking and inventory rental, built with a luxury gold & white brand identity. The system is designed to support real-world business operations while presenting events in an elegant, modern, and culturally inspired style.

### 🌸 Brand Identity

**Primary Colors**: Gold ✨ & White 🤍

**Design Style**: Elegant, modern, premium, and culturally expressive

**UX Focus**: Clean layouts, smooth navigation, and image-led storytelling

### ✨ Core Features
#### 👤 User Features

* User registration and secure authentication
* Home page with full scroll experience showcasing all services
* Browse Past Works / Gallery by celebration categories:
    * Wedding
    * Birthday
    * Graduation
    * Engagement
    * Others
* Event booking with:
    * Calendar-based date selection
    * Availability checking and conflict prevention
    * Prepayment requirement
* Browse rental inventory by item categories (chairs, curtains, flowers, mats, and décor tools)
* Responsive design for mobile and desktop

#### 📅 Booking & Payment System

* Dedicated booking page
* Event date selection using a calendar
* Price summary before confirmation
* Prepayment support using Ethiopian payment methods:
    * Telebirr
    * CBE Birr
    * Commercial Bank of Ethiopia
    * Awash Bank
* Payments can be handled through selectable payment options with reference or proof-of-payment support where direct APIs are unavailable.

#### 🪑 Rental Inventory System

* Inventory-based rental management (not celebration-based)
* Categories include:
    * Chairs
    * Curtains
    * Floral décor tools
    * Mats & rugs
    * Other event accessories
* Small, clean catalog-style cards displaying:
    * Product image
    * Item name and short description
    * Item-specific pricing (per day / weekend)
    * Rental duration notes

#### 🛠 Admin Features

* Secure admin authentication
* Manage event bookings (pending, approved, completed)
* Manage rental inventory, pricing, and availability
* Upload and organize gallery images and categories
* Control content displayed on Home and Gallery pages
* Track booking and rental activity

### 🎨 UI / UX Design

* Gold accents for premium highlights and call-to-action buttons
* White backgrounds for clarity and elegance
* Consistent spacing, rounded cards, and subtle shadows
* Image-rich Home and Gallery pages
* Clean, information-focused Rentals page

### 🧰 Tech Stack

* **Frontend**: Next.js (React), Tailwind CSS
* **Backend**: Node.js, Express.js
* **Database**: PostgreSQL, Prisma ORM
* **Authentication**: JWT
* **Media Storage**: Cloudinary
* **Deployment**: Vercel (Frontend), Render(Backend), Neon (Database)
