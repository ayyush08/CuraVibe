<h1 align="center">🧠 CuraVibe</h1>
<p align="center">
  A full-featured <b>browser-based IDE</b> built with <b>Next.js and Prisma ORM</b>, powered by <b>Monaco Editor</b>, <b>WebContainers</b>, and optional <b>AI Copilot-style</b> code assistance powered by <b>MonacoPilot</b>.
</p>

<p align="center">
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white"/></a>
    <a href="https://prisma.io/"><img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white"/></a>
  <a href="https://monaco-editor.github.io/"><img src="https://img.shields.io/badge/Monaco%20Editor-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white"/></a>
  <a href="https://stackblitz.com/docs/webcontainers"><img src="https://img.shields.io/badge/WebContainers-0A0A0A?style=for-the-badge&logo=stackblitz&logoColor=white"/></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge"/></a>
</p>

---

## 🌟 Overview

**CuraVibe** is a browser-based code editor that gives developers a **full IDE experience right inside their browser**.  
It supports multiple **framework templates** (React, Next.js, Express, Hono, Vue, and Angular) and includes:

- Code execution via **WebContainers**
- Integrated **terminal (Xterm.js)**
- **AI-assisted code suggestions** using MonacoPilot
- Built-in **file persistence** via JSON-based virtual FS

Perfect for quick experiments, learning environments, or lightweight cloud coding.

---

## 🎥 Demo

> 🧪 _Coming soon — GIF or video demo here showing live coding + terminal preview!_

---

## ⚙️ Tech Stack

| Category    | Technology                                                |
| ----------- | --------------------------------------------------------- |
| Frontend    | **Next.js**, **React**                                    |
| Backend     | **Next.js**, **Prisma ORM**, **NextAuth**                 |
| Editor      | **Monaco Editor**, **MonacoPilot**                        |
| Runtime     | **WebContainers API**                                     |
| Terminal    | **Xterm.js**                                              |
| File System | JSON-based storage and sync                               |
| Styling     | Tailwind CSS / Custom UI                                  |
| AI Features | Copilot-style code completion from MonacoPilot (optional) |

---

## ✨ Features

- 🪪**Authentication** — Secure authentication with Google/Github using NextAuth

- 🧠 **AI Code Suggestions** — Get Copilot-like hints while coding.
- ⚡ **Instant Preview** — WebContainers run your code.
- 💾 **Persistent Workspace** — Files stored and restored via JSON serialization.
- 🖥️ **Multiple Templates Supported**
  - React
  - Next.js
  - Express
  - Hono
  - Vue
  - Angular
- 🧩 **Modular Architecture** — Add new templates easily.
- 💬 **Integrated Terminal** using Xterm.js.
- 🎨 **Lightweight UI** with dark mode support.

---

## 🧰 Installation & Setup

### 1. Clone the repo

```bash
git clone https://github.com/ayyush08/CuraVibe.git
cd CuraVibe
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory and add the variables as shown in `.env.example`.

### 4. Set up the database

We are using Prisma ORM with a MongoDB database. Make sure you have a MongoDB instance running and update the `DATABASE_URL` in your `.env` file.
Run the following commands to set up Prisma:

```bash
npx prisma generate
npx prisma db push
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🌈 Usage

1. Choose your preferred template (React, Next.js, etc.).

2. Start coding directly in the Monaco editor.

3. View code preview powered by WebContainers.

4. Use the terminal to run build commands.

5. Enjoy AI code suggestions via MonacoPilot.


## 🌸 Hacktoberfest 2025

 CuraVibe is proudly participating in Hacktoberfest 2025! 💜.
We welcome contributions from everyone — whether you’re fixing bugs, improving the UI, or adding new template support.

How to contribute:

1. Fork the repo & clone it locally.

2. Find issues labeled hacktoberfest, good first issue, or enhancement.

3. Follow the Contributing Guide in `CONTRIBUTING.md`.

4. Submit your pull request with the label `hacktoberfest-accepted`.

Your contributions help make CuraVibe even better 🚀