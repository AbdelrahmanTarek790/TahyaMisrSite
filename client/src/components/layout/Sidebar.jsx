import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { 
  Users, 
  Newspaper, 
  Calendar, 
  Image, 
  Settings, 
  Bell,
  LogOut,
  Home,
  UserCircle
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, roles: ['student', 'volunteer', 'admin'] },
    { name: 'News', href: '/news', icon: Newspaper, roles: ['student', 'volunteer', 'admin'] },
    { name: 'Events', href: '/events', icon: Calendar, roles: ['student', 'volunteer', 'admin'] },
    { name: 'Media', href: '/media', icon: Image, roles: ['student', 'volunteer', 'admin'] },
    { name: 'Users', href: '/admin/users', icon: Users, roles: ['admin'] },
    { name: 'Positions', href: '/admin/positions', icon: Settings, roles: ['admin'] },
    { name: 'Notifications', href: '/admin/notifications', icon: Bell, roles: ['admin'] },
  ];

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(user?.role)
  );

  const isActive = (href) => location.pathname === href;

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex h-full w-64 flex-col bg-white shadow-lg">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b">
        <h1 className="text-xl font-bold text-gray-900">Tahya Misr</h1>
      </div>

      {/* User Info */}
      <div className="px-6 py-4 border-b">
        <div className="flex items-center">
          <UserCircle className="h-8 w-8 text-gray-400" />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {filteredNavigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`
                flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                ${isActive(item.href)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }
              `}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="px-4 py-4 border-t">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;