# Sonod Projects Manager

> Explore the dynamic world of project management through our meticulously designed platform, where form meets function. Transform your development workflow with seamless automation, secure deployments, and versatile features.

A beautiful, modern web application for managing Next.js projects with automated CI/CD pipelines, built with Next.js 15, TypeScript, and Tailwind CSS.

## ✨ Features

- 🚀 **Automated Project Creation** - Create new Next.js projects with a single click
- 🔄 **Real-time Pipeline Monitoring** - Monitor deployment pipelines with live status updates
- 🎨 **Beautiful UI** - Cracker-inspired design with glassmorphism effects and smooth animations
- 🔐 **Secure Authentication** - GitLab OAuth integration with role-based access control
- 📊 **Analytics Dashboard** - Track project performance and deployment metrics
- 🔧 **DevOps Integration** - Seamless integration with GitLab CI/CD and self-hosted runners

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with GitLab OAuth
- **Deployment**: Docker, Nginx
- **CI/CD**: GitLab CI/CD with self-hosted runners

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL 15+
- Docker & Docker Compose
- GitLab account with API access

### Environment Setup

1. Copy the environment template:
```bash
cp env.example .env.local
```

2. Configure your environment variables:
```env
# GitLab Configuration
GITLAB_HOST=https://gitlab.sonod.tech
GITLAB_TOKEN=your_gitlab_token_here
GITLAB_GROUP_ID=your_nextjs_group_id

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/sonod_projects_manager"

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# GitLab OAuth
GITLAB_CLIENT_ID=your_oauth_app_client_id
GITLAB_CLIENT_SECRET=your_oauth_app_client_secret

# Pipeline Configuration
PIPELINE_PROJECT_ID=228
PIPELINE_TRIGGER_TOKEN=your_trigger_token_here

# Server Configuration
HOST_TEST_ADDRESS=23.88.63.252
HOST_TEST_USER=root
BASE_PATH=/opt/nextjs
TEMPLATE_PATH=/opt/nextjs/templates
```

### Development

1. Install dependencies:
```bash
npm install
```

2. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Deployment

1. Build the application:
```bash
npm run build
```

2. Start with Docker Compose:
```bash
docker-compose up -d
```

## 🏗️ Architecture

### Project Structure
```
sonod-projects-manager/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── projects/          # Project management
│   └── pipelines/          # Pipeline monitoring
├── components/             # Reusable UI components
│   ├── ui/                # Base UI components
│   ├── layout/            # Layout components
│   ├── projects/          # Project-specific components
│   └── pipelines/         # Pipeline-specific components
├── lib/                   # Utility libraries
│   ├── actions/           # Server actions
│   ├── auth.ts            # Authentication config
│   └── gitlab/            # GitLab API client
└── prisma/                # Database schema
```

### Key Components

- **GitLab Integration**: Comprehensive API client for project and pipeline management
- **Authentication**: Secure OAuth flow with session management
- **Real-time Updates**: Webhook integration for live pipeline monitoring
- **Responsive Design**: Mobile-first approach with beautiful animations

## 🔧 Configuration

### GitLab Setup

1. Create a GitLab OAuth application:
   - Go to GitLab → Settings → Applications
   - Add redirect URI: `https://your-domain.com/api/auth/callback/gitlab`
   - Note the Client ID and Client Secret

2. Create a Personal Access Token:
   - Go to GitLab → Settings → Access Tokens
   - Select scopes: `api`, `read_api`, `read_user`, `read_repository`, `write_repository`

3. Set up webhooks:
   - Configure project webhooks to point to your application
   - Enable pipeline and job events

### Database Setup

1. Create PostgreSQL database:
```sql
CREATE DATABASE sonod_projects_manager;
```

2. Run Prisma migrations:
```bash
npx prisma migrate dev
```

### Server Configuration

The application is designed to work with your existing infrastructure:

- **Test Server**: `23.88.63.252` (root access)
- **Base Path**: `/opt/nextjs`
- **Template Path**: `/opt/nextjs/templates`
- **Domain**: `*.check.sonod.tech`

## 🎨 Design System

### Color Palette
- **Primary**: Blue gradient (`#0ea5e9` to `#0284c7`)
- **Secondary**: Purple gradient (`#d946ef` to `#c026d3`)
- **Accent**: Green (`#22c55e`)
- **Dark**: Deep blue (`#0f172a`)

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700, 800

### Components
- **Glass Cards**: Semi-transparent with backdrop blur
- **Gradient Buttons**: Smooth hover animations
- **Status Indicators**: Color-coded with icons
- **Loading States**: Skeleton screens and spinners

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔒 Security

- **Authentication**: GitLab OAuth with secure session management
- **Rate Limiting**: API endpoints protected with rate limits
- **HTTPS**: SSL/TLS encryption for all communications
- **CORS**: Proper cross-origin resource sharing configuration
- **Headers**: Security headers for XSS and CSRF protection

## 🚀 Deployment

### Docker Deployment

1. Build and deploy:
```bash
docker-compose up -d
```

2. Set up SSL certificates:
```bash
# Place your SSL certificates in ./ssl/
# cert.pem and key.pem
```

3. Configure domain:
```bash
# Update nginx.conf with your domain
# Configure DNS to point to your server
```

### Environment Variables

Ensure all required environment variables are set in production:

```bash
# Required for production
NEXTAUTH_URL=https://your-domain.com
DATABASE_URL=postgresql://user:pass@host:5432/db
GITLAB_TOKEN=your_production_token
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Alezz Ballajem** - DevOps Lead
- Crafted with ❤️ for the Sonod team
- Transforming development workflows through automation

---

*Built with Next.js, TypeScript, and lots of ☕*
