import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Grid3X3, Puzzle, Link2, Layers, Trophy, ArrowRight } from "lucide-react"

const games = [
  {
    icon: Grid3X3,
    name: "Word Search",
    description: "Find hidden words in a grid of letters",
  },
  {
    icon: Puzzle,
    name: "Crossword",
    description: "Solve clues to fill in the puzzle",
  },
  {
    icon: Link2,
    name: "Word Chain",
    description: "Create chains where words connect by letters",
  },
  {
    icon: Layers,
    name: "Connections",
    description: "Group words into 4 categories",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm">
            <Trophy className="h-4 w-4 text-primary" />
            <span>Online Competition Platform</span>
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-6xl text-balance">
            Test Your Word Skills
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground text-balance">
            Compete in engaging word games. Challenge yourself with Word Search, Crossword, Word Chain, and Connections.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Games Section */}
      <section className="border-t bg-muted/30 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-foreground">
            Featured Games
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {games.map((game) => (
              <Card key={game.name} className="transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <game.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{game.name}</CardTitle>
                  <CardDescription>{game.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="py-12">
              <h2 className="mb-4 text-2xl font-bold md:text-3xl">Ready to Compete?</h2>
              <p className="mx-auto mb-6 max-w-md text-primary-foreground/80">
                Register now and start playing word games to test your skills.
              </p>
              <Link href="/register">
                <Button variant="secondary" size="lg">
                  Register Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-muted-foreground">
          <p>Competition Platform. All games accessible at any time.</p>
        </div>
      </footer>
    </div>
  )
}
