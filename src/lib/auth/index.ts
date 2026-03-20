import { Role } from './permissions'

// Hardcoded users for development/demo purposes
// In production, these should be in a database with hashed passwords
export const HARDCODED_USERS = [
  {
    id: 'admin-001',
    username: 'admin',
    password: 'admin123', // In production, use bcrypt hashes
    email: 'admin@example.com',
    name: 'Administrator',
    role: 'ADMIN' as Role,
    isActive: true,
  },
  {
    id: 'reviewer-001',
    username: 'reviewer',
    password: 'review123',
    email: 'reviewer@example.com',
    name: 'Content Reviewer',
    role: 'REVIEWER' as Role,
    isActive: true,
  },
  {
    id: 'user-001',
    username: 'user',
    password: 'user123',
    email: 'user@example.com',
    name: 'Regular User',
    role: 'USER' as Role,
    isActive: true,
  },
]

export interface AuthUser {
  id: string
  username: string
  email: string | null
  name: string | null
  role: Role
}

/**
 * Verify user credentials against hardcoded users
 */
export function verifyCredentials(username: string, password: string): AuthUser | null {
  const user = HARDCODED_USERS.find(
    u => u.username === username && u.password === password && u.isActive
  )
  
  if (!user) return null
  
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    name: user.name,
    role: user.role,
  }
}

/**
 * Get user by ID
 */
export function getUserById(id: string): AuthUser | null {
  const user = HARDCODED_USERS.find(u => u.id === id && u.isActive)
  
  if (!user) return null
  
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    name: user.name,
    role: user.role,
  }
}

/**
 * Simple session token generation (not cryptographically secure - use JWT in production)
 */
export function generateSessionToken(): string {
  return Buffer.from(
    Math.random().toString(36).substring(2) + 
    Date.now().toString(36)
  ).toString('base64')
}
