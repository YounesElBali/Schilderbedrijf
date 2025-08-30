import React, { ReactNode } from "react";

const toneClasses = {
  default: "bg-gray-100 text-gray-800",
  green: "bg-green-100 text-green-800",
  blue: "bg-blue-100 text-blue-800",
  red: "bg-red-100 text-red-800",
} as const;

type Tone = keyof typeof toneClasses;

interface BadgeProps {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}

export function Badge({ children, tone = "default", className }: BadgeProps) {
  return (
    <span className={`text-xs px-2 py-1 rounded ${toneClasses[tone]} ${className ?? ""}`}>
      {children}
    </span>
  );
}
