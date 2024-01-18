FROM node:lts

# work directory
WORKDIR /api

# copy package.json
COPY package.json package.json

# copy lockfile
COPY yarn.lock yarn.lock

# install dependencies
RUN npm install

# copy src
COPY . .

# expose server port
EXPOSE 5000

# start
CMD ["yarn", "start"]