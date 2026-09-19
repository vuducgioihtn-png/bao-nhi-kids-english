import json

with open('curated_lexicon.json', 'r', encoding='utf-8') as f:
    lexicon = json.load(f)

ADDITIONAL_CORE = {
    'can': {'ipa': 'kæn', 'readVi': 'khen'},
    'could': {'ipa': 'kʊd', 'readVi': 'cu-đ'},
    'would': {'ipa': 'wʊd', 'readVi': 'u-đ'},
    'should': {'ipa': 'ʃʊd', 'readVi': 'su-đ'},
    'will': {'ipa': 'wɪl', 'readVi': 'uy-l'},
    'shall': {'ipa': 'ʃæl', 'readVi': 'seo-l'},
    'may': {'ipa': 'meɪ', 'readVi': 'mêi'},
    'might': {'ipa': 'maɪt', 'readVi': 'mai-t'},
    'must': {'ipa': 'mʌst', 'readVi': 'mắt-x-t'},
    'of': {'ipa': 'ʌv', 'readVi': 'ơ-v'},
    'and': {'ipa': 'ænd', 'readVi': 'en-đ'},
    'all': {'ipa': 'ɔːl', 'readVi': 'ool'},
    'talk': {'ipa': 'tɔːk', 'readVi': 'thoóc'},
    'talks': {'ipa': 'tɔːks', 'readVi': 'thoóc-s'},
    'talked': {'ipa': 'tɔːkt', 'readVi': 'thoóc-t'},
    'talking': {'ipa': 'ˈtɔːkɪŋ', 'readVi': 'thoóc-kinh'},
    'walk': {'ipa': 'wɔːk', 'readVi': 'uoóc'},
    'walks': {'ipa': 'wɔːks', 'readVi': 'uoóc-s'},
    'walked': {'ipa': 'wɔːkt', 'readVi': 'uoóc-t'},
    'walking': {'ipa': 'ˈwɔːkɪŋ', 'readVi': 'uoóc-kinh'},
    'love': {'ipa': 'lʌv', 'readVi': 'lớp-v'},
    'loves': {'ipa': 'lʌvz', 'readVi': 'lớp-v-z'},
    'loving': {'ipa': 'ˈlʌvɪŋ', 'readVi': 'lắp-vinh'},
    'loved': {'ipa': 'lʌvd', 'readVi': 'lớp-v-đ'},
    'live': {'ipa': 'lɪv', 'readVi': 'li-v'},
    'lives': {'ipa': 'lɪvz', 'readVi': 'li-v-z'},
    'living': {'ipa': 'ˈlɪvɪŋ', 'readVi': 'li-vinh'},
    'color': {'ipa': 'ˈkʌlər', 'readVi': 'ca-lờ'},
    'colors': {'ipa': 'ˈkʌlərz', 'readVi': 'ca-lờ-z'},
    'today': {'ipa': 'təˈdeɪ', 'readVi': 'tơ-đây'},
    'tomorrow': {'ipa': 'təˈmɔːroʊ', 'readVi': 'tơ-mo-râu'},
    'yesterday': {'ipa': 'ˈjestərdeɪ', 'readVi': 'dét-tơ-đây'},
    'myself': {'ipa': 'maɪˈself', 'readVi': 'mai-seo-ph'},
    'yourself': {'ipa': 'jɔːrˈself', 'readVi': 'do-seo-ph'},
    'himself': {'ipa': 'hɪmˈself', 'readVi': 'him-seo-ph'},
    'herself': {'ipa': 'hɜːrˈself', 'readVi': 'hơ-seo-ph'},
    'itself': {'ipa': 'ɪtˈself', 'readVi': 'ít-seo-ph'},
    'ourselves': {'ipa': 'aʊərˈselvz', 'readVi': 'ao-seo-v-z'},
    'yourselves': {'ipa': 'jɔːrˈselvz', 'readVi': 'do-seo-v-z'},
    'themselves': {'ipa': 'ðemˈselvz', 'readVi': 'đem-seo-v-z'},
    'preserves': {'ipa': 'prɪˈzɜːrvz', 'readVi': 'p-ri-zơ-v-z'},
    'protects': {'ipa': 'prəˈtekts', 'readVi': 'p-rơ-tếch-t-s'},
}

merged = {}
for k, v in lexicon.items():
    clean_ipa = v['ipa'].strip('/')
    merged[k] = {'ipa': clean_ipa, 'readVi': v['readVi']}

for k, v in ADDITIONAL_CORE.items():
    merged[k] = {'ipa': v['ipa'].strip('/'), 'readVi': v['readVi']}

sorted_keys = sorted(merged.keys())

