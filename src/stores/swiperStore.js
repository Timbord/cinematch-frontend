import { create } from 'zustand';

export const useSwipeStore = create((set) => ({
  dataIndex: 0,
  setDataIndex: (index) => set(() => ({ dataIndex: index })),
}));
