# Development Dockerfile with optimized caching
FROM node:18-alpine

WORKDIR /app

# Copy package files first (this layer will be cached if package.json doesn't change)
COPY package.json package-lock.json* ./

# Install dependencies (this layer will be cached unless package files change)
RUN npm ci

# Copy the rest of the application (this layer changes frequently)
COPY . .

EXPOSE 3000

# Use development server for hot reload
CMD ["npm", "run", "dev"]

