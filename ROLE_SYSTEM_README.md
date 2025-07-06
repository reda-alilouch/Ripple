# Système de Séparation des Rôles - Auditeurs et Artistes

## Vue d'ensemble

Ce système permet de séparer les utilisateurs en deux rôles distincts :

- **Auditeurs (Listeners)** : Utilisateurs qui écoutent de la musique
- **Artistes (Artists)** : Utilisateurs qui publient leur musique

## Architecture

### 1. Modèles de données

#### Modèle Utilisateur Principal (`src/models/users.js`)

```javascript
{
  name: String,
  email: String,
  password: String,
  provider: String,
  role: "listener" | "artist", // Nouveau champ
  emailVerified: Date,
  image: String,
  bannerImage: String,

  // Profil spécifique aux artistes
  artistProfile: {
    stageName: String,
    bio: String,
    genres: [String],
    socialLinks: Object,
    verified: Boolean,
    monthlyListeners: Number,
    totalStreams: Number
  },

  // Profil spécifique aux auditeurs
  listenerProfile: {
    favoriteGenres: [String],
    totalListeningTime: Number,
    playlistsCreated: Number,
    artistsFollowed: Number
  }
}
```

#### Modèle Artiste Utilisateur (`src/models/ArtistUser.js`)

Modèle étendu pour les artistes avec des fonctionnalités spécifiques :

- Informations artistiques (nom de scène, bio, genres)
- Liens sociaux
- Statistiques (auditeurs mensuels, écoutes totales)
- Albums et titres créés
- Paramètres de l'artiste

#### Modèle Auditeur Utilisateur (`src/models/ListenerUser.js`)

Modèle étendu pour les auditeurs avec :

- Préférences musicales
- Statistiques d'écoute
- Historique d'écoute
- Paramètres de découverte

### 2. API Endpoints

#### `/api/user/role` (GET)

Récupère le rôle actuel de l'utilisateur connecté.

#### `/api/user/role` (POST)

Permet à un utilisateur de choisir son rôle et créer son profil correspondant.

**Corps de la requête :**

```javascript
{
  "role": "artist" | "listener",
  "profileData": {
    // Pour les artistes
    stageName: String,
    bio: String,
    genres: [String],
    socialLinks: Object
    // OU
    // Pour les auditeurs
    favoriteGenres: [String]
  }
}
```

### 3. Composants

#### RoleSelector (`src/components/RoleSelector/RoleSelector.jsx`)

Interface pour permettre aux utilisateurs de choisir leur rôle :

- Sélection entre auditeur et artiste
- Formulaire spécifique selon le rôle choisi
- Validation des données
- Gestion des erreurs

#### ArtistDashboard (`src/components/ArtistDashboard/ArtistDashboard.jsx`)

Tableau de bord complet pour les artistes :

- Statistiques en temps réel
- Gestion des titres et albums
- Analytics détaillées
- Interface de publication

### 4. Intégration dans le Profil

Le composant `ProfilClient` a été modifié pour :

- Détecter automatiquement le rôle de l'utilisateur
- Afficher le tableau de bord artiste si l'utilisateur est un artiste
- Afficher le profil normal si l'utilisateur est un auditeur
- Permettre aux auditeurs de devenir artistes

## Fonctionnalités par Rôle

### Auditeurs (Listeners)

- ✅ Écouter de la musique
- ✅ Créer des playlists
- ✅ Suivre des artistes
- ✅ Historique d'écoute
- ✅ Statistiques personnelles
- ✅ Découverte de nouveaux artistes
- 🔄 Devenir artiste (optionnel)

### Artistes (Artists)

- ✅ Publier des titres
- ✅ Créer des albums
- ✅ Tableau de bord avec analytics
- ✅ Statistiques d'audience
- ✅ Gestion du profil artiste
- ✅ Liens sociaux
- ✅ Vérification du compte

## Flux d'Utilisation

### 1. Inscription

1. L'utilisateur s'inscrit normalement
2. Par défaut, il est assigné au rôle "listener"

### 2. Choix du Rôle

1. L'utilisateur accède à son profil
2. S'il n'a pas encore défini son rôle, le sélecteur s'affiche automatiquement
3. Il peut choisir de rester auditeur ou devenir artiste

### 3. Création du Profil

1. Selon le rôle choisi, un formulaire spécifique s'affiche
2. Pour les artistes : nom de scène, bio, genres, liens sociaux
3. Pour les auditeurs : genres préférés

### 4. Interface Spécifique

1. Les artistes voient le tableau de bord artiste
2. Les auditeurs voient le profil normal
3. Les auditeurs peuvent toujours devenir artistes plus tard

## Sécurité et Validation

### Validation des Données

- Vérification de l'unicité du nom de scène
- Validation des genres musicaux
- Contrôle des URLs des liens sociaux

### Permissions

- Seuls les utilisateurs connectés peuvent changer de rôle
- Un utilisateur ne peut changer de rôle qu'une seule fois
- Les artistes ne peuvent pas redevenir auditeurs

### Protection des Routes

- Vérification du rôle pour accéder aux fonctionnalités spécifiques
- Redirection automatique selon le rôle

## Évolutions Futures

### Fonctionnalités Planifiées

- [ ] Système de vérification des artistes
- [ ] Analytics avancées avec graphiques
- [ ] Système de messagerie entre artistes et auditeurs
- [ ] Collaboration entre artistes
- [ ] Système de recommandations personnalisées
- [ ] API pour les applications tierces

### Améliorations Techniques

- [ ] Cache Redis pour les statistiques
- [ ] WebSockets pour les mises à jour en temps réel
- [ ] Système de notifications push
- [ ] Optimisation des requêtes MongoDB
- [ ] Tests automatisés complets

## Utilisation

### Pour les Développeurs

1. **Vérifier le rôle d'un utilisateur :**

```javascript
const user = await User.findById(userId);
if (user.isArtist()) {
  // Logique pour les artistes
} else if (user.isListener()) {
  // Logique pour les auditeurs
}
```

2. **Créer un profil artiste :**

```javascript
const artistProfile = new ArtistUser({
  userId: user._id,
  stageName: "Mon Nom de Scène",
  bio: "Ma biographie",
  genres: ["Pop", "Rock"],
  socialLinks: {
    spotify: "https://spotify.com/...",
    instagram: "https://instagram.com/...",
  },
});
```

3. **Créer un profil auditeur :**

```javascript
const listenerProfile = new ListenerUser({
  userId: user._id,
  favoriteGenres: ["Pop", "Hip-Hop"],
  totalListeningTime: 0,
});
```

### Pour les Utilisateurs

1. **Devenir Artiste :**

   - Aller sur son profil
   - Cliquer sur "Devenir Artiste"
   - Remplir le formulaire avec les informations requises
   - Valider la création du profil

2. **Utiliser le Tableau de Bord Artiste :**
   - Accéder aux statistiques
   - Publier de nouveaux titres
   - Gérer les albums existants
   - Consulter les analytics

## Support

Pour toute question ou problème lié au système de rôles, consultez :

- La documentation des modèles MongoDB
- Les logs d'erreur de l'API
- Les tests unitaires pour les cas d'usage
