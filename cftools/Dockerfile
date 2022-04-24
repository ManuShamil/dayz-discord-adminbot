FROM node:alpine

WORKDIR /app

COPY . .

RUN rm -r src

RUN npm install --production

WORKDIR /app/cftools-sdk

RUN npm install

RUN npm run build

WORKDIR /app

CMD [ "node", "src/app.js"]

