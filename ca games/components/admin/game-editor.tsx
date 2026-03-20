"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { fetchQuestions, saveGameData } from "@/lib/api"
import type { GameType } from "@/lib/types"
import { Save, CheckCircle } from "lucide-react"

const games = [
  { id: "word-search", name: "Word Search" },
  { id: "crossword", name: "Crossword" },
  { id: "word-chain", name: "Word Chain" },
  { id: "connections", name: "Connections" },
] as const

export function GameEditor() {
  const [selectedGame, setSelectedGame] = useState<GameType>("word-search")
  const [jsonData, setJsonData] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    async function loadGameData() {
      setIsLoading(true)
      setError("")
      setSuccess(false)
      try {
        const data = await fetchQuestions(selectedGame)
        setJsonData(JSON.stringify(data, null, 2))
      } catch {
        setError("Failed to load game data")
      } finally {
        setIsLoading(false)
      }
    }
    loadGameData()
  }, [selectedGame])

  const handleSave = async () => {
    setError("")
    setSuccess(false)

    try {
      const parsedData = JSON.parse(jsonData)
      setIsSaving(true)
      const result = await saveGameData(selectedGame, parsedData)
      if (result.success) {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch {
      setError("Invalid JSON format. Please check your input.")
    } finally {
      setIsSaving(false)
    }
  }

  const formatJson = () => {
    try {
      const parsed = JSON.parse(jsonData)
      setJsonData(JSON.stringify(parsed, null, 2))
      setError("")
    } catch {
      setError("Invalid JSON format. Cannot format.")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Game Questions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Select Game</Label>
          <Select
            value={selectedGame}
            onValueChange={(value) => setSelectedGame(value as GameType)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a game" />
            </SelectTrigger>
            <SelectContent>
              {games.map((game) => (
                <SelectItem key={game.id} value={game.id}>
                  {game.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-primary/20 bg-primary/5">
            <CheckCircle className="h-4 w-4 text-primary" />
            <AlertDescription className="text-primary">Game data saved successfully!</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Game Data (JSON)</Label>
            <Button variant="ghost" size="sm" onClick={formatJson}>
              Format JSON
            </Button>
          </div>
          <Textarea
            value={isLoading ? "Loading..." : jsonData}
            onChange={(e) => setJsonData(e.target.value)}
            className="min-h-80 font-mono text-sm"
            placeholder="Enter game data in JSON format..."
            disabled={isLoading}
          />
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving || isLoading}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        {/* Schema Reference */}
        <div className="rounded-lg bg-muted p-4">
          <h4 className="mb-2 font-semibold">JSON Schema Reference</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p><strong>Word Search:</strong> {`{ "grid": [["A","B"],["C","D"]], "words": ["AB","CD"] }`}</p>
            <p><strong>Crossword:</strong> {`{ "gridSize": 5, "clues": [{ "id": "1", "clue": "...", "answer": "...", "direction": "across", "row": 0, "col": 0 }] }`}</p>
            <p><strong>Word Chain:</strong> {`{ "startWord": "APPLE", "minWords": 5 }`}</p>
            <p><strong>Connections:</strong> {`{ "groups": [{ "category": "Fruits", "words": ["APPLE","BANANA","ORANGE","GRAPE"] }] }`}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
