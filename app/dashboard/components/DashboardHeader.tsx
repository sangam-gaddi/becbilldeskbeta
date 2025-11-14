"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, Bell, User } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { getInitials } from "@/lib/utils";

interface DashboardHeaderProps {
  studentName: string;
  usn: string;
}

export function DashboardHeader({ studentName, usn }: DashboardHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="border-b bg-card/50 backdrop-blur-sm"
    >
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left - Logo & User Info */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
              {getInitials(studentName)}
            </div>
            <div>
              <h2 className="text-sm font-semibold leading-none">{studentName}</h2>
              <p className="text-xs text-muted-foreground mt-1">{usn}</p>
            </div>
          </div>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              3
            </Badge>
          </Button>
          <ThemeToggle />
          <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
