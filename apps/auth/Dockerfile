
# Node.js 24 — совместим с Prisma 7
FROM node:24-alpine

ARG port
ARG service

ENV SERVICE=${service}
ENV PORT=${port}
ENV AUTH_PORT=${port}

# Рабочая директория проекта
WORKDIR /home/node/app

# Устанавливаем зависимости из корневого package.json
COPY --chown=node:node package*.json ./

USER node

RUN npm ci

# Копируем исходный код monorepo
COPY --chown=node:node . .

# Собираем выбранный NestJS service
RUN npm run build:${SERVICE}

# Проверяем наличие собранного приложения
RUN echo "=== BUILD FILES ===" \
    && find dist -type f -name "main.js" -print

# Порт микросервиса
EXPOSE ${PORT}

# Запускаем production-версию выбранного сервиса
CMD ["sh", "-c", "npm run start:${SERVICE}:prod"]
