FROM node:18-alpine AS frontend-builder
WORKDIR /app
RUN corepack enable
COPY ui/package.json .
COPY ui/pnpm-lock.yaml .
RUN pnpm install --frozen-lockfile
COPY ui .
RUN npm run build

FROM golang:1.21.6-alpine AS go-builder
WORKDIR /app
COPY go.* ./
RUN go mod download
COPY . .
COPY --from=frontend-builder /app/build /app/ui/build
RUN go build .

FROM alpine
WORKDIR /app
COPY --from=go-builder /app/th-webapp /app/th-webapp
EXPOSE 8090
CMD ["./th-webapp", "serve", "--http=0.0.0.0:8090"]
