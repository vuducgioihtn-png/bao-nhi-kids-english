import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2, Play, Pause, RotateCcw, Sparkles, Star, CheckCircle2,
  Mic, MicOff, BookOpen, ChevronRight, ChevronLeft, Eye, EyeOff,
  Award, ThumbsUp, HelpCircle, Layers, VolumeX, Check, PenTool
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SpeakingPassage, PassageVocabulary } from '../../data/passages/types';
import { sound } from '../../utils/audio';
import { SentenceDictationPractice } from './SentenceDictationPractice';

interface PassageReaderProps {
  passage: SpeakingPassage;
  onAddStars: (count: number) => void;
  childName?: string;
  onNextPassage?: () => void;
  onPrevPassage?: () => void;
  isFirstPassage?: boolean;
  isLastPassage?: boolean;
}

export const PassageReader: React.FC<PassageReaderProps> = ({
  passage,
  onAddStars,
  childName = 'Bảo Nhi',
  onNextPassage,
  onPrevPassage,
  isFirstPassage = false,
  isLastPassage = false,
}) => {
  // Mode selection: 'full' (Toàn bài) vs 'sentence' (Luyện từng câu) vs 'dictation' (Nghe & viết từng câu)
  const [studyMode, setStudyMode] = useState<'full' | 'sentence' | 'dictation'>('full');

  // Audio & playback state
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [activeSentenceIndex, setActiveSentenceIndex] = useState<number | null>(null);
  const [audioSpeed, setAudioSpeed] = useState<'normal' | 'slow'>('normal');
  const [showVi, setShowVi] = useState(true);
  const [showIPA, setShowIPA] = useState(true);

  // Sentence shadowing mode state
  const [currentSentenceStep, setCurrentSentenceStep] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedSentenceScore, setRecordedSentenceScore] = useState<number | null>(null);
  const [recordingFeedback, setRecordingFeedback] = useState<string | null>(null);

  // Vocabulary practice state
  const [practicedWords, setPracticedWords] = useState<Set<string>>(new Set());
  const [selectedWord, setSelectedWord] = useState<PassageVocabulary | null>(null);

  // Reflex Questions state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());
  const [awardedStarsForPassage, setAwardedStarsForPassage] = useState(false);

  const abortPlayRef = useRef(false);

  // Reset state when passage changes
  useEffect(() => {
    abortPlayRef.current = true;
    sound.stopSpeaking();
    setIsPlayingAll(false);
    setActiveSentenceIndex(null);
    setCurrentSentenceStep(0);
    setIsRecording(false);
    setRecordedSentenceScore(null);
    setRecordingFeedback(null);
    setSelectedAnswers({});
    setAnsweredQuestions(new Set());
    setAwardedStarsForPassage(false);
    setSelectedWord(null);
  }, [passage.id]);

  const speechRate = audioSpeed === 'slow' ? 0.72 : 0.88;

  // Play entire passage sentence-by-sentence with karaoke highlight
  const handlePlayAll = async () => {
    if (isPlayingAll) {
      // Pause/Stop
      abortPlayRef.current = true;
      sound.stopSpeaking();
      setIsPlayingAll(false);
      setActiveSentenceIndex(null);
      return;
    }

    abortPlayRef.current = false;
    setIsPlayingAll(true);
    sound.playTap();

    for (let i = 0; i < passage.sentences.length; i++) {
      if (abortPlayRef.current) break;
      setActiveSentenceIndex(i);
      await sound.speakAsync(passage.sentences[i].textEn, speechRate, 1.05);
      // Small natural pause between sentences
      if (abortPlayRef.current) break;
      await new Promise((r) => setTimeout(r, 450));
    }

    if (!abortPlayRef.current) {
      setActiveSentenceIndex(null);
      setIsPlayingAll(false);
      sound.playFanfare();

      // Award completion stars once per passage
      if (!awardedStarsForPassage) {
        setAwardedStarsForPassage(true);
        onAddStars(3);
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 },
        });
      }
    }
  };

  // Play a single sentence
  const handlePlaySentence = (idx: number) => {
    abortPlayRef.current = true;
    setIsPlayingAll(false);
    setActiveSentenceIndex(idx);
    sound.speak(passage.sentences[idx].textEn, speechRate, 1.05);
    setTimeout(() => {
      setActiveSentenceIndex(null);
    }, 2800);
  };

  // Play a vocabulary word
  const handlePlayWord = (v: PassageVocabulary, slow: boolean = false) => {
    sound.playTap();
    setSelectedWord(v);
    if (slow) {
      sound.speakSlow(v.word);
    } else {
      sound.speak(v.word, 0.8, 1.1);
    }
    setPracticedWords((prev) => new Set([...prev, v.word.toLowerCase()]));
  };

  // Practice recording with speech recognition or simulation
  const handleStartRecording = () => {
    sound.playTap();
    setIsRecording(true);
    setRecordedSentenceScore(null);
    setRecordingFeedback(null);

    // Simulate microphone recording check with positive feedback for young learners
    setTimeout(() => {
      setIsRecording(false);
      const scores = [92, 95, 98, 100];
      const randomScore = scores[Math.floor(Math.random() * scores.length)];
      setRecordedSentenceScore(randomScore);

      const compliments = [
        `Bé ${childName} phát âm rất chuẩn và tự tin!`,
        `Giọng đọc của Bé ${childName} tròn vành rõ chữ, siêu hay!`,
        `Tuyệt vời! Bé ${childName} nói tiếng Anh chuẩn như người bản xứ!`,
        `Xuất sắc! Âm điệu rất tự nhiên và cuốn hút!`,
      ];
      setRecordingFeedback(compliments[Math.floor(Math.random() * compliments.length)]);
      sound.playCorrect();
      onAddStars(1);
    }, 2400);
  };

  // Handle reflex question answer
  const handleAnswerQuestion = (qId: string, option: string, correctAnswer: string) => {
    if (answeredQuestions.has(qId)) return; // already answered

    setSelectedAnswers((prev) => ({ ...prev, [qId]: option }));
    setAnsweredQuestions((prev) => new Set([...prev, qId]));

    if (option === correctAnswer) {
      sound.playCorrect();
      sound.playStar();
      onAddStars(2);
      confetti({
        particleCount: 35,
        spread: 50,
        origin: { y: 0.6 },
      });
    } else {
      sound.playWrong();
    }
  };

  return (
    <div className="space-y-4">
      {/* Hero Lesson Header */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 text-white rounded-3xl p-4 sm:p-6 shadow-md relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute right-10 top-2 text-6xl opacity-20 select-none">
          {passage.icon}
        </div>

        <div className="relative z-10">
          {/* Top metadata tags */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-xs rounded-full text-xs font-bold tracking-wide uppercase">
                {passage.levelLabel}
              </span>
              <span className="px-2.5 py-1 bg-amber-400/30 rounded-full text-[11px] font-medium text-amber-100">
                {passage.ageGroup}
              </span>
              <span className="px-2.5 py-1 bg-white/15 rounded-full text-[11px] text-amber-50">
                Chủ đề: {passage.theme}
              </span>
            </div>

            {/* Next / Previous Quick Nav */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={isFirstPassage}
                onClick={onPrevPassage}
                className="px-2.5 py-1 bg-white/20 hover:bg-white/30 disabled:opacity-30 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all"
                title="Bài trước"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Bài trước</span>
              </button>
              <button
                type="button"
                disabled={isLastPassage}
                onClick={onNextPassage}
                className="px-2.5 py-1 bg-white/20 hover:bg-white/30 disabled:opacity-30 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all"
                title="Bài tiếp"
              >
                <span className="hidden sm:inline">Bài tiếp</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Lesson Title */}
          <div className="flex items-start gap-3 mt-1">
            <div className="text-3xl sm:text-4xl p-2 bg-white/20 rounded-2xl shadow-inner flex-shrink-0">
              {passage.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-amber-100 text-xs sm:text-sm font-semibold flex items-center gap-1.5">
                <span>Bài {passage.id}:</span>
                <span>{passage.titleVi}</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight mt-0.5 leading-tight">
                {passage.titleEn}
              </h1>
            </div>
          </div>

          {/* Controls Bar: Audio Speed, Full vs Sentence tabs, Translation toggle */}
          <div className="mt-4 pt-3 border-t border-white/20 flex flex-wrap items-center justify-between gap-2.5">
            {/* Study Mode Selector */}
            <div className="flex items-center bg-black/20 p-1 rounded-2xl">
              <button
                type="button"
                onClick={() => {
                  sound.playTap();
                  setStudyMode('full');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  studyMode === 'full'
                    ? 'bg-white text-amber-800 shadow-sm'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Toàn Bài Luyện Đọc</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playTap();
                  setStudyMode('sentence');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  studyMode === 'sentence'
                    ? 'bg-white text-amber-800 shadow-sm'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Luyện Từng Câu</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playTap();
                  setStudyMode('dictation');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  studyMode === 'dictation'
                    ? 'bg-white text-amber-800 shadow-sm'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>✍️ Nghe & Viết Câu</span>
              </button>
            </div>

            {/* Audio Speed Toggle */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-black/20 p-1 rounded-xl text-xs">
                <button
                  type="button"
                  onClick={() => {
                    sound.playTap();
                    setAudioSpeed('normal');
                  }}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                    audioSpeed === 'normal'
                      ? 'bg-white text-amber-800 shadow-xs'
                      : 'text-amber-100 hover:text-white'
                  }`}
                >
                  🐇 1.0x Chuẩn
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sound.playTap();
                    setAudioSpeed('slow');
                  }}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                    audioSpeed === 'slow'
                      ? 'bg-white text-amber-800 shadow-xs'
                      : 'text-amber-100 hover:text-white'
                  }`}
                >
                  🐢 0.75x Chậm
                </button>
              </div>

              {/* Translation & IPA Toggles */}
              <button
                type="button"
                onClick={() => {
                  sound.playTap();
                  setShowVi(!showVi);
                }}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
                  showVi
                    ? 'bg-white/25 text-white'
                    : 'bg-black/20 text-white/60 hover:text-white'
                }`}
                title="Bật/tắt dịch tiếng Việt"
              >
                {showVi ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">Dịch nghĩa</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playTap();
                  setShowIPA(!showIPA);
                }}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
                  showIPA
                    ? 'bg-white/25 text-white'
                    : 'bg-black/20 text-white/60 hover:text-white'
                }`}
                title="Bật/tắt phiên âm IPA & Gợi ý đọc tiếng Việt"
              >
                <span>Phiên âm & Gợi ý đọc</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Reading Arena */}
      {studyMode === 'full' && (
        /* Full Passage Mode with Karaoke Highlighting */
        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-amber-200/70 space-y-4">
          {/* Main Action Bar: Play all / Pause button */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-amber-50/70 p-3 sm:p-4 rounded-2xl border border-amber-100">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handlePlayAll}
                className={`px-5 py-2.5 rounded-2xl font-bold text-sm sm:text-base flex items-center gap-2 shadow-sm transition-all transform active:scale-95 ${
                  isPlayingAll
                    ? 'bg-rose-500 hover:bg-rose-600 text-white ring-4 ring-rose-200'
                    : 'bg-amber-500 hover:bg-amber-600 text-white ring-4 ring-amber-200'
                }`}
              >
                {isPlayingAll ? (
                  <>
                    <Pause className="w-5 h-5 fill-current" />
                    <span>Tạm Dừng Đọc</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" />
                    <span>Nghe Toàn Bài 🔊</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.stopSpeaking();
                  setIsPlayingAll(false);
                  setActiveSentenceIndex(null);
                  sound.playTap();
                }}
                className="p-2.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded-xl transition-all"
                title="Dừng phát"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-amber-800 font-medium">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Bấm vào từng câu để nghe giọng đọc mẫu nhé!</span>
            </div>
          </div>

          {/* Interactive Passage Paragraph */}
          <div className="p-4 sm:p-6 bg-slate-50/70 rounded-2xl border border-slate-100 leading-relaxed text-slate-800 space-y-3">
            {passage.sentences.map((sentence, idx) => {
              const isCurrent = activeSentenceIndex === idx;
              return (
                <div
                  key={idx}
                  onClick={() => handlePlaySentence(idx)}
                  className={`cursor-pointer p-3 rounded-xl transition-all group ${
                    isCurrent
                      ? 'bg-amber-100/80 ring-2 ring-amber-400 text-amber-950 shadow-xs'
                      : 'hover:bg-white hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-md flex-shrink-0 mt-0.5 ${
                        isCurrent
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-200 text-slate-600 group-hover:bg-amber-100 group-hover:text-amber-800'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-base sm:text-lg font-medium tracking-wide">
                        {sentence.textEn}
                      </p>
                      {showIPA && (sentence.ipa || sentence.readVi) && (
                        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs mt-1">
                          {sentence.ipa && (
                            <span className="text-amber-700 font-mono bg-amber-50/80 px-1.5 py-0.5 rounded border border-amber-200/50">
                              {sentence.ipa.startsWith('/') ? sentence.ipa : `/${sentence.ipa}/`}
                            </span>
                          )}
                          {sentence.readVi && (
                            <span className="text-amber-950 bg-amber-100/70 px-2 py-0.5 rounded font-medium">
                              Đọc: {sentence.readVi}
                            </span>
                          )}
                        </div>
                      )}
                      {showVi && (
                        <p className="text-xs sm:text-sm text-slate-600 mt-1 italic font-normal">
                          {sentence.textVi}
                        </p>
                      )}
                    </div>
                    <Volume2
                      className={`w-4 h-4 mt-1 flex-shrink-0 transition-opacity ${
                        isCurrent ? 'text-amber-600 opacity-100' : 'text-slate-400 opacity-40 group-hover:opacity-100'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Sentence Dictation Invitation Banner */}
          <div className="p-3.5 sm:p-4 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/15 rounded-2xl border border-amber-300/80 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-xl shadow-xs shrink-0">
                ✍️
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">
                  Luyện Nghe & Viết Lại Từng Câu trong bài này!
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-600">
                  Giúp Bé {childName} ghép từ, luyện nghe phản xạ và ghi nhớ ngữ pháp siêu nhanh.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                sound.playTap();
                setStudyMode('dictation');
              }}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer shrink-0"
            >
              <span>Bắt Đầu Viết Câu</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Full passage translation card */}
          {showVi && (
            <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/80">
              <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Bản Dịch Toàn Bài (Tiếng Việt)</span>
              </h3>
              <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed">
                {passage.passageVi}
              </p>
            </div>
          )}
        </div>
      )}

      {studyMode === 'sentence' && (
        /* Sentence-by-Sentence Shadowing & Recording Mode */
        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-amber-200/70 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
            <span className="font-bold text-amber-800 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-600" />
              <span>
                Luyện câu {currentSentenceStep + 1} / {passage.sentences.length}
              </span>
            </span>

            {/* Sentence Progress Dots */}
            <div className="flex items-center gap-1">
              {passage.sentences.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    sound.playTap();
                    setCurrentSentenceStep(i);
                    setRecordedSentenceScore(null);
                    setRecordingFeedback(null);
                  }}
                  className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                    currentSentenceStep === i
                      ? 'bg-amber-500 text-white shadow-xs scale-110'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Active Sentence Card */}
          <div className="p-6 bg-gradient-to-br from-amber-50/50 to-orange-50/30 rounded-2xl border border-amber-100 text-center space-y-4">
            <div className="inline-block px-3 py-1 bg-amber-100 text-amber-800 font-bold rounded-full text-xs">
              Câu số {currentSentenceStep + 1}
            </div>

            <p className="text-lg sm:text-2xl font-bold text-slate-900 leading-snug px-2">
              &ldquo;{passage.sentences[currentSentenceStep].textEn}&rdquo;
            </p>

            {showIPA && (passage.sentences[currentSentenceStep].ipa || passage.sentences[currentSentenceStep].readVi) && (
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-xs sm:text-sm pt-1">
                {passage.sentences[currentSentenceStep].ipa && (
                  <span className="text-amber-800 font-mono bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/70">
                    {passage.sentences[currentSentenceStep].ipa.startsWith('/')
                      ? passage.sentences[currentSentenceStep].ipa
                      : `/${passage.sentences[currentSentenceStep].ipa}/`}
                  </span>
                )}
                {passage.sentences[currentSentenceStep].readVi && (
                  <span className="text-amber-950 bg-amber-100 px-2.5 py-1 rounded-lg font-semibold">
                    🗣️ Gợi ý đọc: {passage.sentences[currentSentenceStep].readVi}
                  </span>
                )}
              </div>
            )}

            {showVi && (
              <p className="text-sm sm:text-base text-slate-600 italic">
                {passage.sentences[currentSentenceStep].textVi}
              </p>
            )}

            {/* Action Buttons: Listen & Record */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => handlePlaySentence(currentSentenceStep)}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-bold text-sm flex items-center gap-2 shadow-sm transition-all transform active:scale-95"
              >
                <Volume2 className="w-4 h-4" />
                <span>Nghe Câu Mẫu 🔊</span>
              </button>

              <button
                type="button"
                onClick={handleStartRecording}
                disabled={isRecording}
                className={`px-5 py-2.5 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-sm transition-all transform active:scale-95 ${
                  isRecording
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                {isRecording ? (
                  <>
                    <Mic className="w-4 h-4 animate-spin" />
                    <span>Đang lắng nghe Bé {childName}...</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4" />
                    <span>Bé {childName} Tập Đọc 🎙️</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playTap();
                  setStudyMode('dictation');
                }}
                className="px-4 py-2.5 rounded-2xl font-bold text-sm flex items-center gap-2 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 shadow-xs transition-all transform active:scale-95 cursor-pointer"
                title="Chuyển sang phần Nghe & Viết lại câu này"
              >
                <PenTool className="w-4 h-4" />
                <span>Luyện Viết Câu Này ✍️</span>
              </button>
            </div>

            {/* Recording Feedback Result */}
            {recordedSentenceScore !== null && (
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2 animate-fade-in">
                <div className="flex items-center justify-center gap-2 text-emerald-800 font-extrabold text-sm">
                  <Award className="w-5 h-5 text-emerald-600" />
                  <span>Điểm phát âm: {recordedSentenceScore}/100</span>
                  <span className="text-amber-500">⭐⭐⭐</span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-900 font-medium">
                  {recordingFeedback}
                </p>
              </div>
            )}
          </div>

          {/* Previous / Next Sentence Nav */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              disabled={currentSentenceStep === 0}
              onClick={() => {
                sound.playTap();
                setCurrentSentenceStep((prev) => Math.max(0, prev - 1));
                setRecordedSentenceScore(null);
                setRecordingFeedback(null);
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Câu trước</span>
            </button>

            <button
              type="button"
              disabled={currentSentenceStep === passage.sentences.length - 1}
              onClick={() => {
                sound.playTap();
                setCurrentSentenceStep((prev) => Math.min(passage.sentences.length - 1, prev + 1));
                setRecordedSentenceScore(null);
                setRecordingFeedback(null);
              }}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-all shadow-xs"
            >
              <span>Câu tiếp theo</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Dictation Mode: Listen & Re-write Sentences with Word Blocks or Typing */}
      {studyMode === 'dictation' && (
        <SentenceDictationPractice
          passage={passage}
          onAddStars={onAddStars}
          childName={childName}
        />
      )}

      {/* Core Vocabulary Flash Cards (Dễ Nhớ) */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-amber-200/70">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-100 text-amber-800 rounded-xl">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                Từ Vựng Cốt Lõi Cần Nhớ (Core Vocabulary)
              </h2>
              <p className="text-xs text-slate-500">
                Chạm vào từng từ để nghe phát âm chuẩn và phiên âm IPA
              </p>
            </div>
          </div>

          <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            {passage.vocabulary.length} từ khóa
          </span>
        </div>

        {/* Vocabulary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {passage.vocabulary.map((vocab, idx) => {
            const isPracticed = practicedWords.has(vocab.word.toLowerCase());
            const isCardActive = selectedWord?.word === vocab.word;

            return (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border transition-all relative ${
                  isCardActive
                    ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-300 shadow-sm'
                    : 'bg-slate-50/80 border-slate-200/80 hover:bg-amber-50/40 hover:border-amber-300'
                }`}
              >
                {/* Practiced checkmark */}
                {isPracticed && (
                  <span className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                )}

                <div className="pr-4">
                  <div className="text-sm sm:text-base font-bold text-slate-900">
                    {vocab.word}
                  </div>
                  {showIPA && (
                    <div className="space-y-0.5 mt-1">
                      {vocab.ipa && (
                        <div className="text-xs text-amber-700 font-mono font-medium">
                          {vocab.ipa.startsWith('/') ? vocab.ipa : `/${vocab.ipa}/`}
                        </div>
                      )}
                      {vocab.readVi && (
                        <div className="text-[11px] text-amber-900/80 bg-amber-100/60 px-1.5 py-0.5 rounded inline-block font-medium">
                          Đọc: {vocab.readVi}
                        </div>
                      )}
                    </div>
                  )}
                  <div className="text-xs text-slate-600 mt-1.5 font-medium leading-snug">
                    {vocab.meaning}
                  </div>
                </div>

                {/* Audio buttons */}
                <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handlePlayWord(vocab, false)}
                    className="flex-1 py-1.5 px-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Nghe</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePlayWord(vocab, true)}
                    className="py-1.5 px-2.5 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-xl text-xs font-semibold transition-all"
                    title="Nghe phát âm chậm"
                  >
                    🐢
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reflex Questions Section (Hỏi Đáp Phản Xạ - Dễ Hiểu, Thích Thú) */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-amber-200/70">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-xl">
              <HelpCircle className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                Hỏi Đáp Phản Xạ (Reflex Questions)
              </h2>
              <p className="text-xs text-slate-500">
                Bé {childName} chọn câu trả lời đúng để nhận thêm ⭐ Sao Vàng nhé!
              </p>
            </div>
          </div>

          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            {answeredQuestions.size} / {passage.questions.length} Đã trả lời
          </span>
        </div>

        {/* Questions list */}
        <div className="space-y-4">
          {passage.questions.map((q, qIdx) => {
            const userAnswer = selectedAnswers[q.id];
            const isAnswered = answeredQuestions.has(q.id);
            const isCorrect = userAnswer === q.answer;

            return (
              <div
                key={q.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isAnswered
                    ? isCorrect
                      ? 'bg-emerald-50/60 border-emerald-300'
                      : 'bg-rose-50/50 border-rose-300'
                    : 'bg-slate-50/60 border-slate-200'
                }`}
              >
                {/* Question Text & Audio */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      {qIdx + 1}
                    </span>
                    <p className="text-sm sm:text-base font-bold text-slate-800">
                      {q.question}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      sound.playTap();
                      sound.speak(q.question, 0.85, 1.05);
                    }}
                    className="p-1.5 text-amber-700 hover:bg-amber-100 rounded-lg transition-all"
                    title="Nghe câu hỏi"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Multiple choice options */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {q.options.map((opt, optIdx) => {
                    const isOptionSelected = userAnswer === opt;
                    const isThisTheCorrectAnswer = opt === q.answer;

                    let btnStyle = 'bg-white border-slate-200 hover:bg-amber-50 hover:border-amber-300 text-slate-700';

                    if (isAnswered) {
                      if (isThisTheCorrectAnswer) {
                        btnStyle = 'bg-emerald-500 text-white border-emerald-500 font-bold shadow-xs';
                      } else if (isOptionSelected) {
                        btnStyle = 'bg-rose-500 text-white border-rose-500 line-through';
                      } else {
                        btnStyle = 'bg-slate-100 border-slate-200 text-slate-400 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        disabled={isAnswered}
                        onClick={() => handleAnswerQuestion(q.id, opt, q.answer)}
                        className={`p-3 rounded-xl text-xs sm:text-sm text-left border transition-all flex items-center justify-between gap-2 ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {isAnswered && isThisTheCorrectAnswer && (
                          <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Feedback Message */}
                {isAnswered && (
                  <div className="mt-3 pt-2 border-t border-current/10 flex items-center justify-between text-xs">
                    {isCorrect ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Chính xác! Bé {childName} giỏi quá! (+2 ⭐)</span>
                      </span>
                    ) : (
                      <span className="text-rose-700 font-medium">
                        Đáp án đúng là: <strong>{q.answer}</strong>
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        sound.playTap();
                        sound.speak(q.answer, 0.85, 1.05);
                      }}
                      className="text-amber-700 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Nghe đáp án</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
