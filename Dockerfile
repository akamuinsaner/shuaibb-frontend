FROM node:19-bullseye


ARG BACKEND_URL=BACKEND_URL
ARG PORT=PORT

ENV PORT=$PORT
ENV BACKEND_URL=$BACKEND_URL

# Yarn Install
COPY package.json /root/webapp/
COPY package-lock.json /root/webapp/
WORKDIR /root/webapp
RUN npm config set registry 'https://registry.npm.taobao.org' && npm install \
    && npm run build

# Copy file
COPY build /root/webapp/

EXPOSE ${PORT}

# Start Script
CMD node /root/webapp/server.js ${PORT} ${BACKEND_URL}