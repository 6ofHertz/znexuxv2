# ZURVAN - Learning Tracker & Productivity Hub

<div align="center">

**Master your learning journey with intelligent task management, focus tracking, and real-time analytics.**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)


<img width="1630" height="908" alt="image" src="https://github.com/user-attachments/assets/8a145c5a-7253-41b7-a63a-1ccddd8c68fb" />
</div>

---

## 🎯 What is ZURVAN?

ZURVAN is a comprehensive learning and productivity platform designed to help you:

- ✅ **Track tasks** with priority management and completion tracking
- 🎯 **Organize learning streams** across multiple subjects/skills
- ⏱️ **Focus with Pomodoro** featuring real-time visual feedback
- 📝 **Capture quick notes** with timestamps and rich editing
- 📊 **Analyze productivity** with detailed metrics and insights
- 🔐 **Secure your data** with Firebase authentication and user isolation

---

## ✨ Key Features

### 🎨 **Execution Zone**

**Task Management:**
- Create, edit, and complete tasks with priority levels (Low, Medium, High)
- Color-coded priority system with visual indicators
- Estimated time tracking per task
- Associated learning streams for organization
- Real-time task completion tracking

**Quick Notes:**
- ✍️ Rich text input with character counter
- 📅 Automatic timestamps ("Today, HH:MM" format)
- 📖 Expand/collapse for longer notes
- ✏️ Edit and delete functionality
- 💫 Smooth hover animations with lift effect
- 💡 Lightbulb icon for creative inspiration

### ⏱️ **Pomodoro Timer**

Advanced focus timer with visual feedback:

- ⏰ **25-minute focus sessions** / 5-minute breaks
- 🎨 **Real-time color transitions** (green → yellow → red)
- ✨ **Dynamic glow effects** for visual urgency
- 🔔 **Toast notifications** for session completion
- ▶️ **Play/Pause/Reset controls**
- 📊 Session tracking integrated with analytics

### 📊 **Analytics Hub**

Comprehensive productivity insights:

- 📈 **Performance metrics** (completion rate, focus time)
- 🏆 **Progress tracking** across learning streams
- 📅 **Weekly/monthly trends**
- 🎯 **Task statistics** and patterns
- 🔥 **Focus session history**

### 🌊 **Learning Streams**

Organize your learning journey:

- 🎨 **Custom colors and icons** for each stream
- 📊 **Progress tracking** (0-100%)
- 🎯 **Task association** and remaining count
- 📅 **Deadline management**
- 🔄 **Real-time progress updates**

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- **npm** or **bun** package manager
- **Firebase account** (for backend services)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <znexus-2>
   cd <nexus-2>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables:**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Deploy Firestore security rules:**
   ```bash
   firebase login
   firebase deploy --only firestore:rules
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   # or
   bun dev
   ```

6. **Open your browser:**
   Navigate to `http://localhost:5173`

---

## 📚 Documentation

Comprehensive guides available in the repository:

- 📖 **[Firestore Setup Guide](ZURVAN_FIRESTORE_GUIDE.md)** - Complete database schema and data flow
- 📝 **[How to Input Data](HOW_TO_INPUT_DATA.md)** - Three methods to add data (code, console, Firebase)
- 🔒 **[Security Rules](DEPLOY_FIRESTORE_RULES.md)** - User isolation and authentication
- ⚡ **[Quick Start](QUICKSTART.md)** - Get up and running in minutes

---

## 🛠️ Tech Stack

**Frontend:**
- ⚛️ **React 18** - UI library with hooks and context
- 📘 **TypeScript** - Type-safe development
- 🎨 **Tailwind CSS** - Utility-first styling
- 🎭 **Framer Motion** - Smooth animations
- 🧩 **shadcn/ui** - Accessible component library
- 🎯 **Lucide React** - Beautiful icons

**Backend:**
- 🔥 **Firebase Authentication** - Secure user management
- 📊 **Firestore Database** - NoSQL cloud database
- 🔒 **Security Rules** - Production-grade data isolation

**Build Tools:**
- ⚡ **Vite** - Lightning-fast dev server
- 📦 **Bun** - Fast JavaScript runtime
- 🎨 **PostCSS** - CSS transformations

---

## 📊 Database Schema

### Tasks Collection
```typescript
{
  id: string;                    // Auto-generated
  user_id: string;               // Firebase Auth UID
  title: string;                 // Task name
  description?: string;          // Optional details
  completed: boolean;            // Status
  estimatedMinutes: number;      // Time estimate
  stream?: string;               // Learning stream
  priority: 'low' | 'medium' | 'high';
  created_at: Timestamp;
  updated_at: Timestamp;
}
```

