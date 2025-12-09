"use client"

import type React from "react"
import { useRouter } from 'next/navigation';
import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Separator } from "../../components/ui/separator"
import { Checkbox } from "../../components/ui/checkbox"
import { Eye, EyeOff, ArrowLeft, Mail, Lock, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import {SOLIDUS_ROUTES} from "../../lib/routes"
import { useUserStore } from "../store/userStore";
import { useUIStore } from "../store/useUIStore";


export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [email, setEmail] = useState('')
  const [error, setError] = useState('');
  const setUser = useUserStore((state)=> state.setUser)
  const addNotification = useUIStore((state) => state.addNotification)
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form)

    try {
      const response = await fetch(isLogin?SOLIDUS_ROUTES.api.login:SOLIDUS_ROUTES.api.register, {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(formData)),
      });

      const data: { user: Record<string,string>; error?: string } = await response.json();
      setIsLoading(false);
      if (!response.ok) {
        setError(data.error || 'Login failed');
        addNotification('error', data.error || 'Login failed', true);
        return;
      }
   
      setUser(data.user)
      addNotification('success', isLogin ? 'Login successful!' : 'Registration successful!', true);
      router.push('/')
    } catch (err) {
      console.error('Error during authentication:', err);
      setIsLoading(false);
      addNotification('error', 'Something went wrong. Please try again.', true);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin)
    setShowPassword(false)
    setShowConfirmPassword(false)
  }

  const handlePasswordReset = async () => {
    if (!email) {
      addNotification('error', 'Please enter your email first.', true)
      return
    }
    try {
      setIsResetting(true)
      const res = await fetch(`${SOLIDUS_ROUTES.api.password_recover}?email=${encodeURIComponent(email)}`, {
        method: 'POST',
      })
      let data: any = null
      try { data = await res.json() } catch {}
      setIsResetting(false)
      if (!res.ok) {
        addNotification('error', (data && (data.error || data.message)) || 'Failed to send reset email.', true)
        return
      }
      addNotification('success', data.message, true)
    } catch (e) {
      setIsResetting(false)
      addNotification('error', 'Network error. Please try again.', true)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-xl md:text-2xl font-bold">ShopHub</span>
            </Link>
            <div className="text-sm text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <Button variant="link" className="p-0 ml-1 h-auto font-semibold text-primary" onClick={toggleAuthMode}>
                {isLogin ? "Sign up" : "Sign in"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center max-w-6xl mx-auto">
          {/* Left side - Branding */}
          <div className="hidden lg:block">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl xl:text-5xl font-bold mb-6 text-gray-900">Welcome to ShopHub</h1>
              <p className="text-xl text-gray-600 mb-8">
                Discover amazing products at unbeatable prices. Join thousands of happy customers today.
              </p>

              {/* Features */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-gray-700">Exclusive deals and offers</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Lock className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="text-gray-700">Secure and fast checkout</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-gray-700">Personalized recommendations</span>
                </div>
              </div>

              <Image
                src="/ecom.jpg"
                alt="E-commerce shopping illustration"
                width={300}
                height={200}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>

          {/* Right side - Auth Form */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            <Card className="shadow-xl border-0">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl md:text-3xl font-bold">
                  {isLogin ? "Welcome Back" : "Create Account"}
                </CardTitle>
                <CardDescription className="text-base">
                  {isLogin
                    ? "Sign in to your account to continue shopping"
                    : "Join ShopHub and start your shopping journey"}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Social Login */}
                {/* <div className="space-y-3">
                  <Button variant="outline" className="w-full h-12 bg-transparent" type="button">
                    <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Continue with Google
                  </Button>
                  <Button variant="outline" className="w-full h-12 bg-transparent" type="button">
                    <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="#1877F2">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Continue with Facebook
                  </Button>
                </div> */}

                {/* <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
                  </div>
                </div> */}

                {/* Auth Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" name="firstName" placeholder="John" required className="h-12" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" name="lastName" placeholder="Doe" required className="h-12" />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12"
                    />
                  </div>

                  {!isLogin && (
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number (Optional)</Label>
                      <Input id="phone" name="phone" type="tel" placeholder="+1 (555) 123-4567" className="h-12" />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        required
                        className="h-12 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-12 w-12 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {!isLogin && (
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          required
                          className="h-12 pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-12 w-12 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </div>
                  )}

                  {isLogin && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="remember" />
                        <Label htmlFor="remember" className="text-sm">
                          Remember me
                        </Label>
                      </div>
                      <Button
                        type="button"
                        variant="link"
                        className="text-sm text-primary p-0 h-auto"
                        onClick={handlePasswordReset}
                        disabled={isResetting || !email}
                      >
                        {isResetting ? 'Sending...' : 'Forgot password?'}
                      </Button>
                    </div>
                  )}

                  {!isLogin && (
                    <div className="flex items-start space-x-2">
                      <Checkbox id="terms" required className="mt-1" />
                      <Label htmlFor="terms" className="text-sm leading-5">
                        I agree to the{" "}
                        <Link href="#" className="text-primary hover:underline">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="#" className="text-primary hover:underline">
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>
                  )}

                  <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {isLogin ? "Signing in..." : "Creating account..."}
                      </div>
                    ) : isLogin ? (
                      "Sign In"
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>

                {/* Mobile toggle */}
                <div className="text-center lg:hidden">
                  <span className="text-sm text-muted-foreground">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                  </span>
                  <Button
                    variant="link"
                    className="p-0 ml-1 h-auto font-semibold text-primary"
                    onClick={toggleAuthMode}
                  >
                    {isLogin ? "Sign up" : "Sign in"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Security notice */}
            <div className="mt-6 text-center">
              <p className="text-xs text-muted-foreground">
                Protected by industry-standard encryption and security measures
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
