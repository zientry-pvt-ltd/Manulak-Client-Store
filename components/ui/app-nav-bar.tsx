"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Search, Package, X } from "lucide-react";
import Image from "next/image";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setSearchQuery } from "@/lib/store/slices/app-slice";
import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export const AppNavBar = () => {
  const dispatch = useAppDispatch();
  const route = useRouter();
  const searchParams = useAppSelector((state) => state.app.searchQuery);
  const [searchQuery, setSearchQueryLocal] = useState(searchParams || null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSearch = () => {
    dispatch(setSearchQuery(searchQuery));
    route.push("/products");
  };

  const handleClearSearch = () => {
    dispatch(setSearchQuery(null));
    setSearchQueryLocal(null);
  };

  const handleMobileSearch = () => {
    dispatch(setSearchQuery(searchQuery));
    setIsDialogOpen(false);
    route.push("/products");
  };

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
      <div className="hidden md:flex items-center w-md">
        <div className="flex justify-center w-full border rounded-l-md overflow-hidden">
          <Input
            type="text"
            placeholder="Search products..."
            className="border-0 shadow-none md:ring-0 md:focus:ring-0 md:focus:border-0"
            onChange={(e) => setSearchQueryLocal(e.target.value)}
            value={searchQuery || ""}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          {searchQuery && (
            <button className="rounded-full px-3" onClick={handleClearSearch}>
              <X className="w-3.5 h-3.5 rounded-full hover:bg-secondary" />
            </button>
          )}
        </div>
        <Button className="rounded-l-none px-4" onClick={handleSearch}>
          <Search className="h-5 w-5" />
        </Button>
      </div>

      {/* RIGHT — ICONS & ORDER STATUS */}
      <div className="flex items-center gap-2">
        {/* Mobile Search Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild onClick={() => setIsDialogOpen(true)}>
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "md:hidden",
                searchParams && "bg-primary text-white"
              )}
            >
              <Search className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Search Products</DialogTitle>
            </DialogHeader>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery || ""}
                onChange={(e) => setSearchQueryLocal(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleMobileSearch()}
                autoFocus
              />
            </div>
            <div className="flex gap-2 justify-end">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  disabled={!searchQuery}
                  onClick={handleClearSearch}
                >
                  Clear
                </Button>
              </DialogClose>
              <Button onClick={handleMobileSearch}>Search</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Favorite */}
        <Link href="/wishlist">
          <Button variant="outline" size="icon">
            <Heart className="h-5 w-5" />
          </Button>
        </Link>

        {/* Cart */}
        <Link href="/cart">
          <Button variant="outline" size="icon">
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </Link>

        {/* Order Status */}
        <Link href="/order-status">
          <Button variant={"outline"} size={"sm"}>
            <Package className="h-4 w-4" />
            Order Status
          </Button>
        </Link>
      </div>
    </nav>
  );
};
