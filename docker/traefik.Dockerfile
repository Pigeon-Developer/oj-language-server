FROM traefik:v3.2

RUN mkdir /traefik-conf
COPY ./traefik-conf /traefik-conf
