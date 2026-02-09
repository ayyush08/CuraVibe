<h1 align="center">🧠 CuraVibe</h1>
<p align="center">
  A full-featured <b>browser-based IDE</b> built with <b>Next.js and Prisma ORM</b>, powered by <b>Monaco Editor</b>, <b>WebContainers API</b>, and optional <b>AI Copilot-style</b> code assistance powered by <b>MonacoPilot</b>.
</p>

<p align="center">
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white"/></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-61dafb?style=for-the-badge&logo=react&logoColor=000"/></a>
  <a href="https://prisma.io/"><img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white"/></a>
  <a href="https://monaco-editor.github.io/"><img src="https://img.shields.io/badge/Monaco%20Editor-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white"/></a>
  <a href="https://stackblitz.com/docs/webcontainers"><img src="https://img.shields.io/badge/WebContainers-0A0A0A?style=for-the-badge&logo=stackblitz&logoColor=white"/></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge"/></a>
</p>

---

## 🌟 Overview

**CuraVibe** is a full-stack, browser-based IDE that brings a professional development environment directly to your browser. Built with modern technologies, it enables developers to write, execute, and deploy code without leaving the browser window.

### Key Capabilities:
- 📝 **Monaco Editor Integration** — VS Code-level code editing experience
- 🚀 **Multi-Framework Support** — Pre-configured templates for React, Next.js, Express, Hono, Vue, and Angular
- 🎯 **Live Code Execution** — Run and preview projects in real-time using WebContainers
- 💻 **Full Terminal Access** — Integrated Xterm.js terminal for running build commands
- 🤖 **AI Code Assistance** — Copilot-style code suggestions via MonacoPilot
- 🔐 **User Authentication** — OAuth integration with Google & GitHub via NextAuth
- 💾 **Persistent Workspaces** — Projects saved to MongoDB and restored on login
- 🌙 **Dark Mode Support** — Beautiful, accessible UI built with Tailwind CSS and custom components

---

## 🎨 Architecture Highlights

**Full-Stack Implementation:**
- **Frontend**: Next.js 15 with React 19, TypeScript, and Tailwind CSS
- **Editor**: Monaco Editor with custom extensions
- **Backend**: Next.js API routes, Prisma ORM for data management
- **Database**: MongoDB with comprehensive schema for users, projects, and collaboration
- **Real-time Runtime**: WebContainers API for sandboxed code execution
- **Terminal**: Xterm.js for interactive shell experience

---

## 🎥 Demo

> 🧪 _GitHub repository contains working codebase with full source code walkthrough. Live demo deployment coming soon._
> 
> **Current Status**: Core functionality implemented and working. WebContainers integration documented in known limitations below.

---

## ✨ Core Features

- **🔐 Secure Authentication** — OAuth 2.0 using NextAuth with Google & GitHub providers
- **🧠 AI Code Assistance** — Real-time code suggestions and completions powered by MonacoPilot
- **⚡ Live Preview** — Instant code execution feedback (local preview works; see Known Limitations)
- **💾 Project Persistence** — Workspaces automatically saved to MongoDB and restored on login
- **📦 Multiple Framework Templates** — Pre-configured & optimized for:
  - React
  - Next.js
  - Express.js
  - Hono
  - Vue.js
  - Angular
- **🧩 Extensible Architecture** — Modular design makes adding new templates straightforward
- **💬 Integrated Terminal** — Full-featured Xterm.js terminal for running build commands
- **🎨 Professional UI** — Dark mode support, responsive design, accessibility-first component library
- **🔧 Developer Experience** — Hot reload support, syntax highlighting, auto-completion, error detection

---

## ⚙️ Tech Stack

| Layer       | Technology                                    | Purpose                              |
| ----------- | --------------------------------------------- | ------------------------------------ |
| **Frontend**  | Next.js 15, React 19, TypeScript              | UI framework & type safety           |
| **Editor**    | Monaco Editor, MonacoPilot                    | Code editing & AI suggestions        |
| **Styling**   | Tailwind CSS, Radix UI                        | Modern, accessible UI components     |
| **Backend**   | Next.js API Routes, NextAuth 5                | Server logic & authentication        |
| **Database**  | MongoDB, Prisma ORM v6                        | Data persistence & schema management |
| **Runtime**   | WebContainers API v1.6                        | Sandboxed code execution             |
| **Terminal**  | Xterm.js 5.5                                  | Interactive shell experience         |
| **AI**        | Google GenAI, MonacoPilot                     | Code completion & suggestions        |

