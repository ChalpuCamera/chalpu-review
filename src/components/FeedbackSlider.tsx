'use client';

import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

interface FeedbackSliderProps {
  label: string;
  leftLabel: string;
  rightLabel: string;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  onReset?: () => void;
}

export function FeedbackSlider({
  label,
  leftLabel,
  rightLabel,
  value,
  onChange,
  disabled = false,
  onReset
}: FeedbackSliderProps) {
  const handleSliderChange = (values: number[]) => {
    const normalizedValue = (values[0] - 50) / 25; // Convert 0-100 to -2 to +2
    onChange(normalizedValue);
  };

  const displayValue = Math.round((value + 2) * 25); // Convert -2 to +2 to 0-100 for display

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{label}</h3>
        {onReset && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onReset}
            disabled={disabled}
          >
            리셋
          </Button>
        )}
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between text-sm text-gray-600">
          <span>{leftLabel}</span>
          <span>{rightLabel}</span>
        </div>
        
        <div className="px-2">
          <Slider
            value={[displayValue]}
            onValueChange={handleSliderChange}
            min={0}
            max={100}
            step={1}
            disabled={disabled}
            className="w-full"
          />
        </div>
        
        <div className="text-center">
          <span className="text-sm font-medium">
            현재 값: {value.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
}