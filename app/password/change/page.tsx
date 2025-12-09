"use client"

import type React from "react"
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from "react"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Eye, EyeOff, ArrowLeft, Lock, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useUIStore } from "../../store/useUIStore";

export default function PasswordChangePage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [resetToken, setResetToken] = useState('')
  
  const addNotification = useUIStore((state) => state.addNotification)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Get the reset_password_token from URL parameters
    const token = searchParams.get('reset_password_token')
    if (!token) {
      setError('Invalid or missing reset token')
      addNotification('error', 'Invalid or missing reset token', true)
      return
    }
    setResetToken(token)
  }, [searchParams, addNotification])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError('')

    const form = event.currentTarget;
    const formData = new FormData(form)
    const password = formData.get('password') as string
    const passwordConfirmation = formData.get('passwordConfirmation') as string

    // Validate passwords match
    if (password !== passwordConfirmation) {
      setError('Passwords do not match')
      setIsLoading(false)
      addNotification('error', 'Passwords do not match', true)
      return
    }

    // Validate password strength
    if (password.length < 8) {
      setError('Password must be at least 8 characters long')
      setIsLoading(false)
      addNotification('error', 'Password must be at least 8 characters long', true)
      return
    }

    try {
      const response = await fetch('/api/auth/password/change', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spree_user: {
            reset_password_token: resetToken,
            password: password,
            password_confirmation: passwordConfirmation
          }
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || 'Password reset failed')
        addNotification('error', data.error || 'Password reset failed', true)
        setIsLoading(false)
        return
      }
   
      setIsSuccess(true)
      addNotification('success', data.message, true)
      
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        router.push('/auth')
      }, 3000)
      
    } catch (err) {
      console.error('Error during password reset:', err);
      setIsLoading(false);
      addNotification('error', 'Something went wrong. Please try again.', true);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-600">
              Password Reset Successful!
            </CardTitle>
            <CardDescription className="text-base">
              Your password has been successfully reset. You will be redirected to the login page shortly.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button 
              onClick={() => router.push('/auth')}
              className="w-full h-12 text-base font-semibold"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
   

      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md">
            <Card className="shadow-xl border-0">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Lock className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl md:text-3xl font-bold">
                  Reset Your Password
                </CardTitle>
                <CardDescription className="text-base">
                  Enter your new password below
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your new password"
                        required
                        className="h-12 pr-10"
                        minLength={8}
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
                    <p className="text-xs text-muted-foreground">
                      Password must be at least 8 characters long
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passwordConfirmation">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        id="passwordConfirmation"
                        name="passwordConfirmation"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your new password"
                        required
                        className="h-12 pr-10"
                        minLength={8}
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

                  <Button 
                    type="submit" 
                    className="w-full h-12 text-base font-semibold" 
                    disabled={isLoading || !resetToken}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Resetting Password...
                      </div>
                    ) : (
                      "Reset Password"
                    )}
                  </Button>
                </form>

                <div className="text-center">
                  <Link 
                    href="/auth" 
                    className="text-sm text-primary hover:underline font-medium"
                  >
                    Back to Sign In
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Security notice */}
            <div className="mt-6 text-center">
              <p className="text-xs text-muted-foreground">
                Your password reset link is secure and will expire after use
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