---

## 🧰 Installation & Setup

### Prerequisites
- **Node.js** 18+ and npm/yarn
- **MongoDB** instance (local or cloud via MongoDB Atlas)
- **Git** for cloning the repository
- OAuth credentials (optional): Google and GitHub OAuth apps

### Step-by-Step Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/ayyush08/CuraVibe.git
cd CuraVibe
```

#### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

#### 3. Configure Environment Variables
Create a `.env.local` file in the root directory:

```bash
# Database
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/curavibe"

# NextAuth Configuration
NEXTAUTH_SECRET="your-random-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers (Optional - for AI features & signup)
AUTH_GOOGLE_ID="your-google-oauth-id"
AUTH_GOOGLE_SECRET="your-google-oauth-secret"
AUTH_GITHUB_ID="your-github-oauth-id"
AUTH_GITHUB_SECRET="your-github-oauth-secret"

# AI Features (MonacoPilot)
NEXT_PUBLIC_GOOGLE_GENAI_KEY="your-google-genai-key"
```

**Getting OAuth Credentials:**
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
- [GitHub OAuth Setup](https://docs.github.com/en/developers/apps/building-oauth-apps)

To generate `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

#### 4. Set Up the Database
Initialize Prisma and sync with MongoDB:

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to MongoDB (creates/updates collections)
npx prisma db push

# (Optional) Open Prisma Studio for visual database management
npx prisma studio
```

#### 5. Run the Development Server
```bash
npm run dev
```

The application will start at [http://localhost:3000](http://localhost:3000).

---

## 💡 Usage Guide

### Creating Your First Project

1. **Sign In** — Use Google/GitHub OAuth or create an account
2. **New Playground** — Click "Create New Playground"
3. **Select Template** — Choose from React, Next.js, Express, etc.
4. **Start Coding** — Edit files in the Monaco editor
5. **Run & Preview** — Use the integrated terminal and preview panel
6. **Save Project** — Automatically persisted to your account

### Using AI Code Suggestions

With MonacoPilot enabled:
- Press `Ctrl+I` (or `Cmd+I` on Mac) for inline suggestions
- Editor will provide context-aware code completions
- Accept suggestions with `Tab` or reject with `Esc`

### Terminal Commands

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build project
npm run build

# Run tests
npm test
```

---

## 🏗️ Project Structure

```
CuraVibe/
├── app/                          # Next.js app directory
│   ├── (auth)/                   # Authentication pages
│   ├── (root)/                   # Main app layout
│   ├── api/                      # API routes
│   │   ├── auth/                 # NextAuth endpoints
│   │   ├── chat/                 # AI chat endpoints
│   │   ├── code-completion/      # Code suggestion API
│   │   ├── template/             # Template management
│   │   └── get-repo/             # Repository utilities
│   ├── dashboard/                # User dashboard
│   ├── playground/               # Code editor & runtime
│   └── remote-runner/            # WebContainer execution
│
├── components/                   # Reusable React components
│   ├── ui/                       # UI component library (50+)
│   ├── lightswind/               # Custom animations & effects
│   └── providers/                # Context & theme providers
│
├── modules/                      # Feature modules
│   ├── ai-chat/                  # AI chat integration
│   ├── auth/                     # Authentication logic
│   ├── dashboard/                # Dashboard features
│   ├── home/                     # Landing page
│   ├── playground/               # Editor interface
│   ├── remote-runner/            # WebContainer management
│   └── webcontainers/            # WebContainer utilities
│
├── lib/                          # Utility functions
│   ├── db.ts                     # Database client
│   ├── copilot.ts                # AI integration
│   ├── template.ts               # Template utilities
│   ├── build-template-from-repo.ts # Template builder
│   └── generated/                # Prisma client (auto-generated)
│
├── hooks/                        # Custom React hooks
│   ├── use-current-user.ts       # User context hook
│   └── use-mobile.ts             # Mobile detection
│
├── prisma/                       # Database schema
│   └── schema.prisma             # Prisma schema definitions
│
└── public/                       # Static assets
    └── starters/                 # Template starters
```

