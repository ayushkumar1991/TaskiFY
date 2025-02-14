import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import UserMenu from "./user-menu";
import { PenBox } from "lucide-react";
import Image from "next/image";
import { checkUser } from "@/lib/checkUser";
import UserLoading from "./user-loading";

async function Header() {
  await checkUser();

  return (
    <header className="container mx-auto">
  <nav className="py-6 px-4 flex justify-between items-center">
    <Link href="/">
      <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text drop-shadow-lg">
        TaskiFY
      </h1>
    </Link>
        <div className="flex items-center gap-4">
          <Link href="/project/create">
            <Button variant="destructive" className="flex items-center gap-2">
              <PenBox size={18} />
              <span className="hidden md:inline">Create Project</span>
            </Button>
          </Link>
          <SignedOut>
            <SignInButton forceRedirectUrl="/onboarding">
              <Button variant="outline">Login</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserMenu />
          </SignedIn>
        </div>
      </nav>

      <UserLoading />
    </header>
  );
}

export default Header;
