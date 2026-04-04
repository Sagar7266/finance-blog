# 💰 FinanceWise India — Finance Blog Web Application

A **production-ready**, full-stack Finance Blog Web Application built for Indian users.

---

## 🧱 Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Backend    | Java 17, Spring Boot 3.2, JPA     |
| Database   | MySQL 8.0                         |
| Frontend   | React 18, Tailwind CSS 3          |
| Auth       | JWT (JSON Web Tokens)             |
| Editor     | React Quill (rich text)           |

---

## ✨ Features

- **Blog System** — CRUD, categories, SEO-friendly slugs, rich text editor
- **Admin Panel** — JWT-secured dashboard, post/category/comment management
- **Finance Calculators** — EMI, SIP, Tax (Old/New regime), FD, PPF
- **Dark/Light Mode** — System-aware theme toggle
- **SEO Optimised** — Meta tags, OG tags, sitemap-ready
- **Comment System** — Public submission + moderation queue
- **Search** — Full-text search across posts
- **Responsive** — Mobile-first design

---

## 📋 Prerequisites

| Tool        | Version     | Download                                    |
|-------------|-------------|---------------------------------------------|
| Java JDK    | 17+         | https://adoptium.net                        |
| Maven       | 3.8+        | https://maven.apache.org/download.cgi       |
| Node.js     | 18+         | https://nodejs.org                          |
| MySQL       | 8.0+        | https://dev.mysql.com/downloads/mysql/      |
| Git         | Any         | https://git-scm.com                         |

---

## 🚀 Local Setup (Step-by-Step)

### Step 1 — Clone / Extract Project

```bash
# If using git
git clone <repo-url>
cd finance-blog

# Or just extract the ZIP and cd into it
cd finance-blog
```

---

### Step 2 — MySQL Database Setup

```sql
-- Open MySQL shell
mysql -u root -p

-- Run these commands:
CREATE DATABASE IF NOT EXISTS finance_blog
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

EXIT;
```

> The Spring Boot app will **auto-create all tables** on first run (ddl-auto=update).

**Then seed sample data (optional but recommended):**
```bash
mysql -u root -p finance_blog < database/init.sql
```

---

### Step 3 — Configure Database Credentials

Edit `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/finance_blog?useSSL=false&serverTimezone=Asia/Kolkata&allowPublicKeyRetrieval=true
spring.datasource.username=root       # ← Change to your MySQL username
spring.datasource.password=root       # ← Change to your MySQL password
```

---

### Step 4 — Run the Backend

```bash
cd backend

# Install dependencies and run
./mvnw spring-boot:run

# OR on Windows:
mvnw.cmd spring-boot:run

# OR build JAR and run:
./mvnw clean package -DskipTests
java -jar target/finance-blog-backend-1.0.0.jar
```

✅ Backend starts at: **http://localhost:8080/api**

On first run, it auto-creates:
- `admin` user (password: `Admin@123`)
- `author` user (password: `Author@123`)

---

### Step 5 — Run the Frontend

Open a **new terminal**:

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

✅ Frontend starts at: **http://localhost:3000**

---

## 🔑 Default Login Credentials

| Role   | Username | Password   | Access               |
|--------|----------|------------|----------------------|
| Admin  | admin    | Admin@123  | Full admin access    |
| Author | author   | Author@123 | Create/edit posts    |

**Admin Panel URL:** http://localhost:3000/admin/login

---

## 📁 Project Structure

```
finance-blog/
├── backend/                          # Spring Boot application
│   ├── src/main/java/com/financeblog/
│   │   ├── config/                   # Security, CORS, Data init
│   │   ├── controller/               # REST API controllers
│   │   ├── dto/                      # Request/Response DTOs
│   │   ├── entity/                   # JPA entities
│   │   ├── exception/                # Custom exceptions
│   │   ├── repository/               # Spring Data repositories
│   │   ├── security/                 # JWT auth filter, utils
│   │   └── service/                  # Business logic
│   ├── src/main/resources/
│   │   └── application.properties    # App configuration
│   └── pom.xml                       # Maven dependencies
│
├── frontend/                         # React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── blog/PostCard.jsx      # Reusable post card
│   │   │   └── layout/               # Navbar, Footer, AdminLayout
│   │   ├── context/                  # Auth + Theme contexts
│   │   ├── pages/                    # Route page components
│   │   │   ├── HomePage.jsx
│   │   │   ├── BlogListPage.jsx
│   │   │   ├── BlogDetailPage.jsx
│   │   │   ├── CategoryPage.jsx
│   │   │   ├── SearchPage.jsx
│   │   │   ├── ToolsPage.jsx         # EMI, SIP, Tax calculators
│   │   │   └── admin/                # Admin CRUD pages
│   │   ├── utils/
│   │   │   ├── api.js                # Axios API client
│   │   │   └── helpers.js            # Date, currency utils
│   │   └── styles/index.css          # Tailwind + custom CSS
│   ├── package.json
│   └── tailwind.config.js
│
├── database/
│   └── init.sql                      # Seed data script
│
└── docs/
    └── README.md                     # This file
```

---

## 🌐 API Endpoints Reference

