FROM node:24-alpine

ARG port
ARG service

ENV SERVICE=${service}
ENV PORT=${port}
ENV AUTH_PORT=${port}

WORKDIR /home/node/app

# Передаём рабочую директорию пользователю node
RUN chown -R node:node /home/node/app

# Копируем package.json и lock-файл
COPY --chown=node:node package*.json ./

# Устанавливаем зависимости от пользователя node
USER node
RUN npm ci

# Копируем исходный код
COPY --chown=node:node . .
UN echo "===== DEBUG: PROJECT ROOT =====" \
    && pwd \
    && ls -la \
    && echo "===== DEBUG: AUTH DIRECTORY =====" \
    && ls -la apps/auth \
    && echo "===== DEBUG: AUTH TSCONFIG =====" \
    && test -f apps/auth/tsconfig.app.json \
    && cat apps/auth/tsconfig.app.json \
    && echo "===== DEBUG: NEST CONFIG =====" \
    && cat nest-cli.json
# Собираем нужный NestJS-сервис
RUN npm run build:${SERVICE}

# Показываем собранные entrypoint-файлы
RUN find dist -type f -name "main.js" -print

EXPOSE ${PORT}

CMD ["sh", "-c", "npm run start:${SERVICE}:prod"]