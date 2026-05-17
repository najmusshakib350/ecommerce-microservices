import { Card, CardBody, CardHeader } from '@/components/ui';
import { LoginForm } from '@/features/auth/components/login-form';

export const metadata = {
  title: 'Sign in',
};

export default function LoginPage() {
  return (
    <div className="mx-auto flex max-w-md flex-1 flex-col justify-center px-4 py-12">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-bold text-slate-900">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-600">Sign in with your registered email</p>
        </CardHeader>
        <CardBody>
          <LoginForm />
        </CardBody>
      </Card>
    </div>
  );
}
