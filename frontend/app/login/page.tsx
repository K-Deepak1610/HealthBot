'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, UserPlus, ShieldCheck, Mail, Lock, User, Loader2, Heart, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

const authSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address").optional().or(z.literal('')),
  password: z.string().min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[a-z]/, "Must contain a lowercase letter")
    .regex(/\d/, "Must contain a number")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Must contain a special character"),
});

type AuthFormValues = z.infer<typeof authSchema>;

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors } } = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
  });

  const onSubmit = async (data: AuthFormValues) => {
    setLoading(true);
    try {
      if (isLogin) {
        // FastAPI OAuth2 expects form data for login
        const formData = new FormData();
        formData.append('username', data.username);
        formData.append('password', data.password);
        
        const res = await authApi.login(formData);
        localStorage.setItem('access_token', res.data.access_token);
        localStorage.setItem('refresh_token', res.data.refresh_token);
        toast("Welcome back to HealthBot!", "success");
        router.push('/dashboard');
      } else {
        await authApi.register({ ...data, role: "patient" });
        toast("Registration successful! Please login.", "success");
        setIsLogin(true);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? (err as any).response?.data?.detail || err.message : "Authentication failed";
      toast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-24 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-medical-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-medical-secondary/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[480px] relative z-10"
      >
        <Card variant="glass" className="p-10 md:p-14 border-border/20 shadow-2xl backdrop-blur-3xl">
          <div className="text-center mb-10">
            <div className="medical-gradient w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-medical-primary/20">
              <ShieldCheck size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-black mb-2 tracking-tight">
              {isLogin ? 'Secure Access' : 'Medical Onboarding'}
            </h1>
            <p className="text-muted-foreground font-medium">
              {isLogin ? 'Sign in to continue your care' : 'Join the healthcare revolution today'}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-1">
                 <Input 
                   {...register('username')}
                   placeholder="Username" 
                   className={errors.username ? "border-destructive/50" : ""}
                 />
                 {errors.username && <p className="text-xs text-destructive font-semibold px-2">{errors.username.message}</p>}
              </div>

              {!isLogin && (
                <div className="space-y-1">
                  <Input 
                    {...register('email')}
                    type="email" 
                    placeholder="Email Address" 
                  />
                  {errors.email && <p className="text-xs text-destructive font-semibold px-2">{errors.email.message}</p>}
                </div>
              )}

              <div className="space-y-1">
                <Input 
                  {...register('password')}
                  type="password" 
                  placeholder="Password" 
                  className={errors.password ? "border-destructive/50" : ""}
                />
                {errors.password && <p className="text-xs text-destructive font-semibold px-2">{errors.password.message}</p>}
              </div>
            </div>

            <Button 
               type="submit" 
               isLoading={loading}
               variant="medical"
               size="lg"
               className="w-full mt-6"
            >
              {isLogin ? 'Enter Portal' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-border/50 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-muted-foreground font-bold hover:text-medical-primary transition-colors flex items-center justify-center gap-2 mx-auto text-sm"
            >
              {isLogin ? "New to HealthBot? Register" : 'Already part of the network? Sign In'}
              <ArrowRight size={14} />
            </button>
          </div>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-8 px-4 leading-relaxed">
          Accessing this portal signifies agreement with our <span className="underline decoration-medical-primary underline-offset-4 cursor-pointer text-foreground">Compliance Standards</span> and <span className="underline decoration-medical-primary underline-offset-4 cursor-pointer text-foreground">Privacy Protection Policy</span>.
        </p>
      </motion.div>
    </div>
  );
}
