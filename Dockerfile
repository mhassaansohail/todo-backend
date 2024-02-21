FROM node:latest

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
COPY build ./build
COPY .env ./
COPY . .

RUN npm install
RUN npm install prisma @prisma/client

EXPOSE 3000
CMD ["npm", "run", "start"]
