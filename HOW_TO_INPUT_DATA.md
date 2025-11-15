# 📝 How to Input Data into ZURVAN via Firestore

## 🚀 Three Methods to Add Data

---

## Method 1: Via Code (Programmatic) ✨

**Best for:** Building features, testing, automation

### Create a Task

```typescript
import { createTask } from '@/lib/firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';

const MyComponent = () => {
  const { user } = useAuth();

  const addTask = async () => {
    const newTask = await createTask(user.uid, {
      title: "Complete React tutorial",
      description: "Learn hooks, context, and state management",
      completed: false,
      estimatedMinutes: 90,
      stream: "Frontend Development",
      priority: "high"
    });

    console.log('Created:', newTask);
    // Returns: { id: "auto_123", user_id: "abc", title: "...", ... }
  };

  return <button onClick={addTask}>Add Task</button>;
};
```

### Create a Stream

```typescript
import { createStream } from '@/lib/firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';

const addStream = async () => {
  const newStream = await createStream(user.uid, {
    name: "Frontend Development",
    description: "Master React, TypeScript, and modern web",
    progress: 0,
    color: "#3b82f6",
    icon: "code",
    tasksRemaining: 10,
    nextDeadline: "2025-02-01T00:00:00Z"
  });

  console.log('Created:', newStream);
};
```

### Update Existing Data

```typescript
import { updateTask, updateStream } from '@/lib/firebase/firestore';

// Update task
await updateTask("task_123", {
  completed: true,
  priority: "low"
});

// Update stream progress
await updateStream("stream_456", {
  progress: 45,
  tasksRemaining: 5
});
```

---

## Method 2: Via Firebase Console (Manual) 🖱️

**Best for:** Initial setup, testing, manual data entry

### Step-by-Step:

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Select project: **znexux-954bd**

2. **Navigate to Firestore**
   - Click "Firestore Database" in left sidebar
   - You should see your collections

3. **Add a Collection (if first time)**
   - Click "Start collection"
   - Collection ID: `tasks` (or `streams`)
   - Click "Next"

4. **Add a Document**

   **For Tasks:**
   ```
   Document ID: [Auto-ID] (leave blank for auto-generation)
   
   Fields:
   ┌─────────────────┬──────────┬─────────────────────────────┐
   │ Field name      │ Type     │ Value                       │
   ├─────────────────┼──────────┼─────────────────────────────┤
   │ user_id         │ string   │ YOUR_FIREBASE_AUTH_UID      │
   │ title           │ string   │ Complete React tutorial     │
   │ description     │ string   │ Learn hooks and context     │
   │ completed       │ boolean  │ false                       │
   │ estimatedMinutes│ number   │ 90                          │
   │ stream          │ string   │ Frontend Development        │
   │ priority        │ string   │ high                        │
   │ created_at      │ timestamp│ (click timestamp icon)      │
   │ updated_at      │ timestamp│ (click timestamp icon)      │
   └─────────────────┴──────────┴─────────────────────────────┘
   ```

   **For Streams:**
   ```
   Fields:
   ┌─────────────────┬──────────┬─────────────────────────────┐
   │ Field name      │ Type     │ Value                       │
   ├─────────────────┼──────────┼─────────────────────────────┤
   │ user_id         │ string   │ YOUR_FIREBASE_AUTH_UID      │
   │ name            │ string   │ Frontend Development        │
   │ description     │ string   │ Master React and TypeScript │
   │ progress        │ number   │ 0                           │
   │ color           │ string   │ #3b82f6                     │
   │ icon            │ string   │ code                        │
   │ tasksRemaining  │ number   │ 10                          │
   │ nextDeadline    │ string   │ 2025-02-01T00:00:00Z        │
   │ created_at      │ timestamp│ (click timestamp icon)      │
   │ updated_at      │ timestamp│ (click timestamp icon)      │
   └─────────────────┴──────────┴─────────────────────────────┘
   ```

5. **Click "Save"**

6. **Verify in App**
   - Refresh your ZURVAN app
   - The new data should appear!

---

## Method 3: Via Browser Console (Quick Testing) 🔧

**Best for:** Rapid testing, debugging, one-off data

### Step-by-Step:

1. **Open ZURVAN in Browser**
   - Make sure you're signed in

2. **Open Browser Console**
   - Press `F12` or `Right-click → Inspect`
   - Go to "Console" tab

3. **Get Your User ID**
   ```javascript
   // Check if you're authenticated
   console.log('User ID:', localStorage.getItem('firebase_auth_user'));
   ```

4. **Import Firestore Functions**
   ```javascript
   // Get Firestore functions
   const { createTask, createStream } = await import('/src/lib/firebase/firestore.ts');
   
   // Get auth context (if available)
   // Or use your known user ID
   const userId = "YOUR_USER_ID_HERE";
   ```

5. **Create Test Data**

   **Add a Task:**
   ```javascript
   await createTask(userId, {
     title: "Test task from console",
     description: "Testing Firestore integration",
     completed: false,
     estimatedMinutes: 30,
     stream: "Testing",
     priority: "medium"
   });
   
   console.log('✅ Task created! Refresh to see it.');
   ```

   **Add a Stream:**
   ```javascript
   await createStream(userId, {
     name: "Data Science",
     description: "Learn Python, ML, and analytics",
     progress: 15,
     color: "#10b981",
     icon: "bar-chart",
     tasksRemaining: 8,
     nextDeadline: "2025-01-25T00:00:00Z"
   });
   
   console.log('✅ Stream created! Refresh to see it.');
   ```