ts_content = '''/**
 * Bảng phiên âm Quốc Tế (IPA) và Gợi ý cách đọc tiếng Việt chuẩn tiếng Anh
 * được rà soát và chuẩn hóa theo quy chuẩn phát âm chuẩn Anh-Mỹ (General American)
 * dành riêng cho học sinh tiểu học (Lớp 2 / Bé Bảo Nhi).
 * 
 * Quy ước cách đọc tiếng Việt chuẩn ngữ âm tiếng Anh:
 * - Âm đuôi gió/xát: -s, -z (vd: đít-s, i-z, búc-s, ph-ren-đ-z)
 * - Âm đuôi bật hơi: -t, -k, -p, -ch (vd: lai-k, thoóc, ít, uót-sh, ti-ch)
 * - Âm đuôi rung/chặn: -đ, -g, -v, -m, -n, -l (vd: u-đ, béc-g, li-v, x-cu-l)
 * - Cụm phụ âm đầu chuẩn: p-l, b-r, c-l, s-t, s-p, s-m, s-k, th- (vd: p-lây, b-rai-t, x-kai, th-ri)
 * - Không Việt hóa sai âm như: toác (talk), lúp (love), uút (would), tơ-đê (today), mai-xen-ph (myself).
 */

export const PHONETIC_DICT: Record<string, { ipa: string; readVi: string }> = {
'''

for k in sorted_keys:
    val = merged[k]
    clean_k = k.replace("'", "\\'")
    ipa_str = val['ipa'].replace("'", "\\'")
    read_str = val['readVi'].replace("'", "\\'")
    ts_content += f"  '{clean_k}': {{ ipa: '{ipa_str}', readVi: '{read_str}' }},\n"

