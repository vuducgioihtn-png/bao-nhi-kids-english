import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, LayoutGrid, SlidersHorizontal, Sparkles } from 'lucide-react';
import { Topic } from '../types';
import { TOPICS } from '../data/topics';
import { sound } from '../utils/audio';

interface TopicSliderBarProps {
  currentTopic: Topic;
  onSelectTopic: (topic: Topic) => void;
  onOpenTopicModal?: () => void;
}

export const TopicSliderBar: React.FC<TopicSliderBarProps> = ({
  currentTopic,
  onSelectTopic,
  onOpenTopicModal,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activePillRef = useRef<HTMLButtonElement>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isMouseDown, setIsMouseDown] = useState(false);

  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);

  const totalTopics = TOPICS.length;
  const currentIndex = TOPICS.findIndex(t => t.id === currentTopic.id);
  const currentTopicNumber = currentIndex >= 0 ? currentIndex + 1 : 1;

  // Update scroll percentage and edge states
  const updateScrollMetrics = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) {
      setScrollProgress(0);
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }

    const current = el.scrollLeft;
    const percentage = Math.min(100, Math.max(0, (current / maxScroll) * 100));
    setScrollProgress(percentage);
    setCanScrollLeft(current > 4);
    setCanScrollRight(current < maxScroll - 4);
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    updateScrollMetrics();
    const handleResize = () => updateScrollMetrics();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateScrollMetrics]);

  // Center active topic pill into view when currentTopic changes
  useEffect(() => {
    if (activePillRef.current && scrollContainerRef.current) {
      // Don't auto-scroll if user is actively mouse-dragging
      if (!isMouseDown) {
        activePillRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  }, [currentTopic.id, isMouseDown]);

  // Scroll by step (Left / Right buttons)
  const handleScrollStep = (direction: 'left' | 'right') => {
    sound.playTap();
    const el = scrollContainerRef.current;
    if (!el) return;

    const scrollAmount = Math.max(240, Math.round(el.clientWidth * 0.6));
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  // Slider input drag handler
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setScrollProgress(value);

    const el = scrollContainerRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    el.scrollLeft = (value / 100) * maxScroll;
  };

  // Mouse drag-to-scroll handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollContainerRef.current;
    if (!el) return;

    setIsMouseDown(true);
    hasDraggedRef.current = false;
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown) return;
    const el = scrollContainerRef.current;
    if (!el) return;

    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startXRef.current) * 1.3;

    if (Math.abs(walk) > 4) {
      hasDraggedRef.current = true;
    }

    el.scrollLeft = scrollLeftRef.current - walk;
    updateScrollMetrics();
  };

  const handleMouseUpOrLeave = () => {
    setIsMouseDown(false);
  };

  return (
    <div className="w-full px-3 sm:px-4 py-2 select-none">
      {/* Container Card */}
      <div className="bg-white/90 backdrop-blur-xs rounded-2xl sm:rounded-3xl p-2.5 sm:p-3 border border-amber-200/80 shadow-xs">
        {/* Top Info Bar */}
        <div className="flex items-center justify-between gap-2 px-1 mb-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-base sm:text-lg shrink-0">{currentTopic.icon}</span>
            <span className="text-xs font-black text-slate-800 font-heading truncate">
              Chủ đề {currentTopicNumber}/{totalTopics}:{' '}
              <span className="text-amber-600">{currentTopic.nameVi}</span>
            </span>
            <span className="hidden md:inline-block text-[11px] font-bold text-slate-400">
              ({currentTopic.nameEn})
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {onOpenTopicModal && (
              <button
                type="button"
                id="view-all-topics-btn"
                onClick={() => {
                  sound.playTap();
                  onOpenTopicModal();
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-extrabold transition-all active:scale-95 cursor-pointer"
                title="Mở danh mục 35 chủ đề đầy đủ"
              >
                <LayoutGrid className="w-3.5 h-3.5 text-amber-600" />
                <span>Xem tất cả (35)</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Scrolling Row with Navigation Arrows */}
        <div className="relative flex items-center gap-1 sm:gap-2">
          {/* Left Arrow Button */}
          <button
            type="button"
            id="topic-scroll-left-btn"
            onClick={() => handleScrollStep('left')}
            disabled={!canScrollLeft}
            aria-label="Cuộn sang trái"
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 border transition-all cursor-pointer ${
              canScrollLeft
                ? 'bg-amber-100/80 hover:bg-amber-200 text-amber-900 border-amber-300 shadow-2xs active:scale-95'
                : 'bg-slate-100/60 text-slate-300 border-slate-200 cursor-not-allowed opacity-50'
            }`}
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Topics Scrollable Container */}
          <div
            ref={scrollContainerRef}
            onScroll={updateScrollMetrics}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            className={`flex-1 flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-1 scrollbar-none scroll-smooth ${
              isMouseDown ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          >
            {TOPICS.map((topic, index) => {
              const isSelected = topic.id === currentTopic.id;
              return (
                <button
                  key={topic.id}
                  id={`topic-pill-${topic.id}`}
                  ref={isSelected ? activePillRef : null}
                  type="button"
                  onClick={e => {
                    if (hasDraggedRef.current) {
                      e.preventDefault();
                      return;
                    }
                    sound.playTap();
                    onSelectTopic(topic);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-linear-to-r from-amber-500 to-orange-500 text-white shadow-sm ring-2 ring-amber-300/80 scale-102 font-extrabold'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-900 active:scale-95'
                  }`}
                >
                  <span className="text-sm">{topic.icon}</span>
                  <span>{topic.nameVi}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                      isSelected
                        ? 'bg-white/25 text-white'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    #{index + 1}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Arrow Button */}
          <button
            type="button"
            id="topic-scroll-right-btn"
            onClick={() => handleScrollStep('right')}
            disabled={!canScrollRight}
            aria-label="Cuộn sang phải"
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 border transition-all cursor-pointer ${
              canScrollRight
                ? 'bg-amber-100/80 hover:bg-amber-200 text-amber-900 border-amber-300 shadow-2xs active:scale-95'
                : 'bg-slate-100/60 text-slate-300 border-slate-200 cursor-not-allowed opacity-50'
            }`}
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* ================= INTERACTIVE DRAGGABLE SLIDER BAR ================= */}
        <div className="mt-2 pt-2 border-t border-amber-100/80 flex items-center gap-2.5 px-1">
          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-800/80 shrink-0 hidden sm:flex">
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-500" />
            <span>Kéo thanh trượt:</span>
          </div>

          {/* Range Slider Track */}
          <div className="flex-1 relative flex items-center">
            <input
              type="range"
              min={0}
              max={100}
              step={0.5}
              value={scrollProgress}
              onChange={handleSliderChange}
              aria-label="Thanh trượt duyệt danh sách chủ đề"
              className="w-full h-2 sm:h-2.5 bg-amber-100/90 rounded-full appearance-none cursor-pointer accent-amber-500 focus:outline-hidden hover:bg-amber-200/80 transition-colors"
              title="Kéo sang trái / phải để duyệt nhanh 35 chủ đề"
            />
          </div>

          {/* Topic Counter Badge */}
          <div className="shrink-0 flex items-center gap-1 text-[11px] font-black text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded-lg border border-amber-200">
            <span>{currentTopicNumber}</span>
            <span className="text-amber-500 font-normal">/</span>
            <span>{totalTopics}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
