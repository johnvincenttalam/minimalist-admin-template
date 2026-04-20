import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod/v4'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { useAuthStore, getDefaultRoute } from '@/features/auth/store/auth-store'
import { appConfig } from '@/config/app'
import { Button } from '@/shared/ui/button'
import { toast } from 'sonner'

const loginSchema = z.object({
  email: z.email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

type LoginForm = z.infer<typeof loginSchema>

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    setLoading(true)
    setError('')
    try {
      const success = await login(data.email, data.password)
      if (success) {
        toast.success('Welcome back!')
        const user = useAuthStore.getState().user!
        navigate(getDefaultRoute(user.role))
      } else {
        setError('Invalid email or password. Try the demo account below.')
        toast.error('Invalid credentials')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign-in failed'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (email: string) => {
    setValue('email', email)
    setValue('password', appConfig.demo.password)
  }

  const Logo = appConfig.logo

  return (
    <div className="min-h-screen flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#09090b] to-[#18181b] relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-12">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="w-20 h-20 rounded-xl bg-white/10 flex items-center justify-center mb-8 backdrop-blur-sm">
              <Logo className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">{appConfig.name}</h1>
            <p className="text-lg text-zinc-400 max-w-md leading-relaxed">
              {appConfig.login.tagline}
            </p>
            <div className="mt-12 space-y-4 text-sm text-zinc-400">
              {appConfig.login.features.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-zinc-500" /> {feature}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white">
        <motion.div
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center">
              <Logo className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-zinc-800">{appConfig.name}</span>
          </div>

          <h2 className="text-2xl font-bold text-zinc-800 mb-2">{appConfig.login.heading}</h2>
          <p className="text-zinc-500 mb-8 text-[13px]">Sign in to your account to continue</p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-zinc-700">Email</label>
              <input
                type="email"
                {...register('email')}
                className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-400 transition-all"
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-zinc-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className="w-full px-4 py-3 pr-12 bg-white border border-zinc-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-400 transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <Button type="submit" fullWidth size="lg" loading={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Demo account */}
          <div className="mt-8 p-4 bg-zinc-50 rounded-lg border border-zinc-100">
            <p className="text-xs font-medium text-zinc-500 mb-3">Demo Account (click to fill)</p>
            <button
              type="button"
              onClick={() => fillDemo(appConfig.demo.email)}
              className="w-full flex items-center justify-between px-3 py-2 bg-white border border-zinc-200 rounded-md text-xs hover:border-zinc-400 transition-all"
            >
              <span className="text-zinc-600">{appConfig.demo.email}</span>
              <span className="text-zinc-400">Admin</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
