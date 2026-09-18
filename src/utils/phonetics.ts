/**
 * Bảng phiên âm Quốc Tế (IPA) và Gợi ý cách đọc tiếng Việt chuẩn tiếng Anh
 * được thiết kế riêng cho bé (Bé Bảo Nhi & các bạn nhỏ tiểu học/mầm non).
 * 
 * Quy ước cách đọc tiếng Việt chuẩn âm tiếng Anh:
 * - Các phụ âm đuôi gió: -s, -z (vd: đít-s, i-z, búc-s, rên-bâu-z)
 * - Các phụ âm bật hơi: -t, -k, -p, -ch (vd: két-t, búc-k, chăm-p, oát-ch)
 * - Các phụ âm rung/chặn: -đ, -g, -v, -m, -n, -l (vd: phen-đ, đoóc-g, he-v, x-cun)
 * - Cụm phụ âm đầu: p-l, b-r, c-l, s-t, s-p, s-m, s-k, th- (vd: p-lây, b-rai-t, x-kai, th-ri)
 */

export const PHONETIC_DICT: Record<string, { ipa: string; readVi: string }> = {
  // === MẠO TỪ, ĐẠI TỪ & TỪ NỐI THÔNG DỤNG NHẤT ===
  the: { ipa: 'ðə', readVi: 'đơ' },
  a: { ipa: 'ə', readVi: 'ơ' },
  an: { ipa: 'ən', readVi: 'ân' },
  of: { ipa: 'ʌv', readVi: 'ớp-v' },
  and: { ipa: 'ænd', readVi: 'èn-đ' },
  in: { ipa: 'ɪn', readVi: 'in' },
  on: { ipa: 'ɑːn', readVi: 'on' },
  at: { ipa: 'æt', readVi: 'ét' },
  to: { ipa: 'tuː', readVi: 'tu' },
  for: { ipa: 'fɔːr', readVi: 'pho' },
  with: { ipa: 'wɪð', readVi: 'uýt-đ' },
  from: { ipa: 'frʌm', readVi: 'ph-răm' },
  by: { ipa: 'baɪ', readVi: 'bai' },
  about: { ipa: 'əˈbaʊt', readVi: 'ơ-bao-t' },
  into: { ipa: 'ˈɪntuː', readVi: 'in-tu' },
  through: { ipa: 'θruː', readVi: 'th-ru' },
  across: { ipa: 'əˈkrɔːs', readVi: 'ơ-c-rót-s' },
  around: { ipa: 'əˈraʊnd', readVi: 'ơ-rao-n-đ' },
  over: { ipa: 'ˈoʊvər', readVi: 'âu-vờ' },
  under: { ipa: 'ˈʌndər', readVi: 'ăn-đờ' },
  up: { ipa: 'ʌp', readVi: 'ắp' },
  down: { ipa: 'daʊn', readVi: 'đao-n' },
  inside: { ipa: 'ˌɪnˈsaɪd', readVi: 'in-xai-đ' },
  outside: { ipa: 'ˌaʊtˈsaɪd', readVi: 'ao-t-xai-đ' },
  within: { ipa: 'wɪˈðɪn', readVi: 'uýt-đin' },
  than: { ipa: 'ðæn', readVi: 'đen' },
  back: { ipa: 'bæk', readVi: 'béc-k' },
  light: { ipa: 'laɪt', readVi: 'lai-t' },
  dark: { ipa: 'dɑːrk', readVi: 'đác-k' },
  sound: { ipa: 'saʊnd', readVi: 'xao-n-đ' },
  life: { ipa: 'laɪf', readVi: 'lai-ph' },
  brain: { ipa: 'breɪn', readVi: 'b-rên' },
  paper: { ipa: 'ˈpeɪpər', readVi: 'pê-pờ' },
  human: { ipa: 'ˈhjuːmən', readVi: 'hiu-mần' },
  natural: { ipa: 'ˈnætʃrəl', readVi: 'né-chơ-rồl' },
  soil: { ipa: 'sɔɪl', readVi: 'xoi-ồl' },
  smooth: { ipa: 'smuːð', readVi: 'x-mu-đ' },
  colorful: { ipa: 'ˈkʌlərfl', readVi: 'khơ-lơ-phồl' },
  delicate: { ipa: 'ˈdelɪkət', readVi: 'đe-li-khợt' },
  community: { ipa: 'kəˈmjuːnəti', readVi: 'cơm-miu-nơ-ti' },
  appear: { ipa: 'əˈpɪr', readVi: 'ơ-pia' },
  appears: { ipa: 'əˈpɪrz', readVi: 'ơ-pia-z' },
  appeared: { ipa: 'əˈpɪrd', readVi: 'ơ-pia-đ' },
  between: { ipa: 'bɪˈtwiːn', readVi: 'bi-t-uin' },
  behind: { ipa: 'bɪˈhaɪnd', readVi: 'bi-hain-đ' },
  near: { ipa: 'nɪr', readVi: 'nia' },
  during: { ipa: 'ˈdʊrɪŋ', readVi: 'đu-rinh' },
  without: { ipa: 'wɪˈðaʊt', readVi: 'uýt-đao-t' },
  beneath: { ipa: 'bɪˈniːθ', readVi: 'bi-nith' },
  against: { ipa: 'əˈɡenst', readVi: 'ơ-ghen-x-t' },
  as: { ipa: 'æz', readVi: 'át-z' },
  so: { ipa: 'soʊ', readVi: 'xâu' },
  but: { ipa: 'bʌt', readVi: 'bắt' },
  or: { ipa: 'ɔːr', readVi: 'o' },
  if: { ipa: 'ɪf', readVi: 'íp-ph' },
  because: { ipa: 'bɪˈkəz', readVi: 'bi-cơ-z' },
  while: { ipa: 'waɪl', readVi: 'oai-ồl' },
  after: { ipa: 'ˈæftər', readVi: 'áp-tơ' },
  before: { ipa: 'bɪˈfɔːr', readVi: 'bi-pho' },
  then: { ipa: 'ðen', readVi: 'đen' },
  now: { ipa: 'naʊ', readVi: 'nao' },
  all: { ipa: 'ɔːl', readVi: 'o-l' },
  every: { ipa: 'ˈevri', readVi: 'ép-v-ri' },
  each: { ipa: 'iːtʃ', readVi: 'ích' },
  both: { ipa: 'boʊθ', readVi: 'bôuth' },
  some: { ipa: 'sʌm', readVi: 'xăm' },
  any: { ipa: 'ˈeni', readVi: 'e-ni' },
  many: { ipa: 'ˈmeni', readVi: 'me-ni' },
  much: { ipa: 'mʌtʃ', readVi: 'mắt-ch' },
  more: { ipa: 'mɔːr', readVi: 'mo' },
  most: { ipa: 'moʊst', readVi: 'mâu-x-t' },
  little: { ipa: 'ˈlɪtl', readVi: 'lít-tồl' },
  very: { ipa: 'ˈveri', readVi: 've-ri' },
  too: { ipa: 'tuː', readVi: 'tu' },
  also: { ipa: 'ˈɔːlsoʊ', readVi: 'on-xâu' },
  always: { ipa: 'ˈɔːlweɪz', readVi: 'on-uây-z' },
  often: { ipa: 'ˈɔːfn', readVi: 'ó-phừn' },
  sometimes: { ipa: 'ˈsʌmtaɪmz', readVi: 'xăm-tai-m-z' },
  never: { ipa: 'ˈnevər', readVi: 'ne-vờ' },
  together: { ipa: 'təˈɡeðər', readVi: 'tơ-ge-đờ' },
  again: { ipa: 'əˈɡen', readVi: 'ơ-ghen' },
  today: { ipa: 'təˈdeɪ', readVi: 'tơ-đê' },
  tomorrow: { ipa: 'təˈmɔːroʊ', readVi: 'tơ-mo-râu' },
  yesterday: { ipa: 'ˈjestərdeɪ', readVi: 'dét-tơ-đê' },

  // === ĐẠI TỪ NHÂN XƯNG & TỪ CHỈ ĐỊNH ===
  i: { ipa: 'aɪ', readVi: 'ai' },
  you: { ipa: 'juː', readVi: 'diu' },
  he: { ipa: 'hiː', readVi: 'hi' },
  she: { ipa: 'ʃiː', readVi: 'si' },
  it: { ipa: 'ɪt', readVi: 'ít' },
  we: { ipa: 'wiː', readVi: 'uy' },
  they: { ipa: 'ðeɪ', readVi: 'đây' },
  me: { ipa: 'miː', readVi: 'mi' },
  him: { ipa: 'hɪm', readVi: 'him' },
  her: { ipa: 'hɜːr', readVi: 'hơ' },
  us: { ipa: 'ʌs', readVi: 'ắt-s' },
  them: { ipa: 'ðem', readVi: 'đem' },
  my: { ipa: 'maɪ', readVi: 'mai' },
  your: { ipa: 'jɔːr', readVi: 'yo' },
  his: { ipa: 'hɪz', readVi: 'hít-z' },
  its: { ipa: 'ɪts', readVi: 'ít-s' },
  our: { ipa: 'ˈaʊər', readVi: 'ao-ơ' },
  their: { ipa: 'ðer', readVi: 'đeo' },
  this: { ipa: 'ðɪs', readVi: 'đít-s' },
  that: { ipa: 'ðæt', readVi: 'đét-t' },
  these: { ipa: 'ðiːz', readVi: 'đi-z' },
  those: { ipa: 'ðoʊz', readVi: 'đâu-z' },
  here: { ipa: 'hɪr', readVi: 'hia' },
  there: { ipa: 'ðer', readVi: 'đeo' },

  // === DẠNG VIẾT TẮT (CONTRACTIONS) ===
  "it's": { ipa: 'ɪts', readVi: 'ít-s' },
  "i'm": { ipa: 'aɪm', readVi: 'aim' },
  "don't": { ipa: 'doʊnt', readVi: 'đôun-t' },
  "can't": { ipa: 'kænt', readVi: 'khen-t' },
  "we're": { ipa: 'wɪr', readVi: 'uy-ơ' },
  "they're": { ipa: 'ðer', readVi: 'đeo' },
  "you're": { ipa: 'jɔːr', readVi: 'yo' },
  "that's": { ipa: 'ðæts', readVi: 'đét-s' },
  "there's": { ipa: 'ðerz', readVi: 'đeo-z' },
  "he's": { ipa: 'hiːz', readVi: 'hi-z' },
  "she's": { ipa: 'ʃiːz', readVi: 'si-z' },
  "let's": { ipa: 'lets', readVi: 'lét-s' },
  "what's": { ipa: 'wɒts', readVi: 'oát-s' },
  "didn't": { ipa: 'ˈdɪdnt', readVi: 'đít-đần-t' },
  "doesn't": { ipa: 'ˈdʌznt', readVi: 'đắt-zần-t' },
  "isn't": { ipa: 'ˈɪznt', readVi: 'i-zần-t' },
  "aren't": { ipa: 'ɑːrnt', readVi: 'an-t' },
  "won't": { ipa: 'woʊnt', readVi: 'uôn-t' },

  // === ĐỘNG TỪ TO BE & TRỢ ĐỘNG TỪ ===
  am: { ipa: 'æm', readVi: 'am' },
  is: { ipa: 'ɪz', readVi: 'i-z' },
  are: { ipa: 'ɑːr', readVi: 'a' },
  was: { ipa: 'wɒz', readVi: 'uót-z' },
  were: { ipa: 'wɜːr', readVi: 'uơ' },
  be: { ipa: 'biː', readVi: 'bi' },
  been: { ipa: 'bɪn', readVi: 'bin' },
  being: { ipa: 'ˈbiːɪŋ', readVi: 'bi-inh' },
  do: { ipa: 'duː', readVi: 'đu' },
  does: { ipa: 'dʌz', readVi: 'đắt-z' },
  did: { ipa: 'dɪd', readVi: 'đít' },
  done: { ipa: 'dʌn', readVi: 'đăn' },
  have: { ipa: 'hæv', readVi: 'he-v' },
  has: { ipa: 'hæz', readVi: 'hét-z' },
  had: { ipa: 'hæd', readVi: 'hét-đ' },
  can: { ipa: 'kæn', readVi: 'khen' },
  could: { ipa: 'kʊd', readVi: 'khút' },
  will: { ipa: 'wɪl', readVi: 'uy-ồl' },
  would: { ipa: 'wʊd', readVi: 'uút' },
  shall: { ipa: 'ʃæl', readVi: 'seo-l' },
  should: { ipa: 'ʃʊd', readVi: 'sút' },
  may: { ipa: 'meɪ', readVi: 'mây' },
  might: { ipa: 'maɪt', readVi: 'mai-t' },
  must: { ipa: 'mʌst', readVi: 'mắt-x-t' },

  // === TỪ ĐỂ HỎI & CHÀO HỎI ===
  what: { ipa: 'wɒt', readVi: 'oát' },
  where: { ipa: 'wer', readVi: 'oe' },
  when: { ipa: 'wen', readVi: 'oen' },
  who: { ipa: 'huː', readVi: 'hu' },
  whom: { ipa: 'huːm', readVi: 'hum' },
  whose: { ipa: 'huːz', readVi: 'hu-z' },
  why: { ipa: 'waɪ', readVi: 'oai' },
  how: { ipa: 'haʊ', readVi: 'hao' },
  which: { ipa: 'wɪtʃ', readVi: 'oít-ch' },
  hello: { ipa: 'həˈloʊ', readVi: 'hơ-lâu' },
  hi: { ipa: 'haɪ', readVi: 'hai' },
  goodbye: { ipa: 'ɡʊdˈbaɪ', readVi: 'gút-bai' },
  bye: { ipa: 'baɪ', readVi: 'bai' },
  please: { ipa: 'pliːz', readVi: 'p-li-z' },
  thank: { ipa: 'θæŋk', readVi: 'thenh-k' },
  thanks: { ipa: 'θæŋks', readVi: 'thenh-ks' },
  welcome: { ipa: 'ˈwelkəm', readVi: 'oen-cầm' },
  sorry: { ipa: 'ˈsɒri', readVi: 'so-ri' },
  yes: { ipa: 'jes', readVi: 'dét-s' },
  no: { ipa: 'noʊ', readVi: 'nâu' },

  // === ĐỘNG TỪ HÀNH ĐỘNG PHỔ BIẾN TRONG BÀI ĐỌC ===
  like: { ipa: 'laɪk', readVi: 'lai-k' },
  likes: { ipa: 'laɪks', readVi: 'lai-k-s' },
  liked: { ipa: 'laɪkt', readVi: 'lai-k-t' },
  love: { ipa: 'lʌv', readVi: 'lắp-v' },
  loves: { ipa: 'lʌvz', readVi: 'lắp-v-z' },
  loved: { ipa: 'lʌvd', readVi: 'lắp-v-đ' },
  see: { ipa: 'siː', readVi: 'si' },
  sees: { ipa: 'siːz', readVi: 'si-z' },
  saw: { ipa: 'sɔː', readVi: 'xo' },
  look: { ipa: 'lʊk', readVi: 'lúc' },
  looks: { ipa: 'lʊks', readVi: 'lúc-ks' },
  looked: { ipa: 'lʊkt', readVi: 'lúc-t' },
  looking: { ipa: 'ˈlʊkɪŋ', readVi: 'lúc-kinh' },
  play: { ipa: 'pleɪ', readVi: 'p-lây' },
  plays: { ipa: 'pleɪz', readVi: 'p-lây-z' },
  played: { ipa: 'pleɪd', readVi: 'p-lây-đ' },
  playing: { ipa: 'ˈpleɪɪŋ', readVi: 'p-lây-inh' },
  run: { ipa: 'rʌn', readVi: 'răn' },
  runs: { ipa: 'rʌnz', readVi: 'răn-z' },
  running: { ipa: 'ˈrʌnɪŋ', readVi: 'răn-ninh' },
  ran: { ipa: 'ræn', readVi: 'ren' },
  walk: { ipa: 'wɔːk', readVi: 'uốc' },
  walks: { ipa: 'wɔːks', readVi: 'uốc-ks' },
  walked: { ipa: 'wɔːkt', readVi: 'uốc-t' },
  walking: { ipa: 'ˈwɔːkɪŋ', readVi: 'uốc-kinh' },
  jump: { ipa: 'dʒʌmp', readVi: 'chăm-p' },
  jumps: { ipa: 'dʒʌmps', readVi: 'chăm-p-s' },
  jumped: { ipa: 'dʒʌmpt', readVi: 'chăm-p-t' },
  jumping: { ipa: 'ˈdʒʌmpɪŋ', readVi: 'chăm-pinh' },
  fly: { ipa: 'flaɪ', readVi: 'ph-lai' },
  flies: { ipa: 'flaɪz', readVi: 'ph-lai-z' },
  flying: { ipa: 'ˈflaɪɪŋ', readVi: 'ph-lai-inh' },
  flew: { ipa: 'fluː', readVi: 'ph-lu' },
  swim: { ipa: 'swɪm', readVi: 'x-uim' },
  swims: { ipa: 'swɪmz', readVi: 'x-uim-z' },
  swimming: { ipa: 'ˈswɪmɪŋ', readVi: 'x-uim-minh' },
  eat: { ipa: 'iːt', readVi: 'ít' },
  eats: { ipa: 'iːts', readVi: 'ít-s' },
  eating: { ipa: 'ˈiːtɪŋ', readVi: 'ít-tinh' },
  ate: { ipa: 'eɪt', readVi: 'ây-t' },
  drink: { ipa: 'drɪŋk', readVi: 'đ-rin-k' },
  drinks: { ipa: 'drɪŋks', readVi: 'đ-rin-k-s' },
  drinking: { ipa: 'ˈdrɪŋkɪŋ', readVi: 'đ-rin-kinh' },
  sleep: { ipa: 'sliːp', readVi: 'x-lip' },
  sleeps: { ipa: 'sliːps', readVi: 'x-lip-s' },
  sleeping: { ipa: 'ˈsliːpɪŋ', readVi: 'x-lip-pinh' },
  read: { ipa: 'riːd', readVi: 'rit-đ' },
  reads: { ipa: 'riːdz', readVi: 'rit-đ-z' },
  reading: { ipa: 'ˈriːdɪŋ', readVi: 'ri-đinh' },
  write: { ipa: 'raɪt', readVi: 'rai-t' },
  writes: { ipa: 'raɪts', readVi: 'rai-t-s' },
  writing: { ipa: 'ˈraɪtɪŋ', readVi: 'rai-tinh' },
  draw: { ipa: 'drɔː', readVi: 'đ-ro' },
  draws: { ipa: 'drɔːz', readVi: 'đ-ro-z' },
  sing: { ipa: 'sɪŋ', readVi: 'xinh' },
  sings: { ipa: 'sɪŋz', readVi: 'xinh-z' },
  singing: { ipa: 'ˈsɪŋɪŋ', readVi: 'xinh-inh' },
  dance: { ipa: 'dæns', readVi: 'đen-s' },
  dances: { ipa: 'ˈdænsɪz', readVi: 'đen-xịt-z' },
  dancing: { ipa: 'ˈdænsɪŋ', readVi: 'đen-xinh' },
  smile: { ipa: 'smaɪl', readVi: 'x-mai-ồl' },
  smiles: { ipa: 'smaɪlz', readVi: 'x-mai-ồl-z' },
  smiling: { ipa: 'ˈsmaɪlɪŋ', readVi: 'x-mai-linh' },
  shine: { ipa: 'ʃaɪn', readVi: 'xai-n' },
  shines: { ipa: 'ʃaɪnz', readVi: 'xai-n-z' },
  shining: { ipa: 'ˈʃaɪnɪŋ', readVi: 'xai-ninh' },
  grow: { ipa: 'ɡroʊ', readVi: 'g-râu' },
  grows: { ipa: 'ɡroʊz', readVi: 'g-râu-z' },
  growing: { ipa: 'ˈɡroʊɪŋ', readVi: 'g-râu-inh' },
  grew: { ipa: 'ɡruː', readVi: 'g-ru' },
  bloom: { ipa: 'bluːm', readVi: 'b-lum' },
  blooms: { ipa: 'bluːmz', readVi: 'b-lum-z' },
  blooming: { ipa: 'ˈbluːmɪŋ', readVi: 'b-lum-minh' },
  make: { ipa: 'meɪk', readVi: 'mếch-k' },
  makes: { ipa: 'meɪks', readVi: 'mếch-k-s' },
  making: { ipa: 'ˈmeɪkɪŋ', readVi: 'mê-kinh' },
  made: { ipa: 'meɪd', readVi: 'mết-đ' },
  help: { ipa: 'help', readVi: 'heo-p' },
  helps: { ipa: 'helps', readVi: 'heo-p-s' },
  helped: { ipa: 'helpt', readVi: 'heo-p-t' },
  helping: { ipa: 'ˈhelpɪŋ', readVi: 'heo-pinh' },
  learn: { ipa: 'lɜːrn', readVi: 'lơn' },
  learns: { ipa: 'lɜːrnz', readVi: 'lơn-z' },
  learning: { ipa: 'ˈlɜːrnɪŋ', readVi: 'lơ-ninh' },
  teach: { ipa: 'tiːtʃ', readVi: 'ti-ch' },
  teaches: { ipa: 'ˈtiːtʃɪz', readVi: 'ti-chịt-z' },
  live: { ipa: 'lɪv', readVi: 'líp-v' },
  lives: { ipa: 'lɪvz', readVi: 'líp-v-z' },
  living: { ipa: 'ˈlɪvɪŋ', readVi: 'li-vinh' },
  lived: { ipa: 'lɪvd', readVi: 'líp-v-đ' },
  give: { ipa: 'ɡɪv', readVi: 'gíp-v' },
  gives: { ipa: 'ɡɪvz', readVi: 'gíp-v-z' },
  gave: { ipa: 'ɡeɪv', readVi: 'gây-v' },
  take: { ipa: 'teɪk', readVi: 'tếch-k' },
  takes: { ipa: 'teɪks', readVi: 'tếch-k-s' },
  took: { ipa: 'tʊk', readVi: 'túc' },
  find: { ipa: 'faɪnd', readVi: 'phai-n-đ' },
  finds: { ipa: 'faɪndz', readVi: 'phai-n-đ-z' },
  found: { ipa: 'faʊnd', readVi: 'phao-n-đ' },
  call: { ipa: 'kɔːl', readVi: 'co-l' },
  calls: { ipa: 'kɔːlz', readVi: 'co-l-z' },
  called: { ipa: 'kɔːld', readVi: 'co-l-đ' },
  calling: { ipa: 'ˈkɔːlɪŋ', readVi: 'co-linh' },
  feel: { ipa: 'fiːl', readVi: 'phi-ồl' },
  feels: { ipa: 'fiːlz', readVi: 'phi-ồl-z' },
  felt: { ipa: 'felt', readVi: 'pheo-t' },
  bring: { ipa: 'brɪŋ', readVi: 'b-rinh' },
  brings: { ipa: 'brɪŋz', readVi: 'b-rinh-z' },
  brought: { ipa: 'brɔːt', readVi: 'b-rót' },
  come: { ipa: 'kʌm', readVi: 'khăm' },
  comes: { ipa: 'kʌmz', readVi: 'khăm-z' },
  came: { ipa: 'keɪm', readVi: 'khêm' },
  go: { ipa: 'ɡoʊ', readVi: 'gâu' },
  goes: { ipa: 'ɡoʊz', readVi: 'gâu-z' },
  went: { ipa: 'went', readVi: 'oen-t' },
  stay: { ipa: 'steɪ', readVi: 'x-tê' },
  stays: { ipa: 'steɪz', readVi: 'x-tê-z' },
  start: { ipa: 'stɑːrt', readVi: 'x-tát' },
  starts: { ipa: 'stɑːrts', readVi: 'x-tát-s' },
  started: { ipa: 'ˈstɑːrtɪd', readVi: 'x-ta-tịt-đ' },
  stop: { ipa: 'stɑːp', readVi: 'x-tóp' },
  stops: { ipa: 'stɑːps', readVi: 'x-tóp-s' },
  stopped: { ipa: 'stɑːpt', readVi: 'x-tóp-t' },
  share: { ipa: 'ʃer', readVi: 'xeo' },
  shares: { ipa: 'ʃerz', readVi: 'xeo-z' },
  shared: { ipa: 'ʃerd', readVi: 'xeo-đ' },
  care: { ipa: 'ker', readVi: 'kheo' },
  cares: { ipa: 'kerz', readVi: 'kheo-z' },
  work: { ipa: 'wɜːrk', readVi: 'uếc-k' },
  works: { ipa: 'wɜːrks', readVi: 'uếc-k-s' },
  working: { ipa: 'ˈwɜːrkɪŋ', readVi: 'uếc-kinh' },
  explore: { ipa: 'ɪkˈsplɔːr', readVi: 'ích-x-p-lo' },
  explores: { ipa: 'ɪkˈsplɔːrz', readVi: 'ích-x-p-lo-z' },
  explored: { ipa: 'ɪkˈsplɔːrd', readVi: 'ích-x-p-lo-đ' },
  exploring: { ipa: 'ɪkˈsplɔːrɪŋ', readVi: 'ích-x-p-lo-rinh' },
  protect: { ipa: 'prəˈtekt', readVi: 'p-rơ-tếch-t' },
  protects: { ipa: 'prəˈtekts', readVi: 'p-rơ-tếch-t-s' },
  protecting: { ipa: 'prəˈtektɪŋ', readVi: 'p-rơ-tếch-tinh' },
  travel: { ipa: 'ˈtrævl', readVi: 't-re-vồl' },
  travels: { ipa: 'ˈtrævlz', readVi: 't-re-vồl-z' },
  visit: { ipa: 'ˈvɪzɪt', readVi: 'vi-zịt' },
  visits: { ipa: 'ˈvɪzɪts', readVi: 'vi-zịt-s' },
  listen: { ipa: 'ˈlɪsn', readVi: 'lít-sừn' },
  listens: { ipa: 'ˈlɪsnz', readVi: 'lít-sừn-z' },
  hear: { ipa: 'hɪr', readVi: 'hia' },
  hears: { ipa: 'hɪrz', readVi: 'hia-z' },
  speak: { ipa: 'spiːk', readVi: 'x-píc-k' },
  speaks: { ipa: 'spiːks', readVi: 'x-píc-k-s' },
  watch: { ipa: 'wɑːtʃ', readVi: 'oát-ch' },
  watches: { ipa: 'ˈwɑːtʃɪz', readVi: 'oát-chịt-z' },
  watching: { ipa: 'ˈwɑːtʃɪŋ', readVi: 'oát-chinh' },
  stand: { ipa: 'stænd', readVi: 'x-ten-đ' },
  sit: { ipa: 'sɪt', readVi: 'xít' },
  open: { ipa: 'ˈoʊpən', readVi: 'âu-pừn' },
  close: { ipa: 'kloʊz', readVi: 'c-lâu-z' },
  touch: { ipa: 'tʌtʃ', readVi: 'tắt-ch' },
  catch: { ipa: 'kætʃ', readVi: 'két-ch' },
  throw: { ipa: 'θroʊ', readVi: 'th-râu' },
  orbit: { ipa: 'ˈɔːrbɪt', readVi: 'o-bịt' },
  orbits: { ipa: 'ˈɔːrbɪts', readVi: 'o-bịt-s' },

  // === DANH TỪ THIÊN NHIÊN, THỜI TIẾT & VŨ TRỤ ===
  sun: { ipa: 'sʌn', readVi: 'xăn' },
  sunlight: { ipa: 'ˈsʌnlaɪt', readVi: 'xăn-lai-t' },
  sky: { ipa: 'skaɪ', readVi: 'x-kai' },
  moon: { ipa: 'muːn', readVi: 'mun' },
  star: { ipa: 'stɑːr', readVi: 'x-ta' },
  stars: { ipa: 'stɑːrz', readVi: 'x-ta-z' },
  space: { ipa: 'speɪs', readVi: 'x-pây-s' },
  planet: { ipa: 'ˈplænɪt', readVi: 'p-le-nịt' },
  planets: { ipa: 'ˈplænɪts', readVi: 'p-le-nịt-s' },
  earth: { ipa: 'ɜːrθ', readVi: 'ơth' },
  rainbow: { ipa: 'ˈreɪnboʊ', readVi: 'rên-bâu' },
  cloud: { ipa: 'klaʊd', readVi: 'c-lao-đ' },
  clouds: { ipa: 'klaʊdz', readVi: 'c-lao-đ-z' },
  rain: { ipa: 'reɪn', readVi: 'rên' },
  water: { ipa: 'ˈwɔːtər', readVi: 'oát-tờ' },
  sea: { ipa: 'siː', readVi: 'xi' },
  ocean: { ipa: 'ˈoʊʃn', readVi: 'âu-sần' },
  oceans: { ipa: 'ˈoʊʃnz', readVi: 'âu-sần-z' },
  river: { ipa: 'ˈrɪvər', readVi: 'ri-vờ' },
  rivers: { ipa: 'ˈrɪvərz', readVi: 'ri-vờ-z' },
  lake: { ipa: 'leɪk', readVi: 'lếch-k' },
  mountain: { ipa: 'ˈmaʊntn', readVi: 'mao-từn' },
  mountains: { ipa: 'ˈmaʊntnz', readVi: 'mao-từn-z' },
  hill: { ipa: 'hɪl', readVi: 'hi-ồl' },
  forest: { ipa: 'ˈfɔːrɪst', readVi: 'pho-rịt-x-t' },
  tree: { ipa: 'triː', readVi: 't-ri' },
  trees: { ipa: 'triːz', readVi: 't-ri-z' },
  flower: { ipa: 'ˈflaʊər', readVi: 'ph-lao-ơ' },
  flowers: { ipa: 'ˈflaʊərz', readVi: 'ph-lao-ơ-z' },
  grass: { ipa: 'ɡræs', readVi: 'g-rát-s' },
  garden: { ipa: 'ˈɡɑːrdn', readVi: 'ga-đần' },
  gardens: { ipa: 'ˈɡɑːrdnz', readVi: 'ga-đần-z' },
  plant: { ipa: 'plænt', readVi: 'p-len-t' },
  plants: { ipa: 'plænts', readVi: 'p-len-t-s' },
  leaf: { ipa: 'liːf', readVi: 'líp-ph' },
  leaves: { ipa: 'liːvz', readVi: 'li-v-z' },
  seed: { ipa: 'siːd', readVi: 'xít-đ' },
  seeds: { ipa: 'siːdz', readVi: 'xít-đ-z' },
  rock: { ipa: 'rɑːk', readVi: 'róoc-k' },
  rocks: { ipa: 'rɑːks', readVi: 'róoc-ks' },
  stone: { ipa: 'stoʊn', readVi: 'x-tôn' },
  sand: { ipa: 'sænd', readVi: 'xen-đ' },
  beach: { ipa: 'biːtʃ', readVi: 'bi-ch' },
  island: { ipa: 'ˈaɪlənd', readVi: 'ai-lần-đ' },
  cave: { ipa: 'keɪv', readVi: 'khây-v' },
  wind: { ipa: 'wɪnd', readVi: 'oin-đ' },
  breeze: { ipa: 'briːz', readVi: 'b-ri-z' },
  snow: { ipa: 'snoʊ', readVi: 'x-nâu' },
  ice: { ipa: 'aɪs', readVi: 'ai-s' },
  wave: { ipa: 'weɪv', readVi: 'uây-v' },
  waves: { ipa: 'weɪvz', readVi: 'uây-v-z' },
  air: { ipa: 'er', readVi: 'eo' },
  energy: { ipa: 'ˈenərdʒi', readVi: 'é-nơ-chi' },
  solar: { ipa: 'ˈsoʊlər', readVi: 'xâu-lờ' },
  nature: { ipa: 'ˈneɪtʃər', readVi: 'nê-chờ' },
  world: { ipa: 'wɜːrld', readVi: 'uơ-l-đ' },

  // === ĐỘNG VẬT & THÚ CƯNG ===
  cat: { ipa: 'kæt', readVi: 'két-t' },
  cats: { ipa: 'kæts', readVi: 'két-t-s' },
  kitten: { ipa: 'ˈkɪtn', readVi: 'kít-từn' },
  dog: { ipa: 'dɔːɡ', readVi: 'đoóc-g' },
  dogs: { ipa: 'dɔːɡz', readVi: 'đoóc-g-z' },
  puppy: { ipa: 'ˈpʌpi', readVi: 'pắp-pi' },
  bird: { ipa: 'bɜːrd', readVi: 'bơ-đ' },
  birds: { ipa: 'bɜːrdz', readVi: 'bơ-đ-z' },
  fish: { ipa: 'fɪʃ', readVi: 'phít-sh' },
  fishes: { ipa: 'ˈfɪʃɪz', readVi: 'phít-shịt-z' },
  rabbit: { ipa: 'ˈræbɪt', readVi: 're-bịt' },
  bunny: { ipa: 'ˈbʌni', readVi: 'băn-ni' },
  duck: { ipa: 'dʌk', readVi: 'đắc-k' },
  chicken: { ipa: 'ˈtʃɪkɪn', readVi: 'chí-khìn' },
  cow: { ipa: 'kaʊ', readVi: 'khao' },
  horse: { ipa: 'hɔːrs', readVi: 'hót-s' },
  sheep: { ipa: 'ʃiːp', readVi: 'sip-p' },
  pig: { ipa: 'pɪɡ', readVi: 'píc-g' },
  bear: { ipa: 'ber', readVi: 'beo' },
  lion: { ipa: 'ˈlaɪən', readVi: 'lai-ừn' },
  tiger: { ipa: 'ˈtaɪɡər', readVi: 'tai-gờ' },
  elephant: { ipa: 'ˈelɪfənt', readVi: 'é-li-phần-t' },
  monkey: { ipa: 'ˈmʌŋki', readVi: 'măng-ki' },
  giraffe: { ipa: 'dʒəˈræf', readVi: 'chơ-ráp-ph' },
  turtle: { ipa: 'ˈtɜːrtl', readVi: 'tơ-tồl' },
  frog: { ipa: 'frɔːɡ', readVi: 'ph-róoc-g' },
  bee: { ipa: 'biː', readVi: 'bi' },
  bees: { ipa: 'biːz', readVi: 'bi-z' },
  butterfly: { ipa: 'ˈbʌtərflaɪ', readVi: 'bắt-tờ-ph-lai' },
  butterflies: { ipa: 'ˈbʌtərflaɪz', readVi: 'bắt-tờ-ph-lai-z' },
  ant: { ipa: 'ænt', readVi: 'en-t' },
  ants: { ipa: 'ænts', readVi: 'en-t-s' },
  whale: { ipa: 'weɪl', readVi: 'uê-l' },
  dolphin: { ipa: 'ˈdɑːlfɪn', readVi: 'đon-phin' },
  shark: { ipa: 'ʃɑːrk', readVi: 'sác-k' },
  crab: { ipa: 'kræb', readVi: 'c-rép-b' },
  penguin: { ipa: 'ˈpeŋɡwɪn', readVi: 'pen-guin' },
  dinosaur: { ipa: 'ˈdaɪnəsɔːr', readVi: 'đai-nơ-so' },
  animal: { ipa: 'ˈænɪml', readVi: 'é-ni-mồl' },
  animals: { ipa: 'ˈænɪmlz', readVi: 'é-ni-mồl-z' },

  // === MÀU SẮC & HÌNH DẠNG ===
  red: { ipa: 'red', readVi: 'rét-đ' },
  blue: { ipa: 'bluː', readVi: 'b-lu' },
  yellow: { ipa: 'ˈjeloʊ', readVi: 'de-lâu' },
  green: { ipa: 'ɡriːn', readVi: 'g-rin' },
  orange: { ipa: 'ˈɔːrɪndʒ', readVi: 'o-rin-ch' },
  purple: { ipa: 'ˈpɜːrpl', readVi: 'pơ-pồl' },
  pink: { ipa: 'pɪŋk', readVi: 'pin-k' },
  brown: { ipa: 'braʊn', readVi: 'b-rao-n' },
  black: { ipa: 'blæk', readVi: 'b-lác-k' },
  white: { ipa: 'waɪt', readVi: 'oai-t' },
  gray: { ipa: 'ɡreɪ', readVi: 'g-rê' },
  golden: { ipa: 'ˈɡoʊldən', readVi: 'gôul-đần' },
  silver: { ipa: 'ˈsɪlvər', readVi: 'xil-vờ' },
  color: { ipa: 'ˈkʌlər', readVi: 'khơ-lờ' },
  colors: { ipa: 'ˈkʌlərz', readVi: 'khơ-lờ-z' },
  round: { ipa: 'raʊnd', readVi: 'rao-n-đ' },
  circle: { ipa: 'ˈsɜːrkl', readVi: 'xơ-khồl' },
  square: { ipa: 'skwer', readVi: 'x-kueo' },
  heart: { ipa: 'hɑːrt', readVi: 'hát-t' },

  // === TÍNH TỪ MÔ TẢ ĐẶC ĐIỂM DỄ NHỚ CHO BÉ ===
  cute: { ipa: 'kjuːt', readVi: 'khiu-t' },
  friendly: { ipa: 'ˈfrendli', readVi: 'ph-ren-đ-li' },
  soft: { ipa: 'sɔːft', readVi: 'xót-ph' },
  fresh: { ipa: 'freʃ', readVi: 'ph-rét-sh' },
  bright: { ipa: 'braɪt', readVi: 'b-rai-t' },
  brightly: { ipa: 'ˈbraɪtli', readVi: 'b-rai-t-li' },
  warm: { ipa: 'wɔːrm', readVi: 'uo-m' },
  cool: { ipa: 'kuːl', readVi: 'cun' },
  cold: { ipa: 'koʊld', readVi: 'câu-l-đ' },
  hot: { ipa: 'hɑːt', readVi: 'hót' },
  sweet: { ipa: 'swiːt', readVi: 'x-uýt' },
  clean: { ipa: 'kliːn', readVi: 'c-lin' },
  tiny: { ipa: 'ˈtaɪni', readVi: 'tai-ni' },
  small: { ipa: 'smɔːl', readVi: 'x-mo-l' },
  big: { ipa: 'bɪɡ', readVi: 'bíc-g' },
  huge: { ipa: 'hjuːdʒ', readVi: 'hiu-ch' },
  massive: { ipa: 'ˈmæsɪv', readVi: 'mé-xíp-v' },
  tall: { ipa: 'tɔːl', readVi: 'to-l' },
  short: { ipa: 'ʃɔːrt', readVi: 'so-t' },
  long: { ipa: 'lɔːŋ', readVi: 'long' },
  fast: { ipa: 'fæst', readVi: 'phét-x-t' },
  quick: { ipa: 'kwɪk', readVi: 'c-uých-k' },
  slow: { ipa: 'sloʊ', readVi: 'x-lâu' },
  slowly: { ipa: 'ˈsloʊli', readVi: 'x-lâu-li' },
  happy: { ipa: 'ˈhæpi', readVi: 'hép-pi' },
  happily: { ipa: 'ˈhæpɪli', readVi: 'hép-pi-li' },
  kind: { ipa: 'kaɪnd', readVi: 'khain-đ' },
  gentle: { ipa: 'ˈdʒentl', readVi: 'chen-tồl' },
  quiet: { ipa: 'ˈkwaɪət', readVi: 'khoai-ợt' },
  quietly: { ipa: 'ˈkwaɪətli', readVi: 'khoai-ợt-li' },
  loud: { ipa: 'laʊd', readVi: 'lao-đ' },
  loudly: { ipa: 'ˈlaʊdli', readVi: 'lao-đ-li' },
  clear: { ipa: 'klɪr', readVi: 'c-lia' },
  deep: { ipa: 'diːp', readVi: 'đíp-p' },
  high: { ipa: 'haɪ', readVi: 'hai' },
  beautiful: { ipa: 'ˈbjuːtɪfl', readVi: 'biu-ti-phồl' },
  beautifully: { ipa: 'ˈbjuːtɪfli', readVi: 'biu-ti-phu-li' },
  wonderful: { ipa: 'ˈwʌndərfl', readVi: 'uăn-đơ-phồl' },
  great: { ipa: 'ɡreɪt', readVi: 'g-rết' },
  good: { ipa: 'ɡʊd', readVi: 'gút' },
  special: { ipa: 'ˈspeʃl', readVi: 'x-pe-sồl' },
  strong: { ipa: 'strɔːŋ', readVi: 'x-t-rong' },
  healthy: { ipa: 'ˈhelθi', readVi: 'heo-thi' },
  safe: { ipa: 'seɪf', readVi: 'xây-ph' },
  new: { ipa: 'nuː', readVi: 'niu' },
  old: { ipa: 'oʊld', readVi: 'âu-l-đ' },
  young: { ipa: 'jʌŋ', readVi: 'dăng' },
  ready: { ipa: 'ˈredi', readVi: 're-đi' },
  wooden: { ipa: 'ˈwʊdn', readVi: 'uút-đần' },
  ancient: { ipa: 'ˈeɪnʃənt', readVi: 'ên-xừn-t' },
  modern: { ipa: 'ˈmɑːdərn', readVi: 'mo-đơn' },

  // === ĐỒ ĂN, UỐNG & ĐỜI SỐNG HẰNG NGÀY ===
  milk: { ipa: 'mɪlk', readVi: 'miu-k' },
  water_bev: { ipa: 'ˈwɔːtər', readVi: 'oát-tờ' },
  juice: { ipa: 'dʒuːs', readVi: 'chu-s' },
  apple: { ipa: 'ˈæpl', readVi: 'ép-pồl' },
  banana: { ipa: 'bəˈnænə', readVi: 'bơ-ne-nơ' },
  orange_fruit: { ipa: 'ˈɔːrɪndʒ', readVi: 'o-rin-ch' },
  cookie: { ipa: 'ˈkʊki', readVi: 'cúc-ki' },
  cookies: { ipa: 'ˈkʊkiz', readVi: 'cúc-kiz' },
  cake: { ipa: 'keɪk', readVi: 'kếch-k' },
  bread: { ipa: 'bred', readVi: 'b-rét-đ' },
  food: { ipa: 'fuːd', readVi: 'phu-đ' },
  fruit: { ipa: 'fruːt', readVi: 'ph-rút' },
  fruits: { ipa: 'fruːts', readVi: 'ph-rút-s' },
  rice: { ipa: 'raɪs', readVi: 'rai-s' },
  noodles: { ipa: 'ˈnuːdlz', readVi: 'nu-đồl-z' },
  sandwich: { ipa: 'ˈsænwɪtʃ', readVi: 'xen-uýt-ch' },

  // === TRƯỜNG HỌC, GIA ĐÌNH & ĐỒ VẬT ===
  name: { ipa: 'neɪm', readVi: 'nêm' },
  names: { ipa: 'neɪmz', readVi: 'nêm-z' },
  family: { ipa: 'ˈfæməli', readVi: 'phe-mi-li' },
  father: { ipa: 'ˈfɑːðər', readVi: 'pha-đờ' },
  mother: { ipa: 'ˈmʌðər', readVi: 'mơ-đờ' },
  mom: { ipa: 'mɑːm', readVi: 'mam' },
  dad: { ipa: 'dæd', readVi: 'đét-đ' },
  brother: { ipa: 'ˈbrʌðər', readVi: 'b-rơ-đờ' },
  sister: { ipa: 'ˈsɪstər', readVi: 'xít-x-tờ' },
  baby: { ipa: 'ˈbeɪbi', readVi: 'bây-bi' },
  grandpa: { ipa: 'ˈɡrænpɑː', readVi: 'g-ren-pa' },
  grandma: { ipa: 'ˈɡrænmɑː', readVi: 'g-ren-ma' },
  friend: { ipa: 'frend', readVi: 'ph-ren-đ' },
  friends: { ipa: 'frendz', readVi: 'ph-ren-đ-z' },
  child: { ipa: 'tʃaɪld', readVi: 'chai-ồl-đ' },
  children: { ipa: 'ˈtʃɪldrən', readVi: 'chil-đ-rần' },
  kid: { ipa: 'kɪd', readVi: 'khít-đ' },
  kids: { ipa: 'kɪdz', readVi: 'khít-đ-z' },
  boy: { ipa: 'bɔɪ', readVi: 'boi' },
  girl: { ipa: 'ɡɜːrl', readVi: 'gơ-l' },
  school: { ipa: 'skuːl', readVi: 'x-cun' },
  classroom: { ipa: 'ˈklæsruːm', readVi: 'c-lát-rum' },
  teacher: { ipa: 'ˈtiːtʃər', readVi: 'ti-chờ' },
  student: { ipa: 'ˈstjuːdnt', readVi: 'x-tiu-đần-t' },
  students: { ipa: 'ˈstjuːdnts', readVi: 'x-tiu-đần-t-s' },
  book: { ipa: 'bʊk', readVi: 'búc' },
  books: { ipa: 'bʊks', readVi: 'búc-ks' },
  story: { ipa: 'ˈstɔːri', readVi: 'x-to-ri' },
  stories: { ipa: 'ˈstɔːriz', readVi: 'x-to-riz' },
  pen: { ipa: 'pen', readVi: 'pen' },
  pencil: { ipa: 'ˈpensl', readVi: 'pen-sồl' },
  bag: { ipa: 'bæɡ', readVi: 'béc-g' },
  desk: { ipa: 'desk', readVi: 'đéc-x-k' },
  chair: { ipa: 'tʃer', readVi: 'cheo' },
  door: { ipa: 'dɔːr', readVi: 'đo' },
  window: { ipa: 'ˈwɪndoʊ', readVi: 'oin-đâu' },
  room: { ipa: 'ruːm', readVi: 'rum' },
  home: { ipa: 'hoʊm', readVi: 'hôm' },
  house: { ipa: 'haʊs', readVi: 'hao-s' },
  park: { ipa: 'pɑːrk', readVi: 'pác-k' },
  toy: { ipa: 'tɔɪ', readVi: 'toi' },
  toys: { ipa: 'tɔɪz', readVi: 'toi-z' },
  ball: { ipa: 'bɔːl', readVi: 'bo-ồl' },
  balloon: { ipa: 'bəˈluːn', readVi: 'bơ-lun' },
  bike: { ipa: 'baɪk', readVi: 'bai-k' },
  bicycle: { ipa: 'ˈbaɪsɪkl', readVi: 'bai-xi-khồl' },
  car: { ipa: 'kɑːr', readVi: 'ka' },
  bus: { ipa: 'bʌs', readVi: 'bắt-s' },
  train: { ipa: 'treɪn', readVi: 't-rên' },
  boat: { ipa: 'boʊt', readVi: 'bôu-t' },
  ship: { ipa: 'ʃɪp', readVi: 'sip-p' },
  plane: { ipa: 'pleɪn', readVi: 'p-lên' },

  // === CƠ THỂ & GIÁC QUAN ===
  eye: { ipa: 'aɪ', readVi: 'ai' },
  eyes: { ipa: 'aɪz', readVi: 'ai-z' },
  ear: { ipa: 'ɪr', readVi: 'ia' },
  ears: { ipa: 'ɪrz', readVi: 'ia-z' },
  nose: { ipa: 'noʊz', readVi: 'nâu-z' },
  mouth: { ipa: 'maʊθ', readVi: 'mao-th' },
  hand: { ipa: 'hænd', readVi: 'hen-đ' },
  hands: { ipa: 'hændz', readVi: 'hen-đ-z' },
  foot: { ipa: 'fʊt', readVi: 'phút' },
  feet: { ipa: 'fiːt', readVi: 'phít' },
  face: { ipa: 'feɪs', readVi: 'phây-s' },
  body: { ipa: 'ˈbɑːdi', readVi: 'bo-đi' },
  head: { ipa: 'hed', readVi: 'hét-đ' },
  hair: { ipa: 'her', readVi: 'heo' },

  // === THỜI GIAN, SỐ ĐẾM & KHOA HỌC ===
  one: { ipa: 'wʌn', readVi: 'uăn' },
  two: { ipa: 'tuː', readVi: 'tu' },
  three: { ipa: 'θriː', readVi: 'th-ri' },
  four: { ipa: 'fɔːr', readVi: 'pho' },
  five: { ipa: 'faɪv', readVi: 'phai-v' },
  six: { ipa: 'sɪks', readVi: 'síc-ks' },
  seven: { ipa: 'ˈsevn', readVi: 'se-vừn' },
  eight: { ipa: 'eɪt', readVi: 'ây-t' },
  nine: { ipa: 'naɪn', readVi: 'nai-n' },
  ten: { ipa: 'ten', readVi: 'ten' },
  first: { ipa: 'fɜːrst', readVi: 'phơ-x-t' },
  second: { ipa: 'ˈsekənd', readVi: 'xé-cần-đ' },
  third: { ipa: 'θɜːrd', readVi: 'thơ-đ' },
  time: { ipa: 'taɪm', readVi: 'tai-m' },
  day: { ipa: 'deɪ', readVi: 'đê' },
  days: { ipa: 'deɪz', readVi: 'đê-z' },
  night: { ipa: 'naɪt', readVi: 'nai-t' },
  morning: { ipa: 'ˈmɔːrnɪŋ', readVi: 'mo-ninh' },
  afternoon: { ipa: 'ˌæftərˈnuːn', readVi: 'áp-tơ-nun' },
  evening: { ipa: 'ˈiːvnɪŋ', readVi: 'íp-ninh' },
  year: { ipa: 'jɪr', readVi: 'dia' },
  years: { ipa: 'jɪrz', readVi: 'dia-z' },
  spring: { ipa: 'sprɪŋ', readVi: 'x-p-rinh' },
  summer: { ipa: 'ˈsʌmər', readVi: 'xăm-mờ' },
  autumn: { ipa: 'ˈɔːtəm', readVi: 'o-tầm' },
  winter: { ipa: 'ˈwɪntər', readVi: 'oin-tờ' },
  science: { ipa: 'ˈsaɪəns', readVi: 'xai-ừn-s' },
  scientist: { ipa: 'ˈsaɪəntɪst', readVi: 'xai-ừn-tịt-x-t' },
  system: { ipa: 'ˈsɪstəm', readVi: 'xít-x-tầm' },
  telescope: { ipa: 'ˈtelɪskoʊp', readVi: 'te-li-x-khôup' },
  station: { ipa: 'ˈsteɪʃn', readVi: 'x-tê-sần' },
  rocket: { ipa: 'ˈrɑːkɪt', readVi: 'ró-khịt' },
  astronaut: { ipa: 'ˈæstrənɔːt', readVi: 'ét-x-t-rơ-nót' },
  international: { ipa: 'ˌɪntərˈnæʃnəl', readVi: 'in-tơ-né-sơ-nồl' },
  vietnam: { ipa: 'ˌvjetˈnɑːm', readVi: 'Việt Nam' },

  // Từ vựng khoa học, tự nhiên & đời sống trong các bài đọc
  global: { ipa: 'ˈɡloʊbl', readVi: 'g-lâu-bồl' },
  atmospheric: { ipa: 'ˌætməsˈferɪk', readVi: 'ét-mơ-x-phe-ríc' },
  hundred: { ipa: 'ˈhʌndrəd', readVi: 'hăn-đ-rợt-đ' },
  thousand: { ipa: 'ˈθaʊznd', readVi: 'thao-zừn-đ' },
  thousands: { ipa: 'ˈθaʊzndz', readVi: 'thao-zừn-đ-z' },
  million: { ipa: 'ˈmɪljən', readVi: 'mi-li-ừn' },
  millions: { ipa: 'ˈmɪljənz', readVi: 'mi-li-ừn-z' },
  species: { ipa: 'ˈspiːʃiːz', readVi: 'x-pi-si-z' },
  surface: { ipa: 'ˈsɜːrfɪs', readVi: 'xơ-phịt-x' },
  pressure: { ipa: 'ˈpreʃər', readVi: 'p-re-sờ' },
  entire: { ipa: 'ɪnˈtaɪər', readVi: 'in-tai-ơ' },
  using: { ipa: 'ˈjuːzɪŋ', readVi: 'diu-zinh' },
  use: { ipa: 'juːz', readVi: 'diu-z' },
  uses: { ipa: 'ˈjuːzɪz', readVi: 'diu-zịt-z' },
  keep: { ipa: 'kiːp', readVi: 'khip' },
  keeps: { ipa: 'kiːps', readVi: 'khip-s' },
  heavy: { ipa: 'ˈhevi', readVi: 'he-vi' },
  silk: { ipa: 'sɪlk', readVi: 'xi-ồl-k' },
  microscopic: { ipa: 'ˌmaɪkrəˈskɑːpɪk', readVi: 'mai-c-rơ-x-co-píc' },
  cell: { ipa: 'sel', readVi: 'xeo-l' },
  cells: { ipa: 'selz', readVi: 'xeo-l-z' },
  glass: { ipa: 'ɡlæs', readVi: 'g-lát-s' },
  gently: { ipa: 'ˈdʒentli', readVi: 'chen-t-li' },
  sturdy: { ipa: 'ˈstɜːrdi', readVi: 'x-tơ-đi' },
  mile: { ipa: 'maɪl', readVi: 'mai-ồl' },
  miles: { ipa: 'maɪlz', readVi: 'mai-ồl-z' },
  physical: { ipa: 'ˈfɪzɪkl', readVi: 'phi-zi-khồl' },
  liquid: { ipa: 'ˈlɪkwɪd', readVi: 'li-c-uýt-đ' },
  heat: { ipa: 'hiːt', readVi: 'hit' },
  specialized: { ipa: 'ˈspeʃəlaɪzd', readVi: 'x-pe-sơ-lai-z-đ' },
  known: { ipa: 'noʊn', readVi: 'nôn' },
  fluffy: { ipa: 'ˈflʌfi', readVi: 'ph-lắp-phi' },
  active: { ipa: 'ˈæktɪv', readVi: 'éc-típ-v' },
  ground: { ipa: 'ɡraʊnd', readVi: 'g-rao-n-đ' },
  smoothly: { ipa: 'ˈsmuːðli', readVi: 'x-mu-đ-li' },
  forward: { ipa: 'ˈfɔːrwərd', readVi: 'pho-uơ-đ' },
  along: { ipa: 'əˈlɔːŋ', readVi: 'ơ-long' },
  not: { ipa: 'nɑːt', readVi: 'nót' },
  oxygen: { ipa: 'ˈɑːksɪdʒən', readVi: 'óc-xi-chừn' },
  glowing: { ipa: 'ˈɡloʊɪŋ', readVi: 'g-lâu-inh' },
  navigate: { ipa: 'ˈnævɪɡeɪt', readVi: 'ne-vi-gết' },
  scientific: { ipa: 'ˌsaɪənˈtɪfɪk', readVi: 'xai-ừn-ti-phíc' },
  percent: { ipa: 'pərˈsent', readVi: 'pơ-xen-t' },
  dry: { ipa: 'draɪ', readVi: 'đ-rai' },
  acoustic: { ipa: 'əˈkuːstɪk', readVi: 'ơ-cu-x-tíc' },
  upon: { ipa: 'əˈpɔːn', readVi: 'ơ-pon' },
  oceanic: { ipa: 'ˌoʊʃiˈænɪk', readVi: 'âu-si-é-níc' },
  quickly: { ipa: 'ˈkwɪkli', readVi: 'c-uých-k-li' },
  carry: { ipa: 'ˈkæri', readVi: 'khe-ri' },
  carries: { ipa: 'ˈkæriz', readVi: 'khe-riz' },
  put: { ipa: 'pʊt', readVi: 'phút' },
  neatly: { ipa: 'ˈniːtli', readVi: 'nit-li' },
  teeth: { ipa: 'tiːθ', readVi: 'tith' },
  organic: { ipa: 'ɔːrˈɡænɪk', readVi: 'o-ge-níc' },
  daily: { ipa: 'ˈdeɪli', readVi: 'đê-li' },
  chemical: { ipa: 'ˈkemɪkl', readVi: 'khe-mi-khồl' },
  bay: { ipa: 'beɪ', readVi: 'bê' },
  famous: { ipa: 'ˈfeɪməs', readVi: 'phê-mợt-s' },
  sort: { ipa: 'sɔːrt', readVi: 'sot' },
  trash: { ipa: 'træʃ', readVi: 't-rét-sh' },
  box: { ipa: 'bɑːks', readVi: 'bóoc-ks' },
  boxes: { ipa: 'ˈbɑːksɪz', readVi: 'bóoc-xịt-z' },
  galaxy: { ipa: 'ˈɡæləksi', readVi: 'ge-lơ-k-xi' },
  galaxies: { ipa: 'ˈɡæləksiz', readVi: 'ge-lơ-k-xiz' },
  distant: { ipa: 'ˈdɪstənt', readVi: 'đít-x-tần-t' },
  faint: { ipa: 'feɪnt', readVi: 'phên-t' },
  capture: { ipa: 'ˈkæptʃər', readVi: 'kép-chờ' },
  captures: { ipa: 'ˈkæptʃərz', readVi: 'kép-chờ-z' },
  limestone: { ipa: 'ˈlaɪmstoʊn', readVi: 'lai-m-x-tôn' },

};

