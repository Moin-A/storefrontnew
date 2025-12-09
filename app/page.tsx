'use client'
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Input } from "../components/ui/input"
import { Search, ShoppingCart, ArrowRight, Star, Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { SOLIDUS_ROUTES } from "../lib/routes"
import { useProductStore } from "./store/useProductStore"
import { cn } from "../lib/utils"
import { ImageCard } from "../components/ui/ImageCard"
import { useCartStore } from "./store/useCartStore"
import { Product } from "./types/solidus"
import TopRatedSection from "../components/ui/TopRatedSection"




export default function HomePage() {
  const [store, setStore] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [top_rated_products, setTopRatedProducts] = useState<Product[]>([])
  const setFeatureproducts = useProductStore(state => state.setProducts)
  const [loading, setLoading] = useState(true)
  const getFeatureproducts = useProductStore(state => state.products)
  const { fetchCart } = useCartStore()

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const res = await fetch("/api/stores/1", {
          headers: {
            Accept: "application/json",
          },
        })

        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`)
        }

        const data = await res.json()
        setStore(data)
      } catch (err: any) {
        console.error(err)
        setError(err.message)
      }
    }

    const fetchfeaturedproducts = async () => {
      try {
        const res = await fetch(SOLIDUS_ROUTES.api.products + `?taxon_id=${8}?page=2`, {
          headers: {
            Accept: "application/json",
          }
        })

        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`)
        }
        const data = await res.json()
        setFeatureproducts(data)
      } catch (err: any) {
        console.error(err)
        setError(err.message)
      }
    }
    const fetchTopRatedProducts = async () => {
      try {                
        const res = await fetch(SOLIDUS_ROUTES.api.top_rated_products('categories/electronics') + `&&limit=8`, {
          headers: {
            Accept: "application/json",
          }
        })        
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`)
        }
        const data = await res.json()
        setTopRatedProducts(data)
      } catch (err: any) {
        setError(err.message)
      }
    }

    fetchTopRatedProducts()
    fetchfeaturedproducts();
    fetchStore()
    fetchCart()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-light text-gray-900 mb-8">
                Discover
                <br />
                Premium
                <br />
                Collections
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto lg:mx-0">
                Elevate your lifestyle with our curated selection of premium products. Quality craftsmanship meets
                modern design.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                <Button
                  size="lg"
                  className="bg-black hover:bg-gray-800 text-white px-10 py-4 text-lg font-medium rounded-xl"
                >
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 px-10 py-4 text-lg font-medium rounded-xl bg-white"
                >
                  View Collections
                </Button>
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div className="relative">
              {store?.hero_image_url &&
                <Image
                  src={store?.hero_image_url || null}
                  alt="Premium product collection"
                  width={600}
                  height={500}
                  className="w-full h-auto object-contain rounded-2xl shadow-sm"
                  priority
                  unoptimized={store?.hero_image_url?.includes('cloudfront.net') || false}
                />
              }
            </div>
          </div>
        </div>
      </section>

      {/* Top Rated Products Section */}
              
      <TopRatedSection/>        
      {/* Featured Products Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-gray-50 to-slate-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">Featured Products</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our handpicked selection of premium products designed to enhance your everyday life
            </p>
          </div>

          {/* Product Grid */}
          <div className="flex overflow-x-auto gap-6 pb-6 scrollbar-hide justify-center">
            {getFeatureproducts?.products?.map(({ name, images, id, slug }) => (
              <Link key={id} href={`/product/${slug}`}>
                <div
                  key={id}
                  className={cn(
                    "cursor-pointer transition-all duration-300 border border-gray-100 shadow-sm hover:shadow-lg rounded-2xl overflow-hidden w-56 bg-white",
                  )}>
                  <div
                    key={id}
                    className={cn(
                      "cursor-pointer transition-all duration-300 border border-gray-100 shadow-sm hover:shadow-lg rounded-2xl overflow-hidden w-56 bg-white",
                    )}>
                    {/* Image with skeleton */}
                    <div className="relative w-full h-56 bg-gray-100">
                      {loading && (
                        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
                      )}
                      <ImageCard
                        images={(images || []) as any[]}
                        name={name || "Product image"}
                      />
                    </div>
                    {/* Content */}
                    <div className="p-4 flex flex-col gap-2 text-sm">
                      <h3 className="font-medium leading-tight text-gray-900 line-clamp-2 mt-2">
                        {name}
                      </h3>
                      <div className="flex flex-col">
                        <span className="text-lg font-semibold text-gray-900">{"price"}</span>
                        <span className="text-xs text-gray-500">
                          MRP: <span className="line-through">{"mrp"}</span> ({"discount"} off)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
             <Link href={'/products/categories/featured-products'}>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 px-8 py-4 text-base font-medium rounded-xl bg-transparent"
            >             
              View All Products
              <ArrowRight className="ml-2 h-5 w-5" />                        
            </Button>
             </Link>  
          </div>
        </div>
      </section>

      {/* Shop by Category Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">Shop by Category</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Browse our carefully curated categories to find exactly what you're looking for
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Electronics */}
            <Link href={'/products/categories/electronics'}>
            <div className="group cursor-pointer hover:shadow-lg transition-all duration-300 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-100 transition-colors">
                  <span className="text-3xl">📱</span>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">Electronics</h3>
                <p className="text-gray-600 mb-2">120+ items</p>
                <p className="text-sm text-gray-500">Latest tech gadgets</p>
              </div>
            </div>
            </Link>

            {/* Fashion */}
            <div className="group cursor-pointer hover:shadow-lg transition-all duration-300 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
               <Link href={'/products/categories/fashion'}>
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-pink-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-pink-100 transition-colors">
                  <span className="text-3xl">👗</span>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">Fashion</h3>
                <p className="text-gray-600 mb-2">250+ items</p>
                <p className="text-sm text-gray-500">Trendy clothing & accessories</p>
              </div>
              </Link>
            </div>

            {/* Home & Living */}
            <div className="group cursor-pointer hover:shadow-lg transition-all duration-300 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <Link href={'/products/categories/home-living'}>
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-green-100 transition-colors">
                  <span className="text-3xl">🏠</span>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">Home & Living</h3>
                <p className="text-gray-600 mb-2">180+ items</p>
                <p className="text-sm text-gray-500">Beautiful home essentials</p>
              </div>
              </Link>
            </div>

            {/* Sports & Fitness */}
            <div className="group cursor-pointer hover:shadow-lg transition-all duration-300 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <Link href={'/products/categories/sports-fitness'}>
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-100 transition-colors">
                  <span className="text-3xl">⚽</span>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">Sports & Fitness</h3>
                <p className="text-gray-600 mb-2">95+ items</p>
                <p className="text-sm text-gray-500">Gear for active lifestyle</p>
              </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">Stay in the Loop</h2>
            <p className="text-xl text-gray-600 mb-12">
              Subscribe to our newsletter and be the first to know about new arrivals, exclusive offers, and special
              events.
            </p>
            <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4 mb-6">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 border border-gray-200"
              />
              <Button className="bg-black text-white hover:bg-gray-800 px-8 py-4 rounded-xl font-medium">
                Subscribe
              </Button>
            </div>
            <p className="text-sm text-gray-500">We respect your privacy. Unsubscribe at any time.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-sm"></div>
                </div>
                <span className="text-xl font-semibold">Store</span>
              </div>
              <p className="text-gray-400 mb-4">
                Premium products for modern living. Quality, style, and innovation in every piece.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <Link href="#" className="block text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
                <Link href="#" className="block text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
                <Link href="#" className="block text-gray-400 hover:text-white transition-colors">
                  Blog
                </Link>
                <Link href="#" className="block text-gray-400 hover:text-white transition-colors">
                  Careers
                </Link>
              </div>
            </div>

            {/* Customer Service */}
            <div>
              <h4 className="font-semibold mb-4">Customer Service</h4>
              <div className="space-y-2">
                <Link href="#" className="block text-gray-400 hover:text-white transition-colors">
                  Help Center
                </Link>
                <Link href="#" className="block text-gray-400 hover:text-white transition-colors">
                  Shipping Info
                </Link>
                <Link href="#" className="block text-gray-400 hover:text-white transition-colors">
                  Returns
                </Link>
                <Link href="#" className="block text-gray-400 hover:text-white transition-colors">
                  Size Guide
                </Link>
              </div>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <div className="space-y-2">
                <Link href="#" className="block text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
                <Link href="#" className="block text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
                <Link href="#" className="block text-gray-400 hover:text-white transition-colors">
                  Cookie Policy
                </Link>
                <Link href="#" className="block text-gray-400 hover:text-white transition-colors">
                  Accessibility
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Store. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
