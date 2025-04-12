# CacheTest PWA

A testing environment for comparing performance of different Service Worker caching strategies in web applications.

## Table of Contents
- [Project Description](#project-description)
- [Tech Stack](#tech-stack)
- [Getting Started Locally](#getting-started-locally)
- [Available Scripts](#available-scripts)
- [Project Scope](#project-scope)
- [Project Status](#project-status)
- [License](#license)

## Project Description

CacheTest PWA is a web application designed as a testing environment for studying and comparing the performance of different caching strategies using Service Worker. The application allows developers to empirically compare four main caching strategies:

- Network-first (prioritizes fresh data from the network)
- Cache-first (prioritizes loading speed)
- Stale-while-revalidate (balances speed and data freshness)
- Cache-then-network (parallel loading from cache and network)

The primary goal is to provide developers with a tool that helps them make informed decisions about choosing the optimal caching strategy for different resource types and use cases in their own projects.

The application addresses the lack of empirical data that would allow developers to compare different caching strategies and select the best one for specific use cases, especially in the context of Progressive Web Apps (PWA) where application performance and offline availability are key factors.

## Tech Stack

### Current MVP Stack
- **Frontend:**
  - [Astro 5](https://astro.build/) - Fast, modern static site generator
  - [React 19](https://react.dev/) - UI library for interactive components
  - [TypeScript 5](https://www.typescriptlang.org/) - Type-safe JavaScript
  - [Tailwind 4](https://tailwindcss.com/) - Utility-first CSS framework
  - [Shadcn/ui](https://ui.shadcn.com/) - Accessible React component library

### Future Expansion (post-MVP)
- **Backend:** Supabase
- **AI Integration:** Openrouter.ai
- **CI/CD & Hosting:** GitHub Actions and DigitalOcean

## Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) version 22.14.0
  - We recommend using [nvm](https://github.com/nvm-sh/nvm) to manage Node.js versions

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/cache-test.git
   cd cache-test
   ```

2. Install Node.js using nvm (if you use nvm)
   ```bash
   nvm use
   ```

3. Install dependencies
   ```bash
   npm install
   ```

4. Start the development server
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:4321`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run preview` - Preview the built application
- `npm run astro` - Run Astro CLI commands

## Project Scope

### MVP Features
- Application structure with multiple pages containing different resource types
- Service Worker registration and implementation of four caching strategies
- Strategy switching system (dropdown or separate URLs)
- Basic network condition simulation (including offline mode)
- Measurement of key performance indicators
- Dashboard for comparing strategy results
- Report generation and data export
- Custom test scenario definition
- Cache reset mechanism
- Educational materials about caching strategies

## Project Status

CacheTest PWA is currently in MVP development phase. The initial focus is on implementing core functionality for testing caching strategies without backend components. Future phases will expand the application to include backend functionality, AI integration, and production deployment.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

*Note: This is a research and educational tool designed to help web developers make better decisions about caching strategies in their applications.*

```sh
npm create astro@latest -- --template basics
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/basics)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/astro/tree/latest/examples/basics)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/withastro/astro?devcontainer_path=.devcontainer/basics/devcontainer.json)

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

![just-the-basics](https://github.com/withastro/astro/assets/2244813/a0a5533c-a856-4198-8470-2d67b1d7c554)

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
