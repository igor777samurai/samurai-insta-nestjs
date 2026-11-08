
# Check out https://hub.docker.com/_/node to select a new base image
FROM node:24-alpine

ARG port
ARG service

ENV SERVICE=${service}
ENV PORT=${port}
ENV NODE_ENV=production

# Create app directory
WORKDIR /home/node/app

# Give access to node user
RUN chown -R node:node /home/node/app

USER node

# Install app dependencies
COPY --chown=node:node package*.json ./

RUN npm ci

# Bundle app source code
COPY --chown=node:node . .

# Build application
RUN npm run build:${SERVICE}

# Bind to all network interfaces
EXPOSE ${PORT}

# Start application
CMD ["sh", "-c", "npm run start:${SERVICE}"]
