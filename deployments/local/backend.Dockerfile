FROM node:16-alpine as development

WORKDIR /usr/src/beersup-backend

COPY package.json ./

COPY yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

CMD ["yarn", "start"]
