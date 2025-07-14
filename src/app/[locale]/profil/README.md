# Page de Profil - Ripple

## Description

La page de profil est une interface moderne et interactive qui permet aux utilisateurs de visualiser et gérer leur profil musical. Elle comprend plusieurs sections organisées en onglets pour une navigation fluide.

## Fonctionnalités

### 🎨 Design

- **Banner unie** : Couleur #ff4545 avec effet moderne
- **Photo de profil** : Image circulaire avec bouton de modification
- **Interface glassmorphism** : Effet de verre dépoli avec backdrop-blur
- **Design responsive** : Adapté aux mobiles et tablettes

### 📊 Sections principales

#### 1. **Historique d'écoute**

- Liste des titres récemment écoutés
- Informations sur l'artiste et l'album
- Horodatage de l'écoute
- Bouton de lecture pour chaque titre

#### 2. **Mes Playlists**

- Affichage en grille des playlists créées
- Nombre de titres par playlist
- Images de couverture

#### 3. **Artistes Favoris**

- Liste des artistes préférés
- Photos de profil des artistes
- Nombre d'abonnés

#### 4. **Statistiques**

- **Top Genres** : Graphiques en barres des genres préférés
- **Activité récente** : Temps d'écoute par période
- **Métriques globales** : Nombre d'écoutes, heures, artistes, playlists

### 🎯 Statistiques affichées

- **Total d'écoutes** : Nombre total de titres écoutés
- **Heures d'écoute** : Temps total passé à écouter
- **Artistes découverts** : Nombre d'artistes différents écoutés
- **Playlists créées** : Nombre de playlists personnelles

## Structure des fichiers

```
profil/
├── page.js              # Page principale (Server Component)
├── ProfilClient.jsx     # Composant client avec logique interactive
├── profil.module.css    # Styles CSS modules
└── README.md           # Documentation
```

## Technologies utilisées

- **Next.js 14** : Framework React avec App Router
- **Tailwind CSS** : Framework CSS utilitaire
- **CSS Modules** : Styles modulaires pour l'isolation
- **Font Awesome** : Icônes via le composant Icon
- **Next/Image** : Optimisation des images

## Composants utilisés

- `Icon` : Composant d'icônes Font Awesome
- `Image` : Composant Next.js pour l'optimisation d'images

## Données

### Données utilisateur

- Informations de session NextAuth
- Données utilisateur depuis MongoDB
- Photo de profil (Google Auth ou défaut)

### Données fictives (pour la démo)

- Historique d'écoute
- Playlists créées
- Artistes favoris
- Statistiques d'écoute

## Responsive Design

- **Mobile** : Layout en colonne, taille réduite des éléments
- **Tablet** : Layout hybride avec grilles adaptatives
- **Desktop** : Layout complet avec toutes les fonctionnalités

## Animations

- **Banner unie** : Banner avec couleur #ff4545
- **Hover effects** : Effets au survol des cartes et boutons
- **Transitions** : Animations fluides entre les états
- **Transformations** : Effets de scale et translate

## Accessibilité

- **Contraste** : Couleurs avec bon contraste pour la lisibilité
- **Navigation** : Onglets accessibles au clavier
- **Images** : Alt text pour toutes les images
- **Focus** : Indicateurs de focus visibles

## Personnalisation

### Couleurs

Les couleurs principales sont définies dans `profil.module.css` :

- **Primary** : #ff4545 (rouge vif)
- **Background** : #1a1a1a (noir profond)
- **Accents** : Blanc et gris avec transparence

### Styles

- **Glassmorphism** : Effet de verre avec backdrop-blur
- **Couleur unie** : #ff4545 comme couleur principale
- **Shadows** : Ombres portées pour la profondeur
- **Borders** : Bordures subtiles avec transparence

## Évolutions futures

- [ ] Intégration avec l'API Spotify pour les vraies données
- [ ] Fonctionnalité de modification de profil
- [ ] Partage de profil sur les réseaux sociaux
- [ ] Export des statistiques
- [ ] Comparaison avec d'autres utilisateurs
- [ ] Recommandations personnalisées
