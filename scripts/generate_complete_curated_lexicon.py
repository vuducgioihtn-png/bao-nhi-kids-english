import json, re

with open('all_lesson_words.json', 'r', encoding='utf-8') as f:
    all_words = json.load(f)

with open('ipa_lookup_extracted.json', 'r', encoding='utf-8') as f:
    raw_ipas = json.load(f)

# Comprehensive curated pronunciation dictionary
BASE_DICT = {
    # Chào hỏi, xưng hô
    'hello': ('/həˈloʊ/', 'he-lâu'),
    'hi': ('/haɪ/', 'hai'),
    'goodbye': ('/ɡʊdˈbaɪ/', 'gút-bai'),
    'bye': ('/baɪ/', 'bai'),
    'please': ('/pliːz/', 'p-li-z'),
    'thank': ('/θæŋk/', 'thenh-k'),
    'thanks': ('/θæŋks/', 'thenh-k-s'),
    'welcome': ('/ˈwelkəm/', 'oen-cầm'),
    'sorry': ('/ˈsɑːri/', 'so-ri'),
    'yes': ('/jes/', 'dét-s'),
    'no': ('/noʊ/', 'nâu'),
    'everyone': ('/ˈevriwʌn/', 'e-vri-uăn'),
    'everybody': ('/ˈevribɑːdi/', 'e-vri-ba-đi'),
    'friend': ('/frend/', 'ph-ren-đ'),
    'friends': ('/frendz/', 'ph-ren-đ-z'),
    'friendly': ('/ˈfrendli/', 'ph-ren-đ-li'),
    'friendship': ('/ˈfrendʃɪp/', 'ph-ren-đ-xíp'),

    # Đại từ
    'i': ('/aɪ/', 'ai'),
    'you': ('/juː/', 'diu'),
    'he': ('/hiː/', 'hi'),
    'she': ('/ʃiː/', 'si'),
    'it': ('/ɪt/', 'ít'),
    'we': ('/wiː/', 'uy'),
    'they': ('/ðeɪ/', 'đây'),
    'me': ('/miː/', 'mi'),
    'him': ('/hɪm/', 'him'),
    'her': ('/hɜːr/', 'hơ'),
    'us': ('/ʌs/', 'ắt-s'),
    'them': ('/ðem/', 'đem'),
    'my': ('/maɪ/', 'mai'),
    'your': ('/jɔːr/', 'do'),
    'his': ('/hɪz/', 'hít-z'),
    'its': ('/ɪts/', 'ít-s'),
    'our': ('/ˈaʊər/', 'ao-ơ'),
    'their': ('/ðer/', 'đe-ơ'),
    'this': ('/ðɪs/', 'đít-s'),
    'that': ('/ðæt/', 'đét'),
    'these': ('/ðiːz/', 'đi-z'),
    'those': ('/ðoʊz/', 'đâu-z'),
    'here': ('/hɪr/', 'hia'),
    'there': ('/ðer/', 'đe-ơ'),
    'who': ('/huː/', 'hu'),
    'what': ('/wɒt/', 'oát'),
    'where': ('/wer/', 'oe'),
    'when': ('/wen/', 'oen'),
    'why': ('/waɪ/', 'oai'),
    'how': ('/haʊ/', 'hao'),
    'which': ('/wɪtʃ/', 'oít-ch'),

    # Đại từ phản thân
    'myself': ('/maɪˈself/', 'mai-seo-ph'),
    'yourself': ('/jɔːrˈself/', 'do-seo-ph'),
    'himself': ('/hɪmˈself/', 'him-seo-ph'),
    'herself': ('/hɜːrˈself/', 'hơ-seo-ph'),
    'itself': ('/ɪtˈself/', 'ít-seo-ph'),
    'ourselves': ('/aʊərˈselvz/', 'ao-seo-v-z'),
    'yourselves': ('/jɔːrˈselvz/', 'do-seo-v-z'),
    'themselves': ('/ðemˈselvz/', 'đem-seo-v-z'),

    # Mạo từ & Từ nối
    'the': ('/ðə/', 'đơ'),
    'a': ('/ə/', 'ơ'),
    'an': ('/ən/', 'ân'),
    'and': ('/ænd/', 'en-đ'),
    'in': ('/ɪn/', 'in'),
    'on': ('/ɑːn/', 'on'),
    'at': ('/æt/', 'ét'),
    'to': ('/tuː/', 'tu'),
    'for': ('/fɔːr/', 'pho'),
    'of': ('/ʌv/', 'ơ-v'),
    'with': ('/wɪð/', 'uýt-đ'),
    'from': ('/frʌm/', 'ph-răm'),
    'by': ('/baɪ/', 'bai'),
    'about': ('/əˈbaʊt/', 'ơ-bao-t'),
    'into': ('/ˈɪntuː/', 'in-tu'),
    'through': ('/θruː/', 'th-ru'),
    'across': ('/əˈkrɔːs/', 'ơ-c-rót-s'),
    'around': ('/əˈraʊnd/', 'ơ-rao-n-đ'),
    'over': ('/ˈoʊvər/', 'âu-vờ'),
    'under': ('/ˈʌndər/', 'ăn-đờ'),
    'up': ('/ʌp/', 'ắp'),
    'down': ('/daʊn/', 'đao-n'),
    'off': ('/ɔːf/', 'o-ph'),
    'between': ('/bɪˈtwiːn/', 'bi-t-uin'),
    'behind': ('/bɪˈhaɪnd/', 'bi-hain-đ'),
    'near': ('/nɪr/', 'nia'),
    'during': ('/ˈdʊrɪŋ/', 'đu-rinh'),
    'without': ('/wɪˈðaʊt/', 'uýt-đao-t'),
    'as': ('/æz/', 'át-z'),
    'so': ('/soʊ/', 'xâu'),
    'but': ('/bʌt/', 'bắt'),
    'or': ('/ɔːr/', 'o'),
    'if': ('/ɪf/', 'íp-ph'),
    'because': ('/bɪˈkɔːz/', 'bi-cơ-z'),
    'while': ('/waɪl/', 'oai-l'),
    'after': ('/ˈæftər/', 'áp-tơ'),
    'before': ('/bɪˈfɔːr/', 'bi-pho'),
    'then': ('/ðen/', 'đen'),
    'now': ('/naʊ/', 'nao'),
    'all': ('/ɔːl/', 'ool'),
    'every': ('/ˈevri/', 'e-vri'),
    'each': ('/iːtʃ/', 'ích'),
    'both': ('/boʊθ/', 'bôuth'),
    'some': ('/sʌm/', 'xăm'),
    'any': ('/ˈeni/', 'e-ni'),
    'many': ('/ˈmeni/', 'me-ni'),
    'much': ('/mʌtʃ/', 'mắt-ch'),
    'more': ('/mɔːr/', 'mo'),
    'most': ('/moʊst/', 'mâu-x-t'),
    'little': ('/ˈlɪtl/', 'lít-tồl'),
    'very': ('/ˈveri/', 've-ri'),
    'too': ('/tuː/', 'tu'),
    'also': ('/ˈɔːlsoʊ/', 'on-xâu'),
    'always': ('/ˈɔːlweɪz/', 'on-uây-z'),
    'often': ('/ˈɔːfn/', 'ó-phừn'),
    'sometimes': ('/ˈsʌmtaɪmz/', 'xăm-tai-m-z'),
    'never': ('/ˈnevər/', 'ne-vờ'),
    'together': ('/təˈɡeðər/', 'tơ-ge-đờ'),
    'again': ('/əˈɡen/', 'ơ-ghen'),
    'today': ('/təˈdeɪ/', 'tơ-đây'),
    'tomorrow': ('/təˈmɔːroʊ/', 'tơ-mo-râu'),
    'yesterday': ('/ˈjestərdeɪ/', 'dét-tơ-đây'),

    # Trợ động từ
    'am': ('/æm/', 'am'),
    'is': ('/ɪz/', 'i-z'),
    'are': ('/ɑːr/', 'a'),
    'was': ('/wɒz/', 'uót-z'),
    'were': ('/wɜːr/', 'uơ'),
    'be': ('/biː/', 'bi'),
    'been': ('/bɪn/', 'bin'),
    'being': ('/ˈbiːɪŋ/', 'bi-inh'),
    'do': ('/duː/', 'đu'),
    'does': ('/dʌz/', 'đắt-z'),
    'did': ('/dɪd/', 'đít'),
    'done': ('/dʌn/', 'đăn'),
    'have': ('/hæv/', 'he-v'),
    'has': ('/hæz/', 'hét-z'),
    'had': ('/hæd/', 'hét-đ'),
    'can': ('/kæn/', 'khen'),
    'could': ('/kʊd/', 'cu-đ'),
    'will': ('/wɪl/', 'uy-l'),
    'would': ('/wʊd/', 'u-đ'),
    'shall': ('/ʃæl/', 'seo-l'),
    'should': ('/ʃʊd/', 'su-đ'),
    'may': ('/meɪ/', 'mêi'),
    'might': ('/maɪt/', 'mai-t'),
    'must': ('/mʌst/', 'mắt-x-t'),

    # Rút gọn
    "it's": ('/ɪts/', 'ít-s'),
    "i'm": ('/aɪm/', 'aim'),
    "don't": ('/doʊnt/', 'đôun-t'),
    "can't": ('/kænt/', 'khen-t'),
    "we're": ('/wɪr/', 'uy-ơ'),
    "they're": ('/ðer/', 'đe-ơ'),
    "you're": ('/jɔːr/', 'do'),
    "that's": ('/ðæts/', 'đét-s'),
    "there's": ('/ðerz/', 'đe-ơ-z'),
    "he's": ('/hiːz/', 'hi-z'),
    "she's": ('/ʃiːz/', 'si-z'),
    "let's": ('/lets/', 'lét-s'),
    "what's": ('/wɒts/', 'oát-s'),
    "didn't": ('/ˈdɪdnt/', 'đít-đần-t'),
    "doesn't": ('/ˈdʌznt/', 'đắt-zần-t'),
    "isn't": ('/ˈɪznt/', 'i-zần-t'),
    "aren't": ('/ɑːrnt/', 'an-t'),
    "won't": ('/woʊnt/', 'uôn-t'),

    # Động từ thông dụng nhất trong 100 bài đọc
    'talk': ('/tɔːk/', 'thoóc'),
    'talks': ('/tɔːks/', 'thoóc-s'),
    'talked': ('/tɔːkt/', 'thoóc-t'),
    'talking': ('/ˈtɔːkɪŋ/', 'thoóc-kinh'),
    'speak': ('/spiːk/', 'x-píc'),
    'speaks': ('/spiːks/', 'x-píc-s'),
    'speaking': ('/ˈspiːkɪŋ/', 'x-pí-kinh'),
    'tell': ('/tel/', 'theo-l'),
    'share': ('/ʃer/', 'seo'),
    'shares': ('/ʃerz/', 'seo-z'),
    'sharing': ('/ˈʃerɪŋ/', 'se-rinh'),
    'shared': ('/ʃerd/', 'seo-đ'),
    'say': ('/seɪ/', 'xêi'),
    'says': ('/sez/', 'xét-z'),
    'said': ('/sed/', 'xét-đ'),
    'ask': ('/æsk/', 'át-x-k'),
    'asks': ('/æsks/', 'át-x-ks'),
    'asking': ('/ˈæskɪŋ/', 'át-x-kinh'),
    'asked': ('/æskt/', 'át-x-k-t'),
    'answer': ('/ˈænsər/', 'en-xờ'),
    'answers': ('/ˈænsərz/', 'en-xờ-z'),
    'like': ('/laɪk/', 'lai-k'),
    'likes': ('/laɪks/', 'lai-k-s'),
    'liked': ('/laɪkt/', 'lai-k-t'),
    'liking': ('/ˈlaɪkɪŋ/', 'lai-kinh'),
    'love': ('/lʌv/', 'lớp-v'),
    'loves': ('/lʌvz/', 'lớp-v-z'),
    'loving': ('/ˈlʌvɪŋ/', 'lắp-vinh'),
    'loved': ('/lʌvd/', 'lớp-v-đ'),
    'want': ('/wɑːnt/', 'ua-n-t'),
    'wants': ('/wɑːnts/', 'ua-n-t-s'),
    'wanted': ('/ˈwɑːntɪd/', 'ua-n-tịt-đ'),
    'need': ('/niːd/', 'nit-đ'),
    'needs': ('/niːdz/', 'nit-đ-z'),
    'needed': ('/ˈniːdɪd/', 'ni-địt-đ'),
    'live': ('/lɪv/', 'li-v'),
    'lives': ('/lɪvz/', 'li-v-z'),
    'living': ('/ˈlɪvɪŋ/', 'li-vinh'),
    'lived': ('/lɪvd/', 'li-v-đ'),
    'name': ('/neɪm/', 'nêm'),
    'names': ('/neɪmz/', 'nêm-z'),
    'meet': ('/miːt/', 'mít'),
    'meets': ('/miːts/', 'mít-s'),
    'meeting': ('/ˈmiːtɪŋ/', 'mí-tinh'),
    'see': ('/siː/', 'si'),
    'sees': ('/siːz/', 'si-z'),
    'seeing': ('/ˈsiːɪŋ/', 'si-inh'),
    'saw': ('/sɔː/', 'so'),
    'look': ('/lʊk/', 'lúc-k'),
    'looks': ('/lʊks/', 'lúc-ks'),
    'looking': ('/ˈlʊkɪŋ/', 'lúc-kinh'),
    'looked': ('/lʊkt/', 'lúc-t'),
    'play': ('/pleɪ/', 'p-lây'),
    'plays': ('/pleɪz/', 'p-lây-z'),
    'playing': ('/ˈpleɪɪŋ/', 'p-lây-inh'),
    'played': ('/pleɪd/', 'p-lây-đ'),
    'help': ('/help/', 'heo-p'),
    'helps': ('/helps/', 'heo-p-s'),
    'helping': ('/ˈhelpɪŋ/', 'heo-pinh'),
    'helped': ('/helpt/', 'heo-p-t'),
    'helpful': ('/ˈhelpfl/', 'heo-p-phồl'),
    'clean': ('/kliːn/', 'c-lin'),
    'cleans': ('/kliːnz/', 'c-lin-z'),
    'cleaning': ('/ˈkliːnɪŋ/', 'c-li-ninh'),
    'cleaned': ('/kliːnd/', 'c-lin-đ'),
    'wash': ('/wɒʃ/', 'uót-sh'),
    'washes': ('/ˈwɒʃɪz/', 'uót-sịt-z'),
    'washing': ('/ˈwɒʃɪŋ/', 'uót-sinh'),
    'washed': ('/wɒʃt/', 'uót-sh-t'),
    'brush': ('/brʌʃ/', 'b-rắt-sh'),
    'brushes': ('/ˈbrʌʃɪz/', 'b-rắt-sịt-z'),
    'brushing': ('/ˈbrʌʃɪŋ/', 'b-rắt-sinh'),
    'brushed': ('/brʌʃt/', 'b-rắt-sh-t'),
    'wake': ('/weɪk/', 'uêi-k'),
    'wakes': ('/weɪks/', 'uêi-k-s'),
    'waking': ('/ˈweɪkɪŋ/', 'uêi-kinh'),
    'woke': ('/woʊk/', 'uâu-k'),
    'sleep': ('/sliːp/', 'x-líp'),
    'sleeps': ('/sliːps/', 'x-líp-s'),
    'sleeping': ('/ˈsliːpɪŋ/', 'x-lí-pinh'),
    'slept': ('/slept/', 'x-lép-t'),
    'eat': ('/iːt/', 'ít'),
    'eats': ('/iːts/', 'ít-s'),
    'eating': ('/ˈiːtɪŋ/', 'í-tinh'),
    'ate': ('/eɪt/', 'êi-t'),
    'drink': ('/drɪŋk/', 'đ-rinh-k'),
    'drinks': ('/drɪŋks/', 'đ-rinh-ks'),
    'drinking': ('/ˈdrɪŋkɪŋ/', 'đ-rinh-kinh'),
    'drank': ('/dræŋk/', 'đ-renh-k'),
    'read': ('/riːd/', 'rit-đ'),
    'reads': ('/riːdz/', 'rit-đ-z'),
    'reading': ('/ˈriːdɪŋ/', 'ri-đinh'),
    'write': ('/raɪt/', 'rai-t'),
    'writes': ('/raɪts/', 'rai-t-s'),
    'writing': ('/ˈraɪtɪŋ/', 'rai-tinh'),
    'draw': ('/drɔː/', 'đ-ro'),
    'draws': ('/drɔːz/', 'đ-ro-z'),
    'drawing': ('/ˈdrɔːɪŋ/', 'đ-ro-inh'),
    'drew': ('/druː/', 'đ-ru'),
    'sing': ('/sɪŋ/', 'xinh'),
    'sings': ('/sɪŋz/', 'xinh-z'),
    'singing': ('/ˈsɪŋɪŋ/', 'xinh-inh'),
    'run': ('/rʌn/', 'răn'),
    'runs': ('/rʌnz/', 'răn-z'),
    'running': ('/ˈrʌnɪŋ/', 'răn-ninh'),
    'ran': ('/ræn/', 'ren'),
    'walk': ('/wɔːk/', 'uoóc'),
    'walks': ('/wɔːks/', 'uoóc-s'),
    'walking': ('/ˈwɔːkɪŋ/', 'uoóc-kinh'),
    'walked': ('/wɔːkt/', 'uoóc-t'),
    'jump': ('/dʒʌmp/', 'chăm-p'),
    'jumps': ('/dʒʌmps/', 'chăm-p-s'),
    'jumping': ('/ˈdʒʌmpɪŋ/', 'chăm-pinh'),
    'make': ('/meɪk/', 'mêi-k'),
    'makes': ('/meɪks/', 'mêi-k-s'),
    'making': ('/ˈmeɪkɪŋ/', 'mêi-kinh'),
    'made': ('/meɪd/', 'mêi-đ'),
    'take': ('/teɪk/', 'thêi-k'),
    'takes': ('/teɪks/', 'thêi-k-s'),
    'taking': ('/ˈteɪkɪŋ/', 'thêi-kinh'),
    'took': ('/tʊk/', 'thúc-k'),
    'give': ('/ɡɪv/', 'gíp-v'),
    'gives': ('/ɡɪvz/', 'gíp-v-z'),
    'giving': ('/ˈɡɪvɪŋ/', 'gi-vinh'),
    'gave': ('/ɡeɪv/', 'gêi-v'),
    'keep': ('/kiːp/', 'kíp'),
    'keeps': ('/kiːps/', 'kíp-s'),
    'keeping': ('/ˈkiːpɪŋ/', 'kí-pinh'),
    'bring': ('/brɪŋ/', 'b-rinh'),
    'brings': ('/brɪŋz/', 'b-rinh-z'),
    'bringing': ('/ˈbrɪŋɪŋ/', 'b-rinh-inh'),
    'brought': ('/brɔːt/', 'b-root'),
    'learn': ('/lɜːrn/', 'lơn'),
    'learns': ('/lɜːrnz/', 'lơn-z'),
    'learning': ('/ˈlɜːrnɪŋ/', 'lơ-ninh'),
    'learned': ('/lɜːrnd/', 'lơn-đ'),
    'teach': ('/tiːtʃ/', 'tí-ch'),
    'teaches': ('/ˈtiːtʃɪz/', 'tí-chịt-z'),
    'teaching': ('/ˈtiːtʃɪŋ/', 'tí-chinh'),
    'taught': ('/tɔːt/', 'thoot'),
    'listen': ('/ˈlɪsn/', 'lít-sừn'),
    'listens': ('/ˈlɪsnz/', 'lít-sừn-z'),
    'listening': ('/ˈlɪsnɪŋ/', 'lít-sừ-ninh'),
    'grow': ('/ɡroʊ/', 'g-râu'),
    'grows': ('/ɡroʊz/', 'g-râu-z'),
    'growing': ('/ˈɡroʊɪŋ/', 'g-râu-inh'),
    'start': ('/stɑːrt/', 'x-tát'),
    'starts': ('/stɑːrts/', 'x-tát-s'),
    'starting': ('/ˈstɑːrtɪŋ/', 'x-tá-tinh'),
    'stay': ('/steɪ/', 'x-tây'),
    'stays': ('/steɪz/', 'x-tây-z'),
    'staying': ('/ˈsteɪɪŋ/', 'x-tây-inh'),
    'stop': ('/stɑːp/', 'x-tóp'),
    'stops': ('/stɑːps/', 'x-tóp-s'),
    'put': ('/pʊt/', 'phút'),
    'puts': ('/pʊts/', 'phút-s'),
    'putting': ('/ˈpʊtɪŋ/', 'phú-tinh'),
    'turn': ('/tɜːrn/', 'tơ-n'),
    'turns': ('/tɜːrnz/', 'tơ-n-z'),
    'turning': ('/ˈtɜːrnɪŋ/', 'tơ-ninh'),
    'turned': ('/tɜːrnd/', 'tơ-n-đ'),
    'work': ('/wɜːrk/', 'uớc-k'),
    'works': ('/wɜːrks/', 'uớc-ks'),
    'working': ('/ˈwɜːrkɪŋ/', 'uớc-kinh'),
    'worked': ('/wɜːrkt/', 'uớc-t'),
    'practice': ('/ˈpræktɪs/', 'p-réc-tít-s'),
    'practices': ('/ˈpræktɪsɪz/', 'p-réc-tít-sịt-z'),
    'practicing': ('/ˈpræktɪsɪŋ/', 'p-réc-tí-sinh'),
    'protect': ('/prəˈtekt/', 'p-rơ-tếch-t'),
    'protects': ('/prəˈtekts/', 'p-rơ-tếch-t-s'),
    'protecting': ('/prəˈtektɪŋ/', 'p-rơ-tếch-tinh'),
    'preserve': ('/prɪˈzɜːrv/', 'p-ri-zơ-v'),
    'preserves': ('/prɪˈzɜːrvz/', 'p-ri-zơ-v-z'),
    'preserving': ('/prɪˈzɜːrvɪŋ/', 'p-ri-zơ-vinh'),
    'achieve': ('/əˈtʃiːv/', 'ơ-chí-v'),
    'achieves': ('/əˈtʃiːvz/', 'ơ-chí-v-z'),
    'achieving': ('/əˈtʃiːvɪŋ/', 'ơ-chí-vinh'),

    # Đồ vật, trường học, gia đình
    'school': ('/skuːl/', 'x-cu-l'),
    'schools': ('/skuːlz/', 'x-cu-l-z'),
    'classroom': ('/ˈklæsruːm/', 'c-lát-s-rum'),
    'teacher': ('/ˈtiːtʃər/', 'tí-chờ'),
    'teachers': ('/ˈtiːtʃərz/', 'tí-chờ-z'),
    'student': ('/ˈstuːdnt/', 'x-tiu-đần-t'),
    'students': ('/ˈstuːdnts/', 'x-tiu-đần-t-s'),
    'book': ('/bʊk/', 'búc-k'),
    'books': ('/bʊks/', 'búc-ks'),
    'pencil': ('/ˈpensl/', 'phen-xồl'),
    'pencils': ('/ˈpenslz/', 'phen-xồl-z'),
    'pen': ('/pen/', 'phen'),
    'pens': ('/penz/', 'phen-z'),
    'bag': ('/bæɡ/', 'béc-g'),
    'backpack': ('/ˈbækpæk/', 'béc-k-péc-k'),
    'uniform': ('/ˈjuːnɪfɔːrm/', 'iu-ni-phom'),
    'uniforms': ('/ˈjuːnɪfɔːrmz/', 'iu-ni-phom-z'),
    'desk': ('/desk/', 'đét-x-k'),
    'chair': ('/tʃer/', 'cheo'),
    'table': ('/ˈteɪbl/', 'thê-bồl'),
    'lesson': ('/ˈlesn/', 'le-sừn'),
    'family': ('/ˈfæməli/', 'fe-mơ-li'),
    'father': ('/ˈfɑːðər/', 'pha-đờ'),
    'mother': ('/ˈmʌðər/', 'mă-đờ'),
    'brother': ('/ˈbrʌðər/', 'b-ră-đờ'),
    'sister': ('/ˈsɪstər/', 'xít-x-tờ'),
    'baby': ('/ˈbeɪbi/', 'bê-bi'),
    'grandpa': ('/ˈɡrænpɑː/', 'g-ren-pha'),
    'grandma': ('/ˈɡrænmɑː/', 'g-ren-ma'),
    'home': ('/hoʊm/', 'hôm'),
    'house': ('/haʊs/', 'hao-s'),
    'room': ('/ruːm/', 'rum'),
    'bedroom': ('/ˈbedruːm/', 'bét-đ-rum'),
    'kitchen': ('/ˈkɪtʃɪn/', 'kít-chừn'),
    'garden': ('/ˈɡɑːrdn/', 'ga-đần'),
    'cozy': ('/ˈkoʊzi/', 'câu-zi'),
    'water': ('/ˈwɔːtər/', 'ua-tờ'),
    'bottle': ('/ˈbɑːtl/', 'ba-tồl'),
    'faucet': ('/ˈfɔːsɪt/', 'pho-xịt'),
    'teeth': ('/tiːθ/', 'tith'),
    'face': ('/feɪs/', 'phêi-s'),
    'hand': ('/hænd/', 'hen-đ'),
    'hands': ('/hændz/', 'hen-đ-z'),
    'body': ('/ˈbɑːdi/', 'ba-đi'),
    'bodies': ('/ˈbɑːdiz/', 'ba-đi-z'),
    'routine': ('/ruːˈtiːn/', 'ru-tin'),
    'breakfast': ('/ˈbrekfəst/', 'b-réc-phớt-s'),
    'lunch': ('/lʌntʃ/', 'lăn-ch'),
    'dinner': ('/ˈdɪnər/', 'đi-nờ'),
    'food': ('/fuːd/', 'phu-đ'),
    'fruit': ('/fruːt/', 'ph-rut'),
    'fruits': ('/fruːts/', 'ph-rut-s'),
    'apple': ('/ˈæpl/', 'áp-pồl'),
    'banana': ('/bəˈnænə/', 'bơ-ne-nơ'),
    'milk': ('/mɪlk/', 'miu-k'),
    'bread': ('/bred/', 'b-rét-đ'),
    'rice': ('/raɪs/', 'rai-s'),

    # Màu sắc
    'color': ('/ˈkʌlər/', 'ca-lờ'),
    'colors': ('/ˈkʌlərz/', 'ca-lờ-z'),
    'favorite': ('/ˈfeɪvərɪt/', 'phây-vơ-rịt'),
    'blue': ('/bluː/', 'blu'),
    'red': ('/red/', 'rét-đ'),
    'green': ('/ɡriːn/', 'g-rin'),
    'yellow': ('/ˈjeloʊ/', 'de-lâu'),
    'white': ('/waɪt/', 'oai-t'),
    'black': ('/blæk/', 'b-léc-k'),
    'pink': ('/pɪŋk/', 'phinh-k'),
    'purple': ('/ˈpɜːrpl/', 'pơ-pồl'),
    'brown': ('/braʊn/', 'b-rao-n'),
    'gray': ('/ɡreɪ/', 'g-rêi'),
    'bright': ('/braɪt/', 'b-rai-t'),

    # Số & Thời gian
    'one': ('/wʌn/', 'uăn'),
    'two': ('/tuː/', 'tu'),
    'three': ('/θriː/', 'th-ri'),
    'four': ('/fɔːr/', 'pho'),
    'five': ('/faɪv/', 'phai-v'),
    'six': ('/sɪks/', 'xíc-s'),
    'seven': ('/ˈsevən/', 'se-vừn'),
    'eight': ('/eɪt/', 'êi-t'),
    'nine': ('/naɪn/', 'nai-n'),
    'ten': ('/ten/', 'then'),
    'first': ('/fɜːrst/', 'phơ-x-t'),
    'second': ('/ˈsekənd/', 'xe-cần-đ'),
    'third': ('/θɜːrd/', 'thơ-đ'),
    'single': ('/ˈsɪŋɡl/', 'xinh-gồl'),
    'years': ('/jɪrz/', 'diơ-z'),
    'year': ('/jɪr/', 'diơ'),
    'old': ('/oʊld/', 'âu-l-đ'),
    'day': ('/deɪ/', 'đây'),
    'days': ('/deɪz/', 'đây-z'),
    'time': ('/taɪm/', 'tai-m'),
    'morning': ('/ˈmɔːrnɪŋ/', 'mo-ninh'),
    'afternoon': ('/ˌæftərˈnuːn/', 'áp-tơ-nun'),
    'evening': ('/ˈiːvnɪŋ/', 'íp-v-ninh'),
    'night': ('/naɪt/', 'nai-t'),
    'bedtime': ('/ˈbedtaɪm/', 'bét-đ-tai-m'),
    'clock': ('/klɑːk/', 'c-lóc-k'),
    'oclock': ('/əˈklɑːk/', 'âu-c-lóc-k'),
    "o'clock": ('/əˈklɑːk/', 'âu-c-lóc-k'),
    'early': ('/ˈɜːrli/', 'ơ-li'),

    # Tính từ & Danh từ quan trọng
    'happy': ('/ˈhæpi/', 'hép-pi'),
    'warm': ('/wɔːrm/', 'uo-m'),
    'cool': ('/kuːl/', 'cu-l'),
    'fresh': ('/freʃ/', 'ph-rét-sh'),
    'hard': ('/hɑːrd/', 'ha-đ'),
    'great': ('/ɡreɪt/', 'g-rêi-t'),
    'good': ('/ɡʊd/', 'gút-đ'),
    'wonderful': ('/ˈwʌndərfl/', 'uăn-đơ-phồl'),
    'beautiful': ('/ˈbjuːtɪfl/', 'biu-ti-phồl'),
    'important': ('/ɪmˈpɔːrtnt/', 'im-po-tần-t'),
    'precious': ('/ˈpreʃəs/', 'p-re-sợt-s'),
    'exciting': ('/ɪkˈsaɪtɪŋ/', 'íc-xai-tinh'),
    'small': ('/smɔːl/', 'x-mool'),
    'new': ('/nuː/', 'niu'),
    'carefully': ('/ˈkerfəli/', 'khe-phơ-li'),
    'tightly': ('/ˈtaɪtli/', 'tai-t-li'),
    'success': ('/səkˈses/', 'xơ-k-xét-s'),
    'key': ('/kiː/', 'khi'),
    'keys': ('/kiːz/', 'khi-z'),
    'step': ('/step/', 'x-tép'),
    'dream': ('/driːm/', 'đ-rim'),
    'dreams': ('/driːmz/', 'đ-rim-z'),
    'thing': ('/θɪŋ/', 'thinh'),
    'things': ('/θɪŋz/', 'thinh-z'),
    'closer': ('/ˈkloʊsər/', 'c-lâu-xờ'),
    'sun': ('/sʌn/', 'xăn'),
    'tree': ('/triː/', 't-ri'),
    'trees': ('/triːz/', 't-ri-z'),
    'flower': ('/ˈflaʊər/', 'ph-lao-ơ'),
    'flowers': ('/ˈflaʊərz/', 'ph-lao-ơ-z'),
    'creature': ('/ˈkriːtʃər/', 'c-ri-chờ'),
    'creatures': ('/ˈkriːtʃərz/', 'c-ri-chờ-z'),
    'shoes': ('/ʃuːz/', 'su-z'),
    'shoe': ('/ʃuː/', 'su'),

    # Tên riêng
    'nam': ('/næm/', 'Nam'),
    'mai': ('/maɪ/', 'Mai'),
    'lan': ('/læn/', 'Lan'),
    'hoa': ('/hwɑː/', 'Hoa'),
    'minh': ('/mɪn/', 'Minh'),
    'linh': ('/lɪn/', 'Linh'),
    'ha': ('/hɑː/', 'Hà'),
    'an': ('/æn/', 'An'),
    'bao': ('/baʊ/', 'Bảo'),
    'nhi': ('/niː/', 'Nhi'),
    'vietnam': ('/ˌvjetˈnæm/', 'Việt Nam'),
    'vietnamese': ('/ˌvjetnəˈmiːz/', 'Việt-na-mi-z'),
    'hanoi': ('/ˌhɑːˈnɔɪ/', 'Hà Nội'),
}

