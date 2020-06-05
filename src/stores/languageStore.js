import create from "zustand";

const [languageStore] = create((set) => ({
  language: "pt",

  setLanguage: (language) => set(() => ({ language })),
}));

export default languageStore;
