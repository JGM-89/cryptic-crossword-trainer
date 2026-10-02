# Audit 03: Surface research playbook

*Outward-looking research, 2026-10-02. Scope: how expert setters build surfaces, what is known about machine-made cryptic clues and how to judge them, what resources could be plugged in, and the 8–12 pipeline changes that would most improve Cruci's surfaces. I read `.claude/skills/clue-writer/SKILL.md`, `docs/clue-style.md` and `docs/clue-pipeline.md` first.*

## Verdict in one paragraph

Cruci's rules already cover the bad things a surface can do. The mechanical gate, orphan lint, blind realism majority and ceiling panel all filter out bad surfaces. The gap is on the **generative side**. Experts don't get great surfaces by filtering. They get them by (a) choosing, out of many possible synonyms, abbreviations and indicators, the ones that **share a subject area** so that the clue paints one scene, and (b) using **words with two real meanings**, so that the surface sense and the cryptic sense pull apart. The only serious computer clue generator (Hardcastle's ENIGMA) found the same thing: what made human clues recognisably human was that their parts were connected. On evaluation, the literature says absolute 1–5 scores from an LLM judge are the weakest signal available. LLM judges correlate poorly with experts on creative quality, and they prefer their own model's output. Comparing candidates in pairs, and anchoring against real published clues, does much better. The recommendations below follow from these two findings.

---

## 1. How expert setters build surfaces

**1.1 Picture first, then fit the parts to it ("the story principle").** Alberich says a clue that calls up no picture is unsatisfactory even when the grammar is perfect. He wants a "mini-story" and an imaginable situation ([Alberich, surface reading](https://xteddy.org/mirror/alberichcrosswords/www.alberichcrosswords.com/pages/surface.html)). The best record of the process is Ximenes's own account (Macnutt 1966) of clueing DAINTILY, quoted in Hardcastle's thesis. He starts from CHAR as a cleaning lady. He asks what a char would do with a tin (throw it in the bin), and that gives "messy tin". Then he decides that the char *holds* the tin. The result is *"Char holds messy tin delicately."* Every word was chosen **because it belonged to the char's world**, not only because it had the right letters ([Hardcastle PhD, ch. 1](https://dwhardcastle.wordpress.com/wp-content/uploads/2016/02/hardcastle-phd.pdf)). Charlie Methven makes the same point with "naughty sailor ate most of ripe bananas": the story is plausible because sailors really do eat bananas ([Methven, tips](https://charliemethven.com/tips)).

**1.2 Pick synonyms for their shared subject area, not just their meaning.** Hardcastle examined a published clue in which RIM is defined as *border*, next to *Eastern*, *Muslim* and *ruler*. Verge, brink, margin and lip would all have been valid. *Border* won because it shares a subject with the rest of the clue. ENIGMA scored these "thematic association" links from co-occurrence in the British National Corpus (BNC) ([thesis, ch. 3](https://dwhardcastle.wordpress.com/wp-content/uploads/2016/02/hardcastle-phd.pdf)). In the Turing-style test, subjects said they spotted the human clues because their parts had "semantic connection" and "relationships" between the first and second halves, and could "paint a picture that has its own internal logic".

**1.3 Choose an indicator that belongs with its fodder.** Alberich recommends anagram indicators that have "some surface connection with the anagram fodder" ([Alberich, tips for setters](https://www.alberich-crosswords.com/articles/tips-for-setters)). Methven's example is "trained" next to "pet" ([Methven](https://charliemethven.com/tips)). Indicators are a large pool of words with a common job. The craft is to pick the one that fits the scene, not the stock one.

**1.4 Use words that really have two meanings.** Ximenes advises using words with several accepted meanings, not rare or forced senses. He also recommends hiding the part of speech and leaving out punctuation between the parts ([Ximenes, ch. 5 "Cluemanship"](https://xotaotc.nfshost.com/chapter-5-cluemanship/)). The standard deceptive words are flower → river, number → anaesthetic, banker → river, butter → goat ([Alberich, cryptic definitions](https://xteddy.org/mirror/alberichcrosswords/www.alberichcrosswords.com/pages/crypdef.html); [Macquarie](https://www.macquariedictionary.com.au/cryptic-crosswords/)). Roger Squires (Rufus) compares this to his stage magic: misdirection that surprises solvers into a smile ([interview](http://www.crosswordunclued.com/2011/11/interview-roger-squires.html)).

**1.5 Lift and separate.** The strongest surfaces run the definition and the wordplay together into one compound phrase that the solver has to pull apart by force. Examples: *Welsh rabbit* split as Welsh + rabbit (CHINWAG); *treasure chest* split as treasure + chest (THORAX). Mark Goodliffe coined the term ([Crossword Unclued, lift and separate](https://www.crosswordunclued.com/2010/12/lift-and-separate.html)).

**1.6 Capitals, apostrophes and punctuation.** Adding a misleading capital is fair; dropping a capital from a proper noun is not. A **'s** can be read three ways: possessive, *is* or *has*. Using that is a cheap, legitimate source of misdirection ([Alberich tips](https://www.alberich-crosswords.com/articles/tips-for-setters)). Punctuation can be left out to protect the surface. Punctuation that breaks the true sense should not be added ([Ximenes ch. 5](https://xotaotc.nfshost.com/chapter-5-cluemanship/)).

**1.7 Definition first, or a hook first. Both are used.** Alberich decides the definition before the wordplay, because definitions are few and wordplay options are many ([tips](https://www.alberich-crosswords.com/articles/tips-for-setters)). Anax works the other way: he scans an answer for "hooks" (promising letter patterns) and writes the clue the moment one appears ([Big Dave interview](https://bigdave44.com/?p=6651); [Crossword Unclued interview](http://www.crosswordunclued.com/2011/07/interview-anax.html)). Both agree that the best clues come from wrestling with hard answers, not from accepting the first construction.

**1.8 Tests and polish.** Alberich's search-engine test: paste the surface into a search engine. If the phrasing appears nowhere in prose or journalism, the surface is probably incoherent ([Alberich surface](https://xteddy.org/mirror/alberichcrosswords/www.alberichcrosswords.com/pages/surface.html)). Viresh Ratnakar's placeholder test checks the cryptic grammar; Cruci already uses it ([Ratnakar](https://viresh-ratnakar.codeberg.page/writings/2023/cryptic-grammar-04-2023.html)). Sarah Hayes (Arachne) goes back over every surface until it is as good as it can be ([interview](http://www.crosswordunclued.com/2013/02/interview-sarah-hayes.html)). Rufus kept an index of 200,000 past clues so that he could avoid repeats and combine old ideas in new ways ([interview](http://www.crosswordunclued.com/2011/11/interview-roger-squires.html)).

**1.9 Things to avoid.** Grim or offensive scenes, and exclamation marks used to excuse nonsense ([Alberich surface](https://xteddy.org/mirror/alberichcrosswords/www.alberichcrosswords.com/pages/surface.html)). Padding such as "Sarah" in "Sarah Jessica Parker's hat" ([MyCrossword](https://www.mycrossword.co.uk/blog/becoming-a-cryptic-setter)).

---

## 2. What is known about computer-made cryptic clues and how to judge them

**Generation.** ENIGMA (Hardcastle, Birkbeck PhD; [ACL W07-2323](https://aclanthology.org/W07-2323.xml)) is the only substantial clue *generator* in the literature. It produced the puzzle reading and the surface reading together. It checked that word combinations made sense against dependency data mined from the BNC, and it scored subject-area association between word pairs. Results:

- In a Turing-style test (60 subjects), people picked out the human clue about 70% of the time on average.
- Expert reviewers, including Don Manley, Sandy Balfour and Jonathan Crowther, rated only about 8–10 of 42 clues publishable, and found most of them lacking in wit ([Crossword Unclued summary](https://www.crosswordunclued.com/2012/02/can-computer-program-write-cryptic.html)).
- The surface fell apart as clues got longer, because nothing planned the clue as a whole beyond a single clause.

I found no peer-reviewed study (as of Oct 2026) of LLM-*generated* cryptic clues judged by experts. All the recent academic work is on *solving*.

**Solving benchmarks, and what they reveal about weaknesses.**

- **Cryptonite**: 523k clues from the Times and Telegraph. A fine-tuned T5 model scored 7.6% ([Efrat et al., EMNLP 2021](https://aclanthology.org/2021.emnlp-main.344/)).
- **Guardian dataset**: 142k clues, with a curriculum-learning approach ([Rozner, Potts & Mahowald, NeurIPS 2021](https://arxiv.org/abs/2104.08620)).
- **Saha et al. (NAACL 2025)**: GPT-4-Turbo scored about 19–24% on single clues. Between 46% and 60% of errors were answers with the meaning right but the length wrong, which shows how weak LLMs are at counting below the token level ([paper](https://arxiv.org/html/2406.09043v3)).
- **Sadallah et al. (COLING 2025)**: models extract definitions reasonably well. They **over-predict anagram and hidden-word** clue types and **under-predict charades** ([paper](https://arxiv.org/abs/2412.09012); [ACL](https://aclanthology.org/2025.coling-main.342/)).
- **Andrews & Witteveen (ICML 2025)**: the current state of the art. Each proposed explanation is formalised as Python and checked by running it, the same pattern as Cruci's validator ([paper](https://arxiv.org/abs/2506.04824)).

What this means for Cruci: letter mechanics have to stay outside the model, which Cruci already does. The bias towards anagrams and hidden words probably shows up in *writing* as well (this is my inference, not a published result), so the mix of clue types needs watching.

**LLM prose habits.** Professional writers editing LLM paragraphs (the LAMP corpus) agreed on a set of recurring faults, with **clichés** and **lack of specificity** at the top. When LLMs edit their own text, they often swap one cliché for another ([Chakrabarty et al., CHI 2025](https://arxiv.org/abs/2409.14509)). Writing with LLMs also **makes output more alike** ([Padmakumar & He](https://arxiv.org/abs/2309.05196); [Anderson et al.](https://arxiv.org/abs/2402.01536)). Prompting the model to list several candidates with probabilities ("verbalized sampling") raises creative diversity by 1.6–2.1× without training ([Zhang et al. 2025](https://arxiv.org/abs/2510.01171)).

**Judging, and what agrees with human judgement.**

- **Absolute creative scores from LLMs are weak.** On the Torrance Test of Creative Writing (TTCW), LLM judges' agreement with experts was close to zero ([Chakrabarty et al., CHI 2024](https://arxiv.org/abs/2309.14556)).
- **Claude judging Claude is biased.** LLM judges recognise and favour their own output, and the bias grows with how well they recognise it ([Panickssery et al., NeurIPS 2024](https://arxiv.org/abs/2404.13076)). Cruci's "never self-certify" rule covers the *author*. It does not cover a *model family* judging its own work.
- **Pairwise comparison does better.** Pairwise judging matches human preference more reliably than absolute scores. Wins can be combined into a ranking with a Bradley–Terry model (the method behind Chatbot Arena). However, judges favour whichever answer is shown first, and even GPT-4 gave the same verdict in only about 65% of pairs when the order was swapped. Run both orders, and count a disagreement as a tie ([Zheng et al., MT-Bench](https://arxiv.org/abs/2306.05685)). EQ-Bench Creative Writing v3 combines a rubric with pairwise Elo, using Claude as judge, and corrects for length and position bias ([repo](https://github.com/EQ-bench/creative-writing-bench)).
- **Humour is the hardest case.** In the New Yorker caption-contest dataset (250M human votes), GPT-4 and Claude fell short of top human entrants. The authors recommend ranking-based evaluation against human-written references ([Zhang et al., NeurIPS 2024](https://arxiv.org/abs/2406.10522)).
- **A close analogue for double meanings.** AmbiPun's pun generator worked by placing **context words for both senses** in the sentence ([Mittal et al., NAACL 2022](https://arxiv.org/abs/2205.01825)). That is the computational form of §1.4.

---

## 3. Resources that could be plugged in

| Resource | What it gives | Licence / caveat | Use in Cruci |
|---|---|---|---|
| [cryptics.georgeho.org](https://cryptics.georgeho.org/) ([datasheet](https://cryptics.georgeho.org/datasheet)) | 500k+ clues from British newspaper blogs since 2009, with definitions, plus **indicators** and **charades** tables | ODbL 1.0 / DbCL for the database. The clue texts are still the newspapers' copyright. Indicator extraction catches few but accurate entries | Originality checks; blind **anchor** clues for judges (internal only, never published); indicator lexicon |
| [Cryptonite](https://github.com/aviaefrat/cryptonite) | 523k Times/Telegraph clues | Licence not stated in the README; treat as research-only | Same as above |
| Guardian dataset ([Rozner et al.](https://arxiv.org/abs/2104.08620)) | 142k Guardian clues | Research release | Calibration anchors |
| [Datamuse API](https://www.datamuse.com/api/) | `rel_trg` (associated words), `ml` (reverse dictionary), `lc`/`rc` (words seen before/after) | Free for non-commercial use up to 100k requests a day; **commercial use needs an agreement** | Finding a shared subject area; checking whether a collocation is attested |
| [Small World of Words](https://smallworldofwords.org/en/project/research) | Human word associations for 12k cue words | **CC BY-NC-ND 3.0**: no commercial use, so it clashes with the paid-features goal | Offline research only |
| WordNet / ConceptNet / Moby Thesaurus | Senses, relations, synonyms | WordNet permissive; ConceptNet CC BY-SA; Moby public domain | Sense lists for spotting multi-meaning words (§1.4) |
| [MAGPIE](https://aclanthology.org/2020.lrec-1.35) | 56k idiom instances, 1,756 idiom types (from the BNC) | Check the repo licence before use | Seeds of idioms and phrases from real use |
| Wiktionary "English idioms" category | Tens of thousands of idioms and set phrases | CC BY-SA | Same |
| [Google Books Ngram](https://books.google.com/ngrams) exports | Counts of 2- to 5-word sequences | Free data | Automated search-engine test (§1.8); searching for hidden-word carriers |
| ABC "A Million News Headlines" (Kaggle) | 1.1M short headlines | Kaggle states a licence; the content belongs to the ABC. Verify | Headline-register surface seeds |
| Indicator lists ([Crossword Unclued](https://www.crosswordunclued.com/2008/11/reversals.html), Ho's indicator table) | Indicator words grouped by device | Facts / short lists | A wide indicator pool to choose from (§1.3) |

*Licensing note (not legal advice): published clue texts are creative works. Use them only inside judge prompts and similarity checks. Never display or ship them.*

---

## 4. Twelve changes to the pipeline, ranked by expected effect on surface quality

**1. A "scene brief" step before drafting (the Ximenes DAINTILY method).**
- **Change:** after the raw-material analysis (SKILL step 1), list 3–5 candidate *scenes* per answer. Each scene names a subject area, a subject and an action, built from the definition's alternative senses and the wordplay pieces' *non-crossword* senses. Then draft only inside a scene.
- **Impact:** high. It targets the single biggest gap between human and machine clues (§1.1, §1.2).
- **Effort:** low. It is a change to the prompt and the skill.
- **Measure:** pairwise tournament win rate (see change 4) of scene-briefed candidates against current-method candidates for the same 40 answers. The target is at least 60%.

**2. A table of alternative senses for every piece.**
- **Change:** for each synonym, abbreviation cue and indicator under consideration, list its everyday senses using WordNet or ConceptNet (for example: ring = O, but also phone, boxing, jewellery). Prefer pieces whose surface sense belongs to the scene's subject area.
- **Impact:** high, because this is where the misdirection comes from (§1.4, AmbiPun).
- **Effort:** low to medium. An LLM step, optionally backed by WordNet.
- **Measure:** the share of shipped clues judged to have a misdirecting surface (par factor E). It should rise.

**3. A subject-area coherence score as an advisory lint.**
- **Change:** compute how closely the surface's content words relate to each other, using embedding similarity or Datamuse `rel_trg`. This is ENIGMA's subject-area association measure rebuilt cheaply. Use it to rank candidates; do not let it gate.
- **Impact:** medium.
- **Effort:** medium.
- **Measure:** whether the score predicts which candidates the owner picks and which win pairwise. Keep it only if the correlation (Spearman) is 0.3 or higher.

**4. Replace the absolute 1–5 ceiling panel with a pairwise tournament.**
- **Change:** for each answer, compare the surviving candidates in pairs, in both orders, and count a disagreement as a tie. Combine the wins with Bradley–Terry. Keep the realism majority vote as the pass/fail floor.
- **Impact:** high on *selection* quality. The research says absolute scores are the weakest signal (TTCW, MT-Bench).
- **Effort:** medium. About 2× the judge calls for 4–6 candidates.
- **Measure:** whether the tournament winner matches the owner's pick (versus the current panel's winner), and whether the ranking holds when the tournament is re-run.

**5. Anchor every panel with real published clues.**
- **Change:** mix 1–2 blind published clues into each tournament, ideally for the same answer or the same device, drawn from Ho's dataset or Cryptonite. Ship a candidate only if it beats or ties the median anchor.
- **Impact:** high. It turns "broadsheet-quality" from the judges' imagination into a measured bar, and it exposes score inflation.
- **Effort:** low to medium (corpus lookup plus prompt).
- **Measure:** the anchor win rate per batch, tracked over time. If anchors score lower than our clues under absolute 1–5 scoring but win pairwise, the old scores were inflated.

**6. Remove "our own model judges itself".**
- **Change:** use a judge from a different model family where one is available. Where only Claude is available, rely on anchors (change 5) and on judge prompts that never reveal authorship, and keep the panel blind to which candidates are ours.
- **Impact:** medium.
- **Effort:** low.
- **Measure:** the gap between Claude-judge and other-judge rankings, and the anchor win rate under each.

**7. Automate Alberich's search-engine test.**
- **Change:** check the surface's key word pairs against Google Ngram, the BNC or Datamuse `lc`/`rc`. Flag surfaces whose central combination is never attested (Methven's "air pet").
- **Impact:** medium. It catches the "grammatical but no one would say it" failure before the judges see it.
- **Effort:** medium.
- **Measure:** how well the flags predict realism-judge FAILs, and how much judge time they save.

**8. Seed surfaces from phrases people actually use.**
- **Change:** search idiom and phrase corpora (MAGPIE, Wiktionary idioms, Ngram 2- and 3-grams, headlines) for: hidden-word carriers that span the answer, attested phrases whose letters anagram to it, and set phrases that contain a charade piece. Give these to the drafter as starting points.
- **Impact:** high for hidden, anagram and charade clues, which are most of the bank.
- **Effort:** medium (a one-off index build).
- **Measure:** the share of hidden and anagram clues whose fodder is an attested phrase, and their tournament win rate.

**9. Require a set of misdirection moves.**
- **Change:** across each answer's 4+ candidates, require at least one each of: lift-and-separate fusion (§1.5), a part-of-speech shift, a deceptive-sense word (§1.4), a capital or 's trick (§1.6), and a cryptic-definition or &lit attempt.
- **Impact:** medium to high on wit.
- **Effort:** low.
- **Measure:** how many different moves the shipped clues use, and the median rating for misdirection and difficulty to see (par factor E).

**10. An anti-cliché and anti-repetition pass.**
- **Change:** draft with verbalized sampling (ask for N candidates with their probabilities, then keep the low-probability tail). Harvest a list of over-used scene templates and phrases from the bank's own surfaces by n-gram and cluster frequency, and penalise reusing them.
- **Impact:** medium. It counters the documented sameness of LLM output.
- **Effort:** low.
- **Measure:** distinct-2 (the share of unique word pairs) and scene-cluster entropy across the bank. Owner flags of "seen this before" should fall.

**11. Automated originality check against corpora.**
- **Change:** replace the ad-hoc web search in step 6 with fuzzy matching (token Jaccard plus embeddings) against every published clue for the same answer in Ho's dataset and Cryptonite.
- **Impact:** low on quality, high on safety and speed.
- **Effort:** low to medium.
- **Measure:** no near-duplicate clues shipped, and less time spent per batch.

**12. Learn from the owner's picks.**
- **Change:** log every owner decision between candidates (and later, Daily "liked it" signals) as pairwise preferences. Keep the owner's 20–30 favourite clues as a rotating example bank in the drafting prompt, and later fit a small Bradley–Terry or reward model.
- **Impact:** high over time. The owner is the target audience for the house style.
- **Effort:** low to start.
- **Measure:** the owner's acceptance rate per batch on first presentation, which should rise over time.

**Suggested order:** do 1, 2, 4, 5 and 9 first. They are mostly prompt and skill changes that use the existing agent setup, and together they address both findings above. Then do 8 and 7, which are the corpus-backed pieces. Then 3, 10 and 11. Start 12 now, because collecting the data costs nothing.

---

### Sources (main)
Alberich: [surface](https://xteddy.org/mirror/alberichcrosswords/www.alberichcrosswords.com/pages/surface.html), [tips](https://www.alberich-crosswords.com/articles/tips-for-setters) · [Ximenes ch. 5](https://xotaotc.nfshost.com/chapter-5-cluemanship/), [ch. 7](https://xotaotc.nfshost.com/chapter-7-improvised-clues/) · [Methven](https://charliemethven.com/tips) · [MyCrossword](https://www.mycrossword.co.uk/blog/becoming-a-cryptic-setter) · [Ratnakar](https://viresh-ratnakar.codeberg.page/writings/2023/cryptic-grammar-04-2023.html) · Crossword Unclued: [lift & separate](https://www.crosswordunclued.com/2010/12/lift-and-separate.html), [surface](https://www.crosswordunclued.com/2009/06/surface-reading-cryptic-reading.html), [ENIGMA](https://www.crosswordunclued.com/2012/02/can-computer-program-write-cryptic.html), [interviews](https://www.crosswordunclued.com/p/interviews.html) · [Anax at Big Dave](https://bigdave44.com/?p=6651) · [Hardcastle thesis](https://dwhardcastle.wordpress.com/wp-content/uploads/2016/02/hardcastle-phd.pdf) · [Cryptonite](https://aclanthology.org/2021.emnlp-main.344/) · [Rozner et al.](https://arxiv.org/abs/2104.08620) · [Saha et al.](https://arxiv.org/html/2406.09043v3) · [Sadallah et al.](https://arxiv.org/abs/2412.09012) · [Andrews & Witteveen](https://arxiv.org/abs/2506.04824) · [TTCW](https://arxiv.org/abs/2309.14556) · [LAMP](https://arxiv.org/abs/2409.14509) · [Self-preference](https://arxiv.org/abs/2404.13076) · [MT-Bench](https://arxiv.org/abs/2306.05685) · [EQ-Bench CW](https://github.com/EQ-bench/creative-writing-bench) · [New Yorker humour](https://arxiv.org/abs/2406.10522) · [AmbiPun](https://arxiv.org/abs/2205.01825) · [Verbalized Sampling](https://arxiv.org/abs/2510.01171) · [George Ho datasheet](https://cryptics.georgeho.org/datasheet) · [SWOW](https://smallworldofwords.org/en/project/research) · [MAGPIE](https://aclanthology.org/2020.lrec-1.35)
