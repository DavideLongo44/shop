#stage1
FROM node:14 AS builder
WORKDIR /Einkaufsliste
COPY package*.json ./
RUN npm install
COPY . .

#stage2 
RUN npm run build
FROM nginx:1.21
COPY --from=builder /Einkaufsliste/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
