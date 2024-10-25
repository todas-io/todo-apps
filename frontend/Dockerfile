FROM node:18.16-alpine as build-stage
WORKDIR /app
COPY . ./
RUN npm install
RUN npm run build


# 動作環境
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY ./docker/nginx/default.conf /etc/nginx/conf.d/default.conf

COPY ./docker/nginx/server.key /etc/nginx/ssl/server.key
COPY ./docker/nginx/server.crt /etc/nginx/ssl/server.crt

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]/