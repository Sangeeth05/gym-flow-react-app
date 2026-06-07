# Build stage
FROM node:20-alpine AS build
WORKDIR /app
ARG REACT_APP_API_URL
ARG REACT_APP_USE_MOCK
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_USE_MOCK=$REACT_APP_USE_MOCK
COPY package*.json ./
RUN npm ci --silent
COPY . .
RUN npm run build

# Serve with nginx
FROM nginx:alpine AS runtime
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