### Streams Collection
```typescript
{
  id: string;
  user_id: string;
  name: string;
  description?: string;
  progress: number;              // 0-100
  color?: string;                // Hex color
  icon?: string;                 // Icon identifier
  tasksRemaining?: number;
  nextDeadline?: string;         // ISO date
  created_at: Timestamp;
  updated_at: Timestamp;
}
```

See **[ZURVAN_FIRESTORE_GUIDE.md](ZURVAN_FIRESTORE_GUIDE.md)** for complete schema details.

---

## 🎨 Component Architecture

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── PomodoroTimer/   # Focus timer with color transitions
│   ├── QuickNote/       # Note-taking component
│   ├── TaskList/        # Task management
│   └── Analytics/       # Performance insights
├── contexts/
│   └── AuthContext.tsx  # Firebase auth state
├── lib/
│   └── firebase/
│       ├── config.ts    # Firebase configuration
│       └── firestore.ts # Database operations
├── pages/
│   └── Index.tsx        # Main dashboard
└── types/
    └── database.ts      # TypeScript interfaces
```

---

## 🔐 Security

ZURVAN implements production-grade security:

- ✅ **User isolation** - Users can only access their own data
- ✅ **Authentication required** - All operations need valid auth
- ✅ **Automatic validation** - `user_id` verified against `auth.uid`
- ✅ **Secure rules** - No test mode or expiration dates

**Security Rules Sample:**
```javascript
match /tasks/{taskId} {
  allow read: if isOwner(resource.data.user_id);
  allow create: if isAuthenticated() && 
    request.resource.data.user_id == request.auth.uid;
  allow update, delete: if isOwner(resource.data.user_id);
}
```

---

## 📈 Usage Examples

### Creating a Task

```typescript
import { createTask } from '@/lib/firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';

const { user } = useAuth();

const newTask = await createTask(user.uid, {
  title: "Learn React Hooks",
  description: "Master useState and useEffect",
  completed: false,
  estimatedMinutes: 120,
  stream: "Frontend Development",
  priority: "high"
});
```

### Starting a Pomodoro Session

```typescript
// In your component
const [isPomodoroActive, setIsPomodoroActive] = useState(false);

// Timer automatically handles:
// - 25-minute countdown
// - Real-time color transitions (green → yellow → red)
// - Visual urgency with glow effects
// - Completion notifications
```

### Adding Quick Notes

```typescript
// Quick notes support:
// - Automatic timestamps
// - Character counter
// - Expand/collapse for long content
// - Edit and delete operations
// - Smooth hover animations
```

---

## 🧪 Testing

Run the test suite:

```bash
npm run test
# or
bun test
```

**Test Coverage:**
- ✅ Authentication flows
- ✅ Firestore CRUD operations
- ✅ Security rule validation
- ✅ Component rendering
- ✅ User data isolation

---

## 🚢 Deployment

### Deploy to Production

**Via Lovable:**
1. Open your [Lovable Project](https://lovable.dev/projects/ddfcac26-eb10-4efc-b2f5-6f242af1d0f1)
2. Click **Share → Publish**
3. Your app is live! 🎉

**Via Firebase Hosting:**
```bash
# Build production bundle
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

### Custom Domain

Connect your own domain:
1. Navigate to **Project → Settings → Domains**
2. Click **Connect Domain**
3. Follow DNS setup instructions

Read more: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License


---

## 🙏 Acknowledgments

- **[Lovable](https://lovable.dev)** - AI-powered development platform
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautiful component library
- **[Lucide Icons](https://lucide.dev/)** - Icon system
- **[Firebase](https://firebase.google.com/)** - Backend infrastructure

---

## 📞 Support

Need help? Check these resources:

- 📖 **[Documentation](ZURVAN_FIRESTORE_GUIDE.md)** - Complete guides
- 💬 **[Issues](https://github.com/your-repo/issues)** - Report bugs
- 🌐 **[Lovable Docs](https://docs.lovable.dev)** - Platform documentation

---

## 🎉 Features in Action

**Pomodoro Timer:**
- Real-time countdown with second precision
- Color transitions: Green (focused) → Yellow (midway) → Red (urgent)
- Smooth glow effects for visual feedback
- Session completion notifications

**Quick Notes:**
- Character counter (0/500 characters)
- Timestamp format: "Today, 14:35"
- Expandable cards for long content
- Hover lift animations
- Edit/delete with confirmation

**Task Management:**
- Priority colors: Red (High), Yellow (Medium), Green (Low)
- Completion tracking with checkboxes
- Stream association for organization
- Estimated time display

**Analytics:**
- Completion rate percentage
- Total focus time tracking
- Task statistics by priority
- Progress visualization

---

<div align="center">

**💀 vibes n inshalla🤞🏿**

[🌟 Star this project](https://github.com/6ofHertz/znexus-2) | [📝 Report Bug](https://github.com/6ofHertz/znexus-2/issues) | [✨ Request Feature](https://github.com/6ofHertz/znexus-2/issues)

</div>
