# based on https://github.com/vercel/next.js/blob/canary/examples/with-docker-multi-env/docker/production/Dockerfile

# 1. Install dependencies only when needed
FROM node:alpine AS deps
ARG SERVER_PORT
ENV SERVER_PORT $SERVER_PORT
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache --update libc6-compat make g++

WORKDIR /app

COPY . .

RUN npm install

# 2. Rebuild the source code only when needed
FROM node:alpine AS builder

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}
ENV LANG C.UTF-8
ENV LANGUAGE C.UTF-8
ENV LC_ALL C.UTF-8
ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules

RUN npm run build

# 3. Production image, copy all the files and run next
FROM node:alpine AS runner
ARG SERVER_PORT
ENV SERVER_PORT $SERVER_PORT
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}
ENV LANG C.UTF-8
ENV LANGUAGE C.UTF-8
ENV LC_ALL C.UTF-8
ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
#
COPY --from=builder --chown=nextjs:nodejs /app/.env          ./.env
COPY --from=builder --chown=nextjs:nodejs /app/dist          ./dist
COPY --from=builder --chown=nextjs:nodejs /app/package-lock.json    ./package-lock.json
COPY --from=builder --chown=nextjs:nodejs /app/package.json  ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/node_modules  ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/tsconfig.json ./tsconfig.json
COPY --from=builder --chown=nextjs:nodejs /app/tsconfig.build.json ./tsconfig.build.json

USER nextjs

ENV SERVER_PORT $SERVER_PORT

EXPOSE $SERVER_PORT

ENTRYPOINT [ "npm" ]

CMD ["run", "start:prod"]

# 3. Migrator image, copy and run migrations
FROM node:alpine AS migrator

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}
ENV LANG C.UTF-8
ENV LANGUAGE C.UTF-8
ENV LC_ALL C.UTF-8
ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
#
COPY --from=builder --chown=nextjs:nodejs /app/.env          ./.env
COPY --from=builder --chown=nextjs:nodejs /app/config        ./config
COPY --from=builder --chown=nextjs:nodejs /app/package-lock.json    ./package-lock.json
COPY --from=builder --chown=nextjs:nodejs /app/package.json  ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/node_modules  ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/tsconfig.json ./tsconfig.json
COPY --from=builder --chown=nextjs:nodejs /app/tsconfig.build.json ./tsconfig.build.json
USER nextjs

ENTRYPOINT [ "npm" ]

CMD ["run", "migration:run"]
