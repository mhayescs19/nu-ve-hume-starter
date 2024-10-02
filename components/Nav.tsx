"use client";

import { useLayoutEffect, useState } from "react";
import HumeLogo from "./logos/Hume";
import { Button } from "./ui/button";
import { Menu, Moon, Sun } from "lucide-react";
import Github from "./logos/GitHub";
import pkg from '@/package.json';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  SignOutButton,
  UserButton,
  UserProfile
} from '@clerk/nextjs'

export const Nav = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useLayoutEffect(() => {
    const el = document.documentElement;

    if (el.classList.contains("dark")) {
      setIsDarkMode(true);
    } else {
      setIsDarkMode(false);
    }
  }, []);

  const toggleDark = () => {
    const el = document.documentElement;
    el.classList.toggle("dark");
    setIsDarkMode((prev) => !prev);
  };

  return (
      <div
      className={
        "px-4 py-2 flex items-center h-14 z-50 bg-card border-b border-border"
      }
      >
      <DropdownMenu>
        <DropdownMenuTrigger><Menu /></DropdownMenuTrigger>
        <DropdownMenuContent>
          {/*<DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">user name</p>
              <p className="text-xs leading-none text-muted-foreground">
                me@nu-ve.com
              </p>
            </div>
          </DropdownMenuLabel>*/}
          <DropdownMenuItem>
              <SignedOut>
                <SignInButton />
              </SignedOut>
              <SignedIn>
                <div className="pr-2">
                  <UserButton />
                </div>
                <span>
                  Profile
                </span>
              </SignedIn>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuItem onClick={toggleDark}>
              <span className="pr-2">{isDarkMode ? "Light" : "Dark"} Mode</span>
              <span>
                {isDarkMode ? (
                  <Sun className={"size-4"} />
                ) : (
                  <Moon className={"size-4"} />
                )}
              </span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <SignOutButton />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <div>
        <HumeLogo className={"pl-3 h-5 w-auto"} />
      </div>
    </div> 
  );
};
