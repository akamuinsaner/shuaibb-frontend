FROM node:20-alpine


ARG BACKEND_URL=BACKEND_URL
ARG PORT=PORT

ENV PORT=$PORT
ENV BACKEND_URL=$BACKEND_URL

# Yarn Install
COPY . /root/webapp/
WORKDIR /root/webapp

RUN npm config set registry 'https://registry.npm.taobao.org' && npm install -g serve
# RUN npm config set registry 'https://registry.npm.taobao.org' && npm install \
#     && npm run build


EXPOSE ${PORT}

# Start Script
CMD serve -s -p ${PORT} /root/webapp/build