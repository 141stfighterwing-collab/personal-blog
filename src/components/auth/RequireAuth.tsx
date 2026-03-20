'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Role } from '@/lib/permissions'
import { Card, CardContent } from '@/components/ui/card'
import { Lock } from 'lucide-react'

interface RequireAuthProps {
  children: React.ReactNode
  roles?: Role[]
  fallback?: React.ReactNode
}

/**
 * Component that requires authentication to view children
 * Optionally restricts to specific roles
 */
export function RequireAuth({ children, roles, fallback }: RequireAuthProps) {
  const { isAuthenticated, isLoading, hasAnyRole } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return fallback || (
      <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20">
        <CardContent className="flex items-center gap-3 p-6">
          <Lock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          <div>
            <p className="font-medium text-yellow-800 dark:text-yellow-200">
              Authentication Required
            </p>
            <p className="text-sm text-yellow-600 dark:text-yellow-400">
              Please sign in to access this content.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (roles && !hasAnyRole(roles)) {
    return fallback || (
      <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
        <CardContent className="flex items-center gap-3 p-6">
          <Lock className="w-6 h-6 text-red-600 dark:text-red-400" />
          <div>
            <p className="font-medium text-red-800 dark:text-red-200">
              Access Denied
            </p>
            <p className="text-sm text-red-600 dark:text-red-400">
              You don&apos;t have permission to access this content.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return <>{children}</>
}
