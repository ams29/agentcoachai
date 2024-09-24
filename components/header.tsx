"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  Settings,
  Menu,
} from "lucide-react";
import Link from "next/link";

export default function headerBar({isSidebarOpen, setIsSidebarOpen, signOut}:any) {
    return (
        <header className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-2 bg-[rgb(17,30,62)] text-white">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-300 hover:text-white hover:bg-gray-900 md:hidden mr-2"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
          <Link href="/"> 
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2-LNqJvtMncHrGgssgeeVhV3hMJV8k6Z.png"
            alt="AgentCoach.ai Logo"
            className="h-8 md:h-12"
          />
          </Link>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-300 hover:text-white hover:bg-gray-700 md:hidden">
            <Settings className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-300 hover:text-white hover:bg-gray-700 md:hidden">
            <LogOut className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-300 hover:text-white hover:bg-gray-700 hidden md:flex">
            <Settings className="h-5 w-5 mr-2" />
            Settings
          </Button>
          <Button
            onClick={() => signOut({ redirectUrl: "/" })}
            variant="ghost"
            size="sm"
            className="text-gray-300 hover:text-white hover:bg-gray-700 hidden md:flex">
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </Button>
        </div>
      </header>
    );
}

