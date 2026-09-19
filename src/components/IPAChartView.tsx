import React, { useState, useMemo } from 'react';
import {
  Sparkles, Volume2, Turtle, Trophy, ArrowRightLeft, BookOpen,
  Printer, Info, CheckCircle2, HelpCircle, Layers
} from 'lucide-react';
import {
  IPA_SOUNDS_DATA,
  IPASoundItem,
  IPACategory,
  CONTRAST_PAIRS
} from '../data/ipaData';
import { IPATile } from './ipa/IPATile';
import { IPADetailModal } from './ipa/IPADetailModal';
import { IPAContrastPairs } from './ipa/IPAContrastPairs';
import { IPAGameQuiz } from './ipa/IPAGameQuiz';
import { sound } from '../utils/audio';
import { speakIPASound } from '../utils/ipaAudio';
import { ChildProfile } from '../types';

interface IPAChartViewProps {
  onAddStars: (count: number) => void;
  childProfile?: ChildProfile;
}

type IPATab = 'chart' | 'contrast' | 'game';
type SoundFilter = 'all' | 'monophthong' | 'diphthong' | 'consonant' | 'voiced' | 'voiceless';

export const IPAChartView: React.FC<IPAChartViewProps> = ({
  onAddStars,
  childProfile,
}) => {
  const [currentTab, setCurrentTab] = useState<IPATab>('chart');
  const [filter, setFilter] = useState<SoundFilter>('all');
  const [selectedSound, setSelectedSound] = useState<IPASoundItem | null>(null);
  const [slowAudio, setSlowAudio] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);

  // Group sounds for the canonical chart layout
  const monophthongs = useMemo(
    () => IPA_SOUNDS_DATA.filter((s) => s.category === 'monophthong'),
    []
  );

  const diphthongs = useMemo(
    () => IPA_SOUNDS_DATA.filter((s) => s.category === 'diphthong'),
    []
  );

  const consonants = useMemo(
    () => IPA_SOUNDS_DATA.filter((s) => s.category === 'consonant'),
    []
  );

  // Quick audio play from tile button
  const handleQuickPlay = (e: React.MouseEvent, item: IPASoundItem) => {
    e.stopPropagation();
    setPlayingId(item.id);
    speakIPASound(item, slowAudio);
    setTimeout(() => {
      setPlayingId(null);
    }, 1200);
  };

  const handlePrint = () => {
    window.print();
  };

  // Filter checker for highlighting
  const isSoundHighlighted = (item: IPASoundItem) => {
    if (filter === 'all') return true;
    if (filter === 'monophthong') return item.category === 'monophthong';
    if (filter === 'diphthong') return item.category === 'diphthong';
    if (filter === 'consonant') return item.category === 'consonant';
    if (filter === 'voiced') return item.isVoiced === true;
    if (filter === 'voiceless') return item.isVoiced === false;
    return true;
  };

  return (
    <div className="space-y-4 px-2 sm:px-4 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border-2 border-amber-200/80 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-amber-400 to-rose-400 text-white flex items-center justify-center text-2xl shadow-sm">
            🔤
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-xl font-black text-amber-950 font-heading">
                Bảng Phiên Âm Tiếng Anh IPA 44 Âm Quốc Tế
              </h1>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Chuẩn Oxford & BMyC Kids
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Hình ảnh trực quan sinh động & khẩu hình chuẩn - Chạm vào từng âm để nghe, tập nói và nhận thưởng sao ⭐!
            </p>
          </div>
        </div>

        {/* Global Sound Speed & Print Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              setSlowAudio(!slowAudio);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              slowAudio
                ? 'bg-emerald-100 border-emerald-300 text-emerald-800 shadow-2xs'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
            }`}
            title="Đổi tốc độ đọc chậm hơn cho trẻ mới học"
          >
            <Turtle className="w-4 h-4 text-emerald-600" />
            <span>{slowAudio ? 'Tốc độ: 0.65x (Chậm)' : 'Tốc độ: 1.0x'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            title="In bảng 44 âm IPA ra giấy màu"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">In Bảng</span>
          </button>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center justify-between border-b border-amber-200/60 pb-1 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              setCurrentTab('chart');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
              currentTab === 'chart'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white hover:bg-amber-50 text-slate-700 border border-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Bảng 44 Âm Chuẩn (Bản Đồ IPA)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playTap();
              setCurrentTab('contrast');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
              currentTab === 'contrast'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white hover:bg-amber-50 text-slate-700 border border-slate-200'
            }`}
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>Cặp Âm Dễ Nhầm (12 Cặp)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playTap();
              setCurrentTab('game');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
              currentTab === 'game'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white hover:bg-amber-50 text-slate-700 border border-slate-200'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Trò Chơi Thử Tài 44 Âm 🎮</span>
          </button>
        </div>
      </div>

      {/* View: Standard Canonical Chart */}
      {currentTab === 'chart' && (
        <div className="space-y-5">
          {/* Filter Chips Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="font-bold text-slate-500 shrink-0 mr-1">Bộ lọc:</span>
            {[
              { id: 'all' as SoundFilter, label: 'Tất cả 44 Âm' },
              { id: 'monophthong' as SoundFilter, label: '12 Nguyên Âm Đơn (Monophthongs)' },
              { id: 'diphthong' as SoundFilter, label: '8 Nguyên Âm Đôi (Diphthongs)' },
              { id: 'consonant' as SoundFilter, label: '24 Phụ Âm (Consonants)' },
              { id: 'voiced' as SoundFilter, label: 'Âm Rung (Voiced 🎵)' },
              { id: 'voiceless' as SoundFilter, label: 'Âm Gió (Voiceless 💨)' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  sound.playTap();
                  setFilter(f.id);
                }}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                  filter === f.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white hover:bg-amber-50 text-slate-600 border border-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* COLOR LEGEND BAR */}
          <div className="flex items-center justify-between flex-wrap gap-2 text-[11px] sm:text-xs bg-amber-50/60 p-2.5 rounded-2xl border border-amber-200/60">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-md bg-emerald-200 border border-emerald-400"></span>
                <span className="font-semibold text-slate-700">Nguyên âm dài (ngân 2s)</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-md bg-teal-200 border border-teal-400"></span>
                <span className="font-semibold text-slate-700">Nguyên âm ngắn (dứt khoát)</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-md bg-purple-200 border border-purple-400"></span>
                <span className="font-semibold text-slate-700">Nguyên âm đôi (trượt âm)</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-md bg-amber-200 border border-amber-400"></span>
                <span className="font-semibold text-slate-700">Âm gió (không rung 💨)</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-md bg-sky-200 border border-sky-400"></span>
                <span className="font-semibold text-slate-700">Âm rung (dây thanh quản 🎵)</span>
              </span>
            </div>
            <span className="text-slate-500 font-medium">
              💡 Bấm vào ô bất kỳ để xem hướng dẫn khẩu hình & tập nói!
            </span>
          </div>

          {/* CANONICAL 44 SOUNDS CHART (MATCHING USER'S PHOTO STRUCTURE) */}
          <div className="bg-white rounded-3xl border-2 border-slate-300 shadow-md p-3 sm:p-5 space-y-6">
            {/* 1. TOP BOX: VOWELS (NGUYÊN ÂM - 20 ÂM) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b-2 border-slate-800 pb-1.5">
                <div className="text-base sm:text-lg font-black tracking-wider text-slate-900 uppercase font-heading flex items-center gap-2">
                  <span>Vowels</span>
                  <span className="text-xs font-bold text-slate-500 normal-case">(20 Nguyên Âm)</span>
                </div>
                <div className="hidden sm:flex items-center gap-4 text-xs font-bold text-slate-600">
                  <span>Monophthongs (12 Âm Đơn)</span>
                  <span>&bull;</span>
                  <span>Diphthongs (8 Âm Đôi)</span>
                </div>
              </div>

              {/* Monophthongs + Diphthongs Flex / Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
                {/* Monophthongs Box (Left: 4 cols on standard grid) */}
                <div className="lg:col-span-7 bg-slate-50/50 p-2 sm:p-3 rounded-2xl border border-slate-200 space-y-2">
                  <div className="text-center font-bold text-xs text-emerald-900 uppercase tracking-wider bg-emerald-100/60 py-1 rounded-xl">
                    Monophthongs (Nguyên Âm Đơn)
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {monophthongs.map((item) => (
                      <div
                        key={item.id}
                        className={isSoundHighlighted(item) ? 'opacity-100' : 'opacity-30'}
                      >
                        <IPATile
                          item={item}
                          isSelected={selectedSound?.id === item.id}
                          isPlaying={playingId === item.id}
                          onSelect={setSelectedSound}
                          onQuickPlay={handleQuickPlay}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Diphthongs Box (Right: 3 cols on standard grid) */}
                <div className="lg:col-span-5 bg-purple-50/30 p-2 sm:p-3 rounded-2xl border border-purple-200/70 space-y-2">
                  <div className="text-center font-bold text-xs text-purple-900 uppercase tracking-wider bg-purple-100/60 py-1 rounded-xl">
                    Diphthongs (Nguyên Âm Đôi)
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {diphthongs.map((item) => (
                      <div
                        key={item.id}
                        className={isSoundHighlighted(item) ? 'opacity-100' : 'opacity-30'}
                      >
                        <IPATile
                          item={item}
                          isSelected={selectedSound?.id === item.id}
                          isPlaying={playingId === item.id}
                          onSelect={setSelectedSound}
                          onQuickPlay={handleQuickPlay}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. BOTTOM BOX: CONSONANTS (PHỤ ÂM - 24 ÂM) */}
            <div className="space-y-2 pt-2 border-t-2 border-slate-800">
              <div className="flex items-center justify-between border-b-2 border-slate-800 pb-1.5">
                <div className="text-base sm:text-lg font-black tracking-wider text-slate-900 uppercase font-heading flex items-center gap-2">
                  <span>Consonants</span>
                  <span className="text-xs font-bold text-slate-500 normal-case">(24 Phụ Âm)</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-bold">
                  <span className="text-amber-800 flex items-center gap-1">
                    <span>💨</span>
                    <span className="hidden sm:inline">Âm Gió (Voiceless)</span>
                  </span>
                  <span>&bull;</span>
                  <span className="text-sky-800 flex items-center gap-1">
                    <span>🎵</span>
                    <span className="hidden sm:inline">Âm Rung (Voiced)</span>
                  </span>
                </div>
              </div>

              {/* 24 Consonants 8 columns layout (matching exactly the photo!) */}
              <div className="bg-slate-50/50 p-2 sm:p-3 rounded-2xl border border-slate-200">
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
                  {consonants.map((item) => (
                    <div
                      key={item.id}
                      className={isSoundHighlighted(item) ? 'opacity-100' : 'opacity-30'}
                    >
                      <IPATile
                        item={item}
                        isSelected={selectedSound?.id === item.id}
                        isPlaying={playingId === item.id}
                        onSelect={setSelectedSound}
                        onQuickPlay={handleQuickPlay}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Guide Card for Kids & Parents */}
          <div className="bg-linear-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-4 sm:p-5 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-200/70 text-amber-900 shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div className="space-y-1 text-xs sm:text-sm text-slate-700">
              <h4 className="font-extrabold text-amber-950">
                Bí Quyết Giúp Bé Nắm Vững 44 Âm IPA Của BMyC:
              </h4>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li>
                  <span className="font-semibold text-slate-800">Âm có dấu hai chấm (:)</span> là nguyên âm dài, bé nhớ ngân dài 2 giây và làm đúng khẩu hình.
                </li>
                <li>
                  <span className="font-semibold text-slate-800">Âm Vô Thanh (💨):</span> Đặt bàn tay trước miệng, khi phát âm có luồng gió thổi mát vào lòng bàn tay, cổ họng hoàn toàn không rung.
                </li>
                <li>
                  <span className="font-semibold text-slate-800">Âm Hữu Thanh (🎵):</span> Đặt 2 ngón tay lên cổ họng, bé sẽ cảm nhận được dây thanh quản rung râm ran rất thích thú.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* View: Contrast Tricky Pairs */}
      {currentTab === 'contrast' && (
        <IPAContrastPairs
          onSelectSound={setSelectedSound}
          onAddStars={onAddStars}
        />
      )}

      {/* View: Interactive Mini Game Quiz */}
      {currentTab === 'game' && (
        <IPAGameQuiz
          onAddStars={onAddStars}
          onSelectSound={setSelectedSound}
        />
      )}

      {/* Interactive Detail Sound Modal */}
      <IPADetailModal
        item={selectedSound}
        onClose={() => setSelectedSound(null)}
        onSelectAnother={setSelectedSound}
        onAddStars={onAddStars}
        slowAudio={slowAudio}
      />
    </div>
  );
};
