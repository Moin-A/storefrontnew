'use client'

import { useEffect } from 'react'
import { useUIStore } from '../../app/store/useUIStore'
import { X, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react'

export function Toast() {
  const notifications = useUIStore((state) => state.notifications)
  const removeNotification = useUIStore((state) => state.removeNotification)

  useEffect(() => {
    notifications.forEach((notification) => {
        const timer = setTimeout(() => {
          removeNotification(notification.id)
        }, 6000)
        return () => clearTimeout(timer)
      
    })
  }, [notifications, removeNotification])

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5" />
      case 'error':
        return <XCircle className="h-5 w-5" />
      case 'warning':
        return <AlertCircle className="h-5 w-5" />
      case 'info':
        return <Info className="h-5 w-5" />
      default:
        return null
    }
  }

  const getStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 text-green-800 border-green-200'
      case 'error':
        return 'bg-red-50 text-red-800 border-red-200'
      case 'warning':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200'
      case 'info':
        return 'bg-blue-50 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-50 text-gray-800 border-gray-200'
    }
  }

  const getTitle = (type: string) => {
    switch (type) {
      case 'success':
        return 'Success'
      case 'error':
        return 'Error'
      case 'warning':
        return 'Warning'
      case 'info':
        return 'Info'
      default:
        return 'Notification'
    }
  }

  if (notifications.length === 0) return null

  return (
    <div className="fixed bottom-12 right-4 z-50 flex flex-col gap-6">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex items-center gap-3 px-8 py-6 rounded-lg border shadow-lg min-w-[300px] max-w-md animate-in slide-in-from-bottom-5 ${getStyles(
            notification.type
          )}`}
        >
          {getIcon(notification.type)}
          <div className="flex-1">
            <p className="text-sm font-semibold">{notification.title || getTitle(notification.type)}</p>
            <p className="text-xs text-gray-600">{notification.message}</p>
          </div>
          <button
            onClick={() => removeNotification(notification.id)}
            className="hover:opacity-70 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}

