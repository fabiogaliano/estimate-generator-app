import create from "zustand";

const [clientStore] = create((set) => ({
  client: null,
  setClient: (client) => set(() => ({ client })),
  removeClient: () => set(() => ({ client: null })),
}));

export default clientStore;
