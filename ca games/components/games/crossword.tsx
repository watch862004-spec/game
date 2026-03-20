"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import type { CrosswordData, CrosswordClue } from "@/lib/types"

interface CrosswordGameProps {
  data: CrosswordData
  onScoreChange: (score: number) => void
}

// Build a 2D grid map: grid[row][col] = { letter, clueNumber, isBlack }
function buildGrid(clues: CrosswordClue[], gridSize: number) {
  const cells: Record<
    string,
    { letter: string; clueNumber?: number; acrossClue?: string; downClue?: string }
  > = {}
  const clueNumbers: Record<string, number> = {}
  let clueNum = 1

  // Assign clue numbers to starting positions
  // Sort clues by row then col to assign numbers in reading order
  const sorted = [...clues].sort((a, b) => a.row - b.row || a.col - b.col)
  const posToNum: Record<string, number> = {}

  sorted.forEach((clue) => {
    const key = `${clue.row}-${clue.col}`
    if (!posToNum[key]) {
      posToNum[key] = clueNum++
    }
  })

  // Fill in cells for each clue
  clues.forEach((clue) => {
    const len = clue.answer.length
    for (let i = 0; i < len; i++) {
      const row = clue.direction === "across" ? clue.row : clue.row + i
      const col = clue.direction === "across" ? clue.col + i : clue.col
      const key = `${row}-${col}`
      if (!cells[key]) {
        cells[key] = { letter: "" }
      }
      if (i === 0) {
        const startKey = `${clue.row}-${clue.col}`
        cells[key].clueNumber = posToNum[startKey]
        clueNumbers[clue.id] = posToNum[startKey]
      }
    }
  })

  return { cells, clueNumbers, posToNum }
}

// Get all cell keys belonging to a clue
function getClueCells(clue: CrosswordClue): string[] {
  return Array.from({ length: clue.answer.length }, (_, i) => {
    const row = clue.direction === "across" ? clue.row : clue.row + i
    const col = clue.direction === "across" ? clue.col + i : clue.col
    return `${row}-${col}`
  })
}

