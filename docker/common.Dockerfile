FROM debian:bookworm

ENV NODE_VERSION=20.17.0
RUN apt update
RUN apt install -y curl wget
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin:${PATH}"


COPY . /app
RUN cd /app && corepack enable && corepack use pnpm@9.9.0
RUN --mount=type=cache,id=pnpm,target=/pnpm/store cd /app && pnpm install --frozen-lockfile
RUN cd /app && pnpm build:lsp


