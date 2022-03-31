FROM node:lts-alpine@sha256:32f64135e74ec4dc5d63cc36318444f1d801cd23c44253124f7eccb52c4b89c5 AS builder

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY ../package*.json ./
COPY ../prisma ./prisma/

# Install app dependencies
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000
CMD [ "npm", "run", "start" ]