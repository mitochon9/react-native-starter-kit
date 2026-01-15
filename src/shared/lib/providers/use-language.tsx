import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { i18n } from "@/src/shared/config";

type LanguageMode = "ja" | "en";

interface LanguageContextType {
  languageMode: LanguageMode;
  setLanguageMode: (mode: LanguageMode) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "@language_mode";

const supportedLanguages: LanguageMode[] = ["ja", "en"];

const getDefaultLanguage = (): LanguageMode => {
  const deviceLocale = Localization.getLocales()[0]?.languageCode ?? "en";
  return supportedLanguages.includes(deviceLocale as LanguageMode)
    ? (deviceLocale as LanguageMode)
    : "en";
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [languageMode, setLanguageModeState] = useState<LanguageMode>(getDefaultLanguage);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved && supportedLanguages.includes(saved as LanguageMode)) {
        setLanguageModeState(saved as LanguageMode);
      }
      setIsLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (isLoaded) {
      i18n.changeLanguage(languageMode);
    }
  }, [languageMode, isLoaded]);

  const setLanguageMode = useCallback((mode: LanguageMode) => {
    setLanguageModeState(mode);
    AsyncStorage.setItem(STORAGE_KEY, mode);
  }, []);

  return (
    <LanguageContext.Provider value={{ languageMode, setLanguageMode }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
