FROM node:22.20.0-alpine AS frontend_builder
WORKDIR /app
COPY bugs/client/package.json bugs/client/package-lock.json ./
RUN npm install
COPY bugs/client .
RUN npx webpack

FROM python:3.12.11-slim-bookworm AS production
WORKDIR /app
COPY bugs/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY bugs .
COPY --from=frontend_builder /app/dist /app/client/static

EXPOSE 8000

CMD ["daphne", "bugs.asgi:application", "-b", "0.0.0.0", "-p", "8000"]