/**
 * Thuật toán quy tắc chuyển vần tiếng Anh sang phát âm tiếng Việt gần gũi nhất
 * khi gặp một từ chưa có sẵn trong từ điển.
 */
function approximateEnglishToVi(word: string): string {
  const w = word.toLowerCase();
  
  // Xử lý các từ thông dụng có tên riêng
  if (w === 'mimi') return 'Mi-mi';
  if (w === 'lucky') return 'Lắc-ki';
  if (w === 'kitty') return 'Kít-ti';
  if (w === 'gutenberg') return 'Gu-từn-bơ-g';
  if (w === 'enigma') return 'I-ních-ma';
  if (w === 'webb') return 'Uép-b';
  if (w === 'james') return 'Chêm-z';

  let s = w;

  // Đầu từ cụm phụ âm
  s = s.replace(/^th/, 'th-');
  s = s.replace(/^sh/, 's-');
  s = s.replace(/^ch/, 'ch-');
  s = s.replace(/^ph/, 'ph-');
  s = s.replace(/^wh/, 'o-');
  s = s.replace(/^wr/, 'r-');
  s = s.replace(/^kn/, 'n-');
  s = s.replace(/^qu/, 'c-u');
  s = s.replace(/^str/, 'x-t-r-');
  s = s.replace(/^spr/, 'x-p-r-');
  s = s.replace(/^scr/, 'x-c-r-');
  s = s.replace(/^pl/, 'p-l-');
  s = s.replace(/^pr/, 'p-r-');
  s = s.replace(/^bl/, 'b-l-');
  s = s.replace(/^br/, 'b-r-');
  s = s.replace(/^cl/, 'c-l-');
  s = s.replace(/^cr/, 'c-r-');
  s = s.replace(/^dr/, 'đ-r-');
  s = s.replace(/^tr/, 't-r-');
  s = s.replace(/^gl/, 'g-l-');
  s = s.replace(/^gr/, 'g-r-');
  s = s.replace(/^fl/, 'ph-l-');
  s = s.replace(/^fr/, 'ph-r-');
  s = s.replace(/^sk/, 'x-k-');
  s = s.replace(/^sp/, 'x-p-');
  s = s.replace(/^st/, 'x-t-');
  s = s.replace(/^sm/, 'x-m-');
  s = s.replace(/^sn/, 'x-n-');
  s = s.replace(/^sl/, 'x-l-');

  // Đuôi hậu tố quen thuộc
  s = s.replace(/tion$/, '-sần');
  s = s.replace(/sion$/, '-sần');
  s = s.replace(/ment$/, '-mần-t');
  s = s.replace(/ful$/, '-phồl');
  s = s.replace(/less$/, '-lợt-s');
  s = s.replace(/ing$/, '-inh');
  s = s.replace(/ly$/, '-li');
  s = s.replace(/est$/, '-ịt-x-t');
  s = s.replace(/er$/, '-ơ');

  // Nguyên âm đôi
  s = s.replace(/igh/g, 'ai');
  s = s.replace(/ight/g, 'ai-t');
  s = s.replace(/ee/g, 'i');
  s = s.replace(/ea/g, 'i');
  s = s.replace(/oo/g, 'u');
  s = s.replace(/ou/g, 'ao');
  s = s.replace(/ow/g, 'ao');
  s = s.replace(/ai/g, 'ê');
  s = s.replace(/ay/g, 'ây');
  s = s.replace(/oi/g, 'oi');
  s = s.replace(/oy/g, 'oi');
  s = s.replace(/oa/g, 'âu');
  s = s.replace(/ar/g, 'a');
  s = s.replace(/or/g, 'o');
  s = s.replace(/ur/g, 'ơ');
  s = s.replace(/ir/g, 'ơ');
  s = s.replace(/er/g, 'ơ');

  // Đuôi phụ âm
  s = s.replace(/ck$/, '-k');
  s = s.replace(/ke$/, '-k');
  s = s.replace(/te$/, '-t');
  s = s.replace(/de$/, '-đ');
  s = s.replace(/se$/, '-z');
  s = s.replace(/ze$/, '-z');
  s = s.replace(/ve$/, '-v');
  s = s.replace(/pe$/, '-p');

  // Làm sạch dấu nối thừa
  s = s.replace(/-+/g, '-').replace(/^-|-$/g, '');
  return s || w;
}

