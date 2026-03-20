"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, X, CheckCircle, AlertCircle } from "lucide-react"
import type { WordChainData } from "@/lib/types"

interface WordChainGameProps {
  data: WordChainData
  onScoreChange: (score: number) => void
}

export function WordChainGame({ data, onScoreChange }: WordChainGameProps) {
  const [words, setWords] = useState<string[]>([data.startWord])
  const [currentWord, setCurrentWord] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    // Score based on number of valid words in chain
    const score = Math.max(0, (words.length - 1) * 20)
    onScoreChange(score)
  }, [words, onScoreChange])

  const getLastLetter = () => {
    const lastWord = words[words.length - 1]
    return lastWord.charAt(lastWord.length - 1).toUpperCase()
  }

  const validateWord = (word: string): string | null => {
    const cleanWord = word.trim().toUpperCase()

    if (cleanWord.length < 2) {
      return "Word must be at least 2 characters"
    }

    if (!/^[A-Z]+$/.test(cleanWord)) {
      return "Only letters are allowed"
    }

    const requiredLetter = getLastLetter()
    if (cleanWord.charAt(0) !== requiredLetter) {
      return `Word must start with "${requiredLetter}"`
    }

    if (words.includes(cleanWord)) {
      return "Word already used"
    }

    return null
  }

  const addWord = () => {
    setError("")
    const validationError = validateWord(currentWord)

    if (validationError) {
      setError(validationError)
      return
    }

    setWords([...words, currentWord.trim().toUpperCase()])
    setCurrentWord("")
  }

  const removeWord = (index: number) => {
    if (index === 0) return // Can't remove start word
    setWords(words.slice(0, index))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addWord()
    }
  }

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="rounded-lg bg-muted p-4">
        <h3 className="mb-2 font-semibold">How to Play</h3>
        <p className="text-sm text-muted-foreground">
          Create a chain of words where each word starts with the last letter of the previous word.
          Minimum {data.minWords} words required.
        </p>
      </div>

      {/* Word Chain Display */}
      <div className="space-y-2">
        <h4 className="font-medium">Your Word Chain ({words.length} words)</h4>
        <div className="flex flex-wrap gap-2">
          {words.map((word, index) => (
            <Badge
              key={index}
              variant={index === 0 ? "default" : "secondary"}
              className="flex items-center gap-1 px-3 py-1.5 text-sm"
            >
              {word}
              {index > 0 && (
                <button
                  onClick={() => removeWord(index)}
                  className="ml-1 rounded-full p-0.5 hover:bg-background/20"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </Badge>
          ))}
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center gap-2">
        {words.length >= data.minWords ? (
          <div className="flex items-center gap-2 text-primary">
            <CheckCircle className="h-5 w-5" />
            <span className="text-sm font-medium">Minimum requirement met!</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-muted-foreground">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm">
              Need {data.minWords - words.length} more word(s)
            </span>
          </div>
        )}
      </div>

      {/* Input Section */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Next word (must start with <span className="text-primary font-bold">{getLastLetter()}</span>)
        </label>
        <div className="flex gap-2">
          <Input
            value={currentWord}
            onChange={(e) => setCurrentWord(e.target.value.toUpperCase())}
            onKeyDown={handleKeyDown}
            placeholder={`Enter a word starting with ${getLastLetter()}`}
            className="flex-1"
          />
          <Button onClick={addWord} size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {error && (
          <Alert variant="destructive" className="py-2">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* Score Display */}
      <div className="rounded-lg border bg-card p-4 text-center">
        <p className="text-sm text-muted-foreground">Current Score</p>
        <p className="text-3xl font-bold text-primary">{Math.max(0, (words.length - 1) * 20)}</p>
      </div>
    </div>
  )
}
