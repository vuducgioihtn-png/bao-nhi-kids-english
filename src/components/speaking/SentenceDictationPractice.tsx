import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2, RotateCcw, CheckCircle2, Star, Sparkles, Trophy,
  ChevronRight, ChevronLeft, Lightbulb, Keyboard, LayoutGrid,
  Check, ArrowRight, Eye, EyeOff, Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SpeakingPassage, ReadingSentence } from '../../data/passages/types';
import { sound } from '../../utils/audio';

interface SentenceDictationPracticeProps {
  passage: SpeakingPassage;
  onAddStars: (stars: number) => void;
  childName?: string;
  onCompleteAll?: () => void;
}

interface WordTile {
  id: string;
  text: string;
  originalIndex: number;
}

export const SentenceDictationPractice: React.FC<SentenceDictationPracticeProps> = ({
  passage,
  onAddStars,
  childName = 'Bảo Nhi',
}) => {
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [inputMode, setInputMode] = useState<'tiles' | 'typing'>('tiles');

  // Tile mode state
  const [availableTiles, setAvailableTiles] = useState<WordTile[]>([]);
  const [selectedTiles, setSelectedTiles] = useState<WordTile[]>([]);

  // Typing mode state
  const [typedText, setTypedText] = useState('');

  // Sentence feedback
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [completedSentenceIndices, setCompletedSentenceIndices] = useState<Set<number>>(new Set());
  const [isAllCompleted, setIsAllCompleted] = useState(false);

  const currentSentence: ReadingSentence | undefined = passage.sentences[currentSentenceIndex];

  // Helper to normalize sentence words for comparison
  const normalizeWord = (w: string) =>
    w.trim().toLowerCase().replace(/[.,!?;:'"“”]/g, '');

  // Split sentence into words preserving punctuation for display
  const getSentenceWords = (text: string): string[] => {
    return text.trim().split(/\s+/).filter(Boolean);
  };

  // Initialize current sentence
  const initSentence = (index: number) => {
    const s = passage.sentences[index];
    if (!s) return;

    setIsAnswerChecked(false);
    setIsCorrect(false);
    setShowHint(false);
    setTypedText('');

    const words = getSentenceWords(s.textEn);
    const tiles: WordTile[] = words.map((w, i) => ({
      id: `${w}-${i}-${Math.random()}`,
      text: w,
      originalIndex: i,
    }));

    // Shuffle tiles
    const shuffled = [...tiles].sort(() => 0.5 - Math.random());
    setAvailableTiles(shuffled);
    setSelectedTiles([]);

    // Auto play audio once with turtle/clear speech
    setTimeout(() => {
      sound.speak(s.textEn, 0.82, 1.05);
    }, 250);
  };

  // Reset when passage or current sentence changes
  useEffect(() => {
    initSentence(currentSentenceIndex);
  }, [currentSentenceIndex, passage.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // When passage changes, reset all completed
  useEffect(() => {
    setCurrentSentenceIndex(0);
    setCompletedSentenceIndices(new Set());
    setIsAllCompleted(false);
  }, [passage.id]);

  // Play normal audio
  const handlePlayAudio = () => {
    if (!currentSentence) return;
    sound.playTap();
    sound.speak(currentSentence.textEn, 0.85, 1.05);
  };

  // Play slow audio
  const handlePlaySlowAudio = () => {
    if (!currentSentence) return;
    sound.playTap();
    sound.speak(currentSentence.textEn, 0.65, 1.0);
  };

  // Tile clicked in bank (move to sentence)
  const handleTileSelect = (tile: WordTile) => {
    if (isCorrect) return;
    sound.playPop();
    sound.speak(tile.text.replace(/[.,!?;:]/g, ''), 0.9);

    setAvailableTiles((prev) => prev.filter((t) => t.id !== tile.id));
    setSelectedTiles((prev) => [...prev, tile]);
    setIsAnswerChecked(false);
  };

  // Tile clicked in sentence (return to bank)
  const handleTileRemove = (tile: WordTile) => {
    if (isCorrect) return;
    sound.playTap();
    setSelectedTiles((prev) => prev.filter((t) => t.id !== tile.id));
    setAvailableTiles((prev) => [...prev, tile]);
    setIsAnswerChecked(false);
  };

  // Check the answer in Tile mode
  const handleCheckTileAnswer = () => {
    if (!currentSentence) return;

    const targetWords = getSentenceWords(currentSentence.textEn);
    const userWords = selectedTiles.map((t) => t.text);

    // Compare normalized
    const isMatch =
      userWords.length === targetWords.length &&
      userWords.every((w, i) => normalizeWord(w) === normalizeWord(targetWords[i]));

    setIsAnswerChecked(true);

    if (isMatch) {
      handleAnswerSuccess();
    } else {
      setIsCorrect(false);
      sound.playWrong();
    }
  };

  // Check the answer in Typing mode
  const handleCheckTypingAnswer = () => {
    if (!currentSentence) return;

    const targetWords = getSentenceWords(currentSentence.textEn).map(normalizeWord);
    const userWords = getSentenceWords(typedText).map(normalizeWord);

    const isMatch =
      userWords.length === targetWords.length &&
      userWords.every((w, i) => w === targetWords[i]);

    setIsAnswerChecked(true);

    if (isMatch) {
      handleAnswerSuccess();
    } else {
      setIsCorrect(false);
      sound.playWrong();
    }
  };

  // Common success handler
  const handleAnswerSuccess = () => {
    setIsCorrect(true);
    sound.playCorrect();

    // Reward stars for this sentence
    onAddStars(2);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
    });

    const newCompleted = new Set(completedSentenceIndices);
    newCompleted.add(currentSentenceIndex);
    setCompletedSentenceIndices(newCompleted);

    // Speak entire sentence celebrating
    setTimeout(() => {
      if (currentSentence) {
        sound.speak(currentSentence.textEn, 0.85);
      }
    }, 400);

    // If all sentences in passage are completed!
    if (newCompleted.size >= passage.sentences.length) {
      setTimeout(() => {
        setIsAllCompleted(true);
        sound.playFanfare();
        onAddStars(6);
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
        });
      }, 1000);
    }
  };

  // Give a hint: Place the next correct tile automatically
  const handleAutoHintTile = () => {
    if (!currentSentence || isCorrect) return;
    sound.playTap();
    const targetWords = getSentenceWords(currentSentence.textEn);
    const nextExpectedIndex = selectedTiles.length;

    if (nextExpectedIndex >= targetWords.length) return;

    const nextExpectedWord = targetWords[nextExpectedIndex];
    // Find matching tile in availableTiles
    const matchingTile = availableTiles.find(
      (t) => normalizeWord(t.text) === normalizeWord(nextExpectedWord)
    );

    if (matchingTile) {
      handleTileSelect(matchingTile);
    }
  };

  // Next sentence
  const handleNext = () => {
    sound.playTap();
    if (currentSentenceIndex < passage.sentences.length - 1) {
      setCurrentSentenceIndex((prev) => prev + 1);
    }
  };

  // Prev sentence
  const handlePrev = () => {
    sound.playTap();
    if (currentSentenceIndex > 0) {
      setCurrentSentenceIndex((prev) => prev - 1);
    }
  };

  // Reset entire passage dictation
  const handleResetAll = () => {
    sound.playTap();
    setCompletedSentenceIndices(new Set());
    setIsAllCompleted(false);
    setCurrentSentenceIndex(0);
    initSentence(0);
  };

  if (!currentSentence) return null;

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-amber-200/80 space-y-4 animate-in fade-in duration-200">
      {/* ================= HEADER: STEPPER & CONTROLS ================= */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-amber-100">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-800 text-xl font-bold shadow-2xs">
            ✍️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                Nghe & Viết Lại Từng Câu (Dictation)
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                {completedSentenceIndices.size}/{passage.sentences.length} câu hoàn thành
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Lắng nghe phát âm và ghép các từ thành câu tiếng Anh hoàn chỉnh
            </p>
          </div>
        </div>

        {/* Mode Toggle: Word Tiles vs Keyboard */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              setInputMode('tiles');
            }}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              inputMode === 'tiles'
                ? 'bg-white text-amber-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5 text-amber-600" />
            <span>Ghép Thẻ Từ</span>
          </button>
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              setInputMode('typing');
            }}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              inputMode === 'typing'
                ? 'bg-white text-amber-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5 text-amber-600" />
            <span>Tự Gõ Phím</span>
          </button>
        </div>
      </div>

      {/* ================= STEPPER CHIPS ================= */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {passage.sentences.map((_, idx) => {
          const isDone = completedSentenceIndices.has(idx);
          const isCurrent = idx === currentSentenceIndex;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => {
                sound.playTap();
                setCurrentSentenceIndex(idx);
              }}
              className={`flex-1 min-w-[70px] py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer select-none ${
                isCurrent
                  ? 'bg-amber-500 text-white shadow-xs ring-2 ring-amber-400 scale-[1.02]'
                  : isDone
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                  : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-amber-50'
              }`}
            >
              {isDone ? (
                <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
              ) : (
                <span>#{idx + 1}</span>
              )}
              <span>Câu {idx + 1}</span>
            </button>
          );
        })}
      </div>

      {/* ================= MAIN PRACTICE BOX ================= */}
      {!isAllCompleted ? (
        <div className="bg-gradient-to-b from-amber-50/60 to-orange-50/30 rounded-3xl p-4 sm:p-6 border border-amber-200/80 space-y-4">
          {/* Audio Listening Control Card */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-amber-200 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handlePlayAudio}
                className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white flex items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer shrink-0"
                title="Bấm để nghe phát âm chuẩn"
              >
                <Volume2 className="w-6 h-6 animate-pulse" />
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
                    Câu số {currentSentenceIndex + 1}/{passage.sentences.length}
                  </span>
                  <button
                    type="button"
                    onClick={handlePlaySlowAudio}
                    className="text-[11px] font-bold text-amber-800 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded-lg border border-amber-200/70 transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span>🐢</span>
                    <span>Nghe Chậm Rõ Chữ</span>
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Bấm loa để nghe giọng đọc mẫu và ghép lại câu hoàn chỉnh
                </p>
              </div>
            </div>

            {/* Vietnamese Meaning & Clues */}
            <div className="text-right sm:text-right w-full sm:w-auto">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                Nghĩa tiếng Việt
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-700 leading-tight">
                {currentSentence.textVi}
              </p>
            </div>
          </div>

          {/* Pronunciation IPA / Gợi ý đọc */}
          {(currentSentence.ipa || currentSentence.readVi) && (
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
              {currentSentence.ipa && (
                <span className="font-mono text-amber-900 bg-white/80 px-2.5 py-1 rounded-xl border border-amber-200/80 shadow-2xs">
                  {currentSentence.ipa.startsWith('/') ? currentSentence.ipa : `/${currentSentence.ipa}/`}
                </span>
              )}
              {currentSentence.readVi && (
                <span className="text-amber-950 bg-amber-100/80 px-2.5 py-1 rounded-xl font-medium border border-amber-200/60 shadow-2xs">
                  🗣️ Gợi ý cách đọc: <strong>{currentSentence.readVi}</strong>
                </span>
              )}
            </div>
          )}

          {/* ================= MODE 1: WORD TILES ASSEMBLER ================= */}
          {inputMode === 'tiles' && (
            <div className="space-y-4">
              {/* Drop / Assembled Area */}
              <div
                className={`min-h-[72px] sm:min-h-[80px] p-3 rounded-2xl border-2 border-dashed transition-all flex flex-wrap items-center gap-2 ${
                  isCorrect
                    ? 'bg-emerald-50/80 border-emerald-400'
                    : isAnswerChecked && !isCorrect
                    ? 'bg-rose-50/60 border-rose-300'
                    : selectedTiles.length > 0
                    ? 'bg-white border-amber-300 shadow-xs'
                    : 'bg-white/80 border-amber-200'
                }`}
              >
                {selectedTiles.length === 0 ? (
                  <div className="w-full text-center text-xs text-slate-400 select-none py-2">
                    Chạm các khối từ bên dưới theo đúng thứ tự câu nghe được...
                  </div>
                ) : (
                  selectedTiles.map((tile) => (
                    <button
                      key={tile.id}
                      type="button"
                      onClick={() => handleTileRemove(tile)}
                      disabled={isCorrect}
                      className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer select-none active:scale-95 animate-in zoom-in-90 duration-150 ${
                        isCorrect
                          ? 'bg-emerald-500 text-white'
                          : 'bg-amber-500 text-white hover:bg-amber-600'
                      }`}
                      title="Chạm để gỡ từ này"
                    >
                      <span>{tile.text}</span>
                    </button>
                  ))
                )}
              </div>

              {/* Bank of available scrambled tiles */}
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-semibold">
                  <span>Khối từ có sẵn (chạm để đưa vào câu):</span>
                  {availableTiles.length > 0 && !isCorrect && (
                    <button
                      type="button"
                      onClick={handleAutoHintTile}
                      className="text-amber-700 hover:text-amber-900 flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                      <span>Gợi ý từ tiếp theo</span>
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 min-h-[50px]">
                  {availableTiles.map((tile) => (
                    <button
                      key={tile.id}
                      type="button"
                      onClick={() => handleTileSelect(tile)}
                      disabled={isCorrect}
                      className="px-3.5 py-2 bg-white hover:bg-amber-100/80 text-slate-800 hover:text-amber-950 font-bold text-xs sm:text-sm rounded-xl border border-amber-200/90 shadow-2xs hover:shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer select-none"
                    >
                      {tile.text}
                    </button>
                  ))}
                  {availableTiles.length === 0 && selectedTiles.length > 0 && !isCorrect && (
                    <span className="text-xs text-slate-400 italic">
                      Đã ghép đủ tất cả các từ. Bé hãy bấm nút &ldquo;Kiểm Tra&rdquo; bên dưới nhé!
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================= MODE 2: TYPING DICTATION ================= */}
          {inputMode === 'typing' && (
            <div className="space-y-3">
              <div className="relative">
                <textarea
                  rows={2}
                  value={typedText}
                  disabled={isCorrect}
                  onChange={(e) => {
                    setTypedText(e.target.value);
                    setIsAnswerChecked(false);
                  }}
                  placeholder="Lắng nghe và gõ lại toàn bộ câu tiếng Anh tại đây..."
                  className={`w-full p-3.5 text-sm sm:text-base font-medium rounded-2xl border-2 focus:outline-none focus:ring-2 focus:bg-white transition-all resize-none ${
                    isCorrect
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-950 ring-emerald-300'
                      : isAnswerChecked && !isCorrect
                      ? 'bg-rose-50 border-rose-400 text-slate-900 ring-rose-200'
                      : 'bg-white border-amber-200 focus:ring-amber-400 text-slate-900'
                  }`}
                />
              </div>

              {/* Hint button */}
              {!isCorrect && (
                <div className="flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => setShowHint(!showHint)}
                    className="text-amber-700 hover:text-amber-900 font-semibold flex items-center gap-1"
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    <span>{showHint ? 'Ẩn câu mẫu' : 'Xem câu mẫu để học'}</span>
                  </button>

                  {showHint && (
                    <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-lg">
                      &ldquo;{currentSentence.textEn}&rdquo;
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ================= FEEDBACK MESSAGE ================= */}
          {isAnswerChecked && (
            <div
              className={`p-3.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2.5 animate-in fade-in duration-200 ${
                isCorrect
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-rose-100 text-rose-900 border border-rose-300'
              }`}
            >
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div className="flex-1">
                    <span>Xuất sắc quá! Bé {childName} đã viết hoàn toàn chính xác! (+2 ⭐)</span>
                    <span className="block text-[11px] font-normal text-emerald-700 mt-0.5">
                      Đọc to câu này để nhớ sâu hơn nhé: &ldquo;{currentSentence.textEn}&rdquo;
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <RotateCcw className="w-5 h-5 text-rose-600 shrink-0" />
                  <div>
                    <span>Chưa đúng thứ tự rồi! Bé hãy bấm nghe lại và điều chỉnh lại nhé!</span>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ================= ACTION BUTTONS ================= */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              disabled={currentSentenceIndex === 0}
              onClick={handlePrev}
              className="px-3.5 py-2 bg-white hover:bg-slate-100 disabled:opacity-40 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1 border border-slate-200 transition-all cursor-pointer shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Câu trước</span>
            </button>

            <div className="flex items-center gap-2">
              {!isCorrect ? (
                <>
                  <button
                    type="button"
                    onClick={() => initSentence(currentSentenceIndex)}
                    className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-600 font-bold rounded-xl text-xs border border-slate-200 transition-all cursor-pointer"
                    title="Xếp lại từ đầu"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={inputMode === 'tiles' ? handleCheckTileAnswer : handleCheckTypingAnswer}
                    disabled={inputMode === 'tiles' ? selectedTiles.length === 0 : !typedText.trim()}
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white font-extrabold rounded-xl text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Kiểm Tra Câu Này</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={currentSentenceIndex >= passage.sentences.length - 1}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <span>Câu Tiếp Theo</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ================= ALL COMPLETED VICTORY CARD ================= */
        <div className="text-center py-6 sm:py-8 space-y-4 bg-gradient-to-b from-amber-50 to-orange-50/40 rounded-3xl border-2 border-amber-300 p-6 animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center text-3xl mx-auto shadow-md ring-4 ring-amber-200">
            🏆
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Bé {childName} Đã Hoàn Thành Bài Nghe Viết!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
              Chúc mừng bé đã nghe và ghép đúng toàn bộ các câu trong bài <strong>&ldquo;{passage.titleEn}&rdquo;</strong>!
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-900 font-extrabold rounded-2xl border border-amber-300 text-xs sm:text-sm shadow-2xs">
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>Thưởng thêm: +6 Sao Vinh Danh ⭐</span>
          </div>

          {/* List of completed sentences review */}
          <div className="max-w-lg mx-auto bg-white rounded-2xl p-3 border border-amber-200 text-left space-y-2 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Tất cả các câu bé vừa chinh phục:
            </span>
            {passage.sentences.map((s, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-amber-50/50 border border-slate-200/80 transition-all text-xs"
              >
                <div>
                  <span className="font-bold text-slate-800 block">
                    {i + 1}. {s.textEn}
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    {s.textVi}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => sound.speak(s.textEn, 0.85)}
                  className="p-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800 transition-all cursor-pointer shrink-0"
                  title="Nghe lại"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleResetAll}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Luyện Lại Bài Này</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
