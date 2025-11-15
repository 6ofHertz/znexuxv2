# Zurvan Supabase Setup Guide

This guide will help you connect your Zurvan app to Supabase for data storage while using Firebase for authentication.

## Prerequisites

1. A Firebase project (already configured)
2. A Supabase project (create one at https://supabase.com)

## Step 1: Set Up Supabase Project

1. Go to [Supabase](https://supabase.com) and create a new project
2. Wait for the project to finish setting up

## Step 2: Create Database Tables

1. In your Supabase dashboard, go to the **SQL Editor**
2. Copy the contents of `supabase-schema.sql` file
3. Paste it into the SQL editor and click **Run**
4. This will create the `tasks` and `streams` tables with proper RLS policies

## Step 3: Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

## Step 4: Update Environment Variables

Update your `.env` file with both Firebase and Supabase credentials:

```env
# Firebase Configuration (already set)
VITE_FIREBASE_API_KEY="your-firebase-api-key"
VITE_FIREBASE_AUTH_DOMAIN="your-firebase-auth-domain"
VITE_FIREBASE_PROJECT_ID="your-firebase-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-firebase-storage-bucket"
VITE_FIREBASE_MESSAGING_SENDER_ID="your-firebase-messaging-sender-id"
VITE_FIREBASE_APP_ID="your-firebase-app-id"

# Supabase Configuration (add these)
VITE_SUPABASE_URL="https://xxxxx.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJ..."
```

## Step 5: Test the Integration

1. Start your development server
2. Sign up or sign in using Firebase authentication
3. The app will now fetch and store data in your Supabase database
4. Each user's data is isolated by their Firebase UID

## How It Works

- **Authentication**: Firebase handles user login/signup
- **Data Storage**: Supabase stores tasks and streams
- **Data Isolation**: Each user's Firebase UID is stored in Supabase to keep data separate

## Adding Sample Data

To add sample data to your Supabase database:

1. Sign in to the app with a Firebase account
2. Note your Firebase UID (check browser console or Firebase Authentication dashboard)
3. Go to Supabase **Table Editor**
4. Manually add some tasks and streams with your `user_id` set to your Firebase UID

Or run this SQL with your actual Firebase UID:

```sql
-- Replace 'YOUR_FIREBASE_UID' with your actual Firebase user ID
INSERT INTO streams (user_id, name, description, progress, color, icon, tasks_remaining)
VALUES 
  ('YOUR_FIREBASE_UID', 'React Mastery', 'Building modern web apps', 75, '#3B82F6', '⚛️', 8),
  ('YOUR_FIREBASE_UID', 'TypeScript Deep Dive', 'Type-safe development', 60, '#2563EB', '📘', 12);

INSERT INTO tasks (user_id, title, stream, priority, estimated_minutes, completed)
VALUES 
  ('YOUR_FIREBASE_UID', 'Complete React hooks tutorial', 'React Mastery', 'high', 45, false),
  ('YOUR_FIREBASE_UID', 'Build a todo app', 'React Mastery', 'medium', 120, false),
  ('YOUR_FIREBASE_UID', 'Learn advanced TypeScript patterns', 'TypeScript Deep Dive', 'high', 90, false);
```

## Troubleshooting

### "Failed to load data" error
- Check that your Supabase credentials in `.env` are correct
- Verify that the SQL schema was executed successfully
- Check the browser console for detailed error messages

### No data showing up
- Make sure you're signed in with Firebase
- Verify that data in Supabase has the correct `user_id` matching your Firebase UID
- Check Supabase RLS policies are set correctly

### RLS Policy Issues
- The current RLS policies allow all authenticated requests
- For production, you should update the policies to properly check `user_id = auth.uid()::text`
- Currently, we're using Firebase auth, so RLS is set to `true` for development
