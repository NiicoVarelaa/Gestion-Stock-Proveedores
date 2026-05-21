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

  const form = useForm<LoginFormData | RegisterFormData>({
    resolver: zodResolver(isRegister ? registerSchema : loginSchema),
    defaultValues: { email: '', password: '', name: '' },
  });

  const onSubmit = async (data: LoginFormData | RegisterFormData) => {
    try {
      if (isRegister) {
        const { name } = data as RegisterFormData;
        await registerUser(data.email, data.password, name);
        toast.success('Cuenta creada exitosamente');
      } else {
        await login(data.email, data.password);
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {isRegister && (
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input {...form.register('name' as never)} placeholder="Tu nombre" />
                {(form.formState.errors as Record<string, { message?: string }>)?.name && (
                  <p className="text-sm text-red-500">
                    {(form.formState.errors as Record<string, { message?: string }>)?.name?.message}
                  </p>
                )}
              </div>
            )}
            <div className="space-y-2">
              <Label>Email</Label>
              <Input {...form.register('email')} type="email" placeholder="tu@email.com" />
              {form.formState.errors.email && (
                <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Contraseña</Label>
              <Input {...form.register('password')} type="password" placeholder="••••••••" />
              {form.formState.errors.password && (
                <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
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
