FROM node:24-alpine AS base
ENV TURBO_TELEMETRY_DISABLED=1
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS pruner
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY . .
RUN pnpm dlx turbo prune "@workspace/api" --docker

FROM base AS builder
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile
COPY --from=pruner /app/out/full/ .
RUN pnpm turbo run build

FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/api/build ./apps/api
WORKDIR /app/apps/api

FROM runner AS worker
ENTRYPOINT ["sh", "-c", "node ace queue:work --queue=$QUEUE_NAMES"]

FROM runner AS server
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "node ace migration:run --force && node bin/server.js"]

FROM runner AS both
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "node ace migration:run --force && node bin/server.js & node ace queue:work --queue=$QUEUE_NAMES"]