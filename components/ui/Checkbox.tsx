import React from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
}

export const Checkbox = ({ checked, onChange }: CheckboxProps) => {
  return (
    <button
      onClick={onChange}
      className={`
        w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 border
        ${checked 
          ? 'bg-electric border-electric text-background' 
          : 'bg-surfaceHighlight border-slate-700 text-transparent hover:border-slate-500'
        }
      `}
    >
      <Check size={16} strokeWidth={4} />
    </button>
  );
};