---

## ⚠️ Known Limitations

### WebContainers Performance
- **Issue**: WebContainers API initialization can be slow in local development (15-30 seconds on first load)
- **Why**: StackBlitz WebContainers requires downloading the entire containerized runtime
- **Current Status**: Works correctly when properly initialized; slowness is primarily on first load
- **Workaround**: 
  - Deployed versions perform better due to edge caching
  - Subsequent loads in the same browser session are faster
  - Consider pre-warming containers during development

### Framework Preview Limitations
- **Next.js & React frameworks**: May require additional configuration in WebContainers environment
- **Recommendation**: Test with simpler frameworks (Express, Hono) for fastest iteration during development

### Local Development Quirks
- File system sync between editor and WebContainers occasionally requires page refresh
- Some npm packages with native dependencies may not work in WebContainers sandbox
- Large projects (10,000+ lines) may experience editor lag

### Deployment Notes
- **Not yet deployed to production** — Project focuses on core functionality
- **Recommended hosting**: Vercel (for Next.js optimization), Railway, or AWS
- **Database**: Requires MongoDB Atlas or self-hosted MongoDB instance

---

## 🚀 Roadmap

### Completed ✅
- [x] Monaco Editor integration
- [x] Multi-framework template support
- [x] WebContainers API integration
- [x] Xterm.js terminal
- [x] NextAuth OAuth authentication
- [x] Prisma ORM database layer
- [x] MongoDB persistence
- [x] MonacoPilot AI suggestions
- [x] Dark mode theme support

### In Progress 🔄
- [ ] Performance optimization for WebContainers
- [ ] Collaborative editing features (real-time sync)
- [ ] Additional framework templates (Svelte, Remix)
- [ ] Code snippet marketplace
- [ ] Project sharing & public playgrounds

### Planned 🎯
- [ ] Production deployment
- [ ] Advanced debugging tools
- [ ] Version control integration (Git)
- [ ] Team collaboration workspace
- [ ] Custom plugin system
- [ ] Mobile app (React Native)
---

## 🤝 Contributing

Contributions are highly appreciated! Whether you're fixing bugs, optimizing performance, or adding new features, your help makes CuraVibe better.

### How to Contribute

1. **Fork the Repository**
   ```bash
   git clone https://github.com/ayyush08/CuraVibe.git
   cd CuraVibe
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Your Changes**
   - Follow the existing code style
   - Add tests when applicable
   - Update documentation if needed

4. **Commit & Push**
   ```bash
   git commit -m "feat: describe your changes"
   git push origin feature/your-feature-name
   ```

5. **Open a Pull Request**
   - Reference any related issues
   - Provide a clear description of changes
   - Ensure all checks pass

### Good First Issues
- Adding new framework templates
- UI/UX improvements
- Performance optimizations
- Documentation updates
- Bug fixes (see Issues tab)

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

## 📝 License

This project is licensed under the **MIT License**. See [LICENSE](LICENSE) file for details.

---

## 🙋 Support & Questions

- **Issues & Bug Reports**: [GitHub Issues](https://github.com/ayyush08/CuraVibe/issues)
- **Discussions**: [GitHub Discussions](https://github.com/ayyush08/CuraVibe/discussions)
- **Code of Conduct**: See [CODE-OF-CONDUCT.md](CODE-OF-CONDUCT.md)

---

## 🎯 Project Status

**Current Phase**: Active Development

CuraVibe is in active development with core features implemented and tested. The project is production-ready for educational and experimental use cases. Full production deployment is planned for Q2 2026.

**Last Updated**: February 2026

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/ayyush08">Ayyush</a>
</p>

<p align="center">
  <a href="https://github.com/ayyush08/CuraVibe/stargazers">⭐ Star this project</a> •
  <a href="https://github.com/ayyush08/CuraVibe/issues">Report Bug</a> •
  <a href="https://github.com/ayyush08/CuraVibe/issues/new">Request Feature</a>
</p>