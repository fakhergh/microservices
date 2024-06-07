FROM node
RUN mkdir -p /var/www/authentication-app
WORKDIR /var/www/authentication-app
ADD . /var/www/authentication-app
RUN npm install
CMD npm run build && npm run start:prod
