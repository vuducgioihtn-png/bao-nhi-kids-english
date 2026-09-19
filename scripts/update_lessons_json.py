import json, re

with open('curated_lexicon.json', 'r', encoding='utf-8') as f:
    lexicon = json.load(f)

with open('src/data/grade2_passages/lessons.json', 'r', encoding='utf-8') as f:
    lessons = json.load(f)

def clean_word(token: str) -> str:
    return token.lower().strip("'\".,!?;:()")

def process_sentence(sentence_en: str):
    # Match words (including internal hyphens and apostrophes) or punctuation
    raw_tokens = re.findall(r"[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*'?[a-zA-Z0-9]*|[.,!?;:]", sentence_en)
    ipa_tokens = []
    read_tokens = []

    for t in raw_tokens:
        if t in ['.', ',', '!', '?', ';', ':']:
            if read_tokens:
                read_tokens[-1] = read_tokens[-1] + t
            continue

        cw = clean_word(t)
        if cw in lexicon:
            ipa_val = lexicon[cw]['ipa'].strip('/')
            read_val = lexicon[cw]['readVi']
        elif '-' in cw:
            # Try splitting compound word if not found directly
            parts = cw.split('-')
            ipa_p = []
            read_p = []
            for p in parts:
                if p in lexicon:
                    ipa_p.append(lexicon[p]['ipa'].strip('/'))
                    read_p.append(lexicon[p]['readVi'])
                else:
                    ipa_p.append(p)
                    read_p.append(p)
            ipa_val = ' '.join(ipa_p)
            read_val = ' '.join(read_p)
        else:
            ipa_val = cw
            read_val = cw

        # Capitalize proper nouns like Vietnamese names and places
        if t[0].isupper() and (cw in ['nam', 'mai', 'lan', 'hoa', 'minh', 'linh', 'ha', 'an', 'bao', 'nhi', 'vietnam', 'vietnamese', 'hanoi', 'david', 'coco', 'mimi']):
            read_val = read_val.capitalize()

        ipa_tokens.append(ipa_val)
        read_tokens.append(read_val)

    final_ipa = '/' + ' '.join(ipa_tokens) + '/'
    final_read = ' '.join(read_tokens)
    if final_read:
        final_read = final_read[0].upper() + final_read[1:]

    return final_ipa, final_read

total_sentences = 0
total_keywords = 0
for l in lessons:
    for s in l.get('sentences', []):
        new_ipa, new_read = process_sentence(s['en'])
        s['ipa'] = new_ipa
        s['readVi'] = new_read
        total_sentences += 1

    for kw in l.get('keywords', []):
        cw = clean_word(kw['word'])
        if cw in lexicon:
            kw['ipa'] = lexicon[cw]['ipa']
            kw['readVi'] = lexicon[cw]['readVi']
        total_keywords += 1

with open('src/data/grade2_passages/lessons.json', 'w', encoding='utf-8') as f:
    json.dump(lessons, f, ensure_ascii=False, indent=2)

print(f"Successfully updated {len(lessons)} lessons ({total_sentences} sentences, {total_keywords} keywords).")
