"use client";

import React, { PropsWithChildren } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import Link from "next/link";

const Navbar = ({ children }: PropsWithChildren) => {
  return (
    <div className="relative">
      <div className="fixed w-full backdrop-blur-lg">
        <div className="h-[80px] flex flex-col justify-center max-w-7xl mx-auto p-4">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/users" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Users
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
      <div className="max-w-7xl mx-auto pt-[96px] px-4 pb-24">{children}</div>
    </div>
  );
};

export default Navbar;
