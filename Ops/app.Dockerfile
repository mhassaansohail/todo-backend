FROM node:latest

WORKDIR /app

COPY ../package*.json ./
COPY ../prisma ./prisma/
COPY ../dist/src ./src
COPY ../oAuth2.keys.json ./
COPY ../.env ./

RUN npm install
RUN npm install prisma @prisma/client

EXPOSE 3000
CMD ["npm", "run", "start"]
