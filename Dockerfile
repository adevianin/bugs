FROM node:22.20.0-alpine AS frontend_builder
WORKDIR /app
COPY bugs/client/package.json bugs/client/package-lock.json ./
RUN npm install
COPY bugs/client .
RUN npx webpack

FROM caddy:2-alpine AS caddy_proxie
COPY --from=frontend_builder /app/dist /static_files

FROM python:3.12.11-slim-bookworm AS backend
WORKDIR /app
COPY bugs/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY bugs .
COPY --from=frontend_builder /app/dist/manifest.json /app/client/static/manifest.json