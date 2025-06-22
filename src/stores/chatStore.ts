import { create } from 'zustand';
import { ChatMessage } from '../types/ai';

interface ChatState {
  messages: ChatMessage[];
  isOpen: boolean;
  isTyping: boolean;
}

interface ChatActions {
  addMessage: (message: ChatMessage) => void;
  toggleChat: () => void;
  setTyping: (isTyping: boolean) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState & ChatActions>((set) => ({
  messages: [],
  isOpen: true,
  isTyping: false,
  
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),
  
  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
  setTyping: (isTyping) => set({ isTyping }),
  clearMessages: () => set({ messages: [] })
}));