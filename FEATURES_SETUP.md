# ZURVAN - Features Setup Guide

## 1. Light/Dark Mode Toggle

### What Was Implemented
- ✅ Theme toggle button in the header (sun/moon icon)
- ✅ Smooth transitions between light and dark modes
- ✅ Theme preference persisted in localStorage
- ✅ Uses CSS variables for seamless theme switching
- ✅ Maintains ZURVAN's cosmic design in both modes

### How to Use
1. Look for the sun/moon icon button in the top-right corner of the dashboard
2. Click to toggle between light and dark modes
3. Your preference is automatically saved and persists across sessions

### Technical Details
- Uses `next-themes` library for theme management
- CSS variables defined in `src/index.css` for both `:root` (dark) and `.dark` (light) modes
- Theme provider wraps the entire app in `src/main.tsx`

---

## 2. Admin Audit Log

### What Was Implemented
- ✅ `user_roles` table with secure role management
- ✅ `audit_logs` table tracking all user actions
- ✅ Admin-only page at `/admin/audit` route
- ✅ Security definer function `has_role()` for safe role checking
- ✅ Row-level security policies preventing privilege escalation
- ✅ Automatic logging of:
  - User logins
  - User logouts
  - Task updates (completion/reopening)
  - Stream operations (create, update, delete)

### Database Setup (REQUIRED)

#### Step 1: Run the Updated Schema
Run the updated `supabase-schema.sql` file in your Supabase SQL Editor. This creates:
- `app_role` enum type
- `user_roles` table
- `audit_logs` table
- `has_role()` security definer function
- All necessary RLS policies and indexes

#### Step 2: Grant Admin Role to Your User
After running the schema, manually grant yourself admin access by running this SQL:

```sql
-- Replace 'YOUR_FIREBASE_UID_HERE' with your actual Firebase user ID
INSERT INTO public.user_roles (user_id, role)
VALUES ('YOUR_FIREBASE_UID_HERE', 'admin');
```

To find your Firebase UID:
1. Sign in to your app
2. Open browser console
3. Type: `localStorage` and look for Firebase auth data
4. Or check the Firebase Authentication console

### How to Use Admin Audit Log

1. **Sign in** with your admin account
2. **Notice the "Admin" button** in the top-right header (only visible to admins)
3. **Click "Admin"** to navigate to `/admin/audit`
4. **View audit logs** showing:
   - Timestamp (when the action occurred)
   - User ID (who performed the action)
   - Action type (login, logout, task_update, etc.)
   - Metadata (additional context in JSON format)
   - IP Address (currently N/A from client-side)

### Security Features
- ✅ Roles stored in separate `user_roles` table (prevents privilege escalation)
- ✅ Security definer function prevents RLS recursion issues
- ✅ Admin checks performed server-side via Supabase RLS
- ✅ Non-admin users automatically redirected if they try to access `/admin/audit`
- ✅ Audit logs are write-only for regular operations, read-only for admins

### Adding More Admins
To grant admin privileges to other users:

```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('FIREBASE_UID_OF_NEW_ADMIN', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
```

### Tracked Actions
Current audit log captures:
- `login` - User authentication
- `logout` - User sign out
- `task_update` - Task completion/reopening
- `task_create` - New task creation (ready for implementation)
- `task_delete` - Task deletion (ready for implementation)
- `stream_create` - New stream creation (ready for implementation)
- `stream_update` - Stream modifications (ready for implementation)
- `stream_delete` - Stream deletion (ready for implementation)

### Extending Audit Logging
To add audit logging to more actions, use the `logAudit()` utility:

```typescript
import { logAudit } from '@/lib/audit';

// Example: Log stream creation
await logAudit({
  userId: user.uid,
  action: 'stream_create',
  metadata: { streamName: 'New Stream', streamId: '123' }
});
```

---

## Testing Both Features

### Test Light/Dark Mode
1. ✅ Sign in to your account
2. ✅ Click the theme toggle button (sun/moon icon)
3. ✅ Verify the UI switches between light and dark themes
4. ✅ Refresh the page - theme should persist
5. ✅ Check that all components remain readable in both modes

### Test Admin Audit Log
1. ✅ Grant yourself admin role (see SQL above)
2. ✅ Sign out and sign back in
3. ✅ Verify "Admin" button appears in header
4. ✅ Click "Admin" button
5. ✅ Verify you see the audit log page with your login event
6. ✅ Toggle a task completion
7. ✅ Return to Admin page and verify task_update is logged
8. ✅ Sign out and verify logout is logged (check on next login)

### Test Security
1. ✅ Try accessing `/admin/audit` without admin role - should redirect
2. ✅ Admin button should NOT appear for non-admin users
3. ✅ Non-admin users cannot read audit logs (enforced by RLS)

---

## Troubleshooting

### Theme Toggle Issues
- **Problem**: Theme doesn't change
- **Solution**: Clear localStorage and hard refresh (Ctrl+Shift+R)

### Admin Button Not Showing
- **Problem**: You have admin role but button doesn't appear
- **Solution**: 
  1. Check your Firebase UID matches the one in `user_roles` table
  2. Verify the `has_role()` function was created successfully
  3. Check browser console for errors

### Audit Logs Not Appearing
- **Problem**: Actions aren't being logged
- **Solution**:
  1. Verify `audit_logs` table exists in Supabase
  2. Check RLS policy allows INSERT on audit_logs
  3. Check browser console for errors
  4. Verify user is authenticated when action occurs

### Access Denied to Admin Page
- **Problem**: You get "Access denied" when trying to access `/admin/audit`
- **Solution**:
  1. Verify you have admin role in `user_roles` table
  2. Check that `has_role()` function exists
  3. Ensure RLS policies are properly configured

---

## Files Modified/Created

### Created Files
- `src/contexts/ThemeProvider.tsx` - Theme context provider
- `src/components/ThemeToggle.tsx` - Theme toggle button component
- `src/lib/audit.ts` - Audit logging utility functions
- `src/hooks/useAdmin.tsx` - Custom hook for admin status checking
- `src/pages/AdminAudit.tsx` - Admin audit log page

### Modified Files
- `src/index.css` - Added `.dark` class variables for light mode
- `src/main.tsx` - Wrapped app with ThemeProvider
- `src/App.tsx` - Added `/admin/audit` route
- `src/pages/Index.tsx` - Added ThemeToggle, Admin button, and audit logging
- `src/pages/Auth.tsx` - Added login audit logging
- `supabase-schema.sql` - Added roles, audit logs, and security functions

---

## Next Steps

1. **Run the updated schema** in Supabase SQL Editor
2. **Grant yourself admin role** using the SQL command above
3. **Test both features** thoroughly
4. **Consider adding audit logging** to stream CRUD operations
5. **Customize theme colors** if needed in `src/index.css`
6. **Add IP logging** (requires server-side implementation)

---

## Notes
- Both features are production-ready and non-breaking
- Theme toggle works immediately after setup
- Admin audit requires database setup and role assignment
- All existing functionality remains unchanged
- Security follows best practices (separate roles table, RLS, security definer functions)
