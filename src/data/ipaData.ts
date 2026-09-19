export type IPACategory = 'monophthong' | 'diphthong' | 'consonant';
export type ConsonantType = 'voiceless' | 'voiced';
export type VowelLength = 'short' | 'long' | 'diphthong';

export interface IPASoundExample {
  word: string;
  ipa: string;
  readVi: string;
  meaningVi: string;
  emoji: string;
}

export interface IPASoundItem {
  id: string; // 'ipa-1'
  number: number; // 1 - 44 matching the canonical chart
  symbol: string; // '/iː/'
  rawSymbol: string; // 'iː'
  category: IPACategory;
  subCategory: 'short_vowel' | 'long_vowel' | 'diphthong' | 'voiceless_consonant' | 'voiced_consonant';
  primaryWord: string; // 'Sheep'
  highlightLetter: string; // 'ee'
  wordMeaningVi: string; // 'con cừu'
  emoji: string; // '🐑'
  kidTip: string; // Mẹo khẩu hình & phát âm cho bé
  vietnameseApprox: string; // Gần giống âm tiếng Việt
  mouthAction: string; // 'Mỉm cười kéo dài', 'Mở to chữ A bẹt', etc.
  mouthIcon: string;
  isVoiced: boolean; // Rung cổ họng (true) hay âm gió thổi hơi (false)
  examples: IPASoundExample[];
  commonMistakeVi?: string;
  contrastPairNumber?: number; // Liên kết tới số của âm đối lập
  row: number; // 1, 2, 3 in Vowels or 1, 2, 3 in Consonants
  col: number; // 1 - 8
}

