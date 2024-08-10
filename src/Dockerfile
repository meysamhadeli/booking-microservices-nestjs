FROM node:21.7-alpine

# Install NestJS CLI tool
RUN npm install -g @nestjs/cli

# Switch to non-root user
USER node

# Get build target
ARG TARGET
ENV BLOCKS=building-blocks

# Define env variables for workdirs
ENV WORKDIR_BASE=/usr/src/app
ENV WORKDIR_BLOCKS=${WORKDIR_BASE}/${BLOCKS}
ENV WORKDIR_TARGET=${WORKDIR_BASE}/${TARGET}

# Build utility package
WORKDIR ${WORKDIR_BLOCKS}
COPY --chown=node:node ./src/${BLOCKS}/package*.json .
RUN npm install
COPY --chown=node:node ./src/${BLOCKS} .
RUN npm run build

# Build target package
WORKDIR ${WORKDIR_TARGET}
COPY --chown=node:node ./src/${TARGET}/package*.json .
RUN npm install
COPY --chown=node:node ./src/${TARGET} .
RUN npm run build

# Run the app (target)
CMD exec npm run dev

# ARG NODE_ENV
# ENV NODE_ENV=${NODE_ENV:-dev}
# # start, start:dev, start:debug, start:prod
# # CMD exec yarn start:${NODE_ENV}