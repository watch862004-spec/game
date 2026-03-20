import type {
  User,
  Region,
  Game,
  GameType,
  GameResult,
  WordSearchData,
  CrosswordData,
  ConnectionsData,
  WordChainData,
} from "./types"

// Auth placeholder functions
export async function registerUser(data: {
  name: string
  mobile: string
  region: Region
  password: string
}): Promise<{ user: User; error?: string }> {
  // Placeholder - will be connected to Supabase
  console.log("registerUser called with:", data)
  return {
    user: {
      id: "user-" + Date.now(),
      name: data.name,
      mobile: data.mobile,
      region: data.region,
      entryId: "ENTRY-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
    },
  }
}

export async function loginUser(data: {
  mobile: string
  password: string
}): Promise<{ user: User | null; error?: string }> {
  // Placeholder - will be connected to Supabase
  console.log("loginUser called with:", data)
  return {
    user: {
      id: "user-1",
      name: "Test User",
      mobile: data.mobile,
      region: "SRO",
      entryId: "ENTRY-ABC123",
    },
  }
}

export async function loginAdmin(data: {
  username: string
  password: string
}): Promise<{ user: User | null; error?: string }> {
  // Placeholder - will be connected to Supabase
  console.log("loginAdmin called with:", data)
  return {
    user: {
      id: "admin-1",
      name: "Admin User",
      mobile: "0000000000",
      region: "SRO",
      entryId: "ADMIN-001",
      isAdmin: true,
    },
  }
}

export async function fetchUser(): Promise<User | null> {
  // Placeholder - will be connected to Supabase
  return {
    id: "user-1",
    name: "Test User",
    mobile: "9876543210",
    region: "SRO",
    entryId: "ENTRY-ABC123",
  }
}

// Game placeholder functions
export async function fetchGames(): Promise<Game[]> {
  // Placeholder - will be connected to Supabase
  return [
    {
      id: "word-search",
      name: "Word Search",
      description: "Find hidden words in a grid of letters",
    },
    {
      id: "crossword",
      name: "Crossword",
      description: "Solve clues to fill in the puzzle",
    },
    {
      id: "word-chain",
      name: "Word Chain",
      description: "Create a chain where each word starts with the last letter of the previous",
    },
    {
      id: "connections",
      name: "Connections",
      description: "Group 16 words into 4 categories of 4",
    },
  ]
}

export async function fetchQuestions(gameId: GameType): Promise<
  WordSearchData | CrosswordData | ConnectionsData | WordChainData | null
> {
  // Placeholder - will be connected to Supabase
  console.log("fetchQuestions called for:", gameId)

  switch (gameId) {
    case "word-search":
      return {
        grid: [
          ["C", "A", "T", "S", "D"],
          ["D", "O", "G", "S", "E"],
          ["B", "I", "R", "D", "E"],
          ["F", "I", "S", "H", "R"],
          ["R", "A", "T", "S", "S"],
        ],
        words: ["CATS", "DOGS", "BIRD", "FISH", "RATS", "DEER"],
      } as WordSearchData

    case "crossword":
      return {
        gridSize: 5,
        clues: [
          { id: "1", clue: "A domestic feline", answer: "CAT", direction: "across", row: 0, col: 0 },
          { id: "2", clue: "A canine companion", answer: "DOG", direction: "across", row: 1, col: 0 },
          { id: "3", clue: "Aquatic pet", answer: "FISH", direction: "down", row: 0, col: 0 },
        ],
      } as CrosswordData

    case "connections":
      return {
        groups: [
          { category: "Fruits", words: ["APPLE", "BANANA", "ORANGE", "GRAPE"] },
          { category: "Colors", words: ["RED", "BLUE", "GREEN", "YELLOW"] },
          { category: "Animals", words: ["CAT", "DOG", "BIRD", "FISH"] },
          { category: "Numbers", words: ["ONE", "TWO", "THREE", "FOUR"] },
        ],
      } as ConnectionsData

    case "word-chain":
      return {
        startWord: "APPLE",
        minWords: 5,
      } as WordChainData

    default:
      return null
  }
}

export async function saveGameResult(result: Omit<GameResult, "completedAt">): Promise<{ success: boolean }> {
  // Placeholder - will be connected to Supabase
  console.log("saveGameResult called with:", result)
  return { success: true }
}

// Admin placeholder functions
export async function fetchAllUsers(): Promise<User[]> {
  // Placeholder - will be connected to Supabase
  return [
    { id: "1", name: "John Doe", mobile: "9876543210", region: "SRO", entryId: "ENTRY-001" },
    { id: "2", name: "Jane Smith", mobile: "9876543211", region: "CRO", entryId: "ENTRY-002" },
    { id: "3", name: "Bob Wilson", mobile: "9876543212", region: "WRO", entryId: "ENTRY-003" },
  ]
}

export async function fetchAllResults(): Promise<(GameResult & { userName: string })[]> {
  // Placeholder - will be connected to Supabase
  return [
    {
      userId: "1",
      userName: "John Doe",
      gameId: "word-search",
      score: 85,
      timeSpent: 120,
      tabSwitches: 2,
      completedAt: new Date().toISOString(),
    },
    {
      userId: "2",
      userName: "Jane Smith",
      gameId: "crossword",
      score: 90,
      timeSpent: 180,
      tabSwitches: 0,
      completedAt: new Date().toISOString(),
    },
  ]
}

export async function saveGameData(
  gameId: GameType,
  data: WordSearchData | CrosswordData | ConnectionsData | WordChainData
): Promise<{ success: boolean }> {
  // Placeholder - will be connected to Supabase
  console.log("saveGameData called for:", gameId, data)
  return { success: true }
}
