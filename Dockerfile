FROM node:20-alpine

ARG BACKEND_URL=BACKEND_URL
ARG PORT=PORT

ENV PORT=$PORT
ENV BACKEND_URL=$BACKEND_URL


WORKDIR /root/webapp

# Copy file
COPY build /root/webapp/

EXPOSE ${PORT}

# Start Script
CMD node /root/webapp/server.js ${PORT} ${BACKEND_URL}