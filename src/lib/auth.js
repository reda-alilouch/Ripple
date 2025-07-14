import bcrypt from "bcryptjs";

/**
 * Hasher un mot de passe
 * @param {string} password - Le mot de passe à hasher
 * @returns {Promise<string>} - Le mot de passe hashé
 */
export async function hashPassword(password) {
  try {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    throw new Error("Erreur lors du hashage du mot de passe");
  }
}

/**
 * Comparer un mot de passe avec son hash
 * @param {string} password - Le mot de passe en clair
 * @param {string} hashedPassword - Le mot de passe hashé
 * @returns {Promise<boolean>} - True si les mots de passe correspondent
 */
export async function comparePassword(password, hashedPassword) {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    throw new Error("Erreur lors de la vérification du mot de passe");
  }
}

/**
 * Valider le format d'un email
 * @param {string} email - L'email à valider
 * @returns {boolean} - True si l'email est valide
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valider la force d'un mot de passe
 * @param {string} password - Le mot de passe à valider
 * @returns {object} - Objet contenant la validité et les erreurs
 */
export function validatePassword(password) {
  const errors = [];

  if (!password) {
    errors.push("Le mot de passe est requis");
  } else {
    if (password.length < 6) {
      errors.push("Le mot de passe doit contenir au moins 6 caractères");
    }
    if (password.length > 100) {
      errors.push("Le mot de passe ne peut pas dépasser 100 caractères");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
