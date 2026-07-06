import React from 'react';
import { Star } from "lucide-react";

export const StarRow: React.FC = () => (
  <div className="flex gap-0.5 mb-5">
    {[...Array(5)].map((_, i) => (
      <Star key={i} size={18} fill="#f5b942" stroke="#f5b942" />
    ))}
  </div>
);