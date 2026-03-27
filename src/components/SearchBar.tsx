'use client';

import { useLibraryStore } from '@/lib/store';
import { CATEGORIES } from '@/lib/data';
import { Search, X } from 'lucide-react';
import { useState } from 'react';

export default function SearchBar() {
  const books = useLibraryStore((state) => state.books);
  const selectBook = useLibraryStore((state) => state.selectBook);
  const searchQuery = useLibraryStore((state) => state.searchQuery);
  const setSearchQuery = useLibraryStore((state) => state.setSearchQuery);
  const activeCategory = useLibraryStore((state) => state.activeCategory);
  const setActiveCategory = useLibraryStore((state) => state.setActiveCategory);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-6 transition-all duration-500 ${isFocused ? 'scale-105' : 'scale-100'}`}>
      <div className={`relative group backdrop-blur-xl rounded-2xl p-[1px] transition-all duration-500 ${isFocused ? 'bg-gradient-to-r from-amber-500/50 via-green-600/50 to-amber-500/50 shadow-[0_0_30px_rgba(255,191,0,0.3)]' : 'bg-white/10 shadow-lg'}`}>
        <div className="bg-[#020502]/80 rounded-[15px] flex items-center px-4 py-3">
          <Search className={`w-5 h-5 mr-3 transition-colors duration-300 ${isFocused ? 'text-amber-400' : 'text-green-300/50'}`} />
          
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchQuery.trim() !== '') {
                const match = books.find(b => b.title.toLowerCase().includes(searchQuery.toLowerCase()));
                if (match) selectBook(match.id);
              }
            }}
            placeholder="Tìm kiếm những cuốn thư tịch cổ..."
            className="bg-transparent border-none outline-none text-amber-50 w-full font-serif placeholder:text-green-300/30 text-lg selection:bg-amber-500/30"
          />

          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="ml-2 p-1 hover:bg-white/5 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-amber-300/50 hover:text-amber-200" />
            </button>
          )}
        </div>
        
        {/* Animated border line */}
        <div className={`h-[1px] w-0 bg-gradient-to-r from-transparent via-amber-400 to-transparent absolute bottom-0 left-0 transition-all duration-700 ${isFocused ? 'w-full opacity-100' : 'opacity-0'}`} />
      </div>
      
      {/* Search results hint */}
      {searchQuery && (
        <div className="mt-4 text-center">
          <p className="text-amber-300/40 text-xs font-serif italic tracking-[0.2em] uppercase animate-pulse">
            Đang lắng nghe từ cội rễ...
          </p>
        </div>
      )}

      {/* Category Filter Pills */}
      <div className={`mt-4 flex flex-wrap justify-center gap-2 transition-all duration-700 ${isFocused || searchQuery ? 'opacity-100 translate-y-0' : 'opacity-80'}`}>
        {CATEGORIES.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-1.5 rounded-full text-xs font-serif uppercase tracking-widest transition-all ${
              activeCategory === category 
                ? 'bg-amber-600/30 text-amber-200 border border-amber-500/50 shadow-[0_0_10px_rgba(255,191,0,0.2)]' 
                : 'bg-black/40 text-amber-500/50 hover:bg-black/60 hover:text-amber-400 border border-amber-900/30 hover:border-amber-700/50'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
