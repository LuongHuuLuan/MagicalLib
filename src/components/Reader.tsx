'use client';

import { useLibraryStore } from '@/lib/store';
import { audioSystem } from '@/lib/audio';
import { ChevronLeft, ChevronRight, X, ArrowLeftToLine, ArrowRightToLine, List } from 'lucide-react';
import { useState, useEffect } from 'react';
import gsap from 'gsap';

export default function Reader() {
  const selectedBookId = useLibraryStore((state) => state.selectedBookId);
  const selectBook = useLibraryStore((state) => state.selectBook);
  const books = useLibraryStore((state) => state.books);

  const [currentPage, setCurrentPage] = useState(0);
  const [flipState, setFlipState] = useState<{ dir: 'next'|'prev', page: number } | null>(null);
  const [showList, setShowList] = useState(false);

  const currentIndex = books.findIndex(b => b.id === selectedBookId);
  const book = books[currentIndex];

  const prevBookId = currentIndex > 0 ? books[currentIndex - 1].id : null;
  const nextBookId = currentIndex < books.length - 1 ? books[currentIndex + 1].id : null;

  // Find all books under the same parent tale title
  const baseTitle = book.title.split(' (Bản')[0];
  const seriesBooks = books.filter(b => b.title.startsWith(baseTitle));

  useEffect(() => {
    if (book) {
      setCurrentPage(0);
      setFlipState(null);
      setShowList(false);
      
      // Delay to let the physical 3D book fly up and open its cover!
      gsap.fromTo('.reader-container', 
        { autoAlpha: 0, scale: 0.9, y: 50 },
        { 
          autoAlpha: 1, 
          scale: 1, 
          y: 0, 
          duration: 0.8, 
          delay: 1.2, 
          ease: 'power3.out', 
          clearProps: 'all',
          onStart: () => audioSystem.playSFX('open')
        }
      );
    }
  }, [book?.id]);

  if (!book) return null;

  const nextPage = () => {
    if (currentPage < book.content.length - 2 && !flipState) {
      audioSystem.playSFX('page');
      audioSystem.playSFX('swoosh');
      setFlipState({ dir: 'next', page: currentPage });
    }
  };

  const prevPage = () => {
    if (currentPage > 0 && !flipState) {
      audioSystem.playSFX('page');
      audioSystem.playSFX('swoosh');
      setFlipState({ dir: 'prev', page: currentPage });
    }
  };

  useEffect(() => {
    if (flipState?.dir === 'next') {
      gsap.fromTo('.flip-layer', 
        { rotateY: 0 }, 
        { rotateY: -180, duration: 1.2, ease: 'power2.inOut', onComplete: () => {
          setCurrentPage(prev => prev + 2);
          setFlipState(null);
        }}
      );
    } else if (flipState?.dir === 'prev') {
      gsap.fromTo('.flip-layer', 
        { rotateY: 0 }, 
        { rotateY: 180, duration: 1.2, ease: 'power2.inOut', onComplete: () => {
          setCurrentPage(prev => Math.max(0, prev - 2));
          setFlipState(null);
        }}
      );
    }
  }, [flipState]);

  const handleClose = (targetBookId: string | null = null) => {
    if (targetBookId) {
      audioSystem.playSFX('sparkle');
    }
    gsap.to('.reader-container', {
      autoAlpha: 0,
      scale: 0.9,
      duration: 0.5,
      onComplete: () => selectBook(targetBookId)
    });
  };

  const baseLeftIndex = flipState?.dir === 'prev' ? flipState.page - 2 : (flipState?.dir === 'next' ? flipState.page : currentPage);
  const baseRightIndex = flipState?.dir === 'next' ? flipState.page + 3 : (flipState?.dir === 'prev' ? flipState.page + 1 : currentPage + 1);

  return (
    <div className="reader-container fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
      
      {/* Switch Book Controls */}
      {prevBookId && (
        <button 
          onClick={() => handleClose(prevBookId)}
          className="absolute left-8 top-1/2 -translate-y-1/2 p-5 bg-black/40 backdrop-blur-md rounded-full arcane-border text-amber-300 hover:text-white hover:bg-black/60 transition-all hover:scale-110 pointer-events-auto z-[110] group shadow-[0_0_20px_rgba(255,191,0,0.1)]"
        >
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-xs tracking-widest font-serif whitespace-nowrap text-amber-200 transition-opacity uppercase">Cuốn Trước</div>
          <ArrowLeftToLine size={28} />
        </button>
      )}

      {nextBookId && (
        <button 
          onClick={() => handleClose(nextBookId)}
          className="absolute right-8 top-1/2 -translate-y-1/2 p-5 bg-black/40 backdrop-blur-md rounded-full arcane-border text-amber-300 hover:text-white hover:bg-black/60 transition-all hover:scale-110 pointer-events-auto z-[110] group shadow-[0_0_20px_rgba(255,191,0,0.1)]"
        >
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-xs tracking-widest font-serif whitespace-nowrap text-amber-200 transition-opacity uppercase">Cuốn Tiếp</div>
          <ArrowRightToLine size={28} />
        </button>
      )}

      <div className="reader-content w-full max-w-4xl px-8 pointer-events-auto relative">
        {/* Toggle List Button */}
        <button
          onClick={() => setShowList(!showList)}
          className="fixed top-8 left-8 p-3 bg-white/60 backdrop-blur-md rounded-full border border-amber-900/10 text-amber-900 hover:text-amber-600 transition-all hover:scale-110 z-[110] shadow-[0_4px_15px_rgba(0,0,0,0.05)] group pointer-events-auto flex items-center justify-center"
        >
          <div className="absolute top-1/2 left-full ml-3 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-xs tracking-widest font-serif whitespace-nowrap text-amber-900 transition-opacity uppercase drop-shadow-md">Danh Sách</div>
          <List size={22} />
        </button>

        {/* Close Reader Button */}
        <button
          onClick={() => handleClose()}
          className="fixed top-8 right-8 p-3 bg-white/60 backdrop-blur-md rounded-full border border-amber-900/10 text-amber-900 hover:text-amber-600 transition-all hover:scale-110 z-[110] group shadow-[0_4px_15px_rgba(0,0,0,0.05)] pointer-events-auto flex items-center justify-center"
        >
          <div className="absolute top-1/2 right-full mr-3 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-xs tracking-widest font-serif whitespace-nowrap text-amber-900 transition-opacity uppercase drop-shadow-md">Đóng Sách</div>
          <X size={22} />
        </button>

        {/* The Text Content Overlay */}
        <div
          className="relative w-full max-w-5xl h-[85vh] perspective-1500 rotate-x-[8deg] drop-shadow-2xl"
          style={{
            transform: 'perspective(2000px) rotateX(10deg)',
            boxShadow: '0 40px 100px rgba(0,0,0,0.8), 0 0 60px rgba(255, 191, 0, 0.15)',
            transformOrigin: 'bottom center',
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Series Sidebar / Overlay Layer Inside Book */}
          {showList && (
            <div className="absolute top-0 left-0 w-1/2 h-full bg-[#fdfbf2]/98 backdrop-blur-3xl rounded-l-md z-[120] p-12 overflow-y-auto custom-scrollbar shadow-[40px_0_60px_rgba(0,0,0,0.1)] border-r border-amber-900/10 transition-all pointer-events-auto flex flex-col">
               <div className="flex items-center justify-between mb-8 border-b border-amber-900/20 pb-4">
                 <h3 className="text-amber-900 font-serif font-bold tracking-wider uppercase text-sm">Cùng Bộ Truyện</h3>
                 <button onClick={() => setShowList(false)} className="text-amber-900/60 hover:text-amber-900 transition-colors bg-amber-900/5 p-2 rounded-full"><X size={18}/></button>
               </div>
               <ul className="flex-1 space-y-3 relative">
                 {seriesBooks.map((sb, i) => (
                   <li key={sb.id}>
                     <button
                       onClick={() => {
                          setShowList(false);
                          handleClose(sb.id);
                       }}
                       className={`w-full text-left font-serif transition-colors hover:bg-amber-900/5 rounded-md flex items-center gap-3 ${sb.id === book.id ? 'text-amber-900 font-bold border-l-4 border-amber-600 bg-amber-900/10 px-4 py-3 shadow-inner' : 'text-amber-900/70 border-l-4 border-transparent px-4 py-3'}`}
                     >
                       <span className="text-xs opacity-50 w-5">{i + 1}.</span> 
                       <span className="text-sm truncate leading-relaxed">{sb.title}</span>
                     </button>
                   </li>
                 ))}
               </ul>
            </div>
          )}
          {/* Base Left Page */}
          <div 
            className="absolute top-0 left-0 w-1/2 h-full bg-[#fdfbf2] p-12 overflow-y-auto custom-scrollbar rounded-l-md group cursor-pointer hover:bg-black/5 transition-colors"
            onClick={prevPage}
          >
            <div className="fixed top-1/2 left-12 opacity-0 group-hover:opacity-100 transition-opacity text-amber-900/20 -translate-y-1/2 pointer-events-none">
              <ChevronLeft size={64} />
            </div>
            <div className="absolute top-4 left-4 text-amber-900/20 text-4xl">❧</div>
            <div className="space-y-6">
              {baseLeftIndex === 0 && (
                <h2 className="text-3xl font-serif text-amber-900 border-b border-amber-900/10 pb-4">
                  {book.title}
                </h2>
              )}
              <div className={`text-amber-900/80 font-serif leading-relaxed ${baseLeftIndex === 0 ? 'first-letter:text-5xl first-letter:float-left first-letter:mr-3 first-letter:font-bold first-letter:text-amber-800' : ''}`}>
                {book.content[baseLeftIndex] || ''}
              </div>
            </div>
            <div className="absolute bottom-6 left-8 text-amber-900/40 font-serif italic text-sm">
              Trang {baseLeftIndex + 1}
            </div>
          </div>

          {/* Base Right Page */}
          <div 
            className="absolute top-0 right-0 w-1/2 h-full bg-[#fcf9ed] p-12 overflow-y-auto custom-scrollbar border-l border-amber-900/5 rounded-r-md group cursor-pointer hover:bg-black/5 transition-colors"
            onClick={nextPage}
          >
            <div className="fixed top-1/2 right-12 opacity-0 group-hover:opacity-100 transition-opacity text-amber-900/20 -translate-y-1/2 pointer-events-none">
              <ChevronRight size={64} />
            </div>
            <div className="absolute top-4 right-4 text-amber-900/20 text-4xl rotate-180">❧</div>
            <div className="space-y-6">
              <div className="text-amber-900/80 font-serif leading-relaxed">
                {book.content[baseRightIndex] || 'Phần còn lại của cuốn sách đã mờ phai và không thể đọc được.'}
              </div>
            </div>
            <div className="absolute bottom-6 right-8 text-amber-900/40 font-serif italic text-sm">
              Trang {baseRightIndex + 1}
            </div>
          </div>

          {/* Book Spine Shadow Center */}
          <div className="absolute left-1/2 top-0 bottom-0 w-12 -translate-x-1/2 bg-gradient-to-r from-black/5 via-black/10 to-black/5 z-[25] pointer-events-none" />

          {/* Flip Layer: NEXT */}
          {flipState?.dir === 'next' && (
            <div 
              className="absolute top-0 right-0 w-1/2 h-full z-20 flip-layer hover:bg-black/5 pointer-events-none"
              style={{ transformOrigin: 'left center', transformStyle: 'preserve-3d' }}
            >
              {/* Front: Right Page sliding over */}
              <div className="absolute inset-0 bg-[#fcf9ed] p-12 overflow-hidden border-l border-amber-900/5 shadow-2xl rounded-r-md" style={{ backfaceVisibility: 'hidden' }}>
                <div className="absolute top-4 right-4 text-amber-900/20 text-4xl rotate-180">❧</div>
                <div className="space-y-6">
                  <div className="text-amber-900/80 font-serif leading-relaxed">
                    {book.content[flipState.page + 1] || 'Phần còn lại của cuốn sách đã mờ phai và không thể đọc được.'}
                  </div>
                </div>
                <div className="absolute bottom-6 right-8 text-amber-900/40 font-serif italic text-sm">
                  Trang {flipState.page + 2}
                </div>
              </div>
              
              {/* Back: Next Left Page appearing */}
              <div className="absolute inset-0 bg-[#fdfbf2] p-12 overflow-hidden shadow-2xl rounded-l-md" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                <div className="absolute top-4 left-4 text-amber-900/20 text-4xl">❧</div>
                <div className="space-y-6">
                  <div className="text-amber-900/80 font-serif leading-relaxed">
                    {book.content[flipState.page + 2] || ''}
                  </div>
                </div>
                <div className="absolute bottom-6 left-8 text-amber-900/40 font-serif italic text-sm">
                  Trang {flipState.page + 3}
                </div>
              </div>
            </div>
          )}

          {/* Flip Layer: PREV */}
          {flipState?.dir === 'prev' && (
             <div 
               className="absolute top-0 left-0 w-1/2 h-full z-20 flip-layer hover:bg-black/5 pointer-events-none"
               style={{ transformOrigin: 'right center', transformStyle: 'preserve-3d' }}
             >
               {/* Front: Left Page sliding back */}
               <div className="absolute inset-0 bg-[#fdfbf2] p-12 overflow-hidden shadow-2xl rounded-l-md" style={{ backfaceVisibility: 'hidden' }}>
                 <div className="absolute top-4 left-4 text-amber-900/20 text-4xl">❧</div>
                 <div className="space-y-6">
                   {flipState.page === 0 && (
                     <h2 className="text-3xl font-serif text-amber-900 border-b border-amber-900/10 pb-4">
                       {book.title}
                     </h2>
                   )}
                   <div className={`text-amber-900/80 font-serif leading-relaxed ${flipState.page === 0 ? 'first-letter:text-5xl first-letter:float-left first-letter:mr-3 first-letter:font-bold first-letter:text-amber-800' : ''}`}>
                     {book.content[flipState.page] || ''}
                   </div>
                 </div>
                  <div className="absolute bottom-6 left-8 text-amber-900/40 font-serif italic text-sm">
                    Trang {flipState.page + 1}
                  </div>
               </div>
               
               {/* Back: Prev Right Page appearing */}
               <div className="absolute inset-0 bg-[#fcf9ed] p-12 overflow-hidden border-l border-amber-900/5 shadow-2xl rounded-r-md" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                 <div className="absolute top-4 right-4 text-amber-900/20 text-4xl rotate-180">❧</div>
                 <div className="space-y-6">
                   <div className="text-amber-900/80 font-serif leading-relaxed">
                     {book.content[flipState.page - 1] || 'Phần còn lại của cuốn sách đã mờ phai và không thể đọc được.'}
                   </div>
                 </div>
                  <div className="absolute bottom-6 right-8 text-amber-900/40 font-serif italic text-sm">
                    Trang {flipState.page}
                  </div>
               </div>
             </div>
          )}
        </div>

        {/* Navigation Controls */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-12 text-amber-900 bg-white/60 backdrop-blur-lg px-8 py-3 rounded-full border border-amber-900/10 shadow-2xl z-[60]">
          <button
            onClick={prevPage}
            disabled={currentPage === 0 || !!flipState}
            className="flex items-center gap-2 font-serif uppercase tracking-widest text-sm hover:text-amber-600 disabled:opacity-20 transition-all hover:-translate-x-1"
          >
            <ChevronLeft /> Phía Sau
          </button>
          
          <button
            onClick={() => handleClose()}
            className="px-6 py-2 border border-amber-900/30 rounded-full hover:bg-amber-900/10 transition-all font-serif tracking-widest uppercase text-xs"
          >
            Đóng Sách
          </button>

          <button
            onClick={nextPage}
            disabled={currentPage >= book.content.length - 2 || !!flipState}
            className="flex items-center gap-2 font-serif uppercase tracking-widest text-sm hover:text-amber-600 disabled:opacity-20 transition-all hover:translate-x-1"
          >
            Trang Tới <ChevronRight />
          </button>
        </div>
      </div>
      
      {/* Light Background Overlay Dimmer */}
      <div className="fixed inset-0 bg-[#fdfbf2]/60 backdrop-blur-md -z-10" />
    </div>
  );
}
