'use client';

import { use, useEffect, useState, useRef } from "react";
import { Button } from "./ui/button";
import { Search, ShoppingCart, User, X } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "../app/store/useCartStore";
import { useUserStore } from "../app/store/userStore";
import { Input } from "./ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "../app/types/solidus";

import Image from "next/image";

export default function Header() {
  const cart = useCartStore((state) => state.cart);
  const itemCount = cart?.item_count || 0;
  const { isAuthenticated, user } = useUserStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);

  const debounceTimeout  = useRef<NodeJS.Timeout | null>(null)

  console.log(searchResults);

  useEffect(() => {    // Close search when navigating
    const fetchElasticSearchResults = async (query: string) => {   
      const params = new URLSearchParams();
      
      if (searchQuery.trim() !== "") {
        params.set("query", searchQuery.trim());
      } else {
        return;
      }

      const response = await fetch(`/api/search/elasticsearch?${params.toString()}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          credentials: "include",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.products || []);
      }
    }
    
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      fetchElasticSearchResults(searchQuery);
    }, 700); // Debounce time of 300ms

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [searchQuery]);

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <span className="text-xl font-semibold text-gray-900">Store</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link href="/shop" className="text-gray-600 hover:text-blue-600 transition-colors">
              Shop
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">
              Contact
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-600 hover:text-blue-600"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </Button>
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="text-gray-600 hover:text-blue-600 relative">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>
            {isAuthenticated ? (
              <Link href="/profile">
                <Button variant="ghost" size="icon" className="text-gray-600 hover:text-blue-600">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <Link href="/auth">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
      
      {/* Search Bar Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute left-0 top-full w-full bg-white border-b border-gray-100 shadow-sm overflow-hidden"
          >
            <div className="p-4">
              <div className="container mx-auto max-w-2xl relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  className="w-full pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors" 
                  placeholder="Search products..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                
                {/* Search Results Dropdown */}
                {searchResults.length > 0 && (
                  <div className="mt-2 bg-white rounded-lg shadow-lg border border-gray-100 max-h-96 overflow-y-auto">
                    {searchResults.map((product) => (
                      <Link 
                        key={product.id} 
                        href={`/product/${product.slug}`}
                        className="flex items-center gap-4 p-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                        onClick={() => setIsSearchOpen(false)}
                      >
                        <div className="relative w-12 h-12 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                          {product.images?.[0]?.attachment_url ? (
                            <Image
                              src={product.images[0].attachment_url}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <Search className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {product.name}
                          </h4>
                          <p className="text-xs text-gray-500 truncate">
                            {product.description}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

