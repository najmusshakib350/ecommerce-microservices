import { Card, CardBody, CardHeader } from '@/components/ui';
import { RegisterForm } from '@/features/auth/components/register-form';

export const metadata = {
  title: 'Register',
};

export default function RegisterPage() {
  return (
    <div className="mx-auto flex max-w-md flex-1 flex-col justify-center px-4 py-12">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-bold text-slate-900">Create account</h1>
          <p className="mt-1 text-sm text-slate-600">Registers via user-service API</p>
        </CardHeader>
        <CardBody>
          <RegisterForm />
        </CardBody>
      </Card>
    </div>
  );
}