/**
 * Thuật toán phiên âm IPA tương đối cho từ chưa có sẵn
 */
function approximateEnglishToIpa(word: string): string {
  const w = word.toLowerCase();
  let s = w;
  s = s.replace(/^th/, 'θ');
  s = s.replace(/^sh/, 'ʃ');
  s = s.replace(/^ch/, 'tʃ');
  s = s.replace(/^ph/, 'f');
  s = s.replace(/^wh/, 'w');
  s = s.replace(/tion$/, 'ʃn');
  s = s.replace(/sion$/, 'ʒn');
  s = s.replace(/ing$/, 'ɪŋ');
  s = s.replace(/ee|ea/g, 'iː');
  s = s.replace(/oo/g, 'uː');
  s = s.replace(/ou|ow/g, 'aʊ');
  s = s.replace(/ai|ay/g, 'eɪ');
  s = s.replace(/ar/g, 'ɑːr');
  s = s.replace(/er|ir|ur/g, 'ɜːr');
  s = s.replace(/or/g, 'ɔːr');
  return s;
}

/**
 * Tách một từ tiếng Anh và trả về phiên âm IPA cùng gợi ý đọc tiếng Việt
 */
export function getWordPhonetic(rawWord: string): { ipa: string; readVi: string } {
  const cleanWord = rawWord.toLowerCase().replace(/[^a-z0-9']/g, '');
  if (!cleanWord) {
    return { ipa: '', readVi: '' };
  }

  // 1. Kiểm tra trực tiếp trong từ điển
  if (PHONETIC_DICT[cleanWord]) {
    return PHONETIC_DICT[cleanWord];
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
        ipa: base.ipa + (isVoiced ? 'z' : 's'),
        readVi: base.readVi + (isVoiced ? '-z' : '-s'),
      };
    }
  }

  // 3. Thử tách thì quá khứ đuôi -ed
  if (cleanWord.endsWith('ed') && cleanWord.length > 3) {
    const baseWord = cleanWord.slice(0, -2);
    if (PHONETIC_DICT[baseWord]) {
      const base = PHONETIC_DICT[baseWord];
      return {
        ipa: base.ipa + 'd',
        readVi: base.readVi + '-đ',
      };
    }
  }

  // 4. Thử tách tiếp diễn đuôi -ing
  if (cleanWord.endsWith('ing') && cleanWord.length > 4) {
    const baseWord = cleanWord.slice(0, -3);
    if (PHONETIC_DICT[baseWord]) {
      const base = PHONETIC_DICT[baseWord];
      return {
        ipa: base.ipa + 'ɪŋ',
        readVi: base.readVi + '-inh',
      };
    }
  }

  // 5. Thử tách trạng từ đuôi -ly
  if (cleanWord.endsWith('ly') && cleanWord.length > 3) {
    const baseWord = cleanWord.slice(0, -2);
    if (PHONETIC_DICT[baseWord]) {
      const base = PHONETIC_DICT[baseWord];
      return {
        ipa: base.ipa + 'li',
        readVi: base.readVi + '-li',
      };
    }
  }

  // 6. Fallback quy tắc tổng quát (không bao giờ để trống hay giữ nguyên từ tiếng Anh)
  return {
    ipa: `/${approximateEnglishToIpa(cleanWord)}/`,
    readVi: approximateEnglishToVi(cleanWord),
  };
}

