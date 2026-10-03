'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { FormInput } from '@/components/form/form-input'
import { RBAC } from '@/config/rbac'
import { ROUTES } from '@/config/routes'
import { parseApiError } from '@/lib/api/error'
import { useLogin } from '../hooks/use-login'
import { loginSchema, type LoginFormValues } from '../schemas/auth.schema'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const login = useLogin()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '', rememberMe: false },
  })

  const onSubmit = handleSubmit((values) => {
    login.mutate(
      { username: values.username, password: values.password },
      {
        onSuccess: (user) => {
          const returnUrl = searchParams.get('returnUrl')
          const isSalesRole = user.role === RBAC.SALES || String(user.role).toLowerCase() === 'sales'
          if (isSalesRole) {
            router.replace('/dashboard-sales')
            return
          }
          router.replace(returnUrl && returnUrl.startsWith('/') ? returnUrl : ROUTES.dashboard)
        },
      },
    )
  })

  const apiError = login.isError ? parseApiError(login.error) : null

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      {apiError && (
        <div
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {apiError.message}
        </div>
      )}

      <FormInput
        label="Username or Email"
        type="text"
        autoComplete="username"
        placeholder="admin"
        required
        error={errors.username?.message}
        {...register('username')}
      />

      <FormInput
        label="Password"
        type={showPassword ? 'text' : 'password'}
        autoComplete="current-password"
        placeholder="••••••••"
        required
        error={errors.password?.message}
        endAdornment={
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="rounded p-1 text-muted-foreground hover:text-foreground"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        }
        {...register('password')}
      />

      <div className="flex items-center justify-between text-sm">
        <label className="flex cursor-pointer items-center gap-2 text-muted-foreground">
          <input type="checkbox" className="h-4 w-4 rounded border-input" {...register('rememberMe')} />
          Remember me
        </label>
      </div>

      <Button type="submit" size="lg" isLoading={isSubmitting || login.isPending} className="w-full">
        Sign in
      </Button>
    </form>
  )
}
