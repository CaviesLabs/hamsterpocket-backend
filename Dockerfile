FROM node:16-buster AS development

WORKDIR /app

COPY package*.json ./

RUN yarn install

COPY . .

RUN yarn build

FROM node:16-buster as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package*.json ./

RUN yarn install --production

COPY . .

COPY --from=development /app/dist ./dist
