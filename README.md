# Steffi Metz Gourmet Shop Website

A full-stack web application for **Steffi Metz / The Gourmet Shop** with a public website and a protected admin dashboard for managing dynamic content, products, events, loyalty tiers, gallery images, orders, newsletters, users, and website settings.

---

## Project Overview

This project contains two main parts:

```text
steffi-metz-app/
├── frontend/
└── backend/
```

### Public Website

Visitors can:

- View dynamic homepage content
- Browse gourmet boxes/products
- View events and experiences
- View loyalty programme tiers
- Order through WhatsApp
- Open the WhatsApp catalogue
- Subscribe to the newsletter
- View shop/contact details
- Place checkout orders

### Admin Dashboard

Authenticated admins can manage:

- Dashboard statistics
- Homepage content
- About section
- Marquee moving text
- Boxes/products
- Events
- Loyalty tiers
- Gallery images
- Testimonials
- Contact messages
- Orders
- Payments
- Newsletter subscribers
- Admin/editor users
- Website settings
- Logo and shop image uploads
- Footer content and social media links

---

## Tech Stack

### Frontend

- React.js
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Lucide React
- React Icons

### Backend

- Node.js
- Express.js
- MySQL2
- JWT authentication
- Bcrypt.js
- Multer
- CORS
- Dotenv
- Nodemon

### Database

- MySQL
- XAMPP/phpMyAdmin for local development

---

## Folder Structure

### Frontend

```text
frontend/
├── public/
│   └── assets/
│
├── src/
│   ├── admin/
│   │   ├── AdminLayout.jsx
│   │   ├── Dashboard.jsx
│   │   ├── HomepageManager.jsx
│   │   ├── AboutManager.jsx
│   │   ├── MarqueeManager.jsx
│   │   ├── BoxesManager.jsx
│   │   ├── EventsManager.jsx
│   │   ├── LoyaltyManager.jsx
│   │   ├── GalleryManager.jsx
│   │   ├── TestimonialsManager.jsx
│   │   ├── ContactMessages.jsx
│   │   ├── OrdersManager.jsx
│   │   ├── PaymentsManager.jsx
│   │   ├── NewsletterManager.jsx
│   │   ├── UsersManager.jsx
│   │   └── SettingsManager.jsx
│   │
│   ├── api/
│   │   ├── axiosConfig.js
│   │   ├── index.js
│   │   ├── authApi.js
│   │   ├── dashboardApi.js
│   │   ├── homepageApi.js
│   │   ├── aboutApi.js
│   │   ├── marqueeApi.js
│   │   ├── boxesApi.js
│   │   ├── eventsApi.js
│   │   ├── loyaltyApi.js
│   │   ├── galleryApi.js
│   │   ├── testimonialsApi.js
│   │   ├── contactApi.js
│   │   ├── ordersApi.js
│   │   ├── newsletterApi.js
│   │   ├── usersApi.js
│   │   └── settingsApi.js
│   │
│   ├── components/
│   │   ├── Layout.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── AdminSidebar.jsx
│   │   ├── AdminTopbar.jsx
│   │   ├── BoxCard.jsx
│   │   ├── SectionTitle.jsx
│   │   ├── FormInput.jsx
│   │   ├── ImageUpload.jsx
│   │   ├── StatCard.jsx
│   │   ├── Marquee.jsx
│   │   ├── CatalogueCTA.jsx
│   │   └── FindShop.jsx
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── data/
│   │   └── siteData.js
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Boxes.jsx
│   │   ├── Events.jsx
│   │   ├── Loyalty.jsx
│   │   ├── Community.jsx
│   │   ├── Checkout.jsx
│   │   ├── Login.jsx
│   │   └── Newsletter.jsx
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── package.json
└── vite.config.js
```

### Backend

