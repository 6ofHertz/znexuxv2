import { createAuditLog } from './firebase/firestore';

export type AuditAction = 
  | 'login'
  | 'logout'
  | 'stream_create'
  | 'stream_update'
  | 'stream_delete'
  | 'task_create'
  | 'task_update'
  | 'task_delete';

interface AuditLogParams {
  userId: string;
  action: AuditAction;
  metadata?: Record<string, any>;
}

export async function logAudit({ userId, action, metadata = {} }: AuditLogParams) {
  try {
    await createAuditLog({
      user_id: userId,
      action,
      metadata,
      ip_address: null, // Client-side can't reliably get IP, would need server-side
    });
  } catch (error) {
    console.error('Audit logging error:', error);
  }
}