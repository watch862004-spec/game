"use client"

import { useState, useEffect, useCallback, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Clock, AlertTriangle, Eye } from "lucide-react"

interface GameLayoutProps {
  title: string
  children: ReactNode
  onSubmit: () => void
  timeLimit?: number // in seconds
}

export function GameLayout({ title, children, onSubmit, timeLimit = 300 }: GameLayoutProps) {
  const router = useRouter()
  const [timeRemaining, setTimeRemaining] = useState(timeLimit)
  const [tabSwitches, setTabSwitches] = useState(0)
  const [showWarning, setShowWarning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Countdown timer
  useEffect(() => {
    if (timeRemaining <= 0) {
      handleSubmit()
      return
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeRemaining])

  // Tab visibility detection
  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) {
      setTabSwitches((prev) => prev + 1)
      setShowWarning(true)
      setTimeout(() => setShowWarning(false), 3000)
    }
  }, [])

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [handleVisibilityChange])

  const handleSubmit = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    onSubmit()
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Warning Alert */}
        {showWarning && (
          <Alert variant="destructive" className="mb-4 animate-pulse">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Tab switch detected! This has been recorded. ({tabSwitches} total)
            </AlertDescription>
          </Alert>
        )}

        {/* Header with timer and tab counter */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-xl md:text-2xl">{title}</CardTitle>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    Tab Switches: <span className="text-destructive">{tabSwitches}</span>
                  </span>
                </div>
                <div
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
                    timeRemaining < 60 ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
                  }`}
                >
                  <Clock className="h-4 w-4" />
                  <span className="font-mono text-lg font-bold">{formatTime(timeRemaining)}</span>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Game Content */}
        <Card className="mb-6">
          <CardContent className="p-6">{children}</CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Exit Game
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} size="lg">
            {isSubmitting ? "Submitting..." : "Submit Answers"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export function useGameState() {
  const [tabSwitches, setTabSwitches] = useState(0)
  const [startTime] = useState(Date.now())

  const getTimeSpent = () => Math.floor((Date.now() - startTime) / 1000)
  const getTabSwitches = () => tabSwitches

  return { tabSwitches, setTabSwitches, getTimeSpent, getTabSwitches }
}
