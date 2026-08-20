FROM node:24-alpine AS base
ENV TURBO_TELEMETRY_DISABLED=1
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# SETUP VITE STATIC ENV
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

FROM base AS pruner
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY . .
RUN pnpm dlx turbo prune "@workspace/web" --docker

FROM base AS builder
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/full/ .
RUN pnpm install --frozen-lockfile
RUN pnpm turbo run build

FROM nginx:stable-alpine AS runner
COPY --from=builder /app/apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/web/dist/client /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]