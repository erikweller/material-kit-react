# ---------- Step 1: Build ----------
    FROM public.ecr.aws/docker/library/node:20-alpine AS builder

    WORKDIR /app
    RUN apk add --no-cache openssl
    
    COPY package.json package-lock.json* pnpm-lock.yaml* ./
    COPY .npmrc* ./
    RUN npm install
    
    COPY . .
    
    # Dynamically copy the right .env file based on APP_ENV build arg
    ARG APP_ENV=dev
    ENV APP_ENV=$APP_ENV
    RUN echo "🔥 Copying .env file based on APP_ENV: $APP_ENV"
    RUN if [ "$APP_ENV" = "prod" ]; then cp .env.production.prod .env; else cp .env.production.dev .env; fi
    RUN echo "🔥 .env contents:"
    RUN cat .env
    
    RUN npx prisma generate
    RUN npm run build
    
    # ---------- Step 2: Runtime ----------
    FROM public.ecr.aws/docker/library/node:20-alpine AS runner
    
    WORKDIR /app
    RUN apk add --no-cache libc6-compat
    
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/package.json ./package.json
    COPY --from=builder /app/.next ./.next
    COPY --from=builder /app/public ./public
    COPY --from=builder /app/prisma ./prisma
    COPY --from=builder /app/.env .env
    
    EXPOSE 3001
    ENV NODE_ENV=production
    ENV PORT=3001
    
    CMD npx prisma migrate deploy && npm start
    