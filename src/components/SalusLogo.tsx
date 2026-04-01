interface SalusLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { width: 32, height: 40 },
  md: { width: 48, height: 60 },
  lg: { width: 140, height: 180 },
};

export default function SalusLogo({ className, size = "md" }: SalusLogoProps) {
  const { width, height } = sizes[size];

  return (
    <svg
      viewBox="0 0 100 125"
      fill="none"
      width={width}
      height={height}
      className={className}
    >
      <path
        d="M50 5L10 30V85L50 120L90 85V30Z"
        stroke="#C9A84C"
        strokeWidth="2.5"
        fill="none"
      />
      <line
        x1="50" y1="30" x2="50" y2="95"
        stroke="#C9A84C"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="50" cy="27" r="3.5" fill="#C9A84C" />
      <path
        d="M50 42C50 42 36 38 32 44C28 50 38 52 50 52"
        stroke="#C9A84C"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M50 52C50 52 64 48 68 54C72 60 62 62 50 62"
        stroke="#C9A84C"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M50 62C50 62 36 58 32 64C28 70 38 72 50 72"
        stroke="#C9A84C"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M50 72C50 72 64 68 68 74C72 80 62 82 50 82"
        stroke="#C9A84C"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M35 38C28 32 22 34 22 34L32 42"
        stroke="#C9A84C"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M30 36C26 28 18 28 18 28"
        stroke="#C9A84C"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M65 38C72 32 78 34 78 34L68 42"
        stroke="#C9A84C"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M70 36C74 28 82 28 82 28"
        stroke="#C9A84C"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
