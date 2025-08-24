# TaskiFY🚀

TaskiFY is a modern and intuitive project management web application designed to streamline workflows and enhance team collaboration.

## 🌟 Preview of my Application

<p align="center">
  <img src="./public/pic1.png" width="700"/>
  <img src="./public/pic2.png" width="700"/>
  <img src="./public/pic3.png" width="700"/>
  <img src="./public/pic4.png" width="700"/>
  <img src="./public/pic5.png" width="700"/>
  <img src="./public/pic6.png" width="700"/>
</p>

## 🚀 Features

### Core Features
- 🏆 **Enhanced Task Management** - Create, update, and track tasks with improved error handling
- 📅 **Interactive Kanban Board** - Visualize workflow with drag-and-drop and quick status changes
- 🔔 **Smart Notifications** - Stay updated with real-time notifications and status changes
- 🔥 **Intelligent Priority System** - AI-assisted priority categorization (Low, Medium, High, Urgent)
- 👥 **Secure Authentication** - Multi-provider authentication using Clerk
- 🎨 **Modern UI/UX** - Enhanced components with hover effects and smooth animations

### New Enhanced Features ⭐
- 🛡️ **Error Boundaries** - Comprehensive error handling with graceful recovery
- ⚡ **Performance Optimized** - Enhanced utilities and optimized component rendering  
- 🎯 **Quick Actions** - One-click status changes and inline editing on issue cards
- 📊 **Better Analytics** - Track user actions and system performance
- 🔧 **Developer Experience** - Improved code structure with enhanced server actions
- 🚀 **Production Ready** - Robust error handling and validation throughout

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14 with App Router
- **UI Library:** React with enhanced components
- **Styling:** Tailwind CSS with custom design system
- **Components:** Shadcn UI with Radix UI primitives
- **State Management:** React Server Components + Enhanced Server Actions

### Backend & Database
- **API:** Next.js API Routes with enhanced error handling
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** Clerk with multi-provider support
- **Storage:** NeonDB (serverless PostgreSQL)

### Enhanced Features
- **Error Handling:** Comprehensive error boundaries and validation
- **Performance:** Optimized utilities and caching mechanisms
- **DevOps:** GitHub Actions CI/CD pipeline
- **Code Quality:** ESLint, Prettier, and enhanced code structure

## ⚡ Installation & Setup

Follow these steps to run TaskiFY locally:

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/ayushkumar1991/TaskiFY.git
cd TaskiFY

```

### 2. Install Dependencies:-

```bash
npm install --legacy-peer-deps
```

### 3. Set Up Environment Variables:-

Create a `.env.local` file in the root directory and add necessary API keys and credentials:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-key
CLERK_SECRET_KEY=your-secret-key

DATABASE_URL=your-neondb-url

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
```

### 4. Run the Application:-

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Contributing:-

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch.
3. Make your changes and commit them.
4. Push to your fork and submit a pull request.

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

## Contact:-

For queries or feedback, reach out at **ayushkumr1991@gmail.com**.
