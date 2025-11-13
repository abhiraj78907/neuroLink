import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { authService } from '@/lib/auth';
import { demoUsers, createDemoUsers } from '@/lib/demoUsers';
import { Activity, AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [creatingDemoUsers, setCreatingDemoUsers] = useState(false);
  const navigate = useNavigate();

  // Auto-create demo users on mount (only once)
  useEffect(() => {
    const setupDemoUsers = async () => {
      try {
        await createDemoUsers();
      } catch (error) {
        console.error('Failed to setup demo users:', error);
      }
    };
    setupDemoUsers();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const user = await authService.login(email, password);
      console.log('Login successful, user role:', user.role);
      
      // Small delay to ensure user state is updated
      await new Promise(resolve => setTimeout(resolve, 100));
      
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid email or password. Please try again.');
    }
  };

  const quickLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    const demoUser = demoUsers.find(u => u.email === demoEmail);
    const demoPassword = demoUser?.password || 'demo123';
    setPassword(demoPassword);
    setError('');
    
    try {
      const user = await authService.login(demoEmail, demoPassword);
      console.log('Login successful, user role:', user.role);
      
      // Small delay to ensure user state is updated
      await new Promise(resolve => setTimeout(resolve, 100));
      
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      // If user doesn't exist, try to create it
      if (err.message?.includes('user-not-found') || err.message?.includes('invalid-credential')) {
        setCreatingDemoUsers(true);
        try {
          await createDemoUsers();
          // Try login again
          const user = await authService.login(demoEmail, demoPassword);
          console.log('Login after creation successful, user role:', user.role);
          
          // Small delay to ensure user state is updated
          await new Promise(resolve => setTimeout(resolve, 100));
          
          navigate('/dashboard');
        } catch (createErr: any) {
          console.error('Create and login error:', createErr);
          setError(createErr.message || 'Failed to create demo user. Please try registering manually.');
        } finally {
          setCreatingDemoUsers(false);
        }
      } else {
        setError(err.message || 'Login failed. Please check your credentials.');
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 p-4">
      <Card className="w-full max-w-md card-shadow">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
              <Activity className="h-10 w-10 text-primary-foreground" />
            </div>
          </div>
          <div>
            <CardTitle className="text-3xl font-bold text-primary">NEUROCARE</CardTitle>
            <CardDescription className="text-base mt-2">
              AI-Powered Alzheimer's Detection & Care Platform
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link to="/register" className="text-primary hover:underline">
              Register
            </Link>
          </div>

          <div className="relative">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
              Demo Accounts
            </span>
          </div>

          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start h-auto min-h-[80px] py-4 px-4 hover:bg-accent/50 transition-colors"
              onClick={() => quickLogin('doctor@neurocare.demo')}
              disabled={creatingDemoUsers}
            >
              <div className="flex items-center gap-4 w-full">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-base shrink-0">
                  D
                </div>
                <div className="text-left flex-1 space-y-1">
                  <div className="font-semibold text-base">Doctor Account</div>
                  <div className="text-sm text-muted-foreground">doctor@neurocare.demo</div>
                  <div className="text-xs text-muted-foreground font-mono">Password: demo123</div>
                </div>
                {creatingDemoUsers && (
                  <div className="shrink-0">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  </div>
                )}
              </div>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start h-auto min-h-[80px] py-4 px-4 hover:bg-accent/50 transition-colors"
              onClick={() => quickLogin('caregiver@neurocare.demo')}
              disabled={creatingDemoUsers}
            >
              <div className="flex items-center gap-4 w-full">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-base shrink-0">
                  C
                </div>
                <div className="text-left flex-1 space-y-1">
                  <div className="font-semibold text-base">Caregiver Account</div>
                  <div className="text-sm text-muted-foreground">caregiver@neurocare.demo</div>
                  <div className="text-xs text-muted-foreground font-mono">Password: demo123</div>
                </div>
                {creatingDemoUsers && (
                  <div className="shrink-0">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  </div>
                )}
              </div>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start h-auto min-h-[80px] py-4 px-4 hover:bg-accent/50 transition-colors"
              onClick={() => quickLogin('patient@neurocare.demo')}
              disabled={creatingDemoUsers}
            >
              <div className="flex items-center gap-4 w-full">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-base shrink-0">
                  P
                </div>
                <div className="text-left flex-1 space-y-1">
                  <div className="font-semibold text-base">Patient Account</div>
                  <div className="text-sm text-muted-foreground">patient@neurocare.demo</div>
                  <div className="text-xs text-muted-foreground font-mono">Password: demo123</div>
                </div>
                {creatingDemoUsers && (
                  <div className="shrink-0">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  </div>
                )}
              </div>
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Demo accounts are automatically created on first use. Click any demo account above to sign in.
          </p>
          
          <div className="text-xs text-center text-muted-foreground space-y-1 mt-2 p-2 bg-muted rounded">
            <p className="font-medium">Demo Credentials:</p>
            <p>All demo accounts use password: <strong>demo123</strong></p>
            <p className="text-[10px] mt-1">Accounts are auto-created if they don't exist</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
