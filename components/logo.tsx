import type React from "react"
import { cn } from "@/lib/utils"

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  showWordmark?: boolean
  wordmarkClassName?: string
  iconClassName?: string
  containerClassName?: string
}

export function Logo({
  showWordmark = true,
  className,
  wordmarkClassName,
  iconClassName,
  containerClassName,
  ...props
}: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", containerClassName || className)}>
      <svg
        width="30"
        height="23"
        viewBox="0 0 30 23"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("fill-current text-gold", iconClassName)} // Ensure fill uses text color
        aria-label="Baliukonis Logo Icon"
        {...props}
      >
        <rect x="11.25" y="0" width="7.5" height="6" rx="1" />
        <rect x="7.5" y="7.5" width="7.5" height="6" rx="1" />
        <rect x="15" y="7.5" width="7.5" height="6" rx="1" />
        <rect x="3.75" y="15" width="7.5" height="6" rx="1" />
        <rect x="11.25" y="15" width="7.5" height="6" rx="1" />
        <rect x="18.75" y="15" width="7.5" height="6" rx="1" />
      </svg>
      {showWordmark && <span className={cn("font-semibold text-xl text-gold", wordmarkClassName)}>Baliukonis</span>}
    </div>
  )
}
