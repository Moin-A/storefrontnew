#!/bin/bash

# Setup Script for Next.js Solidus Integration
echo "🚀 Setting up Next.js frontend for Solidus..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script in your Next.js project root directory"
    exit 1
fi

# Create directory structure
echo "📁 Creating directory structure..."

# App directories
mkdir -p app/shop/{categories,search}
mkdir -p app/shop/categories/[slug]
mkdir -p app/shop/[slug]
mkdir -p app/cart/checkout/{address,delivery,payment,complete}
mkdir -p app/account/{login,register,orders,addresses,profile}
mkdir -p app/account/orders/[id]

# API directories
mkdir -p app/api/auth/{login,register,logout}
mkdir -p app/api/products/[id]
mkdir -p app/api/cart/items/[id]
mkdir -p app/api/checkout/[token]
mkdir -p app/api/orders/[id]
mkdir -p app/api/user/{orders,addresses}

# Component directories
mkdir -p components/{ui,shop,cart,checkout,account}
mkdir -p hooks
mkdir -p lib
mkdir -p styles