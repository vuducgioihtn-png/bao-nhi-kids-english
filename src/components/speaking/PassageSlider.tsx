import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Search, Sparkles, Filter, RotateCcw } from 'lucide-react';
import { SpeakingPassage } from '../../data/passages/types';
import { SPEAKING_LEVELS } from '../../data/passages';
import { sound } from '../../utils/audio';

const PARTS = [
  { id: 0, label: 'Tất cả', range: '500 bài', icon: '🌟' },
  { id: 1, label: 'Tập 1', range: '1–100', icon: '🌱' },
  { id: 2, label: 'Tập 2', range: '101–200', icon: '🚀' },
  { id: 3, label: 'Tập 3', range: '201–300', icon: '👑' },
  { id: 4, label: 'Tập 4', range: '301–400', icon: '✨' },
  { id: 5, label: 'Tập 5', range: '401–500', icon: '💎' },
] as const;

interface PassageSliderProps {
  passages: SpeakingPassage[];
  activePassage: SpeakingPassage;
  onSelectPassage: (passage: SpeakingPassage) => void;
  selectedLevel: number;
  onSelectLevel: (level: number) => void;
  completedPassageIds?: Set<number>;
  childName?: string;
}

export const PassageSlider: React.FC<PassageSliderProps> = ({
  passages,
  activePassage,
  onSelectPassage,
  selectedLevel,
  onSelectLevel,
  completedPassageIds = new Set(),
  childName = 'Bảo Nhi',
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const [selectedPart, setSelectedPart] = useState<0 | 1 | 2 | 3 | 4 | 5>(0);

  // Filter passages based on search, level, and part
  const filteredPassages = passages.filter((p) => {
    const matchesLevel = selectedLevel === 0 || p.level === selectedLevel;
    if (!matchesLevel) return false;

    if (selectedPart === 1 && (p.id < 1 || p.id > 100)) return false;
    if (selectedPart === 2 && (p.id <= 100 || p.id > 200)) return false;
    if (selectedPart === 3 && (p.id <= 200 || p.id > 300)) return false;
    if (selectedPart === 4 && (p.id <= 300 || p.id > 400)) return false;
    if (selectedPart === 5 && (p.id <= 400 || p.id > 500)) return false;

    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      p.id.toString().includes(query) ||
      p.titleEn.toLowerCase().includes(query) ||
      p.titleVi.toLowerCase().includes(query) ||
      p.theme.toLowerCase().includes(query)
    );
  });

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll);
      return () => el.removeEventListener('scroll', checkScroll);
    }
  }, [filteredPassages]);

  // Scroll active passage into view when it changes
  useEffect(() => {
    if (!scrollRef.current) return;
    const activeEl = scrollRef.current.querySelector(`[data-passage-id="${activePassage.id}"]`) as HTMLElement;
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activePassage.id]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    sound.playTap();
    const scrollAmount = 360;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  // Drag to scroll functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftState(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-amber-200/80 p-3 sm:p-4 mb-4">
      {/* Top Header with Title, Search, Part Tabs, and Level Filters */}
      <div className="flex flex-col gap-3 mb-3">
        {/* Row 1: Title / Counter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {/* Left: Section Header & Stats */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-100 border border-amber-200/80 flex items-center justify-center text-amber-700 text-lg shadow-2xs shrink-0">
              📚
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-slate-900 leading-tight">
                  Kho 500 Bài Luyện Nói
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  {filteredPassages.length} bài
                </span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-1">
                Trượt ngang chọn bài hoặc lọc theo tập và cấp độ bên dưới
              </p>
            </div>
          </div>

          {/* Right: Search / Jump to passage */}
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Tìm bài 1-500, tên, chủ đề..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-7 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white text-slate-700 placeholder-slate-400 shadow-2xs transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 w-5 h-5 rounded-full hover:bg-slate-200 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Part Tabs (Segmented Control - Full width, evenly spaced & sleek) */}
        <div className="bg-amber-50/80 p-1 rounded-2xl border border-amber-200/80 shadow-2xs">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 px-0.5">
            {PARTS.map((p) => {
              const isSelected = selectedPart === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    sound.playTap();
                    setSelectedPart(p.id as any);
                  }}
                  className={`flex-1 min-w-fit px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 whitespace-nowrap transition-all select-none ${
                    isSelected
                      ? 'bg-amber-500 text-white shadow-xs font-bold scale-[1.01] ring-1 ring-amber-400'
                      : 'text-amber-900 hover:bg-amber-100/80 hover:text-amber-950'
                  }`}
                >
                  <span className="text-sm">{p.icon}</span>
                  <span>{p.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium ${
                      isSelected
                        ? 'bg-amber-600/70 text-amber-50'
                        : 'bg-amber-100/90 text-amber-800'
                    }`}
                  >
                    {p.range}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 3: Level Filters & Reset */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-semibold text-slate-500 mr-0.5">
              Cấp độ:
            </span>
            <button
              type="button"
              onClick={() => {
                sound.playTap();
                onSelectLevel(0);
              }}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedLevel === 0
                  ? 'bg-amber-600 text-white shadow-xs font-bold'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/60'
              }`}
            >
              Mọi Cấp Độ
            </button>

            {SPEAKING_LEVELS.map((lvl) => {
              const isSelected = selectedLevel === lvl.level;
              return (
                <button
                  key={lvl.level}
                  type="button"
                  onClick={() => {
                    sound.playTap();
                    onSelectLevel(lvl.level);
                  }}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isSelected
                      ? `${lvl.bgColor} ${lvl.color} ring-2 ring-amber-400 font-bold shadow-xs`
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span>{lvl.icon}</span>
                  <span>{lvl.label}</span>
                  <span className="text-[10px] opacity-75 font-normal">({lvl.count} bài)</span>
                </button>
              );
            })}
          </div>

          {(selectedLevel !== 0 || selectedPart !== 0 || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                sound.playTap();
                setSelectedPart(0);
                onSelectLevel(0);
                setSearchQuery('');
              }}
              className="text-[11px] text-amber-700 hover:text-amber-900 font-medium hover:underline flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-amber-50 transition-all"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Đặt lại bộ lọc</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Slider Carousel Container */}
      <div className="relative group">
        {/* Left Arrow Button */}
        {canScrollLeft && (
          <button
            type="button"
            aria-label="Cuộn sang trái"
            onClick={() => handleScroll('left')}
            className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/95 text-amber-700 shadow-md border border-amber-200 flex items-center justify-center hover:bg-amber-50 hover:scale-110 active:scale-95 transition-all"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
        )}

        {/* Horizontal Slider Track */}
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`flex gap-3 overflow-x-auto py-2 px-1 scroll-smooth no-scrollbar select-none ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {filteredPassages.length === 0 ? (
            <div className="w-full py-6 text-center text-slate-500 text-xs">
              Không tìm thấy bài phù hợp với từ khóa &ldquo;{searchQuery}&rdquo;. Hãy thử tìm số bài từ 1 đến 500!
            </div>
          ) : (
            filteredPassages.map((p) => {
              const isSelected = p.id === activePassage.id;
              const isDone = completedPassageIds.has(p.id);

              return (
                <button
                  key={p.id}
                  data-passage-id={p.id}
                  type="button"
                  onClick={() => {
                    sound.playTap();
                    onSelectPassage(p);
                  }}
                  className={`flex-shrink-0 w-44 sm:w-52 p-3 rounded-2xl text-left transition-all relative border flex flex-col justify-between ${
                    isSelected
                      ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-md border-amber-500 scale-[1.03] ring-2 ring-amber-300 ring-offset-2'
                      : isDone
                      ? 'bg-emerald-50/60 border-emerald-200 text-slate-800 hover:bg-emerald-50 hover:border-emerald-300'
                      : 'bg-slate-50 border-slate-200/80 text-slate-800 hover:bg-amber-50/50 hover:border-amber-300'
                  }`}
                >
                  <div>
                    {/* Top Row: Lesson Number & Level Badge */}
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        <span>{p.icon}</span>
                        <span>Bài {p.id}</span>
                      </span>

                      {isDone && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                            isSelected ? 'bg-emerald-400 text-emerald-950' : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          ✓ Đã đọc
                        </span>
                      )}
                    </div>

                    {/* Lesson Title */}
                    <h4
                      className={`text-xs sm:text-[13px] font-bold line-clamp-2 mb-1 leading-snug ${
                        isSelected ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {p.titleEn}
                    </h4>

                    {/* Vietnamese Subtitle */}
                    <p
                      className={`text-[11px] line-clamp-1 leading-tight ${
                        isSelected ? 'text-amber-100' : 'text-slate-500'
                      }`}
                    >
                      {p.titleVi}
                    </p>
                  </div>

                  {/* Bottom Info: Age & Theme */}
                  <div className="mt-2 pt-2 border-t border-current/10 flex items-center justify-between text-[10px]">
                    <span
                      className={`truncate max-w-[110px] ${
                        isSelected ? 'text-amber-100' : 'text-slate-400'
                      }`}
                    >
                      {p.theme}
                    </span>
                    <span
                      className={`font-semibold ${
                        isSelected ? 'text-white' : 'text-amber-600'
                      }`}
                    >
                      L.{p.level}
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Right Arrow Button */}
        {canScrollRight && (
          <button
            type="button"
            aria-label="Cuộn sang phải"
            onClick={() => handleScroll('right')}
            className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/95 text-amber-700 shadow-md border border-amber-200 flex items-center justify-center hover:bg-amber-50 hover:scale-110 active:scale-95 transition-all"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        )}
      </div>

      {/* Slider Quick Helper Note */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500 px-1">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>
            Bé <strong>{childName}</strong> có thể trượt kéo thanh ngang hoặc bấm mũi tên để chọn bài học nhé!
          </span>
        </span>
        <span className="font-medium text-amber-700">
          Đang hiển thị {filteredPassages.length} bài
        </span>
      </div>
    </div>
  );
};
