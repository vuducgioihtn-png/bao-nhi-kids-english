// Script to generate all 100 Grade 2 reading & presentation passages
import fs from 'fs';
import path from 'path';

const rawData = [
  // Page 1
  {
    num: 1,
    titleEn: "Introducing Myself",
    titleVi: "Giới thiệu bản thân",
    icon: "👦",
    group: "Bản thân & Thói quen",
    groupId: 1,
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
    num: 2,
    titleEn: "My Morning Routine",
    titleVi: "Thói quen buổi sáng",
    icon: "🌅",
    group: "Bản thân & Thói quen",
    groupId: 1,
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
    num: 3,
    titleEn: "Brushing My Teeth",
    titleVi: "Đánh răng sạch sẽ",
    icon: "🪥",
    group: "Bản thân & Thói quen",
    groupId: 1,
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
    num: 4,
    titleEn: "My Bedtime",
    titleVi: "Giờ đi ngủ của em",
    icon: "🛏️",
    group: "Bản thân & Thói quen",
    groupId: 1,
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

  // Page 2
  {
    num: 5,
    titleEn: "My Favorite Clothes",
    titleVi: "Trang phục em thích",
    icon: "👕",
    group: "Bản thân & Thói quen",
    groupId: 1,
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
    num: 6,
    titleEn: "Washing Hands",
    titleVi: "Rửa tay sạch sẽ",
    icon: "🧼",
    group: "Bản thân & Thói quen",
    groupId: 1,
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
    num: 7,
    titleEn: "My Birthday Party",
    titleVi: "Bữa tiệc sinh nhật",
    icon: "🎂",
    group: "Bản thân & Thói quen",
    groupId: 1,
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
    num: 8,
    titleEn: "Healthy Breakfast",
    titleVi: "Bữa sáng bổ dưỡng",
    icon: "🍳",
    group: "Bản thân & Thói quen",
    groupId: 1,
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
    num: 9,
    titleEn: "My Shoes",
    titleVi: "Đôi giày của em",
    icon: "👟",
    group: "Bản thân & Thói quen",
    groupId: 1,
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
    num: 10,
    titleEn: "Drinking Water",
    titleVi: "Uống đủ nước",
    icon: "💧",
    group: "Bản thân & Thói quen",
    groupId: 1,
    textEn: "Hello everyone. Today I talk about drinking clean water. Our bodies need water every single day. I always bring a water bottle to my school. Drinking fresh water keeps me cool, fresh, and active during the day.",
    textVi: "Xin chào mọi người. Hôm nay em nói về việc uống nước sạch. Cơ thể chúng ta cần nước mỗi ngày. Em luôn mang theo một bình nước đến trường. Uống nước mát giúp em sảng khoái, tươi tắn và năng động suốt cả ngày.",
    keywords: [
      { word: "water", meaning: "nước", ipa: "/ˈwɑː.t̬ɚ/", readVi: "oa-tơ" },
      { word: "bodies", meaning: "cơ thể", ipa: "/ˈbɑː.diz/", readVi: "ba-điz" },
      { word: "bottle", meaning: "bình nước", ipa: "/ˈbɑː.t̬əl/", readVi: "ba-tồ" },
      { word: "cool", meaning: "mát mẻ", ipa: "/kuːl/", readVi: "cu-l" },
      { word: "active", meaning: "năng động", ipa: "/ˈæk.tɪv/", readVi: "ác-típ" }
    ]
  }
];

console.log("Template ready. Next writing the full script for all 100 passages.");
