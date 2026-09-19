const fs = require('fs');
const path = require('path');

// Helper to generate simple Vietnamese reading phonetic approximation for English sentences
function generatePhoneticVi(text) {
  const dict = {
    'hello': 'Hê-lâu', 'everyone': 'é-vơ-ri-oăn', 'today': 'tơ-đê', 'i': 'ai', 'would': 'wút', 'like': 'lai-k',
    'to': 'tu', 'talk': 'thót-k', 'about': 'ơ-bao-t', 'myself': 'mai-seo-f', 'my': 'mai', 'name': 'nêm',
    'is': 'i-z', 'nam': 'Nam', 'and': 'en', 'am': 'em', 'seven': 'se-vừn', 'years': 'dia-z', 'old': 'âu-l-đ',
    'live': 'lip-v', 'with': 'wít-th', 'loving': 'la-ving', 'family': 'phem-mi-li', 'in': 'in', 'a': 'ơ',
    'cozy': 'câu-zi', 'house': 'hao-s', 'favorite': 'phây-vơ-rịt', 'color': 'ca-lơ', 'blue': 'bơ-lu',
    'very': 've-ri', 'happy': 'hép-pi', 'meet': 'mít', 'all': 'o-l', 'of': 'ốp-v', 'you': 'diu',
    'want': 'woan-t', 'share': 'se-ơ', 'morning': 'mo-ning', 'routine': 'ru-tin', 'wake': 'guếc', 'up': 'ấp',
    'early': 'ơ-li', 'at': 'ét', 'six': 'xích-s', "o'clock": 'ơ-cơ-lót-k', 'every': 'é-vơ-ri', 'day': 'đê',
    'first': 'phơ-st', 'wash': 'woa-sh', 'face': 'phê-s', 'brush': 'bơ-rắt-sh', 'teeth': 'tí-th',
    'carefully': 'ke-phu-li', 'then': 'đen', 'eat': 'ít', 'warm': 'woa-m', 'breakfast': 'bơ-rếch-phơ-st',
    'put': 'pút', 'on': 'on', 'school': 'xơ-cun', 'uniform': 'diu-ni-pho-m', 'starting': 'xờ-tát-ting',
    'new': 'niu', 'always': 'on-goây-z', 'exciting': 'ếch-sai-tinh', 'friends': 'phơ-ren-dz', 'two': 'tu',
    'times': 'tai-mz', 'before': 'bi-pho', 'bedtime': 'bét-tai-m', 'use': 'diu-z', 'soft': 'xóp-t',
    'toothbrush': 'tút-th-bơ-rắt-sh', 'mint': 'min-t', 'toothpaste': 'tút-th-pê-st', 'keeping': 'kíp-ping',
    'clean': 'cơ-lin', 'gives': 'gíp-vz', 'me': 'mi', 'bright': 'bơ-rai-t', 'smile': 'xờ-mai-l',
    'nine': 'nai-n', 'pajamas': 'pơ-gia-mơ-z', 'get': 'gét', 'into': 'in-tu', 'bed': 'bét',
    'mother': 'ma-đơ', 'often': 'óp-phừn', 'reads': 'rít-dz', 'lovely': 'lắp-vơ-li', 'story': 'xờ-to-ri',
    'close': 'cơ-lâu-z', 'eyes': 'ai-z', 'have': 'hép-v', 'sweet': 'xuwít', 'dreams': 'đơ-rim-z', 'night': 'nai-t'
  };

  return text
    .split(/\s+/)
    .map(w => {
      const clean = w.toLowerCase().replace(/[^a-z0-9']/g, '');
      return dict[clean] || clean;
    })
    .join(' ');
}

// 100 lessons raw catalog
const lessons = [
  // 1-10
  {
    num: 1, titleEn: "Introducing Myself", titleVi: "Giới thiệu bản thân", icon: "👦", group: "Bản thân & Thói quen", groupId: 1,
    textEn: "Hello everyone. Today I would like to talk about myself. My name is Nam and I am seven years old. I live with my loving family in a cozy house. My favorite color is blue. I am very happy to meet all of you today.",
    textVi: "Xin chào tất cả mọi người. Hôm nay em xin phép được nói về bản thân mình. Tên em là Nam và em bảy tuổi. Em sống cùng gia đình thân yêu trong một ngôi nhà ấm cúng. Màu sắc yêu thích của em là màu xanh dương. Em rất vui được gặp gỡ tất cả các bạn hôm nay.",
    keywords: [
      { word: "myself", meaning: "bản thân tôi", ipa: "/maɪˈself/", readVi: "mai-xeo-f" },
      { word: "seven", meaning: "bảy tuổi", ipa: "/ˈsev.ən/", readVi: "se-vừn" },
      { word: "loving", meaning: "yêu thương", ipa: "/ˈlʌv.ɪŋ/", readVi: "la-ving" },
      { word: "cozy", meaning: "ấm cúng", ipa: "/ˈkoʊ.zi/", readVi: "câu-zi" },
      { word: "happy", meaning: "vui vẻ", ipa: "/ˈhæp.i/", readVi: "hép-pi" }
    ]
  },
  {
    num: 2, titleEn: "My Morning Routine", titleVi: "Thói quen buổi sáng", icon: "🌅", group: "Bản thân & Thói quen", groupId: 1,
    textEn: "Hello everyone. Today I want to share my morning routine. I wake up early at six o'clock every day. First, I wash my face and brush my teeth carefully. Then, I eat a warm breakfast and put on my school uniform. Starting a new day is always exciting.",
    textVi: "Xin chào mọi người. Hôm nay em muốn chia sẻ về thói quen buổi sáng của mình. Em thức dậy sớm lúc sáu giờ mỗi ngày. Đầu tiên, em rửa mặt và đánh răng cẩn thận. Sau đó, em ăn bữa sáng nóng sốt và mặc đồng phục đi học. Bắt đầu một ngày mới luôn luôn hào hứng.",
    keywords: [
      { word: "morning", meaning: "buổi sáng", ipa: "/ˈmɔːr.nɪŋ/", readVi: "mo-ning" },
      { word: "wake up", meaning: "thức dậy", ipa: "/weɪk ʌp/", readVi: "guếc-ấp" },
      { word: "brush", meaning: "đánh (răng)", ipa: "/brʌʃ/", readVi: "bơ-rắt-sh" },
      { word: "uniform", meaning: "đồng phục", ipa: "/ˈjuː.nə.fɔːrm/", readVi: "diu-ni-pho-m" },
      { word: "exciting", meaning: "hào hứng", ipa: "/ɪkˈsaɪ.tɪŋ/", readVi: "ếch-sai-tinh" }
    ]
  },
  {
    num: 3, titleEn: "Brushing My Teeth", titleVi: "Đánh răng sạch sẽ", icon: "🪥", group: "Bản thân & Thói quen", groupId: 1,
    textEn: "Hello friends. Today I talk about brushing teeth. I brush my teeth two times every day, in the morning and before bedtime. I use a soft toothbrush and mint toothpaste. Keeping my teeth clean gives me a bright and happy smile.",
    textVi: "Chào các bạn. Hôm nay em nói về việc đánh răng. Em đánh răng hai lần mỗi ngày, vào buổi sáng và trước khi đi ngủ. Em sử dụng một chiếc bàn chải mềm và kem đánh răng vị bạc hà. Giữ răng miệng sạch sẽ giúp em có nụ cười rạng rỡ và vui vẻ.",
    keywords: [
      { word: "teeth", meaning: "răng", ipa: "/tiːθ/", readVi: "tí-th" },
      { word: "brushing", meaning: "đánh răng", ipa: "/ˈbrʌʃ.ɪŋ/", readVi: "bơ-rắt-shing" },
      { word: "soft", meaning: "mềm mại", ipa: "/sɔːft/", readVi: "xóp-t" },
      { word: "clean", meaning: "sạch sẽ", ipa: "/kliːn/", readVi: "cơ-lin" },
      { word: "smile", meaning: "nụ cười", ipa: "/smaɪl/", readVi: "xờ-mai-l" }
    ]
  },
  {
    num: 4, titleEn: "My Bedtime", titleVi: "Giờ đi ngủ của em", icon: "🛏️", group: "Bản thân & Thói quen", groupId: 1,
    textEn: "Hello everyone. Today I would like to talk about bedtime. At nine o'clock, I put on my pajamas and get into bed. My mother often reads me a lovely bedtime story. Then, I close my eyes and have sweet dreams all night.",
    textVi: "Xin chào mọi người. Hôm nay em xin được nói về giờ đi ngủ. Lúc chín giờ, em mặc quần áo ngủ và lên giường. Mẹ thường đọc cho em một câu chuyện kể trước giờ ngủ thật hay. Sau đó, em nhắm mắt lại và có những giấc mơ ngọt ngào suốt đêm.",
    keywords: [
      { word: "bedtime", meaning: "giờ đi ngủ", ipa: "/ˈbed.taɪm/", readVi: "bét-tai-m" },
      { word: "pajamas", meaning: "quần áo ngủ", ipa: "/pəˈdʒɑː.məz/", readVi: "pơ-gia-mơ-z" },
      { word: "story", meaning: "câu chuyện", ipa: "/ˈstɔːr.i/", readVi: "xờ-to-ri" },
      { word: "close", meaning: "nhắm lại", ipa: "/kloʊz/", readVi: "cơ-lâu-z" },
      { word: "sweet", meaning: "ngọt ngào", ipa: "/swiːt/", readVi: "xuwít" }
    ]
  },
  {
    num: 5, titleEn: "My Favorite Clothes", titleVi: "Trang phục em thích", icon: "👕", group: "Bản thân & Thói quen", groupId: 1,
    textEn: "Hello friends. Today I want to tell you about my favorite clothes. On sunny days, I love wearing a yellow T-shirt and blue shorts. They are very comfortable and soft. Wearing nice clothes makes me feel confident and ready to play.",
    textVi: "Chào các bạn. Hôm nay em muốn kể về trang phục em yêu thích. Vào những ngày nắng đẹp, em thích mặc áo phông màu vàng và quần soóc xanh dương. Chúng rất thoải mái và mềm mại. Mặc quần áo đẹp giúp em cảm thấy tự tin và sẵn sàng vui chơi.",
    keywords: [
      { word: "clothes", meaning: "quần áo", ipa: "/kloʊðz/", readVi: "cơ-lâu-z" },
      { word: "wearing", meaning: "mặc", ipa: "/ˈwer.ɪŋ/", readVi: "we-ring" },
      { word: "yellow", meaning: "màu vàng", ipa: "/ˈjel.oʊ/", readVi: "de-lâu" },
      { word: "comfortable", meaning: "thoải mái", ipa: "/ˈkʌm.fɚ.t̬ə.bəl/", readVi: "căm-phơ-tơ-bồ" },
      { word: "confident", meaning: "tự tin", ipa: "/ˈkɑːn.fə.dənt/", readVi: "con-phi-đừn-t" }
    ]
  },
  {
    num: 6, titleEn: "Washing Hands", titleVi: "Rửa tay sạch sẽ", icon: "🧼", group: "Bản thân & Thói quen", groupId: 1,
    textEn: "Hello everyone. Today I talk about washing hands. Clean hands keep bad germs away from our bodies. I wash my hands with warm water and soap before eating and after playing outside. It is an easy habit that keeps us healthy.",
    textVi: "Xin chào mọi người. Hôm nay em nói về việc rửa tay. Đôi tay sạch sẽ giúp xua đuổi vi khuẩn gây hại khỏi cơ thể chúng ta. Em rửa tay bằng nước ấm và xà phòng trước khi ăn và sau khi chơi ngoài trời. Đó là một thói quen đơn giản giúp chúng ta luôn khỏe mạnh.",
    keywords: [
      { word: "hands", meaning: "đôi bàn tay", ipa: "/hændz/", readVi: "hen-dz" },
      { word: "germs", meaning: "vi khuẩn", ipa: "/dʒɝːmz/", readVi: "giơm-z" },
      { word: "soap", meaning: "xà phòng", ipa: "/soʊp/", readVi: "xô-p" },
      { word: "eating", meaning: "ăn uống", ipa: "/ˈiː.tɪŋ/", readVi: "í-tinh" },
      { word: "healthy", meaning: "khỏe mạnh", ipa: "/ˈhel.θi/", readVi: "heo-thi" }
    ]
  },
  {
    num: 7, titleEn: "My Birthday Party", titleVi: "Bữa tiệc sinh nhật", icon: "🎂", group: "Bản thân & Thói quen", groupId: 1,
    textEn: "Hello friends. Today I would like to talk about my birthday party. Last week, my parents made a wonderful party for me. There was a sweet chocolate cake with seven candles. My friends sang the birthday song and gave me nice gifts.",
    textVi: "Chào các bạn. Hôm nay em xin được kể về bữa tiệc sinh nhật của mình. Tuần trước, bố mẹ đã tổ chức một bữa tiệc tuyệt vời cho em. Có một chiếc bánh sô-cô-la ngọt ngào thắp bảy cây nến. Bạn bè đã hát bài hát chúc mừng sinh nhật và tặng em những món quà xinh xắn.",
    keywords: [
      { word: "birthday", meaning: "sinh nhật", ipa: "/ˈbɝːθ.deɪ/", readVi: "bớt-đê" },
      { word: "party", meaning: "bữa tiệc", ipa: "/ˈpɑːr.t̬i/", readVi: "pa-ti" },
      { word: "chocolate", meaning: "sô-cô-la", ipa: "/ˈtʃɑːk.lət/", readVi: "chóc-cơ-lợt" },
      { word: "candles", meaning: "những cây nến", ipa: "/ˈkæn.dəlz/", readVi: "can-đồ-z" },
      { word: "gifts", meaning: "món quà", ipa: "/ɡɪfts/", readVi: "gíp-s" }
    ]
  },
  {
    num: 8, titleEn: "Healthy Breakfast", titleVi: "Bữa sáng bổ dưỡng", icon: "🍳", group: "Bản thân & Thói quen", groupId: 1,
    textEn: "Hello everyone. Today I share about my breakfast. Breakfast is the most important meal of the day. I usually eat a boiled egg, bread, and drink a glass of fresh milk. It gives me plenty of energy to study and run at school.",
    textVi: "Xin chào mọi người. Hôm nay em chia sẻ về bữa sáng của mình. Bữa sáng là bữa ăn quan trọng nhất trong ngày. Em thường ăn một quả trứng luộc, bánh mì và uống một ly sữa tươi. Bữa sáng cung cấp cho em dồi dào năng lượng để học tập và chạy nhảy ở trường.",
    keywords: [
      { word: "breakfast", meaning: "bữa sáng", ipa: "/ˈbrek.fəst/", readVi: "bơ-rếch-phơ-st" },
      { word: "important", meaning: "quan trọng", ipa: "/ɪmˈpɔːr.tənt/", readVi: "im-po-tần-t" },
      { word: "egg", meaning: "quả trứng", ipa: "/eɡ/", readVi: "éc-g" },
      { word: "fresh milk", meaning: "sữa tươi", ipa: "/freʃ mɪlk/", readVi: "phơ-rét-sh miu-k" },
      { word: "energy", meaning: "năng lượng", ipa: "/ˈen.ɚ.dʒi/", readVi: "e-nơ-gi" }
    ]
  },
  {
    num: 9, titleEn: "My Shoes", titleVi: "Đôi giày của em", icon: "👟", group: "Bản thân & Thói quen", groupId: 1,
    textEn: "Hello friends. Today I talk about my favorite shoes. I have a pair of white sneakers for running. My father taught me how to tie the shoelaces neatly. I always clean my shoes after school so they stay bright and fresh.",
    textVi: "Chào các bạn. Hôm nay em nói về đôi giày em yêu thích. Em có một đôi giày thể thao màu trắng để chạy bộ. Bố đã dạy em cách buộc dây giày thật gọn gàng. Em luôn lau chùi giày sau giờ học để giày luôn sáng sạch như mới.",
    keywords: [
      { word: "shoes", meaning: "đôi giày", ipa: "/ʃuːz/", readVi: "su-z" },
      { word: "sneakers", meaning: "giày thể thao", ipa: "/ˈsniː.kɚz/", readVi: "xờ-ní-cơ-z" },
      { word: "tie", meaning: "buộc, thắt", ipa: "/taɪ/", readVi: "tai" },
      { word: "shoelaces", meaning: "dây giày", ipa: "/ˈʃuː.leɪ.sɪz/", readVi: "su-lây-siz" },
      { word: "neatly", meaning: "gọn gàng", ipa: "/ˈniːt.li/", readVi: "nít-li" }
    ]
  },
  {
    num: 10, titleEn: "Drinking Water", titleVi: "Uống đủ nước", icon: "💧", group: "Bản thân & Thói quen", groupId: 1,
    textEn: "Hello everyone. Today I talk about drinking clean water. Our bodies need water every single day. I always bring a water bottle to my school. Drinking fresh water keeps me cool, fresh, and active during the day.",
    textVi: "Xin chào mọi người. Hôm nay em nói về việc uống nước sạch. Cơ thể chúng ta cần nước mỗi ngày. Em luôn mang theo một bình nước đến trường. Uống nước mát giúp em sảng khoái, tươi tắn và năng động suốt cả ngày.",
    keywords: [
      { word: "water", meaning: "nước", ipa: "/ˈwɑː.t̬ɚ/", readVi: "oa-tơ" },
      { word: "bodies", meaning: "cơ thể", ipa: "/ˈbɑː.diz/", readVi: "ba-điz" },
      { word: "bottle", meaning: "bình nước", ipa: "/ˈbɑː.t̬əl/", readVi: "ba-tồ" },
      { word: "cool", meaning: "mát mẻ", ipa: "/kuːl/", readVi: "cu-l" },
      { word: "active", meaning: "năng động", ipa: "/ˈæk.tɪv/", readVi: "ác-típ" }
    ]
  },

  // 11-20
  {
    num: 11, titleEn: "My Loving Family", titleVi: "Gia đình yêu thương", icon: "👨‍👩‍👧‍👦", group: "Gia đình yêu thương", groupId: 2,
    textEn: "Hello everyone. Today I would like to talk about my family. There are four people in my house: my father, my mother, my little brother, and me. We always eat dinner together and talk happily. I love my family very much.",
    textVi: "Xin chào mọi người. Hôm nay em xin được nói về gia đình của mình. Có bốn người trong nhà em: bố em, mẹ em, em trai nhỏ và em. Cả nhà luôn cùng nhau ăn tối và trò chuyện vui vẻ. Em yêu gia đình mình rất nhiều.",
    keywords: [
      { word: "family", meaning: "gia đình", ipa: "/ˈfæm.əl.i/", readVi: "phem-mi-li" },
      { word: "father", meaning: "bố", ipa: "/ˈfɑː.ðɚ/", readVi: "pha-đơ" },
      { word: "mother", meaning: "mẹ", ipa: "/ˈmʌð.ɚ/", readVi: "ma-đơ" },
      { word: "brother", meaning: "em trai", ipa: "/ˈbrʌð.ɚ/", readVi: "bơ-ra-đơ" },
      { word: "together", meaning: "cùng nhau", ipa: "/təˈɡeð.ɚ/", readVi: "tơ-gét-đơ" }
    ]
  },
  {
    num: 12, titleEn: "My Wonderful Father", titleVi: "Người bố tuyệt vời", icon: "👨", group: "Gia đình yêu thương", groupId: 2,
    textEn: "Hello friends. Today I talk about my father. My father is tall, strong, and very kind. In the evening, he often helps me with my math homework. On weekends, he teaches me how to ride a bicycle. He is my great hero.",
    textVi: "Chào các bạn. Hôm nay em nói về bố của mình. Bố em cao lớn, khỏe mạnh và rất tốt bụng. Vào buổi tối, bố thường giúp em làm bài tập toán. Vào cuối tuần, bố dạy em cách đi xe đạp. Bố là người hùng tuyệt vời của em.",
    keywords: [
      { word: "father", meaning: "bố", ipa: "/ˈfɑː.ðɚ/", readVi: "pha-đơ" },
      { word: "strong", meaning: "khỏe mạnh", ipa: "/strɑːŋ/", readVi: "xờ-troong" },
      { word: "homework", meaning: "bài tập về nhà", ipa: "/ˈhoʊm.wɝːk/", readVi: "hôm-goớc" },
      { word: "bicycle", meaning: "xe đạp", ipa: "/ˈbaɪ.sə.kəl/", readVi: "bai-xi-cồ" },
      { word: "hero", meaning: "người hùng", ipa: "/ˈhɪr.oʊ/", readVi: "hi-râu" }
    ]
  },
  {
    num: 13, titleEn: "My Sweet Mother", titleVi: "Người mẹ dịu hiền", icon: "👩", group: "Gia đình yêu thương", groupId: 2,
    textEn: "Hello everyone. Today I want to share about my mother. My mother has warm eyes and a gentle smile. She is a wonderful cook and makes the best noodle soup in town. She always hugs me before I go to sleep.",
    textVi: "Xin chào mọi người. Hôm nay em muốn chia sẻ về mẹ của mình. Mẹ em có ánh mắt ấm áp và nụ cười dịu hiền. Mẹ nấu ăn rất tuyệt và nấu món phở ngon nhất thị trấn. Mẹ luôn ôm em thật chặt trước khi em đi ngủ.",
    keywords: [
      { word: "gentle", meaning: "dịu dàng", ipa: "/ˈdʒen.t̬əl/", readVi: "gien-tồ" },
      { word: "cook", meaning: "người nấu ăn", ipa: "/kʊk/", readVi: "cúc" },
      { word: "noodle", meaning: "mì/phở", ipa: "/ˈnuː.dəl/", readVi: "nu-đồ" },
      { word: "hugs", meaning: "ôm", ipa: "/hʌɡz/", readVi: "hắc-gz" },
      { word: "sleep", meaning: "giấc ngủ", ipa: "/sliːp/", readVi: "xơ-líp" }
    ]
  },
  {
    num: 14, titleEn: "My Baby Sister", titleVi: "Em gái nhỏ của em", icon: "👧", group: "Gia đình yêu thương", groupId: 2,
    textEn: "Hello friends. Today I talk about my baby sister. Her name is Lily and she is only two years old. She has chubby cheeks and cute round eyes. I like reading picture books to her and making her giggle happily.",
    textVi: "Chào các bạn. Hôm nay em nói về em gái nhỏ của mình. Tên em là Lily và bé mới hai tuổi. Bé có đôi má phúng phính và đôi mắt tròn xoe đáng yêu. Em thích đọc sách tranh cho em nghe và làm cho em cười khúc khích vui vẻ.",
    keywords: [
      { word: "sister", meaning: "em gái", ipa: "/ˈsɪs.tɚ/", readVi: "xít-xtơ" },
      { word: "chubby", meaning: "phúng phính", ipa: "/ˈtʃʌb.i/", readVi: "chắp-bi" },
      { word: "cheeks", meaning: "đôi má", ipa: "/tʃiːks/", readVi: "chí-ks" },
      { word: "giggle", meaning: "cười khúc khích", ipa: "/ˈɡɪɡ.əl/", readVi: "gíc-gồ" },
      { word: "happily", meaning: "vui vẻ", ipa: "/ˈhæp.əl.i/", readVi: "hép-pi-li" }
    ]
  },
  {
    num: 15, titleEn: "My Grandparents", titleVi: "Ông bà kính yêu", icon: "👴👵", group: "Gia đình yêu thương", groupId: 2,
    textEn: "Hello everyone. Today I would like to talk about my grandparents. They live in a peaceful countryside house with a green garden. My grandmother tells wonderful folk tales, and my grandfather plants sweet fruit trees. I always enjoy visiting them.",
    textVi: "Xin chào mọi người. Hôm nay em xin được nói về ông bà của mình. Ông bà sống trong một ngôi nhà miền quê yên bình với khu vườn xanh mát. Bà kể những câu chuyện cổ tích tuyệt hay, còn ông thì trồng những cây ăn quả ngọt lành. Em luôn thích về thăm ông bà.",
    keywords: [
      { word: "grandparents", meaning: "ông bà", ipa: "/ˈɡræn.per.ənts/", readVi: "gơ-ran-pe-rừn-ts" },
      { word: "peaceful", meaning: "yên bình", ipa: "/ˈpiːs.fəl/", readVi: "pít-s-phu-l" },
      { word: "countryside", meaning: "nông thôn", ipa: "/ˈkʌn.tri.saɪd/", readVi: "căn-tri-sai-đ" },
      { word: "tales", meaning: "câu chuyện", ipa: "/teɪlz/", readVi: "tê-i-lz" },
      { word: "plants", meaning: "trồng cây", ipa: "/plænts/", readVi: "pơ-lan-ts" }
    ]
  },
  {
    num: 16, titleEn: "My Cozy Bedroom", titleVi: "Phòng ngủ ấm cúng", icon: "🛏️", group: "Gia đình yêu thương", groupId: 2,
    textEn: "Hello friends. Today I talk about my bedroom. It is small but very neat and bright. There is a cozy bed, a wooden desk, and a bookshelf full of comics. I love sitting at my desk to read and draw pictures.",
    textVi: "Chào các bạn. Hôm nay em nói về phòng ngủ của mình. Phòng tuy nhỏ nhưng rất ngăn nắp và sáng sủa. Trong phòng có chiếc giường ấm áp, bàn học bằng gỗ và giá sách đầy truyện tranh. Em thích ngồi vào bàn để đọc sách và vẽ tranh.",
    keywords: [
      { word: "bedroom", meaning: "phòng ngủ", ipa: "/ˈbed.rʊm/", readVi: "bét-rum" },
      { word: "neat", meaning: "ngăn nắp", ipa: "/niːt/", readVi: "nít" },
      { word: "wooden", meaning: "bằng gỗ", ipa: "/ˈwʊd.ən/", readVi: "gút-đừn" },
      { word: "bookshelf", meaning: "kệ sách", ipa: "/ˈbʊk.ʃelf/", readVi: "búc-seo-f" },
      { word: "draw", meaning: "vẽ tranh", ipa: "/drɑː/", readVi: "đơ-ro" }
    ]
  },
  {
    num: 17, titleEn: "The Living Room", titleVi: "Phòng khách ấm áp", icon: "🛋️", group: "Gia đình yêu thương", groupId: 2,
    textEn: "Hello everyone. Today I share about our living room. It is the center of our home where my family gathers. There is a soft gray sofa and a television. In the evening, we sit together and watch funny cartoons.",
    textVi: "Xin chào mọi người. Hôm nay em chia sẻ về phòng khách của nhà em. Đây là trung tâm ngôi nhà nơi gia đình em sum họp. Có một chiếc ghế sofa màu xám êm ái và một chiếc ti-vi. Vào buổi tối, cả nhà cùng ngồi xem những bộ phim hoạt hình vui nhộn.",
    keywords: [
      { word: "living room", meaning: "phòng khách", ipa: "/ˈlɪv.ɪŋ ˌruːm/", readVi: "li-ving rum" },
      { word: "gathers", meaning: "sum họp", ipa: "/ˈɡæð.ɚz/", readVi: "ga-đơ-z" },
      { word: "sofa", meaning: "ghế sô-pha", ipa: "/ˈsoʊ.fə/", readVi: "xô-pha" },
      { word: "television", meaning: "ti-vi", ipa: "/ˈtel.ə.vɪʒ.ən/", readVi: "te-li-vi-giừn" },
      { word: "cartoons", meaning: "hoạt hình", ipa: "/kɑːrˈtuːnz/", readVi: "ca-tun-z" }
    ]
  },
  {
    num: 18, titleEn: "My Kitchen", titleVi: "Căn bếp của mẹ", icon: "🍳", group: "Gia đình yêu thương", groupId: 2,
    textEn: "Hello friends. Today I talk about our kitchen. It is always warm and smells delicious. My mother prepares healthy meals here every day. I often help her wash small vegetables and set the dining table neatly.",
    textVi: "Chào các bạn. Hôm nay em nói về gian bếp nhà em. Bếp luôn ấm cúng và thơm lừng đồ ăn ngon. Mẹ em chuẩn bị những bữa ăn bổ dưỡng ở đây mỗi ngày. Em thường giúp mẹ rửa những nhánh rau nhỏ và dọn bàn ăn thật ngay ngắn.",
    keywords: [
      { word: "kitchen", meaning: "nhà bếp", ipa: "/ˈkɪtʃ.ən/", readVi: "kít-chừn" },
      { word: "smells", meaning: "tỏa mùi thơm", ipa: "/smelz/", readVi: "xơ-meo-z" },
      { word: "delicious", meaning: "thơm ngon", ipa: "/dɪˈlɪʃ.əs/", readVi: "đi-li-sợt-s" },
      { word: "vegetables", meaning: "rau củ", ipa: "/ˈvedʒ.tə.bəlz/", readVi: "véc-tơ-bồ-z" },
      { word: "dining table", meaning: "bàn ăn", ipa: "/ˈdaɪ.nɪŋ ˌteɪ.bəl/", readVi: "đai-ning tê-bồ" }
    ]
  },
  {
    num: 19, titleEn: "Helping at Home", titleVi: "Giúp đỡ việc nhà", icon: "🧹", group: "Gia đình yêu thương", groupId: 2,
    textEn: "Hello everyone. Today I want to talk about helping at home. Doing chores makes me a responsible child. Every afternoon, I water the garden flowers and clean my toy box. My parents feel very happy and proud of me.",
    textVi: "Xin chào mọi người. Hôm nay em muốn nói về việc giúp đỡ việc nhà. Làm việc nhà giúp em trở thành một em bé có trách nhiệm. Mỗi buổi chiều, em tưới hoa trong vườn và dọn dẹp hộp đồ chơi. Bố mẹ cảm thấy rất vui và tự hào về em.",
    keywords: [
      { word: "helping", meaning: "giúp đỡ", ipa: "/ˈhel.pɪŋ/", readVi: "heo-ping" },
      { word: "chores", meaning: "việc nhà", ipa: "/tʃɔːrz/", readVi: "cho-z" },
      { word: "responsible", meaning: "có trách nhiệm", ipa: "/rɪˈspɑːn.sə.bəl/", readVi: "ri-xờ-pon-si-bồ" },
      { word: "water", meaning: "tưới nước", ipa: "/ˈwɑː.t̬ɚ/", readVi: "oa-tơ" },
      { word: "proud", meaning: "tự hào", ipa: "/praʊd/", readVi: "pơ-rao-đ" }
    ]
  },
  {
    num: 20, titleEn: "Weekend with Family", titleVi: "Cuối tuần cùng gia đình", icon: "🪁", group: "Gia đình yêu thương", groupId: 2,
    textEn: "Hello friends. Today I talk about our happy weekend. On Sunday morning, my whole family goes to the green park. We ride bikes, fly kites in the sky, and eat fresh fruit together. Weekends are full of joy and laughter.",
    textVi: "Chào các bạn. Hôm nay em nói về ngày cuối tuần hạnh phúc của nhà em. Vào sáng Chủ nhật, cả gia đình em đi đến công viên xanh mát. Chúng em đạp xe, thả diều trên bầu trời và cùng nhau ăn hoa quả tươi. Cuối tuần tràn ngập niềm vui và tiếng cười.",
    keywords: [
      { word: "weekend", meaning: "cuối tuần", ipa: "/ˈwiːk.end/", readVi: "wík-en-đ" },
      { word: "park", meaning: "công viên", ipa: "/pɑːrk/", readVi: "pác-k" },
      { word: "fly kites", meaning: "thả diều", ipa: "/flaɪ kaɪts/", readVi: "phơ-lai kai-ts" },
      { word: "sky", meaning: "bầu trời", ipa: "/skaɪ/", readVi: "xờ-cai" },
      { word: "laughter", meaning: "tiếng cười", ipa: "/ˈlæf.tɚ/", readVi: "láp-tơ" }
    ]
  },

  // 21-30
  {
    num: 21, titleEn: "My Beautiful School", titleVi: "Ngôi trường thân yêu", icon: "🏫", group: "Trường học & Thầy cô, Bạn bè", groupId: 3,
    textEn: "Hello everyone. Today I would like to talk about my school. My school is large, clean, and painted yellow. There are three floors and twenty bright classrooms. I feel very excited every morning when I walk through the school gate.",
    textVi: "Xin chào mọi người. Hôm nay em xin được nói về ngôi trường của em. Trường em rộng lớn, sạch đẹp và được sơn màu vàng. Trường có ba tầng và hai mươi phòng học sáng sủa. Em cảm thấy rất hào hứng mỗi buổi sáng khi bước qua cổng trường.",
    keywords: [
      { word: "school", meaning: "trường học", ipa: "/skuːl/", readVi: "xờ-cun" },
      { word: "clean", meaning: "sạch sẽ", ipa: "/kliːn/", readVi: "cơ-lin" },
      { word: "floors", meaning: "tầng lầu", ipa: "/flɔːrz/", readVi: "phơ-lo-z" },
      { word: "classrooms", meaning: "lớp học", ipa: "/ˈklæs.rʊmz/", readVi: "cơ-lát-s-rum-z" },
      { word: "gate", meaning: "cổng trường", ipa: "/ɡeɪt/", readVi: "gết-t" }
    ]
  },
  {
    num: 22, titleEn: "My Friendly Teacher", titleVi: "Cô giáo thân thiện", icon: "👩‍🏫", group: "Trường học & Thầy cô, Bạn bè", groupId: 3,
    textEn: "Hello friends. Today I talk about my teacher, Miss Lan. She is very patient, kind, and always wears a warm smile. She teaches us English songs, fun games, and good manners. All students in my class love her dearly.",
    textVi: "Chào các bạn. Hôm nay em nói về cô giáo của em, cô Lan. Cô rất kiên nhẫn, tốt bụng và luôn nở nụ cười ấm áp. Cô dạy chúng em những bài hát tiếng Anh, trò chơi vui nhộn và lễ phép. Tất cả các bạn trong lớp đều yêu quý cô tha thiết.",
    keywords: [
      { word: "teacher", meaning: "giáo viên", ipa: "/ˈtiː.tʃɚ/", readVi: "tí-chơ" },
      { word: "patient", meaning: "kiên nhẫn", ipa: "/ˈpeɪ.ʃənt/", readVi: "pê-sừn-t" },
      { word: "kind", meaning: "tốt bụng", ipa: "/kaɪnd/", readVi: "cai-n-đ" },
      { word: "manners", meaning: "lễ phép", ipa: "/ˈmæn.ɚz/", readVi: "men-nơ-z" },
      { word: "dearly", meaning: "tha thiết", ipa: "/ˈdɪr.li/", readVi: "đia-li" }
    ]
  },
  {
    num: 23, titleEn: "My Best Classmate", titleVi: "Người bạn cùng bàn", icon: "🧑‍🤝‍🧑", group: "Trường học & Thầy cô, Bạn bè", groupId: 3,
    textEn: "Hello everyone. Today I want to introduce my classmate, Minh. He sits right next to me in the second row. We often share colorful crayons and read storybooks together during break time. He is a very generous friend.",
    textVi: "Xin chào mọi người. Hôm nay em muốn giới thiệu về người bạn cùng lớp của em, bạn Minh. Bạn ngồi ngay cạnh em ở hàng ghế thứ hai. Chúng em thường chia sẻ bút sáp màu và cùng đọc truyện tranh trong giờ giải lao. Bạn là một người bạn rất tốt bụng và hào phóng.",
    keywords: [
      { word: "classmate", meaning: "bạn cùng lớp", ipa: "/ˈklæs.meɪt/", readVi: "cơ-lát-s-mết" },
      { word: "second row", meaning: "hàng ghế thứ hai", ipa: "/ˈsek.ənd roʊ/", readVi: "xé-cần-đ râu" },
      { word: "share", meaning: "chia sẻ", ipa: "/ʃer/", readVi: "se-ơ" },
      { word: "crayons", meaning: "bút sáp màu", ipa: "/ˈkreɪ.ɑːnz/", readVi: "cơ-rây-on-z" },
      { word: "generous", meaning: "rộng rãi, tốt bụng", ipa: "/ˈdʒen.ər.əs/", readVi: "gien-nơ-rợt-s" }
    ]
  },
  {
    num: 24, titleEn: "My School Bag", titleVi: "Chiếc cặp sách của em", icon: "🎒", group: "Trường học & Thầy cô, Bạn bè", groupId: 3,
    textEn: "Hello friends. Today I talk about my school bag. It is a blue backpack with two side pockets for my water bottle. Inside, I keep my notebooks, textbooks, and a yellow pencil case. It carries everything I need to learn.",
    textVi: "Chào các bạn. Hôm nay em nói về chiếc cặp sách của mình. Đó là chiếc ba-lô màu xanh với hai ngăn túi bên hông đựng bình nước. Bên trong, em đựng vở, sách giáo khoa và hộp bút màu vàng. Cặp mang theo mọi thứ em cần để học tập.",
    keywords: [
      { word: "school bag", meaning: "cặp sách", ipa: "/ˈskuːl ˌbæɡ/", readVi: "xơ-cun béc-g" },
      { word: "backpack", meaning: "ba-lô", ipa: "/ˈbæk.pæk/", readVi: "béc-péc" },
      { word: "pockets", meaning: "ngăn túi", ipa: "/ˈpɑː.kɪts/", readVi: "póc-kịt-s" },
      { word: "pencil case", meaning: "hộp bút", ipa: "/ˈpen.səl ˌkeɪs/", readVi: "pen-xồ cết-s" },
      { word: "learn", meaning: "học tập", ipa: "/lɝːn/", readVi: "lơn" }
    ]
  },
  {
    num: 25, titleEn: "My Pencil Case", titleVi: "Hộp bút xinh xắn", icon: "✏️", group: "Trường học & Thầy cô, Bạn bè", groupId: 3,
    textEn: "Hello everyone. Today I want to show you my pencil case. Inside my case, there are three sharp pencils, a white eraser, and a wooden ruler. They help me write straight letters and draw neat shapes every day.",
    textVi: "Xin chào mọi người. Hôm nay em muốn khoe chiếc hộp bút của mình. Trong hộp bút có ba chiếc bút chì nhọn, một cục tẩy trắng và cây thước kẻ gỗ. Chúng giúp em viết chữ ngay ngắn và vẽ những hình khối đẹp mỗi ngày.",
    keywords: [
      { word: "pencil", meaning: "bút chì", ipa: "/ˈpen.səl/", readVi: "pen-xồ" },
      { word: "eraser", meaning: "cục tẩy", ipa: "/ɪˈreɪ.sɚ/", readVi: "i-rây-xơ" },
      { word: "ruler", meaning: "cây thước kẻ", ipa: "/ˈruː.lɚ/", readVi: "ru-lơ" },
      { word: "sharp", meaning: "nhọn, sắc", ipa: "/ʃɑːrp/", readVi: "sáp" },
      { word: "shapes", meaning: "hình khối", ipa: "/ʃeɪps/", readVi: "xê-i-p-s" }
    ]
  },
  {
    num: 26, titleEn: "Learning English", titleVi: "Em học tiếng Anh", icon: "🔤", group: "Trường học & Thầy cô, Bạn bè", groupId: 3,
    textEn: "Hello friends. Today I would like to talk about learning English. English is an interesting language spoken around the world. In class, we sing cheerful alphabet songs and learn new words. Practicing speaking English every day makes me smarter.",
    textVi: "Chào các bạn. Hôm nay em xin nói về việc học tiếng Anh. Tiếng Anh là một ngôn ngữ thú vị được nói trên khắp thế giới. Trong lớp, chúng em hát những bài ca bảng chữ cái vui tươi và học từ vựng mới. Luyện nói tiếng Anh mỗi ngày giúp em thông minh hơn.",
    keywords: [
      { word: "English", meaning: "tiếng Anh", ipa: "/ˈɪŋ.ɡlɪʃ/", readVi: "ing-gơ-lít-sh" },
      { word: "language", meaning: "ngôn ngữ", ipa: "/ˈlæŋ.ɡwɪdʒ/", readVi: "leng-guých" },
      { word: "alphabet", meaning: "bảng chữ cái", ipa: "/ˈæl.fə.bet/", readVi: "eo-phơ-bét" },
      { word: "practicing", meaning: "luyện tập", ipa: "/ˈpræk.tɪs.ɪŋ/", readVi: "pơ-rác-tít-sing" },
      { word: "smarter", meaning: "thông minh hơn", ipa: "/ˈsmɑːr.t̬ɚ/", readVi: "xờ-mát-tơ" }
    ]
  },
  {
    num: 27, titleEn: "Learning Math", titleVi: "Học toán thật vui", icon: "🔢", group: "Trường học & Thầy cô, Bạn bè", groupId: 3,
    textEn: "Hello everyone. Today I talk about my math lessons. Math is full of wonderful numbers and shapes. I like counting from one to one hundred and solving easy addition puzzles. Doing math exercises makes my brain sharp and strong.",
    textVi: "Xin chào mọi người. Hôm nay em nói về tiết học toán. Môn Toán tràn ngập những con số và hình khối kỳ diệu. Em thích đếm từ một đến một trăm và giải những câu đố phép cộng đơn giản. Làm bài tập toán giúp trí não em thêm sắc bén và khỏe mạnh.",
    keywords: [
      { word: "math", meaning: "môn Toán", ipa: "/mæθ/", readVi: "mát-th" },
      { word: "counting", meaning: "đếm số", ipa: "/ˈkaʊn.tɪŋ/", readVi: "cao-n-tinh" },
      { word: "addition", meaning: "phép cộng", ipa: "/əˈdɪʃ.ən/", readVi: "ơ-đít-shừn" },
      { word: "puzzles", meaning: "câu đố", ipa: "/ˈpʌz.əlz/", readVi: "pắt-zồ-z" },
      { word: "brain", meaning: "trí não", ipa: "/breɪn/", readVi: "bơ-rên" }
    ]
  },
  {
    num: 28, titleEn: "Fun Recess Time", titleVi: "Giờ ra chơi nhộn nhịp", icon: "🔔", group: "Trường học & Thầy cô, Bạn bè", groupId: 3,
    textEn: "Hello friends. Today I talk about recess time at school. When the bell rings, we all rush out to the schoolyard. Some children jump rope, while others play hide-and-seek under the shade of banyan trees. Recess is full of happy smiles.",
    textVi: "Chào các bạn. Hôm nay em nói về giờ ra chơi ở trường. Khi tiếng chuông reo lên, tất cả chúng em cùng ùa ra sân trường. Một số bạn nhảy dây, trong khi các bạn khác chơi trốn tìm dưới bóng cây bàng râm mát. Giờ ra chơi luôn tràn ngập nụ cười vui tươi.",
    keywords: [
      { word: "recess", meaning: "giờ ra chơi", ipa: "/ˈriː.ses/", readVi: "ri-xét-s" },
      { word: "bell", meaning: "tiếng chuông", ipa: "/bel/", readVi: "beo" },
      { word: "schoolyard", meaning: "sân trường", ipa: "/ˈskuːl.jɑːrd/", readVi: "xơ-cun-dát-đ" },
      { word: "jump rope", meaning: "nhảy dây", ipa: "/dʒʌmp roʊp/", readVi: "giăm-p râu-p" },
      { word: "hide-and-seek", meaning: "trốn tìm", ipa: "/ˌhaɪd.n̩ˈsiːk/", readVi: "hai-đ-en-xíc" }
    ]
  },
  {
    num: 29, titleEn: "The School Library", titleVi: "Thư viện trường em", icon: "📚", group: "Trường học & Thầy cô, Bạn bè", groupId: 3,
    textEn: "Hello everyone. Today I share about our school library. The library is very quiet, clean, and full of wonderful books. We always walk softly and speak in low whispers. I love borrowing colorful science and fairy tale books.",
    textVi: "Xin chào mọi người. Hôm nay em chia sẻ về thư viện trường em. Thư viện rất yên tĩnh, sạch sẽ và có vô vàn cuốn sách hay. Chúng em luôn bước đi nhẹ nhàng và nói thật khẽ. Em thích mượn những cuốn sách khoa học rực rỡ và truyện cổ tích.",
    keywords: [
      { word: "library", meaning: "thư viện", ipa: "/ˈlaɪ.brer.i/", readVi: "lai-bơ-rơ-ri" },
      { word: "quiet", meaning: "yên tĩnh", ipa: "/ˈkwaɪ.ət/", readVi: "quai-ợt" },
      { word: "whispers", meaning: "thì thầm", ipa: "/ˈwɪs.pɚz/", readVi: "goít-x-pơ-z" },
      { word: "borrowing", meaning: "mượn sách", ipa: "/ˈbɑːr.oʊ.ɪŋ/", readVi: "ba-râu-inh" },
      { word: "fairy tale", meaning: "truyện cổ tích", ipa: "/ˈfer.i ˌteɪl/", readVi: "phe-ri tê-l" }
    ]
  },
  {
    num: 30, titleEn: "The School Garden", titleVi: "Vườn hoa trường em", icon: "🌻", group: "Trường học & Thầy cô, Bạn bè", groupId: 3,
    textEn: "Hello friends. Today I talk about the garden in our school. There are red roses, yellow sunflowers, and green bushes. Butterflies and busy bees often fly over the blossoms. The garden makes our school fresh and lovely.",
    textVi: "Chào các bạn. Hôm nay em nói về vườn hoa trường em. Ở đó có những bông hồng đỏ, hoa hướng dương vàng và những bụi cây xanh mát. Những chú bướm và ong chăm chỉ thường bay lượn trên những đóa hoa nở rộ. Khu vườn làm cho trường em thêm tươi mới và đáng yêu.",
    keywords: [
      { word: "garden", meaning: "khu vườn", ipa: "/ˈɡɑːr.dən/", readVi: "ga-đừn" },
      { word: "roses", meaning: "hoa hồng", ipa: "/ˈroʊ.zɪz/", readVi: "râu-ziz" },
      { word: "sunflowers", meaning: "hoa hướng dương", ipa: "/ˈsʌnˌflaʊ.ɚz/", readVi: "xăn-phơ-lao-ơ-z" },
      { word: "butterflies", meaning: "những chú bướm", ipa: "/ˈbʌt̬.ɚ.flaɪz/", readVi: "bát-tơ-phơ-lai-z" },
      { word: "blossoms", meaning: "bông hoa nở", ipa: "/ˈblɑː.səmz/", readVi: "bơ-loắt-xơm-z" }
    ]
  }
];

console.log("30 lessons written into builder");