export const IPA_SOUNDS_DATA: IPASoundItem[] = [
  // ==========================================
  // MONOPHTHONGS (12 NGUYÊN ÂM ĐƠN)
  // ==========================================
  // Row 1
  {
    id: 'ipa-1',
    number: 1,
    symbol: '/iː/',
    rawSymbol: 'iː',
    category: 'monophthong',
    subCategory: 'long_vowel',
    primaryWord: 'Sheep',
    highlightLetter: 'ee',
    wordMeaningVi: 'con cừu',
    emoji: '🐑',
    kidTip: 'Kéo khóe miệng sang hai bên thật tươi như đang cười chụp ảnh "cheeeese", phát âm "i" ngân dài 2 giây!',
    vietnameseApprox: 'Âm "i" ngân dài mỉm cười',
    mouthAction: 'Khóe miệng cười tươi, kéo dài',
    mouthIcon: '😁',
    isVoiced: true,
    row: 1,
    col: 1,
    contrastPairNumber: 2,
    commonMistakeVi: 'Bé hay đọc ngắn như tiếng Việt. Nhớ ngân dài "iii" nhé!',
    examples: [
      { word: 'sheep', ipa: '/ʃiːp/', readVi: 'ship', meaningVi: 'con cừu', emoji: '🐑' },
      { word: 'see', ipa: '/siː/', readVi: 'xi', meaningVi: 'nhìn thấy', emoji: '👀' },
      { word: 'tea', ipa: '/tiː/', readVi: 'thi', meaningVi: 'ly trà', emoji: '🍵' },
      { word: 'eat', ipa: '/iːt/', readVi: 'ít', meaningVi: 'ăn uống', emoji: '🍎' }
    ]
  },
  {
    id: 'ipa-2',
    number: 2,
    symbol: '/ɪ/',
    rawSymbol: 'ɪ',
    category: 'monophthong',
    subCategory: 'short_vowel',
    primaryWord: 'Ship',
    highlightLetter: 'i',
    wordMeaningVi: 'tàu thủy',
    emoji: '🚢',
    kidTip: 'Mở nhẹ miệng tự nhiên, phát âm "i" thật ngắn gọn, dứt khoát nửa giây. Khác với âm /iː/ dài!',
    vietnameseApprox: 'Âm "i" ngắn, lai nhẹ "ê"',
    mouthAction: 'Miệng hé tự nhiên, âm nảy nhanh',
    mouthIcon: '🙂',
    isVoiced: true,
    row: 1,
    col: 2,
    contrastPairNumber: 1,
    commonMistakeVi: 'Đừng kéo dài âm, phải ngắt âm dứt khoát!',
    examples: [
      { word: 'ship', ipa: '/ʃɪp/', readVi: 'shíp', meaningVi: 'tàu thủy', emoji: '🚢' },
      { word: 'sit', ipa: '/sɪt/', readVi: 'xít', meaningVi: 'ngồi xuống', emoji: '🪑' },
      { word: 'fish', ipa: '/fɪʃ/', readVi: 'phi-sh', meaningVi: 'con cá', emoji: '🐟' },
      { word: 'big', ipa: '/bɪɡ/', readVi: 'bíc', meaningVi: 'to lớn', emoji: '🐘' }
    ]
  },
  {
    id: 'ipa-3',
    number: 3,
    symbol: '/ʊ/',
    rawSymbol: 'ʊ',
    category: 'monophthong',
    subCategory: 'short_vowel',
    primaryWord: 'Good',
    highlightLetter: 'oo',
    wordMeaningVi: 'tốt, giỏi',
    emoji: '👍',
    kidTip: 'Môi hơi tròn nhẹ, thả lỏng, phát âm "u" ngắn nảy dứt khoát, âm trầm ấm ở vòm họng.',
    vietnameseApprox: 'Âm "u" ngắn, hơi hướng "ư"',
    mouthAction: 'Môi khẽ tròn, phát âm dứt khoát',
    mouthIcon: '😗',
    isVoiced: true,
    row: 1,
    col: 3,
    contrastPairNumber: 4,
    commonMistakeVi: 'Đừng chu môi quá nhọn, giữ miệng hơi mở tự nhiên.',
    examples: [
      { word: 'good', ipa: '/ɡʊd/', readVi: 'gút-đ', meaningVi: 'tốt, ngoan', emoji: '👍' },
      { word: 'book', ipa: '/bʊk/', readVi: 'búc', meaningVi: 'quyển sách', emoji: '📖' },
      { word: 'foot', ipa: '/fʊt/', readVi: 'phút', meaningVi: 'bàn chân', emoji: '🦶' },
      { word: 'cook', ipa: '/kʊk/', readVi: 'khúc', meaningVi: 'nấu ăn', emoji: '🍳' }
    ]
  },
  {
    id: 'ipa-4',
    number: 4,
    symbol: '/uː/',
    rawSymbol: 'uː',
    category: 'monophthong',
    subCategory: 'long_vowel',
    primaryWord: 'Shoot',
    highlightLetter: 'oo',
    wordMeaningVi: 'bắn tên, sút bóng',
    emoji: '🎯',
    kidTip: 'Chu môi tròn xoe như đang thổi bong bóng hoặc sáo trúc, phát âm "u" kéo dài 2 giây thật mượt!',
    vietnameseApprox: 'Âm "u" dài chu môi tròn',
    mouthAction: 'Môi chu nhọn tròn xoe, ngân dài',
    mouthIcon: '😙',
    isVoiced: true,
    row: 1,
    col: 4,
    contrastPairNumber: 3,
    commonMistakeVi: 'Nhớ chu môi thật tròn và ngân dài "uuu" nhé!',
    examples: [
      { word: 'shoot', ipa: '/ʃuːt/', readVi: 'shu-t', meaningVi: 'sút bóng, bắn', emoji: '🎯' },
      { word: 'blue', ipa: '/bluː/', readVi: 'b-lu', meaningVi: 'màu xanh lam', emoji: '💙' },
      { word: 'food', ipa: '/fuːd/', readVi: 'phu-đ', meaningVi: 'thức ăn ngon', emoji: '🍲' },
      { word: 'moon', ipa: '/muːn/', readVi: 'mun', meaningVi: 'mặt trăng', emoji: '🌙' }
    ]
  },

  // Row 2
  {
    id: 'ipa-7',
    number: 7,
    symbol: '/e/',
    rawSymbol: 'e',
    category: 'monophthong',
    subCategory: 'short_vowel',
    primaryWord: 'Bed',
    highlightLetter: 'e',
    wordMeaningVi: 'chiếc giường',
    emoji: '🛏️',
    kidTip: 'Miệng mở rộng vừa phải như khi chuẩn bị cắn một miếng bánh nhỏ, phát âm "e" ngắn gọn!',
    vietnameseApprox: 'Âm "e" ngắn gọn, dứt khoát',
    mouthAction: 'Mở miệng vừa phải, dứt khoát',
    mouthIcon: '😃',
    isVoiced: true,
    row: 2,
    col: 1,
    contrastPairNumber: 14,
    commonMistakeVi: 'Đừng mở miệng quá to thành âm /æ/ (a bẹt).',
    examples: [
      { word: 'bed', ipa: '/bed/', readVi: 'bét-đ', meaningVi: 'cái giường', emoji: '🛏️' },
      { word: 'red', ipa: '/red/', readVi: 'rét-đ', meaningVi: 'màu đỏ', emoji: '🔴' },
      { word: 'pen', ipa: '/pen/', readVi: 'pen', meaningVi: 'cây bút mực', emoji: '🖊️' },
      { word: 'ten', ipa: '/ten/', readVi: 'then', meaningVi: 'số mười', emoji: '🔟' }
    ]
  },
  {
    id: 'ipa-8',
    number: 8,
    symbol: '/ə/',
    rawSymbol: 'ə',
    category: 'monophthong',
    subCategory: 'short_vowel',
    primaryWord: 'Teacher',
    highlightLetter: 'er',
    wordMeaningVi: 'cô giáo, thầy giáo',
    emoji: '👩‍🏫',
    kidTip: 'Đây là "Âm lười Schwa" phổ biến nhất! Mở hờ miệng, thả lỏng toàn bộ cơ mặt, phát âm "ơ" thật nhẹ tênh!',
    vietnameseApprox: 'Âm "ơ" nhẹ như hơi thở thoảng',
    mouthAction: 'Thả lỏng miệng hoàn toàn, đọc thật nhẹ',
    mouthIcon: '😐',
    isVoiced: true,
    row: 2,
    col: 2,
    contrastPairNumber: 9,
    commonMistakeVi: 'Đừng đọc nhấn mạnh. Âm này luôn nhẹ nhàng, lướt qua.',
    examples: [
      { word: 'teacher', ipa: '/ˈtiːtʃər/', readVi: 'ti-chờ', meaningVi: 'cô giáo', emoji: '👩‍🏫' },
      { word: 'banana', ipa: '/bəˈnænə/', readVi: 'bơ-ne-nơ', meaningVi: 'quả chuối', emoji: '🍌' },
      { word: 'mother', ipa: '/ˈmʌðər/', readVi: 'ma-đờ', meaningVi: 'mẹ yêu', emoji: '👩' },
      { word: 'about', ipa: '/əˈbaʊt/', readVi: 'ơ-bao-t', meaningVi: 'về điều gì', emoji: '📖' }
    ]
  },
  {
    id: 'ipa-9',
    number: 9,
    symbol: '/ɜː/',
    rawSymbol: 'ɜː',
    category: 'monophthong',
    subCategory: 'long_vowel',
    primaryWord: 'Bird',
    highlightLetter: 'ir',
    wordMeaningVi: 'chú chim nhỏ',
    emoji: '🐦',
    kidTip: 'Miệng mở hờ như âm /ə/ nhưng cong nhẹ đầu lưỡi vào trong, phát âm "ơ" ngân dài 2 giây!',
    vietnameseApprox: 'Âm "ơ" dài cong lưỡi',
    mouthAction: 'Mở hờ miệng, uốn nhẹ lưỡi ngân dài',
    mouthIcon: '😮',
    isVoiced: true,
    row: 2,
    col: 3,
    contrastPairNumber: 8,
    commonMistakeVi: 'Nhớ uốn nhẹ lưỡi để tạo độ sâu cho âm!',
    examples: [
      { word: 'bird', ipa: '/bɜːrd/', readVi: 'bơ-đ', meaningVi: 'chú chim', emoji: '🐦' },
      { word: 'girl', ipa: '/ɡɜːrl/', readVi: 'gơ-l', meaningVi: 'bé gái', emoji: '👧' },
      { word: 'shirt', ipa: '/ʃɜːrt/', readVi: 'shơ-t', meaningVi: 'áo sơ mi', emoji: '👔' },
      { word: 'nurse', ipa: '/nɜːrs/', readVi: 'nơ-s', meaningVi: 'y tá', emoji: '👩‍⚕️' }
    ]
  },
  {
    id: 'ipa-10',
    number: 10,
    symbol: '/ɔː/',
    rawSymbol: 'ɔː',
    category: 'monophthong',
    subCategory: 'long_vowel',
    primaryWord: 'Door',
    highlightLetter: 'oor',
    wordMeaningVi: 'cánh cửa',
    emoji: '🚪',
    kidTip: 'Tròn môi hình chữ O lớn, kéo căng môi, phát âm "o" ngân dài sâu từ cổ họng!',
    vietnameseApprox: 'Âm "o" dài tròn môi sâu',
    mouthAction: 'Môi tròn căng, phát âm ngân dài',
    mouthIcon: '😲',
    isVoiced: true,
    row: 2,
    col: 4,
    contrastPairNumber: 17,
    commonMistakeVi: 'Tránh đọc ngắn như âm "o" tiếng Việt, hãy kéo dài và làm tròn môi.',
    examples: [
      { word: 'door', ipa: '/dɔːr/', readVi: 'đo', meaningVi: 'cánh cửa', emoji: '🚪' },
      { word: 'ball', ipa: '/bɔːl/', readVi: 'boo-l', meaningVi: 'quả bóng', emoji: '⚽' },
      { word: 'water', ipa: '/ˈwɔːtər/', readVi: 'ua-tờ', meaningVi: 'nước uống', emoji: '💧' },
      { word: 'fork', ipa: '/fɔːrk/', readVi: 'pho-k', meaningVi: 'chiếc nĩa', emoji: '🍴' }
    ]
  },

  // Row 3
  {
    id: 'ipa-14',
    number: 14,
    symbol: '/æ/',
    rawSymbol: 'æ',
    category: 'monophthong',
    subCategory: 'short_vowel',
    primaryWord: 'Cat',
    highlightLetter: 'a',
    wordMeaningVi: 'chú mèo',
    emoji: '🐱',
    kidTip: 'Âm "a bẹt" siêu vui! Há miệng thật to theo chiều dọc và ngang như cắn một quả táo khổng lồ, đọc "e-a" thật nhanh!',
    vietnameseApprox: 'Âm "a bẹt" (lai giữa a và e)',
    mouthAction: 'Há miệng thật to, hạ hàm dưới sâu',
    mouthIcon: '🗣️',
    isVoiced: true,
    row: 3,
    col: 1,
    contrastPairNumber: 7,
    commonMistakeVi: 'Hạ thấp hàm dưới xuống, miệng mở to hết cỡ thì âm mới chuẩn nhé bé!',
    examples: [
      { word: 'cat', ipa: '/kæt/', readVi: 'khet', meaningVi: 'con mèo', emoji: '🐱' },
      { word: 'apple', ipa: '/ˈæpəl/', readVi: 'ép-pồ', meaningVi: 'quả táo', emoji: '🍎' },
      { word: 'hat', ipa: '/hæt/', readVi: 'hét', meaningVi: 'chiếc mũ', emoji: '👒' },
      { word: 'bag', ipa: '/bæɡ/', readVi: 'béc', meaningVi: 'cái túi', emoji: '🎒' }
    ]
  },
  {
    id: 'ipa-15',
    number: 15,
    symbol: '/ʌ/',
    rawSymbol: 'ʌ',
    category: 'monophthong',
    subCategory: 'short_vowel',
    primaryWord: 'Up',
    highlightLetter: 'u',
    wordMeaningVi: 'lên trên cao',
    emoji: '⬆️',
    kidTip: 'Mở miệng tự nhiên vừa phải, bật nhanh âm "ă/ớ" dứt khoát từ cổ họng!',
    vietnameseApprox: 'Âm "ă/ớ" bật nhanh dứt khoát',
    mouthAction: 'Mở miệng vừa phải, bật âm nảy',
    mouthIcon: '😮',
    isVoiced: true,
    row: 3,
    col: 2,
    contrastPairNumber: 16,
    commonMistakeVi: 'Đừng kéo dài âm, đọc nhanh và dứt khoát.',
    examples: [
      { word: 'up', ipa: '/ʌp/', readVi: 'ắp', meaningVi: 'lên trên', emoji: '⬆️' },
      { word: 'cup', ipa: '/kʌp/', readVi: 'khắp', meaningVi: 'cái cốc', emoji: '☕' },
      { word: 'sun', ipa: '/sʌn/', readVi: 'xăn', meaningVi: 'mặt trời', emoji: '☀️' },
      { word: 'duck', ipa: '/dʌk/', readVi: 'đắc', meaningVi: 'chú vịt', emoji: '🦆' }
    ]
  },
  {
    id: 'ipa-16',
    number: 16,
    symbol: '/ɑː/',
    rawSymbol: 'ɑː',
    category: 'monophthong',
    subCategory: 'long_vowel',
    primaryWord: 'Far',
    highlightLetter: 'ar',
    wordMeaningVi: 'xa xôi',
    emoji: '🚗',
    kidTip: 'Mở to vòm họng như khi bác sĩ bảo "Aaaa", hạ thấp cuống lưỡi, phát âm "a" ngân dài ấm áp!',
    vietnameseApprox: 'Âm "a" dài trầm mở sâu họng',
    mouthAction: 'Mở rộng vòm miệng, ngân dài âm a',
    mouthIcon: '😲',
    isVoiced: true,
    row: 3,
    col: 3,
    contrastPairNumber: 15,
    commonMistakeVi: 'Cần mở sâu vòm họng và kéo dài âm hơn âm "a" tiếng Việt thông thường.',
    examples: [
      { word: 'far', ipa: '/fɑːr/', readVi: 'pha', meaningVi: 'xa xôi', emoji: '🚗' },
      { word: 'car', ipa: '/kɑːr/', readVi: 'kha', meaningVi: 'xe ô tô', emoji: '🏎️' },
      { word: 'star', ipa: '/stɑːr/', readVi: 'x-ta', meaningVi: 'ngôi sao', emoji: '⭐' },
      { word: 'heart', ipa: '/hɑːrt/', readVi: 'ha-t', meaningVi: 'trái tim', emoji: '❤️' }
    ]
  },
  {
    id: 'ipa-17',
    number: 17,
    symbol: '/ɒ/',
    rawSymbol: 'ɒ',
    category: 'monophthong',
    subCategory: 'short_vowel',
    primaryWord: 'On',
    highlightLetter: 'o',
    wordMeaningVi: 'ở trên, bật lên',
    emoji: '💡',
    kidTip: 'Hơi tròn môi nhẹ, phát âm "o" thật ngắn và dứt khoát, hàm hơi hạ thấp.',
    vietnameseApprox: 'Âm "o" ngắn, nảy âm nhanh',
    mouthAction: 'Môi hơi tròn, ngắt âm dứt khoát',
    mouthIcon: '😮',
    isVoiced: true,
    row: 3,
    col: 4,
    contrastPairNumber: 10,
    commonMistakeVi: 'Ngắt âm ngay lập tức, không kéo dài như âm /ɔː/.',
    examples: [
      { word: 'on', ipa: '/ɒn/', readVi: 'on', meaningVi: 'ở trên', emoji: '💡' },
      { word: 'hot', ipa: '/hɒt/', readVi: 'hót', meaningVi: 'nóng bức', emoji: '🔥' },
      { word: 'dog', ipa: '/dɒɡ/', readVi: 'đóc', meaningVi: 'chú cún', emoji: '🐶' },
      { word: 'box', ipa: '/bɒks/', readVi: 'bóc-s', meaningVi: 'cái hộp', emoji: '📦' }
    ]
  },

  // ==========================================
  // DIPHTHONGS (8 NGUYÊN ÂM ĐÔI)
  // ==========================================
  // Row 1
  {
    id: 'ipa-5',
    number: 5,
    symbol: '/ɪə/',
    rawSymbol: 'ɪə',
    category: 'diphthong',
    subCategory: 'diphthong',
    primaryWord: 'Here',
    highlightLetter: 'ere',
    wordMeaningVi: 'ở đây này',
    emoji: '📍',
    kidTip: 'Trượt mượt mà từ âm /ɪ/ sang âm /ə/ (đọc lướt như "i-ơ" liền mạch, âm đầu nhấn rõ hơn âm sau)!',
    vietnameseApprox: 'Trượt từ "i" sang "ơ" (ia-ơ)',
    mouthAction: 'Khép nhẹ môi chuyển sang mở hờ',
    mouthIcon: '➡️',
    isVoiced: true,
    row: 1,
    col: 5,
    examples: [
      { word: 'here', ipa: '/hɪər/', readVi: 'hi-ơ', meaningVi: 'ở đây', emoji: '📍' },
      { word: 'ear', ipa: '/ɪər/', readVi: 'i-ơ', meaningVi: 'cái tai', emoji: '👂' },
      { word: 'near', ipa: '/nɪər/', readVi: 'ni-ơ', meaningVi: 'gần đây', emoji: '🏡' },
      { word: 'cheer', ipa: '/tʃɪər/', readVi: 'chi-ơ', meaningVi: 'reo vui', emoji: '🎉' }
    ]
  },
  {
    id: 'ipa-6',
    number: 6,
    symbol: '/eɪ/',
    rawSymbol: 'eɪ',
    category: 'diphthong',
    subCategory: 'diphthong',
    primaryWord: 'Wait',
    highlightLetter: 'ai',
    wordMeaningVi: 'chờ đợi',
    emoji: '⏳',
    kidTip: 'Trượt mượt mà từ âm /e/ sang âm /ɪ/ (đọc như "ê-i" hoặc "ây", miệng khép dần lại mỉm cười)!',
    vietnameseApprox: 'Trượt từ "e" sang "i" (ê-i)',
    mouthAction: 'Mở vừa rồi thu hẹp mỉm cười',
    mouthIcon: '➡️',
    isVoiced: true,
    row: 1,
    col: 6,
    examples: [
      { word: 'wait', ipa: '/weɪt/', readVi: 'uêi-t', meaningVi: 'chờ đợi', emoji: '⏳' },
      { word: 'day', ipa: '/deɪ/', readVi: 'đây', meaningVi: 'ngày tươi đẹp', emoji: '☀️' },
      { word: 'play', ipa: '/pleɪ/', readVi: 'p-lây', meaningVi: 'chơi đùa', emoji: '🪀' },
      { word: 'rain', ipa: '/reɪn/', readVi: 'rên', meaningVi: 'cơn mưa', emoji: '🌧️' }
    ]
  },

  // Row 2
  {
    id: 'ipa-11',
    number: 11,
    symbol: '/ʊə/',
    rawSymbol: 'ʊə',
    category: 'diphthong',
    subCategory: 'diphthong',
    primaryWord: 'Tourist',
    highlightLetter: 'our',
    wordMeaningVi: 'khách du lịch',
    emoji: '🧳',
    kidTip: 'Trượt từ âm /ʊ/ tròn môi sang âm /ə/ thả lỏng (đọc lướt như "u-ơ" mượt mà)!',
    vietnameseApprox: 'Trượt từ "u" sang "ơ" (ua-ơ)',
    mouthAction: 'Môi hơi tròn chuyển sang thả lỏng',
    mouthIcon: '➡️',
    isVoiced: true,
    row: 2,
    col: 5,
    examples: [
      { word: 'tourist', ipa: '/ˈtʊərɪst/', readVi: 'tu-ơ-rịt-s', meaningVi: 'du khách', emoji: '🧳' },
      { word: 'poor', ipa: '/pʊər/', readVi: 'pu-ơ', meaningVi: 'tội nghiệp, nghèo', emoji: '🥺' },
      { word: 'sure', ipa: '/ʃʊər/', readVi: 'shu-ơ', meaningVi: 'chắc chắn', emoji: '👌' },
      { word: 'cure', ipa: '/kjʊər/', readVi: 'khiu-ơ', meaningVi: 'chữa lành', emoji: '💊' }
    ]
  },
  {
    id: 'ipa-12',
    number: 12,
    symbol: '/ɔɪ/',
    rawSymbol: 'ɔɪ',
    category: 'diphthong',
    subCategory: 'diphthong',
    primaryWord: 'Boy',
    highlightLetter: 'oy',
    wordMeaningVi: 'cậu bé ngoan',
    emoji: '👦',
    kidTip: 'Trượt từ âm /ɔː/ tròn môi sang âm /ɪ/ mở miệng cười tươi (như đọc "o-i" hay "oi" trong tiếng Việt)!',
    vietnameseApprox: 'Trượt từ "o" sang "i" (o-i)',
    mouthAction: 'Tròn môi rồi kéo ngang mỉm cười',
    mouthIcon: '➡️',
    isVoiced: true,
    row: 2,
    col: 6,
    examples: [
      { word: 'boy', ipa: '/bɔɪ/', readVi: 'boi', meaningVi: 'cậu bé', emoji: '👦' },
      { word: 'toy', ipa: '/tɔɪ/', readVi: 'thoi', meaningVi: 'đồ chơi', emoji: '🧸' },
      { word: 'coin', ipa: '/kɔɪn/', readVi: 'khoi-n', meaningVi: 'đồng xu', emoji: '🪙' },
      { word: 'joy', ipa: '/dʒɔɪ/', readVi: 'joi', meaningVi: 'niềm vui', emoji: '😄' }
    ]
  },
  {
    id: 'ipa-13',
    number: 13,
    symbol: '/əʊ/',
    rawSymbol: 'əʊ',
    category: 'diphthong',
    subCategory: 'diphthong',
    primaryWord: 'Show',
    highlightLetter: 'ow',
    wordMeaningVi: 'buổi biểu diễn',
    emoji: '🎭',
    kidTip: 'Trượt từ âm /ə/ thả lỏng sang âm /ʊ/ tròn môi (đọc lướt như "ơ-u" hoặc "ô-u" sang trọng)!',
    vietnameseApprox: 'Trượt từ "ơ" sang "u" (ơ-u / ô-u)',
    mouthAction: 'Miệng tự nhiên rồi chu tròn lại',
    mouthIcon: '➡️',
    isVoiced: true,
    row: 2,
    col: 7,
    examples: [
      { word: 'show', ipa: '/ʃəʊ/', readVi: 'shâu', meaningVi: 'biểu diễn', emoji: '🎭' },
      { word: 'go', ipa: '/ɡəʊ/', readVi: 'gâu', meaningVi: 'đi thôi', emoji: '🚶' },
      { word: 'home', ipa: '/həʊm/', readVi: 'hôm', meaningVi: 'ngôi nhà', emoji: '🏡' },
      { word: 'boat', ipa: '/bəʊt/', readVi: 'bâu-t', meaningVi: 'con thuyền', emoji: '⛵' }
    ]
  },

  // Row 3
  {
    id: 'ipa-18',
    number: 18,
    symbol: '/eə/',
    rawSymbol: 'eə',
    category: 'diphthong',
    subCategory: 'diphthong',
    primaryWord: 'Hair',
    highlightLetter: 'air',
    wordMeaningVi: 'mái tóc',
    emoji: '💇',
    kidTip: 'Trượt từ âm /e/ mở vừa sang âm /ə/ nhẹ nhàng (đọc lướt như "e-ơ" mềm mại)!',
    vietnameseApprox: 'Trượt từ "e" sang "ơ" (e-ơ)',
    mouthAction: 'Mở vừa chuyển sang thả lỏng hờ',
    mouthIcon: '➡️',
    isVoiced: true,
    row: 3,
    col: 5,
    examples: [
      { word: 'hair', ipa: '/heər/', readVi: 'he-ơ', meaningVi: 'mái tóc', emoji: '💇' },
      { word: 'bear', ipa: '/beər/', readVi: 'be-ơ', meaningVi: 'chú gấu', emoji: '🐻' },
      { word: 'chair', ipa: '/tʃeər/', readVi: 'che-ơ', meaningVi: 'cái ghế', emoji: '🪑' },
      { word: 'share', ipa: '/ʃeər/', readVi: 'she-ơ', meaningVi: 'chia sẻ', emoji: '🤝' }
    ]
  },
  {
    id: 'ipa-19',
    number: 19,
    symbol: '/aɪ/',
    rawSymbol: 'aɪ',
    category: 'diphthong',
    subCategory: 'diphthong',
    primaryWord: 'My',
    highlightLetter: 'y',
    wordMeaningVi: 'của tôi',
    emoji: '🙋',
    kidTip: 'Bắt đầu từ âm /ɑː/ há to miệng rồi khép dần mỉm cười ở âm /ɪ/ (đọc như "a-i" vui tươi)!',
    vietnameseApprox: 'Trượt từ "a" sang "i" (a-i / ai)',
    mouthAction: 'Há to rồi thu hẹp khóe miệng',
    mouthIcon: '➡️',
    isVoiced: true,
    row: 3,
    col: 6,
    examples: [
      { word: 'my', ipa: '/maɪ/', readVi: 'mai', meaningVi: 'của tôi', emoji: '🙋' },
      { word: 'fly', ipa: '/flaɪ/', readVi: 'ph-lai', meaningVi: 'bay lượn', emoji: '✈️' },
      { word: 'eye', ipa: '/aɪ/', readVi: 'ai', meaningVi: 'đôi mắt', emoji: '👁️' },
      { word: 'bike', ipa: '/baɪk/', readVi: 'bai-k', meaningVi: 'xe đạp', emoji: '🚲' }
    ]
  },
  {
    id: 'ipa-20',
    number: 20,
    symbol: '/aʊ/',
    rawSymbol: 'aʊ',
    category: 'diphthong',
    subCategory: 'diphthong',
    primaryWord: 'Cow',
    highlightLetter: 'ow',
    wordMeaningVi: 'con bò sữa',
    emoji: '🐮',
    kidTip: 'Bắt đầu há to miệng ở âm /ɑː/ rồi thu tròn môi lại ở âm /ʊ/ (đọc lướt như "a-u" hoặc "ao")!',
    vietnameseApprox: 'Trượt từ "a" sang "u" (a-u / ao)',
    mouthAction: 'Há to rồi nhanh chóng chu tròn môi',
    mouthIcon: '➡️',
    isVoiced: true,
    row: 3,
    col: 7,
    examples: [
      { word: 'cow', ipa: '/kaʊ/', readVi: 'khao', meaningVi: 'con bò', emoji: '🐮' },
      { word: 'now', ipa: '/naʊ/', readVi: 'nao', meaningVi: 'bây giờ', emoji: '⏰' },
      { word: 'house', ipa: '/haʊs/', readVi: 'hao-s', meaningVi: 'ngôi nhà', emoji: '🏠' },
      { word: 'mouse', ipa: '/maʊs/', readVi: 'mao-s', meaningVi: 'chú chuột', emoji: '🐭' }
    ]
  },

  // ==========================================
  // CONSONANTS (24 PHỤ ÂM)
  // ==========================================
  // Row 1 (21 - 28)
  {
    id: 'ipa-21',
    number: 21,
    symbol: '/p/',
    rawSymbol: 'p',
    category: 'consonant',
    subCategory: 'voiceless_consonant',
    primaryWord: 'Pea',
    highlightLetter: 'p',
    wordMeaningVi: 'hạt đậu',
    emoji: '🫛',
    kidTip: 'Mím chặt 2 môi lại, nén hơi rồi BẬT mạnh luồng gió mát ra ngoài (cổ họng KHÔNG rung)!',
    vietnameseApprox: 'Âm "p" bật hơi gió mạnh',
    mouthAction: 'Mím môi, bật mạnh luồng hơi gió',
    mouthIcon: '💨',
    isVoiced: false,
    row: 1,
    col: 1,
    contrastPairNumber: 22,
    commonMistakeVi: 'Đặt bàn tay trước miệng thấy có luồng gió mát phà vào tay là bé làm đúng!',
    examples: [
      { word: 'pea', ipa: '/piː/', readVi: 'phi', meaningVi: 'hạt đậu', emoji: '🫛' },
      { word: 'pen', ipa: '/pen/', readVi: 'phen', meaningVi: 'cây bút', emoji: '🖊️' },
      { word: 'pig', ipa: '/pɪɡ/', readVi: 'phíc', meaningVi: 'chú lợn', emoji: '🐷' },
      { word: 'stop', ipa: '/stɒp/', readVi: 'x-top', meaningVi: 'dừng lại', emoji: '🛑' }
    ]
  },
  {
    id: 'ipa-22',
    number: 22,
    symbol: '/b/',
    rawSymbol: 'b',
    category: 'consonant',
    subCategory: 'voiced_consonant',
    primaryWord: 'Boat',
    highlightLetter: 'b',
    wordMeaningVi: 'con thuyền',
    emoji: '⛵',
    kidTip: 'Khẩu hình mím môi giống hệt âm /p/, nhưng làm RUNG DÂY THANH QUẢN ở cổ họng, phát âm "bờ"!',
    vietnameseApprox: 'Âm "b" rung cổ họng',
    mouthAction: 'Mím môi bật âm, cổ họng rung',
    mouthIcon: '🔔',
    isVoiced: true,
    row: 1,
    col: 2,
    contrastPairNumber: 21,
    commonMistakeVi: 'Đặt tay lên cổ họng, bé sẽ thấy cổ rung rung nhẹ.',
    examples: [
      { word: 'boat', ipa: '/bəʊt/', readVi: 'bâu-t', meaningVi: 'con thuyền', emoji: '⛵' },
      { word: 'book', ipa: '/bʊk/', readVi: 'búc', meaningVi: 'quyển sách', emoji: '📚' },
      { word: 'baby', ipa: '/ˈbeɪbi/', readVi: 'bêi-bi', meaningVi: 'em bé', emoji: '👶' },
      { word: 'blue', ipa: '/bluː/', readVi: 'b-lu', meaningVi: 'màu xanh', emoji: '🔵' }
    ]
  },
  {
    id: 'ipa-23',
    number: 23,
    symbol: '/t/',
    rawSymbol: 't',
    category: 'consonant',
    subCategory: 'voiceless_consonant',
    primaryWord: 'Tea',
    highlightLetter: 't',
    wordMeaningVi: 'ly trà thơm',
    emoji: '🍵',
    kidTip: 'Đầu lưỡi chạm chân răng hàm trên, nén hơi rồi BẬT mạnh hơi gió ra "th/t", cổ họng KHÔNG rung!',
    vietnameseApprox: 'Âm "t" bật hơi gió nổ giòn',
    mouthAction: 'Đầu lưỡi chạm chân răng, bật hơi',
    mouthIcon: '💨',
    isVoiced: false,
    row: 1,
    col: 3,
    contrastPairNumber: 24,
    commonMistakeVi: 'Khác với chữ "t" tiếng Việt, âm /t/ tiếng Anh có luồng gió bật mạnh mát tay!',
    examples: [
      { word: 'tea', ipa: '/tiː/', readVi: 'thi', meaningVi: 'ly trà', emoji: '🍵' },
      { word: 'two', ipa: '/tuː/', readVi: 'thu', meaningVi: 'số hai', emoji: '✌️' },
      { word: 'cat', ipa: '/kæt/', readVi: 'khet', meaningVi: 'con mèo', emoji: '🐱' },
      { word: 'water', ipa: '/ˈwɔːtər/', readVi: 'ua-tờ', meaningVi: 'nước', emoji: '💧' }
    ]
  },
  {
    id: 'ipa-24',
    number: 24,
    symbol: '/d/',
    rawSymbol: 'd',
    category: 'consonant',
    subCategory: 'voiced_consonant',
    primaryWord: 'Dog',
    highlightLetter: 'd',
    wordMeaningVi: 'chú cún con',
    emoji: '🐶',
    kidTip: 'Khẩu hình đầu lưỡi chạm chân răng giống /t/, nhưng làm RUNG MẠNH cổ họng phát âm "đờ"!',
    vietnameseApprox: 'Âm "đ" rung cổ họng',
    mouthAction: 'Đầu lưỡi chạm chân răng, rung cổ',
    mouthIcon: '🔔',
    isVoiced: true,
    row: 1,
    col: 4,
    contrastPairNumber: 23,
    commonMistakeVi: 'Cổ họng rung lên rõ rệt, âm trầm nảy.',
    examples: [
      { word: 'dog', ipa: '/dɒɡ/', readVi: 'đóc', meaningVi: 'chú cún', emoji: '🐶' },
      { word: 'door', ipa: '/dɔːr/', readVi: 'đo', meaningVi: 'cánh cửa', emoji: '🚪' },
      { word: 'duck', ipa: '/dʌk/', readVi: 'đắc', meaningVi: 'con vịt', emoji: '🦆' },
      { word: 'bed', ipa: '/bed/', readVi: 'bét-đ', meaningVi: 'cái giường', emoji: '🛏️' }
    ]
  },
  {
    id: 'ipa-25',
    number: 25,
    symbol: '/tʃ/',
    rawSymbol: 'tʃ',
    category: 'consonant',
    subCategory: 'voiceless_consonant',
    primaryWord: 'Cheese',
    highlightLetter: 'ch',
    wordMeaningVi: 'miếng phô mai',
    emoji: '🧀',
    kidTip: 'Chu môi tròn ra phía trước, đầu lưỡi chạm vòm miệng rồi BẬT mạnh hơi gió ra "ch-sh"!',
    vietnameseApprox: 'Âm "ch" chu môi bật gió mạnh',
    mouthAction: 'Chu môi, lưỡi chạm vòm bật hơi',
    mouthIcon: '💨',
    isVoiced: false,
    row: 1,
    col: 5,
    contrastPairNumber: 26,
    commonMistakeVi: 'Bé nhớ chu tròn môi thì âm "ch" mới chuẩn bản ngữ nhé!',
    examples: [
      { word: 'cheese', ipa: '/tʃiːz/', readVi: 'chiz', meaningVi: 'phô mai', emoji: '🧀' },
      { word: 'chair', ipa: '/tʃeər/', readVi: 'che-ơ', meaningVi: 'cái ghế', emoji: '🪑' },
      { word: 'chicken', ipa: '/ˈtʃɪkɪn/', readVi: 'chíc-khừn', meaningVi: 'con gà', emoji: '🍗' },
      { word: 'teach', ipa: '/tiːtʃ/', readVi: 'tít-ch', meaningVi: 'dạy học', emoji: '👨‍🏫' }
    ]
  },
  {
    id: 'ipa-26',
    number: 26,
    symbol: '/dʒ/',
    rawSymbol: 'dʒ',
    category: 'consonant',
    subCategory: 'voiced_consonant',
    primaryWord: 'June',
    highlightLetter: 'j',
    wordMeaningVi: 'tháng sáu',
    emoji: '📅',
    kidTip: 'Khẩu hình chu môi giống hệt âm /tʃ/, nhưng RUNG DÂY THANH QUẢN thật mạnh tạo âm "d-zh"!',
    vietnameseApprox: 'Âm "gi/d" chu môi rung cổ họng',
    mouthAction: 'Chu môi bật âm, rung mạnh cổ',
    mouthIcon: '🔔',
    isVoiced: true,
    row: 1,
    col: 6,
    contrastPairNumber: 25,
    commonMistakeVi: 'Chu môi và rung cổ họng, âm nghe trầm và giòn.',
    examples: [
      { word: 'june', ipa: '/dʒuːn/', readVi: 'jun', meaningVi: 'tháng sáu', emoji: '📅' },
      { word: 'juice', ipa: '/dʒuːs/', readVi: 'jus', meaningVi: 'nước ép', emoji: '🧃' },
      { word: 'jump', ipa: '/dʒʌmp/', readVi: 'jăm-p', meaningVi: 'nhảy lên', emoji: '🦘' },
      { word: 'orange', ipa: '/ˈɒrɪndʒ/', readVi: 'o-rin-j', meaningVi: 'quả cam', emoji: '🍊' }
    ]
  },
  {
    id: 'ipa-27',
    number: 27,
    symbol: '/k/',
    rawSymbol: 'k',
    category: 'consonant',
    subCategory: 'voiceless_consonant',
    primaryWord: 'Car',
    highlightLetter: 'c',
    wordMeaningVi: 'xe ô tô',
    emoji: '🚗',
    kidTip: 'Nâng phần sau cuống lưỡi chạm vòm họng trên, nén hơi rồi BẬT mạnh gió ra "kh/k", cổ KHÔNG rung!',
    vietnameseApprox: 'Âm "c/k" bật hơi gió trong họng',
    mouthAction: 'Cuống lưỡi nâng, bật mạnh luồng hơi',
    mouthIcon: '💨',
    isVoiced: false,
    row: 1,
    col: 7,
    contrastPairNumber: 28,
    commonMistakeVi: 'Bật hơi rõ ràng từ cuống họng, tay cảm nhận luồng gió phà ra.',
    examples: [
      { word: 'car', ipa: '/kɑːr/', readVi: 'kha', meaningVi: 'xe ô tô', emoji: '🚗' },
      { word: 'cat', ipa: '/kæt/', readVi: 'khet', meaningVi: 'con mèo', emoji: '🐱' },
      { word: 'key', ipa: '/kiː/', readVi: 'khi', meaningVi: 'chìa khóa', emoji: '🔑' },
      { word: 'milk', ipa: '/mɪlk/', readVi: 'mi-l-k', meaningVi: 'sữa tươi', emoji: '🥛' }
    ]
  },
  {
    id: 'ipa-28',
    number: 28,
    symbol: '/ɡ/',
    rawSymbol: 'ɡ',
    category: 'consonant',
    subCategory: 'voiced_consonant',
    primaryWord: 'Go',
    highlightLetter: 'g',
    wordMeaningVi: 'đi thôi nào',
    emoji: '🏃',
    kidTip: 'Vị trí cuống lưỡi giống âm /k/, nhưng làm RUNG DÂY THANH QUẢN phát âm "gờ" giòn tan!',
    vietnameseApprox: 'Âm "g" rung mạnh trong họng',
    mouthAction: 'Cuống lưỡi nâng, rung cổ họng',
    mouthIcon: '🔔',
    isVoiced: true,
    row: 1,
    col: 8,
    contrastPairNumber: 27,
    commonMistakeVi: 'Cổ họng rung rõ, âm chắc khỏe.',
    examples: [
      { word: 'go', ipa: '/ɡəʊ/', readVi: 'gâu', meaningVi: 'đi tới', emoji: '🏃' },
      { word: 'girl', ipa: '/ɡɜːrl/', readVi: 'gơ-l', meaningVi: 'bé gái', emoji: '👧' },
      { word: 'green', ipa: '/ɡriːn/', readVi: 'g-rin', meaningVi: 'màu xanh lá', emoji: '🟢' },
      { word: 'dog', ipa: '/dɒɡ/', readVi: 'đóc', meaningVi: 'chú cún', emoji: '🐕' }
    ]
  },

  // Row 2 (29 - 36)
  {
    id: 'ipa-29',
    number: 29,
    symbol: '/f/',
    rawSymbol: 'f',
    category: 'consonant',
    subCategory: 'voiceless_consonant',
    primaryWord: 'Fly',
    highlightLetter: 'fl',
    wordMeaningVi: 'bay lượn',
    emoji: '🪰',
    kidTip: 'Răng cửa trên cắn nhẹ lên môi dưới, thổi luồng hơi xì mát rượi qua kẽ răng, cổ KHÔNG rung!',
    vietnameseApprox: 'Răng cắn môi thổi hơi gió "ph"',
    mouthAction: 'Răng trên chạm môi dưới, thổi gió',
    mouthIcon: '💨',
    isVoiced: false,
    row: 2,
    col: 1,
    contrastPairNumber: 30,
    commonMistakeVi: 'Nhớ để răng cửa trên chạm vào môi dưới rồi thổi hơi xì mát.',
    examples: [
      { word: 'fly', ipa: '/flaɪ/', readVi: 'ph-lai', meaningVi: 'bay lượn', emoji: '🪰' },
      { word: 'fish', ipa: '/fɪʃ/', readVi: 'phi-sh', meaningVi: 'con cá', emoji: '🐟' },
      { word: 'four', ipa: '/fɔːr/', readVi: 'pho', meaningVi: 'số bốn', emoji: '4️⃣' },
      { word: 'leaf', ipa: '/liːf/', readVi: 'lif', meaningVi: 'chiếc lá', emoji: '🍃' }
    ]
  },
  {
    id: 'ipa-30',
    number: 30,
    symbol: '/v/',
    rawSymbol: 'v',
    category: 'consonant',
    subCategory: 'voiced_consonant',
    primaryWord: 'Video',
    highlightLetter: 'v',
    wordMeaningVi: 'đoạn phim video',
    emoji: '📹',
    kidTip: 'Răng trên cắn nhẹ môi dưới giống /f/, nhưng làm RUNG CỔ HỌNG phát âm "vờ" râm ran môi!',
    vietnameseApprox: 'Răng cắn môi rung cổ họng "v"',
    mouthAction: 'Răng chạm môi, rung râm ran',
    mouthIcon: '🔔',
    isVoiced: true,
    row: 2,
    col: 2,
    contrastPairNumber: 29,
    commonMistakeVi: 'Môi dưới sẽ thấy hơi tê tê râm ran vì rung động thanh quản.',
    examples: [
      { word: 'video', ipa: '/ˈvɪdiəʊ/', readVi: 'vi-đi-âu', meaningVi: 'đoạn video', emoji: '📹' },
      { word: 'van', ipa: '/væn/', readVi: 'ven', meaningVi: 'xe tải nhỏ', emoji: '🚐' },
      { word: 'very', ipa: '/ˈveri/', readVi: 've-ri', meaningVi: 'rất là', emoji: '⭐' },
      { word: 'love', ipa: '/lʌv/', readVi: 'lớp-v', meaningVi: 'yêu thương', emoji: '❤️' }
    ]
  },
  {
    id: 'ipa-31',
    number: 31,
    symbol: '/θ/',
    rawSymbol: 'θ',
    category: 'consonant',
    subCategory: 'voiceless_consonant',
    primaryWord: 'Think',
    highlightLetter: 'th',
    wordMeaningVi: 'suy nghĩ',
    emoji: '💭',
    kidTip: 'Đặt nhẹ đầu lưỡi ở giữa hai hàm răng (nhô ra 1 chút xíu), thổi nhẹ luồng hơi gió ra, cổ KHÔNG rung!',
    vietnameseApprox: 'Kẹp lưỡi giữa răng thổi hơi gió',
    mouthAction: 'Đầu lưỡi kẹp giữa răng, thổi gió',
    mouthIcon: '👅',
    isVoiced: false,
    row: 2,
    col: 3,
    contrastPairNumber: 32,
    commonMistakeVi: 'Đừng đọc thành chữ "th" hay "x" tiếng Việt. Hãy kẹp nhẹ đầu lưỡi giữa răng!',
    examples: [
      { word: 'think', ipa: '/θɪŋk/', readVi: 'thinh-k', meaningVi: 'suy nghĩ', emoji: '💭' },
      { word: 'three', ipa: '/θriː/', readVi: 'th-ri', meaningVi: 'số ba', emoji: '3️⃣' },
      { word: 'thank', ipa: '/θæŋk/', readVi: 'thenh-k', meaningVi: 'cảm ơn', emoji: '🙏' },
      { word: 'mouth', ipa: '/maʊθ/', readVi: 'mao-th', meaningVi: 'cái miệng', emoji: '👄' }
    ]
  },
  {
    id: 'ipa-32',
    number: 32,
    symbol: '/ð/',
    rawSymbol: 'ð',
    category: 'consonant',
    subCategory: 'voiced_consonant',
    primaryWord: 'This',
    highlightLetter: 'th',
    wordMeaningVi: 'cái này đây',
    emoji: '👉',
    kidTip: 'Đặt nhẹ đầu lưỡi giữa 2 răng giống /θ/, nhưng làm RUNG DÂY THANH QUẢN tạo âm "đờ/dờ" râm ran đầu lưỡi!',
    vietnameseApprox: 'Kẹp lưỡi giữa răng rung cổ họng',
    mouthAction: 'Đầu lưỡi kẹp giữa răng, rung cổ',
    mouthIcon: '🔔',
    isVoiced: true,
    row: 2,
    col: 4,
    contrastPairNumber: 31,
    commonMistakeVi: 'Đầu lưỡi sẽ thấy hơi buồn buồn tê tê vì độ rung.',
    examples: [
      { word: 'this', ipa: '/ðɪs/', readVi: 'đít-s', meaningVi: 'cái này', emoji: '👉' },
      { word: 'that', ipa: '/ðæt/', readVi: 'đét', meaningVi: 'cái kia', emoji: '👈' },
      { word: 'mother', ipa: '/ˈmʌðər/', readVi: 'ma-đờ', meaningVi: 'mẹ', emoji: '👩' },
      { word: 'brother', ipa: '/ˈbrʌðər/', readVi: 'b-ra-đờ', meaningVi: 'anh/em trai', emoji: '👦' }
    ]
  },
  {
    id: 'ipa-33',
    number: 33,
    symbol: '/s/',
    rawSymbol: 's',
    category: 'consonant',
    subCategory: 'voiceless_consonant',
    primaryWord: 'See',
    highlightLetter: 's',
    wordMeaningVi: 'nhìn thấy',
    emoji: '👀',
    kidTip: 'Khép nhẹ 2 hàm răng lại, khóe miệng mỉm cười nhẹ, thổi luồng hơi xì xì sắc bén như tiếng rắn kêu "sss"!',
    vietnameseApprox: 'Xì hơi gió sắc bén như tiếng rắn',
    mouthAction: 'Khép răng mỉm cười, xì hơi sắc bén',
    mouthIcon: '🐍',
    isVoiced: false,
    row: 2,
    col: 5,
    contrastPairNumber: 34,
    commonMistakeVi: 'Hai răng khép nhẹ, đẩy luồng hơi xì giòn, cổ họng hoàn toàn không rung.',
    examples: [
      { word: 'see', ipa: '/siː/', readVi: 'xi', meaningVi: 'nhìn thấy', emoji: '👀' },
      { word: 'sun', ipa: '/sʌn/', readVi: 'xăn', meaningVi: 'mặt trời', emoji: '☀️' },
      { word: 'bus', ipa: '/bʌs/', readVi: 'bắt-s', meaningVi: 'xe buýt', emoji: '🚌' },
      { word: 'sister', ipa: '/ˈsɪstər/', readVi: 'xít-x-tờ', meaningVi: 'chị/em gái', emoji: '👧' }
    ]
  },
  {
    id: 'ipa-34',
    number: 34,
    symbol: '/z/',
    rawSymbol: 'z',
    category: 'consonant',
    subCategory: 'voiced_consonant',
    primaryWord: 'Zoo',
    highlightLetter: 'z',
    wordMeaningVi: 'vườn sở thú',
    emoji: '🦁',
    kidTip: 'Khép răng giống âm /s/, nhưng làm RUNG DÂY THANH QUẢN vo ve như tiếng chú ong chăm chỉ "zzz"!',
    vietnameseApprox: 'Rung vo ve như tiếng chú ong "zzz"',
    mouthAction: 'Khép răng, rung cổ họng vo ve',
    mouthIcon: '🐝',
    isVoiced: true,
    row: 2,
    col: 6,
    contrastPairNumber: 33,
    commonMistakeVi: 'Đặt tay lên cổ họng, rung vo ve rõ rệt như tiếng ong bay.',
    examples: [
      { word: 'zoo', ipa: '/zuː/', readVi: 'zu', meaningVi: 'sở thú', emoji: '🦁' },
      { word: 'zebra', ipa: '/ˈzebrə/', readVi: 'ze-b-rơ', meaningVi: 'ngựa vằn', emoji: '🦓' },
      { word: 'nose', ipa: '/nəʊz/', readVi: 'nâu-z', meaningVi: 'chiếc mũi', emoji: '👃' },
      { word: 'eyes', ipa: '/aɪz/', readVi: 'ai-z', meaningVi: 'đôi mắt', emoji: '👀' }
    ]
  },
  {
    id: 'ipa-35',
    number: 35,
    symbol: '/ʃ/',
    rawSymbol: 'ʃ',
    category: 'consonant',
    subCategory: 'voiceless_consonant',
    primaryWord: 'Shall',
    highlightLetter: 'sh',
    wordMeaningVi: 'sẽ (trang trọng)',
    emoji: '📜',
    kidTip: 'Chu tròn môi về phía trước, thổi luồng hơi xì mạnh và êm như khi bé ra hiệu "suỵt, trật tự nào"!',
    vietnameseApprox: 'Chu môi xì hơi suỵt "sh"',
    mouthAction: 'Chu tròn môi, thổi luồng gió êm',
    mouthIcon: '🤫',
    isVoiced: false,
    row: 2,
    col: 7,
    contrastPairNumber: 36,
    commonMistakeVi: 'Khác với /s/ (khép răng cười), âm /ʃ/ bắt buộc phải chu tròn môi ra phía trước.',
    examples: [
      { word: 'shall', ipa: '/ʃæl/', readVi: 'seo-l', meaningVi: 'sẽ', emoji: '📜' },
      { word: 'sheep', ipa: '/ʃiːp/', readVi: 'ship', meaningVi: 'con cừu', emoji: '🐑' },
      { word: 'fish', ipa: '/fɪʃ/', readVi: 'phi-sh', meaningVi: 'con cá', emoji: '🐟' },
      { word: 'shoe', ipa: '/ʃuː/', readVi: 'shu', meaningVi: 'đôi giày', emoji: '👟' }
    ]
  },
  {
    id: 'ipa-36',
    number: 36,
    symbol: '/ʒ/',
    rawSymbol: 'ʒ',
    category: 'consonant',
    subCategory: 'voiced_consonant',
    primaryWord: 'Television',
    highlightLetter: 'si',
    wordMeaningVi: 'chiếc tivi',
    emoji: '📺',
    kidTip: 'Chu môi tròn giống âm /ʃ/, nhưng làm RUNG MẠNH cổ họng tạo âm "d-zh" dày và ấm!',
    vietnameseApprox: 'Chu môi rung cổ họng "gi/dzh"',
    mouthAction: 'Chu môi, rung cổ họng thật ấm',
    mouthIcon: '🔔',
    isVoiced: true,
    row: 2,
    col: 8,
    contrastPairNumber: 35,
    commonMistakeVi: 'Âm này thường nằm giữa từ (như vision, measure, casual).',
    examples: [
      { word: 'television', ipa: '/ˈtelɪvɪʒən/', readVi: 'te-li-vi-zhơn', meaningVi: 'ti vi', emoji: '📺' },
      { word: 'treasure', ipa: '/ˈtreʒər/', readVi: 't-re-zhờ', meaningVi: 'kho báu', emoji: '💎' },
      { word: 'measure', ipa: '/ˈmeʒər/', readVi: 'me-zhờ', meaningVi: 'đo lường', emoji: '📏' },
      { word: 'casual', ipa: '/ˈkæʒuəl/', readVi: 'khe-zhu-ồ', meaningVi: 'thường ngày', emoji: '👕' }
    ]
  },

  // Row 3 (37 - 44)
  {
    id: 'ipa-37',
    number: 37,
    symbol: '/m/',
    rawSymbol: 'm',
    category: 'consonant',
    subCategory: 'voiced_consonant',
    primaryWord: 'Man',
    highlightLetter: 'm',
    wordMeaningVi: 'người đàn ông',
    emoji: '👨',
    kidTip: 'Mím chặt 2 môi lại, đẩy luồng hơi thoát lên khoang mũi tạo âm "ùm-m" như khi khen đồ ăn ngon!',
    vietnameseApprox: 'Âm "m" thoát hơi qua mũi',
    mouthAction: 'Mím 2 môi, âm vang khoang mũi',
    mouthIcon: '😋',
    isVoiced: true,
    row: 3,
    col: 1,
    examples: [
      { word: 'man', ipa: '/mæn/', readVi: 'men', meaningVi: 'người đàn ông', emoji: '👨' },
      { word: 'mom', ipa: '/mɒm/', readVi: 'mom', meaningVi: 'mẹ hiền', emoji: '👩' },
      { word: 'milk', ipa: '/mɪlk/', readVi: 'mi-l-k', meaningVi: 'sữa thơm', emoji: '🥛' },
      { word: 'monkey', ipa: '/ˈmʌŋki/', readVi: 'măng-khi', meaningVi: 'chú khỉ', emoji: '🐒' }
    ]
  },
  {
    id: 'ipa-38',
    number: 38,
    symbol: '/n/',
    rawSymbol: 'n',
    category: 'consonant',
    subCategory: 'voiced_consonant',
    primaryWord: 'Now',
    highlightLetter: 'n',
    wordMeaningVi: 'ngay bây giờ',
    emoji: '⏰',
    kidTip: 'Đầu lưỡi chạm chân răng trên, môi mở nhẹ, đẩy luồng hơi thoát lên mũi tạo âm "ừn-n"!',
    vietnameseApprox: 'Âm "n" thoát hơi qua mũi',
    mouthAction: 'Đầu lưỡi chặn vòm, âm vang mũi',
    mouthIcon: '👃',
    isVoiced: true,
    row: 3,
    col: 2,
    examples: [
      { word: 'now', ipa: '/naʊ/', readVi: 'nao', meaningVi: 'bây giờ', emoji: '⏰' },
      { word: 'no', ipa: '/nəʊ/', readVi: 'nâu', meaningVi: 'không phải', emoji: '🙅' },
      { word: 'nose', ipa: '/nəʊz/', readVi: 'nâu-z', meaningVi: 'chiếc mũi', emoji: '👃' },
      { word: 'sun', ipa: '/sʌn/', readVi: 'xăn', meaningVi: 'mặt trời', emoji: '☀️' }
    ]
  },
  {
    id: 'ipa-39',
    number: 39,
    symbol: '/ŋ/',
    rawSymbol: 'ŋ',
    category: 'consonant',
    subCategory: 'voiced_consonant',
    primaryWord: 'Sing',
    highlightLetter: 'ng',
    wordMeaningVi: 'hát ca yêu đời',
    emoji: '🎤',
    kidTip: 'Nâng cuống lưỡi chạm vòm miệng mềm, thoát hơi qua mũi giống âm "ng" cuối từ trong tiếng Việt!',
    vietnameseApprox: 'Âm "ng" vang trong khoang mũi',
    mouthAction: 'Cuống lưỡi nâng, âm vang khoang mũi',
    mouthIcon: '🎶',
    isVoiced: true,
    row: 3,
    col: 3,
    examples: [
      { word: 'sing', ipa: '/sɪŋ/', readVi: 'xinh', meaningVi: 'ca hát', emoji: '🎤' },
      { word: 'song', ipa: '/sɒŋ/', readVi: 'xong', meaningVi: 'bài hát', emoji: '🎵' },
      { word: 'ring', ipa: '/rɪŋ/', readVi: 'rinh', meaningVi: 'chiếc nhẫn', emoji: '💍' },
      { word: 'morning', ipa: '/ˈmɔːrnɪŋ/', readVi: 'mo-ninh', meaningVi: 'buổi sáng', emoji: '🌅' }
    ]
  },
  {
    id: 'ipa-40',
    number: 40,
    symbol: '/h/',
    rawSymbol: 'h',
    category: 'consonant',
    subCategory: 'voiceless_consonant',
    primaryWord: 'Hat',
    highlightLetter: 'h',
    wordMeaningVi: 'chiếc mũ đội đầu',
    emoji: '🎩',
    kidTip: 'Mở miệng tự nhiên, thở nhẹ một luồng hơi ấm từ cổ họng ra như khi bé thở phào nhẹ nhõm "hàaa"!',
    vietnameseApprox: 'Thở hơi nhẹ tự nhiên "h"',
    mouthAction: 'Mở miệng thả lỏng, thở hơi ấm',
    mouthIcon: '💨',
    isVoiced: false,
    row: 3,
    col: 4,
    examples: [
      { word: 'hat', ipa: '/hæt/', readVi: 'hét', meaningVi: 'chiếc mũ', emoji: '🎩' },
      { word: 'hot', ipa: '/hɒt/', readVi: 'hót', meaningVi: 'nóng bức', emoji: '🔥' },
      { word: 'hand', ipa: '/hænd/', readVi: 'hen-đ', meaningVi: 'bàn tay', emoji: '✋' },
      { word: 'happy', ipa: '/ˈhæpi/', readVi: 'hép-pi', meaningVi: 'vui vẻ', emoji: '😊' }
    ]
  },
  {
    id: 'ipa-41',
    number: 41,
    symbol: '/l/',
    rawSymbol: 'l',
    category: 'consonant',
    subCategory: 'voiced_consonant',
    primaryWord: 'Love',
    highlightLetter: 'l',
    wordMeaningVi: 'yêu thương gia đình',
    emoji: '❤️',
    kidTip: 'Đặt đầu lưỡi chạm chân răng hàm trên, luồng hơi thoát ra ở hai bên cạnh lưỡi tạo âm "lờ" trong trẻo!',
    vietnameseApprox: 'Âm "l" trong trẻo',
    mouthAction: 'Đầu lưỡi chạm chân răng trên',
    mouthIcon: '👅',
    isVoiced: true,
    row: 3,
    col: 5,
    examples: [
      { word: 'love', ipa: '/lʌv/', readVi: 'lớp-v', meaningVi: 'yêu thương', emoji: '❤️' },
      { word: 'lemon', ipa: '/ˈlemən/', readVi: 'le-mừn', meaningVi: 'quả chanh', emoji: '🍋' },
      { word: 'leg', ipa: '/leɡ/', readVi: 'léc', meaningVi: 'cái chân', emoji: '🦵' },
      { word: 'ball', ipa: '/bɔːl/', readVi: 'boo-l', meaningVi: 'quả bóng', emoji: '⚽' }
    ]
  },
  {
    id: 'ipa-42',
    number: 42,
    symbol: '/r/',
    rawSymbol: 'r',
    category: 'consonant',
    subCategory: 'voiced_consonant',
    primaryWord: 'Red',
    highlightLetter: 'r',
    wordMeaningVi: 'màu đỏ rực rỡ',
    emoji: '🔴',
    kidTip: 'Chu môi nhẹ, uốn cong đầu lưỡi vào trong vòm họng (KHÔNG để đầu lưỡi chạm vào đâu), phát âm "r" tròn đầy!',
    vietnameseApprox: 'Âm "r" uốn cong đầu lưỡi',
    mouthAction: 'Chu môi nhẹ, uốn cong đầu lưỡi',
    mouthIcon: '👅',
    isVoiced: true,
    row: 3,
    col: 6,
    examples: [
      { word: 'red', ipa: '/red/', readVi: 'rét-đ', meaningVi: 'màu đỏ', emoji: '🔴' },
      { word: 'rabbit', ipa: '/ˈræbɪt/', readVi: 're-bịt', meaningVi: 'chú thỏ', emoji: '🐰' },
      { word: 'run', ipa: '/rʌn/', readVi: 'răn', meaningVi: 'chạy bộ', emoji: '🏃' },
      { word: 'rain', ipa: '/reɪn/', readVi: 'rên', meaningVi: 'cơn mưa', emoji: '🌧️' }
    ]
  },
  {
    id: 'ipa-43',
    number: 43,
    symbol: '/w/',
    rawSymbol: 'w',
    category: 'consonant',
    subCategory: 'voiced_consonant',
    primaryWord: 'Wet',
    highlightLetter: 'w',
    wordMeaningVi: 'ướt đẫm nước mưa',
    emoji: '💧',
    kidTip: 'Môi chu nhỏ tròn xoe như chuẩn bị huýt sáo, rồi mở nhanh sang hai bên phát âm "u-ơ" hay "quờ"!',
    vietnameseApprox: 'Chu môi tròn mở nhanh "u-ờ / quờ"',
    mouthAction: 'Chu môi tròn rồi mở nhanh',
    mouthIcon: '😗',
    isVoiced: true,
    row: 3,
    col: 7,
    examples: [
      { word: 'wet', ipa: '/wet/', readVi: 'uét', meaningVi: 'ẩm ướt', emoji: '💧' },
      { word: 'water', ipa: '/ˈwɔːtər/', readVi: 'ua-tờ', meaningVi: 'nước uống', emoji: '🥤' },
      { word: 'wind', ipa: '/wɪnd/', readVi: 'uyn-đ', meaningVi: 'cơn gió', emoji: '💨' },
      { word: 'warm', ipa: '/wɔːrm/', readVi: 'uo-m', meaningVi: 'ấm áp', emoji: '☀️' }
    ]
  },
  {
    id: 'ipa-44',
    number: 44,
    symbol: '/j/',
    rawSymbol: 'j',
    category: 'consonant',
    subCategory: 'voiced_consonant',
    primaryWord: 'Yes',
    highlightLetter: 'y',
    wordMeaningVi: 'vâng ạ, đồng ý',
    emoji: '👍',
    kidTip: 'Nâng thân lưỡi lên sát vòm miệng cứng, phát âm lướt nhanh từ "i" sang nguyên âm sau giống chữ "d/di" tiếng Việt!',
    vietnameseApprox: 'Âm "d/di" phát lướt nhanh',
    mouthAction: 'Thân lưỡi nâng cao, lướt nhanh',
    mouthIcon: '😄',
    isVoiced: true,
    row: 3,
    col: 8,
    examples: [
      { word: 'yes', ipa: '/jes/', readVi: 'dét-s', meaningVi: 'vâng ạ', emoji: '👍' },
      { word: 'yellow', ipa: '/ˈjeloʊ/', readVi: 'de-lâu', meaningVi: 'màu vàng', emoji: '💛' },
      { word: 'you', ipa: '/juː/', readVi: 'diu', meaningVi: 'bạn, các bạn', emoji: '👉' },
      { word: 'yogurt', ipa: '/ˈjoʊɡərt/', readVi: 'dâu-gơ-t', meaningVi: 'sữa chua', emoji: '🍦' }
    ]
  }
];

