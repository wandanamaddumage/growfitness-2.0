export function getDefaultRouteForRole(role: string): string {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'coach':
      return '/coach/dashboard';
    case 'user':
      return '/dashboard';
    default:
      return '/dashboard';
  }
}
