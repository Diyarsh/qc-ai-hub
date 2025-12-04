import * as React from "react";
import { cn } from "@/lib/utils";

interface SliderProps {
  value: number[];
  onValueChange: (value: number[]) => void;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

export function Slider({ value, onValueChange, className, min = 0, max = 1, step = 0.1, disabled, ...props }: SliderProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange([parseFloat(e.target.value)]);
  };

  return (
    <input
      type="range"
      value={value[0]}
      onChange={handleChange}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      className={cn(
        "w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer",
        "accent-blue-600",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      {...props}
    />
  );
}
