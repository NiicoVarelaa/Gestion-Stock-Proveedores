import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { toast } from 'sonner';
import { useNavigate, Link } from 'react-router-dom';
import {
  Mail,
  Lock,
  User,
  LogIn,
  UserPlus,
  ArrowRight,
  Package,
  Eye,
  EyeOff,
} from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setShowPassword(false);
    loginForm.reset();
    registerForm.reset();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo / Brand */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/25">
            <Package className="h-7 w-7 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Mini ERP</h1>
            <p className="text-sm text-gray-500">Gestión de Stock y Proveedores</p>
          </div>
        </div>

        <Card className="border-0 shadow-xl shadow-gray-200/50">
          <CardHeader className="space-y-1 pb-4">
            <div className="flex items-center justify-center gap-2">
              {isRegister ? (
                <UserPlus className="h-5 w-5 text-blue-600" />
              ) : (
                <LogIn className="h-5 w-5 text-blue-600" />
              )}
              <h2 className="text-xl font-semibold text-gray-900">
                {isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}
              </h2>
            </div>
            <p className="text-center text-sm text-gray-500">
              {isRegister
                ? 'Completa los datos para registrarte'
                : 'Ingresa tus credenciales para acceder'}
            </p>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={isRegister ? registerForm.handleSubmit(onSubmit) : loginForm.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              {isRegister && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Nombre
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="name"
                      {...registerForm.register('name')}
                      placeholder="Tu nombre"
                      className="pl-10"
                    />
                  </div>
                  {registerForm.formState.errors.name && (
                    <p className="text-sm text-red-500">{registerForm.formState.errors.name.message}</p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="email"
                    {...(isRegister ? registerForm.register('email') : loginForm.register('email'))}
                    type="email"
                    placeholder="tu@email.com"
                    className="pl-10"
                  />
                </div>
                {(isRegister ? registerForm.formState.errors.email : loginForm.formState.errors.email) && (
                  <p className="text-sm text-red-500">
                    {(isRegister ? registerForm.formState.errors.email : loginForm.formState.errors.email)?.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="password"
                    {...(isRegister ? registerForm.register('password') : loginForm.register('password'))}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {(isRegister ? registerForm.formState.errors.password : loginForm.formState.errors.password) && (
                  <p className="text-sm text-red-500">
                    {(isRegister ? registerForm.formState.errors.password : loginForm.formState.errors.password)?.message}
                  </p>
                )}
                {!isRegister && (
                  <Link to="/reset-password" className="text-sm text-blue-600 hover:underline cursor-pointer">
                    ¿Olvidaste tu contraseña?
                  </Link>
                )}
              </div>

              <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Procesando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-center text-sm text-gray-600">
                {isRegister ? '¿Ya tenés cuenta?' : '¿No tenés cuenta?'}{' '}
                <button
                  type="button"
                  className="font-medium text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                  onClick={toggleMode}
                >
                  {isRegister ? 'Iniciar Sesión' : 'Registrarse'}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-gray-400">
          Mini ERP &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
