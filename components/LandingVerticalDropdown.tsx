"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SignInButton, SignedIn, SignedOut, SignOutButton, UserButton, UserProfile } from '@clerk/nextjs';
import { Menu, Moon, Sun } from "lucide-react";
import { useUser } from "@clerk/nextjs";

const LandingVerticalDropdown: React.FC<{ isDarkMode: boolean; toggleDark: () => void }> = ({ isDarkMode, toggleDark }) => {
    const { user } = useUser();
    
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Menu />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <div>
              <UserButton showName>
              </UserButton>
            </div>
          </SignedIn>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
            <pre>{JSON.stringify(user?.publicMetadata, null, 2)}</pre>
        </DropdownMenuItem>
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
  );
};

export default LandingVerticalDropdown;