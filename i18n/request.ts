import { getRequestConfig } from "next-intl/server";

import en from "../messages/en.json";
import si from "../messages/si.json";


const messages = {
  en,si,
};

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;

  const currentLocale =
    locale && locale in messages ? locale : "en";

  return {
    locale: currentLocale,
    messages: messages[currentLocale as keyof typeof messages],
  };
});
