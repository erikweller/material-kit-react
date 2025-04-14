# ---------- Step 1: Build ----------
    FROM node:20-alpine AS builder

    WORKDIR /app
    RUN apk add --no-cache openssl
    
    COPY package.json package-lock.json* pnpm-lock.yaml* ./
    COPY .npmrc* ./
    
    
    
    RUN npm install
    
    COPY . .
    
    ARG DATABASE_URL
    ENV DATABASE_URL=${DATABASE_URL}
    
    RUN npx prisma generate
    RUN npm run build
    
    # ---------- Step 2: Runtime ----------
    FROM node:20-alpine AS runner
    
    WORKDIR /app
    RUN apk add --no-cache libc6-compat
    
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/package.json ./package.json
    COPY --from=builder /app/.next ./.next
    COPY --from=builder /app/public ./public
    COPY --from=builder /app/prisma ./prisma
    COPY --from=builder /app/.env.production ./.env.production
    
    ENV NODE_ENV=production
    ENV PORT=3001
    
    EXPOSE 3001
    
    CMD npx prisma migrate deploy && npm start
    