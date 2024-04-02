################################################################
#Stage 1: Install the base dependencies
################################################################
# Use node version 20.11.0
FROM node:20.11.0@sha256:7bf4a586b423aac858176b3f683e35f08575c84500fbcfd1d433ad8568972ec6 AS base

LABEL maintainer="Kevin Christian <christiankevin0409@gmail.com>"
LABEL description="Fragments node.js microservice"

# We default to use port 8080 in our service
ENV PORT=8080

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

# Set the NODE_ENV to production
ENV NODE_ENV=production

# Use /app as our working directory
WORKDIR /app

# Copy the package.json and package-lock.json files into /app
COPY package*.json /app/

# Install node dependencies as defined in the package-lock.json
RUN npm ci --only=production

################################################################
#Stage 2: Build and Serve the application
################################################################
FROM node:20.11.0@sha256:7bf4a586b423aac858176b3f683e35f08575c84500fbcfd1d433ad8568972ec6 AS build

#Set the working directory
WORKDIR /app

#Copy the generated node_modules from the previous stage
COPY --from=base /app/ /app/

# Copy src to /app/src/
COPY ./src ./src

# Copy our HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd

# Added healthcheck
HEALTHCHECK --interval=30s --timeout=5s \
  CMD wget -qO- "http://localhost:8080/" || exit 1

# Start the container by running our server
CMD ["npm","start"]

# We run our service on port 8080
EXPOSE 8080
