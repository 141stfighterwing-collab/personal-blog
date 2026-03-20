// Role-based permission system

export type Role = 'ADMIN' | 'REVIEWER' | 'USER'

export interface Permission {
  action: 'create' | 'read' | 'update' | 'delete' | 'manage_users' | 'access_admin'
  resource: 'blog' | 'news' | 'links' | 'users' | 'admin'
}

// Permission matrix by role
const rolePermissions: Record<Role, Permission[]> = {
  ADMIN: [
    // Full access to everything
    { action: 'create', resource: 'blog' },
    { action: 'read', resource: 'blog' },
    { action: 'update', resource: 'blog' },
    { action: 'delete', resource: 'blog' },
    { action: 'create', resource: 'news' },
    { action: 'read', resource: 'news' },
    { action: 'update', resource: 'news' },
    { action: 'delete', resource: 'news' },
    { action: 'create', resource: 'links' },
    { action: 'read', resource: 'links' },
    { action: 'update', resource: 'links' },
    { action: 'delete', resource: 'links' },
    { action: 'manage_users', resource: 'users' },
    { action: 'access_admin', resource: 'admin' },
  ],
  REVIEWER: [
    // Can create/read/update but not delete
    { action: 'create', resource: 'blog' },
    { action: 'read', resource: 'blog' },
    { action: 'update', resource: 'blog' },
    { action: 'create', resource: 'news' },
    { action: 'read', resource: 'news' },
    { action: 'update', resource: 'news' },
    { action: 'create', resource: 'links' },
    { action: 'read', resource: 'links' },
    { action: 'update', resource: 'links' },
  ],
  USER: [
    // Read-only access
    { action: 'read', resource: 'blog' },
    { action: 'read', resource: 'news' },
    { action: 'read', resource: 'links' },
  ],
}

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: Role, action: Permission['action'], resource: Permission['resource']): boolean {
  const permissions = rolePermissions[role] || []
  return permissions.some(p => p.action === action && p.resource === resource)
}

/**
 * Check if a role can create content
 */
export function canCreate(role: Role, resource: 'blog' | 'news' | 'links'): boolean {
  return hasPermission(role, 'create', resource)
}

/**
 * Check if a role can update content
 */
export function canUpdate(role: Role, resource: 'blog' | 'news' | 'links'): boolean {
  return hasPermission(role, 'update', resource)
}

/**
 * Check if a role can delete content
 */
export function canDelete(role: Role, resource: 'blog' | 'news' | 'links'): boolean {
  return hasPermission(role, 'delete', resource)
}

/**
 * Check if a role can access admin panel
 */
export function canAccessAdmin(role: Role): boolean {
  return hasPermission(role, 'access_admin', 'admin')
}

/**
 * Check if a role can manage users
 */
export function canManageUsers(role: Role): boolean {
  return hasPermission(role, 'manage_users', 'users')
}

/**
 * Get all permissions for a role
 */
export function getPermissions(role: Role): Permission[] {
  return rolePermissions[role] || []
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role: Role): string {
  const names: Record<Role, string> = {
    ADMIN: 'Administrator',
    REVIEWER: 'Reviewer',
    USER: 'User',
  }
  return names[role] || role
}

/**
 * Get role badge color classes
 */
export function getRoleBadgeColor(role: Role): string {
  const colors: Record<Role, string> = {
    ADMIN: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-300',
    REVIEWER: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-300',
    USER: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-300',
  }
  return colors[role] || 'bg-gray-100 text-gray-700'
}
