FROM node:lts
WORKDIR /api
COPY package.json package.json
COPY yarn.lock yarn.lock
RUN npm install
COPY . .
EXPOSE 5000
CMD ["yarn", "start"]