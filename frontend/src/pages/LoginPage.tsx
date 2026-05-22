import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const { login, register: registerUser, loading } = useAuthStore();
  const navigate = useNavigate();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '', name: '' },
  });


  const onSubmit = async (data: LoginFormData | RegisterFormData) => {
    try {
      if (isRegister) {
        const { name, email, password } = data as RegisterFormData;
        await registerUser(email, password, name);
        toast.success('Cuenta creada exitosamente');
      } else {
        const { email, password } = data as LoginFormData;
        await login(email, password);
        toast.success('Bienvenido');
      }
      navigate('/');
    } catch {
      toast.error(isRegister ? 'Error al crear cuenta' : 'Credenciales inválidas');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}
          </CardTitle>
          <CardDescription className="text-center">
            {isRegister
              ? 'Completa los datos para registrarte'
              : 'Ingresa tus credenciales para acceder'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={isRegister ? registerForm.handleSubmit(onSubmit) : loginForm.handleSubmit(onSubmit)} className="space-y-4">
            {isRegister && (
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input {...registerForm.register('name')} placeholder="Tu nombre" />
                {registerForm.formState.errors.name && (
                  <p className="text-sm text-red-500">{registerForm.formState.errors.name.message}</p>
                )}
              </div>
            )}
            <div className="space-y-2">
              <Label>Email</Label>
              <Input {...(isRegister ? registerForm.register('email') : loginForm.register('email'))} type="email" placeholder="tu@email.com" />
              {(isRegister ? registerForm.formState.errors.email : loginForm.formState.errors.email) && (
                <p className="text-sm text-red-500">
                  {(isRegister ? registerForm.formState.errors.email : loginForm.formState.errors.email)?.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Contraseña</Label>
              <Input {...(isRegister ? registerForm.register('password') : loginForm.register('password'))} type="password" placeholder="••••••••" />
              {(isRegister ? registerForm.formState.errors.password : loginForm.formState.errors.password) && (
                <p className="text-sm text-red-500">
                  {(isRegister ? registerForm.formState.errors.password : loginForm.formState.errors.password)?.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {isRegister ? 'Registrarse' : 'Iniciar Sesión'}
            </Button>
            <p className="text-center text-sm text-gray-600">
              {isRegister ? '¿Ya tenés cuenta?' : '¿No tenés cuenta?'}{' '}
              <button
                type="button"
                className="text-blue-600 hover:underline"
                onClick={() => setIsRegister(!isRegister)}
              >
                {isRegister ? 'Iniciar Sesión' : 'Registrarse'}
              </button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
