"use client";

import { createContext, useContext, type ReactNode } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Dictionary = Record<string, any>;

const I18nContext = createContext<Dictionary>({});

export function I18nProvider({
  dict,
  children,
}: {
  dict: Dictionary;
  children: ReactNode;
}) {
  return <I18nContext.Provider value={dict}>{children}</I18nContext.Provider>;
}

export function useTranslation() {
  const dict = useContext(I18nContext);
  if (!dict || Object.keys(dict).length === 0) {
    console.warn("useTranslation() called outside I18nProvider");
  }
  return dict;
}
