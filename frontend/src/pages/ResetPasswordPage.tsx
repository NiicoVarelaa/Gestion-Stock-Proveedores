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
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Key, Lock } from 'lucide-react';

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
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="icon" onClick={() => step > 1 ? setStep(step - 1) : navigate('/login')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-xl">Recuperar contraseña</CardTitle>
          </div>
          <CardDescription>
            {step === 1 && 'Ingresá tu email para recibir un código de verificación'}
            {step === 2 && 'Ingresá el código de 6 dígitos que enviamos a tu email'}
            {step === 3 && 'Ingresá tu nueva contraseña'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <Label>Email</Label>
                </div>
                <Input {...emailForm.register('email')} type="email" placeholder="tu@email.com" />
                {emailForm.formState.errors.email && (
                  <p className="text-sm text-red-500">{emailForm.formState.errors.email.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                Enviar código
              </Button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={codeForm.handleSubmit(onCodeSubmit)} className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4 text-gray-500" />
                  <Label>Código de verificación</Label>
                </div>
                <Input
                  {...codeForm.register('code')}
                  placeholder="000000"
                  maxLength={6}
                  className="text-center text-2xl tracking-widest"
                />
                {codeForm.formState.errors.code && (
                  <p className="text-sm text-red-500">{codeForm.formState.errors.code.message}</p>
                )}
                <p className="text-xs text-gray-500 text-center">
                  Código enviado a <strong>{email}</strong>
                </p>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                Verificar código
              </Button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-gray-500" />
                  <Label>Nueva contraseña</Label>
                </div>
                <Input {...passwordForm.register('password')} type="password" placeholder="Mínimo 8 caracteres" />
                {passwordForm.formState.errors.password && (
                  <p className="text-sm text-red-500">{passwordForm.formState.errors.password.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Confirmar contraseña</Label>
                <Input {...passwordForm.register('confirmPassword')} type="password" placeholder="Repetí tu contraseña" />
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-500">{passwordForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                Actualizar contraseña
              </Button>
            </form>
          )}

          <div className="mt-4 text-center">
            <Link to="/login" className="text-sm text-blue-600 hover:underline">
              Volver al login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
