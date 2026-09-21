import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Package, Truck, ArrowLeftRight, LayoutDashboard, LogOut, User, Menu, X } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/button';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeToggle } from '@/components/ThemeToggle';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/suppliers', icon: Truck, label: 'Proveedores' },
  { path: '/products', icon: Package, label: 'Productos' },
  { path: '/movements', icon: ArrowLeftRight, label: 'Movimientos' },
];

export default function Layout() {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navContent = (
    <>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <img
            src="/LogoFlowStock.webp"
            alt="Flow Stock Logo"
            className="h-9 w-auto"
          />
          <h1 className="text-xl font-bold text-foreground">Flow Stock</h1>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-muted-foreground hover:bg-sidebar-accent'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-primary" />
                )}
                <Icon className={`h-4 w-4 ${isActive ? 'text-primary' : ''}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="mt-auto border-t border-sidebar-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <User className="h-5 w-5 text-muted-foreground" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
          <ThemeToggle />
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => logout()}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Cerrar Sesión
        </Button>
      </div>
    </>
  );

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-background">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border flex flex-col transform transition-transform duration-200 md:hidden ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button
          className="absolute top-4 right-4 p-1 rounded-md hover:bg-sidebar-accent"
          onClick={() => setMobileOpen(false)}
        >
          <X className="h-5 w-5" />
        </button>
        {navContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 bg-sidebar border-r border-sidebar-border flex-col">
        {navContent}
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile topbar */}
        <header className="md:hidden flex items-center gap-3 px-4 py-3 bg-card border-b border-border">
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-bold text-foreground">Flow Stock</h1>
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
    </TooltipProvider>
  );
}
