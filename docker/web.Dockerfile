FROM pigeonojdev/oj-language-server-common

WORKDIR /app
RUN cd /app && pnpm build:web


CMD [ "pnpm", "preview" ]
