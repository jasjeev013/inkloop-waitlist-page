interface LogoProps {
  variant?: "full" | "icon"
  size?: "sm" | "md" | "lg"
  className?: string
}

export function Logo({ variant = "full", size = "md", className = "" }: LogoProps) {
  const textSizeClasses: Record<"sm" | "md" | "lg", string> = {
    sm: variant === "full" ? "text-xl sm:text-2xl" : "text-lg sm:text-xl",
    md: variant === "full" ? "text-2xl sm:text-3xl md:text-4xl" : "text-xl sm:text-2xl md:text-3xl",
    lg: variant === "full" ? "text-3xl sm:text-4xl md:text-5xl lg:text-6xl" : "text-2xl sm:text-3xl md:text-4xl lg:text-5xl",
  }

  const imageSizeClasses: Record<"sm" | "md" | "lg", string> = {
    sm: "w-6 h-6 sm:w-8 sm:h-8",
    md: "w-8 h-8 sm:w-10 sm:h-10 md:w-9 md:h-9",
    lg: "w-6 h-6 sm:w-6 sm:h-6 md:w-9 md:h-9 lg:w-13 lg:h-13",
  }

  if (variant === "icon") {
    return (
      <div
        className={`font-lacquer ${textSizeClasses[size]} font-black text-gray-900 ${className}`}
        style={{
          fontFamily: '"Lacquer", "Impact", "Arial Black", cursive',
          fontWeight: 900,
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        0
      </div>
    )
  }

  return (
    <div className={`flex items-center ${textSizeClasses[size]} font-bold text-gray-900 ${className}`}>
      <span className="font-sf-pro">inkl</span>
      <img
        src="/inkloop.png"
        alt="Inkloop Logo"
        className={`inline-block mt-1 ${imageSizeClasses[size]}`}
      />
      <span className="font-sf-pro">0p</span>
    </div>
  )
}
