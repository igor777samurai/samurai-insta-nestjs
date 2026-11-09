
FROM node:24-alpine

ARG port
ARG service

ENV SERVICE=${service}
ENV PORT=${port}
ENV AUTH_PORT=${port}

WORKDIR /home/node/app

RUN chown -R node:node /home/node/app

COPY --chown=node:node package*.json ./

USER node

RUN npm ci

COPY --chown=node:node . .

# Сборка Auth
RUN npm run build:${SERVICE}

# Проверяем фактическое расположение main.js
RUN echo "===== AUTH BUILD OUTPUT =====" \
    && find dist -type f -name "main.js" -print \
    && echo "===== DIST TREE =====" \
    && find dist -maxdepth 5 -type f | head -100

EXPOSE ${PORT}

CMD ["sh", "-c", "npm run start:${SERVICE}:prod"]
