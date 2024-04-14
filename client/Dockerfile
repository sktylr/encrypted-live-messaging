FROM node:20-alpine as build

WORKDIR /client

COPY package*.json .

RUN npm ci

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /client/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
