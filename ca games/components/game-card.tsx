"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Grid3X3, Puzzle, Link2, Layers } from "lucide-react"
import type { Game } from "@/lib/types"

const iconMap = {
  "word-search": Grid3X3,
  crossword: Puzzle,
  "word-chain": Link2,
  connections: Layers,
}

interface GameCardProps {
  game: Game
}

export function GameCard({ game }: GameCardProps) {
  const Icon = iconMap[game.id] || Grid3X3

  return (
    <Card className="flex flex-col transition-shadow hover:shadow-lg">
      <CardHeader className="flex-1">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-lg">{game.name}</CardTitle>
        </div>
        <CardDescription className="mt-2">{game.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Link href={`/games/${game.id}`}>
          <Button className="w-full">Start Game</Button>
        </Link>
      </CardContent>
    </Card>
  )
}
