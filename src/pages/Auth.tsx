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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, ShieldCheck, AlertCircle } from 'lucide-react';

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignInFormData = z.infer<typeof signInSchema>;
type SignUpFormData = z.infer<typeof signUpSchema>;

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const { signUp, signIn, user, loading, resendVerificationEmail } = useAuth();
  const navigate = useNavigate();
  
  const signInForm = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });
  
  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  useEffect(() => {
    if (!loading && user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const onSignIn = async (data: SignInFormData) => {
    const { error } = await signIn(data.email, data.password);
      
    if (error) {
      toast.error(error.message || 'Failed to sign in');
    } else {
      toast.success('Welcome back! 🎉');
      if (user) {
        await logAudit({
          userId: user.uid,
          action: 'login',
          metadata: { method: 'email' }
        });
      }
      navigate('/');
    }
  };

  const onSignUp = async (data: SignUpFormData) => {
    const { error } = await signUp(data.email, data.password, data.name);
      
    if (error) {
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Email already in use. Please sign in instead.');
      } else {
        toast.error(error.message || 'Failed to create account');
      }
    } else {
      toast.success('Account created! 🎉', {
        description: 'Please check your email to verify your account.',
      });
      // Switch to sign in mode
      setIsSignUp(false);
      signUpForm.reset();
    }
  };

  const handleResendVerification = async () => {
    const { error } = await resendVerificationEmail();
    if (error) {
      toast.error('Failed to send verification email');
    } else {
      toast.success('Verification email sent! 📧', {
        description: 'Please check your inbox.',
      });
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
        
        {/* Email Verification Notice */}
        {user && !user.emailVerified && (
          <Alert className="mb-6 border-amber-500/50 bg-amber-500/10">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <AlertDescription className="text-sm">
              <p className="font-medium mb-2">Please verify your email</p>
              <p className="text-xs text-muted-foreground mb-3">
                We sent a verification link to {user.email}
              </p>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleResendVerification}
                className="gap-2"
              >
                <Mail className="h-3 w-3" />
                Resend Verification Email
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        {isSignUp ? (
          <form onSubmit={signUpForm.handleSubmit(onSignUp)} className="space-y-4">
            <div>
              <Input 
                {...signUpForm.register('name')} 
                type="text" 
                placeholder="Full Name" 
                className="w-full"
                disabled={signUpForm.formState.isSubmitting}
              />
              {signUpForm.formState.errors.name && (
                <p className="text-sm text-destructive mt-1">
                  {signUpForm.formState.errors.name.message}
                </p>
              )}
            </div>
            
            <div>
              <Input 
                {...signUpForm.register('email')} 
                type="email" 
                placeholder="Email" 
                className="w-full"
                disabled={signUpForm.formState.isSubmitting}
              />
              {signUpForm.formState.errors.email && (
                <p className="text-sm text-destructive mt-1">
                  {signUpForm.formState.errors.email.message}
                </p>
              )}
            </div>
            
            <div>
              <Input 
                {...signUpForm.register('password')} 
                type="password" 
                placeholder="Password (min. 6 characters)" 
                className="w-full"
                disabled={signUpForm.formState.isSubmitting}
              />
              {signUpForm.formState.errors.password && (
                <p className="text-sm text-destructive mt-1">
                  {signUpForm.formState.errors.password.message}
                </p>
              )}
            </div>
            
            <div>
              <Input 
                {...signUpForm.register('confirmPassword')} 
                type="password" 
                placeholder="Confirm Password" 
                className="w-full"
                disabled={signUpForm.formState.isSubmitting}
              />
              {signUpForm.formState.errors.confirmPassword && (
                <p className="text-sm text-destructive mt-1">
                  {signUpForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full gap-2" 
              disabled={signUpForm.formState.isSubmitting}
            >
              {signUpForm.formState.isSubmitting ? (
                'Creating Account...'
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  Create Account
                </>
              )}
            </Button>
          </form>
        ) : (
          <form onSubmit={signInForm.handleSubmit(onSignIn)} className="space-y-4">
            <div>
              <Input 
                {...signInForm.register('email')} 
                type="email" 
                placeholder="Email" 
                className="w-full"
                disabled={signInForm.formState.isSubmitting}
              />
              {signInForm.formState.errors.email && (
                <p className="text-sm text-destructive mt-1">
                  {signInForm.formState.errors.email.message}
                </p>
              )}
            </div>
            
            <div>
              <Input 
                {...signInForm.register('password')} 
                type="password" 
                placeholder="Password" 
                className="w-full"
                disabled={signInForm.formState.isSubmitting}
              />
              {signInForm.formState.errors.password && (
                <p className="text-sm text-destructive mt-1">
                  {signInForm.formState.errors.password.message}
                </p>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={signInForm.formState.isSubmitting}
            >
              {signInForm.formState.isSubmitting ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        )}
        
        <p className="text-center mt-4 text-sm text-muted-foreground">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="ml-2 text-primary hover:underline"
            disabled={signInForm.formState.isSubmitting || signUpForm.formState.isSubmitting}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
        
        {isSignUp && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="text-xs text-muted-foreground space-y-1">
                <p className="font-medium text-foreground">Email Verification Required</p>
                <p>After signing up, you'll receive a verification email. Please verify your email address to access all features.</p>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}