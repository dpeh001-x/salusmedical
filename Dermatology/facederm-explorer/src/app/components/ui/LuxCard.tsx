"use client";

export default function LuxCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-gradient-to-br from-ivory to-ivory2 border border-gold-lt rounded p-4 sm:p-5 md:p-6 mb-4 shadow-[0_2px_24px_rgba(139,104,32,0.07)] ${className}`}
    >
      {children}
    </div>
  );
}
