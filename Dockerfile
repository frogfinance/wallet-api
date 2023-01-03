# Common build stage
FROM node:18.9.0-alpine as common-build-stage

WORKDIR /app

COPY package.json .

RUN yarn

RUN yarn add prisma --dev

COPY . .

RUN yarn prisma:generate

EXPOSE 3000

# Development build stage
FROM common-build-stage as development-build-stage

ENV NODE_ENV development

CMD ["yarn", "dev"]

# Production build stage
FROM common-build-stage as production-build-stage

ENV NODE_ENV production

CMD ["yarn", "start"]
