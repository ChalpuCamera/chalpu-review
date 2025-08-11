'use client';

import React from 'react';
import { EnhancedSlider } from '@/components/ui/enhanced-slider';
import { Button } from '@/components/ui/button';

interface FeedbackSliderProps {
  label: string;
  leftLabel: string;
  rightLabel: string;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  onReset?: () => void;
  sliderColor?: string;
}

export function FeedbackSlider({
  label,
  leftLabel,
  rightLabel,
  value,
  onChange,
  disabled = false,
  onReset,
}: FeedbackSliderProps) {
  const handleSliderChange = (values: number[]) => {
    const normalizedValue = (values[0] - 50) / 25; // Convert 0-100 to -2 to +2
    onChange(normalizedValue);
  };

  const displayValue = Math.round((value + 2) * 25); // Convert -2 to +2 to 0-100 for display

  // 모든 슬라이더를 파란색으로 통일
  const colors = {
    track: "bg-blue-100",
    thumb: "bg-blue-600",
    activeTrack: "bg-blue-500"
  };


  return (
    <div className="space-y-4 p-4 bg-white border-2 border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{label}</h3>
        {onReset && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onReset}
            disabled={disabled || value === 0}
            className="border-gray-300 hover:bg-gray-50"
          >
            리셋
          </Button>
        )}
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between text-sm font-medium text-gray-700">
          <span className="px-2 py-1 bg-gray-100 rounded">{leftLabel}</span>
          <span className="px-2 py-1 bg-gray-100 rounded">{rightLabel}</span>
        </div>
        
        <div className="px-4 py-2">
          <EnhancedSlider
            value={[displayValue]}
            onValueChange={handleSliderChange}
            min={0}
            max={100}
            step={1}
            disabled={disabled}
            className="w-full"
            trackColor={colors.track}
            thumbColor={colors.thumb}
            activeTrackColor={colors.activeTrack}
          />
        </div>
      </div>
    </div>
  );
}