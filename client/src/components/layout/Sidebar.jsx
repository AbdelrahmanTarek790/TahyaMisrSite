import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { 
  Users, 
  Newspaper, 
  Calendar, 
  Image, 
  Settings, 
  Bell,
  LogOut,
  Home,
  UserCircle,
  ChevronRight
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, roles: ['student', 'volunteer', 'admin'] },
    { name: 'News', href: '/news', icon: Newspaper, roles: ['student', 'volunteer', 'admin'] },
    { name: 'Events', href: '/events', icon: Calendar, roles: ['student', 'volunteer', 'admin'] },
    { name: 'Media', href: '/media', icon: Image, roles: ['student', 'volunteer', 'admin'] },
  ];

  const adminNavigation = [
    { name: 'Manage News', href: '/admin/news', icon: Newspaper, roles: ['admin'] },
    { name: 'Manage Events', href: '/admin/events', icon: Calendar, roles: ['admin'] },
    { name: 'Users', href: '/admin/users', icon: Users, roles: ['admin'] },
    { name: 'Positions', href: '/admin/positions', icon: Settings, roles: ['admin'] },
    { name: 'Notifications', href: '/admin/notifications', icon: Bell, roles: ['admin'] },
  ];

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(user?.role)
  );

  const filteredAdminNavigation = adminNavigation.filter(item => 
    item.roles.includes(user?.role)
  );

  const isActive = (href) => location.pathname === href;

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card">
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-6 border-b">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">TM</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Tahya Misr</h1>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4">
        <div className="flex items-center space-x-3 rounded-lg border p-3 bg-background">
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
            <UserCircle className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-auto px-4 pb-4">
        <nav className="space-y-1">
          {/* Main Navigation */}
          <div className="space-y-1">
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                  {active && <ChevronRight className="ml-auto h-4 w-4" />}
                </Link>
              );
            })}
          </div>

          {/* Admin Section */}
          {filteredAdminNavigation.length > 0 && (
            <>
              <Separator className="my-4" />
              <div className="space-y-1">
                <div className="px-3 py-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Administration
                  </p>
                </div>
                {filteredAdminNavigation.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                      {active && <ChevronRight className="ml-auto h-4 w-4" />}
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </nav>
      </div>

      {/* Logout Button */}
      <div className="p-4 mt-auto border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-4 w-4" />
          Sign out
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;