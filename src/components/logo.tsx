interface LogoProps {
  variant?: "full" | "icon"
  size?: "sm" | "md" | "lg"
  className?: string
}

export function Logo({ variant = "full", size = "md", className = "" }: LogoProps) {
  const sizeClasses = {
    sm: variant === "full" ? "text-2xl" : "text-xl",
    md: variant === "full" ? "text-4xl" : "text-3xl",
    lg: variant === "full" ? "text-6xl" : "text-5xl",
  }

  if (variant === "icon") {
    return (
      <div
        className={`font-lacquer ${sizeClasses[size]} font-black text-gray-900 ${className}`}
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
    <div className={`flex items-center ${sizeClasses[size]} font-bold text-gray-900 ${className}`}>
      <span className="font-sf-pro">inkl</span>
      <img
        src="/inkloop.png"
        alt="Inkloop Logo"
        className="inline-block w-12 h-12 mt-2"
      />
      <span className="font-sf-pro">0p</span>
    </div>
  )
}
