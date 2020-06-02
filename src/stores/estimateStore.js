import create from "zustand";

const [estimateStore] = create((set) => ({
  taxPercentage: 0.23,
  estimateItems: [],
  setTaxPercentage: (taxPercentage) => set(() => ({ taxPercentage })),
  addEstimateItem: (estimadeItem) =>
    set((state) => {
      let estimateItemsCopy = [...state.estimateItems];
      estimateItemsCopy.unshift(estimadeItem);

      return { estimateItems: estimateItemsCopy };
    }),
  removeEstimateItem: (i) =>
    set((state) => {
      let estimateItemsCopy = [...state.estimateItems];
      estimateItemsCopy.splice(i, 1);
      return { estimateItems: estimateItemsCopy };
    }),
}));

export default estimateStore;