ts_content += '''};

/**
 * Tách một từ tiếng Anh và trả lời phiên âm IPA cùng gợi ý đọc tiếng Việt chuẩn
 */
export function getWordPhonetic(rawWord: string): { ipa: string; readVi: string } {
  const cleanWord = rawWord.toLowerCase().replace(/[^a-z0-9']/g, '');
  if (!cleanWord) {
    return { ipa: '', readVi: '' };
  }

  // 1. Kiểm tra trực tiếp trong từ điển đã chuẩn hóa
  if (PHONETIC_DICT[cleanWord]) {
    const entry = PHONETIC_DICT[cleanWord];
    return {
      ipa: entry.ipa.startsWith('/') ? entry.ipa : `/${entry.ipa}/`,
      readVi: entry.readVi,
    };
  }

  // 2. Thử tách số nhiều / ngôi thứ 3 đuôi -s, -es
  if (cleanWord.endsWith('s') && cleanWord.length > 2) {
    const baseWord = cleanWord.endsWith('es') 
      ? cleanWord.slice(0, -2) 
      : cleanWord.slice(0, -1);
    
    if (PHONETIC_DICT[baseWord]) {
      const base = PHONETIC_DICT[baseWord];
      const isVoiced = /[bdegjlmnrvywz]$/.test(baseWord) || /[aeiou]$/.test(baseWord);
      return {
        ipa: `/${base.ipa}${isVoiced ? 'z' : 's'}/`,
        readVi: `${base.readVi}-${isVoiced ? 'z' : 's'}`,
      };
    }
  }

  // 3. Thử tách thì quá khứ đuôi -ed
  if (cleanWord.endsWith('ed') && cleanWord.length > 3) {
    const baseWord = cleanWord.slice(0, -2);
    if (PHONETIC_DICT[baseWord]) {
      const base = PHONETIC_DICT[baseWord];
      return {
        ipa: `/${base.ipa}d/`,
        readVi: `${base.readVi}-đ`,
      };
    }
  }

  // 4. Thử tách tiếp diễn đuôi -ing
  if (cleanWord.endsWith('ing') && cleanWord.length > 4) {
    const baseWord = cleanWord.slice(0, -3);
    if (PHONETIC_DICT[baseWord]) {
      const base = PHONETIC_DICT[baseWord];
      return {
        ipa: `/${base.ipa}ɪŋ/`,
        readVi: `${base.readVi}-inh`,
      };
    }
  }

  // 5. Thử tách trạng từ đuôi -ly
  if (cleanWord.endsWith('ly') && cleanWord.length > 3) {
    const baseWord = cleanWord.slice(0, -2);
    if (PHONETIC_DICT[baseWord]) {
      const base = PHONETIC_DICT[baseWord];
      return {
        ipa: `/${base.ipa}li/`,
        readVi: `${base.readVi}-li`,
      };
    }
  }

  return {
    ipa: `/${cleanWord}/`,
    readVi: cleanWord,
  };
}

/**
 * Tự động tạo phiên âm IPA và Cách đọc tiếng Việt cho cả câu hoàn chỉnh
 */
export function generateSentencePhonetics(sentence: string): { ipa: string; readVi: string } {
  const rawTokens = sentence.match(/[\\w']+|[.,!?;:]/g) || [];
  const ipaParts: string[] = [];
  const readViParts: string[] = [];

  for (const token of rawTokens) {
    if (/[.,!?;:]/.test(token)) {
      if (readViParts.length > 0) {
        readViParts[readViParts.length - 1] += token;
      }
      continue;
    }

    const clean = token.toLowerCase().replace(/[^a-z0-9']/g, '');
    if (!clean) continue;

    const info = getWordPhonetic(clean);
    const cleanIpa = info.ipa.replace(/^\\/|\\/$/g, '');
    
    let readVal = info.readVi;
    if (token[0] === token[0].toUpperCase() && ['nam', 'mai', 'lan', 'hoa', 'minh', 'linh', 'ha', 'an', 'bao', 'nhi', 'vietnam', 'vietnamese', 'hanoi'].includes(clean)) {
      readVal = readVal.charAt(0).toUpperCase() + readVal.slice(1);
    }

    ipaParts.push(cleanIpa);
    readViParts.push(readVal);
  }

  const finalIpa = '/' + ipaParts.join(' ') + '/';
  let finalReadVi = readViParts.join(' ');
  if (finalReadVi) {
    finalReadVi = finalReadVi.charAt(0).toUpperCase() + finalReadVi.slice(1);
  }

  return {
    ipa: finalIpa,
    readVi: finalReadVi,
  };
}

/**
 * Lấy phiên âm IPA và Gợi ý đọc tiếng Việt cho một dòng đối thoại hoặc câu đơn
 */
export function getPhoneticsForLine(line: { en: string; ipa?: string; readVi?: string }): {
  ipa: string;
  readVi: string;
} {
  if (line.ipa && line.readVi) {
    return {
      ipa: line.ipa.startsWith('/') ? line.ipa : `/${line.ipa}/`,
      readVi: line.readVi,
    };
  }

  const generated = generateSentencePhonetics(line.en);
  return {
    ipa: line.ipa ? (line.ipa.startsWith('/') ? line.ipa : `/${line.ipa}/`) : generated.ipa,
    readVi: line.readVi || generated.readVi,
  };
}

/**
 * Phân giải dữ liệu phát âm cho một câu trong bài đọc SpeakingPassage
 */
export function getSentencePhonetics(sentence: { textEn: string; ipa?: string; readVi?: string }): {
  ipa: string;
  readVi: string;
} {
  if (sentence.ipa && sentence.readVi) {
    return {
      ipa: sentence.ipa.startsWith('/') ? sentence.ipa : `/${sentence.ipa}/`,
      readVi: sentence.readVi,
    };
  }

  const generated = generateSentencePhonetics(sentence.textEn);
  return {
    ipa: sentence.ipa ? (sentence.ipa.startsWith('/') ? sentence.ipa : `/${sentence.ipa}/`) : generated.ipa,
    readVi: sentence.readVi || generated.readVi,
  };
}

/**
 * Phân giải dữ liệu phát âm cho một từ vựng trong bài đọc
 */
export function getVocabPhonetics(vocab: { word: string; ipa?: string; readVi?: string }): {
  ipa: string;
  readVi: string;
} {
  if (vocab.ipa && vocab.readVi) {
    return {
      ipa: vocab.ipa.startsWith('/') ? vocab.ipa : `/${vocab.ipa}/`,
      readVi: vocab.readVi,
    };
  }

  const generated = getWordPhonetic(vocab.word);
  return {
    ipa: vocab.ipa ? (vocab.ipa.startsWith('/') ? vocab.ipa : `/${vocab.ipa}/`) : generated.ipa,
    readVi: vocab.readVi || generated.readVi,
  };
}

/**
 * Tách từng từ trong câu kèm phiên âm IPA và gợi ý đọc tiếng Việt
 * để bé có thể bấm vào từng từ lẻ để luyện nghe và phát âm riêng
 */
export function getSentenceWordsWithPhonetics(sentence: string): Array<{
  raw: string;
  clean: string;
  ipa: string;
  readVi: string;
}> {
  const rawWords = sentence.split(/\\s+/).filter(Boolean);
  return rawWords.map((raw) => {
    const clean = raw.toLowerCase().replace(/[^a-z0-9']/g, '');
    const phonetics = getWordPhonetic(clean);
    return {
      raw,
      clean,
      ipa: phonetics.ipa.startsWith('/') ? phonetics.ipa : `/${phonetics.ipa}/`,
      readVi: phonetics.readVi,
    };
  });
}
'''

with open('src/utils/phonetics.ts', 'w', encoding='utf-8') as f:
    f.write(ts_content)

print("Regenerated src/utils/phonetics.ts with quoted keys.")
