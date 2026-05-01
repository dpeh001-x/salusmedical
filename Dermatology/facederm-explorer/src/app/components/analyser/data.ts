export const fitzpatrickTypes = [
  { type: "I", tone: "#FDDBB4", desc: "Very fair, always burns, never tans", risk: "Highest UV & skin cancer risk", spf: "SPF 50+ mineral, reapply every 90 mins" },
  { type: "II", tone: "#F5C89A", desc: "Fair, usually burns, sometimes tans", risk: "Very high UV sensitivity", spf: "SPF 50+ broad-spectrum daily" },
  { type: "III", tone: "#E8A87C", desc: "Medium, sometimes burns, always tans", risk: "Moderate UV sensitivity", spf: "SPF 30\u201350 broad-spectrum" },
  { type: "IV", tone: "#C68642", desc: "Olive, rarely burns, tans easily", risk: "Lower UV risk, higher PIH risk", spf: "SPF 30\u201350 daily, non-whitening formula" },
  { type: "V", tone: "#8D5524", desc: "Brown, very rarely burns", risk: "Low UV risk, high PIH & keloid risk", spf: "SPF 30 minimum, tinted formula" },
  { type: "VI", tone: "#4A2912", desc: "Deep brown/black, never burns", risk: "Lowest UV risk, highest PIH & keloid risk", spf: "SPF 30 tinted, focus on antioxidants" },
];

export const skinToneSwatches: Record<string, string> = {
  "Very pale / ivory": "#FDDBB4",
  "Fair / light beige": "#F5C89A",
  "Medium / warm beige": "#E8A87C",
  "Light olive / East Asian": "#D4A574",
  "Olive / Southeast Asian": "#C68642",
  "Brown / caramel": "#8D5524",
  "Deep brown / ebony": "#4A2912",
};

export const ethnicityOptions = [
  "Chinese / East Asian",
  "Malay / Southeast Asian",
  "Indian / South Asian",
  "Eurasian / Mixed",
  "Caucasian / European",
  "African / Afro-Caribbean",
  "Middle Eastern",
  "Other / Prefer not to say",
];

export const skinToneOptions = Object.keys(skinToneSwatches);

export const sliderQuestionsEarly = [
  { id: "sunReaction", label: "Reaction to 45 min unprotected summer sun", options: ["Always burns severely, never tans", "Usually burns, tans minimally", "Burns then tans gradually", "Rarely burns, tans easily", "Very rarely burns, tans darkly", "Never burns"] },
  { id: "pih", label: "Dark marks after spots or cuts?", options: ["Almost never", "Occasionally \u2014 fade in weeks", "Sometimes \u2014 1\u20132 months", "Often \u2014 several months", "Very frequently \u2014 6+ months", "Always, very persistent"] },
  { id: "oiliness", label: "How does skin feel midday?", options: ["Tight and dry all over", "Normal / balanced", "Oily in T-zone only", "Oily all over", "Sensitive and reactive", "Combination \u2014 varies by season"] },
];

export const concernOptions = [
  "Acne / breakouts",
  "Pigmentation / dark spots / melasma",
  "Redness / rosacea",
  "Dryness / dehydration",
  "Fine lines / ageing",
  "Uneven texture / enlarged pores",
  "Dullness / sallow tone",
  "Sensitivity / barrier damage",
];

export const radioMidQuestions = [
  { id: "climate", label: "Primary climate / environment", options: ["Tropical / humid", "Subtropical / warm", "Temperate / seasonal", "Cold / dry", "Urban / high pollution", "Mixed / travel frequently"] },
  { id: "sunExposure", label: "Daily sun exposure", options: ["Mostly indoors", "<30 min outdoor", "1\u20132 hrs outdoor", "3\u20134 hrs outdoor", "Heavy outdoor / sports", "Outdoor work all day"] },
];

export const dietOptions = ["Plant-based / vegan", "Vegetarian", "Balanced omnivore", "High sugar / processed", "High dairy", "Spicy food frequently"];
export const dietIcons = ["\ud83e\udd66", "\ud83e\udd57", "\ud83c\udf7d\ufe0f", "\ud83c\udf69", "\ud83e\udd5b", "\ud83c\udf36\ufe0f"];

export const routineSteps = [
  { id: "cleanser", label: "Cleanser", emoji: "\ud83e\uddf4" },
  { id: "toner", label: "Toner / essence", emoji: "\ud83d\udca7" },
  { id: "vitamin_c", label: "Vitamin C / antioxidant", emoji: "\ud83c\udf4a" },
  { id: "serum", label: "Treatment serum / actives", emoji: "\ud83d\udd2c" },
  { id: "moisturiser", label: "Moisturiser", emoji: "\ud83e\udeed" },
  { id: "eye_cream", label: "Eye cream", emoji: "\ud83d\udc41\ufe0f" },
  { id: "spf", label: "SPF / sunscreen", emoji: "\u2600\ufe0f" },
  { id: "retinoid", label: "Retinoid (PM)", emoji: "\ud83c\udf19" },
  { id: "mask", label: "Face mask / sleeping pack", emoji: "\ud83c\udfad" },
  { id: "none", label: "No routine / just water", emoji: "\ud83d\udca6" },
];