export function CrosswordGame({ data, onScoreChange }: CrosswordGameProps) {
  const { clues, gridSize } = data
  const { cells: initialCells, clueNumbers, posToNum } = buildGrid(clues, gridSize)

  const [gridValues, setGridValues] = useState<Record<string, string>>({})
  const [activeClue, setActiveClue] = useState<string | null>(null)
  const [checkedCells, setCheckedCells] = useState<Record<string, boolean | null>>({})
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const acrossClues = clues.filter((c) => c.direction === "across")
  const downClues = clues.filter((c) => c.direction === "down")

  // Compute score whenever gridValues change
  useEffect(() => {
    let correct = 0
    clues.forEach((clue) => {
      const cells = getClueCells(clue)
      const entered = cells.map((k) => gridValues[k] || "").join("")
      if (entered.toUpperCase() === clue.answer.toUpperCase()) correct++
    })
    onScoreChange(Math.round((correct / clues.length) * 100))
  }, [gridValues, clues, onScoreChange])

  const handleInput = (row: number, col: number, value: string) => {
    const key = `${row}-${col}`
    const letter = value.slice(-1).toUpperCase()
    setGridValues((prev) => ({ ...prev, [key]: letter }))

    // Auto-advance: find which active clue this cell belongs to and move to next
    if (letter && activeClue) {
      const clue = clues.find((c) => c.id === activeClue)
      if (clue) {
        const cells = getClueCells(clue)
        const idx = cells.indexOf(key)
        if (idx !== -1 && idx < cells.length - 1) {
          const nextKey = cells[idx + 1]
          inputRefs.current[nextKey]?.focus()
        }
      }
    }
  }

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    row: number,
    col: number
  ) => {
    const key = `${row}-${col}`
    if (e.key === "Backspace" && !gridValues[key] && activeClue) {
      const clue = clues.find((c) => c.id === activeClue)
      if (clue) {
        const cells = getClueCells(clue)
        const idx = cells.indexOf(key)
        if (idx > 0) {
          const prevKey = cells[idx - 1]
          inputRefs.current[prevKey]?.focus()
          setGridValues((prev) => ({ ...prev, [prevKey]: "" }))
        }
      }
    }
  }

  const handleCellFocus = useCallback(
    (row: number, col: number) => {
      const key = `${row}-${col}`
      // Find the best clue for this cell (prefer current active direction)
      const matching = clues.filter((c) => getClueCells(c).includes(key))
      if (matching.length > 0) {
        // If already active and matches, keep it; otherwise pick first
        if (activeClue && matching.find((c) => c.id === activeClue)) return
        setActiveClue(matching[0].id)
      }
    },
    [clues, activeClue]
  )

  const handleClueClick = (clueId: string) => {
    setActiveClue(clueId)
    const clue = clues.find((c) => c.id === clueId)
    if (clue) {
      const firstCell = getClueCells(clue)[0]
      inputRefs.current[firstCell]?.focus()
    }
  }

  const checkAnswers = () => {
    const result: Record<string, boolean | null> = {}
    clues.forEach((clue) => {
      const cells = getClueCells(clue)
      cells.forEach((cellKey, i) => {
        const entered = gridValues[cellKey] || ""
        result[cellKey] = entered
          ? entered.toUpperCase() === clue.answer[i].toUpperCase()
          : null
      })
    })
    setCheckedCells(result)
  }

  const activeClueCells = activeClue
    ? new Set(getClueCells(clues.find((c) => c.id === activeClue)!))
    : new Set<string>()

  const correctCount = clues.filter((clue) => {
    const cells = getClueCells(clue)
    return cells.every(
      (k, i) =>
        (gridValues[k] || "").toUpperCase() === clue.answer[i].toUpperCase()
    )
  }).length

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      {/* Grid */}
      <div className="flex flex-col items-center gap-4">
        <div
          className="grid gap-0 border border-foreground"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          }}
        >
          {Array.from({ length: gridSize }, (_, row) =>
            Array.from({ length: gridSize }, (_, col) => {
              const key = `${row}-${col}`
              const isActive = initialCells[key] !== undefined
              const clueNum = isActive ? initialCells[key]?.clueNumber : undefined
              const isHighlighted = activeClueCells.has(key)
              const checkState = checkedCells[key]

              if (!isActive) {
                return (
                  <div
                    key={key}
                    className="h-9 w-9 bg-foreground"
                  />
                )
              }

              return (
                <div
                  key={key}
                  className="relative h-9 w-9 border border-foreground/30"
                >
                  {clueNum && (
                    <span className="absolute left-0.5 top-0 z-10 text-[8px] font-bold leading-none text-foreground select-none">
                      {clueNum}
                    </span>
                  )}
                  <input
                    ref={(el) => { inputRefs.current[key] = el }}
                    type="text"
                    maxLength={2}
                    value={gridValues[key] || ""}
                    onChange={(e) => handleInput(row, col, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, row, col)}
                    onFocus={() => handleCellFocus(row, col)}
                    className={[
                      "h-full w-full pt-2 text-center text-sm font-bold uppercase outline-none",
                      isHighlighted
                        ? "bg-primary/20"
                        : "bg-card",
                      checkState === true
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : checkState === false
                        ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  />
                </div>
              )
            })
          )}
        </div>

        {/* Score + Check */}
        <div className="flex w-full items-center justify-between rounded-lg border bg-card px-4 py-3">
          <div>
            <p className="text-xs text-muted-foreground">Correct</p>
            <p className="text-xl font-bold text-primary">
              {correctCount}/{clues.length}
            </p>
          </div>
          <button
            onClick={checkAnswers}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Check Answers
          </button>
        </div>
      </div>

      {/* Clues */}
      <div className="flex flex-1 flex-col gap-6 sm:flex-row lg:flex-col lg:overflow-y-auto lg:max-h-[600px]">
        {/* Across */}
        <div className="flex-1">
          <h4 className="mb-3 text-center text-sm font-bold uppercase tracking-widest text-foreground">
            Across
          </h4>
          <div className="space-y-1">
            {acrossClues.map((clue) => {
              const num = clueNumbers[clue.id]
              const isActive = activeClue === clue.id
              const cells = getClueCells(clue)
              const isDone = cells.every(
                (k, i) =>
                  (gridValues[k] || "").toUpperCase() === clue.answer[i].toUpperCase()
              )
              return (
                <button
                  key={clue.id}
                  onClick={() => handleClueClick(clue.id)}
                  className={[
                    "w-full rounded px-3 py-1.5 text-left text-sm transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : isDone
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "hover:bg-muted",
                  ].join(" ")}
                >
                  <span className="font-bold">{num})</span> {clue.clue}
                </button>
              )
            })}
          </div>
        </div>

        {/* Down */}
        <div className="flex-1">
          <h4 className="mb-3 text-center text-sm font-bold uppercase tracking-widest text-foreground">
            Down
          </h4>
          <div className="space-y-1">
            {downClues.map((clue) => {
              const num = clueNumbers[clue.id]
              const isActive = activeClue === clue.id
              const cells = getClueCells(clue)
              const isDone = cells.every(
                (k, i) =>
                  (gridValues[k] || "").toUpperCase() === clue.answer[i].toUpperCase()
              )
              return (
                <button
                  key={clue.id}
                  onClick={() => handleClueClick(clue.id)}
                  className={[
                    "w-full rounded px-3 py-1.5 text-left text-sm transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : isDone
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "hover:bg-muted",
                  ].join(" ")}
                >
                  <span className="font-bold">{num})</span> {clue.clue}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
