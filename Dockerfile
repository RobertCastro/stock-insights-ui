FROM node:20-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

RUN npm run build-only -- --mode production

FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]