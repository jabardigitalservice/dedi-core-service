FROM registry.digitalservice.id/proxyjds/library/alpine:3.12

RUN apk add nodejs npm && rm -rf /var/cache/apk/*

WORKDIR /app

ENV PORT 3003

COPY . .

RUN npm install --only=prod

RUN npm run build

RUN addgroup -S pptruser && adduser -S -g pptruser pptruser \
    && chown -R pptruser:pptruser /app

USER pptruser

EXPOSE ${PORT}

RUN chmod +x ./docker/entrypoint.sh

ENTRYPOINT [ "./docker/entrypoint.sh" ]
