"use client"

import { useCallback, useRef, useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { flushSync } from "react-dom"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

interface AnimatedThemeTogglerProps extends React.ComponentPropsWithoutRef<"button"> {
  duration?: number
}

export const AnimatedThemeToggler = ({
  className,
  duration = 400,
  ...props
}: AnimatedThemeTogglerProps) => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => setMounted(true), [])

  const isDark = theme === "dark"

  const toggleTheme = useCallback(async () => {
    if (!buttonRef.current) return

    if (!("startViewTransition" in document)) {
      flushSync(() => setTheme(isDark ? "light" : "dark"))
      return
    }

    const transition = document.startViewTransition(() => {
      flushSync(() => setTheme(isDark ? "light" : "dark"))
    })
    await transition.ready

    const { top, left, width, height } = buttonRef.current.getBoundingClientRect()
    const x = left + width / 2
    const y = top + height / 2
    const maxRadius = Math.hypot(window.innerWidth, window.innerHeight)

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      }
    )
  }, [isDark, setTheme, duration])

  // ⛔ Prevent rendering before theme mounts
  if (!mounted) {
    return (
      <button
        ref={buttonRef}
        className={cn(
          "flex items-center justify-center rounded-full p-2 cursor-pointer",
          className
        )}
        {...props}
        aria-hidden="true"
      />
    )
  }

  return (
    <button
      ref={buttonRef}
      onClick={toggleTheme}
      className={cn(
        "flex items-center justify-center rounded-full p-2 transition-colors cursor-pointer hover:bg-accent/20",
        className
      )}
      {...props}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
