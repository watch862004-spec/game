"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, X } from "lucide-react"
import type { ConnectionsData } from "@/lib/types"

interface ConnectionsGameProps {
  data: ConnectionsData
  onScoreChange: (score: number) => void
}

const groupColors = [
  "bg-yellow-500/20 border-yellow-500 text-yellow-700",
  "bg-green-500/20 border-green-500 text-green-700",
  "bg-blue-500/20 border-blue-500 text-blue-700",
  "bg-purple-500/20 border-purple-500 text-purple-700",
]

export function ConnectionsGame({ data, onScoreChange }: ConnectionsGameProps) {
  const [selectedWords, setSelectedWords] = useState<string[]>([])
  const [solvedGroups, setSolvedGroups] = useState<number[]>([])
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Shuffle all words on initial render
  const shuffledWords = useMemo(() => {
    const allWords = data.groups.flatMap((g) => g.words)
    return allWords.sort(() => Math.random() - 0.5)
  }, [data.groups])

  useEffect(() => {
    // Score based on solved groups
    const score = solvedGroups.length * 25
    onScoreChange(score)
  }, [solvedGroups, onScoreChange])

  const availableWords = shuffledWords.filter((word) => {
    return !solvedGroups.some((groupIndex) => data.groups[groupIndex].words.includes(word))
  })

  const toggleWord = (word: string) => {
    setMessage(null)
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter((w) => w !== word))
    } else if (selectedWords.length < 4) {
      setSelectedWords([...selectedWords, word])
    }
  }

  const checkSelection = () => {
    if (selectedWords.length !== 4) return

    // Check if selection matches any group
    const matchingGroupIndex = data.groups.findIndex((group) =>
      group.words.every((word) => selectedWords.includes(word))
    )

    if (matchingGroupIndex !== -1 && !solvedGroups.includes(matchingGroupIndex)) {
      setSolvedGroups([...solvedGroups, matchingGroupIndex])
      setSelectedWords([])
      setMessage({ type: "success", text: `Correct! Category: ${data.groups[matchingGroupIndex].category}` })
    } else {
      setMessage({ type: "error", text: "Incorrect grouping. Try again!" })
    }
  }

  const clearSelection = () => {
    setSelectedWords([])
    setMessage(null)
  }

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="rounded-lg bg-muted p-4">
        <h3 className="mb-2 font-semibold">How to Play</h3>
        <p className="text-sm text-muted-foreground">
          Group the 16 words into 4 categories of 4 words each. Select 4 words and submit to check your grouping.
        </p>
      </div>

      {/* Solved Groups */}
      {solvedGroups.length > 0 && (
        <div className="space-y-2">
          {solvedGroups.map((groupIndex) => (
            <div
              key={groupIndex}
              className={`rounded-lg border p-3 ${groupColors[groupIndex % groupColors.length]}`}
            >
              <p className="mb-2 font-semibold">{data.groups[groupIndex].category}</p>
              <div className="flex flex-wrap gap-2">
                {data.groups[groupIndex].words.map((word) => (
                  <Badge key={word} variant="secondary">
                    {word}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Message */}
      {message && (
        <Alert variant={message.type === "success" ? "default" : "destructive"}>
          {message.type === "success" ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <X className="h-4 w-4" />
          )}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* Word Grid */}
      {availableWords.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {availableWords.map((word) => (
            <Button
              key={word}
              variant={selectedWords.includes(word) ? "default" : "outline"}
              className="h-auto min-h-12 text-xs font-medium sm:text-sm"
              onClick={() => toggleWord(word)}
            >
              {word}
            </Button>
          ))}
        </div>
      )}

      {/* Controls */}
      {availableWords.length > 0 && (
        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={clearSelection} disabled={selectedWords.length === 0}>
            Clear
          </Button>
          <Button onClick={checkSelection} disabled={selectedWords.length !== 4}>
            Submit ({selectedWords.length}/4)
          </Button>
        </div>
      )}

      {/* Completion Message */}
      {solvedGroups.length === 4 && (
        <div className="rounded-lg bg-primary/10 p-6 text-center">
          <CheckCircle className="mx-auto mb-2 h-12 w-12 text-primary" />
          <p className="text-lg font-semibold">All groups found!</p>
        </div>
      )}

      {/* Score Display */}
      <div className="rounded-lg border bg-card p-4 text-center">
        <p className="text-sm text-muted-foreground">Groups Solved</p>
        <p className="text-3xl font-bold text-primary">{solvedGroups.length}/4</p>
      </div>
    </div>
  )
}
