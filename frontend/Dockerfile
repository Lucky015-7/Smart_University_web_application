# FROM node:24-alpine
FROM node:25-trixie
WORKDIR /app

# Install necessary utilities
# RUN --mount=type=cache,target=/var/cache/apk \
#     apk update && apk add git bash curl

RUN apt-get update && apt-get install -y git bash curl

# Copy files as root (default)
COPY package.json package-lock.json* ./

# Cache npm installs (root has full access to /home/node/.npm)
RUN --mount=type=cache,target=/home/node/.npm \
    npm install

COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]