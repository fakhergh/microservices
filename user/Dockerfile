FROM node
RUN mkdir -p /var/www/user-app
WORKDIR /var/www/user-app
ADD . /var/www/user-app
RUN npm install
CMD npm run build && npm run start:prod
