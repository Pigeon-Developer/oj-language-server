FROM oj-language-server-common

RUN apt-get update && apt-get install clangd -y

CMD [ "node", "/app/dist/cpp.mjs" ]
