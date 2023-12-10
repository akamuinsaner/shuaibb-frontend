FROM node:16.20.0-alpine

ARG BACKEND_URL=BACKEND_URL
ARG PORT=PORT

ENV PORT=$PORT
ENV BACKEND_URL=$BACKEND_URL

# Yarn Install
COPY package.json /root/webapp/
COPY package-lock.json /root/webapp/
WORKDIR /root/webapp
RUN npm config set registry 'https://registry.npm.taobao.org' && npm install

# Copy file
COPY . /root/webapp/

# Build Dist
RUN NODE_ENV=production npm run build && \
    mkdir -p /run/nginx && \
    rm -f /etc/nginx/sites-enabled/* && \
    mkdir -p /usr/share/nginx/html && \
    cp -r build/* /usr/share/nginx/html

EXPOSE ${PORT}

# Start Script
CMD node /root/webapp/server.js ${PORT} ${BACKEND_URL}