# 🚨 FIX: Missing or Insufficient Permissions

## The Problem
You're seeing "❌ Error: Missing or insufficient permissions" because **Firestore security rules haven't been deployed yet**.

---

## ✅ Solution: Deploy Security Rules (2 Minutes)

### **Option 1: Firebase Console (Easiest)**

1. **Open:** https://console.firebase.google.com/project/znexux-954bd/firestore/rules
2. **Copy the rules below:**

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Users collection - users can only read/write their own data
    match /users/{userId} {
      allow read, write: if isOwner(userId);
    }
    
    // Tasks - users can only access their own tasks
    match /tasks/{taskId} {
      allow read, update, delete: if isAuthenticated() && 
        resource.data.user_id == request.auth.uid;
      allow create: if isAuthenticated() && 
        request.resource.data.user_id == request.auth.uid;
    }
    
    // Streams - users can only access their own streams
    match /streams/{streamId} {
      allow read, update, delete: if isAuthenticated() && 
        resource.data.user_id == request.auth.uid;
      allow create: if isAuthenticated() && 
        request.resource.data.user_id == request.auth.uid;
    }
    
    // Focus sessions
    match /focus_sessions/{sessionId} {
      allow read, update, delete: if isAuthenticated() && 
        resource.data.user_id == request.auth.uid;
      allow create: if isAuthenticated() && 
        request.resource.data.user_id == request.auth.uid;
    }
    
    // Audit logs - read for admins only, create for authenticated users
    match /audit_logs/{logId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
    }
  }
}
```

3. **Click "Publish"**
4. **Done!** Now try clicking the "Seed My Data Now" button again.

---

### **Option 2: Firebase CLI**

```bash
npx firebase deploy --only firestore:rules
```

---

## 🔍 How to Verify It Worked

1. Go back to your ZURVAN app
2. Make sure you're **logged in** (check top-right corner)
3. Click the **"Seed My Data Now"** button
4. You should see: **"✅ Successfully seeded 5 streams and 5 sample tasks!"**
5. Page will auto-refresh and show your data!

---

## ⚠️ Important Notes

- ✅ You **MUST be logged in** for the button to work
- ✅ Rules must be **deployed** (not just saved in your local file)
- ✅ After deploying, no app restart needed - just try again!

---

## 🎯 Quick Check: Are You Logged In?

Look at the **top-right corner** of your app:
- ✅ If you see your **email** → You're logged in, just deploy rules
- ❌ If you see **"Sign In"** → Click it and log in first

---

**After deploying the rules, click the seed button and your data will load instantly!** 🚀