export const sensitivityOptions = [
  "Very tolerant \u2014 rarely reacts",
  "Mildly reactive \u2014 occasional redness",
  "Moderately reactive \u2014 patch test always",
  "Very reactive \u2014 frequent stinging/flare",
  "Allergic \u2014 confirmed contact dermatitis",
  "Highly sensitised / compromised barrier",
];

export const hormoneOptionsByGender: Record<string, string[]> = {
  Male: ["No hormonal concerns", "Low testosterone / androgen deficiency", "Anabolic steroid use (current or past)", "On testosterone replacement therapy (TRT)", "Thyroid disorder (hypo/hyperthyroid)", "High cortisol / chronic stress", "Other hormonal condition"],
  Female: ["No hormonal concerns", "On oral contraceptive pill", "Pregnant or postpartum", "Perimenopausal / menopausal", "PCOS or hormonal imbalance", "Post-hormonal treatment", "Thyroid disorder (hypo/hyperthyroid)", "High cortisol / chronic stress"],
  "Non-binary / Other": ["No hormonal concerns", "On gender-affirming hormone therapy (oestrogen-based)", "On gender-affirming hormone therapy (testosterone-based)", "On oral contraceptive pill", "Thyroid disorder (hypo/hyperthyroid)", "High cortisol / chronic stress", "PCOS or hormonal imbalance", "Other hormonal condition"],
  "Prefer not to say": ["No hormonal concerns", "On hormonal therapy", "PCOS or hormonal imbalance", "Thyroid disorder", "High cortisol / chronic stress", "Other hormonal condition"],
};

export const genderIcons: Record<string, string> = {
  Male: "\u2642",
  Female: "\u2640",
  "Non-binary / Other": "\u26a7",
  "Prefer not to say": "\u2014",
};

export interface RoutineStep {
  step: string;
  product: string;
  why: string;
}

export interface Routine {
  concern: string;
  icon: string;
  color: string;
  source: string;
  am: RoutineStep[];
  pm: RoutineStep[];
  avoid: string[];
}

