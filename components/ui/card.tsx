import * as React from "react"

import { cn } from "../../lib/utils"

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border  shadow-sm py-6",
        className
      )}
      {...props}
    />
  )
}


function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn(
        "px-6 py-4", // padding
        "bg-white dark:bg-gray-800", // background for light/dark modes
        "rounded-b-2xl", // rounded bottom edges (assuming header is above)
        "text-gray-700 dark:text-gray-200", // text color
        "leading-relaxed", // line height
        className
      )}
      {...props}
    />
  )
}


function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}



function ProductCard({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "bg-white border rounded-lg overflow-hidden shadow-sm w-48",
        "flex flex-col",
        className
      )}
      {...props}
    />
  )
}

function ProductCardImage({ src, alt }: { src: string; alt?: string }) {
  return (
    <div className="w-full h-56 overflow-hidden bg-gray-100">
      <img
        src={src}
        alt={alt || ""}
        className="w-full h-full object-cover"
      />
    </div>
  )
}

function ProductCardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "p-3 flex flex-col gap-1 text-sm",
        className
      )}
      {...props}
    />
  )
}

function ProductCardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      className={cn("font-medium leading-tight text-gray-900 line-clamp-2", className)}
      {...props}
    />
  )
}
function ProductCardPrice({ price, mrp, discount }: { price: string; mrp: string; discount: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-lg font-semibold text-gray-900">{price}</span>
      <span className="text-xs text-gray-500">
        MRP: <span className="line-through">{mrp}</span> ({discount} off)
      </span>
    </div>
  )
}


export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  ProductCardImage,
  ProductCardPrice,
  ProductCardTitle,
  ProductCardContent,
  ProductCard
}
