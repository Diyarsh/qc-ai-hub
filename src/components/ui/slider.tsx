import * as React from "react";
import { cn } from "@/lib/utils";

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  value: number[];
  onValueChange: (value: number[]) => void;
}

export function Slider({ value, onValueChange, className, min = 0, max = 1, step = 0.1, ...props }: SliderProps) {
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
      className={cn(
        "w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer",
        "accent-blue-600",
        className
      )}
      {...props}
    />
  );
}

