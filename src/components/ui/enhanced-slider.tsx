'use client';

import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '@/lib/utils';

interface EnhancedSliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  trackColor?: string;
  thumbColor?: string;
  activeTrackColor?: string;
}

const EnhancedSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  EnhancedSliderProps
>(({ className, trackColor = "bg-gray-200", thumbColor = "bg-blue-600", activeTrackColor = "bg-blue-600", ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track
      className={cn(
        "relative h-6 w-full grow overflow-hidden rounded-full",
        trackColor
      )}
    >
      <SliderPrimitive.Range 
        className={cn(
          "absolute h-full",
          activeTrackColor
        )} 
      />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className={cn(
        "block h-10 w-10 rounded-full border-4 border-white shadow-xl ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer hover:scale-110 active:scale-95",
        thumbColor
      )}
    />
  </SliderPrimitive.Root>
));
EnhancedSlider.displayName = SliderPrimitive.Root.displayName;

export { EnhancedSlider };