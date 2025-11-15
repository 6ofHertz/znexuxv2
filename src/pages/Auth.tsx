import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { logAudit } from '@/lib/audit';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const authSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type AuthFormData = z.infer<typeof authSchema>;

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const { signUp, signIn, user, loading } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
  });

  useEffect(() => {
    if (!loading && user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const onSubmit = async (data: AuthFormData) => {
    const { error } = isSignUp 
      ? await signUp(data.email, data.password)
      : await signIn(data.email, data.password);
      
    if (error) {
      toast.error(error.message || 'An error occurred');
    } else {
      if (isSignUp) {
        toast.success('Account created! Welcome to ZURVAN');
      } else if (user) {
        // Log audit for successful login
        await logAudit({
          userId: user.uid,
          action: 'login',
          metadata: { method: 'email' }
        });
      }
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="cosmic-card p-8 w-full max-w-md">
        <h1 className="font-display text-4xl font-bold text-center mb-2 gold-glow">
          ZURVAN
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          {isSignUp ? 'Create your learning command center' : 'Welcome back'}
        </p>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input 
              {...register('email')} 
              type="email" 
              placeholder="Email" 
              className="w-full"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
            )}
          </div>
          
          <div>
            <Input 
              {...register('password')} 
              type="password" 
              placeholder="Password" 
              className="w-full"
              disabled={isSubmitting}
            />
            {errors.password && (
              <p className="text-sm text-destructive mt-1">{errors.password.message}</p>
            )}
          </div>
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </Button>
        </form>
        
        <p className="text-center mt-4 text-sm text-muted-foreground">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="ml-2 text-primary hover:underline"
            disabled={isSubmitting}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </Card>
    </div>
  );
}