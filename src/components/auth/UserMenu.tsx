'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { User, LogOut, Settings, LogIn, Shield, Eye, UserCircle } from 'lucide-react'
import { getRoleDisplayName, getRoleBadgeColor } from '@/lib/permissions'

export function UserMenu() {
  const { user, isAuthenticated, logout, hasAnyRole } = useAuth()

  if (!isAuthenticated) {
    return (
      <Link href="/login">
        <Button variant="outline" className="gap-2">
          <LogIn className="w-4 h-4" />
          Sign In
        </Button>
      </Link>
    )
  }

  const roleIcon = user?.role === 'ADMIN' 
    ? <Shield className="w-3 h-3" />
    : user?.role === 'REVIEWER' 
    ? <Eye className="w-3 h-3" />
    : <UserCircle className="w-3 h-3" />

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <User className="w-4 h-4" />
          <span className="hidden sm:inline">{user?.name || user?.username}</span>
          <Badge className={`ml-1 ${getRoleBadgeColor(user?.role as any)} border`}>
            {roleIcon}
            <span className="ml-1 hidden md:inline">{getRoleDisplayName(user?.role as any)}</span>
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user?.name || user?.username}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
            <Badge className={`${getRoleBadgeColor(user?.role as any)} border w-fit mt-1`}>
              {roleIcon}
              <span className="ml-1">{getRoleDisplayName(user?.role as any)}</span>
            </Badge>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {hasAnyRole(['ADMIN']) && (
          <>
            <DropdownMenuItem asChild>
              <Link href="/admin" className="cursor-pointer">
                <Settings className="w-4 h-4 mr-2" />
                Admin Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        
        <DropdownMenuItem asChild>
          <Link href="/" className="cursor-pointer">
            <User className="w-4 h-4 mr-2" />
            View Site
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={logout}
          className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
