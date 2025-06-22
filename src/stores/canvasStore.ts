import { create } from 'zustand';

interface CanvasState {
  zoom: number;
  pan: { x: number; y: number };
  isDragging: boolean;
  selectedScreenId: string | null;
  connectionMode: boolean;
  connectionStart: string | null;
}

interface CanvasActions {
  setZoom: (zoom: number) => void;
  setPan: (pan: { x: number; y: number }) => void;
  setDragging: (isDragging: boolean) => void;
  selectScreen: (screenId: string | null) => void;
  startConnection: (screenId: string) => void;
  endConnection: () => void;
}

export const useCanvasStore = create<CanvasState & CanvasActions>((set) => ({
  zoom: 100,
  pan: { x: 0, y: 0 },
  isDragging: false,
  selectedScreenId: null,
  connectionMode: false,
  connectionStart: null,
  
  setZoom: (zoom) => set({ zoom }),
  setPan: (pan) => set({ pan }),
  setDragging: (isDragging) => set({ isDragging }),
  selectScreen: (selectedScreenId) => set({ selectedScreenId }),
  startConnection: (screenId) => set({ connectionMode: true, connectionStart: screenId }),
  endConnection: () => set({ connectionMode: false, connectionStart: null }),
}));