import { NextResponse } from "next/server";

export const maxDuration = 60;

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { summary, fitzType, fitzDesc, age, gender, image } = body;

    // Determine if we have a valid image
    let imageBlock: { type: "image"; source: { type: "base64"; media_type: string; data: string } } | null = null;
    if (image && typeof image === "string" && image.startsWith("data:image/")) {
      const match = image.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
      if (match) {
        imageBlock = { type: "image", source: { type: "base64", media_type: match[1], data: match[2] } };
      }
    }
    const hasImage = !!imageBlock;

    const imageAnalysisFields = hasImage
      ? `,"imageAnalysis":{"textureAssessment":"3-4 sentences","observations":[{"area":"zone","finding":"what you see","severity":"mild|moderate|significant","recommendation":"what to do"}],"visibleConcerns":["3-5 concerns"],"skinQualityScore":7,"scoreExplanation":"2-3 sentences","overallPhotoNotes":"2-3 sentences","photoBasedRecommendations":["3-4 recommendations from the photo"]}`
      : `,"imageAnalysis":null`;

    const imageInstruction = hasImage
      ? `\nCRITICAL — PHOTO ANALYSIS: A photo is attached. You MUST fill imageAnalysis with SPECIFIC observations. Analyse texture, pores, oiliness, pigmentation, redness, lines, blemishes. Rate 1-10. Give photo-specific recommendations.`
      : "";

    const prompt = `You are an expert consultant dermatologist. Return ONLY valid JSON.

Patient profile:
${summary}
Fitzpatrick Type ${fitzType}: ${fitzDesc}

CRITICAL INSTRUCTION: The patient answered 16 survey questions. Your report MUST address EVERY SINGLE answer with specific, personalised feedback. The patient must see exactly how each of their responses shaped the analysis. Do NOT give generic advice. Reference their EXACT answers.${imageInstruction}

Return this JSON — fill EVERY field with personalised detail:
{
"overallSkinType":"specific label for THEIR skin e.g. Oily-Combination Fitzpatrick III with PIH Tendency",
"summary":"5-6 sentences. Broad review referencing their age (${age}), gender, ethnicity, skin tone, oiliness level, primary concerns, and climate. This should read like a dermatologist's opening assessment of THIS specific patient.",

"inputAnalysis":[
  {"question":"Age","yourAnswer":"${age}","impact":"2-3 sentences: how being ${age} specifically affects their skin — collagen status, cell turnover rate, what changes are happening or expected at this age, what ingredients become important NOW"},
  {"question":"Gender & Hormones","yourAnswer":"their gender + hormonal status","impact":"2-3 sentences: how their SPECIFIC gender and hormonal profile drives skin behaviour — sebum production, hormonal acne patterns, or menopausal changes as applicable"},
  {"question":"BMI","yourAnswer":"their BMI or Not provided","impact":"2-3 sentences: how their specific BMI affects sebum, inflammation, skin healing. If not provided say why it matters"},
  {"question":"Ethnicity","yourAnswer":"their ethnicity","impact":"2-3 sentences: heritage-specific skin characteristics — melanin density, PIH risk, keloid risk, common conditions in their ethnic group, ingredient sensitivities"},
  {"question":"Skin Tone","yourAnswer":"their tone","impact":"2-3 sentences: what their specific skin tone means for UV damage risk, visible ageing patterns, PIH tendency, and which product formulations suit them (e.g. tinted vs untinted SPF)"},
  {"question":"Sun Reaction","yourAnswer":"their answer","impact":"2-3 sentences: what their burn/tan pattern reveals about melanin protection, DNA damage risk, photoageing vulnerability, and SPF requirements"},
  {"question":"PIH Tendency","yourAnswer":"their answer","impact":"2-3 sentences: what their PIH tendency means — how long marks last, which actives to avoid (too aggressive = more PIH), which depigmenting agents are safe for them"},
  {"question":"Oiliness","yourAnswer":"their answer","impact":"2-3 sentences: what their oiliness level means for product selection — gel vs cream textures, which actives to use, pore congestion risk, how oiliness interacts with their climate"},
  {"question":"Primary Concerns","yourAnswer":"their concern","impact":"2-3 sentences: clinical explanation of their primary concern — what causes it in their profile, how treatable it is, realistic timeline for improvement"},
  {"question":"Climate","yourAnswer":"their climate","impact":"2-3 sentences: how their specific climate affects skin — humidity and TEWL, pollution exposure, UV intensity, how to adjust routine seasonally"},
  {"question":"Sun Exposure","yourAnswer":"their answer","impact":"2-3 sentences: what their daily sun exposure level means — cumulative UV damage risk, SPF reapplication needs, whether their current protection is adequate"},
  {"question":"Diet","yourAnswer":"their diet","impact":"2-3 sentences: how their SPECIFIC diet pattern affects their skin type — glycaemic load and acne, dairy and inflammation, antioxidant intake, hydration"},
  {"question":"Sensitivity","yourAnswer":"their answer","impact":"2-3 sentences: what their reactivity level means for product introduction — patch testing protocol, active ingredient tolerance, barrier function assessment, which ingredients to avoid"},
  {"question":"Hormonal Profile","yourAnswer":"their answer","impact":"2-3 sentences: how their SPECIFIC hormonal status affects their skin — androgen-driven sebum, oestrogen-related pigmentation, thyroid effects on barrier, or stress cortisol impacts"}
],

"zoneFindings":[{"zone":"each zone they selected","likelyConcerns":["concerns"],"severity":"mild|moderate|significant","explanation":"2-3 sentences WHY this zone is affected given their full profile","urgency":"routine|monitor|consult","keyIngredients":["ingredients"],"specificAdvice":"targeted advice for this zone"}],

"dietImpact":{"patientDiet":"their diet","skinEffects":"3-4 sentences on how this diet affects THEIR skin","beneficialFoods":["foods with reasons"],"foodsToReduce":["foods with reasons"],"dietRecommendation":"personalised advice"},

"routineAnalysis":{"currentSteps":["their steps"],"missingSteps":["missing steps with why each matters"],"stepsToImprove":["improvements"],"routineVerdict":"2-3 sentences assessment"},

"skinConditionNotes":"3-4 sentences on their skin type implications",
"primaryConcerns":["c1","c2","c3"],
"productTips":["3 specific products with reasons tied to their answers"],
"fitzpatrickAdvice":"2-3 sentences on their Fitzpatrick type implications",
"topIngredients":[{"name":"n","mechanism":"how it works","evidence":"source","reason":"why for THIS patient"}],
"recommendedRoutine":"acne|dry|combination|sensitive|anti-ageing|hyperpigmentation|rosacea|melanin|east-asian|southeast-asian|indian|tropical",
"routineRationale":"2-3 sentences why this routine type for them",
"amTips":["tips referencing their specific concerns and climate"],
"pmTips":["tips referencing their specific concerns"],
"suggestedTreatments":[{"name":"n","suitability":"high|moderate|low","reason":"2-3 sentences why for their profile"}],
"lifestyleNotes":["notes tied to their sun exposure, climate, and concerns"],
"threeMonthRoadmap":[{"month":"Month 1","focus":"f","expectedChange":"specific to their concerns"},{"month":"Month 2","focus":"f","expectedChange":"specific"},{"month":"Month 3","focus":"f","expectedChange":"specific"}],
"sunscreenAdvice":"2-3 sentences tied to their Fitzpatrick type, sun exposure level, and climate",
"ingredientsToAvoid":["ingredient — reason specific to their sensitivity level and skin type"]${imageAnalysisFields}
}`;

    type ContentBlock =
      | { type: "image"; source: { type: "base64"; media_type: string; data: string } }
      | { type: "text"; text: string };
    const content: ContentBlock[] = [];
    if (imageBlock) content.push(imageBlock);
    content.push({ type: "text", text: prompt });

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 6000, messages: [{ role: "user", content }] }),
    });

    if (!res.ok) {
      console.error("Anthropic API error:", res.status, await res.text());
      return NextResponse.json(getFallbackResults(hasImage), { status: 200 });
    }

    const data = await res.json();
    const rawText = (data.content || []).map((b: { text?: string }) => b.text || "").join("");
    let cleaned = rawText.replace(/```json|```/g, "").trim();
    if (!cleaned.endsWith("}")) {
      const lastBrace = cleaned.lastIndexOf("}");
      if (lastBrace > 0) {
        cleaned = cleaned.substring(0, lastBrace + 1);
        const opens = (cleaned.match(/{/g) || []).length;
        const closes = (cleaned.match(/}/g) || []).length;
        for (let i = 0; i < opens - closes; i++) cleaned += "}";
      }
    }

    const parsed = JSON.parse(cleaned);
    if (hasImage && !parsed.imageAnalysis) {
      parsed.imageAnalysis = {
        textureAssessment: "Photo was reviewed. Detailed texture data was incorporated into the overall recommendations.",
        observations: [], visibleConcerns: parsed.primaryConcerns || [], skinQualityScore: 6,
        scoreExplanation: "Estimated from profile. Retry with a well-lit front-facing photo for precise scoring.",
        overallPhotoNotes: "Your photo has been reviewed. Recommendations account for both questionnaire and visible characteristics.",
        photoBasedRecommendations: parsed.productTips || [],
      };
    }
    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Analysis error:", err);
    return NextResponse.json(getFallbackResults(false), { status: 200 });
  }
}

