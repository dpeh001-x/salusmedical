"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#000B22]/50 backdrop-blur-lg border-b border-gold/[0.12]">
      <div className="container mx-auto flex items-center justify-between h-[72px] px-6 md:px-10">
        <Link href="/" className="flex items-center gap-3">
          <Image
              src="/images/salus-shield.webp"
              alt="Salus Medical"
              width={36}
              height={43}
              className="h-10 w-auto"
              style={{
                filter:
                  "drop-shadow(0 0 3px rgba(255,255,255,0.9)) drop-shadow(0 0 3px rgba(255,255,255,0.6))",
              }}
              unoptimized
            />
          <span className="font-display text-[16px] font-semibold tracking-[3px] text-[#F4DC8B] [text-shadow:0_0_14px_rgba(201,168,76,0.35),0_1px_2px_rgba(0,0,0,0.5)]">
            SALUS MEDICAL
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link
            href="#services"
            className="text-slate-muted text-xs tracking-[1.5px] uppercase hover:text-gold transition-colors"
          >
            Services
          </Link>
          <Link
            href="#philosophy"
            className="text-slate-muted text-xs tracking-[1.5px] uppercase hover:text-gold transition-colors"
          >
            About
          </Link>
          <Link
            href="#contact"
            className="inline-block bg-gold text-navy font-semibold text-[10px] tracking-[1.8px] uppercase px-5 py-2 rounded-[3px] border-[1.5px] border-gold hover:bg-gold-light hover:border-gold-light transition-all"
          >
            Book Now
          </Link>
        </div>

        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gold/[0.12] bg-navy py-4 px-6 animate-fade-in">
          <div className="flex flex-col gap-1">
            <Link
              href="#services"
              className="px-4 py-3 text-xs tracking-[1.5px] uppercase text-slate-muted hover:text-gold transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              href="#philosophy"
              className="px-4 py-3 text-xs tracking-[1.5px] uppercase text-slate-muted hover:text-gold transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="#contact"
              className="px-4 py-3 text-xs tracking-[1.5px] uppercase text-slate-muted hover:text-gold transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              href="#contact"
              className="inline-flex items-center justify-center bg-gold text-navy font-semibold text-[10px] tracking-[1.8px] uppercase px-5 py-2.5 rounded-[3px] mt-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Book Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
