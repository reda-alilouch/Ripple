# Rapport du Projet Ripple

## 1. Introduction
Ripple est une plateforme musicale web moderne permettant aux utilisateurs d’écouter de la musique, de gérer des playlists, de suivre des artistes, et aux artistes de publier leurs œuvres. Le projet met l’accent sur l’authentification (Google, email), la gestion des rôles (auditeur/artiste), l’intégration Spotify, et une expérience utilisateur soignée et responsive.

---

## 2. Objectif du projet
- Offrir une expérience musicale personnalisée et interactive.
- Permettre aux artistes de publier et gérer leur musique.
- Proposer aux auditeurs des outils de découverte, de suivi et de statistiques.
- Intégrer des services externes (Spotify, Google Auth).
- Garantir une interface moderne, accessible et responsive.

---

## 3. Technologies, frameworks et outils

### Frontend
- **Next.js 15** : Framework React pour le SSR/SSG, App Router, gestion des pages et API.
- **React 19** : Bibliothèque principale pour l’UI.
- **Tailwind CSS** : Framework CSS utilitaire pour un design rapide et responsive.
- **CSS Modules** : Isolation des styles par composant.
- **Font Awesome & Boxicons** : Bibliothèques d’icônes.
- **Swiper & Splide** : Carrousels et sliders interactifs.
- **i18next** : Internationalisation (français/anglais).
- **next-themes** : Gestion du dark mode.

### Backend & API
- **Next.js API routes** : Endpoints backend intégrés.
- **MongoDB & Mongoose** : Base de données NoSQL, ODM pour la gestion des modèles.
- **Express** : Utilisé pour certains scripts ou endpoints spécifiques.
- **dotenv** : Gestion des variables d’environnement.

### Authentification & Sécurité
- **next-auth** : Authentification (Google, credentials).
- **@auth/mongodb-adapter** : Stockage des sessions et utilisateurs dans MongoDB.
- **bcrypt/bcryptjs** : Hashage des mots de passe.
- **jsonwebtoken** : Gestion des tokens JWT.

### Intégration Spotify
- **spotify-web-api-node** : Récupération de données Spotify (albums, artistes, playlists).

### Outils de développement
- **ESLint** : Linting du code.
- **PostCSS, Autoprefixer** : Traitement CSS.
- **Scripts custom** : Synchronisation Spotify, gestion des rôles, etc.

---

## 4. UI/UX & Responsive Design

- **Design moderne** : Utilisation de la couleur principale #ff4545, glassmorphism, ombres, bordures subtiles.
- **Responsive** : Layouts adaptatifs pour mobile, tablette, desktop.
- **Accessibilité** : Contraste élevé, navigation clavier, alt text, focus visible.
- **Animations** : Transitions fluides, effets au survol, transformations.
- **Composants réutilisables** : Modal, carrousels, listes, sélecteurs de rôle, etc.
- **Dark mode** : Support natif via next-themes.

---

## 5. Dépendances principales (`package.json`)

**Production :**
- `next`, `react`, `react-dom`, `next-auth`, `@auth/mongodb-adapter`, `mongoose`, `mongodb`, `axios`, `i18next`, `react-i18next`, `i18next-http-backend`, `i18next-browser-languagedetector`, `next-themes`, `swiper`, `@splidejs/react-splide`, `@splidejs/splide`, `boxicons`, `lucide-react`, `bcrypt`, `bcryptjs`, `jsonwebtoken`, `dotenv`, `express`, `google-auth-library`, `spotify-web-api-node`, `accept-language`, `node-fetch`, etc.

**Développement :**
- `eslint`, `eslint-config-next`, `@eslint/eslintrc`, `tailwindcss`, `postcss`, `autoprefixer`, `@tailwindcss/postcss`.

---

## 6. Problèmes rencontrés & solutions

- **Connexion MongoDB manquante** : Erreur bloquante si la variable d’environnement `MONGODB_URI` n’est pas définie.  
  _Solution :_ Ajout d’un contrôle strict et documentation pour l’utilisateur.
- **Séparation des rôles utilisateur** : Complexité pour gérer deux profils (auditeur/artiste).  
  _Solution :_ Modèles de données distincts, sélecteur de rôle, logique conditionnelle dans le profil.
- **Responsive design** : Adaptation de l’UI à tous les écrans.  
  _Solution :_ Utilisation de Tailwind CSS, media queries, tests sur différents devices.
- **Internationalisation** : Gestion multilingue.  
  _Solution :_ i18next, fichiers de traduction, détection automatique de la langue.
- **Sécurité des mots de passe** :  
  _Solution :_ Hashage avec bcrypt, validation côté serveur.
- **Intégration Spotify** : API parfois instable ou limitée.  
  _Solution :_ Gestion des erreurs, fallback, synchronisation régulière via scripts.

---

## 7. Structure du projet

- **Pages** : Organisation par langue, modules (albums, artistes, playlists, profil…)
- **API** : Endpoints RESTful pour albums, artistes, playlists, titres, utilisateurs, etc.
- **Composants** : Réutilisables, organisés par fonctionnalité.
- **Modèles** : Mongoose pour MongoDB (utilisateurs, artistes, albums, titres, playlists…)

---

## 8. Conclusion

Ripple est une plateforme musicale complète, moderne et évolutive, intégrant les meilleures pratiques de développement web (Next.js, React, MongoDB, Tailwind CSS, i18next, etc.), une gestion fine des rôles, une UI/UX soignée et responsive, et une architecture modulaire.  
Le projet est prêt pour des évolutions futures : analytics avancées, notifications, recommandations, etc.
