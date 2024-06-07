FROM node
RUN mkdir -p /var/www/gateway-app
WORKDIR /var/www/gateway-app
ADD . /var/www/gateway-app
RUN npm install
CMD npm run build && npm run start:prod
