export type Region = "SRO" | "CRO" | "WRO" | "NRO"

export type GameType = "word-search" | "crossword" | "word-chain" | "connections"

export interface User {
  id: string
  name: string
  mobile: string
  region: Region
  entryId: string
  isAdmin?: boolean
}

export interface Game {
  id: GameType
  name: string
  description: string
}

export interface GameResult {
  userId: string
  gameId: GameType
  score: number
  timeSpent: number
  tabSwitches: number
  completedAt: string
}

export interface WordSearchData {
  grid: string[][]
  words: string[]
}

export interface CrosswordClue {
  id: string
  clue: string
  answer: string
  direction: "across" | "down"
  row: number
  col: number
}

export interface CrosswordData {
  clues: CrosswordClue[]
  gridSize: number
}

export interface ConnectionsGroup {
  category: string
  words: string[]
}

export interface ConnectionsData {
  groups: ConnectionsGroup[]
}

export interface WordChainData {
  startWord: string
  minWords: number
}
