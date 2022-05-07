FROM node:alpine

# Create app directory
WORKDIR /src

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)

COPY . /src


RUN npm install

# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source

EXPOSE 4500

CMD [ "npm", "start" ]
