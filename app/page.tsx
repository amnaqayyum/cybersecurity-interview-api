"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Activity } from "lucide-react"

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const testAPI = async () => {
    setIsLoading(true)
    setResult(null)

    const testPayload = {
      question: {
        question: "Multiple failed login attempts detected from the same IP address. What steps do you take?",
        answer: [
          "Review SIEM logs for frequency, source IP, and targeted accounts",
          "Check for correlation with successful logins that follow failed attempts",
          "Determine if attempts follow a brute-force pattern or credential stuffing",
          "Investigate whether it's isolated or widespread across the network",
          "Block or monitor the IP address if determined to be malicious",
          "Notify affected users and enforce password resets if necessary",
          "Implement or tune detection rules for future monitoring",
        ],
        category: "scenario",
      },
      user_answer:
        "I would first check the logs to see how many failed attempts there were. Then I would block the IP address if it looks suspicious and maybe reset passwords for affected users.",
      role: "SOC Analyst",
      experience_level: "entry_level",
    }

    try {
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testPayload),
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        error: {
          code: "NETWORK_ERROR",
          message: "Failed to connect to API",
          details: error instanceof Error ? error.message : "Unknown error",
        },
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Cybersecurity Interview API</h1>
          <p className="text-lg text-gray-600">AI-powered evaluation system for cybersecurity bootcamp interviews</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              API Test Interface
            </CardTitle>
            <CardDescription>Test the evaluation API with a sample cybersecurity scenario</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={testAPI} disabled={isLoading} className="w-full">
              {isLoading ? "Evaluating..." : "Test API Evaluation"}
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {result.success ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                Evaluation Result
              </CardTitle>
            </CardHeader>
            <CardContent>
              {result.success ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{result.evaluation.overall_score}</div>
                      <div className="text-sm text-gray-500">Overall Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {result.evaluation.breakdown.coverage_score}
                      </div>
                      <div className="text-sm text-gray-500">Coverage</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {result.evaluation.breakdown.technical_accuracy}
                      </div>
                      <div className="text-sm text-gray-500">Technical</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{result.evaluation.xp_earned}</div>
                      <div className="text-sm text-gray-500">XP Earned</div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-green-700 mb-2">Strengths</h3>
                    <div className="space-y-1">
                      {result.evaluation.feedback.strengths.map((strength: string, index: number) => (
                        <Badge key={index} variant="secondary" className="mr-2 mb-2">
                          {strength}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-red-700 mb-2">Areas for Improvement</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {result.evaluation.feedback.improvements.map((improvement: string, index: number) => (
                        <li key={index}>{improvement}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-blue-700 mb-2">Specific Suggestions</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {result.evaluation.feedback.specific_suggestions.map((suggestion: string, index: number) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-red-600">
                  <p className="font-semibold">Error: {result.error.code}</p>
                  <p>{result.error.message}</p>
                  <p className="text-sm text-gray-500">{result.error.details}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>API Endpoints</CardTitle>
            <CardDescription>Available endpoints for integration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Badge variant="outline" className="mr-2">
                  POST
                </Badge>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">/api/evaluate</code>
                <p className="text-sm text-gray-600 mt-1">Submit answers for AI evaluation</p>
              </div>
              <div>
                <Badge variant="outline" className="mr-2">
                  GET
                </Badge>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">/api/health</code>
                <p className="text-sm text-gray-600 mt-1">Check API health status</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
