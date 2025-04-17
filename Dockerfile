# --- Step 1: Build ---
    FROM public.ecr.aws/docker/library/node:20-alpine AS builder

    WORKDIR /app
    RUN apk add --no-cache openssl
    
    COPY package.json package-lock.json* pnpm-lock.yaml* ./
    COPY .npmrc* ./
    RUN npm install
    
    COPY . .
    COPY .env.production .env
    
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

# ✅ THIS IS WHAT YOU'RE MISSING
COPY --from=builder /app/.env .env

# Or if you're only copying `.env.production`, rename it
# COPY --from=builder /app/.env.production .env

EXPOSE 3001
ENV NODE_ENV=production
ENV PORT=3001

CMD npx prisma migrate deploy && npm start
