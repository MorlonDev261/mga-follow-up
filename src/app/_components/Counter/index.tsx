"use client";

import CountUp from "react-countup";

interface CounterProps {
  start?: number;
  end: number;
  duration?: number;
}

export default function Counter({
  start = 0,
  end,
  duration = 2
}: CounterProps) {
  
  return (
    <CountUp
      start={start}
      end={end}
      duration={duration}
      separator=","
    />
  );
}