```text
backend/
├── config/
│   └── db.js
│
├── controllers/
│   ├── aboutController.js
│   ├── authController.js
│   ├── boxesController.js
│   ├── contactController.js
│   ├── dashboardController.js
│   ├── eventsController.js
│   ├── galleryController.js
│   ├── homepageController.js
│   ├── loyaltyController.js
│   ├── marqueeController.js
│   ├── newsletterController.js
│   ├── ordersController.js
│   ├── paymentsController.js
│   ├── settingsController.js
│   ├── testimonialsController.js
│   └── usersController.js
│
├── middleware/
│   ├── authMiddleware.js
│   ├── errorMiddleware.js
│   ├── uploadMiddleware.js
│   └── validationMiddleware.js
│
├── routes/
│   ├── aboutRoutes.js
│   ├── authRoutes.js
│   ├── boxesRoutes.js
│   ├── contactRoutes.js
│   ├── dashboardRoutes.js
│   ├── eventsRoutes.js
│   ├── galleryRoutes.js
│   ├── homepageRoutes.js
│   ├── loyaltyRoutes.js
│   ├── marqueeRoutes.js
│   ├── newsletterRoutes.js
│   ├── ordersRoutes.js
│   ├── paymentsRoutes.js
│   ├── settingsRoutes.js
│   ├── testimonialsRoutes.js
│   └── usersRoutes.js
│
├── sql/
│   └── steffi_metz_db.sql
│
├── uploads/
│   ├── about/
│   ├── boxes/
│   ├── events/
│   ├── gallery/
│   ├── homepage/
│   ├── settings/
│   └── testimonials/
│
├── utils/
│   ├── deleteFile.js
│   └── generateToken.js
│
├── .env
├── package.json
└── server.js
```

---

## Prerequisites

Install the following before running the project:

- Node.js
- npm
- XAMPP
- MySQL/phpMyAdmin
- Visual Studio Code or another code editor

---

## Local Installation

### 1. Clone or open the project

```bash
cd steffi-metz-app
```

### 2. Install frontend dependencies

```bash
cd frontend
npm install
npm install react-icons
```

### 3. Install backend dependencies

```bash
cd ../backend
npm install
```

---

## Environment Variables

Create this file:

```text
backend/.env
```

Add:

```env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=steffi_metz_db

JWT_SECRET=steffi_metz_secret_key
JWT_EXPIRES_IN=7d

UPLOAD_PATH=uploads
```

If your local MySQL has a password, update:

```env
DB_PASSWORD=your_mysql_password
```

---

## Database Setup

1. Start **Apache** and **MySQL** from XAMPP.
2. Open phpMyAdmin.
3. Import:

```text
backend/sql/steffi_metz_db.sql
```

The database name is:

```text
steffi_metz_db
```

---

## Create the First Admin User

Admin users should not be inserted manually in SQL because passwords must be encrypted.

After starting the backend, send a POST request to:

```text
http://localhost:5000/api/auth/setup-admin
```

Body:

```json
{
  "password": "admin123"
}
```

This creates:

```text
Email: admin@steffi.com
Password: admin123
```

Then login at:

```text
http://localhost:5173/login
```

---

## Running the Project Locally

Start backend:

```bash
cd backend
npm run dev
```

Start frontend:

```bash
cd frontend
npm run dev
```

Open:

```text
http://localhost:5173
```

Backend health check:

```text
http://localhost:5000/api/health
```

Expected response:

```json
{
  "success": true,
  "message": "Backend connected successfully"
}
```

---

## Public Routes

```text
/
/boxes
/events
/loyalty
/community
/checkout
/newsletter
/login
```

---

## Admin Routes

```text
/admin
/admin/homepage
/admin/about
/admin/marquee
/admin/boxes
/admin/events
/admin/loyalty
/admin/gallery
/admin/testimonials
/admin/messages
/admin/orders
/admin/payments
/admin/newsletter
/admin/users
/admin/settings
```

---

## Main API Endpoints

### Auth

```text
POST /api/auth/setup-admin
POST /api/auth/login
GET  /api/auth/me
```

### Dashboard

```text
GET /api/dashboard/stats
```

### Homepage

```text
GET /api/homepage
PUT /api/homepage
PUT /api/homepage/upload
```

### About

```text
GET /api/about
PUT /api/about
PUT /api/about/upload
```

### Marquee

```text
GET    /api/marquee
GET    /api/marquee/admin
POST   /api/marquee
PUT    /api/marquee/:id
DELETE /api/marquee/:id
```

### Boxes

```text
GET    /api/boxes
GET    /api/boxes/search?keyword=value
GET    /api/boxes/:id
POST   /api/boxes
PUT    /api/boxes/:id
DELETE /api/boxes/:id
```

