"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminTable } from "@/components/admin-table"
import { GameEditor } from "@/components/admin/game-editor"
import { fetchAllUsers, fetchAllResults } from "@/lib/api"
import type { User, GameResult } from "@/lib/types"
import { Users, Trophy, Settings, LogOut } from "lucide-react"

export default function AdminDashboardPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [results, setResults] = useState<(GameResult & { userName: string })[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [usersData, resultsData] = await Promise.all([
          fetchAllUsers(),
          fetchAllResults(),
        ])
        setUsers(usersData)
        setResults(resultsData)
      } catch (error) {
        console.error("Failed to load data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const handleLogout = () => {
    router.push("/admin")
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  const userColumns = [
    { key: "name", header: "Name" },
    { key: "mobile", header: "Mobile" },
    { key: "entryId", header: "Entry ID" },
    { key: "region", header: "Region" },
  ]

  const resultColumns = [
    { key: "userName", header: "User" },
    { key: "gameId", header: "Game" },
    { key: "score", header: "Score" },
    {
      key: "timeSpent",
      header: "Time Spent",
      render: (item: GameResult & { userName: string }) => `${item.timeSpent}s`,
    },
    { key: "tabSwitches", header: "Tab Switches" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Stats Overview */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Results</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{results.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {results.length > 0
                  ? Math.round(results.reduce((acc, r) => acc + r.score, 0) / results.length)
                  : 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="games">Manage Games</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Registered Users</CardTitle>
              </CardHeader>
              <CardContent>
                <AdminTable data={users} columns={userColumns} emptyMessage="No users registered yet" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="games">
            <GameEditor />
          </TabsContent>

          <TabsContent value="results">
            <Card>
              <CardHeader>
                <CardTitle>Game Results</CardTitle>
              </CardHeader>
              <CardContent>
                <AdminTable
                  data={results}
                  columns={resultColumns}
                  emptyMessage="No results recorded yet"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