6. **Refresh Page**
   - Your new data should appear!

---

## 🎯 Which Method Should You Use?

| Method | When to Use | Pros | Cons |
|--------|-------------|------|------|
| **Code** | Building features, production use | ✅ Automated<br>✅ Type-safe<br>✅ Reusable | ⏰ Requires component setup |
| **Firebase Console** | Initial setup, testing | ✅ No code needed<br>✅ Visual interface | ⏰ Manual<br>❌ Slower for bulk |
| **Browser Console** | Quick testing, debugging | ✅ Fast<br>✅ No UI needed | ❌ Temporary<br>❌ Need user ID |

---

## 📋 Common Data Entry Tasks

### Add Sample Tasks for Testing

```typescript
const sampleTasks = [
  {
    title: "Learn React Hooks",
    description: "Master useState, useEffect, useContext",
    completed: false,
    estimatedMinutes: 120,
    stream: "Frontend Development",
    priority: "high"
  },
  {
    title: "Build Portfolio Website",
    description: "Create responsive portfolio with React",
    completed: false,
    estimatedMinutes: 180,
    stream: "Frontend Development",
    priority: "medium"
  },
  {
    title: "Study TypeScript",
    description: "Learn types, interfaces, and generics",
    completed: true,
    estimatedMinutes: 90,
    stream: "Frontend Development",
    priority: "high"
  }
];

// Add all at once
for (const task of sampleTasks) {
  await createTask(user.uid, task);
}
```

### Add Sample Streams

```typescript
const sampleStreams = [
  {
    name: "Frontend Development",
    description: "Master React, TypeScript, and modern web",
    progress: 45,
    color: "#3b82f6",
    icon: "code",
    tasksRemaining: 5,
    nextDeadline: "2025-01-20T00:00:00Z"
  },
  {
    name: "Backend Engineering",
    description: "Learn Node.js, databases, and APIs",
    progress: 20,
    color: "#10b981",
    icon: "server",
    tasksRemaining: 12,
    nextDeadline: "2025-02-01T00:00:00Z"
  },
  {
    name: "Data Science",
    description: "Python, ML, and data analysis",
    progress: 10,
    color: "#f59e0b",
    icon: "bar-chart",
    tasksRemaining: 15,
    nextDeadline: "2025-02-15T00:00:00Z"
  }
];

for (const stream of sampleStreams) {
  await createStream(user.uid, stream);
}
```

---

## 🔒 Important Security Notes

### ✅ What Works:
- Creating data with your own `user_id`
- Reading your own data
- Updating your own data
- Deleting your own data

### ❌ What Doesn't Work:
- Creating data with someone else's `user_id` → **Denied by security rules**
- Reading someone else's data → **Returns empty**
- Accessing data without authentication → **Permission denied**

### Required Fields:

**For Tasks:**
- ✅ `user_id` (auto-added by `createTask`)
- ✅ `title`
- ✅ `completed`
- ✅ `estimatedMinutes`
- ✅ `priority`

**For Streams:**
- ✅ `user_id` (auto-added by `createStream`)
- ✅ `name`
- ✅ `progress`

---

## 🧪 Testing Your Data Input

### Test 1: Create and Verify

```typescript
// 1. Create a task
const task = await createTask(user.uid, {
  title: "Test Task",
  completed: false,
  estimatedMinutes: 15,
  priority: "low"
});

console.log('Created task ID:', task.id);

// 2. Fetch all tasks
const allTasks = await getTasks(user.uid);
console.log('Total tasks:', allTasks.length);

// 3. Verify new task is in the list
const found = allTasks.find(t => t.id === task.id);
console.log('Found in list:', !!found);
```

### Test 2: Update and Verify

```typescript
// 1. Update the task
await updateTask(task.id, { completed: true });

// 2. Fetch updated data
const updatedTasks = await getTasks(user.uid);
const updatedTask = updatedTasks.find(t => t.id === task.id);

console.log('Task completed:', updatedTask.completed); // Should be true
```

### Test 3: Security Validation

```typescript
// This should fail (trying to use wrong user_id)
try {
  await createTask("wrong_user_id", {
    title: "Hacker Task",
    completed: false,
    estimatedMinutes: 10,
    priority: "high"
  });
  console.log('❌ Security failed - should not reach here');
} catch (error) {
  console.log('✅ Security working - operation denied');
}
```

---

## 📚 Quick Reference

### Import Functions
```typescript
import { 
  createTask, 
  getTasks, 
  updateTask, 
  deleteTask,
  createStream,
  getStreams,
  updateStream,
  deleteStream
} from '@/lib/firebase/firestore';
```

### Get User ID
```typescript
import { useAuth } from '@/contexts/AuthContext';

const { user } = useAuth();
const userId = user.uid;
```

### Create Data
```typescript
const task = await createTask(userId, { ...data });
const stream = await createStream(userId, { ...data });
```

### Read Data
```typescript
const tasks = await getTasks(userId);
const streams = await getStreams(userId);
```

### Update Data
```typescript
await updateTask(taskId, { completed: true });
await updateStream(streamId, { progress: 50 });
```

### Delete Data
```typescript
await deleteTask(taskId);
await deleteStream(streamId);
```

---

## ✅ You're Ready!

Your Firestore is fully configured and ready to receive data via any of these three methods. Choose the method that best fits your current need and start building! 🚀
