"use client";

import { CHAR, GOLD, GOLD_DK, GOLD_LT, IVORY } from "../theme";

export default function GeoFace({ size = 80, dark = true, gender = "" }: { size?: number; dark?: boolean; gender?: string }) {
  const isFemale = gender === "Female";
  const isMale = gender === "Male";
  const W = 200, H = 260;
  const s = dark ? GOLD : GOLD_DK;
  const s2 = dark ? GOLD_LT : "#B89850";
  const sw = 0.65;
  const dim = 0.25;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={size} height={size * (H / W)} style={{ display: "block" }}>
      {dark && <rect width={W} height={H} fill={CHAR} rx="6" />}

      {/* Subtle clinical grid */}
      <line x1="100" y1="14" x2="100" y2="246" stroke={s2} strokeWidth={0.3} strokeDasharray="4 4" opacity={dim * 0.6} />
      {[64, 92, 132, 156, 178].map((y, i) => (
        <line key={i} x1="34" y1={y} x2="166" y2={y} stroke={s2} strokeWidth={0.25} strokeDasharray="3 5" opacity={dim * 0.5} />
      ))}

      {/* ── HAIR ── */}
      {isFemale ? (
        <>
          {/* Flowing volume — parted slightly off-center */}
          <path d="M100,16 C65,16 44,32 38,58 C34,74 33,92 34,108 Q33,125 32,138" fill="none" stroke={s} strokeWidth={sw + 0.2} strokeLinecap="round" />
          <path d="M100,16 C135,16 156,32 162,58 C166,74 167,92 166,108 Q167,125 168,138" fill="none" stroke={s} strokeWidth={sw + 0.2} strokeLinecap="round" />
          {/* Soft crown volume */}
          <path d="M60,30 Q80,12 100,10 Q120,12 140,30" fill="none" stroke={s} strokeWidth={sw + 0.1} strokeLinecap="round" />
          {/* Flowing side layers */}
          <path d="M38,58 Q36,75 34,95 Q32,115 32,138" fill="none" stroke={s2} strokeWidth={sw * 0.7} opacity={0.4} />
          <path d="M162,58 Q164,75 166,95 Q168,115 168,138" fill="none" stroke={s2} strokeWidth={sw * 0.7} opacity={0.4} />
          {/* Inner hair strands for volume */}
          <path d="M44,42 Q40,62 37,85 Q35,105 34,125" fill="none" stroke={s2} strokeWidth={sw * 0.4} opacity={0.25} />
          <path d="M156,42 Q160,62 163,85 Q165,105 166,125" fill="none" stroke={s2} strokeWidth={sw * 0.4} opacity={0.25} />
          {/* Soft part line */}
          <path d="M96,14 Q98,22 100,35" fill="none" stroke={s2} strokeWidth={sw * 0.5} opacity={0.35} />
        </>
      ) : isMale ? (
        <>
          {/* Clean short styled hair — textured top with neat sides */}
          <path d="M100,18 C68,18 46,30 40,55 C36,72 36,86 38,98" fill="none" stroke={s} strokeWidth={sw + 0.2} strokeLinecap="round" />
          <path d="M100,18 C132,18 154,30 160,55 C164,72 164,86 162,98" fill="none" stroke={s} strokeWidth={sw + 0.2} strokeLinecap="round" />
          {/* Textured top with slight volume */}
          <path d="M58,34 Q72,16 100,14 Q128,16 142,34" fill="none" stroke={s} strokeWidth={sw + 0.1} strokeLinecap="round" />
          {/* Styled texture lines on top */}
          <path d="M65,30 Q80,20 96,18" fill="none" stroke={s2} strokeWidth={sw * 0.5} opacity={0.35} />
          <path d="M135,30 Q120,20 104,18" fill="none" stroke={s2} strokeWidth={sw * 0.5} opacity={0.35} />
          {/* Clean fade / taper at temples */}
          <path d="M40,60 Q38,72 38,84" fill="none" stroke={s2} strokeWidth={sw * 0.6} opacity={0.35} strokeDasharray="2 2" />
          <path d="M160,60 Q162,72 162,84" fill="none" stroke={s2} strokeWidth={sw * 0.6} opacity={0.35} strokeDasharray="2 2" />
        </>
      ) : (
        <>
          <path d="M100,16 C68,16 46,30 40,55 C36,74 36,90 38,104" fill="none" stroke={s} strokeWidth={sw + 0.2} />
          <path d="M100,16 C132,16 154,30 160,55 C164,74 164,90 162,104" fill="none" stroke={s} strokeWidth={sw + 0.2} />
          <path d="M56,38 Q78,20 100,16 Q122,20 144,38" fill="none" stroke={s2} strokeWidth={sw * 0.6} opacity={0.45} />
        </>
      )}

      {/* ── FACE CONTOUR ── */}
      {/* Female: elegant V-shape with high cheekbones, tapered chin */}
      {/* Male: strong defined jaw with wider chin, sculpted cheekbones */}
      <path
        d={isFemale
          ? "M40,100 C38,114 38,128 42,144 C46,158 54,170 64,180 C72,188 82,196 92,204 Q100,210 108,204 C118,196 128,188 136,180 C146,170 154,158 158,144 C162,128 162,114 160,100"
          : isMale
            ? "M38,98 C36,112 36,128 38,146 C40,160 48,172 58,182 C66,190 76,196 88,202 Q100,208 112,202 C124,196 134,190 142,182 C152,172 160,160 162,146 C164,128 164,112 162,98"
            : "M38,102 C36,116 36,130 40,146 C44,158 52,170 62,180 C70,188 80,196 92,204 Q100,210 108,204 C118,196 128,188 138,180 C148,170 156,158 160,146 C164,130 164,116 162,102"}
        fill="none" stroke={s} strokeWidth={sw + 0.4} strokeLinejoin="round"
      />

      {/* Cheekbone highlights — high and defined */}
      <path d={isFemale ? "M42,96 Q52,92 64,90" : "M40,94 Q50,90 62,88"} fill="none" stroke={s2} strokeWidth={sw * 0.5} opacity={0.4} />
      <path d={isFemale ? "M158,96 Q148,92 136,90" : "M160,94 Q150,90 138,88"} fill="none" stroke={s2} strokeWidth={sw * 0.5} opacity={0.4} />
      {/* Cheekbone contour shadow */}
      <path d={isFemale ? "M46,108 Q56,114 68,118" : "M42,106 Q54,112 66,116"} fill="none" stroke={s2} strokeWidth={sw * 0.35} opacity={0.2} />
      <path d={isFemale ? "M154,108 Q144,114 132,118" : "M158,106 Q146,112 134,116"} fill="none" stroke={s2} strokeWidth={sw * 0.35} opacity={0.2} />

      {/* Male: strong jaw angle definition */}
      {isMale && (
        <>
          <path d="M48,178 L54,172 L60,178" fill="none" stroke={s2} strokeWidth={sw * 0.6} opacity={0.45} />
          <path d="M152,178 L146,172 L140,178" fill="none" stroke={s2} strokeWidth={sw * 0.6} opacity={0.45} />
        </>
      )}

      {/* ── EYEBROWS ── */}
      {isFemale ? (
        <>
          {/* Elegant high arch — groomed, tapered tail */}
          <path d="M56,66 Q64,56 76,55 Q84,56 90,60" fill="none" stroke={s} strokeWidth={sw + 0.5} strokeLinecap="round" />
          <path d="M110,60 Q116,56 124,55 Q136,56 144,66" fill="none" stroke={s} strokeWidth={sw + 0.5} strokeLinecap="round" />
          {/* Soft brow shadow */}
          <path d="M58,68 Q66,60 76,58 Q84,59 90,62" fill="none" stroke={s2} strokeWidth={sw * 0.3} opacity={0.25} />
          <path d="M110,62 Q116,59 124,58 Q134,60 142,68" fill="none" stroke={s2} strokeWidth={sw * 0.3} opacity={0.25} />
        </>
      ) : (
        <>
          {/* Male: strong straight brows — thicker, minimal arch */}
          <path d={isMale ? "M52,68 Q60,60 72,59 Q82,60 90,63" : "M54,68 Q62,60 72,59 Q80,60 88,62"} fill="none" stroke={s} strokeWidth={isMale ? sw + 0.8 : sw + 0.5} strokeLinecap="round" />
          <path d={isMale ? "M110,63 Q118,60 128,59 Q140,60 148,68" : "M112,62 Q120,60 128,59 Q138,60 146,68"} fill="none" stroke={s} strokeWidth={isMale ? sw + 0.8 : sw + 0.5} strokeLinecap="round" />
        </>
      )}

      {/* ── EYES — almond shape, golden ratio spacing ── */}
      {/* Left eye */}
      <path
        d={isFemale
          ? "M56,86 Q64,76 75,74 Q84,76 90,86 Q84,94 75,96 Q64,94 56,86 Z"
          : "M56,86 Q64,78 73,76 Q82,78 88,86 Q82,93 73,95 Q64,93 56,86 Z"}
        fill="none" stroke={s} strokeWidth={sw + 0.3} strokeLinejoin="round"
      />
      {/* Upper lid crease */}
      <path d={isFemale ? "M58,80 Q68,72 78,71 Q86,72 92,80" : "M58,82 Q66,74 76,73 Q84,74 90,82"} fill="none" stroke={s2} strokeWidth={sw * 0.5} opacity={0.45} />
      {/* Lower waterline */}
      <path d={isFemale ? "M62,92 Q74,96 84,90" : "M62,91 Q72,94 82,89"} fill="none" stroke={s2} strokeWidth={sw * 0.3} opacity={0.25} />
      {/* Iris — large and luminous */}
      <circle cx={isFemale ? 75 : 73} cy="85" r={isFemale ? 6 : 5.5} fill="none" stroke={s} strokeWidth={sw} />
      <circle cx={isFemale ? 75 : 73} cy="85" r="3" fill="none" stroke={s} strokeWidth={sw * 0.6} />
      <circle cx={isFemale ? 75 : 73} cy="85" r="1.5" fill={s} />
      {/* Catchlight — gives life to the eyes */}
      <circle cx={isFemale ? 77 : 75} cy="83.5" r="1.2" fill={dark ? IVORY : "#fff"} opacity="0.9" />
      <circle cx={isFemale ? 73 : 71} cy="87" r="0.6" fill={dark ? IVORY : "#fff"} opacity="0.5" />
      {/* Female: delicate lash fans */}
      {isFemale && (
        <>
          <line x1="57" y1="84" x2="53" y2="80" stroke={s} strokeWidth={sw * 0.5} strokeLinecap="round" opacity={0.6} />
          <line x1="59" y1="80" x2="56" y2="75" stroke={s} strokeWidth={sw * 0.45} strokeLinecap="round" opacity={0.5} />
          <line x1="63" y1="78" x2="61" y2="73" stroke={s} strokeWidth={sw * 0.4} strokeLinecap="round" opacity={0.4} />
          <line x1="68" y1="76" x2="67" y2="72" stroke={s} strokeWidth={sw * 0.35} strokeLinecap="round" opacity={0.35} />
          {/* Outer lash flick */}
          <line x1="88" y1="82" x2="92" y2="78" stroke={s} strokeWidth={sw * 0.45} strokeLinecap="round" opacity={0.5} />
        </>
      )}
      {/* Tear duct */}
      <path d={isFemale ? "M56,86 Q54,84 55,82" : "M56,86 Q54,84 55,83"} fill="none" stroke={s2} strokeWidth={sw * 0.4} opacity={0.4} />

      {/* Right eye — mirror */}
      <path
        d={isFemale
          ? "M110,86 Q116,76 125,74 Q136,76 144,86 Q136,94 125,96 Q116,94 110,86 Z"
          : "M112,86 Q118,78 127,76 Q136,78 144,86 Q136,93 127,95 Q118,93 112,86 Z"}
        fill="none" stroke={s} strokeWidth={sw + 0.3} strokeLinejoin="round"
      />
      <path d={isFemale ? "M108,80 Q114,72 122,71 Q132,72 142,80" : "M110,82 Q116,74 124,73 Q134,74 142,82"} fill="none" stroke={s2} strokeWidth={sw * 0.5} opacity={0.45} />
      <path d={isFemale ? "M116,92 Q126,96 138,90" : "M118,91 Q128,94 138,89"} fill="none" stroke={s2} strokeWidth={sw * 0.3} opacity={0.25} />
      <circle cx={isFemale ? 125 : 127} cy="85" r={isFemale ? 6 : 5.5} fill="none" stroke={s} strokeWidth={sw} />
      <circle cx={isFemale ? 125 : 127} cy="85" r="3" fill="none" stroke={s} strokeWidth={sw * 0.6} />
      <circle cx={isFemale ? 125 : 127} cy="85" r="1.5" fill={s} />
      <circle cx={isFemale ? 127 : 129} cy="83.5" r="1.2" fill={dark ? IVORY : "#fff"} opacity="0.9" />
      <circle cx={isFemale ? 123 : 125} cy="87" r="0.6" fill={dark ? IVORY : "#fff"} opacity="0.5" />
      {isFemale && (
        <>
          <line x1="143" y1="84" x2="147" y2="80" stroke={s} strokeWidth={sw * 0.5} strokeLinecap="round" opacity={0.6} />
          <line x1="141" y1="80" x2="144" y2="75" stroke={s} strokeWidth={sw * 0.45} strokeLinecap="round" opacity={0.5} />
          <line x1="137" y1="78" x2="139" y2="73" stroke={s} strokeWidth={sw * 0.4} strokeLinecap="round" opacity={0.4} />
          <line x1="132" y1="76" x2="133" y2="72" stroke={s} strokeWidth={sw * 0.35} strokeLinecap="round" opacity={0.35} />
          <line x1="112" y1="82" x2="108" y2="78" stroke={s} strokeWidth={sw * 0.45} strokeLinecap="round" opacity={0.5} />
        </>
      )}
      <path d={isFemale ? "M144,86 Q146,84 145,82" : "M144,86 Q146,84 145,83"} fill="none" stroke={s2} strokeWidth={sw * 0.4} opacity={0.4} />

      {/* ── NOSE — refined and proportional ── */}
      {/* Slim bridge */}
      <line x1={isFemale ? 95 : 93} y1="76" x2={isFemale ? 92 : 90} y2="118" stroke={s} strokeWidth={sw} strokeLinecap="round" />
      <line x1={isFemale ? 105 : 107} y1="76" x2={isFemale ? 108 : 110} y2="118" stroke={s} strokeWidth={sw} strokeLinecap="round" />
      {/* Bridge highlight */}
      <line x1="98" y1="80" x2="97" y2="114" stroke={s2} strokeWidth={sw * 0.3} opacity={0.2} />
      <line x1="102" y1="80" x2="103" y2="114" stroke={s2} strokeWidth={sw * 0.3} opacity={0.2} />
      {/* Nose tip — soft and refined */}
      <path d={isFemale
        ? "M92,118 Q88,126 84,129 Q88,133 94,134 Q98,133 100,131 Q102,133 106,134 Q112,133 116,129 Q112,126 108,118"
        : "M90,118 Q86,126 80,130 Q84,135 92,136 Q96,135 100,132 Q104,135 108,136 Q116,135 120,130 Q114,126 110,118"}
        fill="none" stroke={s} strokeWidth={sw + 0.1} strokeLinecap="round" strokeLinejoin="round"
      />
      {/* Nostril shadow */}
      <path d={isFemale ? "M86,130 Q88,128 90,130" : "M82,131 Q85,128 88,131"} fill="none" stroke={s2} strokeWidth={sw * 0.4} opacity={0.3} />
      <path d={isFemale ? "M110,130 Q112,128 114,130" : "M112,131 Q115,128 118,131"} fill="none" stroke={s2} strokeWidth={sw * 0.4} opacity={0.3} />

      {/* ── NASOLABIAL FOLDS — subtle ── */}
      <path d={isFemale ? "M84,129 Q78,140 74,152" : "M80,130 Q74,142 70,154"} fill="none" stroke={s2} strokeWidth={sw * 0.6} strokeLinecap="round" opacity={0.35} />
      <path d={isFemale ? "M116,129 Q122,140 126,152" : "M120,130 Q126,142 130,154"} fill="none" stroke={s2} strokeWidth={sw * 0.6} strokeLinecap="round" opacity={0.35} />

      {/* Philtrum — defined columns */}
      <line x1="96" y1="134" x2="95" y2="148" stroke={s2} strokeWidth={sw * 0.4} opacity={0.35} />
      <line x1="104" y1="134" x2="105" y2="148" stroke={s2} strokeWidth={sw * 0.4} opacity={0.35} />
      <path d="M95,138 Q97,144 100,145 Q103,144 105,138" fill="none" stroke={s2} strokeWidth={sw * 0.4} opacity={0.35} />

      {/* ── LIPS ── */}
      {isFemale ? (
        <>
          {/* Full, defined cupid's bow — slightly pouty */}
          <path d="M72,156 Q78,147 87,150 Q94,144 100,142 Q106,144 113,150 Q122,147 128,156" fill="none" stroke={s} strokeWidth={sw + 0.5} strokeLinecap="round" strokeLinejoin="round" />
          {/* Full lower lip */}
          <path d="M72,156 Q78,168 90,174 Q100,177 110,174 Q122,168 128,156" fill="none" stroke={s} strokeWidth={sw + 0.4} strokeLinecap="round" />
          {/* Lip line */}
          <path d="M75,156 Q88,160 100,160 Q112,160 125,156" fill="none" stroke={s} strokeWidth={sw * 0.4} opacity={0.45} />
          {/* Lower lip fullness highlight */}
          <path d="M82,164 Q92,170 100,171 Q108,170 118,164" fill="none" stroke={s2} strokeWidth={sw * 0.35} opacity={0.3} />
        </>
      ) : (
        <>
          {/* Male: defined but less full — strong shape */}
          <path d="M74,156 Q80,149 88,152 Q94,147 100,145 Q106,147 112,152 Q120,149 126,156" fill="none" stroke={s} strokeWidth={sw + 0.4} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M74,156 Q80,166 90,170 Q100,172 110,170 Q120,166 126,156" fill="none" stroke={s} strokeWidth={sw + 0.3} strokeLinecap="round" />
          <path d="M77,156 Q88,159 100,159 Q112,159 123,156" fill="none" stroke={s} strokeWidth={sw * 0.4} opacity={0.4} />
          <path d="M84,162 Q92,166 100,167 Q108,166 116,162" fill="none" stroke={s2} strokeWidth={sw * 0.3} opacity={0.25} />
        </>
      )}

      {/* Mentolabial sulcus */}
      <path d={isFemale ? "M78,178 Q90,183 100,184 Q110,183 122,178" : "M76,174 Q90,179 100,180 Q110,179 124,174"} fill="none" stroke={s2} strokeWidth={sw * 0.45} opacity={0.3} />

      {/* ── CHIN ── */}
      {isMale ? (
        <>
          {/* Male: strong squared chin with cleft hint */}
          <path d="M82,192 Q92,200 100,202 Q108,200 118,192" fill="none" stroke={s2} strokeWidth={sw * 0.5} opacity={0.35} />
          <ellipse cx="100" cy="196" rx="13" ry="5" fill="none" stroke={s2} strokeWidth={sw * 0.4} opacity={0.25} />
          {/* Subtle cleft */}
          <line x1="100" y1="192" x2="100" y2="198" stroke={s2} strokeWidth={sw * 0.3} opacity={0.2} />
        </>
      ) : (
        <>
          {/* Female: delicate pointed chin */}
          <path d={isFemale ? "M84,198 Q92,206 100,210 Q108,206 116,198" : "M82,196 Q92,204 100,206 Q108,204 118,196"} fill="none" stroke={s2} strokeWidth={sw * 0.5} opacity={0.35} />
          <ellipse cx="100" cy={isFemale ? 204 : 200} rx={isFemale ? 8 : 10} ry={isFemale ? 5 : 6} fill="none" stroke={s2} strokeWidth={sw * 0.35} opacity={0.2} />
        </>
      )}

      {/* ── EARS ── */}
      <path d="M38,76 Q30,80 28,92 Q27,104 30,112 Q34,118 38,114" fill="none" stroke={s} strokeWidth={sw} opacity={0.5} />
      <path d="M38,82 Q34,88 33,98 Q34,106 36,110" fill="none" stroke={s2} strokeWidth={sw * 0.35} opacity={0.3} />
      <path d="M162,76 Q170,80 172,92 Q173,104 170,112 Q166,118 162,114" fill="none" stroke={s} strokeWidth={sw} opacity={0.5} />
      <path d="M162,82 Q166,88 167,98 Q166,106 164,110" fill="none" stroke={s2} strokeWidth={sw * 0.35} opacity={0.3} />

      {/* ── NECK ── */}
      <path
        d={isFemale
          ? "M80,212 Q78,224 76,240 Q74,250 72,256"
          : isMale
            ? "M74,204 Q72,218 70,234 Q68,246 66,254"
            : "M76,208 Q74,220 72,236 Q70,248 68,254"}
        fill="none" stroke={s} strokeWidth={sw} strokeLinecap="round" opacity={0.5}
      />
      <path
        d={isFemale
          ? "M120,212 Q122,224 124,240 Q126,250 128,256"
          : isMale
            ? "M126,204 Q128,218 130,234 Q132,246 134,254"
            : "M124,208 Q126,220 128,236 Q130,248 132,254"}
        fill="none" stroke={s} strokeWidth={sw} strokeLinecap="round" opacity={0.5}
      />
      {/* Female: slim elegant neck */}
      {isFemale && (
        <path d="M42,256 Q72,250 100,252 Q128,250 158,256" fill="none" stroke={s2} strokeWidth={sw * 0.4} opacity={0.3} />
      )}
      {/* Male: Adam's apple + thicker neck */}
      {isMale && (
        <>
          <path d="M96,224 Q100,218 104,224" fill="none" stroke={s2} strokeWidth={sw * 0.5} opacity={0.35} />
          <path d="M38,254 Q68,248 100,250 Q132,248 162,254" fill="none" stroke={s2} strokeWidth={sw * 0.4} opacity={0.3} />
        </>
      )}
      {!isMale && !isFemale && (
        <path d="M40,254 Q70,248 100,250 Q130,248 160,254" fill="none" stroke={s2} strokeWidth={sw * 0.4} opacity={0.3} />
      )}

      {/* ── T-zone clinical overlay ── */}
      <path d="M84,48 L84,64 Q84,68 88,68 L112,68 Q116,68 116,64 L116,48" fill="none" stroke={s2} strokeWidth={0.3} strokeDasharray="1.5 2.5" opacity={0.15} />
      <path d="M88,68 L88,130 Q88,132 90,132 L110,132 Q112,132 112,130 L112,68" fill="none" stroke={s2} strokeWidth={0.3} strokeDasharray="1.5 2.5" opacity={0.15} />

      {/* ── Proportion ticks ── */}
      {[46, 64, 92, 132, 156, 178, 202].map((y, i) => (
        <line key={i} x1="97" y1={y} x2="103" y2={y} stroke={s2} strokeWidth={0.25} opacity={0.2} />
      ))}

      {/* ── Corner brackets ── */}
      <path d="M14,14 L14,26" stroke={s2} strokeWidth={0.4} opacity={0.25} />
      <path d="M14,14 L26,14" stroke={s2} strokeWidth={0.4} opacity={0.25} />
      <path d="M186,14 L186,26" stroke={s2} strokeWidth={0.4} opacity={0.25} />
      <path d="M186,14 L174,14" stroke={s2} strokeWidth={0.4} opacity={0.25} />
      <path d="M14,246 L14,234" stroke={s2} strokeWidth={0.4} opacity={0.25} />
      <path d="M14,246 L26,246" stroke={s2} strokeWidth={0.4} opacity={0.25} />
      <path d="M186,246 L186,234" stroke={s2} strokeWidth={0.4} opacity={0.25} />
      <path d="M186,246 L174,246" stroke={s2} strokeWidth={0.4} opacity={0.25} />
    </svg>
  );
}
