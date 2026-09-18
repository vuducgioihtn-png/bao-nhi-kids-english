import React, { useState } from 'react';
import { Gamepad2, Sparkles, Star, Award, Zap, Compass } from 'lucide-react';
import { WordItem, Topic, ChildProfile } from '../types';
import { sound } from '../utils/audio';
import { MemoryMatchGame } from './games/MemoryMatchGame';
import { QuickPickGame } from './games/QuickPickGame';
import { BubblePopGame } from './games/BubblePopGame';
import { WordScrambleGame } from './games/WordScrambleGame';
import { WordConnectGame } from './games/WordConnectGame';
import { PictureDetectiveGame } from './games/PictureDetectiveGame';
import { HideAndSeekGame } from './games/HideAndSeekGame';

interface GameCenterProps {
  topic: Topic;
  words: WordItem[];
  onAddStars: (stars: number) => void;
  childProfile?: ChildProfile;
}

type ActiveGame = 'menu' | 'memory' | 'quick-pick' | 'bubble-pop' | 'scramble' | 'connect' | 'detective' | 'hide-seek';

type CategoryFilter = 'all' | 'memory' | 'reflex' | 'spelling' | 'riddle';

interface GameInfo {
  id: ActiveGame;
  title: string;
  category: CategoryFilter;
  categoryLabel: string;
  emoji: string;
  description: string;
  stars: string;
  bgLinear: string;
  borderClass: string;
  hoverBorder: string;
  iconBg: string;
  btnBg: string;
  tagBg: string;
  tagText: string;
}

const GAMES_LIST: GameInfo[] = [
  {
    id: 'memory',
    title: 'Lật Thẻ Trí Nhớ',
    category: 'memory',
    categoryLabel: 'Trí Nhớ & Ghép Thẻ',
    emoji: '🃏',
    description: 'Lật mở các cặp thẻ Tiếng Anh và Hình Ảnh tương ứng. Giúp bé rèn luyện trí nhớ và phản xạ từ vựng!',
    stars: '+6 Sao',
    bgLinear: 'from-amber-50 to-orange-50/70',
    borderClass: 'border-amber-200',
    hoverBorder: 'hover:border-amber-400 hover:shadow-amber-100',
    iconBg: 'bg-amber-500',
    btnBg: 'bg-amber-500 hover:bg-amber-600',
    tagBg: 'bg-amber-100',
    tagText: 'text-amber-800',
  },
  {
    id: 'quick-pick',
    title: 'Nhanh Như Chớp',
    category: 'reflex',
    categoryLabel: 'Phản Xạ Âm Thanh',
    emoji: '⚡',
    description: 'Lắng nghe phát âm chuẩn bản xứ và nhanh tay chọn đúng bức tranh tương ứng trước khi hết giờ!',
    stars: '+8 Sao',
    bgLinear: 'from-emerald-50 to-teal-50/70',
    borderClass: 'border-emerald-200',
    hoverBorder: 'hover:border-emerald-400 hover:shadow-emerald-100',
    iconBg: 'bg-emerald-500',
    btnBg: 'bg-emerald-500 hover:bg-emerald-600',
    tagBg: 'bg-emerald-100',
    tagText: 'text-emerald-800',
  },
  {
    id: 'bubble-pop',
    title: 'Bắn Bong Bóng Từ Vựng',
    category: 'reflex',
    categoryLabel: 'Bắn Nổ & Combo',
    emoji: '🎈',
    description: 'Bắn nổ các bong bóng bay mang từ vựng mục tiêu, tạo chuỗi Combo rực rỡ và ghi điểm số kỷ lục!',
    stars: '+10 Sao',
    bgLinear: 'from-sky-50 to-blue-50/70',
    borderClass: 'border-sky-200',
    hoverBorder: 'hover:border-sky-400 hover:shadow-sky-100',
    iconBg: 'bg-sky-500',
    btnBg: 'bg-sky-500 hover:bg-sky-600',
    tagBg: 'bg-sky-100',
    tagText: 'text-sky-800',
  },
  {
    id: 'scramble',
    title: 'Xếp Chữ Thần Tốc',
    category: 'spelling',
    categoryLabel: 'Đánh Vần & Chính Tả',
    emoji: '🧩',
    description: 'Ghép các ô chữ cái rời rạc thành từ Tiếng Anh chuẩn xác, giúp bé nhớ cấu trúc chữ và không bao giờ viết sai!',
    stars: '+10 Sao',
    bgLinear: 'from-indigo-50 to-purple-50/70',
    borderClass: 'border-indigo-200',
    hoverBorder: 'hover:border-indigo-400 hover:shadow-indigo-100',
    iconBg: 'bg-indigo-600',
    btnBg: 'bg-indigo-600 hover:bg-indigo-700',
    tagBg: 'bg-indigo-100',
    tagText: 'text-indigo-800',
  },
  {
    id: 'connect',
    title: 'Nối Từ Nhanh Trí',
    category: 'memory',
    categoryLabel: 'Ghép Cặp Từ Vựng',
    emoji: '🔗',
    description: 'Nối các từ vựng Tiếng Anh ở cột trái với hình ảnh và nghĩa tương ứng ở cột phải với tốc độ nhanh nhất!',
    stars: '+8 Sao',
    bgLinear: 'from-teal-50 to-cyan-50/70',
    borderClass: 'border-teal-200',
    hoverBorder: 'hover:border-teal-400 hover:shadow-teal-100',
    iconBg: 'bg-teal-600',
    btnBg: 'bg-teal-600 hover:bg-teal-700',
    tagBg: 'bg-teal-100',
    tagText: 'text-teal-800',
  },
  {
    id: 'detective',
    title: 'Thám Tử Tranh Ẩn',
    category: 'riddle',
    categoryLabel: 'Giải Mã Bí Ẩn',
    emoji: '🕵️',
    description: 'Khám phá bức tranh bí ẩn dưới các mảnh ghép giấu kín thông qua các manh mối thám tử độc đáo!',
    stars: '+10 Sao',
    bgLinear: 'from-violet-50 to-fuchsia-50/70',
    borderClass: 'border-violet-200',
    hoverBorder: 'hover:border-violet-400 hover:shadow-violet-100',
    iconBg: 'bg-violet-600',
    btnBg: 'bg-violet-600 hover:bg-violet-700',
    tagBg: 'bg-violet-100',
    tagText: 'text-violet-800',
  },
  {
    id: 'hide-seek',
    title: 'Trốn Tìm Tiếng Anh',
    category: 'riddle',
    categoryLabel: 'Trốn Tìm & Khám Phá',
    emoji: '🙈',
    description: 'Lắng nghe xem ai đang trốn và khám phá các chỗ ẩn nấp bí mật trong vườn thần kỳ: bụi cây, hộp quà, lều trại!',
    stars: '+10 Sao',
    bgLinear: 'from-rose-50 to-amber-50/70',
    borderClass: 'border-rose-200',
    hoverBorder: 'hover:border-rose-400 hover:shadow-rose-100',
    iconBg: 'bg-gradient-to-tr from-rose-500 to-amber-500',
    btnBg: 'bg-rose-500 hover:bg-rose-600',
    tagBg: 'bg-rose-100',
    tagText: 'text-rose-800',
  },
];

