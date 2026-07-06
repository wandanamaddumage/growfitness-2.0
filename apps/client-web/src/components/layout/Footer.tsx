import React from 'react';
import { Facebook, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from "lucide-react";

const socials = [
  { Icon: Facebook, url: 'https://www.facebook.com/grow.fitness.lk' },
  { Icon: Instagram, url: 'https://www.instagram.com/growfitnesslk' },
  { Icon: Linkedin, url: 'https://www.linkedin.com/company/grow-fitnesslk/' },
  { Icon: Youtube, url: 'https://youtube.com/@growfitnesslk' },
];

export const Footer: React.FC = () => (
  <footer className="px-6 md:px-12 pt-16 pb-10" style={{ background: "var(--gf-green-deep)" }}>
    <div className="max-w-[1240px] mx-auto">
      <div className="grid md:grid-cols-[1fr_auto] gap-16 mb-14">
        <div className="max-w-[380px]">
          <div className="flex items-center gap-2 mb-5">
            <svg width="60" height="60" viewBox="0 0 100 100">
              <image href="/images/Grow VI Elements/Logos/New logo white.png" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }} />
            </svg>
            {/* <span style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "white" }}>GROW FITNESS</span> */}
          </div>
          <p className="mb-7" style={{ fontSize: 15, lineHeight: 1.65, color: "var(--gf-leaf)" }}>
            Empowering children through fitness and fun. Building healthy habits for a lifetime one session at a time.
          </p>
          <div className="flex gap-3">
            {socials.map(({ Icon, url }, i) => (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ border: "1.5px solid rgba(255,255,255,0.2)" }}
              >
                <Icon size={16} color="var(--gf-leaf)" strokeWidth={2} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="font-bold text-xs uppercase tracking-widest mb-6" style={{ color: "var(--gf-leaf)" }}>Contact</p>
          <div className="flex flex-col gap-3.5">
            <div className="flex items-center gap-3">
              <Mail size={16} color="var(--gf-green)" strokeWidth={2} />
              <p className="text-[15px] text-white">growfitnesslk@gmail.com</p>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={16} color="var(--gf-green)" strokeWidth={2} />
              <p className="text-[15px] text-white">0770 569 954</p>
            </div>
            <div className="flex items-center gap-3">
              <MapPin size={16} color="var(--gf-green)" strokeWidth={2} />
              <p className="text-[15px] text-white">Colombo, Sri Lanka</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-5 flex-wrap pt-7" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <p className="text-[13px]" style={{ color: "var(--fg-3)" }}>© 2026 GROW Kids Fitness Center. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="text-[13px]" style={{ color: "var(--fg-3)" }}>Privacy Policy</a>
          <a href="#" className="text-[13px]" style={{ color: "var(--fg-3)" }}>Terms of Service</a>
          <a href="#" className="text-[13px]" style={{ color: "var(--fg-3)" }}>Cookie Policy</a>
        </div>
      </div>
    </div>
  </footer>
);

export function DashboardFooter() {
  return (
    <footer className="border-t border-border/60 bg-background px-6 py-4">
      <div className="flex flex-col gap-2 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>&copy; {new Date().getFullYear()} GrowFitness</p>
        <p>Dashboard for coaches and parents</p>
      </div>
    </footer>
  );
}