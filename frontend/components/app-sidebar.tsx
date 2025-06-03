'use client';

import {
  LayoutDashboard,
  Megaphone,
  ListTree,
  LogOut,
  User,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useRouter } from 'next/navigation';

const sidebarItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Campaigns', url: '/dashboard/campaigns', icon: Megaphone },
  { title: 'Segments', url: '/dashboard/segments', icon: ListTree },
  { title: 'Customers', url: '/dashboard/customers', icon: User },
  { title: 'Logout', url: '/logout', icon: LogOut },
];

export function AppSidebar() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/logout`, {
        method: 'GET',
        credentials: 'include', // Important for sending cookies
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        // Clear client-side storage if needed
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
        
        // Force a full page reload to clear any state
        window.location.href = '/';
      } else {
        throw new Error(data.message || 'Logout failed');
      }
    } catch (err) {
      console.error('Logout failed:', err);
      alert('❌ Logout failed. Please try again.');
    }
  };

  return (
    <Sidebar className="h-screen w-64 border-r bg-[#171821] shadow-sm">
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-semibold text-[#A9DFD8] text-xl mb-3">
            Xeno
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-">
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    {item.title === 'Logout' ? (
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#6cf8e6] transition-colors text-sm font-medium text-white w-full text-left"
                      >
                        <item.icon className="w-5 h-5 text-white" />
                        <span>{item.title}</span>
                      </button>
                    ) : (
                      <a
                        href={item.url}
                        className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#6cf8e6] transition-colors text-sm font-medium text-white"
                      >
                        <item.icon className="w-5 h-5 text-white" />
                        <span>{item.title}</span>
                      </a>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}