'use client'

import * as React from 'react';
import Link from 'next/link';
import {
  User,
  LogOut,
  Settings,
  Package,
  Heart,
  Moon,
  Sun,
  ChevronDown,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface UserNavProps {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
    companyName?: string | null;
  } | null;
}

function getUserInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function UserNav({ user }: UserNavProps) {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = React.useCallback(async () => {
    try {
      if (user?.id) {
        const { logout } = await import('@/app/actions/auth');
        await logout();
      } else {
        await signOut({ callbackUrl: '/auth/login', redirect: true });
      }
    } catch (error) {
      const isRedirectError =
        error instanceof Error &&
        'digest' in error &&
        typeof error.digest === 'string' &&
        error.digest.includes('NEXT_REDIRECT');

      if (isRedirectError) {
        return;
      }
      toast.error('Sign out failed');
    }
  }, [user?.id]);

  if (!user) {
    return (
      <Button variant="default" size="sm" className="gap-2" asChild>
        <Link href="/auth/login">
          <User className="w-4 h-4" />
          Login
        </Link>
      </Button>
    );
  }

  const userInitials = user.name ? getUserInitials(user.name) : 'U';

  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-muted animate-pulse" />
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 gap-2 px-2">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={user.image || undefined} alt={user.name || 'User'} />
            <AvatarFallback className="rounded-lg">{userInitials}</AvatarFallback>
          </Avatar>
          <div className="hidden lg:flex flex-col items-start text-left">
            <span className="text-sm font-medium">{user.name}</span>
            {user.companyName && (
              <span className="text-xs text-muted-foreground">{user.companyName}</span>
            )}
          </div>
          <ChevronDown className="h-4 w-4 opacity-50 hidden lg:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={user.image || undefined} alt={user.name || 'User'} />
              <AvatarFallback className="rounded-lg">{userInitials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            </div>
          </div>
          {user.companyName && (
            <p className="text-xs leading-none text-muted-foreground mt-2">
              {user.companyName}
            </p>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/profile">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/orders">
              <Package className="mr-2 h-4 w-4" />
              <span>Orders</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/wishlist">
              <Heart className="mr-2 h-4 w-4" />
              <span>Wishlist</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs text-muted-foreground">Theme</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setTheme('light')}>
            <Sun className="mr-2 h-4 w-4" />
            <span>Light</span>
            {theme === 'light' && <span className="ml-auto">✓</span>}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme('dark')}>
            <Moon className="mr-2 h-4 w-4" />
            <span>Dark</span>
            {theme === 'dark' && <span className="ml-auto">✓</span>}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme('system')}>
            <Settings className="mr-2 h-4 w-4" />
            <span>System</span>
            {theme === 'system' && <span className="ml-auto">✓</span>}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
