"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Search, Package } from "lucide-react";
import Image from "next/image";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";

export const AppNavBar = () => {
  return (
    <nav className="w-full h-16 px-4 md:px-8 lg:px-36 flex items-center justify-between bg-white border-b">
      {/* LEFT — MOBILE TRIGGER + LOGO */}
      <div className="flex items-center gap-3">
        {/* Mobile Sidebar Trigger */}
        <SidebarTrigger className="md:hidden" />

        {/* LOGO */}
        <Link href="/" className="flex items-center">
          <Image
            alt="Manulak logo"
            src={"/assets/logo.png"}
            width={100}
            height={100}
            className="w-auto h-10 object-contain"
            loading="eager"
          />
        </Link>
      </div>

      {/* CENTER — SEARCH BAR */}
      <div className="hidden md:flex items-center w-md max-w-lg mx-6">
        <Input
          type="text"
          placeholder="Search products..."
          className="rounded-r-none md:ring-0 md:focus:ring-0"
        />
        <Button className="rounded-l-none px-4">
          <Search className="h-5 w-5" />
        </Button>
      </div>

      {/* RIGHT — ICONS & ORDER STATUS */}
      <div className="flex items-center gap-3">
        {/* Favorite */}
        <Button variant="outline" size="icon">
          <Heart className="h-5 w-5" />
        </Button>

        {/* Cart */}
        <Button variant="outline" size="icon">
          <ShoppingCart className="h-5 w-5" />
        </Button>

        {/* Order Status */}
        <Link href="/wishlist">
          <Button
            className="hidden md:inline-flex text-xs gap-1"
            variant={"outline"}
            size={"sm"}
          >
            <Package className="h-4 w-4" />
            Order Status
          </Button>
        </Link>
      </div>
    </nav>
  );
};
