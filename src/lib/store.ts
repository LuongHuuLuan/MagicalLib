import { create } from 'zustand';
import { BookCategory } from './data';

export interface BookData {
  id: string;
  title: string;
  description: string;
  content: string[];
  coverColor: string;
  symbol: string;
  position: [number, number, number];
  rotation: [number, number, number];
  category: BookCategory;
  origin: string;
  moral: string;
}

export interface ReaderSettings {
  fontSize: number; // e.g. 1.0 = base size (rem unit multiplier)
  theme: 'light' | 'sepia' | 'dark';
  fontFamily: 'serif' | 'sans';
}

interface LibraryState {
  books: BookData[];
  selectedBookId: string | null;
  searchQuery: string;
  isReading: boolean;
  hoveredBookId: string | null;
  activeCategory: BookCategory;
  readerSettings: ReaderSettings;
  
  // Actions
  setSearchQuery: (query: string) => void;
  selectBook: (id: string | null) => void;
  setReading: (isReading: boolean) => void;
  setBooks: (books: BookData[]) => void;
  setHoveredBook: (id: string | null) => void;
  setActiveCategory: (category: BookCategory) => void;
  setReaderSettings: (settings: Partial<ReaderSettings>) => void;
}

export const useLibraryStore = create<LibraryState>((set) => ({
  books: [],
  selectedBookId: null,
  searchQuery: '',
  isReading: false,
  hoveredBookId: null,
  activeCategory: 'Tất cả',
  readerSettings: {
    fontSize: 1,
    theme: 'sepia',
    fontFamily: 'serif'
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  selectBook: (id) => set({ selectedBookId: id }),
  setReading: (isReading) => set({ isReading }),
  setBooks: (books) => set({ books }),
  setHoveredBook: (id) => set({ hoveredBookId: id }),
  setActiveCategory: (category) => set({ activeCategory: category }),
  setReaderSettings: (settings) => set((state) => ({ 
    readerSettings: { ...state.readerSettings, ...settings } 
  })),
}));
