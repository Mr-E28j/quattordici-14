import { ThemeProvider } from "../components/theme-provider"
import { SonetoGame } from "../components/soneto-game"

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <div className="max-w-4xl w-full">
          <h1 className="text-3xl font-serif text-center mb-2 text-foreground">Quattordici</h1>
          <p className="text-center mb-8 text-muted-foreground">
            Crea tu propio soneto siguiendo las reglas de métrica y rima
          </p>
          <SonetoGame />
        </div>
      </main>
    </ThemeProvider>
  )
}

