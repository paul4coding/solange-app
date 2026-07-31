# Solange's Hair Braiding — Site Web

Site web professionnel pour Solange's Hair Braiding LLC, Glen Burnie MD.

**Stack :** Next.js 16 · MySQL 8 · Cloudinary

---

## Déploiement A — Docker (recommandé)

Tout est fourni : le site et sa base MySQL démarrent ensemble, et la base
est créée et remplie automatiquement au premier lancement.

**Prérequis :** Docker et Docker Compose.

```bash
cp .env.docker.example .env
```

Ouvrir `.env` et remplir au minimum `DB_ROOT_PASSWORD`, `DB_USER`,
`DB_PASSWORD`, `ADMIN_PASSWORD` et `JWT_SECRET`. Puis :

```bash
docker compose up -d --build
```

Le site est sur http://localhost:3000 et l'admin sur http://localhost:3000/admin.

| Commande | Effet |
|----------|-------|
| `docker compose logs -f app` | Suivre les logs du site |
| `docker compose ps` | État des conteneurs |
| `docker compose restart app` | Redémarrer le site |
| `docker compose down` | Arrêter (les données sont conservées) |
| `docker compose down -v` | Arrêter **et effacer la base** |

> Le schéma et les données ne sont importés qu'à la **création** du volume.
> Pour repartir de zéro : `docker compose down -v && docker compose up -d`.

Pour changer le port : mettre `APP_PORT=8080` dans `.env`.

---

## Déploiement B — installation classique, 4 étapes

### Prérequis
- Node.js 20+
- MySQL 8 (base de données fournie par l'hébergeur ou locale)

### 1. Configurer les variables d'environnement
Renommer `.env.superviseur` en `.env.local`, puis remplir :
```
DB_HOST=...        ← hôte MySQL (localhost ou celui de l'hébergeur)
DB_NAME=...        ← nom de la base
DB_USER=...        ← utilisateur MySQL
DB_PASSWORD=...    ← mot de passe MySQL
ADMIN_PASSWORD=... ← mot de passe de l'interface admin
JWT_SECRET=...     ← chaîne aléatoire longue (32+ caractères)
```
> Tout le reste (Cloudinary, APIs images) est déjà configuré.

### 2. Créer la base de données
Importer les 2 fichiers SQL dans MySQL, **dans cet ordre** (via phpMyAdmin, MySQL Workbench ou la ligne de commande) :

```bash
mysql -u UTILISATEUR -p NOM_DE_LA_BASE < mysql-schema.sql   # 1. structure (5 tables)
mysql -u UTILISATEUR -p NOM_DE_LA_BASE < mysql-seed.sql     # 2. données (13 services + 6 avis + 147 photos)
```

### 3. Installer et builder
```bash
npm install
npm run build
```

### 4. Lancer
```bash
npm start        # démarre sur le port 3000
```
> Pour un autre port : `npm start -- -p 8080`
> En production, utiliser un process manager type **PM2** : `pm2 start npm --name solange -- start`

| URL | Description |
|-----|-------------|
| `http://localhost:3000` | Site public |
| `http://localhost:3000/admin` | Espace admin |

**Identifiants admin :** `ADMIN_USERNAME` / `ADMIN_PASSWORD` définis dans `.env.local`

---

## Développement local

```bash
npm install
npm run dev   # nécessite MySQL local + .env.local configuré
```

---

## Scripts utiles

| Commande | Description |
|----------|-------------|
| `npm run export-seed` | Exporter les images MySQL vers mysql-seed.sql |
| `npm run test` | Suite de tests fonctionnels (site + admin + API + base) |

### Tests

`npm run test` lance `scripts/smoke-test.mjs` contre un serveur déjà démarré :
pages publiques, protection de l'admin, authentification des routes API,
intégrité de la base, cycle de vie des réservations et des messages.

```bash
npm run test                          # cible http://localhost:3000
npm run test -- http://localhost:8080 # autre adresse
```

Les données créées pendant les tests sont préfixées `ZZTEST` et supprimées à la
fin. **Aucun email n'est envoyé** : la suite passe par les routes API et la base,
jamais par les formulaires publics qui déclenchent Resend.

---

## Structure

```
app/
  admin/           → Espace admin (protégé par JWT)
  booking/         → Formulaire de réservation
  gallery/         → Galerie filtrée par catégorie
  services/[slug]/ → Pages services dynamiques
lib/
  db.ts            → Pool de connexion MySQL
  auth.ts          → Sessions JWT (cookie httpOnly)
middleware.ts      → Protection automatique /admin/*
mysql-schema.sql   → Structure de la base
mysql-seed.sql     → Données initiales (services + images + reviews)
.env.superviseur   → Template à renommer en .env.local (installation classique)

Dockerfile            → Image de production (build multi-étapes, non-root)
docker-compose.yml    → Pile complète : site + MySQL
.env.docker.example   → Template à copier en .env (Docker)
scripts/smoke-test.mjs → Suite de tests fonctionnels
```
