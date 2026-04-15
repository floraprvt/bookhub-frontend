# BookHub – Frontend Angular

Plateforme web de gestion de bibliothèque communautaire développée dans le cadre de la préparation pour le titre de **CDA**.

---

## Stack technique

| Technologie | Version |
|---|---|
| Angular | 21.2.0 |
| TypeScript | 5.9.x |
| Tailwind CSS | 4.1.12 |
| Chart.js | 4.5.1 |
| RxJS | 7.8.0 |
| Vitest | 4.0.8 |
| Node / npm | — / 11.11.0 |

---

## Prérequis

- Node.js ≥ 18
- npm ≥ 9
- Angular CLI : `npm install -g @angular/cli`
- Backend BookHub démarré sur `http://localhost:8080`

---

## Installation et lancement

```bash
# Cloner le dépôt
git clone <url-du-repo>
cd bookhub-frontend

# Installer les dépendances
npm install

# Lancer en développement
npm start
```

L'application est accessible sur `http://localhost:4200`.

---

## Structure du projet

```
src/
├── app/
│   ├── components/
│   │   ├── cards/            # Carte livre (catalogue)
│   │   ├── detail-book/      # Page détail d'un livre + notations
│   │   ├── edit-user/        # Modification du rôle d'un utilisateur
│   │   └── header/           # Barre de navigation + notifications
│   ├── guards/
│   │   ├── auth.guard.ts     # Vérifie l'authentification
│   │   ├── librarian.guard.ts # Accès LIBRARIAN ou ADMIN
│   │   └── admin.guard.ts    # Accès ADMIN uniquement
│   ├── interceptors/
│   │   └── auth.interceptor.ts # Injection du token JWT (Bearer)
│   ├── interface/
│   │   └── index.ts          # Interfaces TypeScript partagées
│   ├── models/
│   │   └── user.ts           # Type User et Registered
│   ├── services/
│   │   ├── auth.ts           # Authentification, profil, mot de passe
│   │   ├── book.ts           # Catalogue, recherche, notations
│   │   ├── loan.ts           # Emprunts
│   │   ├── author.ts         # Auteurs
│   │   ├── category.ts       # Catégories
│   │   └── notification.ts   # Notifications
│   └── app.routes.ts         # Définition des routes
└── pages/
    ├── home/                 # Catalogue avec recherche et filtres
    ├── login/                # Connexion
    ├── register/             # Inscription
    ├── profil/               # Profil, emprunts, réservations, mot de passe
    ├── librarian-dashboard/  # Tableau de bord bibliothécaire
    ├── catalog-management/   # Gestion CRUD du catalogue (livres)
    ├── returns-management/   # Gestion des retours
    └── admin/                # Gestion des utilisateurs et rôles
```

---

## Routes

| Chemin | Composant | Accès |
|---|---|---|
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/` | Home | Authentifié |
| `/detail-book/:id` | DetailBook | Authentifié |
| `/profil` | Profil | Authentifié |
| `/librarian` | LibrarianDashboard | Librarian / Admin |
| `/returns-management` | ReturnsManagement | Librarian / Admin |
| `/catalogue-management` | CatalogManagement | Librarian / Admin |
| `/admin` | AdminDashboard | Admin |
| `/admin/edit-user/:id` | EditUser | Admin |

---

## Authentification

- Token JWT stocké dans le `localStorage` sous la clé `currentUser`
- L'intercepteur `authInterceptor` injecte automatiquement le header `Authorization: Bearer <token>` sur toutes les requêtes
- Trois rôles : `USER`, `LIBRARIAN`, `ADMIN`

---

## Fonctionnalités implémentées

### Authentification
- Inscription avec validation (email, prénom, nom, téléphone optionnel)
- Connexion par email/mot de passe
- Gestion du profil (modification prénom/nom/téléphone)
- Changement de mot de passe
- Suppression de compte

### Catalogue
- Liste paginée des livres avec recherche multicritère (titre, auteur, catégorie, ISBN, date, disponibilité)
- Fiche détaillée d'un livre
- CRUD complet (bibliothécaire/admin) : ajout, modification, suppression

### Notations
- Ajout d'une note (1 à 5 étoiles) + commentaire
- Modification de sa propre note
- Suppression de n'importe quel commentaire (bibliothécaire/admin)
- Note moyenne calculée et affichée

### Emprunts & Retours
- Enregistrement des retours (bibliothécaire)
- Tableau de bord bibliothécaire : emprunts actifs, retards, top 10 livres, graphique

### Administration
- Liste de tous les utilisateurs avec recherche
- Modification du rôle d'un utilisateur (USER / LIBRARIAN / ADMIN)

### Notifications
- Badge rouge sur la cloche si notifications non lues
- Dropdown avec la liste des messages au clic
- Marquage automatique comme lues à l'ouverture

---

## API Backend

L'URL de base est configurée directement dans les services : `http://localhost:8080`

Principaux endpoints utilisés :

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/users/me
PUT    /api/users/me
PUT    /api/users/me/password
DELETE /api/users/me
GET    /api/users
GET    /api/users/{id}
PUT    /api/users/{id}/role

GET    /api/books
GET    /api/books/{id}
GET    /api/books/search
POST   /api/books
PUT    /api/books
DELETE /api/books/{id}

GET    /api/ratings/book/{bookId}
POST   /api/ratings/book/{bookId}
PUT    /api/ratings/{id}
DELETE /api/ratings/{id}

GET    /api/loans
GET    /api/loans/my
PUT    /api/loans/{id}/return
GET    /api/loans/stats
GET    /api/loans/overdue
GET    /api/loans/top10

GET    /api/notifications
PUT    /api/notifications/read

GET    /api/authors
GET    /api/categories
```

---

## Tests

Les tests utilisent **Vitest** avec `jsdom`.

```bash
# Lancer les tests
npm test

# Avec couverture de code
npm test -- --coverage
```

---

## Build de production

```bash
npm run build
```

Les fichiers générés se trouvent dans le dossier `dist/`.
