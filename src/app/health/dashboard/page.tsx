"use client";

import { useState, useCallback, useRef, useEffect } from "react";

/* ═══════════════════════════════════════════════
   DATA CONSTANTS
   ═══════════════════════════════════════════════ */

const UNIT_SYSTEMS: Record<string, { u: string; f: number; offset?: number }[]> = {
  wbc:[{u:"×10⁹/L",f:1},{u:"×10³/µL",f:1}], rbc:[{u:"×10¹²/L",f:1},{u:"×10⁶/µL",f:1}],
  hb:[{u:"g/dL",f:1},{u:"g/L",f:10}], hct:[{u:"%",f:1}], mcv:[{u:"fL",f:1}],
  mch:[{u:"pg",f:1}], mchc:[{u:"g/dL",f:1},{u:"g/L",f:10}], rdw:[{u:"%",f:1}],
  plt:[{u:"×10⁹/L",f:1},{u:"×10³/µL",f:1}], mpv:[{u:"fL",f:1}],
  neut:[{u:"%",f:1}], lymph:[{u:"%",f:1}], mono:[{u:"%",f:1}], eos:[{u:"%",f:1}], baso:[{u:"%",f:1}],
  tc:[{u:"mmol/L",f:1},{u:"mg/dL",f:38.67}], ldl:[{u:"mmol/L",f:1},{u:"mg/dL",f:38.67}],
  hdl:[{u:"mmol/L",f:1},{u:"mg/dL",f:38.67}], trig:[{u:"mmol/L",f:1},{u:"mg/dL",f:88.57}],
  tcratio:[{u:"ratio",f:1}], apob:[{u:"mg/dL",f:1},{u:"g/L",f:0.01}], lpa:[{u:"nmol/L",f:1},{u:"mg/dL",f:0.4167}],
  alt:[{u:"U/L",f:1}], ast:[{u:"U/L",f:1}], alp:[{u:"U/L",f:1}], ggt:[{u:"U/L",f:1}],
  tbil:[{u:"µmol/L",f:1},{u:"mg/dL",f:0.0585}], alb:[{u:"g/L",f:1},{u:"g/dL",f:0.1}],
  tp:[{u:"g/L",f:1},{u:"g/dL",f:0.1}],
  creat:[{u:"µmol/L",f:1},{u:"mg/dL",f:0.0113}], urea:[{u:"mmol/L",f:1},{u:"mg/dL",f:2.801}],
  egfr:[{u:"mL/min",f:1}], uric:[{u:"µmol/L",f:1},{u:"mg/dL",f:0.0168}],
  na:[{u:"mmol/L",f:1}], k:[{u:"mmol/L",f:1}], cl:[{u:"mmol/L",f:1}],
  uacr:[{u:"mg/g",f:1},{u:"mg/mmol",f:0.113}],
  fbg:[{u:"mmol/L",f:1},{u:"mg/dL",f:18.02}],
  hba1c:[{u:"%",f:1},{u:"mmol/mol",f:10.93,offset:-23.5}],
  insulin:[{u:"µU/mL",f:1},{u:"pmol/L",f:6.945}],
  tsh:[{u:"mIU/L",f:1}], ft4:[{u:"pmol/L",f:1},{u:"ng/dL",f:0.0777}], ft3:[{u:"pmol/L",f:1},{u:"pg/mL",f:0.651}],
  iron:[{u:"µmol/L",f:1},{u:"µg/dL",f:5.587}], ferritin:[{u:"µg/L",f:1},{u:"ng/mL",f:1}],
  tibc:[{u:"µmol/L",f:1},{u:"µg/dL",f:5.587}], tsat:[{u:"%",f:1}],
  crp:[{u:"mg/L",f:1},{u:"mg/dL",f:0.1}], esr:[{u:"mm/hr",f:1}], ldh:[{u:"U/L",f:1}],
  hscrp:[{u:"mg/L",f:1},{u:"mg/dL",f:0.1}],
  psa:[{u:"ng/mL",f:1}], cea:[{u:"ng/mL",f:1}], afp:[{u:"ng/mL",f:1},{u:"IU/mL",f:0.83}],
  ca125:[{u:"U/mL",f:1}], ca199:[{u:"U/mL",f:1}], ca153:[{u:"U/mL",f:1}],
  b2m:[{u:"mg/L",f:1}], hcg:[{u:"mIU/mL",f:1}],
  bnp:[{u:"pg/mL",f:1}], ntprobnp:[{u:"pg/mL",f:1}],
  calcium:[{u:"mmol/L",f:1},{u:"mg/dL",f:4.005}],
  vitd:[{u:"nmol/L",f:1},{u:"ng/mL",f:0.4006}],
  bmd:[{u:"T-score",f:1}],
};

interface ConditionAdvice {
  title: string;
  note: string;
  icon: string;
  plain: string;
}

interface Condition {
  id: string;
  label: string;
  icon: string;
  color: string;
  plain: string;
  tests: string[];
  advice: ConditionAdvice[];
}

const CONDITIONS: Condition[] = [
  { id:"diabetes", label:"Diabetes", icon:"🍬", color:"#EC4899",
    plain:"If you have diabetes, these are the key tests your doctor watches closely.",
    tests:["hba1c","fbg","uacr","egfr","creat","tc","ldl","hdl","trig","alt","ast","k","na","tsh"],
    advice:[
      {title:"HbA1c (3-month sugar average)", note:"This shows your average blood sugar over the past 3 months. Most people aim for below 7%. Your doctor may set a different target for you.", icon:"📅", plain:"Think of it as your sugar report card for the last 3 months."},
      {title:"UACR (Urine kidney check)", note:"A simple urine test that catches kidney problems early — even before other tests show anything wrong. Should be done once a year.", icon:"🫘", plain:"Diabetes can quietly damage your kidneys. This catches it early."},
      {title:"eGFR (Kidney strength)", note:"Measures how well your kidneys are filtering. Above 90 is normal. Below 60 means your doctor may want to monitor more closely.", icon:"🚰", plain:"How well your kidneys are working right now."},
      {title:"Cholesterol (LDL, HDL, Triglycerides)", note:"People with diabetes have a higher heart disease risk. The 2026 guidelines recommend keeping LDL below 2.6 mmol/L or 100 mg/dL.", icon:"🫀", plain:"Keeping cholesterol low protects your heart."},
      {title:"Liver (ALT/AST)", note:"Diabetes increases fatty liver risk. Your doctor should check these to screen for liver problems.", icon:"🫁", plain:"Checks if your liver is healthy."},
    ]
  },
  { id:"hypertension", label:"High Blood Pressure", icon:"💓", color:"#EF4444",
    plain:"If you have high blood pressure, these tests help check for organ damage and guide treatment.",
    tests:["creat","egfr","uacr","k","na","cl","fbg","hba1c","tc","ldl","hdl","trig","uric","tsh","bnp","ntprobnp","hscrp"],
    advice:[
      {title:"Kidney tests (Creatinine, eGFR, UACR)", note:"High blood pressure can damage your kidneys over time. These tests check if your kidneys are still working well.", icon:"🫘", plain:"BP can hurt your kidneys — these tests catch problems early."},
      {title:"Potassium & Sodium", note:"Some blood pressure medicines can change your potassium levels. Your doctor checks this after starting or changing medications.", icon:"🧂", plain:"Important to check when you're on BP medication."},
      {title:"Cholesterol", note:"High BP + high cholesterol together greatly increase heart attack risk. The 2026 guidelines recommend checking cholesterol regularly.", icon:"🫀", plain:"Two risk factors together are more dangerous than one."},
      {title:"Blood Sugar (Glucose/HbA1c)", note:"Many people with high blood pressure also develop diabetes. Regular screening catches it early.", icon:"🍬", plain:"BP and diabetes often go together — good to check."},
      {title:"Heart markers (BNP)", note:"If you feel breathless or tired, this test checks if your heart is under strain.", icon:"❤️", plain:"Checks if high BP is affecting your heart."},
    ]
  },
  { id:"cholesterol", label:"High Cholesterol", icon:"🧈", color:"#F59E0B",
    plain:"If you have high cholesterol, these tests help track your progress and check for hidden risks.",
    tests:["tc","ldl","hdl","trig","apob","lpa","hscrp","fbg","hba1c","alt","ast","tsh","creat","egfr"],
    advice:[
      {title:"LDL ('Bad' Cholesterol) Goals", note:"The 2026 guidelines set clear targets: below 2.6 mmol/L (100 mg/dL) for most people; below 1.8 (70) if high risk; below 1.4 (55) if you've had a heart attack or stroke.", icon:"📉", plain:"Lower is better — your doctor will tell you your target."},
      {title:"Lp(a) — One-Time Test", note:"A genetic risk factor for heart disease. The 2026 guidelines recommend everyone gets tested once. If it's high, your doctor may treat more aggressively.", icon:"🧬", plain:"A hidden heart risk you're born with. Only need to test once."},
      {title:"ApoB (Advanced cholesterol)", note:"A more accurate measure of harmful cholesterol particles, especially useful if your triglycerides are high.", icon:"🔬", plain:"A deeper look at your 'bad' cholesterol."},
      {title:"Liver check (ALT)", note:"Checked before and after starting cholesterol medication (statins) to make sure your liver is handling the medicine well.", icon:"🫁", plain:"Makes sure your cholesterol medicine isn't affecting your liver."},
      {title:"Thyroid (TSH)", note:"An underactive thyroid can cause high cholesterol. This test rules that out.", icon:"🦋", plain:"Sometimes high cholesterol is caused by a thyroid problem."},
    ]
  },
];

