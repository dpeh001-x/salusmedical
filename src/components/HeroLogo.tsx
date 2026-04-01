export default function HeroLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 250"
      fill="none"
      className={className}
      width={140}
      height={180}
    >
      <defs>
        <linearGradient id="gS" x1="100" y1="0" x2="100" y2="250" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E8D48B" />
          <stop offset="100%" stopColor="#8B6914" />
        </linearGradient>
      </defs>
      <path d="M100 8L16 50V165L100 238L184 165V50Z" stroke="url(#gS)" strokeWidth="3.5" fill="none" />
      <path d="M100 18L26 55V160L100 228L174 160V55Z" stroke="url(#gS)" strokeWidth="1" fill="none" opacity=".35" />
      <line x1="100" y1="55" x2="100" y2="190" stroke="url(#gS)" strokeWidth="4" strokeLinecap="round" />
      <circle cx="100" cy="48" r="6" fill="url(#gS)" />
      <path d="M100 80C100 80 70 72 62 82C54 92 72 96 100 96" stroke="url(#gS)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M100 96C100 96 130 88 138 98C146 108 128 112 100 112" stroke="url(#gS)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M100 112C100 112 70 104 62 114C54 124 72 128 100 128" stroke="url(#gS)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M100 128C100 128 130 120 138 130C146 140 128 144 100 144" stroke="url(#gS)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M100 144C100 144 70 136 62 146C54 156 72 160 100 160" stroke="url(#gS)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M100 160C100 160 130 152 138 162C146 172 128 176 100 176" stroke="url(#gS)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M68 70C56 58 42 62 42 62L60 78" stroke="url(#gS)" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M60 64C52 48 36 46 36 46" stroke="url(#gS)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M55 60C50 44 34 38 34 38" stroke="url(#gS)" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M132 70C144 58 158 62 158 62L140 78" stroke="url(#gS)" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M140 64C148 48 164 46 164 46" stroke="url(#gS)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M145 60C150 44 166 38 166 38" stroke="url(#gS)" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}