### Events

```text
GET    /api/events
GET    /api/events/search?keyword=value
GET    /api/events/:id
POST   /api/events
PUT    /api/events/:id
DELETE /api/events/:id
```

### Loyalty

```text
GET    /api/loyalty
GET    /api/loyalty/admin
GET    /api/loyalty/:id
POST   /api/loyalty
PUT    /api/loyalty/:id
DELETE /api/loyalty/:id
```

### Gallery

```text
GET    /api/gallery
POST   /api/gallery
PUT    /api/gallery/:id
DELETE /api/gallery/:id
```

### Testimonials

```text
GET    /api/testimonials
GET    /api/testimonials/search?keyword=value
GET    /api/testimonials/:id
POST   /api/testimonials
PUT    /api/testimonials/:id
DELETE /api/testimonials/:id
```

### Contact Messages

```text
POST   /api/contact-messages
GET    /api/contact-messages
GET    /api/contact-messages/search?keyword=value
GET    /api/contact-messages/:id
PUT    /api/contact-messages/:id/read
DELETE /api/contact-messages/:id
```

### Orders

```text
POST   /api/orders
GET    /api/orders
GET    /api/orders/search?keyword=value
GET    /api/orders/:id
PUT    /api/orders/:id/status
PUT    /api/orders/:id/payment-status
DELETE /api/orders/:id
```

### Payments

```text
POST   /api/payments
GET    /api/payments
GET    /api/payments/:id
DELETE /api/payments/:id
```

### Newsletter

```text
POST   /api/newsletters
GET    /api/newsletters
GET    /api/newsletters/search?keyword=value
DELETE /api/newsletters/:id
```

### Users

```text
GET    /api/users
GET    /api/users/search?keyword=value
GET    /api/users/:id
POST   /api/users
PUT    /api/users/:id
PUT    /api/users/:id/password
DELETE /api/users/:id
```

### Settings

```text
GET /api/settings
PUT /api/settings
PUT /api/settings/logo
PUT /api/settings/shop-image
```

---

## Image Uploads

Image uploads are handled by Multer.

Allowed formats:

```text
jpg
jpeg
png
webp
```

Uploads are saved under:

```text
backend/uploads/
```

Uploaded images are served from:

```text
http://localhost:5000/uploads/...
```

---

## Editable Website Sections

### Settings Manager

Controls:

- Site name
- Logo
- WhatsApp number
- Email
- Address
- Instagram URL
- Facebook URL
- TikTok URL
- Catalogue title
- Catalogue description
- Newsletter title
- Newsletter description
- Shop section title
- Opening hours
- Shop image
- Footer description

### Homepage Manager

Controls:

- Location text
- Hero title
- Hero highlight
- Hero description
- Hero buttons
- Hero image

### About Manager

Controls:

- About eyebrow
- About title
- About description
- About quote
- About images

### Marquee Manager

Controls:

- Moving text items
- Sort order
- Active/inactive status

### Loyalty Manager

Controls:

- Tier icon
- Tier name
- Monthly spend
- Discount percentage
- Benefits
- Sort order
- Active/inactive status

---

# Deployment Instructions

This project has three deployment parts:

```text
frontend  → React/Vite static site
backend   → Node.js/Express API
database  → MySQL database
```

Recommended beginner-friendly deployment setup:

```text
Frontend: Vercel
Backend: Render
Database: Railway, PlanetScale, Aiven, DigitalOcean, AWS RDS, or another hosted MySQL provider
Uploads: Render persistent disk or cloud storage
```

---

## 1. Prepare for Deployment

Make sure both frontend and backend work locally:

```bash
cd backend
npm run dev
```

```bash
cd frontend
npm run dev
```

Test:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:5000/api/health
```

Push the full project to GitHub before deploying.

---

## 2. Deploy Backend on Render

Create a new Render Web Service connected to your GitHub repository.

Use these settings:

```text
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

Your backend `package.json` should contain:

```json
{
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js"
  }
}
```

Add production environment variables in Render:

```env
PORT=5000

DB_HOST=your-production-mysql-host
DB_USER=your-production-mysql-user
DB_PASSWORD=your-production-mysql-password
DB_NAME=steffi_metz_db

JWT_SECRET=use_a_long_secure_random_secret
JWT_EXPIRES_IN=7d

UPLOAD_PATH=uploads
```

