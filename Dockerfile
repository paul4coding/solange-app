# ============================================================
#  Solange's Hair Braiding — image de production
#  Build multi-étapes : seul le strict nécessaire arrive dans l'image finale.
# ============================================================

# ── 1. Dépendances ──────────────────────────────────────────
FROM node:22-alpine AS deps
WORKDIR /app
# libc6-compat : requis par certaines dépendances natives (dont sharp,
# utilisé par l'optimisation d'images de Next.js) sur base Alpine/musl.
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci

# ── 2. Build ────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Toutes les pages sont en rendu dynamique : le build n'a pas besoin
# d'accéder à MySQL. Les valeurs ci-dessous ne servent qu'à satisfaire
# l'initialisation du pool, elles ne sont jamais utilisées ici.
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ── 3. Exécution ────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app
RUN apk add --no-cache libc6-compat

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Utilisateur non-root
RUN addgroup -g 1001 -S nodejs && adduser -u 1001 -S nextjs -G nodejs

# La sortie standalone embarque déjà server.js et ses dépendances
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
