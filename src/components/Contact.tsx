"use client";

export default function Contact() {
  return (
    <section id="contact" className="py-[90px] px-5 bg-navy-light">
      <p className="font-body text-[11px] tracking-[5px] uppercase text-gold text-center mb-2.5 font-medium">
        Get in touch
      </p>
      <h2 className="font-display text-[clamp(24px,3.5vw,38px)] text-center mb-3 font-semibold text-white">
        Book a Consultation
      </h2>
      <p className="font-body text-center text-slate-muted text-sm leading-[1.8] font-light max-w-[500px] mx-auto mb-10">
        For service details, partnership enquiries, or scheduling — fill in the
        form below and our team will be in touch shortly.
      </p>

      <div className="max-w-[600px] mx-auto">
        <form onSubmit={(e) => e.preventDefault()} className="relative bg-[#003267] border border-gold/[0.12] rounded-[5px] p-8 px-6 overflow-hidden mt-7 space-y-3.5">
          <div className="absolute top-0 left-0 w-full h-[2.5px] bg-gradient-to-r from-gold/20 via-gold to-gold/20" />
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
                Phone <span className="text-gold text-[10px] ml-[2px]">*</span>
              </label>
              <input
                type="tel"
                placeholder="+65"
                className="bg-navy-input border border-gold/[0.12] rounded px-3.5 py-[11px] text-[13px] text-[#F5F3ED] font-body outline-none w-full transition-colors focus:border-gold placeholder:text-slate-muted/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="flex flex-col gap-[5px]">
              <label className="font-body text-[11px] text-slate-muted tracking-[0.6px]">
                Preferred Date <span className="text-gold text-[10px] ml-[2px]">*</span>
              </label>
              <input
                type="date"
                className="bg-navy-input border border-gold/[0.12] rounded px-3.5 py-[11px] text-[13px] text-[#F5F3ED] font-body outline-none w-full transition-colors focus:border-gold [color-scheme:dark]"
              />
            </div>
            <div className="flex flex-col gap-[5px]">
              <label className="font-body text-[11px] text-slate-muted tracking-[0.6px]">
                Preferred Time <span className="text-gold text-[10px] ml-[2px]">*</span>
              </label>
              <select className="bg-navy-input border border-gold/[0.12] rounded px-3.5 py-[11px] text-[13px] text-[#F5F3ED] font-body outline-none w-full transition-colors focus:border-gold appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2210%22%20height%3D%2210%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%238A9BB5%22%20stroke-width%3D%222.5%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_10px_center] pr-7">
                <option value="">Select a time</option>
                <option>9:00 AM</option>
                <option>9:30 AM</option>
                <option>10:00 AM</option>
                <option>10:30 AM</option>
                <option>11:00 AM</option>
                <option>11:30 AM</option>
                <option>12:00 PM</option>
                <option>12:30 PM</option>
                <option>1:00 PM</option>
                <option>1:30 PM</option>
                <option>2:00 PM</option>
                <option>2:30 PM</option>
                <option>3:00 PM</option>
                <option>3:30 PM</option>
                <option>4:00 PM</option>
                <option>4:30 PM</option>
                <option>5:00 PM</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-[5px]">
            <label className="font-body text-[11px] text-slate-muted tracking-[0.6px]">
              Service
            </label>
            <select className="bg-navy-input border border-gold/[0.12] rounded px-3.5 py-[11px] text-[13px] text-[#F5F3ED] font-body outline-none w-full transition-colors focus:border-gold appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2210%22%20height%3D%2210%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%238A9BB5%22%20stroke-width%3D%222.5%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_10px_center] pr-7">
              <option value="">Select a service</option>
              <option>Child — Paediatrics</option>
              <option>General Health — Primary Care</option>
              <option>Sexual Wellness — Intimate Health</option>
              <option>Legacy — Planning for the Future</option>
              <option>Skin — Dermatology</option>
            </select>
          </div>

          <div className="flex flex-col gap-[5px]">
            <label className="font-body text-[11px] text-slate-muted tracking-[0.6px]">
              Message
            </label>
            <textarea
              placeholder="Any details you'd like us to know..."
              className="bg-navy-input border border-gold/[0.12] rounded px-3.5 py-[11px] text-[13px] text-[#F5F3ED] font-body outline-none w-full transition-colors focus:border-gold resize-y min-h-[80px] placeholder:text-slate-muted/50"
            />
          </div>

          <div className="mt-[22px] text-center">
            <button
              type="submit"
              className="bg-gold text-[#0B1A33] font-semibold text-xs tracking-[1.8px] uppercase px-[30px] py-3 rounded-[3px] border-[1.5px] border-gold hover:bg-gold-light hover:border-gold-light transition-all w-full max-w-[260px]"
            >
              Confirm Appointment
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
