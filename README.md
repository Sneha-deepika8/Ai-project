# FinPulse AI – Smart Personal Finance & Goal Planner

FinPulse AI is a full-stack personal finance management application. Users can securely register and log in, track income and expenses, get automatic spending analysis, set savings goals with progress tracking, and receive AI-generated, personalized financial insights.



## Features

- Secure registration/login with JWT authentication and BCrypt password hashing
- Add, edit, delete income and expense transactions, each tied to the authenticated user only
- Automatic spending analysis: totals, category breakdown, highest/lowest spending category, averages
- Savings goals with target amount/date, current progress, and required daily/monthly saving
- One-tap goal contributions that update progress immediately, with automatic `COMPLETED` status
- AI Financial Insight card powered by Spring AI + a configurable LLM (OpenAI by default)
- Dashboard with stat cards, category pie chart, income vs. expense bar chart, and recent transactions
- Dedicated Analytics page with date-range filters
- Role-based access control (`USER` / `ADMIN`) with a basic admin stats endpoint
- Fully responsive UI: sidebar/top nav on desktop, bottom navigation + hamburger menu on mobile
- Centralized error handling on both backend (consistent JSON errors) and frontend (friendly messages)

---

## Technology Stack

**Backend:** Java 22, Spring Boot 3, Spring Security, Spring Data JPA/Hibernate, Spring AI, JWT (JJWT), BCrypt, MySQL, Maven, Jakarta Validation. No Lombok — all getters/setters and constructors are written explicitly.

**Frontend:** React 18 (Vite), React Router, Axios, Recharts, plain CSS (no UI framework) for a modern fintech look.

---

## Architecture

```
React (5173)  ──HTTP/JSON──▶  Spring Boot REST API (8088)  ──JPA──▶  MySQL (finpulse_ai)
                                        │
                                        └──Spring AI──▶ OpenAI-compatible LLM
```

React never calls the AI API directly — every AI request goes through the Spring Boot backend, which builds a structured prompt from the user's real financial data (income, expenses, category spending, balance, goal, goal progress) and returns the model's response.

---

## Prerequisites

