
# ---------- Build stage ----------
FROM node:24-alpine AS builder

WORKDIR /home/node/app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build:api-backend


# ---------- Production stage ----------
FROM node:24-alpine AS production

ENV NODE_ENV=production
ENV PORT=5978

WORKDIR /home/node/app

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /home/node/app/dist ./dist

USER node

EXPOSE 5978

CMD ["node", "dist/apps/api-backend/main.js"]
