import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
	lng: "fr",
	resources: {
		fr: (await import("#/libs/i18n/build/fr.json")).default,
	},
	interpolation: {
		escapeValue: false,
	},
});

export default i18n;
