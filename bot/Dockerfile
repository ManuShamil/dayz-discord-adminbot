FROM node:alpine

WORKDIR /app

COPY . .

RUN rm -r src

RUN npm install --production

CMD [ "node", "src/app.js"]