export const routines: Routine[] = [
  {
    concern: "Oily / Acne-Prone", icon: "\ud83d\udd34", color: "#C04050", source: "AAD / JAAD 2016 / Cochrane",
    am: [
      { step: "Cleanse", product: "Salicylic acid 0.5\u20132% foaming cleanser", why: "BHA dissolves in oil, penetrates follicles, reduces comedones. JAAD 2012." },
      { step: "Tone", product: "Niacinamide 5% + zinc toner", why: "Zinc reduces sebum; niacinamide regulates oil glands. IJDV 2013." },
      { step: "Treat", product: "Benzoyl peroxide 2.5\u20135% gel", why: "Bactericidal against C. acnes without resistance. Cochrane 2013." },
      { step: "Moisturise", product: "Lightweight oil-free gel moisturiser", why: "Skipping moisturiser increases compensatory sebum production." },
      { step: "Protect", product: "Non-comedogenic SPF 30\u201350 gel or fluid", why: "UV worsens PIH and acne scarring. AAD recommends daily SPF." },
    ],
    pm: [
      { step: "Cleanse", product: "Gentle gel or foam cleanser", why: "Removes sebum and pollution without over-stripping." },
      { step: "Treat", product: "Adapalene 0.1% or tretinoin 0.025\u20130.05%", why: "Gold standard. Normalises keratinisation, reduces comedones. NEJM 1997." },
      { step: "Treat", product: "Niacinamide 5\u201310% serum (off-retinoid nights)", why: "Anti-inflammatory, regulates sebum. IJDV 2013." },
      { step: "Moisturise", product: "Gel-cream with hyaluronic acid", why: "Lightweight barrier support, critical for retinoid tolerability." },
    ],
    avoid: ["Heavy occlusive creams", "Coconut oil", "Alcohol-based astringents", "Harsh physical scrubs"],
  },
  {
    concern: "Dry / Dehydrated", icon: "\ud83d\udca7", color: "#4070B0", source: "NICE 2022 / JEADV 2020",
    am: [
      { step: "Cleanse", product: "Cream or milk cleanser (no SLS/SLES)", why: "Preserves natural lipid barrier. JEADV 2020." },
      { step: "Treat", product: "Hyaluronic acid serum on damp skin", why: "Draws water into epidermis. JAAD 2021." },
      { step: "Moisturise", product: "Rich cream with ceramides, cholesterol + fatty acids (3:1:1)", why: "Replicates natural lamellar body lipid ratio. JAAD 2014." },
      { step: "Seal", product: "Squalane or rosehip oil", why: "Occlusive layer traps moisture, reduces TEWL. IJDV 2019." },
      { step: "Protect", product: "Hydrating SPF 50+ cream with glycerin", why: "Choose moisturising formulas \u2014 chemical filters may sting." },
    ],
    pm: [
      { step: "Cleanse", product: "Balm or oil cleanser \u2014 single cleanse", why: "Over-cleansing exacerbates dryness." },
      { step: "Treat", product: "Glycerin 5\u201310% + panthenol serum", why: "Panthenol accelerates barrier repair. Dermatology 2017." },
      { step: "Treat", product: "Low-dose retinol 0.025\u20130.05% (2\u20133\u00d7 weekly)", why: "Retinoids thicken dermis and boost collagen." },
      { step: "Moisturise", product: "Thick ceramide night cream or sleeping mask", why: "TEWL peaks during sleep \u2014 occlusive nighttime application is optimal." },
    ],
    avoid: ["Alcohol denat. in toners", "Hot water cleansing", "SLS foaming cleansers", "Mattifying products"],
  },
  {
    concern: "Combination", icon: "\u262f\ufe0f", color: "#6A50A0", source: "JAAD 2021 / AAD",
    am: [
      { step: "Cleanse", product: "Balanced pH gel-to-foam cleanser (no SLS)", why: "Cleans oily zones without stripping drier cheeks. pH 4.5\u20135.5." },
      { step: "Tone", product: "Niacinamide 5% toner T-zone focus", why: "Regulates sebum centrally while improving barrier on cheeks." },
      { step: "Treat", product: "Salicylic acid 1% serum (T-zone only)", why: "Targets congested central face without exacerbating cheek dryness." },
      { step: "Moisturise", product: "Gel T-zone + richer cream on cheeks", why: "Zone-specific for balanced coverage." },
      { step: "Protect", product: "Lightweight fluid SPF 50+", why: "Fluid formulas suit both zones." },
    ],
    pm: [
      { step: "Cleanse", product: "Gentle gel or micellar water", why: "Effective removal without disrupting either zone." },
      { step: "Treat", product: "Adapalene 0.1% all-over thin layer", why: "Normalises sebaceous activity, improves overall texture." },
      { step: "Treat", product: "Azelaic acid 10% T-zone (alternate nights)", why: "Anti-inflammatory and keratolytic. JAAD 2018." },
      { step: "Moisturise", product: "Medium-weight gel-cream with peptides + ceramides", why: "Balances both zones without overloading either." },
    ],
    avoid: ["Heavy overnight masks", "Drying alcohol toners", "Coconut oil on T-zone", "Skipping moisturiser"],
  },
  {
    concern: "Sensitive / Reactive", icon: "\ud83c\udf3f", color: "#4A8050", source: "EADV 2022 / BAD / NICE",
    am: [
      { step: "Cleanse", product: "Micellar water or ultra-gentle cream cleanser", why: "Minimal ingredients reduce sensitisation risk. BAD 2021." },
      { step: "Treat", product: "Centella asiatica 2\u20135% or panthenol 5% serum", why: "Madecassoside reduces neurogenic inflammation. Dermatology 2018." },
      { step: "Moisturise", product: "Fragrance-free ceramide cream (minimal INCI)", why: "Ceramide complex restores lamellar bodies. JAAD 2014." },
      { step: "Protect", product: "Mineral SPF 50+ TiO\u2082/ZnO only, fragrance-free", why: "Chemical filters can trigger sensitisation. NRS 2021." },
    ],
    pm: [
      { step: "Cleanse", product: "Micellar water \u2014 no rinse if very reactive", why: "Eliminates tap water contact. EADV 2022." },
      { step: "Treat", product: "Colloidal oatmeal 1\u20132% barrier serum", why: "Oat beta-glucan inhibits NF-\u03baB mediated inflammation." },
      { step: "Treat", product: "Azelaic acid 10% or niacinamide 4% if tolerated", why: "Gentle anti-inflammatory. Patch test first." },
      { step: "Moisturise", product: "Petrolatum-based barrier balm (no essential oils)", why: "Prevents overnight TEWL on compromised skin." },
    ],
    avoid: ["Fragrance / parfum", "Essential oils", "Physical scrubs", "Alcohol denat.", "Retinoids until barrier restored", "L-ascorbic acid"],
  },
  {
    concern: "Mature / Ageing", icon: "\u231b", color: "#907020", source: "JAAD 2021 / NEJM / Cochrane",
    am: [
      { step: "Cleanse", product: "Gentle hydrating cream cleanser", why: "Ageing skin has reduced sebum \u2014 avoid stripping." },
      { step: "Treat", product: "Vitamin C 10\u201320% + Vit E + ferulic acid", why: "Synergistic antioxidant triple \u2014 8\u00d7 photoprotection. J Invest Dermatol 2005." },
      { step: "Treat", product: "Peptide serum \u2014 Matrixyl 3000, copper peptides", why: "Signal peptides upregulate collagen I & III synthesis." },
      { step: "Treat", product: "Multi-weight hyaluronic acid serum", why: "Low MW penetrates dermis; high MW forms surface film." },
      { step: "Moisturise", product: "Rich ceramide + cholesterol + fatty acid cream", why: "Replaces depleted skin lipids. JAAD 2014." },
      { step: "Protect", product: "SPF 50+ broad-spectrum, reapply every 2 hours", why: "UV causes 80% of visible facial ageing. NEJM 2013." },
    ],
    pm: [
      { step: "Cleanse", product: "Oil cleanse + gentle second cleanse", why: "Thorough SPF removal without friction." },
      { step: "Treat", product: "Tretinoin 0.025\u20130.1% gold standard", why: "Only topical FDA-approved for wrinkles. NEJM 1988." },
      { step: "Treat", product: "Niacinamide 5% + peptide serum (off-retinoid nights)", why: "Niacinamide increases ceramide synthesis. JEADV 2004." },
      { step: "Treat", product: "Bakuchiol 0.5% or growth factor serum", why: "Plant-derived, comparable retinoid effects. BJD 2019." },
      { step: "Moisturise", product: "Rich night cream \u2014 shea, ceramides, squalane, peptides", why: "Circadian peak of skin repair occurs at night." },
    ],
    avoid: ["Drying astringents", "Heavy fragrance", "Physical exfoliation >1\u00d7 weekly", "Skipping SPF"],
  },
  {
    concern: "Hyperpigmentation / PIH", icon: "\ud83d\udfe4", color: "#7B5030", source: "JAAD 2022 / AAD / BJD",
    am: [
      { step: "Cleanse", product: "Gentle low-pH cleanser pH 4.5\u20135.5", why: "Maximises efficacy of pH-sensitive vitamin C." },
      { step: "Treat", product: "Vitamin C 15\u201320% + ferulic acid", why: "Tyrosinase inhibition. J Cosmet Dermatol 2017." },
      { step: "Treat", product: "Tranexamic acid 3\u20135% serum", why: "Disrupts UV-triggered melanocyte signalling. JAAD 2020." },
      { step: "Treat", product: "Alpha arbutin 2% or kojic acid 1\u20132%", why: "Tyrosinase inhibitors safer than HQ." },
      { step: "Moisturise", product: "Niacinamide 5\u201310% moisturiser", why: "Inhibits melanosome transfer, reduces pigment 35\u201368%. BJD 2002." },
      { step: "Protect", product: "SPF 50+ tinted with iron oxides", why: "Visible light worsens PIH; iron oxides block it. JAAD 2021." },
    ],
    pm: [
      { step: "Cleanse", product: "Oil cleanse + low-pH second cleanser", why: "Thorough SPF removal for night actives." },
      { step: "Treat", product: "Hydroquinone 4% cream (max 12-week cycles)", why: "Gold standard tyrosinase inhibitor. FDA-approved." },
      { step: "Treat", product: "Tretinoin 0.025\u20130.05% enhances HQ penetration", why: "Triple therapy is most evidence-supported PIH regimen." },
      { step: "Treat", product: "Azelaic acid 15\u201320% (HQ-free alternative)", why: "Selectively inhibits hyperactive melanocytes. JAAD 2018." },
      { step: "Moisturise", product: "Barrier-repair ceramide cream", why: "Reduces irritation-driven PIH worsening." },
    ],
    avoid: ["Unprotected sun exposure", "Picking / squeezing", "Harsh scrubs", "Fragrance on active PIH", "Unsupervised HQ >12 weeks"],
  },
  {
    concern: "Rosacea-Prone", icon: "\ud83c\udf39", color: "#B05050", source: "BAD Guidelines 2021 / NRS",
    am: [
      { step: "Cleanse", product: "Fragrance-free cream or micellar cleanser (tepid)", why: "Hot water triggers vasodilation. BAD 2021." },
      { step: "Treat", product: "Azelaic acid 15% gel or foam", why: "Anti-inflammatory, antimicrobial against Demodex. Cochrane 2015." },
      { step: "Treat", product: "Brimonidine 0.33% gel for erythema subtype", why: "Alpha-2 agonist \u2014 vasoconstriction within 30 mins. Rx only." },
      { step: "Moisturise", product: "Ceramide + niacinamide cream (fragrance-free)", why: "Rosacea patients have reduced skin ceramide. BJD 2020." },
      { step: "Protect", product: "Mineral SPF 50+ ZnO/TiO\u2082 only", why: "UV is the most common rosacea trigger. NRS 2021." },
    ],
    pm: [
      { step: "Cleanse", product: "Gentle cream cleanser \u2014 tepid/cool water only", why: "Cool water helps reduce vascular reactivity." },
      { step: "Treat", product: "Ivermectin 1% cream (Rx)", why: "Superior to metronidazole in RCTs. JAAD 2015." },
      { step: "Treat", product: "Metronidazole 0.75\u20131% cream (alternative)", why: "Anti-inflammatory, reduces Demodex load." },
      { step: "Moisturise", product: "Rich ceramide + oat emollient cream", why: "Colloidal oat reduces neurogenic inflammation." },
    ],
    avoid: ["Alcohol in products and diet", "Physical exfoliants", "Fragrance and essential oils", "Niacinamide >4% initially", "Hot showers"],
  },
  {
    concern: "Melanin-Rich Skin (IV\u2013VI)", icon: "\u2728", color: "#5B3A20", source: "JAAD 2023 / Skin of Color Society",
    am: [
      { step: "Cleanse", product: "Gentle hydrating gel cleanser pH 5.0\u20135.5", why: "Dryness causes ashiness in melanin-rich skin." },
      { step: "Treat", product: "Vitamin C 10\u201315% or ascorbyl glucoside 2%", why: "Tyrosinase inhibition for PIH prevention. J Cosmet Dermatol 2017." },
      { step: "Treat", product: "Tranexamic acid 3\u20135% + niacinamide 5%", why: "Depigmentation without HQ dependency. JAAD 2020." },
      { step: "Moisturise", product: "Shea-based or glycerin-rich cream with ceramides", why: "Shea reduces ashiness; ceramides prevent TEWL." },
      { step: "Protect", product: "Tinted SPF 50+ with iron oxides (no white cast)", why: "Visible light worsens PIH. JAAD 2021." },
    ],
    pm: [
      { step: "Cleanse", product: "Oil cleanse + gentle second cleanse", why: "Removes SPF without stripping barrier." },
      { step: "Treat", product: "Adapalene 0.1% or tretinoin 0.025%", why: "Disperses melanin granules, reduces PIH. Introduce slowly." },
      { step: "Treat", product: "Alpha arbutin 2% + kojic acid 1% serum", why: "Safe HQ alternatives without ochronosis risk." },
      { step: "Treat", product: "Azelaic acid 15\u201320% (2\u20133\u00d7 weekly)", why: "Safest depigmenting option for melanin-rich skin. JAAD 2018." },
      { step: "Moisturise", product: "Rich occlusive night cream \u2014 ceramides, shea, squalane", why: "Maintains luminosity, reduces ashy dryness." },
    ],
    avoid: ["High-concentration HQ without supervision", "Harsh scrubs", "Skipping SPF", "Bleaching products with mercury or steroids"],
  },
  {
    concern: "East Asian / Chinese Skin", icon: "\ud83c\udf38", color: "#8B5E8B", source: "JAAD Asia 2023 / J Dermatol Sci / BJD",
    am: [
      { step: "Cleanse", product: "Low-foam amino acid cleanser pH 5.5\u20136.0", why: "East Asian skin has a slightly higher pH baseline. J Dermatol Sci 2021." },
      { step: "Treat", product: "Niacinamide 5% + tranexamic acid 3% essence", why: "Addresses prevalent melasma and post-acne PIH. JAAD 2020." },
      { step: "Treat", product: "Hyaluronic acid multi-weight serum", why: "East Asian skin benefits from layered hydration especially in AC environments." },
      { step: "Moisturise", product: "Lightweight emulsion or gel-cream with centella asiatica", why: "Centella widely validated in Korean and Japanese dermatology." },
      { step: "Protect", product: "SPF 50+ PA++++ chemical or hybrid (no white cast)", why: "PA rating critical \u2014 measures UVA protection driving melasma. JSID 2022." },
    ],
    pm: [
      { step: "Cleanse", product: "Cleansing oil or balm \u2192 amino acid second cleanser", why: "Double cleansing foundational in K-beauty/J-beauty practice." },
      { step: "Treat", product: "Retinol 0.025\u20130.05% or bakuchiol 0.5%", why: "Asian skin may show retinoid sensitivity earlier; start low. BJD 2019." },
      { step: "Treat", product: "Arbutin 2% + kojic acid 1% serum (alt nights)", why: "Safer alternatives to hydroquinone for long-term melasma management." },
      { step: "Treat", product: "Galactomyces ferment filtrate or snail secretion filtrate", why: "Fermentation-derived actives validated in Korean cosmetic dermatology." },
      { step: "Moisturise", product: "Sleeping pack / overnight mask with ceramides + adenosine", why: "Adenosine validated for wrinkle reduction in Asian skin. KFDA approved." },
    ],
    avoid: ["Heavy fragrance", "L-ascorbic acid at >15%", "Harsh physical scrubs", "Skipping SPF", "Whitening products with mercury or high-dose steroids"],
  },
  {
    concern: "Malay / Southeast Asian Skin", icon: "\ud83c\udf3a", color: "#C06830", source: "JAAD SEA 2022 / Skin of Color Society",
    am: [
      { step: "Cleanse", product: "Gentle hydrating gel cleanser \u2014 sulfate-free", why: "SEA skin prone to dehydration in AC environments despite tropical climate." },
      { step: "Treat", product: "Vitamin C 10% (ascorbyl glucoside or MAP)", why: "Stable vitamin C derivatives better tolerated on olive to medium-brown skin." },
      { step: "Treat", product: "Tranexamic acid 3\u20135% + niacinamide 5%", why: "High PIH and melasma prevalence in SEA cohorts. JAAD 2020." },
      { step: "Moisturise", product: "Lightweight ceramide moisturiser with glycerin", why: "Provides hydration without clogging pores in humid climate." },
      { step: "Protect", product: "SPF 50+ PA++++ broad-spectrum \u2014 preferably tinted", why: "Tropical UV index in Singapore is extreme (14+). JAAD 2021." },
    ],
    pm: [
      { step: "Cleanse", product: "Oil balm \u2192 gentle gel second cleanse", why: "Double cleanse essential in high-pollution urban SEA environments." },
      { step: "Treat", product: "Adapalene 0.1% (2\u20133\u00d7 weekly initially)", why: "Preferred retinoid for Fitzpatrick III\u2013V. JAAD 2018." },
      { step: "Treat", product: "Azelaic acid 10\u201315% (off-retinoid nights)", why: "Anti-inflammatory, targets hyperactive melanocytes." },
      { step: "Treat", product: "Alpha arbutin 2% or kojic acid 1%", why: "Preferred over hydroquinone for long-term use." },
      { step: "Moisturise", product: "Medium-weight ceramide cream with centella asiatica", why: "Barrier repair while addressing inflammation-driven PIH." },
    ],
    avoid: ["Unprotected sun exposure", "Harsh scrubs", "High-concentration L-ascorbic acid", "Products with mercury", "Skipping SPF indoors"],
  },
  {
    concern: "Indian / South Asian Skin", icon: "\ud83e\udea4", color: "#B06020", source: "Indian J Dermatol 2022 / Skin of Color Society",
    am: [
      { step: "Cleanse", product: "Gentle pH-balanced foam cleanser 5.0\u20135.5", why: "South Asian skin (Fitzpatrick IV\u2013V) prone to hyperpigmentation." },
      { step: "Treat", product: "Vitamin C 15% + E + ferulic acid", why: "Tyrosinase inhibition prevents PIH. J Invest Dermatol 2005." },
      { step: "Treat", product: "Tranexamic acid 3\u20135%", why: "High melasma prevalence in South Asian women. JAAD 2020." },
      { step: "Moisturise", product: "Non-greasy ceramide lotion or gel-cream", why: "Lightweight hydration ideal in tropical climates." },
      { step: "Protect", product: "SPF 50+ tinted with iron oxides \u2014 no white cast", why: "Iron oxides block visible light which drives melasma. JAAD 2021." },
    ],
    pm: [
      { step: "Cleanse", product: "Micellar cleanser or oil + foam double cleanse", why: "Removes SPF and pollution; critical in urban Indian environments." },
      { step: "Treat", product: "Tretinoin 0.025\u20130.05% or adapalene 0.1%", why: "Retinoids disperse melanin, reduce PIH and acne. Indian J Dermatol 2021." },
      { step: "Treat", product: "Niacinamide 5\u201310% serum", why: "Inhibits melanosome transfer; reduces pigmentation 35\u201368%. BJD 2002." },
      { step: "Treat", product: "Kojic acid 1\u20132% + alpha arbutin 2% (alt nights)", why: "Safer alternatives to hydroquinone." },
      { step: "Moisturise", product: "Ceramide + glycerin night cream (medium weight)", why: "Barrier repair prevents inflammation that drives PIH." },
    ],
    avoid: ["Mercury-containing fairness creams", "High-concentration AHAs without patch testing", "Picking/squeezing acne", "Skipping SPF", "Unsupervised hydroquinone >12 weeks"],
  },
  {
    concern: "Tropical / Humid Climate (Singapore)", icon: "\ud83c\udf34", color: "#3A7050", source: "Singapore Dermatological Society / JAAD SEA 2023",
    am: [
      { step: "Cleanse", product: "Gentle foaming or gel cleanser \u2014 morning cleanse", why: "High humidity causes sebum and sweat build-up overnight." },
      { step: "Treat", product: "Niacinamide 5\u20138% + azelaic acid 10%", why: "Addresses sebum regulation and brightening in tropical humid skin." },
      { step: "Hydrate", product: "Lightweight watery essence or toner (no alcohol)", why: "AC environments cause significant TEWL despite outdoor humidity." },
      { step: "Moisturise", product: "Gel moisturiser \u2014 minimal oils", why: "Rich creams cause congestion in tropical heat." },
      { step: "Protect", product: "SPF 50+ PA++++ lightweight fluid or sunstick", why: "Singapore UV index 10\u201314+ year-round. Reapply every 2 hours outdoors." },
    ],
    pm: [
      { step: "Cleanse", product: "Oil/balm first cleanse + foam second cleanse", why: "Thorough double-cleanse removes tropical sunscreen, sweat, pollution." },
      { step: "Treat", product: "Retinoid (adapalene or tretinoin) 2\u20133\u00d7 weekly", why: "Improves texture, reduces pores and PIH. Introduce gradually." },
      { step: "Treat", product: "Tranexamic acid 3% or arbutin 2% serum", why: "Addresses melasma and sun-induced pigmentation in equatorial UV environment." },
      { step: "Moisturise", product: "Lightweight ceramide emulsion \u2014 not heavy cream", why: "Humidity means lighter occlusion is sufficient." },
    ],
    avoid: ["Heavy oils and balms as daily moisturiser in humid weather", "Skipping SPF on 'cloudy' Singapore days", "Over-exfoliating in heat", "Physical toners with alcohol", "Coconut oil on acne-prone skin"],
  },
];

