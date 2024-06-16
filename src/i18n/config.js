import { I18n } from 'i18n-js';

import english_translations from "./locales/en/translations.json";
import french_translations from "./locales/fr/translations.json";

// Set the key-value pairs for the different languages you want to support.
const translations = {
    en: english_translations,
    fr: french_translations,
};

const i18n = new I18n(translations);

// Set the locale once at the beginning of your app.
i18n.locale = 'en';

// When a value is missing from a language it'll fallback to another language with the key present.
i18n.enableFallback = true;
// To see the fallback mechanism uncomment line below to force app to use French language.
// i18n.locale = 'fr';

function translate(text){
    return i18n.t(text);
}

export {translate, i18n};