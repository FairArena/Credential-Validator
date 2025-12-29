FROM node:20-bullseye-slim AS builder

WORKDIR /app

ENV NODE_OPTIONS="--max-old-space-size=4096"

# Copy deps only (max caching)
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

EXPOSE 3002

CMD ["npm", "start"]