export interface Condition {
  name: string;
  emoji: string;
  category: string;
  desc: string;
  triggers: string;
  appearance: string;
  affectedLayer: string;
  note: string;
}

export const allConditions: Condition[] = [
  { name: "Acne Vulgaris", emoji: "\ud83d\udd34", category: "Inflammatory", desc: "A chronic inflammatory condition of the pilosebaceous unit characterised by comedones, papules, pustules, nodules and cysts.", triggers: "Hormonal fluctuations, high-GI diet, stress, occlusive skincare, certain medications", appearance: "Blackheads, whiteheads, red papules, yellow pustules, painful cysts", affectedLayer: "epidermis", note: "Acne exists on a wide spectrum. What looks like a simple pimple may be cystic acne requiring prescription treatment." },
  { name: "Rosacea", emoji: "\ud83c\udf39", category: "Vascular", desc: "A chronic relapsing inflammatory condition primarily affecting the central face.", triggers: "UV exposure, heat, alcohol, spicy food, stress, Demodex mite overgrowth", appearance: "Persistent central facial redness, visible vessels, papules/pustules without comedones", affectedLayer: "dermis", note: "Rosacea is frequently misdiagnosed as acne or eczema." },
  { name: "Eczema (Atopic Dermatitis)", emoji: "\ud83d\udd36", category: "Inflammatory", desc: "A chronic, pruritic inflammatory skin disease associated with filaggrin gene mutations and impaired epidermal barrier function.", triggers: "Environmental allergens, dry skin, sweat, detergents, stress, food allergens", appearance: "Dry, scaly, intensely itchy patches; weeping in acute flares", affectedLayer: "epidermis", note: "Biologic treatments like dupilumab are now available for moderate-severe disease." },
  { name: "Melasma", emoji: "\ud83d\udfe4", category: "Pigmentation", desc: "An acquired hypermelanosis triggered by UV radiation and hormonal influences.", triggers: "UV exposure, oestrogen (pregnancy, oral contraceptives), thyroid dysfunction, visible light", appearance: "Symmetric brown or grey-brown patches across cheeks, upper lip, forehead and chin", affectedLayer: "epidermis", note: "Melasma is notoriously difficult to treat and prone to relapse. Strict photoprotection is the cornerstone." },
  { name: "Psoriasis", emoji: "\ud83d\udfe0", category: "Inflammatory", desc: "A chronic immune-mediated condition causing accelerated keratinocyte proliferation.", triggers: "Stress, streptococcal infection, beta-blockers, lithium, skin trauma, alcohol", appearance: "Well-demarcated erythematous plaques with silvery-white scale", affectedLayer: "epidermis", note: "Modern biologics can achieve near-complete clearance. Always seek specialist care." },
  { name: "Seborrheic Dermatitis", emoji: "\ud83d\udfe1", category: "Inflammatory", desc: "A chronic relapsing inflammatory condition driven by Malassezia yeast.", triggers: "Malassezia overgrowth, stress, cold/dry weather, immunosuppression", appearance: "Greasy yellowish scales with redness on scalp, nasolabial folds, eyebrows, ears", affectedLayer: "stratum corneum", note: "Antifungal treatments are effective but long-term maintenance is usually needed." },
  { name: "Contact Dermatitis", emoji: "\ud83d\udd36", category: "Inflammatory", desc: "An inflammatory skin reaction to external substances via irritant or allergic mechanisms.", triggers: "Fragrances, preservatives, metals (nickel), rubber, dyes, topical medications", appearance: "Erythema, oedema, vesicles, scaling and pruritus at the site of contact", affectedLayer: "epidermis", note: "Patch testing by an experienced skincare doctor is required to identify the causative allergen." },
  { name: "Milia", emoji: "\u26aa", category: "Benign Growth", desc: "Superficial keratin-filled epidermal inclusion cysts, typically 1\u20132mm.", triggers: "Heavy occlusive skincare, sun damage, skin resurfacing procedures", appearance: "Pearly white dome-shaped papules, most common around the eyes, cheeks and nose", affectedLayer: "epidermis", note: "Squeezing milia risks scarring. Extraction by a trained professional or topical retinoids are safest." },
  { name: "Xanthelasma", emoji: "\ud83d\udfe8", category: "Metabolic", desc: "Yellowish plaques of lipid-laden macrophages in the periorbital dermis.", triggers: "Hypercholesterolaemia, familial hyperlipidaemia, diabetes, hypothyroidism", appearance: "Soft, flat yellowish plaques on or near the upper/lower eyelids", affectedLayer: "dermis", note: "The presence of xanthelasma warrants a full lipid profile blood test." },
  { name: "Seborrheic Keratosis", emoji: "\ud83d\udfe4", category: "Benign Growth", desc: "The most common benign epidermal tumour. No malignant potential.", triggers: "Advancing age, genetics, sun exposure", appearance: "Stuck-on waxy verrucous plaques ranging from light tan to dark brown or black", affectedLayer: "epidermis", note: "Any pigmented lesion that changes in size, shape or colour should be evaluated to exclude melanoma." },
];

