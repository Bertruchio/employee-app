FROM node:22-bookworm-slim AS builder

RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json tsconfig.base.json ./
COPY shared/package.json ./shared/
COPY server/package.json ./server/
COPY client/package.json ./client/

RUN npm ci

COPY shared ./shared
COPY server ./server
COPY client ./client

RUN npm run build

FROM node:22-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000
ENV CORS_ORIGIN=http://localhost:4000
ENV DB_PATH=/app/server/data/database.sqlite
ENV TS_NODE_PROJECT=/app/server/tsconfig.prod.json

COPY package.json package-lock.json ./
COPY shared/package.json ./shared/
COPY server/package.json ./server/
COPY client/package.json ./client/

RUN npm ci --omit=dev --workspace=@app/server --workspace=@app/shared

COPY --from=builder /app/server/tsconfig.prod.json ./server/tsconfig.prod.json
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/client/dist ./client/dist

RUN mkdir -p /app/server/data

EXPOSE 4000

CMD ["node", "-r", "tsconfig-paths/register", "server/dist/server/src/server.js"]
