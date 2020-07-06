FROM node:10.13.0-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Install all Packages
RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .



# Start
CMD [ "npm", "dev" ]

EXPOSE 8080

# docker build -t hradocker/fb-comp-server-app-server .