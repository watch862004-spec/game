"use client"

import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { GameLayout } from "@/components/game-layout"
import { WordSearchGame } from "@/components/games/word-search"
import { CrosswordGame } from "@/components/games/crossword"
import { WordChainGame } from "@/components/games/word-chain"
import { ConnectionsGame } from "@/components/games/connections"
import { fetchQuestions, saveGameResult } from "@/lib/api"
import type { GameType, WordSearchData, CrosswordData, WordChainData, ConnectionsData } from "@/lib/types"

const gameNames: Record<GameType, string> = {
  "word-search": "Word Search",
  crossword: "Crossword",
  "word-chain": "Word Chain",
  connections: "Connections",
}

export default function GamePage({ params }: { params: Promise<{ gameId: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const gameId = resolvedParams.gameId as GameType
  const [gameData, setGameData] = useState<WordSearchData | CrosswordData | WordChainData | ConnectionsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [score, setScore] = useState(0)
  const [startTime] = useState(Date.now())
  const [tabSwitches, setTabSwitches] = useState(0)

  useEffect(() => {
    async function loadGame() {
      try {
        const data = await fetchQuestions(gameId)
        setGameData(data)
      } catch (error) {
        console.error("Failed to load game:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadGame()
  }, [gameId])

  // Track tab switches from GameLayout
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        setTabSwitches((prev) => prev + 1)
      }
    }
    document.addEventListener("visibilitychange", handleVisibility)
    return () => document.removeEventListener("visibilitychange", handleVisibility)
  }, [])

  const handleSubmit = async () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000)

    await saveGameResult({
      userId: "user-1", // Will come from auth context
      gameId,
      score,
      timeSpent,
      tabSwitches,
    })

    router.push("/completion")
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading game...</div>
      </div>
    )
  }

  if (!gameData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-destructive">Failed to load game data</div>
      </div>
    )
  }

  const gameName = gameNames[gameId] || "Game"

  return (
    <GameLayout title={gameName} onSubmit={handleSubmit} timeLimit={300}>
      {gameId === "word-search" && (
        <WordSearchGame data={gameData as WordSearchData} onScoreChange={setScore} />
      )}
      {gameId === "crossword" && (
        <CrosswordGame data={gameData as CrosswordData} onScoreChange={setScore} />
      )}
      {gameId === "word-chain" && (
        <WordChainGame data={gameData as WordChainData} onScoreChange={setScore} />
      )}
      {gameId === "connections" && (
        <ConnectionsGame data={gameData as ConnectionsData} onScoreChange={setScore} />
      )}
    </GameLayout>
  )
}
