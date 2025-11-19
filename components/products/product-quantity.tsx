'use client'

import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

interface ProductQuantityProps {
  min?: number;
  max?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
}

export default function ProductQuantity({ min = 1, max = 999, defaultValue = 1, onChange }: ProductQuantityProps) {
  const [quantity, setQuantity] = useState(defaultValue);

  const updateQuantity = (newValue: number) => {
    setQuantity(newValue);
    onChange?.(newValue);
  };

  const increment = () => {
    if (quantity < max) {
      updateQuantity(quantity + 1);
    }
  };

  const decrement = () => {
    if (quantity > min) {
      updateQuantity(quantity - 1);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= min && value <= max) {
      updateQuantity(value);
    }
  };

  return (
    <div className="flex items-center border border-border rounded-lg">
      <button 
        onClick={decrement}
        disabled={quantity <= min}
        className="px-4 py-3 hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Minus className="w-4 h-4" />
      </button>
      <input
        type="number"
        min={min}
        max={max}
        value={quantity}
        onChange={handleChange}
        className="w-20 px-2 py-3 text-center border-x border-border bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button 
        onClick={increment}
        disabled={quantity >= max}
        className="px-4 py-3 hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
