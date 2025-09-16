FROM node:latest

WORKDIR /app

RUN mkdir docs
RUN mkdir src

COPY ../../package*.json ./
COPY ../../tsConfig.json ./tsConfig.json
COPY ../../tsConfig.build.json ./tsConfig.build.json
COPY ../../prisma ./prisma/
COPY ../../docs ./docs
COPY ../../src ./src
COPY ../../oAuth2.keys.json ./

RUN npm install
RUN npm install prisma @prisma/client
RUN npx tsc -b tsConfig.build.json


EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed && npm run start"]