// Helper mapping by number
export const IPA_BY_NUMBER = new Map<number, IPASoundItem>(
  IPA_SOUNDS_DATA.map((item) => [item.number, item])
);

// High-priority contrast pairs for young learners
export const CONTRAST_PAIRS = [
  { pair: [1, 2], title: '/iː/ (Sheep) vs /ɪ/ (Ship)', tip: 'Âm /iː/ cười dài tươi 🐑 vs âm /ɪ/ dứt khoát ngắn gọn 🚢' },
  { pair: [3, 4], title: '/ʊ/ (Good) vs /uː/ (Shoot)', tip: 'Âm /ʊ/ thả lỏng ngắn 👍 vs âm /uː/ chu môi ngân dài 🎯' },
  { pair: [7, 14], title: '/e/ (Bed) vs /æ/ (Cat)', tip: 'Âm /e/ mở vừa 🛏️ vs âm /æ/ hạ hàm há to hết cỡ 🐱' },
  { pair: [10, 17], title: '/ɔː/ (Door) vs /ɒ/ (On)', tip: 'Âm /ɔː/ tròn môi ngân dài 🚪 vs âm /ɒ/ dứt khoát 💡' },
  { pair: [21, 22], title: '/p/ (Pea) vs /b/ (Boat)', tip: 'Âm /p/ thổi gió mát 🫛 vs âm /b/ rung thanh quản ⛵' },
  { pair: [23, 24], title: '/t/ (Tea) vs /d/ (Dog)', tip: 'Âm /t/ bật hơi gió 🍵 vs âm /d/ rung thanh quản 🐶' },
  { pair: [27, 28], title: '/k/ (Car) vs /ɡ/ (Go)', tip: 'Âm /k/ bật hơi cuống họng 🚗 vs âm /ɡ/ rung cổ họng 🏃' },
  { pair: [29, 30], title: '/f/ (Fly) vs /v/ (Video)', tip: 'Âm /f/ răng cắn môi thổi gió 🪰 vs âm /v/ rung môi râm ran 📹' },
  { pair: [31, 32], title: '/θ/ (Think) vs /ð/ (This)', tip: 'Âm /θ/ kẹp lưỡi thổi gió 💭 vs âm /ð/ kẹp lưỡi rung cổ 👉' },
  { pair: [33, 34], title: '/s/ (See) vs /z/ (Zoo)', tip: 'Âm /s/ xì như tiếng rắn 👀 vs âm /z/ vo ve như tiếng ong 🦁' },
  { pair: [35, 36], title: '/ʃ/ (Shall) vs /ʒ/ (Television)', tip: 'Âm /ʃ/ chu môi suỵt gió 📜 vs âm /ʒ/ chu môi rung cổ họng 📺' },
  { pair: [25, 26], title: '/tʃ/ (Cheese) vs /dʒ/ (June)', tip: 'Âm /tʃ/ bật hơi gió chu môi 🧀 vs âm /dʒ/ chu môi rung họng 📅' }
];
