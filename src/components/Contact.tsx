"use client";

export default function Contact() {
  return (
    <section id="contact" className="py-[90px] px-5 bg-navy-light">
      <p className="font-body text-[11px] tracking-[5px] uppercase text-gold text-center mb-2.5 font-medium">
        Contact us
      </p>
      <h2 className="font-display text-[clamp(24px,3.5vw,38px)] text-center mb-3 font-semibold text-white">
        Get in Touch
      </h2>
      <p className="font-body text-center text-slate-muted text-sm leading-[1.8] font-light max-w-[500px] mx-auto mb-10">
        For service details, partnership enquiries, or any other needs, simply
        send us an enquiry or email. Our professional team will be in touch with
        you shortly.
      </p>

      <div className="max-w-[600px] mx-auto">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-3.5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="flex flex-col gap-[5px]">
              <label className="font-body text-[11px] text-slate-muted tracking-[0.6px]">
                First Name <span className="text-gold text-[10px] ml-[2px]">*</span>
              </label>
              <input
                type="text"
                placeholder="First name"
                className="bg-navy-input border border-gold/[0.12] rounded px-3.5 py-[11px] text-[13px] text-[#F5F3ED] font-body outline-none w-full transition-colors focus:border-gold placeholder:text-slate-muted/50"
              />
            </div>
            <div className="flex flex-col gap-[5px]">
              <label className="font-body text-[11px] text-slate-muted tracking-[0.6px]">
                Last Name <span className="text-gold text-[10px] ml-[2px]">*</span>
              </label>
              <input
                type="text"
                placeholder="Last name"
                className="bg-navy-input border border-gold/[0.12] rounded px-3.5 py-[11px] text-[13px] text-[#F5F3ED] font-body outline-none w-full transition-colors focus:border-gold placeholder:text-slate-muted/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="flex flex-col gap-[5px]">
              <label className="font-body text-[11px] text-slate-muted tracking-[0.6px]">
                Email <span className="text-gold text-[10px] ml-[2px]">*</span>
              </label>
              <input
                type="email"
                placeholder="you@email.com"
                className="bg-navy-input border border-gold/[0.12] rounded px-3.5 py-[11px] text-[13px] text-[#F5F3ED] font-body outline-none w-full transition-colors focus:border-gold placeholder:text-slate-muted/50"
              />
            </div>
            <div className="flex flex-col gap-[5px]">
              <label className="font-body text-[11px] text-slate-muted tracking-[0.6px]">
                Phone
              </label>
              <input
                type="tel"
                placeholder="+65"
                className="bg-navy-input border border-gold/[0.12] rounded px-3.5 py-[11px] text-[13px] text-[#F5F3ED] font-body outline-none w-full transition-colors focus:border-gold placeholder:text-slate-muted/50"
              />
            </div>
          </div>

          <div className="flex flex-col gap-[5px]">
            <label className="font-body text-[11px] text-slate-muted tracking-[0.6px]">
              Message
            </label>
            <textarea
              placeholder="How can we help you?"
              className="bg-navy-input border border-gold/[0.12] rounded px-3.5 py-[11px] text-[13px] text-[#F5F3ED] font-body outline-none w-full transition-colors focus:border-gold resize-y min-h-[80px] placeholder:text-slate-muted/50"
            />
          </div>

          <div className="mt-[22px] text-center">
            <button
              type="submit"
              className="bg-gold text-[#0B1A33] font-semibold text-xs tracking-[1.8px] uppercase px-[30px] py-3 rounded-[3px] border-[1.5px] border-gold hover:bg-gold-light hover:border-gold-light transition-all w-full max-w-[260px]"
            >
              Send Enquiry
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