const MORE_CONDITIONS: Condition[] = [
  { id:"gout", label:"Gout", icon:"💎", color:"#7C3AED",
    plain:"If you have gout, these tests help monitor uric acid levels and check for kidney and metabolic complications.",
    tests:["uric","creat","egfr","uacr","fbg","hba1c","tc","ldl","hdl","trig","crp","esr","alt","ast"],
    advice:[
      {title:"Uric Acid", note:"The key test for gout. High uric acid leads to crystal deposits in joints causing painful flare-ups. Most doctors aim to keep it below 360 µmol/L (6 mg/dL).", icon:"💎", plain:"The main number your doctor watches — lower means fewer flare-ups."},
      {title:"Kidney function (Creatinine, eGFR)", note:"Your kidneys are responsible for removing uric acid. If kidney function drops, uric acid can build up. Some gout medications also need kidney monitoring.", icon:"🫘", plain:"Your kidneys remove uric acid — important to check they're working well."},
      {title:"Inflammation (CRP, ESR)", note:"These go up during gout flare-ups. Useful for tracking how active the inflammation is.", icon:"🔥", plain:"Shows how much inflammation is happening in your body."},
      {title:"Blood sugar & cholesterol", note:"Gout is closely linked to metabolic syndrome. Many people with gout also have diabetes, high cholesterol, or high blood pressure.", icon:"🫀", plain:"Gout often comes with other metabolic problems — good to check."},
      {title:"Liver (ALT/AST)", note:"Some gout medications can affect the liver. Your doctor may monitor these while you're on treatment.", icon:"🫁", plain:"Makes sure your gout medication isn't affecting your liver."},
    ]
  },
  { id:"ckd", label:"Kidney Disease", icon:"🫘", color:"#6D28D9",
    plain:"If you have chronic kidney disease, these tests track how well your kidneys are working and watch for complications.",
    tests:["creat","egfr","uacr","urea","k","na","cl","hb","rbc","hct","iron","ferritin","tsat","alb","tp","fbg","hba1c","tc","ldl","hdl","trig","uric","crp","bnp","ntprobnp"],
    advice:[
      {title:"eGFR (Kidney Score)", note:"The most important number for kidney disease. Tracks your kidney function over time. Stage 1: >90, Stage 2: 60–89, Stage 3: 30–59, Stage 4: 15–29, Stage 5: <15.", icon:"🚰", plain:"Your kidney's report card — your doctor uses this to track your stage."},
      {title:"UACR (Protein in urine)", note:"Protein leaking into urine means kidney damage is progressing. Treatment aims to reduce this number.", icon:"🧪", plain:"Less protein leaking = kidneys are holding up better."},
      {title:"Potassium", note:"Damaged kidneys can't remove potassium properly. High potassium is dangerous for your heart. Checked frequently in advanced CKD.", icon:"🍌", plain:"Kidneys control potassium — too high is dangerous for your heart."},
      {title:"Haemoglobin & Iron", note:"Kidneys make a hormone (EPO) that helps produce red blood cells. Kidney disease often causes anaemia (low blood count).", icon:"🔴", plain:"Kidney disease can make you anaemic — these tests check for it."},
      {title:"Albumin", note:"Low albumin can mean protein is being lost through damaged kidneys or that nutrition is poor.", icon:"💧", plain:"Shows if you're losing too much protein or not getting enough nutrition."},
    ]
  },
  { id:"osteoporosis", label:"Osteoporosis", icon:"🦴", color:"#78716C",
    plain:"If you have or are at risk of osteoporosis, these tests help monitor bone health and rule out underlying causes.",
    tests:["calcium","vitd","bmd","alp","alb","creat","egfr","tsh","ft4","crp","esr","hb","ferritin","alt","ast"],
    advice:[
      {title:"ALP (Alkaline Phosphatase)", note:"This enzyme is related to bone turnover. High levels can indicate increased bone breakdown or other bone conditions.", icon:"🦴", plain:"Goes up when bones are breaking down or rebuilding — your doctor watches this."},
      {title:"Thyroid (TSH, Free T4)", note:"An overactive thyroid speeds up bone loss. Your doctor checks this to rule out thyroid problems as a cause.", icon:"🦋", plain:"An overactive thyroid can weaken your bones."},
      {title:"Kidney function (Creatinine, eGFR)", note:"Your kidneys help activate Vitamin D, which is essential for calcium absorption. Poor kidney function can worsen bone health.", icon:"🫘", plain:"Kidneys help your body use Vitamin D for strong bones."},
      {title:"Albumin", note:"Calcium levels in blood are affected by albumin. Your doctor may check albumin to correctly interpret your calcium result.", icon:"💧", plain:"Needed to accurately read your calcium levels."},
      {title:"Inflammation (CRP, ESR)", note:"Chronic inflammation can accelerate bone loss. These tests help rule out inflammatory conditions affecting your bones.", icon:"🔥", plain:"Ongoing inflammation can weaken bones over time."},
    ]
  },
  { id:"hepb", label:"Chronic Hepatitis B", icon:"🦠", color:"#059669",
    plain:"If you have chronic hepatitis B, these tests monitor your liver health and track the virus.",
    tests:["alt","ast","alp","ggt","tbil","alb","tp","plt","creat","egfr","fbg","hba1c","afp"],
    advice:[
      {title:"Liver enzymes (ALT, AST)", note:"ALT is the most important marker for hepatitis B activity. A rising ALT means the virus may be damaging your liver. Your doctor uses this to decide when to start treatment.", icon:"🧪", plain:"The key test — shows if the virus is actively damaging your liver."},
      {title:"Platelets", note:"A low platelet count can be an early sign of liver scarring (cirrhosis). Your doctor monitors this over time.", icon:"🩹", plain:"Low platelets can mean your liver is getting scarred."},
      {title:"AFP (Alpha-fetoprotein)", note:"People with chronic hepatitis B have a higher risk of liver cancer. AFP is checked every 6 months along with a liver ultrasound for screening.", icon:"🫀", plain:"A screening test for liver cancer — done every 6 months."},
      {title:"Bilirubin & Albumin", note:"These show how well your liver is actually functioning. High bilirubin or low albumin can mean the liver is struggling.", icon:"🟡", plain:"Shows how well your liver is doing its job."},
      {title:"Kidney function", note:"Some hepatitis B medications can affect kidneys. Your doctor checks kidney function before and during treatment.", icon:"🫘", plain:"Some hep B medicines need kidney monitoring."},
    ]
  },
  { id:"asthma", label:"Asthma", icon:"🌬️", color:"#0EA5E9",
    plain:"If you have asthma, these blood tests help check for allergic triggers, monitor medication side effects, and rule out other causes.",
    tests:["wbc","neut","eos","crp","esr","tsh","ft4","alt","ast","fbg","hba1c","k","na"],
    advice:[
      {title:"Eosinophils", note:"A type of white blood cell linked to allergic inflammation. High eosinophils suggest allergic or eosinophilic asthma, which may respond to specific biologic treatments.", icon:"🛡️", plain:"High levels suggest your asthma is driven by allergies."},
      {title:"White Blood Cells (WBC, Neutrophils)", note:"Helps your doctor tell if your symptoms are from asthma, an infection, or both. Infections can trigger asthma flare-ups.", icon:"⚔️", plain:"Helps figure out if an infection is making your asthma worse."},
      {title:"Inflammation (CRP, ESR)", note:"General inflammation markers that help distinguish asthma flare-ups from infections or other inflammatory conditions.", icon:"🔥", plain:"Shows if there's inflammation — and helps find the cause."},
      {title:"Blood sugar & potassium", note:"Steroid inhalers and oral steroids (commonly used for asthma) can raise blood sugar and lower potassium over time. Regular monitoring is important.", icon:"🍬", plain:"Asthma steroids can affect your sugar and potassium levels."},
      {title:"Thyroid (TSH)", note:"Thyroid problems can cause breathlessness that mimics asthma. Your doctor may check this to rule it out.", icon:"🦋", plain:"Thyroid issues can cause breathing problems similar to asthma."},
    ]
  },
];

const ALL_CONDITIONS = CONDITIONS.concat(MORE_CONDITIONS);

interface TestDef {
  key: string;
  name: string;
  low: number;
  high: number;
  icon: string;
  desc: string;
  plain: string;
}

interface Category {
  id: string;
  label: string;
  color: string;
  plain: string;
  tests: TestDef[];
}

