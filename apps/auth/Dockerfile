FROM node:24-alpine

ARG port
ARG service

ENV SERVICE=${service}
ENV PORT=${port}

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

# Собираем нужный NestJS-сервис
RUN npm run build:${SERVICE}

EXPOSE ${PORT}

CMD npm run 'start:auth'