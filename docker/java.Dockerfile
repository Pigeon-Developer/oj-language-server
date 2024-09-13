FROM oj-language-server-common as common



FROM eclipse-temurin:17-jdk

ARG PATH_MLC=/home/mlc
ARG PATH_ECLIPSE_JDT=${PATH_MLC}/packages/examples/resources/eclipse.jdt.ls/ls
ARG JDT_TAR_URL=https://download.eclipse.org/jdtls/milestones/1.37.0/jdt-language-server-1.37.0-202406271335.tar.gz
ARG JDT_TAR_LOCAL=eclipse.jdt.ls.tar.gz


ENV NODE_VERSION=20.17.0
RUN apt update
RUN apt install -y curl wget
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin:${PATH}"

# prepare
RUN mkdir -p ${PATH_MLC}

# download and extract Eclipse JDT LS in target folder
RUN mkdir -p ${PATH_ECLIPSE_JDT} \
    && cd ${PATH_ECLIPSE_JDT} \
    && wget -O ${JDT_TAR_LOCAL} ${JDT_TAR_URL} \
    && tar -xzf ${JDT_TAR_LOCAL}

WORKDIR ${PATH_MLC}

COPY --from=common /app /app

CMD [ "node", "/app/dist/java.mjs" ]
