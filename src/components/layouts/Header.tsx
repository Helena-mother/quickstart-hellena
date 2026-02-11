import { motion } from "framer-motion";
import { Search, Bell, ShoppingCart, User, Menu, ChevronDown } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { useRouter } from "next/navigation";
import { useCart } from "@/src/hooks/useCart";
import Link from "next/link";

const Header = () => {
  const router = useRouter();
  const { count } = useCart();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-card border-b border-border"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left - Menu */}
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>

          {/* Logo */}
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={() => router.push("/")}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-1 cursor-pointer"
          >
            <span className="text-2xl font-bold tracking-tight">H</span>
            <span className="text-2xl font-bold tracking-tight">e</span>
            <span className="text-2xl font-bold tracking-tight">l</span>
            <span className="text-2xl font-bold tracking-tight">l</span>
            <span className="text-2xl font-bold tracking-tight">e</span>
            <span className="text-2xl font-bold tracking-tight">n</span>
            <span className="text-2xl font-bold tracking-tight">a</span>
          </motion.div>

          {/* Right - Icons */}
          <div className="flex items-center gap-2">
            <span className="hidden md:inline text-sm text-muted-foreground mr-4">Blogs</span>
            <span className="hidden md:inline text-sm text-muted-foreground mr-4">FAQs</span>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Link href={"/checkout"}>
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {count > 0 &&
                  <span>{count}</span>
                }
              </Button>
            </Link>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Secondary Nav */}
        <div className="flex items-center gap-4 py-3 border-t border-border overflow-x-auto">
          <div className="flex items-center gap-2 text-sm">
            <span>Clothing</span>
            <ChevronDown className="h-4 w-4" />
          </div>
          <span className="text-sm">New Arrivals</span>
          <span className="text-sm">Sale</span>

          <div className="flex-1 max-w-sm ml-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-9 bg-muted/50 border-0 h-9"
              />
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 ml-auto">
            <span className="text-sm">Men</span>
            <span className="text-sm">Women</span>
            <span className="text-sm">Children</span>
            <span className="text-sm">Brand</span>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
