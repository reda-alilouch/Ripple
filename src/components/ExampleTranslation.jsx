"use client";
import { useTranslation } from "next-i18next";

export default function ExampleTranslation() {
  const { t } = useTranslation(["common", "auth", "messages"]);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">
        Exemple d'utilisation des traductions
      </h2>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Navigation :</h3>
        <p>Accueil : {t("common:home")}</p>
        <p>Rechercher : {t("common:search")}</p>
        <p>Profil : {t("common:profile")}</p>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Authentification :</h3>
        <p>Se connecter : {t("auth:signin")}</p>
        <p>S'inscrire : {t("auth:signup")}</p>
        <p>Email : {t("auth:email")}</p>
        <p>Mot de passe : {t("auth:password")}</p>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Messages :</h3>
        <p>Chargement : {t("messages:loading")}</p>
        <p>Erreur : {t("messages:error")}</p>
        <p>Succès : {t("messages:success")}</p>
      </div>
    </div>
  );
}