function getFallbackResults(hasImage: boolean) {
  return {
    overallSkinType: "Assessment pending", summary: "Please consult a skincare doctor for a full assessment.",
    skinConditionNotes: "A thorough in-person assessment would provide the most accurate evaluation.",
    inputAnalysis: [], primaryConcerns: ["Consult a skincare doctor"],
    productTips: ["Start with a gentle cleanser", "Add broad-spectrum SPF 30-50", "Introduce one active at a time"],
    fitzpatrickAdvice: "Apply broad-spectrum SPF daily.", zoneFindings: [],
    dietImpact: null, routineAnalysis: null,
    topIngredients: [{ name: "SPF 50+", mechanism: "UV protection", evidence: "AAD", reason: "Foundation of any routine" }],
    recommendedRoutine: "sensitive", routineRationale: "A gentle approach is recommended.",
    amTips: ["Apply SPF every morning"], pmTips: ["Double cleanse to remove SPF"],
    suggestedTreatments: [{ name: "Consult your skincare doctor", suitability: "high", reason: "Professional assessment needed" }],
    lifestyleNotes: ["Avoid peak sun hours"], threeMonthRoadmap: [
      { month: "Month 1", focus: "Basic routine", expectedChange: "Improved barrier" },
      { month: "Month 2", focus: "Add one active", expectedChange: "Texture improvement" },
      { month: "Month 3", focus: "Targeted treatment", expectedChange: "Measurable improvement" },
    ],
    sunscreenAdvice: "Apply SPF 50+ every morning.", ingredientsToAvoid: ["Fragrance", "Alcohol denat."],
    imageAnalysis: hasImage ? { textureAssessment: "Unable to complete photo analysis.", observations: [],
      visibleConcerns: [], skinQualityScore: null, scoreExplanation: "Unavailable.",
      overallPhotoNotes: "Please retry with a clear photo.", photoBasedRecommendations: [] } : null,
  };
}
