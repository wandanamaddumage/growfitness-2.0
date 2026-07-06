import React from 'react';
import { Image as ImageIcon } from "lucide-react";

interface PhotoPlaceholderProps {
  label: string;
  className?: string;
}

export const PhotoPlaceholder: React.FC<PhotoPlaceholderProps> = ({ label, className = "" }) => (
  <div
    className={`w-full h-full flex flex-col items-center justify-center gap-2.5 ${className}`}
    style={{ background: "var(--gf-green-100)" }}
  >
    <ImageIcon size={32} strokeWidth={1.5} color="#23b685" />
    <p
      className="text-xs font-bold uppercase tracking-widest"
      style={{ color: "var(--gf-green)" }}
    >
      {label}
    </p>
  </div>
);