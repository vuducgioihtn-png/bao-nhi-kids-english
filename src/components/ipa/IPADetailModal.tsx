import React, { useState, useEffect } from 'react';
import {
  X, Volume2, Mic, MicOff, Star, Sparkles, ChevronLeft, ChevronRight,
  Turtle, AlertCircle, CheckCircle2, RotateCcw, Play
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { IPASoundItem, IPA_SOUNDS_DATA } from '../../data/ipaData';
import { sound } from '../../utils/audio';
import { speakIPASound, speakWordOnly } from '../../utils/ipaAudio';

interface IPADetailModalProps {
  item: IPASoundItem | null;
  onClose: () => void;
  onSelectAnother: (item: IPASoundItem) => void;
  onAddStars: (count: number) => void;
  slowAudio: boolean;
}

export const IPADetailModal: React.FC<IPADetailModalProps> = ({
  item,
  onClose,
  onSelectAnother,
  onAddStars,
  slowAudio,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recognizedText, setRecognizedText] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [hasPracticed, setHasPracticed] = useState(false);
  const [playingWord, setPlayingWord] = useState<string | null>(null);

  useEffect(() => {
    // Reset practice state when sound changes
    setRecordedAudioUrl(null);
    setRecognizedText(null);
    setFeedbackMessage(null);
    setHasPracticed(false);
  }, [item?.id]);

  if (!item) return null;

  const currentIndex = IPA_SOUNDS_DATA.findIndex((s) => s.id === item.id);
  const prevItem = currentIndex > 0 ? IPA_SOUNDS_DATA[currentIndex - 1] : null;
  const nextItem = currentIndex < IPA_SOUNDS_DATA.length - 1 ? IPA_SOUNDS_DATA[currentIndex + 1] : null;

  // Sound playback handlers
  const handlePlaySound = (isSlow: boolean = slowAudio) => {
    speakIPASound(item, isSlow);
  };

  const handlePlayWord = (word: string, isSlow: boolean = false) => {
    setPlayingWord(word);
    speakWordOnly(word, isSlow);
    setTimeout(() => setPlayingWord(null), 1200);
  };

  // Mic practice handler using SpeechRecognition or MediaRecorder fallback
  const handleToggleMic = async () => {
    if (isRecording) {
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
      }
      setIsRecording(false);
      return;
    }

    try {
      sound.playTap();
      setIsRecording(true);
      setFeedbackMessage('Bé hãy nói to từ "' + item.primaryWord + '" nhé...');

      // Try SpeechRecognition if available
      const SpeechRecognition =
        (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition ||
        (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 3;

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript.toLowerCase().trim();
          setRecognizedText(transcript);
          const target = item.primaryWord.toLowerCase();

          if (transcript.includes(target) || target.includes(transcript)) {
            sound.playSuccess();
            confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
            setFeedbackMessage('🎉 Bé phát âm siêu chuẩn! Nhận được 3 Ngôi Sao!');
            if (!hasPracticed) {
              onAddStars(3);
              setHasPracticed(true);
            }
          } else {
            setFeedbackMessage(`🌟 Nghe giống "${transcript}". Bé hãy thử lại lần nữa để tròn vành rõ chữ hơn nhé!`);
          }
          setIsRecording(false);
        };

        recognition.onerror = () => {
          setIsRecording(false);
          setFeedbackMessage('Bé đã tập nói rất tốt! Bấm nghe lại để so sánh nhé.');
          if (!hasPracticed) {
            onAddStars(2);
            setHasPracticed(true);
          }
        };

        recognition.start();
      } else {
        // Fallback to MediaRecorder for recording & self-playback
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        const chunks: Blob[] = [];

        recorder.ondataavailable = (e) => chunks.push(e.data);
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'audio/webm' });
          const url = URL.createObjectURL(blob);
          setRecordedAudioUrl(url);
          sound.playSuccess();
          confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
          setFeedbackMessage('👏 Bé đã ghi âm giọng mình thành công! Nghe lại xem giống cô giáo chưa nào!');
          if (!hasPracticed) {
            onAddStars(2);
            setHasPracticed(true);
          }
        };

        recorder.start();
        setMediaRecorder(recorder);

        // Auto stop after 3 seconds
        setTimeout(() => {
          if (recorder.state === 'recording') {
            recorder.stop();
            setIsRecording(false);
          }
        }, 3000);
      }
    } catch {
      setIsRecording(false);
      setFeedbackMessage('💡 Bé bấm nghe lại mẫu và đọc theo thật to nhé!');
    }
  };

  const playUserRecording = () => {
    if (recordedAudioUrl) {
      const audio = new Audio(recordedAudioUrl);
      audio.play();
    }
  };

  // Badge label & styles
  const getSubCategoryBadge = () => {
    switch (item.subCategory) {
      case 'long_vowel':
        return { text: 'Nguyên Âm Dài (Ngân dài 2s)', color: 'bg-emerald-100 text-emerald-800 border-emerald-300', icon: '⏳' };
      case 'short_vowel':
        return { text: 'Nguyên Âm Ngắn (Dứt khoát)', color: 'bg-teal-100 text-teal-800 border-teal-300', icon: '⚡' };
      case 'diphthong':
        return { text: 'Nguyên Âm Đôi (Trượt 2 âm)', color: 'bg-purple-100 text-purple-800 border-purple-300', icon: '🔄' };
      case 'voiceless_consonant':
        return { text: 'Âm Vô Thanh (Bật hơi gió 💨)', color: 'bg-amber-100 text-amber-900 border-amber-300', icon: '💨' };
      case 'voiced_consonant':
        return { text: 'Âm Hữu Thanh (Rung cổ họng 🎵)', color: 'bg-sky-100 text-sky-900 border-sky-300', icon: '🎵' };
    }
  };

  const badge = getSubCategoryBadge();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-2 border-amber-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-linear-to-r from-amber-50 via-orange-50 to-amber-100 border-b border-amber-200/70">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-amber-500 text-white font-mono font-black text-sm flex items-center justify-center shadow-xs">
              {item.number}
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 font-heading flex items-center gap-2">
                <span>Âm {item.symbol}</span>
                <span className="text-xs px-2 py-0.5 rounded-full border font-bold font-sans flex items-center gap-1 ${badge.color}">
                  <span>{badge.icon}</span>
                  <span>{badge.text}</span>
                </span>
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-white/80 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5">
          {/* Main Sound Presentation Hero Card */}
          <div className="rounded-2xl bg-linear-to-b from-amber-50/70 to-orange-50/50 border border-amber-200 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white shadow-md border-2 border-amber-300 flex items-center justify-center text-4xl sm:text-5xl font-mono font-black text-amber-900">
                {item.rawSymbol}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    {item.primaryWord}
                  </span>
                  <span className="text-2xl sm:text-3xl">{item.emoji}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  Nghĩa: <span className="text-amber-800 font-bold">{item.wordMeaningVi}</span>
                </p>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  Phát âm tương đương: <span className="font-semibold text-slate-700">{item.vietnameseApprox}</span>
                </p>
              </div>
            </div>

            {/* Audio Buttons */}
            <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => handlePlaySound(false)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>Nghe Âm Chuẩn</span>
              </button>

              <button
                type="button"
                onClick={() => handlePlaySound(true)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-amber-50 border border-amber-300 text-amber-900 font-bold text-xs shadow-2xs transition-all active:scale-95 cursor-pointer"
              >
                <Turtle className="w-4 h-4 text-emerald-600" />
                <span>Nghe Chậm (0.6x)</span>
              </button>
            </div>
          </div>

          {/* Kid-Friendly Mouth Shape & Pronunciation Guide */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-2.5">
            <div className="flex items-center gap-2 text-sm font-extrabold text-amber-900">
              <span className="text-lg">👄</span>
              <span>Khẩu Hình Miệng & Mẹo Phát Âm Cho Bé</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-100 flex items-start gap-2.5">
                <span className="text-2xl">{item.mouthIcon}</span>
                <div>
                  <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide">Hành Động Của Môi & Lưỡi</h4>
                  <p className="text-xs text-slate-700 mt-0.5">{item.mouthAction}</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-sky-50/50 border border-sky-100 flex items-start gap-2.5">
                <span className="text-2xl">{item.isVoiced ? '🎵' : '💨'}</span>
                <div>
                  <h4 className="text-xs font-bold text-sky-900 uppercase tracking-wide">Cảm Nhận Ở Cổ Họng</h4>
                  <p className="text-xs text-slate-700 mt-0.5">
                    {item.isVoiced
                      ? 'Đặt tay lên cổ họng: Dây thanh quản RUNG râm ran 🎵'
                      : 'Đặt bàn tay trước miệng: BẬT luồng gió mát phà ra tay 💨'}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-orange-50/40 border border-orange-200/70 text-xs text-slate-700">
              <span className="font-extrabold text-orange-900">💡 Lời dặn của cô giáo: </span>
              <span>{item.kidTip}</span>
            </div>

            {item.commonMistakeVi && (
              <div className="p-2.5 rounded-xl bg-rose-50/50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{item.commonMistakeVi}</span>
              </div>
            )}
          </div>

          {/* Interactive Microphone Practice Area */}
          <div className="bg-linear-to-r from-emerald-50 via-teal-50 to-emerald-50 rounded-2xl border border-emerald-200 p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-extrabold text-emerald-950">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Bé Tập Nói & Nhận Sao Thưởng</span>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                +3 ⭐ mỗi lần tập
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={handleToggleMic}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all shadow-xs active:scale-95 cursor-pointer ${
                  isRecording
                    ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span>{isRecording ? 'Đang Lắng Nghe... (Bấm để Dừng)' : `Bé Bấm Mic & Đọc "${item.primaryWord}"`}</span>
              </button>

              {recordedAudioUrl && (
                <button
                  type="button"
                  onClick={playUserRecording}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-emerald-300 text-emerald-800 font-bold text-xs hover:bg-emerald-100 transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Nghe Lại Giọng Của Bé</span>
                </button>
              )}
            </div>

            {feedbackMessage && (
              <div className="p-2.5 rounded-xl bg-white/90 border border-emerald-200 text-xs font-bold text-slate-800 animate-in fade-in">
                {feedbackMessage}
              </div>
            )}
          </div>

          {/* Example Words Grid */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
                Từ Vựng Ví Dụ Quen Thuộc Có Âm {item.symbol}
              </h3>
              <span className="text-[11px] text-slate-400">Bấm từng từ để nghe</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {item.examples.map((ex) => (
                <div
                  key={ex.word}
                  onClick={() => handlePlayWord(ex.word, false)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                    playingWord === ex.word
                      ? 'bg-amber-100/80 border-amber-400 shadow-xs'
                      : 'bg-slate-50/70 hover:bg-white border-slate-200 hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl group-hover:scale-110 transition-transform">
                      {ex.emoji}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900 group-hover:text-amber-900 capitalize">
                          {ex.word}
                        </span>
                        <span className="text-xs font-mono text-slate-500">
                          {ex.ipa}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500">
                        {ex.meaningVi} &bull;{' '}
                        <span className="text-amber-800 font-semibold font-sans">
                          {ex.readVi}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayWord(ex.word, false);
                    }}
                    className="p-2 rounded-xl text-slate-400 group-hover:text-amber-600 hover:bg-amber-100 transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer with Prev / Next Navigation */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-slate-50 border-t border-slate-200">
          <button
            type="button"
            disabled={!prevItem}
            onClick={() => prevItem && onSelectAnother(prevItem)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-white hover:border-amber-300 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Âm trước:</span>
            <span>{prevItem?.symbol || ''}</span>
          </button>

          <span className="text-xs font-extrabold text-slate-400 font-mono">
            {item.number} / 44
          </span>

          <button
            type="button"
            disabled={!nextItem}
            onClick={() => nextItem && onSelectAnother(nextItem)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-white hover:border-amber-300 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <span>{nextItem?.symbol || ''}</span>
            <span className="hidden sm:inline">:Âm sau</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