### Auth
| Method | Endpoint            | Access  | Description       |
|--------|---------------------|---------|-------------------|
| POST   | /api/auth/login     | Public  | Login with JWT    |
| POST   | /api/auth/register  | Public  | Register user     |
| GET    | /api/auth/me        | Auth    | Current user info |

### Posts
| Method | Endpoint                     | Access       | Description          |
|--------|------------------------------|--------------|----------------------|
| GET    | /api/posts                   | Public       | List published posts |
| GET    | /api/posts/featured          | Public       | Featured posts       |
| GET    | /api/posts/search?q=         | Public       | Search posts         |
| GET    | /api/posts/category/{slug}   | Public       | Posts by category    |
| GET    | /api/posts/{slug}            | Public       | Single post + incr view |
| POST   | /api/posts                   | Admin/Author | Create post          |
| PUT    | /api/posts/{id}              | Admin/Author | Update post          |
| DELETE | /api/posts/{id}              | Admin        | Delete post          |
| GET    | /api/posts/admin/all         | Admin/Author | All posts (admin)    |

### Categories
| Method | Endpoint              | Access | Description       |
|--------|-----------------------|--------|-------------------|
| GET    | /api/categories       | Public | All categories    |
| POST   | /api/categories       | Admin  | Create category   |
| PUT    | /api/categories/{id}  | Admin  | Update category   |
| DELETE | /api/categories/{id}  | Admin  | Delete category   |

### Comments
| Method | Endpoint                          | Access | Description        |
|--------|-----------------------------------|--------|--------------------|
| POST   | /api/posts/{id}/comments          | Public | Submit comment     |
| GET    | /api/posts/{id}/comments          | Public | Approved comments  |
| GET    | /api/admin/comments               | Admin  | All comments       |
| PATCH  | /api/admin/comments/{id}/status   | Admin  | Approve/Reject     |
| DELETE | /api/admin/comments/{id}          | Admin  | Delete comment     |

### Dashboard
| Method | Endpoint                    | Access       | Description   |
|--------|-----------------------------|--------------|---------------|
| GET    | /api/admin/dashboard/stats  | Admin/Author | Blog stats    |

---

## 🧮 Finance Calculators

| Calculator   | Path              | Features                             |
|--------------|-------------------|--------------------------------------|
| EMI          | /tools/emi        | Loan EMI, total interest, principal% |
| SIP          | /tools/sip        | Future value, gain, return multiple  |
| Tax          | /tools/tax        | Old/New regime, effective rate       |
| FD           | /tools/fd         | Maturity, quarterly/annual compounding|
| PPF          | /tools/ppf        | 15yr+ PPF returns at 7.1%            |

---

## 🔒 Security

- JWT tokens expire in 24 hours (configurable in `application.properties`)
- Passwords are BCrypt-encrypted
- CORS is configured for `http://localhost:3000`
- Admin endpoints require `ROLE_ADMIN` or `ROLE_AUTHOR`
- Comment submission is public (with moderation queue)

---

## 🛠️ Production Deployment

### Backend (Build JAR)
```bash
cd backend
./mvnw clean package -DskipTests
java -jar target/finance-blog-backend-1.0.0.jar \
  --spring.datasource.url=jdbc:mysql://PROD_HOST:3306/finance_blog \
  --spring.datasource.username=PROD_USER \
  --spring.datasource.password=PROD_PASSWORD \
  --app.jwt.secret=YOUR_SUPER_SECRET_KEY_MIN_32_CHARS \
  --app.cors.allowed-origins=https://yourdomain.com
```

### Frontend (Build for production)
```bash
cd frontend
REACT_APP_API_URL=https://api.yourdomain.com/api npm run build
# Deploy the /build folder to Netlify, Vercel, or Nginx
```

---

## 🎨 Customisation

### Change site name / branding
Edit `frontend/src/components/layout/Layout.jsx` — search for "FinanceWise"

### Change primary color
Edit `frontend/tailwind.config.js` → `theme.extend.colors.primary`

### Add more categories
Go to Admin Panel → Categories → New Category

### Change JWT expiry
`application.properties` → `app.jwt.expiration=86400000` (ms, default 24h)

---

## 📦 Dependencies

### Backend (Maven)
- Spring Boot 3.2 (Web, JPA, Security)
- MySQL Connector
- JJWT 0.11.5
- Lombok
- Spring Validation

### Frontend (npm)
- React 18 + React Router 6
- @tanstack/react-query (data fetching)
- Tailwind CSS 3
- React Quill (rich text editor)
- React Helmet Async (SEO meta tags)
- React Hot Toast (notifications)
- Axios (HTTP client)
- date-fns (date formatting)

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Backend won't start | Check MySQL is running and credentials in `application.properties` |
| CORS errors | Ensure `app.cors.allowed-origins=http://localhost:3000` |
| JWT errors | Ensure secret key is at least 32 characters |
| npm install fails | Delete `node_modules` and `package-lock.json`, retry |
| Tables not created | Check `spring.jpa.hibernate.ddl-auto=update` |
| 401 on admin | Re-login; token may have expired |

---

## 📞 Support

Built with ❤️ for Indian finance enthusiasts. For customisation or deployment help, contact your developer.

> **Disclaimer:** This blog is for educational purposes only. Always consult a SEBI-registered financial advisor before making investment decisions.