const CATEGORIES: Category[] = [
  { id:"cbc",label:"🩸 Blood Cells",color:"#EF4444",plain:"Your red cells, white cells, and platelets",tests:[
    {key:"wbc",name:"White Blood Cells",low:4,high:10,icon:"🛡️",desc:"Fights infections",plain:"Your immune soldiers — fight off germs"},
    {key:"rbc",name:"Red Blood Cells",low:4,high:5.5,icon:"🔴",desc:"Carries oxygen",plain:"Carry oxygen around your body"},
    {key:"hb",name:"Haemoglobin",low:12,high:17.5,icon:"💉",desc:"Oxygen carrier in blood",plain:"The protein in red cells that holds oxygen"},
    {key:"hct",name:"Haematocrit",low:36,high:50,icon:"📊",desc:"% of blood that is red cells",plain:"How much of your blood is red cells"},
    {key:"plt",name:"Platelets",low:150,high:400,icon:"🩹",desc:"Helps blood clot",plain:"Tiny cells that stop bleeding"},
    {key:"mcv",name:"MCV",low:80,high:100,icon:"📐",desc:"Size of red blood cells",plain:"Are your red cells the right size?"},
    {key:"neut",name:"Neutrophils",low:40,high:70,icon:"⚔️",desc:"Bacteria fighters",plain:"First responders against bacterial infections"},
    {key:"lymph",name:"Lymphocytes",low:20,high:40,icon:"🧬",desc:"Virus fighters",plain:"Fight viruses and long-term immunity"},
  ]},
  { id:"lipid",label:"🫀 Cholesterol",color:"#F59E0B",plain:"Heart health — cholesterol and fats",tests:[
    {key:"tc",name:"Total Cholesterol",low:0,high:5.2,icon:"🧈",desc:"All cholesterol combined",plain:"Your overall cholesterol level"},
    {key:"ldl",name:"LDL (Bad Cholesterol)",low:0,high:3.4,icon:"⚠️",desc:"Clogs arteries",plain:"The one you want LOW — clogs your arteries"},
    {key:"hdl",name:"HDL (Good Cholesterol)",low:1.0,high:99,icon:"✅",desc:"Protects arteries",plain:"The one you want HIGH — cleans your arteries"},
    {key:"trig",name:"Triglycerides",low:0,high:1.7,icon:"🍟",desc:"Fat in your blood",plain:"Fat from the food you eat"},
    {key:"apob",name:"ApoB",low:0,high:100,icon:"🔬",desc:"Harmful particle count",plain:"Counts the actual harmful cholesterol particles"},
    {key:"lpa",name:"Lp(a)",low:0,high:75,icon:"🧬",desc:"Genetic heart risk",plain:"Inherited risk — only need to test once in your life"},
  ]},
  { id:"liver",label:"🫁 Liver",color:"#10B981",plain:"Is your liver healthy?",tests:[
    {key:"alt",name:"ALT",low:7,high:56,icon:"🧪",desc:"Liver enzyme",plain:"Goes up when liver cells are damaged"},
    {key:"ast",name:"AST",low:10,high:40,icon:"🔬",desc:"Liver/heart enzyme",plain:"Found in liver and heart — rises with damage"},
    {key:"alp",name:"ALP",low:44,high:147,icon:"🦴",desc:"Bone and liver enzyme",plain:"Related to liver and bone health"},
    {key:"ggt",name:"GGT",low:0,high:45,icon:"🍺",desc:"Liver enzyme",plain:"Sensitive to alcohol and liver problems"},
    {key:"tbil",name:"Bilirubin",low:0,high:21,icon:"🟡",desc:"Yellowing marker",plain:"High levels can cause jaundice (yellow skin)"},
    {key:"alb",name:"Albumin",low:35,high:50,icon:"💧",desc:"Blood protein",plain:"Made by your liver — shows how well it's working"},
  ]},
  { id:"kidney",label:"🫘 Kidney",color:"#8B5CF6",plain:"How well your kidneys filter waste",tests:[
    {key:"creat",name:"Creatinine",low:62,high:106,icon:"💪",desc:"Waste from muscles",plain:"Waste product your kidneys should remove"},
    {key:"egfr",name:"eGFR (Kidney Score)",low:90,high:999,icon:"🚰",desc:"Kidney filtering power",plain:"Your kidney's report card — higher is better (above 90 = good)"},
    {key:"uacr",name:"UACR (Urine Protein)",low:0,high:30,icon:"🧪",desc:"Early kidney damage",plain:"Detects tiny amounts of protein leaking into urine — early warning sign"},
    {key:"na",name:"Sodium",low:136,high:145,icon:"🧂",desc:"Salt balance",plain:"Your body's salt level"},
    {key:"k",name:"Potassium",low:3.5,high:5.1,icon:"🍌",desc:"Heart rhythm mineral",plain:"Important for your heartbeat — too high or low is dangerous"},
  ]},
  { id:"diabetes",label:"🍬 Sugar",color:"#EC4899",plain:"Blood sugar and diabetes checks",tests:[
    {key:"fbg",name:"Fasting Blood Sugar",low:3.9,high:5.6,icon:"🩸",desc:"Sugar after fasting",plain:"Your blood sugar level after not eating overnight"},
    {key:"hba1c",name:"HbA1c (3-Month Average)",low:4.0,high:5.7,icon:"📅",desc:"Long-term sugar control",plain:"Your average blood sugar over the past 3 months — the most important diabetes test"},
    {key:"insulin",name:"Fasting Insulin",low:2.6,high:24.9,icon:"💉",desc:"Insulin level",plain:"How much insulin your body is making"},
  ]},
  { id:"thyroid",label:"🦋 Thyroid",color:"#06B6D4",plain:"Controls your metabolism and energy",tests:[
    {key:"tsh",name:"TSH",low:0.4,high:4.0,icon:"🧠",desc:"Thyroid control hormone",plain:"The boss hormone — tells your thyroid how hard to work"},
    {key:"ft4",name:"Free T4",low:12,high:22,icon:"⚡",desc:"Thyroid hormone",plain:"The main thyroid hormone — controls your energy"},
  ]},
  { id:"iron",label:"⛏️ Iron",color:"#78716C",plain:"Energy and oxygen — are you low on iron?",tests:[
    {key:"iron",name:"Serum Iron",low:10,high:30,icon:"🔩",desc:"Iron in blood",plain:"How much iron is circulating in your blood right now"},
    {key:"ferritin",name:"Ferritin (Iron Stores)",low:20,high:250,icon:"🏦",desc:"Iron savings",plain:"Your body's iron savings account"},
    {key:"tibc",name:"TIBC",low:45,high:72,icon:"🚛",desc:"Iron carrying capacity",plain:"How much iron your blood CAN carry"},
    {key:"tsat",name:"Transferrin Sat %",low:20,high:50,icon:"📦",desc:"% iron used",plain:"What % of your iron-carrying capacity is being used"},
  ]},
  { id:"bone",label:"🦴 Bone",color:"#A16207",plain:"Bone health — calcium, vitamin D, and density",tests:[
    {key:"calcium",name:"Calcium",low:2.15,high:2.55,icon:"🥛",desc:"Bone mineral",plain:"Essential for strong bones and teeth — also important for heart and nerves"},
    {key:"vitd",name:"Vitamin D",low:50,high:125,icon:"☀️",desc:"Sunshine vitamin",plain:"Helps your body absorb calcium — many people are low, especially with little sun exposure"},
    {key:"bmd",name:"BMD (T-score)",low:-1.0,high:99,icon:"📏",desc:"Bone density score",plain:"Measures bone strength — above -1 is normal, -1 to -2.5 is low (osteopenia), below -2.5 is osteoporosis"},
    {key:"alp",name:"ALP",low:44,high:147,icon:"🦴",desc:"Bone and liver enzyme",plain:"Related to liver and bone health — can indicate bone turnover"},
  ]},
  { id:"joints",label:"🦵 Joints",color:"#9333EA",plain:"Joint health and gout risk",tests:[
    {key:"uric",name:"Uric Acid",low:200,high:430,icon:"💎",desc:"Gout risk marker",plain:"High levels cause crystal deposits in joints — the main cause of gout"},
    {key:"crp",name:"CRP",low:0,high:5,icon:"🔥",desc:"General inflammation",plain:"Shows if there's inflammation anywhere in your body — rises during joint flare-ups"},
    {key:"esr",name:"ESR",low:0,high:20,icon:"⏱️",desc:"Inflammation speed",plain:"Another inflammation marker — often used to monitor joint conditions"},
  ]},
  { id:"cardiac",label:"❤️ Heart",color:"#DC2626",plain:"Heart and inflammation markers",tests:[
    {key:"hscrp",name:"hs-CRP",low:0,high:3,icon:"🌡️",desc:"Heart inflammation",plain:"Measures hidden inflammation — high levels increase heart risk"},
    {key:"ntprobnp",name:"NT-proBNP",low:0,high:125,icon:"💗",desc:"Heart strain marker",plain:"Another marker for heart strain — often more accurate"},
    {key:"crp",name:"CRP",low:0,high:5,icon:"🔥",desc:"General inflammation",plain:"Shows if there's inflammation anywhere in your body"},
    {key:"esr",name:"ESR",low:0,high:20,icon:"⏱️",desc:"Inflammation speed",plain:"Another inflammation marker — common in routine tests"},
  ]},
  { id:"cancer",label:"🎗️ Cancer Markers",color:"#7C3AED",plain:"Screening markers — NOT a diagnosis by themselves",tests:[
    {key:"psa",name:"PSA (Prostate)",low:0,high:4,icon:"♂️",desc:"Prostate marker (men)",plain:"For men — can be raised in prostate cancer, but also in normal conditions"},
    {key:"cea",name:"CEA",low:0,high:5,icon:"🫁",desc:"Bowel/lung marker",plain:"Can be raised in bowel, lung, or breast cancers"},
    {key:"afp",name:"AFP",low:0,high:10,icon:"🫀",desc:"Liver cancer marker",plain:"Used to screen for liver cancer in high-risk patients"},
    {key:"ca125",name:"CA-125 (Ovarian)",low:0,high:35,icon:"♀️",desc:"Ovarian marker (women)",plain:"For women — can be raised in ovarian cancer, but also periods or endometriosis"},
    {key:"ca199",name:"CA 19-9",low:0,high:37,icon:"🟡",desc:"Pancreas marker",plain:"Mainly used for pancreatic and bile duct cancers"},
    {key:"ca153",name:"CA 15-3",low:0,high:30,icon:"🎀",desc:"Breast marker",plain:"Used to monitor breast cancer treatment progress"},
    {key:"b2m",name:"B2-Microglobulin",low:0.8,high:2.2,icon:"🩸",desc:"Blood cancer marker",plain:"Can be raised in blood cancers like myeloma or lymphoma"},
    {key:"hcg",name:"B-hCG",low:0,high:5,icon:"🧬",desc:"Germ cell marker",plain:"Raised in some testicular/ovarian cancers (also raised in pregnancy)"},
  ]},
];

interface ScreeningItem {
  age: string;
  gender: string;
  test: string;
  freq: string;
  icon: string;
  risk: string;
  plain: string;
}

const SCREENING: ScreeningItem[] = [
  {age:"40+",gender:"M",test:"PSA Blood Test (Prostate)",freq:"Discuss with your doctor",icon:"♂️",risk:"Family history of prostate cancer",plain:"A blood test for prostate cancer risk."},
  {age:"50+",gender:"All",test:"Stool Test / Colonoscopy (Bowel)",freq:"Stool test yearly OR scope every 10 years",icon:"🫁",risk:"Family history, polyps",plain:"Checks for bowel cancer. The stool test is easy — do it at home."},
  {age:"40+",gender:"F",test:"Mammogram (Breast)",freq:"Every 1-2 years",icon:"🎀",risk:"Family history, BRCA genes",plain:"An X-ray of the breast to find cancers early."},
  {age:"25+",gender:"F",test:"Pap Smear / HPV Test (Cervical)",freq:"Every 3-5 years",icon:"♀️",risk:"HPV infection",plain:"Checks the cervix for early cell changes."},
  {age:"50+",gender:"All",test:"Low-Dose CT Scan (Lung)",freq:"Yearly if you smoke or used to",icon:"🫁",risk:"Smokers with 20+ pack-years",plain:"A quick scan for people who smoke or smoked heavily."},
  {age:"40+",gender:"All",test:"AFP + Ultrasound (Liver)",freq:"Every 6 months if high risk",icon:"🫀",risk:"Hepatitis B/C, liver cirrhosis",plain:"For people with hepatitis B/C or liver disease."},
];

interface VaccinationItem {
  name: string;
  icon: string;
  doses: string;
  who: string;
  plain: string;
  subsidy: boolean;
  age: string;
}

const VACCINATIONS: VaccinationItem[] = [
  {name:"Influenza (Flu)",icon:"🤧",doses:"1 dose annually or per season",who:"All adults, especially age 65+, chronic conditions (asthma, diabetes, heart/lung/kidney disease), pregnant women, healthcare workers",plain:"Protects against seasonal flu — especially important for elderly and those with chronic conditions.",subsidy:true,age:"18+"},
  {name:"Pneumococcal (PCV20 or PCV13/PPSV23)",icon:"🫁",doses:"1 dose of PCV20 (or PCV13 + PPSV23 series)",who:"Age 65+, or 18+ with chronic lung/heart/liver disease, diabetes, kidney disease, immunocompromised",plain:"Prevents pneumonia and serious lung infections. One dose of PCV20 is sufficient for most people.",subsidy:true,age:"65+ or 18+ high-risk"},
  {name:"Shingles (Shingrix)",icon:"⚡",doses:"2 doses, 2–6 months apart",who:"Age 60+, or 18+ if immunocompromised",plain:"Prevents shingles (painful rash from the chickenpox virus reactivating). Added to NAIS in Sep 2025.",subsidy:true,age:"60+ or 18+ immunocompromised"},
  {name:"Tetanus, Diphtheria & Pertussis (Tdap)",icon:"💉",doses:"1 dose each pregnancy (week 16–32); booster every 10 years",who:"Pregnant women (each pregnancy), all adults for booster",plain:"Protects mothers and newborns from whooping cough. Boosters needed every 10 years for tetanus.",subsidy:true,age:"18+"},
  {name:"Human Papillomavirus (HPV)",icon:"🧬",doses:"3 doses (0, 1, 6 months)",who:"Females age 18–26 (can complete up to age 45 if started before 26)",plain:"Prevents cervical cancer and HPV-related cancers. Best given before exposure to the virus.",subsidy:true,age:"18–26 (F)"},
  {name:"Hepatitis B",icon:"🦠",doses:"3 doses (0, 1, 6 months)",who:"Adults without evidence of immunity or prior disease",plain:"Prevents serious liver infection. Especially important if not vaccinated as a child.",subsidy:true,age:"18+"},
  {name:"Measles, Mumps & Rubella (MMR)",icon:"🔴",doses:"2 doses, at least 4 weeks apart",who:"Adults without evidence of immunity or prior disease",plain:"Measles cases are rising globally. Check if you were vaccinated as a child — if unsure, get tested or vaccinated.",subsidy:true,age:"18+"},
  {name:"Varicella (Chickenpox)",icon:"🐔",doses:"2 doses, 4–8 weeks apart",who:"Adults without evidence of immunity or prior disease",plain:"Chickenpox can be serious in adults. If you never had it or weren't vaccinated, consider this.",subsidy:true,age:"18+"},
  {name:"COVID-19",icon:"🦠",doses:"Annual dose recommended for high-risk groups",who:"Age 60+, medically vulnerable, healthcare workers, residents of aged care facilities",plain:"Updated vaccines available targeting current strains. Free under the National Vaccination Programme for eligible residents.",subsidy:true,age:"6 months+"},
];

