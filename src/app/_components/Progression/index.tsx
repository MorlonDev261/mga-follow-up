"use client";

import * as React from "react";
import { Progress } from "@/components/ui/progress";

type ProgressProps = {
  className?: string;
  debut?: number;
  value: number;
  progressColor?: string;
  timer?: number;
};

export default function Progression({ className, debut = 0, value, progressColor, timer = 500 }: ProgressProps) {
  const [progress, setProgress] = React.useState(debut);

  React.useEffect(() => {
    const execute = setTimeout(() => setProgress(value), timer);
    return () => clearTimeout(execute);
  }, [value, timer]); // Ajout de `value` et `timer` comme dépendances

  return <Progress value={progress} progressColor={progressColor} className={className} />;
}
