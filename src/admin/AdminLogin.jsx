import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext.jsx';

const schema = z.object({
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres')
});

const AdminLogin = () => {
  const { login } = useAdminAuth();
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data) => {
    setErrorMessage('');
    const success = await login(data.password);
    if (success) {
      navigate('/backoffice');
      return;
    }
    setErrorMessage('Credenciales inválidas. Verifica la frase secreta de administrador.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D1A2F] text-[#F8FAFC] px-4">
      <div className="w-full max-w-md rounded-[2rem] border border-[#17364F] bg-[#17364F]/95 p-8 shadow-[0_35px_80px_-40px_rgba(0,0,0,0.7)]">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-2xl bg-[#09D8C7]/10 text-[#09D8C7]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#C9F7EE]/80">Acceso seguro</p>
            <h1 className="text-2xl font-semibold text-white">Ingreso al admin privado</h1>
          </div>
        </div>

        <p className="text-sm text-[#C9F7EE]/80 mb-6">
          Esta ruta está oculta de la navegación pública y requiere acceso admin.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-[#E2E8F0] mb-2">
              Frase de administrador
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register('password')}
              className="w-full rounded-2xl border border-[#09D8C7]/30 bg-[#0D1A2F] px-4 py-3 text-white focus:border-[#09D8C7] focus:ring-[#09D8C7]/40 outline-none"
            />
            {errors.password && (
              <p className="mt-2 text-xs text-[#BD0927]">{errors.password.message}</p>
            )}
          </div>

          {errorMessage && <p className="text-xs text-[#BD0927]">{errorMessage}</p>}

          <button
            type="submit"
            className="w-full rounded-2xl bg-[#09D8C7] px-5 py-3 text-sm font-semibold text-[#0D1A2F] hover:bg-[#08c1b6] transition"
          >
            Acceder al admin
          </button>
        </form>

        {/* <p className="text-xs text-[#9CA3AF] mt-5">
          Define <code className="rounded bg-[#0D1A2F] px-1 py-0.5">VITE_ADMIN_PASSWORD</code> en tu entorno para acceso seguro.
        </p> */}
      </div>
    </div>
  );
};

export default AdminLogin;