export const categoryColors: Record<string, string> = {
  Inflammatory: "#A03040",
  Vascular: "#A04040",
  Pigmentation: "#7B5030",
  "Benign Growth": "#806020",
  Metabolic: "#305060",
};

export interface Treatment {
  name: string;
  icon: string;
  zones: string[];
  how: string;
  ideal: string;
  recovery: string;
  results: string;
  effect: string;
}

export interface TreatmentCategory {
  tier: string;
  desc: string;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  treatments: Treatment[];
}

export const treatmentCategories: TreatmentCategory[] = [
  {
    tier: "Non-Invasive", desc: "No skin penetration. Zero to minimal downtime.", color: "#3A7050", badgeBg: "#EBF5EE", badgeBorder: "#A8D4B4",
    treatments: [
      { name: "LED Light Therapy", icon: "\ud83d\udca1", zones: ["forehead", "cheeks", "nose", "chin", "eyes"], how: "Specific wavelengths (red 630\u2013660nm for collagen; blue 415nm for acne) trigger photobiomodulation.", ideal: "Acne, inflammation, anti-ageing, post-procedure recovery", recovery: "Zero downtime", results: "Reduced breakouts, improved tone, accelerated healing", effect: "Calmer, clearer, more radiant skin" },
      { name: "IPL / Photorejuvenation", icon: "\ud83c\udf1f", zones: ["forehead", "cheeks", "nose", "chin"], how: "Intense pulsed light targets melanin and haemoglobin.", ideal: "Sun spots, redness, rosacea, broken capillaries, uneven tone", recovery: "Mild redness 24\u201348 hrs", results: "More even tone, reduced redness, improved radiance", effect: "Clearer, more uniform complexion" },
      { name: "Cryotherapy", icon: "\u2744\ufe0f", zones: ["forehead", "cheeks", "nose", "chin"], how: "Liquid nitrogen rapidly freezes targeted lesions.", ideal: "Seborrheic keratosis, warts, sun spots, skin tags, milia", recovery: "Blister may form; heals in 1\u20132 weeks", results: "Lesion removal with minimal scarring", effect: "Smoother, clearer skin surface" },
    ],
  },
  {
    tier: "Minimally Invasive", desc: "Superficial penetration or injection. Short downtime.", color: "#7B6020", badgeBg: "#F8F0DC", badgeBorder: "#D4B86A",
    treatments: [
      { name: "Chemical Peels", icon: "\ud83e\uddea", zones: ["forehead", "cheeks", "nose", "chin"], how: "Acid solutions (glycolic, salicylic, TCA) exfoliate varying skin depths.", ideal: "Acne, pigmentation, dullness, fine lines, mild scarring", recovery: "Superficial 2\u20133 days; medium/deep 1\u20132 weeks", results: "Brighter, clearer, more even-toned skin", effect: "Refined pores, faded pigmentation, glowing complexion" },
      { name: "Botox / Neurotoxin", icon: "\ud83d\udc89", zones: ["forehead", "eyes"], how: "Botulinum toxin relaxes overactive muscles causing dynamic expression lines.", ideal: "Frown lines, crow's feet, forehead lines, brow lifting, jaw slimming", recovery: "None; results in 3\u20137 days, lasts 3\u20134 months", results: "Smooth, relaxed expression lines", effect: "Softened forehead lines, smooth crow's feet" },
      { name: "Dermal Fillers", icon: "\u2728", zones: ["cheeks", "chin", "nose"], how: "Hyaluronic acid fillers restore volume, define contours and smooth folds.", ideal: "Volume loss, nasolabial folds, lip augmentation, nose reshaping, chin projection", recovery: "Minimal; possible bruising 3\u20135 days", results: "Immediate volume, lasting 12\u201318 months", effect: "Plumper cheeks, defined jawline, sculpted features" },
      { name: "Microneedling / RF", icon: "\ud83e\ude21", zones: ["forehead", "cheeks", "nose", "chin"], how: "Fine needles create micro-injuries; radiofrequency adds thermal energy to stimulate collagen.", ideal: "Acne scars, enlarged pores, skin laxity, fine lines", recovery: "1\u20133 days redness and mild swelling", results: "Improved texture, scar reduction, tighter skin over 3\u20136 months", effect: "Smoother, firmer, more refined skin surface" },
      { name: "PRP / Biostimulators", icon: "\ud83e\ude78", zones: ["forehead", "cheeks", "eyes", "chin"], how: "Platelet-rich plasma or biostimulators harness growth factors for tissue regeneration.", ideal: "Skin rejuvenation, hair loss, volume restoration, under-eye hollows", recovery: "Mild swelling/bruising 2\u20135 days", results: "Progressive improvement over 2\u20133 months, lasting 1\u20132 years", effect: "Natural volume, improved skin quality and luminosity" },
    ],
  },
  {
    tier: "Moderately Invasive", desc: "Deeper tissue penetration. Requires planning and recovery.", color: "#8B3A20", badgeBg: "#F8EDEA", badgeBorder: "#D4A090",
    treatments: [
      { name: "Laser Resurfacing", icon: "\u26a1", zones: ["forehead", "cheeks", "nose", "chin"], how: "Ablative or fractional lasers remove damaged skin layers, stimulating collagen remodelling.", ideal: "Wrinkles, acne scars, pigmentation, sun damage, textural irregularities", recovery: "5\u201314 days; avoid sun 4\u20136 weeks", results: "Smoother texture, reduced pigmentation, tighter skin", effect: "Resurfaced, glowing, even-toned complexion" },
      { name: "Ultherapy / HIFU", icon: "\ud83d\udd0a", zones: ["forehead", "cheeks", "chin"], how: "Micro-focused ultrasound penetrates to the SMAS layer, triggering deep collagen production.", ideal: "Mild to moderate skin laxity, brow lift, jawline tightening", recovery: "No downtime; mild tenderness 1\u20132 weeks", results: "Lifted, tightened skin over 3\u20136 months", effect: "Lifted brows, defined jawline, firmer contours" },
      { name: "Thread Lifting", icon: "\ud83e\uddf5", zones: ["cheeks", "chin"], how: "Dissolvable PDO or PLLA threads inserted under skin to mechanically lift and stimulate collagen.", ideal: "Mild to moderate jowling, brow ptosis, neck laxity", recovery: "3\u20135 days swelling; avoid strenuous activity 2 weeks", results: "Immediate lift with progressive collagen stimulation", effect: "Defined jawline, lifted midface, reduced jowling" },
    ],
  },
];
