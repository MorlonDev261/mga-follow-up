"use client"

import * as React from "react"
import { Progress } from "@/components/ui/progress"

type ProgressProps {
  className?: string;
  debut?: number;
  value: number;
  timer?: number;
}

export default function ProgressDemo({ className, debut= 0, value, timer= 500 }: ProgressProps) {
  const [progress, setProgress] = React.useState(debut)

  React.useEffect(() => {
    const execute = setTimeout(() => setProgress(value), timer)
    return () => clearTimeout(execute)
  }, [])

  return <Progress value={progress} className={className} />
}
