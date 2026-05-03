// Role-based permission system

export const ROLES = {
    ADMIN: "admin",
    PUBLISHER: "publisher",
    USER: "user",
}

export function hasPermission(userRole, allowedRoles) {
    return allowedRoles.includes(userRole)
}

export function isAdmin(userRole) {
    return userRole === ROLES.ADMIN
}

export function isPublisher(userRole) {
    return userRole === ROLES.PUBLISHER || userRole === ROLES.ADMIN
}

// Migrate additional permission logic from your existing codebase