- **Java 22** — [Adoptium Temurin 22](https://adoptium.net/temurin/releases/?version=22) or any JDK 22 distribution
- **Maven 3.9+** (or use the included behavior of your IDE's embedded Maven)
- **MySQL 8+**
- **Node.js 18+** and npm
- An **OpenAI API key** (or another Spring-AI-compatible provider key), optional — the app falls back to a rule-based insight if the AI call fails or no key is set

### Installing Java 22

- **Windows/macOS:** download the Temurin 22 installer from the link above and run it.
- **macOS (Homebrew):** `brew install temurin22`
- **Linux (apt-based):** `sudo apt install temurin-22-jdk` (after adding the Adoptium apt repo) or use `sdkman`: `sdk install java 22-tem`

Verify with:
```bash
java -version
```

### Installing MySQL

- **Windows/macOS:** [MySQL Community Server installer](https://dev.mysql.com/downloads/mysql/)
- **macOS (Homebrew):** `brew install mysql && brew services start mysql`
- **Linux (apt-based):** `sudo apt install mysql-server`

---

## Database Setup

1. Start MySQL and log in:
   ```bash
   mysql -u root -p
   ```
2. Run the setup script (also available at `database/setup.sql`):
   ```sql
   CREATE DATABASE finpulse_ai;
   ```
   Tables (`users`, `transactions`, `goals`) are created automatically by Hibernate on first run (`spring.jpa.hibernate.ddl-auto=update`).

---

## Environment Variables

### Backend (`backend/.env.example` → copy to real environment variables or a `.env`/`application-local.properties`)

| Variable | Description | Example |
|---|---|---|
| `DB_URL` | JDBC URL for MySQL | `jdbc:mysql://localhost:3306/finpulse_ai?useSSL=false&serverTimezone=UTC` |
| `DB_USERNAME` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | `your_password` |
| `JWT_SECRET` | Long, random secret for signing JWTs | generate with `openssl rand -base64 48` |
| `JWT_EXPIRATION_MS` | Token lifetime in ms | `86400000` (24h) |
| `FRONTEND_ORIGIN` | Allowed CORS origin | `http://localhost:5173` |
| `OPENAI_API_KEY` | Your OpenAI (or compatible) API key | `sk-...` |
| `OPENAI_MODEL` | Chat model to use | `gpt-4o-mini` |
| `MAIL_ENABLED` | Turn on real SMTP email delivery for password resets | `false` |
| `MAIL_HOST` | SMTP host | `smtp.gmail.com` |
| `MAIL_PORT` | SMTP port | `587` |
| `MAIL_USERNAME` | SMTP username | `your@email.com` |
| `MAIL_PASSWORD` | SMTP password / app password | `xxxxxxxx` |
| `MAIL_FROM` | "From" address for outgoing emails | `no-reply@finpulse.ai` |

> **Forgot password without SMTP configured:** if `MAIL_ENABLED` is `false` (the default), the backend does **not** fail — it logs the reset link to the console instead, so you can copy it and test the flow locally without setting up a mail server.

**Never commit real secrets.** `.env.example` is provided as a template only.

On macOS/Linux you can export these before running the backend:
```bash
export DB_PASSWORD=your_password
export JWT_SECRET=$(openssl rand -base64 48)
export OPENAI_API_KEY=sk-your-key
```
On Windows (PowerShell):
```powershell
$env:DB_PASSWORD="your_password"
$env:JWT_SECRET="a-long-random-secret"
$env:OPENAI_API_KEY="sk-your-key"
```

### Frontend (`frontend/.env.example` → copy to `frontend/.env`)

| Variable | Description | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Base URL of the backend API | `http://localhost:8088/api` |

---

## How to Run the Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

The backend starts on **http://localhost:8088**.

## How to Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend starts on **http://localhost:5173**.

Open http://localhost:5173 in your browser, register a new account, and start adding transactions and goals.

---

## Running with Docker

The project ships with a `Dockerfile` for the backend, a `Dockerfile` for the frontend (built and served via nginx), and a root `docker-compose.yml` that wires them together with a MySQL container.

```
finpulse-ai/
├── docker-compose.yml
├── .env.example        (copy to .env in the project root)
├── backend/Dockerfile
├── backend/.dockerignore
├── frontend/Dockerfile
├── frontend/nginx.conf
└── frontend/.dockerignore
```

### 1. Configure environment variables

```bash
cp .env.example .env
```
Edit `.env` and set at least `DB_PASSWORD` and `JWT_SECRET`. `OPENAI_API_KEY` and the `MAIL_*` vars are optional — the app degrades gracefully without them (AI falls back to a rule-based insight; password reset links are logged to the backend container's logs instead of emailed).

### 2. Build and start everything

```bash
docker compose up --build
```

This starts three containers:

| Service | Container | Port |
|---|---|---|
| MySQL 8.4 | `finpulse-mysql` | `3306` |
| Spring Boot backend | `finpulse-backend` | `8088` |
| React frontend (nginx) | `finpulse-frontend` | `5173` |

The backend waits for MySQL's healthcheck before starting, and Hibernate creates the schema automatically on first boot.

Visit **http://localhost:5173** once all three containers report as running (`docker compose ps`).

### 3. Useful commands

```bash
docker compose logs -f backend      # tail backend logs (e.g. to see dev-mode password reset links)
docker compose down                 # stop all containers
docker compose down -v              # stop and also delete the MySQL data volume
docker compose up --build backend   # rebuild/restart just the backend after a code change
```

### Notes on the frontend image

Vite bakes `VITE_API_BASE_URL` into the static bundle at **build time**, because the browser calls the API directly rather than through the frontend container. The default in `.env.example` (`http://localhost:8088/api`) is correct for running everything on your own machine. If you deploy the containers to a remote host, set `VITE_API_BASE_URL` to that host's public backend URL before running `docker compose build frontend`.

### Running only the database in Docker

If you'd rather run the backend/frontend with `mvn spring-boot:run` / `npm run dev` locally (as described above) but still want MySQL in a container:

```bash
docker compose up -d mysql
```

Then set `DB_URL=jdbc:mysql://localhost:3306/finpulse_ai?...` as usual (MySQL is still reachable at `localhost:3306` on the host).

---

## API Endpoint List

### Auth (public)
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password` — `{ "email": "..." }`. Always returns the same generic success message (does not reveal whether the email is registered). If the account exists, a one-time reset link valid for 30 minutes is generated and emailed.
- `POST /api/auth/reset-password` — `{ "token": "...", "newPassword": "...", "confirmPassword": "..." }`. Validates the token (single-use, 30-minute expiry) and updates the password.

### Users (authenticated)
- `GET /api/users/me`

### Transactions (authenticated)
- `POST /api/transactions`
- `GET /api/transactions`
- `GET /api/transactions/{id}`
- `PUT /api/transactions/{id}`
- `DELETE /api/transactions/{id}`
- `GET /api/transactions/monthly`

### Goals (authenticated)
- `POST /api/goals`
- `GET /api/goals`
- `GET /api/goals/{id}`
- `PUT /api/goals/{id}`
- `DELETE /api/goals/{id}`
- `POST /api/goals/{id}/contribute`

### Analytics (authenticated)
- `GET /api/analytics/dashboard`
- `GET /api/analytics/category`
- `GET /api/analytics/monthly`
- `GET /api/analytics/summary`

### AI (authenticated)
- `POST /api/ai/analyze`

### Admin (`ROLE_ADMIN` only)
- `GET /api/admin/stats`

---

## Authentication Flow

1. User registers via `POST /api/auth/register` (or logs in via `POST /api/auth/login`).
2. Backend validates credentials, hashes/verifies the password with BCrypt, and issues a JWT containing the user's ID, email and role.
3. **Forgotten password:** the user submits their email on `/forgot-password`. The backend generates a random 256-bit token, stores only its SHA-256 hash (with a 30-minute expiry, single-use), and emails a link like `http://localhost:5173/reset-password?token=...` (or logs it to the console if SMTP isn't configured). The `/reset-password` page reads the token from the URL, the user sets a new password, and the backend re-hashes it with BCrypt and marks the token used.
4. The frontend stores the JWT in `localStorage` and attaches it as `Authorization: Bearer <token>` on every subsequent request via an Axios interceptor.
4. `JwtAuthenticationFilter` validates the token on each request and populates the Spring Security context.
5. Every service method resolves the current user from the security context (`SecurityUtils.getCurrentUser()`) and scopes all queries to that user — no user can access another user's transactions or goals, even by guessing IDs.
6. On a 401/403 response, the frontend clears the stored session and redirects to `/login`.

---

## Project Structure

```
finpulse-ai/
├── docker-compose.yml
├── .env.example
├── backend/
│   ├── pom.xml
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env.example
│   └── src/
│       ├── main/java/com/finpulse/
│       │   ├── FinPulseApplication.java
│       │   ├── config/        (SecurityConfig, CorsConfig)
│       │   ├── controller/    (Auth, User, Transaction, Goal, Analytics, AI, Admin)
│       │   ├── entity/        (User, Transaction, Goal, PasswordResetToken)
│       │   ├── repository/    (UserRepository, TransactionRepository, GoalRepository, PasswordResetTokenRepository)
│       │   ├── service/       (AuthService, UserService, TransactionService, GoalService, AnalyticsService, AIService, EmailService)
│       │   ├── security/      (JwtService, JwtAuthenticationFilter, CustomUserDetailsService)
│       │   ├── dto/           (Login/Register/Auth/Transaction/Goal/Dashboard/AIInsight DTOs)
│       │   ├── exception/     (GlobalExceptionHandler, ResourceNotFoundException, UnauthorizedException, BadRequestException)
│       │   └── util/          (SecurityUtils)
│       ├── main/resources/application.properties
│       └── test/java/com/finpulse/  (JwtServiceTest, AuthServiceTest, GoalServiceTest)
├── frontend/
│   ├── package.json
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── .dockerignore
│   ├── vite.config.js
│   ├── index.html
│   ├── .env.example
│   └── src/
│       ├── main.jsx, App.jsx
│       ├── api/axiosConfig.js
│       ├── services/apiService.js
│       ├── context/AuthContext.jsx
│       ├── layouts/AppLayout.jsx
│       ├── components/ (Navbar, ProtectedRoute, TransactionCard, TransactionForm, GoalCard, GoalForm, GoalProgress, StatCard, AIInsightCard, LoadingSpinner, ErrorMessage, Toast, ConfirmDialog)
│       ├── charts/ (CategoryChart, MonthlyChart)
│       ├── pages/ (Landing, Login, Register, Dashboard, Transactions, AddTransaction, Goals, CreateGoal, Analytics, AIInsights, Profile, NotFound)
│       ├── utils/format.js
│       └── styles/index.css
└── database/setup.sql
```

---

## Running the Tests

Backend:
```bash
cd backend
mvn test
```
Tests cover registration, password hashing, login (success/failure), JWT generation/validation, and goal progress calculation formulas, using an in-memory H2 database so no MySQL instance is required for `mvn test`.

---

## Future Improvements

- Recurring transactions and budget limits with alerts
- Multi-currency support
- Export transactions/goals to CSV or PDF
- Push/email notifications when a goal is close to its target date
- Refresh tokens and token revocation/blacklisting
- Shared/family goals with multiple contributors
- More granular AI insight types (e.g. a dedicated "unusual spending" detector with anomaly scoring)

---

## Security Notes

- Passwords are hashed with `BCryptPasswordEncoder` — never stored or returned in plain text.
- Spring Security is configured with stateless JWT sessions; no `permitAll()` is used on any private API.
- CORS is restricted to `http://localhost:5173` by default (configurable via `FRONTEND_ORIGIN`).
- All transaction/goal lookups are scoped by `(id, currentUser)`, preventing IDOR across users.
- The frontend never stores passwords; only the JWT and non-sensitive profile fields are kept in `localStorage`.
