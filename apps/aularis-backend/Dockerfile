FROM node:20-alpine

ARG port
ARG service

ENV SERVICE=${service}
ENV PORT=${port}

WORKDIR /home/node/app

# Copy root package manifests
COPY package*.json ./

# Install dependencies
RUN npm install -g npm@10.9.4

RUN npm install

# Copy monorepo source
COPY . .

# Build the backend
RUN npm run build:${SERVICE}

# Run as non-root user
USER node

EXPOSE ${PORT}

CMD ["npm", "run", "start:aularis-backend"]