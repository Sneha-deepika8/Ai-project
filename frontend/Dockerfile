# --- Build stage ---
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Vite bakes VITE_* vars in at build time. Since the API is called directly
# from the user's browser (not from inside the container network), this
# should point at the URL the browser can reach, e.g. http://localhost:8088/api.
ARG VITE_API_BASE_URL=http://localhost:8088/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# --- Runtime stage ---
FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 5173

CMD ["nginx", "-g", "daemon off;"]