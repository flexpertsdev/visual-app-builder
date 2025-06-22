import { create } from 'zustand';

export interface ZoomLevel {
  value: number;
  name: string;
  description: string;
  showJourneys: boolean;
  showConnections: boolean;
  showScreenDetails: boolean;
  showFeatures: boolean;
  showComponents: boolean;
}

export const ZOOM_LEVELS: ZoomLevel[] = [
  {
    value: 25,
    name: 'App Overview',
    description: 'Journey map view',
    showJourneys: true,
    showConnections: true,
    showScreenDetails: false,
    showFeatures: false,
    showComponents: false
  },
  {
    value: 50,
    name: 'Screen Flow',
    description: 'Screen connections',
    showJourneys: false,
    showConnections: true,
    showScreenDetails: false,
    showFeatures: false,
    showComponents: false
  },
  {
    value: 100,
    name: 'Screen Detail',
    description: 'Screen content',
    showJourneys: false,
    showConnections: true,
    showScreenDetails: true,
    showFeatures: false,
    showComponents: false
  },
  {
    value: 150,
    name: 'Feature Detail',
    description: 'Features within screens',
    showJourneys: false,
    showConnections: false,
    showScreenDetails: true,
    showFeatures: true,
    showComponents: false
  },
  {
    value: 200,
    name: 'Component Level',
    description: 'UI components',
    showJourneys: false,
    showConnections: false,
    showScreenDetails: true,
    showFeatures: true,
    showComponents: true
  }
];

interface CanvasState {
  zoom: number;
  zoomLevel: ZoomLevel;
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
  getCurrentZoomLevel: () => ZoomLevel;
}

const getZoomLevel = (zoom: number): ZoomLevel => {
  // Find the closest zoom level
  return ZOOM_LEVELS.reduce((prev, curr) => 
    Math.abs(curr.value - zoom) < Math.abs(prev.value - zoom) ? curr : prev
  );
};

export const useCanvasStore = create<CanvasState & CanvasActions>((set, get) => ({
  zoom: 100,
  zoomLevel: ZOOM_LEVELS[2], // Default to Screen Detail
  pan: { x: 0, y: 0 },
  isDragging: false,
  selectedScreenId: null,
  connectionMode: false,
  connectionStart: null,
  
  setZoom: (zoom) => {
    const zoomLevel = getZoomLevel(zoom);
    set({ zoom, zoomLevel });
  },
  setPan: (pan) => set({ pan }),
  setDragging: (isDragging) => set({ isDragging }),
  selectScreen: (selectedScreenId) => set({ selectedScreenId }),
  startConnection: (screenId) => set({ connectionMode: true, connectionStart: screenId }),
  endConnection: () => set({ connectionMode: false, connectionStart: null }),
  getCurrentZoomLevel: () => get().zoomLevel,
}));