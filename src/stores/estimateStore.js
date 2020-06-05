import create from "zustand";

const [estimateStore] = create((set) => ({
  taxPercentage: 0.23,
  index: null,
  estimateItems: [],
  currentInput: {
    quantity: "",
    metric: "",
    metricPrice: "",
    workDescription: "",
  },
  setCurrentInput: (quantity, metric, metricPrice, workDescription) =>
    set(({ currentInput }) => {
      return {
        currentInput: {
          quantity,
          metric,
          metricPrice,
          workDescription,
        },
      };
    }),
  resetCurrentInput: () =>
    set(({ currentInput }) => {
      return {
        currentInput: {
          quantity: "",
          metric: "",
          metricPrice: "",
          workDescription: "",
        },
      };
    }),
  setIndex: (i) => set((state) => ({ index: i })),
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
  changeEstimateItem: (i, item) =>
    set((state) => {
      let estimateItemsCopy = [...state.estimateItems];
      estimateItemsCopy[i] = {
        ...item,
      };

      return { estimateItems: estimateItemsCopy };
    }),
}));

export default estimateStore;