interface TravelItem {
  title: string;
  desc: string;
  icon: string;
}

interface TravelSection {
  category: string;
  icon: string;
  items: TravelItem[];
}

const TRAVEL_HEALTH: TravelSection[] = [
  {category:"Before You Travel",icon:"📋",items:[
    {title:"See a doctor 4–6 weeks before your trip",desc:"Get a travel health risk assessment, including advice on vaccinations and preventive medications. Your doctor can check what you need based on your destination.",icon:"🩺"},
    {title:"Check your routine vaccinations",desc:"Make sure your NAIS/NCIS vaccinations are up to date — especially MMR (measles cases are rising globally), Hepatitis B, and Tdap.",icon:"💉"},
    {title:"Prepare a travel health kit",desc:"Include your regular medications (plus extra), first aid kit, insect repellent (DEET 20%+), iodine tablets/water purifier, hand sanitiser, and any prescribed prophylaxis.",icon:"🧳"},
  ]},
  {category:"Malaria Prevention",icon:"🦟",items:[
    {title:"Atovaquone-Proguanil (Malarone)",desc:"Start 1–2 days before travel, take daily during trip, continue 7 days after leaving malaria area. Well-tolerated with fewer side effects. Good for short trips.",icon:"💊"},
    {title:"Doxycycline",desc:"Start 1–2 days before travel, take daily, continue 28 days after. Affordable option. Can cause sun sensitivity — use strong sunscreen. Avoid in pregnancy.",icon:"💊"},
    {title:"Mefloquine (Lariam)",desc:"Start 2–3 weeks before travel, take weekly, continue 4 weeks after. Good for long trips. Can cause vivid dreams and mood changes in some people.",icon:"💊"},
    {title:"Chloroquine",desc:"Only for areas without chloroquine-resistant malaria (now rare). Start 1–2 weeks before, take weekly, continue 4 weeks after.",icon:"💊"},
    {title:"Bite prevention",desc:"Use DEET-based insect repellent on exposed skin after dusk. Wear long sleeves and trousers between sunset and sunrise. Sleep under insecticide-treated mosquito nets.",icon:"🦟"},
  ]},
  {category:"Destination-Specific Vaccines",icon:"✈️",items:[
    {title:"Yellow Fever",desc:"Required for re-entry to Singapore if travelling from/transiting through (>12 hrs) a country with yellow fever risk. Certificate valid for life. Get vaccinated at designated centres.",icon:"🟡"},
    {title:"Typhoid",desc:"Recommended for travel to South Asia, Southeast Asia, Africa, and Central/South America — especially if eating street food or visiting rural areas.",icon:"🍽️"},
    {title:"Hepatitis A",desc:"Recommended for travel to areas with poor sanitation. Spread through contaminated food and water. 2-dose series provides long-term protection.",icon:"💧"},
    {title:"Japanese Encephalitis",desc:"Consider if spending extended time in rural agricultural areas in Asia, especially during monsoon season. Transmitted by mosquitoes.",icon:"🧠"},
    {title:"Rabies (Pre-exposure)",desc:"Consider for travel to areas where rabies is common and access to medical care may be limited. Important for adventure travellers and those working with animals.",icon:"🐕"},
    {title:"Meningococcal",desc:"Required for Hajj/Umrah pilgrims. Also recommended for travel to the African meningitis belt (sub-Saharan Africa), especially during dry season.",icon:"🧪"},
    {title:"Cholera",desc:"Consider for travel to active outbreak areas or humanitarian settings with limited access to clean water. Oral vaccine available.",icon:"💧"},
  ]},
  {category:"Other Travel Medications",icon:"💊",items:[
    {title:"Altitude sickness (Acetazolamide/Diamox)",desc:"For travel above 3,000m (e.g. Cusco, Lhasa, Kilimanjaro). Start 1 day before ascent. Helps your body adjust to lower oxygen. May cause tingling in fingers.",icon:"🏔️"},
    {title:"Traveller's diarrhoea kit",desc:"Ask your doctor for a standby course of antibiotics (e.g. Azithromycin) and anti-diarrheal medication (Loperamide). Useful for remote destinations.",icon:"🚻"},
    {title:"Dengue awareness",desc:"No prophylaxis available — prevention is through mosquito bite avoidance. Dengue mosquitoes bite during daytime. Use repellent day and night in endemic areas.",icon:"🦟"},
    {title:"Motion sickness",desc:"Medications like Dimenhydrinate (Dramamine) or Scopolamine patches can help for boat trips, winding roads, or flights. Take before travel.",icon:"🚢"},
  ]},
];

/* ═══════════════════════════════════════════════
   UTILITY FUNCTIONS
   ═══════════════════════════════════════════════ */

function getUnit(key: string, idx?: number) {
  const arr = UNIT_SYSTEMS[key] || [{u:"",f:1}];
  return arr[idx || 0];
}

function toBase(val: number, key: string, ui: number): number {
  const arr = UNIT_SYSTEMS[key] || [];
  const s = arr[ui];
  if (!s) return val;
  if (s.offset !== undefined) return (val - (s.offset || 0)) / s.f;
  return val / s.f;
}

function fromBase(val: number, key: string, ui: number): number {
  const arr = UNIT_SYSTEMS[key] || [];
  const s = arr[ui];
  if (!s) return val;
  if (s.offset !== undefined) return val * s.f + (s.offset || 0);
  return val * s.f;
}

function getSt(bv: number | null | undefined, low: number, high: number, key: string): string {
  if (bv === null || bv === undefined || isNaN(bv)) return "empty";
  if (key === "hdl" || key === "egfr") return bv < low ? "low" : "normal";
  if (bv < low) return "low";
  if (bv > high) return "high";
  return "normal";
}

function stCol(s: string) {
  if (s === "normal") return {bg:"#ECFDF5",border:"#10B981",text:"#065F46",badge:"bg-emerald-100 text-emerald-800",label:"Normal",emoji:"✅"};
  if (s === "high") return {bg:"#FEF2F2",border:"#EF4444",text:"#991B1B",badge:"bg-red-100 text-red-800",label:"High",emoji:"🔴"};
  if (s === "low") return {bg:"#FFF7ED",border:"#F59E0B",text:"#92400E",badge:"bg-amber-100 text-amber-800",label:"Low",emoji:"🟡"};
  return {bg:"#F9FAFB",border:"#D1D5DB",text:"#6B7280",badge:"bg-gray-100 text-gray-500",label:"",emoji:"⚪"};
}

/* ═══════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════ */

function GaugeBar({val, low, high, tkey}: {val: number | null; low: number; high: number; tkey: string}) {
  if (val === null || val === undefined || isNaN(val)) return <div className="h-4 rounded-full bg-gray-100 w-full" />;
  const rs = high - low || 1;
  const dMin = low - rs * 0.5;
  const dMax = high + rs * 0.5;
  const pct = Math.max(0, Math.min(100, ((val - dMin) / (dMax - dMin)) * 100));
  const lp = ((low - dMin) / (dMax - dMin)) * 100;
  const hp = ((high - dMin) / (dMax - dMin)) * 100;
  const st = getSt(val, low, high, tkey);
  const dot = st === "normal" ? "#10B981" : st === "high" ? "#EF4444" : "#F59E0B";
  return (
    <div className="relative w-full h-5 mt-1">
      <div className="absolute inset-0 flex rounded-full overflow-hidden h-4 top-0.5">
        <div style={{width: lp + "%"}} className="bg-amber-200" />
        <div style={{width: (hp - lp) + "%"}} className="bg-emerald-200" />
        <div style={{width: (100 - hp) + "%"}} className="bg-red-200" />
      </div>
      <div className="absolute top-0 w-5 h-5 rounded-full shadow-lg border-2 border-white transition-all duration-500" style={{left: "calc(" + pct + "% - 10px)", backgroundColor: dot}} />
    </div>
  );
}

interface SparkPoint { v: number | null; date?: string; label?: string; }

function Sparkline({points, low, high}: {points: SparkPoint[]; low: number; high: number}) {
  if (!points || points.length < 2) return null;
  const vals = points.map((p) => p.v).filter((v): v is number => v !== null && !isNaN(v));
  if (vals.length < 2) return null;
  const mn = Math.min(...vals, low);
  const mx = Math.max(...vals, high);
  const range = mx - mn || 1;
  const W = 90, H = 28, pad = 4;
  const pts = vals.map((v, i) => ({
    x: pad + (i / (vals.length - 1)) * (W - pad * 2),
    y: H - pad - ((v - mn) / range) * (H - pad * 2),
    v,
  }));
  const last = pts[pts.length - 1];
  const st = getSt(last.v, low, high, "");
  const col = st === "normal" ? "#10B981" : st === "high" ? "#EF4444" : "#F59E0B";
  const line = pts.map((p, i) => (i === 0 ? "M" : "L") + p.x + "," + p.y).join(" ");
  return (
    <svg width={W} height={H} className="block">
      <path d={line} fill="none" stroke={col} strokeWidth="2" strokeLinecap="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={i === pts.length - 1 ? 3 : 1.5} fill={i === pts.length - 1 ? col : "#94A3B8"} stroke="white" strokeWidth="1" />
      ))}
    </svg>
  );
}

function Ring({normal, total}: {normal: number; total: number}) {
  const pct = total > 0 ? (normal / total) * 100 : 0;
  const r = 44, circ = 2 * Math.PI * r, offset = circ - (pct / 100) * circ;
  const col = pct >= 80 ? "#10B981" : pct >= 60 ? "#F59E0B" : "#EF4444";
  return (
    <svg width="100" height="100" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={r} fill="none" stroke="#E5E7EB" strokeWidth="9" />
      <circle cx="50" cy="50" r={r} fill="none" stroke={col} strokeWidth="9" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90 50 50)" style={{transition:"stroke-dashoffset 0.8s"}} />
      <text x="50" y="46" textAnchor="middle" fontSize="20" fontWeight="bold" fill={col}>{Math.round(pct)}%</text>
      <text x="50" y="62" textAnchor="middle" fontSize="9" fill="#6B7280">Normal</text>
    </svg>
  );
}

/* ═══════════════════════════════════════════════
   AI CHAT BOT
   ═══════════════════════════════════════════════ */

interface ChatMsg { role: string; text: string; }

