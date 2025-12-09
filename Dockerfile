 # Use Node.js 22 alpine for a lightweight base image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Set API_URL as build argument with default value
ARG API_URL=http://localhost:3001/
ENV API_URL=${API_URL}

# Copy package files first to leverage cache
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code (includes .env if present in build context)
COPY . .

# Run the build (type errors are ignored via next.config.js)
RUN npm run build

# Expose the development port
EXPOSE 3000

# Run the development server
CMD ["npm", "run", "dev"]

