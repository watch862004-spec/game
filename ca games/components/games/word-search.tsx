"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { CheckCircle } from "lucide-react"
import type { WordSearchData } from "@/lib/types"

interface WordSearchGameProps {
  data: WordSearchData
  onScoreChange: (score: number) => void
}

interface Cell {
  row: number
  col: number
}

export function WordSearchGame({ data, onScoreChange }: WordSearchGameProps) {
  const [selectedCells, setSelectedCells] = useState<Cell[]>([])
  const [foundWords, setFoundWords] = useState<string[]>([])
  const [foundCells, setFoundCells] = useState<Set<string>>(new Set())
  const [isSelecting, setIsSelecting] = useState(false)

  useEffect(() => {
    const score = Math.floor((foundWords.length / data.words.length) * 100)
    onScoreChange(score)
  }, [foundWords, data.words.length, onScoreChange])

  const cellKey = (row: number, col: number) => `${row}-${col}`

  const getSelectedWord = () => {
    return selectedCells.map((cell) => data.grid[cell.row][cell.col]).join("")
  }

  const isValidSelection = (newCell: Cell) => {
    if (selectedCells.length === 0) return true

    const lastCell = selectedCells[selectedCells.length - 1]
    const rowDiff = Math.abs(newCell.row - lastCell.row)
    const colDiff = Math.abs(newCell.col - lastCell.col)

    // Allow horizontal, vertical, and diagonal adjacent cells
    if (rowDiff <= 1 && colDiff <= 1 && (rowDiff + colDiff > 0)) {
      // Check if maintaining same direction
      if (selectedCells.length >= 2) {
        const prevCell = selectedCells[selectedCells.length - 2]
        const prevRowDir = lastCell.row - prevCell.row
        const prevColDir = lastCell.col - prevCell.col
        const newRowDir = newCell.row - lastCell.row
        const newColDir = newCell.col - lastCell.col
        return prevRowDir === newRowDir && prevColDir === newColDir
      }
      return true
    }
    return false
  }

  const handleCellMouseDown = (row: number, col: number) => {
    setIsSelecting(true)
    setSelectedCells([{ row, col }])
  }

  const handleCellMouseEnter = (row: number, col: number) => {
    if (!isSelecting) return

    const newCell = { row, col }
    const alreadySelected = selectedCells.some((c) => c.row === row && c.col === col)

    if (!alreadySelected && isValidSelection(newCell)) {
      setSelectedCells([...selectedCells, newCell])
    }
  }

  const handleMouseUp = () => {
    if (!isSelecting) return
    setIsSelecting(false)

    const word = getSelectedWord()
    const reversedWord = word.split("").reverse().join("")

    if (
      (data.words.includes(word) || data.words.includes(reversedWord)) &&
      !foundWords.includes(word) &&
      !foundWords.includes(reversedWord)
    ) {
      const foundWord = data.words.includes(word) ? word : reversedWord
      setFoundWords([...foundWords, foundWord])

      // Mark cells as found
      const newFoundCells = new Set(foundCells)
      selectedCells.forEach((cell) => newFoundCells.add(cellKey(cell.row, cell.col)))
      setFoundCells(newFoundCells)
    }

    setSelectedCells([])
  }

  const isCellSelected = (row: number, col: number) => {
    return selectedCells.some((c) => c.row === row && c.col === col)
  }

  const isCellFound = (row: number, col: number) => {
    return foundCells.has(cellKey(row, col))
  }

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="rounded-lg bg-muted p-4">
        <h3 className="mb-2 font-semibold">How to Play</h3>
        <p className="text-sm text-muted-foreground">
          Click and drag to select letters and find the hidden words. Words can be horizontal, vertical, or diagonal.
        </p>
      </div>

      {/* Words to Find */}
      <div className="space-y-2">
        <h4 className="font-medium">Words to Find</h4>
        <div className="flex flex-wrap gap-2">
          {data.words.map((word) => (
            <Badge
              key={word}
              variant={foundWords.includes(word) ? "default" : "outline"}
              className={foundWords.includes(word) ? "line-through opacity-60" : ""}
            >
              {foundWords.includes(word) && <CheckCircle className="mr-1 h-3 w-3" />}
              {word}
            </Badge>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div
        className="mx-auto w-fit select-none"
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          if (isSelecting) {
            setIsSelecting(false)
            setSelectedCells([])
          }
        }}
      >
        <div
          className="grid gap-1"
          style={{ gridTemplateColumns: `repeat(${data.grid[0].length}, 1fr)` }}
        >
          {data.grid.map((row, rowIndex) =>
            row.map((letter, colIndex) => (
              <button
                key={cellKey(rowIndex, colIndex)}
                className={`flex h-10 w-10 items-center justify-center rounded-md border text-lg font-bold transition-colors
                  ${isCellFound(rowIndex, colIndex) ? "bg-primary text-primary-foreground" : ""}
                  ${isCellSelected(rowIndex, colIndex) && !isCellFound(rowIndex, colIndex) ? "bg-accent" : ""}
                  ${!isCellFound(rowIndex, colIndex) && !isCellSelected(rowIndex, colIndex) ? "bg-card hover:bg-muted" : ""}
                `}
                onMouseDown={() => handleCellMouseDown(rowIndex, colIndex)}
                onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
              >
                {letter}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Score Display */}
      <div className="rounded-lg border bg-card p-4 text-center">
        <p className="text-sm text-muted-foreground">Words Found</p>
        <p className="text-3xl font-bold text-primary">
          {foundWords.length}/{data.words.length}
        </p>
      </div>
    </div>
  )
}
