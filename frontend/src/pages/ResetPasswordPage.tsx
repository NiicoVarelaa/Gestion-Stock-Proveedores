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
import { ArrowLeft, Mail, Key, Lock, Package, Eye, EyeOff } from 'lucide-react';

const emailSchema = z.object({
  email: z.string().email('Email inválido'),
});

const codeSchema = z.object({
  code: z.string().length(6, 'El código debe tener 6 dígitos'),
});

const passwordSchema = z.object({
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  confirmPassword: z.string().min(1, 'Confirmá tu contraseña'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

type EmailFormData = z.infer<typeof emailSchema>;
type CodeFormData = z.infer<typeof codeSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function ResetPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { forgotPassword, verifyResetCode, resetPassword, loading } = useAuthStore();
  const navigate = useNavigate();

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  });

  const codeForm = useForm<CodeFormData>({
    resolver: zodResolver(codeSchema),
    defaultValues: { code: '' },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onEmailSubmit = async (data: EmailFormData) => {
    try {
      await forgotPassword(data.email);
      setEmail(data.email);
      setStep(2);
      toast.success('Código enviado a tu email');
    } catch {
      toast.error('Error al enviar el código');
    }
  };

  const onCodeSubmit = async (data: CodeFormData) => {
    try {
      await verifyResetCode(email, data.code);
      setStep(3);
      toast.success('Código verificado');
    } catch {
      toast.error('Código inválido o expirado');
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    try {
      const code = codeForm.getValues('code');
      await resetPassword(email, code, data.password);
      toast.success('Contraseña actualizada correctamente');
      navigate('/login');
    } catch {
      toast.error('Error al actualizar la contraseña');
    }
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
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => step > 1 ? setStep(step - 1) : navigate('/login')}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-semibold text-gray-900">Recuperar contraseña</h2>
            </div>
            <p className="text-sm text-gray-500 ml-10">
              {step === 1 && 'Ingresá tu email para recibir un código de verificación'}
              {step === 2 && 'Ingresá el código de 6 dígitos que enviamos a tu email'}
              {step === 3 && 'Ingresá tu nueva contraseña'}
            </p>

            {/* Step indicators */}
            <div className="flex items-center gap-2 mt-4 ml-10">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-medium ${
                      step >= s
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {s}
                  </div>
                  {s < 3 && (
                    <div className={`w-8 h-0.5 ${step > s ? 'bg-blue-600' : 'bg-gray-200'}`} />
                  )}
                </div>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            {step === 1 && (
              <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="email"
                      {...emailForm.register('email')}
                      type="email"
                      placeholder="tu@email.com"
                      className="pl-10"
                    />
                  </div>
                  {emailForm.formState.errors.email && (
                    <p className="text-sm text-red-500">{emailForm.formState.errors.email.message}</p>
                  )}
                </div>
                <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Enviando...
                    </span>
                  ) : 'Enviar código'}
                </Button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={codeForm.handleSubmit(onCodeSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code" className="text-sm font-medium text-gray-700">Código de verificación</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="code"
                      {...codeForm.register('code')}
                      placeholder="000000"
                      maxLength={6}
                      className="pl-10 text-center text-2xl tracking-widest"
                    />
                  </div>
                  {codeForm.formState.errors.code && (
                    <p className="text-sm text-red-500">{codeForm.formState.errors.code.message}</p>
                  )}
                  <p className="text-xs text-gray-500 text-center">
                    Código enviado a <strong>{email}</strong>
                  </p>
                </div>
                <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Verificando...
                    </span>
                  ) : 'Verificar código'}
                </Button>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">Nueva contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="password"
                      {...passwordForm.register('password')}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Mínimo 8 caracteres"
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
                  {passwordForm.formState.errors.password && (
                    <p className="text-sm text-red-500">{passwordForm.formState.errors.password.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirmar contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      {...passwordForm.register('confirmPassword')}
                      type="password"
                      placeholder="Repetí tu contraseña"
                      className="pl-10"
                    />
                  </div>
                  {passwordForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-red-500">{passwordForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>
                <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Actualizando...
                    </span>
                  ) : 'Actualizar contraseña'}
                </Button>
              </form>
            )}

            <div className="mt-6 pt-4 border-t border-gray-100">
              <Link to="/login" className="text-sm text-blue-600 hover:text-blue-700 hover:underline cursor-pointer">
                Volver al login
              </Link>
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
