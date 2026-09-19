import React from 'react';
import { Volume2, Sparkles } from 'lucide-react';
import { IPASoundItem } from '../../data/ipaData';
import { sound } from '../../utils/audio';

interface IPATileProps {
  item: IPASoundItem;
  isSelected: boolean;
  isPlaying: boolean;
  onSelect: (item: IPASoundItem) => void;
  onQuickPlay: (e: React.MouseEvent, item: IPASoundItem) => void;
  compact?: boolean;
}

export const IPATile: React.FC<IPATileProps> = ({
  item,
  isSelected,
  isPlaying,
  onSelect,
  onQuickPlay,
  compact = false,
}) => {
  // Theme styling based on category
  const getThemeClasses = () => {
    if (item.category === 'monophthong') {
      if (item.subCategory === 'long_vowel') {
        return {
          bg: 'bg-emerald-50/80 hover:bg-emerald-100/90 border-emerald-300/80 text-emerald-950',
          badge: 'bg-emerald-200/70 text-emerald-800',
          symbolColor: 'text-emerald-900',
          highlight: 'text-emerald-700 font-extrabold underline decoration-emerald-500 decoration-2',
          pill: 'bg-emerald-100 text-emerald-700',
        };
      }
      return {
        bg: 'bg-teal-50/80 hover:bg-teal-100/90 border-teal-300/80 text-teal-950',
        badge: 'bg-teal-200/70 text-teal-800',
        symbolColor: 'text-teal-900',
        highlight: 'text-teal-700 font-extrabold underline decoration-teal-500 decoration-2',
        pill: 'bg-teal-100 text-teal-700',
      };
    }

    if (item.category === 'diphthong') {
      return {
        bg: 'bg-purple-50/80 hover:bg-purple-100/90 border-purple-300/80 text-purple-950',
        badge: 'bg-purple-200/70 text-purple-800',
        symbolColor: 'text-purple-900',
        highlight: 'text-purple-700 font-extrabold underline decoration-purple-500 decoration-2',
        pill: 'bg-purple-100 text-purple-700',
      };
    }

    // Consonants
    if (item.subCategory === 'voiceless_consonant') {
      return {
        bg: 'bg-amber-50/80 hover:bg-amber-100/90 border-amber-300/80 text-amber-950',
        badge: 'bg-amber-200/70 text-amber-800',
        symbolColor: 'text-amber-900',
        highlight: 'text-amber-800 font-extrabold underline decoration-amber-500 decoration-2',
        pill: 'bg-amber-100 text-amber-700',
      };
    }

    return {
      bg: 'bg-sky-50/80 hover:bg-sky-100/90 border-sky-300/80 text-sky-950',
      badge: 'bg-sky-200/70 text-sky-800',
      symbolColor: 'text-sky-900',
      highlight: 'text-sky-800 font-extrabold underline decoration-sky-500 decoration-2',
      pill: 'bg-sky-100 text-sky-700',
    };
  };

  const theme = getThemeClasses();

  // Highlight the specific letter in the primary word (e.g., "ee" in Sheep)
  const renderHighlightedWord = () => {
    const word = item.primaryWord;
    const highlight = item.highlightLetter;
    const index = word.toLowerCase().indexOf(highlight.toLowerCase());

    if (index === -1) {
      return <span>{word}</span>;
    }

    const before = word.slice(0, index);
    const matched = word.slice(index, index + highlight.length);
    const after = word.slice(index + highlight.length);

    return (
      <span className="font-semibold">
        {before}
        <span className={theme.highlight}>{matched}</span>
        {after}
      </span>
    );
  };

  return (
    <div
      onClick={() => {
        sound.playTap();
        onSelect(item);
      }}
      className={`relative group rounded-2xl border-2 transition-all duration-200 flex flex-col justify-between cursor-pointer select-none shadow-2xs hover:shadow-md hover:-translate-y-0.5 ${
        theme.bg
      } ${
        isSelected
          ? 'ring-4 ring-amber-400 ring-offset-2 scale-102 z-10'
          : 'hover:border-amber-400'
      } ${compact ? 'p-2 min-h-[85px]' : 'p-2.5 sm:p-3 min-h-[105px]'}`}
    >
      {/* Top row: Number and Audio / Icon */}
      <div className="flex items-center justify-between gap-1">
        <span
          className={`text-[10px] sm:text-xs font-black px-1.5 py-0.5 rounded-md font-mono ${theme.badge}`}
        >
          {item.number}
        </span>

        {/* Quick Speak Button */}
        <button
          type="button"
          onClick={(e) => onQuickPlay(e, item)}
          className={`p-1 rounded-full transition-transform active:scale-90 hover:bg-white/80 ${
            isPlaying ? 'text-amber-600 scale-110 animate-bounce' : 'text-slate-500 hover:text-slate-800'
          }`}
          title="Bấm nghe phát âm"
        >
          <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>

      {/* Main IPA Symbol */}
      <div className="my-auto text-center py-1">
        <div
          className={`font-mono font-black tracking-tight text-xl sm:text-2xl md:text-3xl ${theme.symbolColor}`}
        >
          {item.rawSymbol}
        </div>
        {/* Visual Voiced / Voiceless / Length Tag */}
        <div className="text-[9px] sm:text-[10px] text-slate-500 font-medium truncate mt-0.5 flex items-center justify-center gap-1">
          <span>{item.mouthIcon}</span>
          <span className="hidden sm:inline line-clamp-1">{item.mouthAction}</span>
        </div>
      </div>

      {/* Bottom row: Primary Word & Emoji */}
      <div className="flex items-center justify-between border-t border-slate-200/50 pt-1 mt-1">
        <div className="text-xs sm:text-sm text-slate-800 truncate">
          {renderHighlightedWord()}
        </div>
        <span className="text-base sm:text-lg shrink-0 ml-1" title={item.wordMeaningVi}>
          {item.emoji}
        </span>
      </div>

      {/* Playing Ripple Indicator */}
      {isPlaying && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
        </span>
      )}
    </div>
  );
};
