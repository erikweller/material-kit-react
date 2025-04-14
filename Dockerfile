# ---------- Step 1: Build the application ----------
    FROM node:20-alpine AS builder

    # Set working directory
    WORKDIR /app
    
    # Install system packages needed by Prisma
    RUN apk add --no-cache openssl
    
    # Copy dependency manifests
    COPY package.json package-lock.json* pnpm-lock.yaml* ./
    COPY .npmrc* ./
    
    # Install dependencies (you can switch to `pnpm install` if preferred)
    RUN npm install
    
    # Copy the rest of the application
    COPY . .
    
    # Generate Prisma client
    RUN npx prisma generate
    
    # Build the Next.js app
    RUN npm run build
    
    
    # ---------- Step 2: Create a lightweight runtime image ----------
    FROM node:20-alpine AS runner
    
    WORKDIR /app
    
    # Install runtime dependencies
    RUN apk add --no-cache libc6-compat
    
    # Copy only the necessary build artifacts and code
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/package.json ./package.json
    COPY --from=builder /app/.next ./.next
    COPY --from=builder /app/public ./public
    COPY --from=builder /app/prisma ./prisma
    
    # Prisma migration on container startup
    COPY --from=builder /app/.env.production ./.env.production
    
    # Set environment
    ENV NODE_ENV=production
    ENV PORT=3001
    
    # Expose app port
    EXPOSE 3001
    
    # Run Prisma migrations and start app
    CMD npx prisma migrate deploy && npm start
    