---

## 3. Configure Backend CORS for Production

Update `backend/server.js` to allow your deployed frontend URL:

```js
const allowedOrigins = [
  'http://localhost:5173',
  'https://your-frontend-domain.vercel.app',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
```

Replace:

```text
https://your-frontend-domain.vercel.app
```

with your real frontend URL.

---

## 4. Deploy Frontend on Vercel

Create a new Vercel project from your GitHub repository.

Use these settings:

```text
Root Directory: frontend
Install Command: npm install
Build Command: npm run build
Output Directory: dist
```

Add this Vercel environment variable:

```env
VITE_API_URL=https://your-backend-domain.onrender.com/api
```

Example:

```env
VITE_API_URL=https://steffi-metz-api.onrender.com/api
```

---

## 5. Frontend API Configuration

Make sure this file exists:

```text
frontend/src/api/axiosConfig.js
```

Recommended content:

```js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
```

---

## 6. Production Database Setup

Use a hosted MySQL service for production.

Import:

```text
backend/sql/steffi_metz_db.sql
```

Then update backend environment variables:

```env
DB_HOST=your-production-host
DB_USER=your-production-user
DB_PASSWORD=your-production-password
DB_NAME=steffi_metz_db
```

---

## 7. Create First Admin in Production

After deploying the backend and database, create the first admin:

```text
POST https://your-backend-domain.onrender.com/api/auth/setup-admin
```

Body:

```json
{
  "password": "admin123"
}
```

Then login using:

```text
Email: admin@steffi.com
Password: admin123
```

Change the password after deployment.

---

## 8. Production Image Uploads

Local uploads are stored in:

```text
backend/uploads/
```

For production, do not rely on temporary server storage unless your provider keeps files permanently.

Recommended options:

### Option A: Persistent Disk

Use a persistent disk on the backend host.

### Option B: Cloud Storage

Use a service such as:

```text
Cloudinary
AWS S3
DigitalOcean Spaces
Firebase Storage
Supabase Storage
```

Cloud storage is recommended for long-term production use.

---

## 9. Production Build Test

Before deploying the frontend, test the production build locally:

```bash
cd frontend
npm run build
npm run preview
```

---

## 10. Deployment Checklist

Before marking deployment complete, check:

- Backend `/api/health` works
- Frontend opens successfully
- Login works
- `/admin` is protected
- Dashboard stats load
- Settings save correctly
- Logo upload works
- Box image upload works
- Events load
- Loyalty tiers update
- Newsletter signup works
- Orders can be created
- Footer settings update correctly
- Social icons open correct links
- CORS does not block requests
- `.env` files are not committed to GitHub
- Production database has all tables

---

## Troubleshooting

### Frontend still calls localhost

Set this in Vercel:

```env
VITE_API_URL=https://your-backend-domain.onrender.com/api
```

Then redeploy frontend.

### CORS error

Add your frontend production domain to the backend CORS allowed origins.

### Images disappear after redeploy

Use persistent disk or cloud storage.

### Login fails

Check:

- Admin user exists
- Backend `/api/auth/login` works
- `JWT_SECRET` is set
- Frontend `VITE_API_URL` is correct

### Social media icons do not show

Install React Icons:

```bash
cd frontend
npm install react-icons
```

Use:

```js
import { FaWhatsapp, FaInstagram, FaFacebookF, FaTiktok } from 'react-icons/fa';
```

---

## Security Notes

- Admin routes are protected with JWT.
- Passwords are hashed using bcrypt.
- Uploads are restricted to image files.
- Change default admin password after setup.
- Keep `.env` files private.
- Use a strong production `JWT_SECRET`.

---

## Future Improvements

Possible improvements:

- Add role-based permissions
- Add payment gateway integration
- Add email notifications
- Add invoice/PDF generation
- Add image compression
- Add analytics dashboard
- Add cloud image storage
- Add database backup/restore scripts
- Add full production Docker setup

---

## Author

Project developed for:

```text
Steffi Metz / The Gourmet Shop
Kigali, Rwanda
```

---

## License

This project is for educational and business website development purposes.
