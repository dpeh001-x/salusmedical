export default function Philosophy() {
  return (
    <section id="philosophy" className="py-[90px] px-5 bg-navy">
      <p className="font-body text-[11px] tracking-[5px] uppercase text-gold text-center mb-2.5 font-medium">
        Our philosophy
      </p>
      <h2 className="font-display text-[clamp(24px,3.5vw,38px)] text-center mb-3 font-semibold text-white">
        The Salus promise
      </h2>
      <div className="max-w-[660px] mx-auto text-center relative px-5">
        <span className="absolute top-[-22px] left-[-4px] text-[68px] text-gold/20 font-display leading-none">
          &ldquo;
        </span>
        <p className="font-display text-[clamp(18px,2.5vw,26px)] leading-[1.7] italic text-[#F5F3ED]">
          In the tradition of Salus, the Roman goddess of safety and well-being,
          we pledge to guard your health with the same reverence the ancients
          held for the sanctity of life.
        </p>
        <p className="font-body text-xs text-gold tracking-[3px] uppercase text-center mt-[18px]">
          The Salus Medical Team
        </p>
      </div>
    </section>
  );
}
