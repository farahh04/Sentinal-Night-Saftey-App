"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Navigation, Users, Settings, Building2, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Shield, label: "Home", href: "/" },
  { icon: Navigation, label: "Route", href: "/routes" },
  { icon: Building2, label: "Agency", href: "/police-dashboard" },
  { icon: Users, label: "Trust", href: "/contacts" },
  { icon: User, label: "Profile", href: "/profile" },
];

export function AppNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] px-4 pb-6 pt-2 pointer-events-none max-w-md mx-auto">
      <div className="pointer-events-auto">
        <div className="glass-elevated flex items-center justify-around py-2 px-1 rounded-[32px] border border-white/10 shadow-2xl">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-300 relative group",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-primary/70"
                )}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-md" />
                )}
                <Icon className={cn(
                  "w-5 h-5 transition-all duration-300 relative z-10", 
                  isActive ? "scale-110 drop-shadow-[0_0_8px_rgba(0,168,107,0.4)]" : "group-hover:scale-110"
                )} />
                <span className={cn(
                  "text-[7px] mt-1 font-bold uppercase tracking-widest relative z-10 transition-all duration-300",
                  isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1 group-hover:opacity-50"
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}