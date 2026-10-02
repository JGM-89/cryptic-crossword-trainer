# 07 — Sources

What the Bible rests on, grouped by what each source supports. Chapters cite these inline.
Where a claim couldn't be verified, the chapter says so and treats it as a house rule. Two
attributions in audit 03 were corrected while writing chapter 01: the ENIGMA reviewers, and the
Listener "solve cold" page.

## Setters and editors: what a good clue is

- **Ximenes on the Art of the Crossword**, ch. 5 *Cluemanship* and ch. 7 *Improvised clues*:
  soundness, and the DAINTILY worked example (start from a scene, choose pieces to fit it).
  https://xotaotc.nfshost.com/chapter-5-cluemanship/ ·
  https://xotaotc.nfshost.com/chapter-7-improvised-clues/
- **Afrit**: "say what you mean". https://www.crosswordunclued.com/2010/05/afrits-armchair-crosswords.html
- **Alberich**: surface reading, the "search-engine test", cryptic definitions, tips for setters.
  https://xteddy.org/mirror/alberichcrosswords/www.alberichcrosswords.com/pages/surface.html ·
  https://xteddy.org/mirror/alberichcrosswords/www.alberichcrosswords.com/pages/crypdef.html ·
  https://www.alberich-crosswords.com/articles/tips-for-setters
- **Listener Crossword**: guidance for setters; vetters solve every submission cold.
  https://www.listenercrossword.com/HTML/Notes_S1.html · https://listenercrossword.com/HTML/Reference06.html
- **Crossword Unclued** (Shuchi): surface vs cryptic reading, camouflaging anagrams,
  lift-and-separate, the "on" device, reversals and their indicators, homophones, charades,
  definition by example, setter interviews (Roger Squires, Anax, Sarah Hayes).
  https://www.crosswordunclued.com/2009/06/surface-reading-cryptic-reading.html ·
  https://www.crosswordunclued.com/2009/11/camouflaging-anagrams.html ·
  https://www.crosswordunclued.com/2010/12/lift-and-separate.html ·
  https://www.crosswordunclued.com/2012/02/notorious-on-b-device.html ·
  https://www.crosswordunclued.com/2009/07/reversal-indicators.html ·
  https://www.crosswordunclued.com/2008/11/reversals.html ·
  https://www.crosswordunclued.com/2008/10/homophones.html ·
  https://www.crosswordunclued.com/2008/11/charades.html ·
  https://www.crosswordunclued.com/2010/06/definition-by-example.html ·
  https://www.crosswordunclued.com/p/interviews.html
- **Charlie Methven**, setting tips. https://charliemethven.com/tips
- **MyCrossword**, becoming a cryptic setter. https://www.mycrossword.co.uk/blog/becoming-a-cryptic-setter
- **Viresh Ratnakar**, cryptic grammar. https://viresh-ratnakar.codeberg.page/writings/2023/cryptic-grammar-04-2023.html
- **Anax at Big Dave's**. https://bigdave44.com/?p=6651
- **David Astle**, fond clues. https://davidastle.com/da-blog/fond-clues
- Wikipedia: *Cryptic crossword*, *Don Manley*, *Azed*.
  https://en.wikipedia.org/wiki/Cryptic_crossword
- Times Quick Cryptic editorial guidance (Jason Crampton, via Times for the Times): what makes
  clues easier or harder (par rubric). https://timesforthetimes.co.uk/?p=37168
- Minute Cryptic: par as a "crossword benchmark" (par rubric). https://minutecryptic.com/stats

## Computer-generated clues and how to evaluate them

- **Hardcastle**, ENIGMA PhD thesis (machine clue generation; experts rated 8–10 of 42 clues
  publishable). https://dwhardcastle.wordpress.com/wp-content/uploads/2016/02/hardcastle-phd.pdf ·
  https://www.crosswordunclued.com/2012/02/can-computer-program-write-cryptic.html
- **Cryptonite** (EMNLP 2021) and the Rozner et al. cryptic benchmark: LLMs as solvers.
  https://aclanthology.org/2021.emnlp-main.344/ · https://arxiv.org/abs/2104.08620 ·
  https://github.com/aviaefrat/cryptonite
- **Sadallah et al.**, "What makes cryptic crosswords challenging for LLMs?" (letter counting,
  over-guessing). https://arxiv.org/abs/2412.09012 · https://arxiv.org/abs/2403.12094v2 ·
  https://arxiv.org/html/2406.09043v3 · https://arxiv.org/abs/2506.04824
- **Judging creative work:** pairwise beats absolute scores; self-preference bias; position
  bias. TTCW https://arxiv.org/abs/2309.14556 · MT-Bench https://arxiv.org/abs/2306.05685 ·
  self-preference https://arxiv.org/abs/2404.13076 · LAMP https://arxiv.org/abs/2409.14509 ·
  EQ-Bench creative writing https://github.com/EQ-bench/creative-writing-bench ·
  New Yorker caption humour https://arxiv.org/abs/2406.10522
- **Puns and ambiguity:** AmbiPun https://arxiv.org/abs/2205.01825
- **Escaping LLM sameness:** verbalized sampling https://arxiv.org/abs/2510.01171

## Data the tools use (checking only; never shipped)

| Resource | Licence | Used for |
|---|---|---|
| George Ho's cryptic clue dataset (~660k clues) https://cryptics.georgeho.org/ · datasheet https://cryptics.georgeho.org/datasheet | Database ODbL; clue texts remain the publishers' copyright | Exam anchors, R-COPY, F-CHESTNUT, published indicator lists (`src/data/indicators/`) |
| Tatoeba English sentences https://tatoeba.org/ | CC-BY 2.0 FR | Hidden-word carriers in real sentences, word frequency for raw material |
| WordNet 3.1 (`wordnet-db`) | WordNet licence (permissive) | Definition evidence, senses, synonyms |
| Moby Thesaurus II (Project Gutenberg #3202) | Public domain | Definition evidence, cue words |

Considered and **not** used: Small World of Words (commercial use banned), Datamuse free tier
(non-commercial), MAGPIE idioms (https://aclanthology.org/2020.lrec-1.35) and Google Ngram
(https://books.google.com/ngrams) as possible future phrase sources.