function AIChatBot({allTests, units, getBaseVal}: {
  allTests: TestDef[];
  units: Record<string, number>;
  getBaseVal: (key: string) => number | null;
}) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([
    {role: "assistant", text: "Hi! I'm your Salus Health Assistant. Ask me about any blood test result — even ones not listed in the dashboard. For example:\n\n\u2022 \"What does a high Vitamin D level mean?\"\n\u2022 \"My ferritin is 8, is that low?\"\n\u2022 \"What is C-peptide?\"\n\u2022 \"Explain my Vitamin B12 result of 180 pg/mL\""}
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  function buildContext() {
    const lines: string[] = [];
    allTests.forEach((t) => {
      const b = getBaseVal(t.key);
      if (b !== null) {
        const ui = units[t.key] || 0;
        const u = getUnit(t.key, ui);
        const dv = fromBase(b, t.key, ui).toFixed(2);
        const st = getSt(b, t.low, t.high, t.key);
        lines.push(t.name + ": " + dv + " " + u.u + " (ref " + t.low + "-" + (t.high < 900 ? t.high : "no limit") + ") — " + st);
      }
    });
    if (lines.length === 0) return "No test results have been entered yet.";
    return "Patient's current blood test results:\n" + lines.join("\n");
  }

  function sendMessage() {
    const msg = input.trim();
    if (!msg || loading) return;
    const newMsgs = messages.concat([{role: "user", text: msg}]);
    setMessages(newMsgs);
    setInput("");
    setLoading(true);

    const ctx = buildContext();
    const prompt = "You are Salus Health Assistant, an expert but friendly medical lab test interpreter embedded in a health dashboard. The user may ask about ANY blood or urine test — including tests NOT in the dashboard. Always explain in simple, easy-to-understand language. Use plain English. If the user gives a value, tell them if it's normal, high, or low, what it could mean, and when to see a doctor. Always end with a reminder that this is general info and to consult their doctor.\n\nHere is context about their entered results:\n" + ctx + "\n\nUser question: " + msg;

    fetch("/api/health-chat", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ prompt }),
    })
    .then((res) => res.json())
    .then((data) => {
      const reply = data.reply || "Sorry, I couldn't process that. Please try again.";
      setMessages((prev) => prev.concat([{role: "assistant", text: reply}]));
      setLoading(false);
    })
    .catch(() => {
      setMessages((prev) => prev.concat([{role: "assistant", text: "Sorry, I'm having trouble connecting right now. Please try again in a moment."}]));
      setLoading(false);
    });
  }

  if (!open) {
    return (
      <div className="mt-6 mb-4">
        <button onClick={() => setOpen(true)}
          className="w-full p-4 rounded-2xl border-2 border-dashed flex items-center gap-3 transition hover:shadow-md"
          style={{borderColor: "#C9A84C60", backgroundColor: "#0B1A3308"}}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl bg-navy text-gold">
            🤖
          </div>
          <div className="flex-1 text-left">
            <div className="font-bold text-sm text-navy">Ask the Health Assistant</div>
            <div className="text-xs text-slate-muted">Got a test not listed above? Ask me about ANY blood or urine test result.</div>
          </div>
          <span className="text-xl text-gold">💬</span>
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6 mb-4 rounded-2xl border-2 overflow-hidden shadow-lg" style={{borderColor: "#0B1A3330"}}>
      <div className="px-4 py-3 flex items-center justify-between bg-navy">
        <div className="flex items-center gap-2">
          <span className="text-xl">🤖</span>
          <div>
            <div className="font-bold text-sm text-gold">Salus Health Assistant</div>
            <div className="text-xs text-slate-muted">Ask about any blood or urine test</div>
          </div>
        </div>
        <button onClick={() => setOpen(false)} className="text-white/60 hover:text-white text-xl">&times;</button>
      </div>

      <div className="bg-white p-3 space-y-3 overflow-y-auto custom-scrollbar" style={{maxHeight: "350px", minHeight: "200px"}}>
        {messages.map((m, i) => {
          const isUser = m.role === "user";
          return (
            <div key={i} className={"flex " + (isUser ? "justify-end" : "justify-start")}>
              <div className={"max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed " + (isUser ? "rounded-br-sm" : "rounded-bl-sm")}
                style={isUser
                  ? {backgroundColor: "#0B1A33", color: "white"}
                  : {backgroundColor: "#F7F5F0", color: "#1E293B", border: "1px solid #E5E0D5"}
                }>
                {m.text.split("\n").map((line, j) => (
                  <p key={j} className={j > 0 ? "mt-1.5" : ""}>{line}</p>
                ))}
              </div>
            </div>
          );
        })}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-sm px-4 py-3 text-sm" style={{backgroundColor: "#F7F5F0", border: "1px solid #E5E0D5"}}>
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full animate-bounce bg-gold" style={{animationDelay: "0ms"}} />
                <div className="w-2 h-2 rounded-full animate-bounce bg-gold" style={{animationDelay: "150ms"}} />
                <div className="w-2 h-2 rounded-full animate-bounce bg-gold" style={{animationDelay: "300ms"}} />
              </div>
            </div>
          </div>
        )}
      </div>

      {messages.length <= 2 && (
        <div className="bg-white px-3 pb-2 flex gap-2 flex-wrap">
          {["What is Vitamin D?", "My B12 is 180", "What's C-peptide?", "Explain HbA1c"].map((q) => (
            <button key={q} onClick={() => setInput(q)}
              className="text-xs px-3 py-1.5 rounded-full border transition hover:shadow"
              style={{borderColor: "#C9A84C50", color: "#0B1A33", backgroundColor: "#FDF8ED"}}>
              {q}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 p-3 border-t" style={{borderColor: "#E5E0D5", backgroundColor: "#FAFAF7"}}>
        <input
          type="text"
          placeholder="Ask about any test result..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
          className="flex-1 text-sm border-2 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-gold"
          style={{borderColor: "#E5E0D5"}}
        />
        <button onClick={sendMessage} disabled={loading || !input.trim()}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold transition disabled:opacity-40 bg-navy">
          ➤
        </button>
      </div>

      <div className="px-3 py-2 text-center" style={{backgroundColor: "#FDF8ED"}}>
        <p className="text-xs" style={{color: "#9A7B2F"}}>AI responses are for general information only — not medical advice. Always consult your doctor.</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   VISIT HELPER
   ═══════════════════════════════════════════════ */

interface Visit {
  id: number;
  date: string;
  label: string;
  values: Record<string, string>;
}

function mkVisit(): Visit {
  return {id: Date.now(), date: new Date().toISOString().split("T")[0], label: "", values: {}};
}

/* ═══════════════════════════════════════════════
   CUSTOM SELECT COMPONENT
   ═══════════════════════════════════════════════ */

interface CustomSelectOption { value: string; label: string; }

function CustomSelect({value, onChange, options, placeholder}: {
  value: string;
  onChange: (v: string) => void;
  options: CustomSelectOption[];
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const selected = options.find((o) => o.value === value);
  const label = selected ? selected.label : (placeholder || "Select");

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-white text-sm rounded-xl px-3 py-2 border transition-all"
        style={{backgroundColor:"rgba(201,168,76,0.15)",borderColor:"rgba(201,168,76,0.4)"}}
      >
        <span>{label}</span>
        <svg
          className={"w-3.5 h-3.5 transition-transform duration-200 " + (open ? "rotate-180" : "")}
          fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={"absolute top-full left-0 mt-1.5 rounded-xl shadow-xl border z-50 min-w-[120px] overflow-hidden transition-all duration-200 origin-top " + (open ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0 pointer-events-none")}
        style={{backgroundColor:"#0B1A33",borderColor:"rgba(201,168,76,0.4)"}}
      >
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => { onChange(o.value); setOpen(false); }}
            className={"w-full text-left text-sm px-3 py-2 transition-colors " + (o.value === value ? "text-gold font-semibold" : "text-white")}
            style={o.value === value ? {backgroundColor:"rgba(201,168,76,0.15)"} : {}}
            onMouseEnter={(e) => { if (o.value !== value) (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(201,168,76,0.1)"; }}
            onMouseLeave={(e) => { if (o.value !== value) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SCROLLBAR STYLE TAG
   ═══════════════════════════════════════════════ */

function ScrollbarStyles() {
  return (
    <style>{`
      .custom-scrollbar {
        scrollbar-width: thin;
        scrollbar-color: rgba(201,168,76,0.4) transparent;
      }
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(201,168,76,0.4);
        border-radius: 9999px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: rgba(201,168,76,1);
      }
      .hide-scrollbar {
        scrollbar-width: none;
        -ms-overflow-style: none;
      }
      .hide-scrollbar::-webkit-scrollbar {
        display: none;
      }
    `}</style>
  );
}

/* ═══════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════ */

export default function HealthDashboardPage() {
  const [visits, setVisits] = useState<Visit[]>([mkVisit()]);
  const [vi, setVi] = useState(0);
  const [tab, setTab] = useState("cbc");
  const [view, setView] = useState("input");
  const [gender, setGender] = useState("all");
  const [age, setAge] = useState("");
  const [units, setUnits] = useState<Record<string, number>>({});
  const [trend, setTrend] = useState<string | null>(null);
  const [vmgr, setVmgr] = useState(false);
  const [conds, setConds] = useState<string[]>([]);
  const [condHelp, setCondHelp] = useState<string | null>(null);
  const [helpTip, setHelpTip] = useState<TestDef | null>(null);
  const [moreDrop, setMoreDrop] = useState(false);
  const [section, setSection] = useState("dashboard");

  const currentVisit = visits[vi] || visits[0];
  const vals = currentVisit.values;

  const saveVal = useCallback((key: string, raw: string) => {
    setVisits((prev) => {
      const next = prev.slice();
      const c = {...next[vi]};
      c.values = {...c.values};
      c.values[key] = raw;
      next[vi] = c;
      return next;
    });
  }, [vi]);

  function getBaseVal(key: string, vv?: Record<string, string>): number | null {
    const r = (vv || vals)[key];
    if (r === undefined || r === "" || isNaN(parseFloat(r))) return null;
    return toBase(parseFloat(r), key, units[key] || 0);
  }

  function toggleUnit(key: string) {
    const sys = UNIT_SYSTEMS[key];
    if (!sys || sys.length < 2) return;
    const cur = units[key] || 0;
    const next = (cur + 1) % sys.length;
    const raw = vals[key];
    if (raw !== undefined && raw !== "" && !isNaN(parseFloat(raw))) {
      const b = toBase(parseFloat(raw), key, cur);
      const converted = fromBase(b, key, next);
      saveVal(key, String(parseFloat(converted.toFixed(4))));
    }
    setUnits((p) => ({...p, [key]: next}));
  }

  function toggleCond(id: string) {
    setConds((p) => p.includes(id) ? p.filter((x) => x !== id) : p.concat([id]));
  }

  function addVisit() {
    const nv = mkVisit();
    const newLen = visits.length;
    setVisits((p) => p.concat([nv]));
    setVi(newLen);
  }

  function removeVisit(idx: number) {
    if (visits.length <= 1) return;
    setVisits((p) => p.filter((_, i) => i !== idx));
    setVi((i) => i >= idx ? Math.max(0, i - 1) : i);
  }

  const allTests = CATEGORIES.reduce<TestDef[]>((acc, c) => acc.concat(c.tests), []);
  const filled = allTests.filter((t) => getBaseVal(t.key) !== null);
  const norm = filled.filter((t) => getSt(getBaseVal(t.key), t.low, t.high, t.key) === "normal").length;
  const abn = filled.length - norm;
  const flagged = filled.filter((t) => getSt(getBaseVal(t.key), t.low, t.high, t.key) !== "normal");

  function getTrendPts(key: string) {
    const sorted = visits.slice().sort((a, b) => a.date.localeCompare(b.date));
    return sorted.map((x) => ({date: x.date, label: x.label || x.date, v: getBaseVal(key, x.values)})).filter((p) => p.v !== null);
  }

  const hlKeys: Record<string, boolean> = {};
  conds.forEach((cid) => {
    const c = ALL_CONDITIONS.find((x) => x.id === cid);
    if (c) c.tests.forEach((t) => { hlKeys[t] = true; });
  });

  const ageN = parseInt(age) || 0;
  const relScr = SCREENING.filter((s) => {
    const ma = parseInt(s.age) || 0;
    if (ageN > 0 && ageN < ma) return false;
    if (s.gender === "M" && gender === "F") return false;
    if (s.gender === "F" && gender === "M") return false;
    return true;
  });
  const activeCat = CATEGORIES.find((c) => c.id === tab);

  /* ─── TREND MODAL ─── */
  function TrendModal({testKey, onClose}: {testKey: string; onClose: () => void}) {
    const t = allTests.find((x) => x.key === testKey);
    if (!t) return null;
    const pts = getTrendPts(testKey);
    const ui = units[testKey] || 0;
    const u = getUnit(testKey, ui);
    const dp = pts.map((p) => ({...p, dv: parseFloat(fromBase(p.v!, testKey, ui).toFixed(2))}));
    const dpVals = dp.map((p) => p.dv);
    const dL = fromBase(t.low, testKey, ui);
    const dH = t.high < 900 ? fromBase(t.high, testKey, ui) : null;
    const allVals = dpVals.concat([dL]);
    if (dH !== null) allVals.push(dH);
    const mn = Math.min(...allVals);
    const mx = Math.max(...allVals);
    const range = mx - mn || 1;
    const W = 280, H = 140, pad = 28;
    const cp = dp.map((p, i) => ({
      ...p,
      x: pad + (dp.length > 1 ? (i / (dp.length - 1)) * (W - pad * 2) : (W - pad * 2) / 2),
      y: H - pad - ((p.dv - mn) / range) * (H - pad * 2),
    }));
    const lY = H - pad - ((dL - mn) / range) * (H - pad * 2);
    const hY = dH !== null ? H - pad - ((dH - mn) / range) * (H - pad * 2) : null;
    const line = cp.map((p, i) => (i === 0 ? "M" : "L") + p.x + "," + p.y).join(" ");

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-5" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-bold text-lg">{t.icon} {t.name}</h3>
              <p className="text-xs text-slate-400">{t.plain || t.desc}</p>
            </div>
            <button onClick={onClose} className="text-2xl text-slate-300 hover:text-slate-500">&times;</button>
          </div>
          {dp.length < 2 ? (
            <div className="text-center py-8 text-slate-400 text-sm">Need 2+ visits to see your trend over time.</div>
          ) : (
            <svg width="100%" viewBox={"0 0 " + W + " " + (H + 20)}>
              {hY !== null && <rect x={pad} y={Math.min(lY, hY)} width={W - pad * 2} height={Math.abs(hY - lY)} fill="#10B98115" rx="4" />}
              <line x1={pad} y1={lY} x2={W - pad} y2={lY} stroke="#10B98150" strokeWidth="1" strokeDasharray="4,3" />
              {hY !== null && <line x1={pad} y1={hY} x2={W - pad} y2={hY} stroke="#10B98150" strokeWidth="1" strokeDasharray="4,3" />}
              <path d={line} fill="none" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              {cp.map((p, i) => {
                const cst = getSt(p.v!, t.low, t.high, t.key);
                const ccol = cst === "normal" ? "#10B981" : cst === "high" ? "#EF4444" : "#F59E0B";
                return (
                  <g key={i}>
                    <circle cx={p.x} cy={p.y} r={5} fill={ccol} stroke="white" strokeWidth="2" />
                    <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize="9" fontWeight="bold" fill={ccol}>{p.dv}</text>
                    <text x={p.x} y={H + 14} textAnchor="middle" fontSize="7" fill="#94A3B8">{p.label || p.date}</text>
                  </g>
                );
              })}
            </svg>
          )}
          <div className="mt-2 space-y-1">
            {dp.map((p, i) => {
              const cst = getSt(p.v!, t.low, t.high, t.key);
              const csc = stCol(cst);
              return (
                <div key={i} className="flex items-center gap-2 text-xs p-1.5 rounded-lg" style={{backgroundColor: csc.bg}}>
                  <span className="w-20 text-slate-500">{p.label || p.date}</span>
                  <span className="font-bold" style={{color: csc.text}}>{p.dv} {u.u}</span>
                  <span className="ml-auto">{csc.emoji}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  /* ─── CONDITION GUIDE MODAL ─── */
  function CondModal({condId, onClose}: {condId: string; onClose: () => void}) {
    const c = ALL_CONDITIONS.find((x) => x.id === condId);
    if (!c) return null;
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[85vh] overflow-y-auto custom-scrollbar p-5" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-bold text-lg">{c.icon} {c.label}</h3>
            <button onClick={onClose} className="text-2xl text-slate-300 hover:text-slate-500">&times;</button>
          </div>
          <p className="text-sm text-slate-500 mb-4">{c.plain}</p>
          <div className="space-y-3">
            {c.advice.map((a, i) => (
              <div key={i} className="rounded-xl p-3 border" style={{backgroundColor: c.color + "08", borderColor: c.color + "25"}}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{a.icon}</span>
                  <span className="font-bold text-sm">{a.title}</span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed mb-1">{a.plain}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{a.note}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-blue-50 rounded-xl p-3 text-xs text-blue-600 border border-blue-200">
            This is general guidance based on published guidelines. Your doctor may set different targets for you.
          </div>
        </div>
      </div>
    );
  }

  /* ─── HELP TIP MODAL ─── */
  function TipModal({test, onClose}: {test: TestDef; onClose: () => void}) {
    return (
      <div className="fixed inset-0 bg-black/30 flex items-end sm:items-center justify-center z-50" onClick={onClose}>
        <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-w-sm w-full p-5 pb-8" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-3xl">{test.icon}</span>
            <div>
              <h3 className="font-bold text-lg">{test.name}</h3>
              <p className="text-xs text-slate-400">{test.desc}</p>
            </div>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 mb-3">
            <p className="text-sm text-slate-700 leading-relaxed">{test.plain || test.desc}</p>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg">Normal: {test.low} - {test.high < 900 ? test.high : "no upper limit"}</span>
          </div>
          <button onClick={onClose} className="w-full mt-4 bg-slate-100 text-slate-600 font-semibold py-2.5 rounded-xl">Got it</button>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════
     REPORT VIEW
     ═══════════════════════════════════════════════ */
  if (view === "report") {
    return (
      <div className="min-h-screen p-4" style={{background:"linear-gradient(180deg, #F0EDE4 0%, #F7F5F0 50%, #EDE8DC 100%)"}}>
        <ScrollbarStyles />
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-navy">Your Health Report</h1>
            <button onClick={() => setView("input")} className="px-4 py-2 bg-white rounded-xl shadow text-sm font-medium text-navy">Back</button>
          </div>

          {filled.length === 0 ? (
            <div className="bg-white rounded-2xl shadow p-8 text-center">
              <div className="text-5xl mb-3">📝</div>
              <p className="text-slate-400">No results entered yet. Go back and type in your numbers.</p>
            </div>
          ) : (
            <div>
              <div className="bg-white rounded-2xl shadow p-5 mb-4 flex flex-col items-center">
                <Ring normal={norm} total={filled.length} />
                <p className="text-sm text-slate-500 mt-2">{filled.length} tests checked</p>
                {conds.length > 0 && (
                  <div className="flex gap-1 mt-2 flex-wrap justify-center">
                    {conds.map((cid) => {
                      const c = ALL_CONDITIONS.find((x) => x.id === cid);
                      if (!c) return null;
                      return <span key={cid} className="text-xs font-semibold px-2 py-0.5 rounded-full text-white" style={{backgroundColor: c.color}}>{c.icon} {c.label}</span>;
                    })}
                  </div>
                )}
              </div>

              {conds.length > 0 && (
                <div className="bg-white rounded-2xl shadow p-4 mb-4">
                  <h2 className="font-bold text-slate-700 mb-2">Your Condition Guides</h2>
                  <p className="text-xs text-slate-400 mb-3">Tap to see which tests matter most for your conditions</p>
                  {conds.map((cid) => {
                    const c = ALL_CONDITIONS.find((x) => x.id === cid);
                    if (!c) return null;
                    return (
                      <button key={cid} onClick={() => setCondHelp(cid)} className="w-full text-left p-3 rounded-xl border flex items-center gap-3 hover:shadow transition mb-2" style={{backgroundColor: c.color + "06", borderColor: c.color + "25"}}>
                        <span className="text-3xl">{c.icon}</span>
                        <div className="flex-1">
                          <div className="font-bold text-sm">{c.label}</div>
                          <div className="text-xs text-slate-500">{c.plain}</div>
                        </div>
                        <span className="text-indigo-400 text-sm">View</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {flagged.length > 0 && (
                <div className="bg-white rounded-2xl shadow p-4 mb-4">
                  <h2 className="font-bold text-red-700 mb-1">Results Outside Normal Range</h2>
                  <p className="text-xs text-slate-400 mb-3">These results are higher or lower than expected. Discuss them with your doctor.</p>
                  <div className="space-y-2">
                    {flagged.map((t) => {
                      const b = getBaseVal(t.key);
                      const st = getSt(b, t.low, t.high, t.key);
                      const sc = stCol(st);
                      const ui = units[t.key] || 0;
                      const u = getUnit(t.key, ui);
                      const dv = fromBase(b!, t.key, ui).toFixed(2);
                      const tp = getTrendPts(t.key);
                      return (
                        <div key={t.key} className="p-3 rounded-xl flex items-center gap-3" style={{backgroundColor: sc.bg, borderLeft: "4px solid " + sc.border}}>
                          <span className="text-2xl">{t.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm" style={{color: sc.text}}>{t.name}</div>
                            <div className="text-xs text-slate-400">{t.plain || t.desc}</div>
                          </div>
                          {tp.length >= 2 && <button onClick={() => setTrend(t.key)} className="shrink-0"><Sparkline points={tp} low={t.low} high={t.high} /></button>}
                          <div className="text-right shrink-0">
                            <div className="font-bold text-sm" style={{color: sc.text}}>{dv}</div>
                            <span className={"text-xs font-bold px-1.5 py-0.5 rounded-full " + sc.badge}>{sc.emoji} {sc.label}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {CATEGORIES.map((cat) => {
                const ct = cat.tests.filter((t) => getBaseVal(t.key) !== null);
                if (ct.length === 0) return null;
                return (
                  <div key={cat.id} className="bg-white rounded-2xl shadow p-4 mb-4">
                    <h2 className="font-bold text-slate-700 mb-1">{cat.label}</h2>
                    <p className="text-xs text-slate-400 mb-3">{cat.plain}</p>
                    <div className="space-y-3">
                      {ct.map((t) => {
                        const b = getBaseVal(t.key);
                        const ui = units[t.key] || 0;
                        const u = getUnit(t.key, ui);
                        const st = getSt(b, t.low, t.high, t.key);
                        const sc = stCol(st);
                        const tp = getTrendPts(t.key);
                        return (
                          <div key={t.key}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-slate-700">{t.icon} {t.name}</span>
                              <div className="flex items-center gap-2">
                                {tp.length >= 2 && <button onClick={() => setTrend(t.key)}><Sparkline points={tp} low={t.low} high={t.high} /></button>}
                                <span className="text-sm font-bold" style={{color: sc.text}}>{fromBase(b!, t.key, ui).toFixed(2)} <span className="text-xs font-normal text-slate-400">{u.u}</span></span>
                              </div>
                            </div>
                            <GaugeBar val={b} low={t.low} high={t.high} tkey={t.key} />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              <div className="bg-gradient-to-r rounded-2xl shadow p-4 mb-4 border" style={{background:"linear-gradient(135deg, #0B1A3308, #C9A84C10)",borderColor:"#C9A84C40"}}>
                <h2 className="font-bold mb-1 text-navy">Recommended Cancer Screenings</h2>
                <p className="text-xs mb-3 text-slate-muted">Based on your age and gender</p>
                <div className="space-y-2">
                  {(ageN > 0 ? relScr : SCREENING).map((s, i) => (
                    <div key={i} className="bg-white rounded-xl p-3 border border-purple-100">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{s.icon}</span>
                        <span className="font-bold text-sm text-slate-700">{s.test}</span>
                        <span className="text-xs text-slate-400">({s.age})</span>
                      </div>
                      <p className="text-xs text-slate-600 mb-1">{s.plain}</p>
                      <div className="text-xs text-purple-600 font-medium">How often: {s.freq}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl p-4 text-center text-sm border mb-6" style={{backgroundColor:"#0B1A3308",borderColor:"#0B1A3320",color:"#0B1A33"}}>
                This report is a helpful summary, not a medical diagnosis. Always discuss your results with your doctor.
              </div>
            </div>
          )}
        </div>
        {trend && <TrendModal testKey={trend} onClose={() => setTrend(null)} />}
        {condHelp && <CondModal condId={condHelp} onClose={() => setCondHelp(null)} />}
      </div>
    );
  }

  /* ═══════════════════════════════════════════════
     INPUT VIEW
     ═══════════════════════════════════════════════ */
  return (
    <div className="min-h-screen pb-24" style={{background:"linear-gradient(180deg, #F0EDE4 0%, #F7F5F0 50%, #EDE8DC 100%)"}}>
      <ScrollbarStyles />
      <div style={{background:"linear-gradient(135deg, #0B1A33 0%, #122647 50%, #1B3460 100%)"}} className="text-white px-4 py-5">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🩸</span>
          <h1 className="text-xl font-bold font-display text-gold">Salus Health</h1>
        </div>
        <p className="text-sm mt-1 text-slate-muted">Your personal health companion</p>
        {/* Top-level section tabs */}
        <div className="flex gap-2 mt-3 flex-wrap">
          {([{id:"dashboard",label:"🩸 Health Dashboard"},{id:"vaccines",label:"💉 Vaccinations"},{id:"travel",label:"✈️ Travel Medicine"}] as const).map((s) => {
            const isA = section === s.id;
            return (
              <button key={s.id} onClick={() => setSection(s.id)}
                className={"text-sm font-semibold px-3.5 py-2 rounded-xl transition-all " + (isA ? "shadow-lg" : "hover:opacity-90")}
                style={isA ? {backgroundColor:"#C9A84C",color:"#0B1A33"} : {backgroundColor:"rgba(201,168,76,0.15)",color:"#8A9BB5",border:"1px solid rgba(201,168,76,0.3)"}}>
                {s.label}
              </button>
            );
          })}
        </div>
        {section === "dashboard" && (
          <div className="flex gap-2 mt-3 flex-wrap items-center">
            <CustomSelect
              value={gender}
              onChange={setGender}
              options={[{value:"all",label:"Gender"},{value:"M",label:"Male"},{value:"F",label:"Female"}]}
              placeholder="Gender"
            />
            <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} style={{backgroundColor:"rgba(201,168,76,0.15)",borderColor:"rgba(201,168,76,0.4)"}} className="text-white placeholder-blue-300 text-sm rounded-xl px-3 py-2 w-20 border" />
            {filled.length > 0 && (
              <button onClick={() => setView("report")} className="ml-auto font-bold text-sm px-4 py-2 rounded-xl shadow hover:opacity-90 transition bg-gold text-navy">
                View Report
              </button>
            )}
          </div>
        )}
      </div>

      {/* ═══════ VACCINATIONS SECTION ═══════ */}
      {section === "vaccines" && (
        <div className="px-4 pt-4 space-y-3 pb-8 max-w-2xl mx-auto">
          <div className="rounded-2xl p-4 border" style={{background:"linear-gradient(135deg, #EFF6FF, #F0FDF4)", borderColor:"#93C5FD"}}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">💉</span>
              <h3 className="font-bold text-lg text-navy">Recommended Vaccinations</h3>
            </div>
            <p className="text-xs text-slate-500 mb-1">Based on Singapore MOH National Adult Immunisation Schedule (NAIS), updated Sep 2025</p>
            <p className="text-xs text-blue-600">Subsidies available for Singapore Citizens and PRs at polyclinics and CHAS GP clinics. MediSave can be used.</p>
          </div>

          {VACCINATIONS.map((v, i) => {
            let relevant = true;
            if (ageN > 0) {
              if (v.name.indexOf("HPV") !== -1 && (gender === "M" || ageN > 26)) relevant = false;
            }
            if (v.name.indexOf("HPV") !== -1 && gender === "M") relevant = false;
            return (
              <div key={i} className={"bg-white rounded-2xl shadow-sm border p-4 transition " + (!relevant ? "opacity-50" : "")} style={{borderLeftWidth:"5px",borderLeftColor: relevant ? "#3B82F6" : "#D1D5DB"}}>
                <div className="flex items-start gap-3 mb-2">
                  <span className="text-2xl mt-0.5">{v.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-slate-800">{v.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">{v.age}</span>
                      {v.subsidy && <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium">Subsidised</span>}
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{v.plain}</p>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 space-y-1.5">
                  <div className="flex items-start gap-2">
                    <span className="text-xs font-bold text-slate-600 w-14 shrink-0">Doses:</span>
                    <span className="text-xs text-slate-700">{v.doses}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-xs font-bold text-slate-600 w-14 shrink-0">Who:</span>
                    <span className="text-xs text-slate-700">{v.who}</span>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
            <p className="text-xs text-blue-700 leading-relaxed">
              <span className="font-bold">How to get vaccinated:</span> Book at any participating CHAS GP clinic via <span className="font-semibold">vaccine.gov.sg</span>, or at a polyclinic via HealthHub. Healthier SG enrollees can get fully subsidised vaccines at their enrolled clinic.
            </p>
            <p className="text-xs text-blue-600 mt-2">View your vaccination records on the HealthHub app using Singpass.</p>
          </div>

          <div className="rounded-2xl p-4 text-center text-xs border" style={{backgroundColor:"#0B1A3308",borderColor:"#0B1A3320",color:"#8A9BB5"}}>
            This is general guidance based on the MOH NAIS (Sep 2025). Your doctor may recommend additional or different vaccines based on your individual health and risk factors.
          </div>
        </div>
      )}

      {/* ═══════ TRAVEL MEDICINE SECTION ═══════ */}
      {section === "travel" && (
        <div className="px-4 pt-4 space-y-3 pb-8 max-w-2xl mx-auto">
          <div className="rounded-2xl p-4 border" style={{background:"linear-gradient(135deg, #FFF7ED, #ECFDF5)", borderColor:"#FDBA74"}}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">✈️</span>
              <h3 className="font-bold text-lg text-navy">Travel Medicine</h3>
            </div>
            <p className="text-xs text-slate-500">Malaria prophylaxis, travel vaccines, and medications to prepare before your trip</p>
            <p className="text-xs text-amber-600 mt-1 font-medium">See your doctor 4-6 weeks before travel for a personalised risk assessment.</p>
          </div>

          {TRAVEL_HEALTH.map((sec, si) => (
            <div key={si} className="bg-white rounded-2xl shadow-sm border overflow-hidden">
              <div className="px-4 py-3 flex items-center gap-2" style={{backgroundColor: si === 1 ? "#FEF2F2" : si === 2 ? "#EFF6FF" : si === 3 ? "#F0FDF4" : "#F8FAFC"}}>
                <span className="text-xl">{sec.icon}</span>
                <h4 className="font-bold text-sm text-navy">{sec.category}</h4>
              </div>
              <div className="p-3 space-y-2">
                {sec.items.map((item, ii) => (
                  <div key={ii} className="rounded-xl p-3 border border-slate-100 hover:bg-slate-50 transition">
                    <div className="flex items-start gap-2.5">
                      <span className="text-lg mt-0.5">{item.icon}</span>
                      <div className="flex-1">
                        <span className="text-sm font-bold text-slate-800">{item.title}</span>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="bg-red-50 rounded-2xl p-4 border border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🚨</span>
              <span className="font-bold text-sm text-red-800">Singapore Yellow Fever Requirement</span>
            </div>
            <p className="text-xs text-red-700 leading-relaxed">
              If you are returning to Singapore from or transiting through (over 12 hours) a country with yellow fever risk, you MUST have a valid Yellow Fever vaccination certificate. Travellers without one can be quarantined at a government facility for up to 6 days.
            </p>
          </div>

          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">⚠️</span>
              <span className="font-bold text-sm text-amber-800">Important Reminders</span>
            </div>
            <div className="space-y-1.5 text-xs text-amber-700 leading-relaxed">
              <p>• Anti-malaria medications require a prescription in Singapore — see your doctor.</p>
              <p>• Malaria prophylaxis is 80-90% effective — always use bite prevention too.</p>
              <p>• If you develop fever within 12 months of visiting a malaria area, tell your doctor immediately.</p>
              <p>• Check the CDC Yellow Book or CDA website for country-specific risks.</p>
            </div>
          </div>

          <div className="rounded-2xl p-4 text-center text-xs border" style={{backgroundColor:"#0B1A3308",borderColor:"#0B1A3320",color:"#8A9BB5"}}>
            This is general travel health guidance. Consult your doctor or a travel medicine clinic for advice tailored to your specific destination, health conditions, and itinerary.
          </div>
        </div>
      )}

      {/* ═══════ HEALTH DASHBOARD SECTION ═══════ */}
      {section === "dashboard" && (
        <div className="max-w-2xl mx-auto">
          <div className="px-4 pt-4 pb-2">
            <p className="text-sm font-bold mb-1 text-navy">Do you have any of these conditions?</p>
            <p className="text-xs mb-3 text-slate-muted">Tap to select — we will highlight the tests that matter most for you</p>
            <div className="flex gap-2 flex-wrap">
              {CONDITIONS.map((c) => {
                const on = conds.includes(c.id);
                return (
                  <button key={c.id} onClick={() => toggleCond(c.id)}
                    className={"flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-2xl border-2 transition-all " + (on ? "text-white shadow-lg" : "bg-white text-slate-600 shadow-sm")}
                    style={on ? {backgroundColor: c.color, borderColor: c.color} : {borderColor: c.color + "40"}}>
                    <span className="text-lg">{c.icon}</span>{c.label}
                    {on && <span className="bg-white/30 rounded-full w-5 h-5 flex items-center justify-center text-xs">✓</span>}
                  </button>
                );
              })}

              {/* More Conditions Dropdown */}
              <div className="relative">
                <button onClick={() => setMoreDrop(!moreDrop)}
                  className={"flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-2xl border-2 transition-all " + (MORE_CONDITIONS.some((c) => conds.includes(c.id)) ? "bg-indigo-600 text-white border-indigo-600 shadow-lg" : "bg-white text-slate-600 shadow-sm border-slate-300")}>
                  <span className="text-lg">＋</span>More Conditions
                  <span className={"text-xs transition-transform " + (moreDrop ? "rotate-180" : "")}>▾</span>
                </button>
                {moreDrop && (
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 z-40 min-w-[220px] py-2 overflow-hidden">
                    {MORE_CONDITIONS.map((c) => {
                      const on = conds.includes(c.id);
                      return (
                        <button key={c.id} onClick={() => toggleCond(c.id)}
                          className={"w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all text-left " + (on ? "text-white" : "text-slate-700 hover:bg-slate-50")}
                          style={on ? {backgroundColor: c.color} : {}}>
                          <span className="text-lg">{c.icon}</span>
                          <span className="flex-1">{c.label}</span>
                          {on && <span className="bg-white/30 rounded-full w-5 h-5 flex items-center justify-center text-xs">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            {conds.length > 0 && (
              <div className="mt-2 flex gap-2 flex-wrap">
                {conds.map((cid) => {
                  const c = ALL_CONDITIONS.find((x) => x.id === cid);
                  if (!c) return null;
                  return (
                    <button key={cid} onClick={() => setCondHelp(cid)}
                      className="text-xs font-medium px-3 py-1.5 rounded-xl border flex items-center gap-1 hover:shadow transition"
                      style={{backgroundColor: c.color + "08", borderColor: c.color + "25", color: c.color}}>
                      {c.label} test guide
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Visit Selector */}
          <div className="px-4 pt-1 pb-2">
            <div className="flex items-center gap-2">
              <button onClick={() => setVmgr(!vmgr)} className="flex-1 bg-white rounded-xl shadow-sm border px-4 py-2.5 flex items-center justify-between">
                <span className="font-semibold text-slate-700 text-sm">
                  {currentVisit.label || ("Visit " + (vi + 1))}
                  <span className="text-slate-400 font-normal ml-2 text-xs">{currentVisit.date}</span>
                </span>
                <span className="text-slate-400 text-xs">{visits.length} visit{visits.length > 1 ? "s" : ""}</span>
              </button>
              <button onClick={addVisit} className="text-white rounded-xl px-4 py-2.5 text-sm font-bold shadow bg-navy">+ New Visit</button>
            </div>
            {vmgr && (
              <div className="bg-white rounded-xl shadow-lg border mt-2 p-3 space-y-2">
                {visits.map((x, i) => (
                  <div key={x.id}
                    className={"flex items-center gap-2 p-2.5 rounded-xl cursor-pointer transition " + (i === vi ? "bg-indigo-50 border border-indigo-200" : "hover:bg-slate-50")}
                    onClick={() => { setVi(i); setVmgr(false); }}>
                    <div className="flex-1">
                      <input type="text" placeholder={"Visit " + (i + 1) + " label"} value={x.label}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => { const n = visits.slice(); n[i] = {...n[i], label: e.target.value}; setVisits(n); }}
                        className="text-sm font-medium text-slate-700 bg-transparent outline-none w-full placeholder-slate-300" />
                      <input type="date" value={x.date}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => { const n = visits.slice(); n[i] = {...n[i], date: e.target.value}; setVisits(n); }}
                        className="text-xs text-slate-400 bg-transparent outline-none" />
                    </div>
                    <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">
                      {Object.values(x.values).filter((y) => y !== "" && y !== undefined).length} tests
                    </span>
                    {visits.length > 1 && (
                      <button onClick={(e) => { e.stopPropagation(); removeVisit(i); }} className="text-red-400 hover:text-red-600 text-lg">&times;</button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Summary */}
          {filled.length > 0 && (
            <div className="px-4 py-2 flex gap-2">
              <div className="flex-1 bg-emerald-50 rounded-2xl p-3 text-center border border-emerald-200">
                <div className="text-2xl font-bold text-emerald-600">{norm}</div>
                <div className="text-xs text-emerald-700 font-medium">✅ Normal</div>
              </div>
              <div className="flex-1 bg-red-50 rounded-2xl p-3 text-center border border-red-200">
                <div className="text-2xl font-bold text-red-500">{abn}</div>
                <div className="text-xs text-red-600 font-medium">⚠️ Check</div>
              </div>
              <div className="flex-1 bg-blue-50 rounded-2xl p-3 text-center border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">{filled.length}</div>
                <div className="text-xs text-blue-700 font-medium">Total</div>
              </div>
            </div>
          )}

          {/* Category Tabs */}
          <div className="px-4 pt-2 overflow-x-auto hide-scrollbar">
            <div className="flex gap-2 pb-2" style={{minWidth: "max-content"}}>
              {CATEGORIES.map((cat) => {
                const cf = cat.tests.filter((t) => getBaseVal(t.key) !== null).length;
                const cfl = cat.tests.filter((t) => { const s = getSt(getBaseVal(t.key), t.low, t.high, t.key); return s === "high" || s === "low"; }).length;
                const isA = tab === cat.id;
                const hasHL = cat.tests.some((t) => hlKeys[t.key]);
                return (
                  <button key={cat.id} onClick={() => setTab(cat.id)}
                    className={"whitespace-nowrap text-sm font-semibold px-3 py-2 rounded-2xl transition " + (isA ? "text-white shadow-lg" : "text-slate-600 shadow-sm")}
                    style={isA ? {backgroundColor: "#0B1A33"} : hasHL ? {borderBottom: "3px solid #C9A84C", backgroundColor: "white"} : {backgroundColor: "white"}}>
                    {cat.label}
                    {cf > 0 && <span className={"ml-1.5 text-xs px-1.5 py-0.5 rounded-full " + (cfl > 0 ? "bg-red-200 text-red-800" : "bg-emerald-200 text-emerald-800")}>{cf}</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Description */}
          {activeCat && <div className="px-4 pb-2"><p className="text-xs text-slate-500">{activeCat.plain}</p></div>}

          {/* Test Cards */}
          <div className="px-4 space-y-2">
            {activeCat && activeCat.tests.map((test) => {
              const raw = vals[test.key] || "";
              const b = getBaseVal(test.key);
              const st = b !== null ? getSt(b, test.low, test.high, test.key) : "empty";
              const sc = stCol(st);
              const ui = units[test.key] || 0;
              const u = getUnit(test.key, ui);
              const sys = UNIT_SYSTEMS[test.key] || [];
              const tp = getTrendPts(test.key);
              const isHL = hlKeys[test.key];

              return (
                <div key={test.key} className={"bg-white rounded-2xl shadow-sm border-2 p-4 transition " + (isHL ? "border-purple-300 ring-1 ring-purple-200" : "")} style={{borderLeftColor: b !== null ? sc.border : "#E5E7EB", borderLeftWidth: "5px"}}>
                  <div className="flex items-start gap-3 mb-2">
                    <span className="text-2xl mt-0.5">{test.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-slate-800">{test.name}</span>
                        {isHL && <span className="text-xs px-1.5 py-0.5 rounded-lg font-medium" style={{backgroundColor:"#C9A84C20",color:"#9A7B2F"}}>Important</span>}
                        <button onClick={() => setHelpTip(test)} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-500 w-5 h-5 rounded-full flex items-center justify-center font-bold transition">?</button>
                      </div>
                      <p className="text-xs text-slate-400 leading-snug mt-0.5">{test.plain || test.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <input type="number" step="any" placeholder="Type your result here" value={raw}
                        onChange={(e) => saveVal(test.key, e.target.value)}
                        className="w-full text-base font-bold border-2 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-300 outline-none placeholder-slate-300 transition"
                        style={{color: st !== "empty" ? sc.text : "#1E293B", borderColor: st !== "empty" ? sc.border : "#E2E8F0"}} />
                    </div>
                    <button onClick={() => toggleUnit(test.key)}
                      className={"text-sm px-3 py-3 rounded-xl border-2 font-medium min-w-[56px] text-center transition " + (sys.length > 1 ? "border-amber-300 text-amber-700 hover:bg-amber-50" : "bg-gray-50 border-gray-200 text-gray-400")}
                      style={sys.length > 1 ? {backgroundColor: "#FDF8ED"} : {}}>
                      {u.u || "-"}
                    </button>
                  </div>
                  {b !== null && (
                    <div>
                      <GaugeBar val={b} low={test.low} high={test.high} tkey={test.key} />
                      <div className="flex justify-between items-center mt-1.5">
                        <span className="text-xs text-slate-400">Normal range: {fromBase(test.low, test.key, ui).toFixed(1)} - {test.high < 900 ? fromBase(test.high, test.key, ui).toFixed(1) : "no limit"} {u.u}</span>
                        <div className="flex items-center gap-2">
                          {tp.length >= 2 && <button onClick={() => setTrend(test.key)}><Sparkline points={tp} low={test.low} high={test.high} /></button>}
                          <span className={"text-xs font-bold px-2.5 py-1 rounded-full " + sc.badge}>{sc.emoji} {sc.label}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {tab === "cancer" && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-200 mt-3">
                <h3 className="font-bold text-purple-800 mb-1">Cancer Screenings For You</h3>
                <p className="text-xs text-purple-600 mb-3">Recommended screening tests based on your age and gender.</p>
                <div className="space-y-2">
                  {(ageN > 0 ? relScr : SCREENING).map((s, i) => (
                    <div key={i} className="bg-white rounded-xl p-3 border border-purple-100">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{s.icon}</span>
                        <span className="font-bold text-sm text-slate-700">{s.test}</span>
                      </div>
                      <p className="text-xs text-slate-600 mb-1">{s.plain}</p>
                      <div className="text-xs text-purple-600 font-medium">How often: {s.freq}</div>
                      <div className="text-xs text-amber-600 mt-0.5">Higher risk if: {s.risk}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 bg-amber-50 rounded-xl p-3 text-xs text-amber-700 border border-amber-200">
                  Cancer markers are just one piece of the puzzle. An abnormal result does NOT automatically mean cancer — many other conditions can cause raised levels. Always discuss with your doctor.
                </div>
              </div>
            )}

            {/* AI Chat Assistant */}
            <AIChatBot allTests={allTests} units={units} getBaseVal={getBaseVal} />
          </div>
        </div>
      )}

      {trend && <TrendModal testKey={trend} onClose={() => setTrend(null)} />}
      {condHelp && <CondModal condId={condHelp} onClose={() => setCondHelp(null)} />}
      {helpTip && <TipModal test={helpTip} onClose={() => setHelpTip(null)} />}
    </div>
  );
}
