"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps & { children: React.ReactNode }) {
  return React.createElement(NextThemesProvider, { ...props }, children);
}