/**
 * Tự động tạo phiên âm IPA và Cách đọc tiếng Việt cho cả câu hoàn chỉnh
 */
export function generateSentencePhonetics(sentence: string): { ipa: string; readVi: string } {
  const tokens = sentence.split(/(\s+|[,.!?;"']+)/).filter(Boolean);
  const ipaParts: string[] = [];
  const readViParts: string[] = [];

  for (const token of tokens) {
    if (/^\s+$/.test(token)) {
      ipaParts.push(' ');
      readViParts.push(' ');
      continue;
    }

    if (/^[,.!?;"']+$/.test(token)) {
      // Giữ dấu câu cho đọc tiếng Việt, IPA chỉ dùng dấu ngắt câu nhẹ
      if (token === ',' || token === ';' || token === '.' || token === '?' || token === '!') {
        readViParts.push(token);
      }
      continue;
    }

    const clean = token.toLowerCase().replace(/[^a-z0-9']/g, '');
    if (!clean) {
      continue;
    }

    const info = getWordPhonetic(clean);
    const cleanIpa = info.ipa.replace(/^\/|\/$/g, '');
    ipaParts.push(cleanIpa);
    readViParts.push(info.readVi);
  }

  const rawIpa = ipaParts.join('').replace(/\s+/g, ' ').trim();
  const rawReadVi = readViParts.join('').replace(/\s+/g, ' ').trim();

  // Định dạng IPA trong dấu gạch chéo /.../
  const finalIpa = rawIpa ? (rawIpa.startsWith('/') ? rawIpa : `/${rawIpa}/`) : '';

  // Viết hoa chữ cái đầu tiên của câu đọc tiếng Việt cho thẩm mỹ và chuẩn mực
  const capitalizedReadVi = rawReadVi.length > 0 
    ? rawReadVi.charAt(0).toUpperCase() + rawReadVi.slice(1)
    : rawReadVi;

  return {
    ipa: finalIpa,
    readVi: capitalizedReadVi,
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
  const rawWords = sentence.split(/\s+/).filter(Boolean);
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