def clean_token(token: str) -> str:
    return token.lower().strip("'\".,!?;:")

def normalize_ipa(raw_ipa: str) -> str:
    s = raw_ipa.strip('/')
    s = s.replace('ɫ', 'l')
    s = s.replace('ɹ', 'r')
    s = s.replace('ɝ', 'ɜːr')
    s = s.replace('ɚ', 'ər')
    s = s.replace('ɛ', 'e')
    s = s.replace('ɑ', 'ɑː')
    s = s.replace('ɔ', 'ɔː')
    s = s.replace('ɪ', 'ɪ')
    s = s.replace('æ', 'æ')
    s = s.replace('ʊ', 'ʊ')
    s = s.replace('ɡ', 'g')
    s = re.sub(r'([iu])(?![ː])', r'\1ː', s)
    s = s.replace('iːr', 'ɪr')
    s = s.replace('uːr', 'ʊr')
    s = s.replace('ːː', 'ː')
    return '/' + s + '/'

def get_word_reading(w: str, raw_ipa: str) -> str:
    if w in BASE_DICT:
        return BASE_DICT[w][1]

    # Handle standard plurals / 3rd person singular
    if w.endswith('s') and len(w) > 3:
        base = w[:-2] if w.endswith('es') else w[:-1]
        if base in BASE_DICT:
            base_read = BASE_DICT[base][1]
            is_v = base.endswith(('b','d','g','l','m','n','r','v','w','y','e','o','a','i','u'))
            return f"{base_read}-z" if is_v else f"{base_read}-s"

    if w.endswith('ed') and len(w) > 4:
        base = w[:-2]
        if base in BASE_DICT:
            return f"{BASE_DICT[base][1]}-đ"

    if w.endswith('ing') and len(w) > 4:
        base = w[:-3]
        if base in BASE_DICT:
            return f"{BASE_DICT[base][1]}-inh"

    if w.endswith('ly') and len(w) > 3:
        base = w[:-2]
        if base in BASE_DICT:
            return f"{BASE_DICT[base][1]}-li"

    # Conversion from IPA
    s = raw_ipa.strip('/').replace('ˈ', '').replace('ˌ', '')
    s = re.sub(r'sp', 'x-p-', s)
    s = re.sub(r'st', 'x-t-', s)
    s = re.sub(r'sk', 'x-k-', s)
    s = re.sub(r'sm', 'x-m-', s)
    s = re.sub(r'sn', 'x-n-', s)
    s = re.sub(r'sl', 'x-l-', s)
    s = re.sub(r'sw', 'x-u-', s)
    s = re.sub(r'bl', 'b-l-', s)
    s = re.sub(r'br', 'b-r-', s)
    s = re.sub(r'cl|kl', 'c-l-', s)
    s = re.sub(r'cr|kr', 'c-r-', s)
    s = re.sub(r'dr', 'đ-r-', s)
    s = re.sub(r'tr', 't-r-', s)
    s = re.sub(r'fl', 'ph-l-', s)
    s = re.sub(r'fr', 'ph-r-', s)
    s = re.sub(r'gl', 'g-l-', s)
    s = re.sub(r'gr', 'g-r-', s)
    s = re.sub(r'pl', 'p-l-', s)
    s = re.sub(r'pr', 'p-r-', s)

    s = re.sub(r'aɪ', 'ai', s)
    s = re.sub(r'aʊ', 'ao', s)
    s = re.sub(r'ɔɪ', 'oi', s)
    s = re.sub(r'eɪ', 'êi', s)
    s = re.sub(r'oʊ', 'âu', s)
    s = re.sub(r'ju', 'iu', s)
    s = re.sub(r'i|iː', 'i', s)
    s = re.sub(r'ɪ', 'i', s)
    s = re.sub(r'e|ɛ', 'e', s)
    s = re.sub(r'æ', 'e', s)
    s = re.sub(r'ɑ|ɑː', 'a', s)
    s = re.sub(r'ɔ|ɔː', 'o', s)
    s = re.sub(r'ʊ', 'u', s)
    s = re.sub(r'u|uː', 'u', s)
    s = re.sub(r'ʌ', 'ă', s)
    s = re.sub(r'ɝ|ɜːr|ɚ|ər', 'ơ', s)
    s = re.sub(r'ə', 'ơ', s)

    s = re.sub(r'ɛɫf|elf', 'seo-ph', s)
    s = re.sub(r'ɫ$', '-l', s)
    s = re.sub(r'l$', '-l', s)
    s = re.sub(r'θ$', 'th', s)
    s = re.sub(r'tʃ', 'ch', s)
    s = re.sub(r'dʒ', 'ch', s)
    s = re.sub(r'ʃ', 'sh', s)
    s = re.sub(r'ŋ', 'nh', s)
    s = re.sub(r'ð', 'đ', s)
    s = re.sub(r'θ', 'th', s)
    s = re.sub(r'ɹ|r', 'r', s)
    s = re.sub(r'ɫ', 'l', s)
    s = re.sub(r'ɡ', 'g', s)

    s = re.sub(r'-+', '-', s).strip('-')
    return s if s else w

# Build master lexicon
MASTER_LEXICON = {}
for w in all_words:
    clean = clean_token(w)
    if not clean:
        continue
    if clean in BASE_DICT:
        MASTER_LEXICON[clean] = {
            'ipa': BASE_DICT[clean][0],
            'readVi': BASE_DICT[clean][1]
        }
    elif clean in raw_ipas:
        raw = raw_ipas[clean]
        MASTER_LEXICON[clean] = {
            'ipa': normalize_ipa(raw),
            'readVi': get_word_reading(clean, raw)
        }
    else:
        MASTER_LEXICON[clean] = {
            'ipa': f'/{clean}/',
            'readVi': clean
        }

with open('curated_lexicon.json', 'w', encoding='utf-8') as f:
    json.dump(MASTER_LEXICON, f, ensure_ascii=False, indent=2)

print(f"Master lexicon built with {len(MASTER_LEXICON)} words.")
