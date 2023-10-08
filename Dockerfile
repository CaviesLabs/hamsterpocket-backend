FROM node:16.18.1

ARG NODE_ENV=production
ENV NODE_ENV ${NODE_ENV}
WORKDIR /app

COPY . .

RUN --mount=type=cache,target=/root/.yarn YARN_CACHE_FOLDER=/root/.yarn yarn global add @nestjs/cli && yarn install --frozen-lockfile
RUN yarn build