export const GameCenter: React.FC<GameCenterProps> = ({
  topic,
  words,
  onAddStars,
  childProfile,
}) => {
  const [activeGame, setActiveGame] = useState<ActiveGame>('menu');
  const [filter, setFilter] = useState<CategoryFilter>('all');

  const childName = childProfile?.name || 'Bảo Nhi';
  const childNickname = childProfile?.nickname || 'Bé Bảo Nhi';

  const filteredGames = filter === 'all' 
    ? GAMES_LIST 
    : GAMES_LIST.filter(g => g.category === filter);

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      {/* ================= GAME SELECTION MENU ================= */}
      {activeGame === 'menu' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Header Banner */}
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-xs font-black mb-2 shadow-2xs">
              <Gamepad2 className="w-4 h-4 text-amber-600" />
              <span>Góc Trò Chơi Tương Tác &bull; {childNickname}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black font-heading text-slate-900 tracking-tight">
              Khu Vui Chơi Game Của {childNickname}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-medium max-w-xl mx-auto">
              Vừa chơi vừa ghi nhớ sâu từ vựng tiếng Anh chủ đề{' '}
              <span className="text-amber-600 font-extrabold">{topic.nameVi}</span>{' '}
              dành riêng cho {childName} qua các trò chơi phản xạ, đánh vần và giải đố sinh động!
            </p>
          </div>

          {/* Filter Chips Bar */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            <button
              onClick={() => {
                sound.playTap();
                setFilter('all');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              🌟 Tất Cả ({GAMES_LIST.length})
            </button>
            <button
              onClick={() => {
                sound.playTap();
                setFilter('reflex');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                filter === 'reflex'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              ⚡ Phản Xạ Nhanh
            </button>
            <button
              onClick={() => {
                sound.playTap();
                setFilter('memory');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                filter === 'memory'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              🃏 Trí Nhớ & Ghép Thẻ
            </button>
            <button
              onClick={() => {
                sound.playTap();
                setFilter('spelling');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                filter === 'spelling'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              🧩 Xếp Chữ & Đánh Vần
            </button>
            <button
              onClick={() => {
                sound.playTap();
                setFilter('riddle');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                filter === 'riddle'
                  ? 'bg-violet-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              🙈 Trốn Tìm & Bí Ẩn
            </button>
          </div>

          {/* Games Grid (3 columns on desktop, 2 on tablet, 1 on mobile) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGames.map(game => (
              <div
                key={game.id}
                onClick={() => {
                  sound.playTap();
                  setActiveGame(game.id);
                }}
                className={`p-5 rounded-3xl bg-linear-to-br ${game.bgLinear} border-2 ${game.borderClass} ${game.hoverBorder} hover:shadow-lg transition-all duration-200 cursor-pointer group flex flex-col justify-between relative`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-13 h-13 rounded-2xl ${game.iconBg} text-white flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform`}>
                      {game.emoji}
                    </div>

                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${game.tagBg} ${game.tagText} border border-black/5`}>
                      {game.categoryLabel}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-slate-900 font-heading group-hover:text-slate-950">
                    {game.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {game.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold">
                  <span className="inline-flex items-center gap-1 text-amber-700 font-extrabold">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>Thưởng {game.stars}</span>
                  </span>

                  <span className={`${game.btnBg} text-white px-3.5 py-1.5 rounded-xl font-black text-xs group-hover:scale-105 transition-all shadow-xs`}>
                    Chơi ngay ▶
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Learning Tip Banner */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3 text-xs text-amber-900 font-medium">
            <span className="text-2xl shrink-0">💡</span>
            <div>
              <strong className="font-extrabold">Mẹo ghi nhớ siêu tốc:</strong> Mỗi ngày chỉ cần hoàn thành 2-3 trò chơi, {childName} sẽ tiếp thu từ vựng tự nhiên thông qua hình ảnh, âm thanh phát âm chuẩn và các hoạt động phản xạ tương tác.
            </div>
          </div>
        </div>
      )}

      {/* ================= ACTIVE GAME SCREENS ================= */}
      {activeGame === 'memory' && (
        <div className="max-w-xl mx-auto">
          <MemoryMatchGame
            topic={topic}
            words={words}
            onBackToMenu={() => setActiveGame('menu')}
            onAddStars={onAddStars}
          />
        </div>
      )}

      {activeGame === 'quick-pick' && (
        <div className="max-w-xl mx-auto">
          <QuickPickGame
            topic={topic}
            words={words}
            onBackToMenu={() => setActiveGame('menu')}
            onAddStars={onAddStars}
          />
        </div>
      )}

      {activeGame === 'bubble-pop' && (
        <div className="max-w-xl mx-auto">
          <BubblePopGame
            topic={topic}
            words={words}
            onBackToMenu={() => setActiveGame('menu')}
            onAddStars={onAddStars}
          />
        </div>
      )}

      {activeGame === 'scramble' && (
        <div className="max-w-xl mx-auto">
          <WordScrambleGame
            topic={topic}
            words={words}
            onBackToMenu={() => setActiveGame('menu')}
            onAddStars={onAddStars}
          />
        </div>
      )}

      {activeGame === 'connect' && (
        <div className="max-w-2xl mx-auto">
          <WordConnectGame
            topic={topic}
            words={words}
            onBackToMenu={() => setActiveGame('menu')}
            onAddStars={onAddStars}
          />
        </div>
      )}

      {activeGame === 'detective' && (
        <div className="max-w-xl mx-auto">
          <PictureDetectiveGame
            topic={topic}
            words={words}
            onBackToMenu={() => setActiveGame('menu')}
            onAddStars={onAddStars}
          />
        </div>
      )}

      {activeGame === 'hide-seek' && (
        <div className="max-w-3xl mx-auto">
          <HideAndSeekGame
            topic={topic}
            words={words}
            onBackToMenu={() => setActiveGame('menu')}
            onAddStars={onAddStars}
            childName={childName}
            childNickname={childNickname}
          />
        </div>
      )}
    </div>
  );
};
