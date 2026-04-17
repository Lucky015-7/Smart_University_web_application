FROM node:24-alpine
WORKDIR /app

# Install necessary utilities
RUN --mount=type=cache,target=/var/cache/apk \
    apk update && apk add git bash curl

# Copy files as root (default)
COPY package.json package-lock.json* ./

# Cache npm installs (root has full access to /home/node/.npm)
RUN --mount=type=cache,target=/home/node/.npm \
    npm install

COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]