# syntax=docker/dockerfile:1

# ---- Etapa 1: dependências ----
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# ---- Etapa 2: build ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Gera o Prisma Client antes do build do Next.js
RUN npx prisma generate

# Variáveis "fake" apenas para o build não falhar caso algum código
# acesse process.env.* durante o build estático. Os valores reais
# de runtime vêm do docker-compose / .env em produção.
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ---- Etapa 3: runtime ----
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Copia apenas o necessário para rodar (build "standalone")
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

# O output do "next build --standalone" só traz os módulos que o código
# da aplicação importa em tempo de execução. O CLI do Prisma (usado só
# para rodar as migrations no start do container) não é importado pelo
# código, então precisa ser copiado à parte a partir do estágio "builder"
# — assim garantimos a MESMA versão/engine usada no `prisma generate`.
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/.bin/prisma ./node_modules/.bin/prisma

# Script que roda as migrations pendentes e só então inicia o servidor.
COPY --chown=nextjs:nodejs docker/docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "server.js"]