# Build stage
FROM oven/bun AS builder

WORKDIR /app

COPY package.json ./
COPY bun.lock ./
RUN bun install

COPY . .
RUN bun run build

# Production stage
FROM oven/bun

WORKDIR /app

COPY --from=builder /app/.output ./.output
COPY --from=builder /app/.nuxt ./.nuxt
COPY --from=builder /app/package.json ./
COPY --from=builder /app/bun.lock ./

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=4000
ENV NITRO_PORT=4000

EXPOSE 4000

CMD ["bun", ".output/server/index.mjs"]
