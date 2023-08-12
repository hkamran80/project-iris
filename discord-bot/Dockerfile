# FROM node:20.5.1-alpine3.17

# RUN mkdir -p /app
# WORKDIR /app

# COPY *.json /app/
# COPY *.yaml /app/
# COPY dist/* /app/
# RUN touch /app/reactor.json

# RUN npm install

# CMD ["node", "--es-module-specifier-resolution=node", "index.js"]

FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY *.json /app
COPY *.yaml /app
COPY src/ /app
WORKDIR /app

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --no-frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM base
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist
CMD [ "pnpm", "run", "run:docker" ]