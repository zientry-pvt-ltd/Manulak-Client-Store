"use client";

import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import { Home, Heart, ShoppingCart, Package } from "lucide-react";

export function MobileSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        {/* MAIN MENU */}
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Home */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/">
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Favorites */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/wishlist">
                    <Heart className="h-4 w-4" />
                    <span>Favorites</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Cart */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/cart">
                    <ShoppingCart className="h-4 w-4" />
                    <span>My Cart</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Order Status */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/order-status">
                    <Package className="h-4 w-4" />
                    <span>Order Status</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
