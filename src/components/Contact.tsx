"use client";

import { useState } from "react";
import { CustomSelect, CustomDatePicker, type SelectOption } from "@/components/CustomFormElements";

const timeOptions: SelectOption[] = [
  { value: "", label: "Select a time" },
  ...["9:00 AM","9:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM","12:00 PM","12:30 PM","1:00 PM","1:30 PM","2:00 PM","2:30 PM","3:00 PM","3:30 PM","4:00 PM","4:30 PM","5:00 PM"].map((t) => ({ value: t, label: t })),
];

const serviceOptions: SelectOption[] = [
  { value: "", label: "Select a service" },
  { value: "Child — Paediatrics", label: "Child — Paediatrics" },
  { value: "General Health — Primary Care", label: "General Health — Primary Care" },
  { value: "Sexual Wellness — Intimate Health", label: "Sexual Wellness — Intimate Health" },
  { value: "Legacy — Planning for the Future", label: "Legacy — Planning for the Future" },
  { value: "Skin — Dermatology", label: "Skin — Dermatology" },
];

export default function Contact() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [service, setService] = useState("");

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
              <CustomDatePicker value={date} onChange={setDate} />
            </div>
            <div className="flex flex-col gap-[5px]">
              <label className="font-body text-[11px] text-slate-muted tracking-[0.6px]">
                Preferred Time <span className="text-gold text-[10px] ml-[2px]">*</span>
              </label>
              <CustomSelect value={time} onChange={setTime} options={timeOptions} placeholder="Select a time" />
            </div>
          </div>

          <div className="flex flex-col gap-[5px]">
            <label className="font-body text-[11px] text-slate-muted tracking-[0.6px]">
              Service
            </label>
            <CustomSelect value={service} onChange={setService} options={serviceOptions} placeholder="Select a service" />
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
