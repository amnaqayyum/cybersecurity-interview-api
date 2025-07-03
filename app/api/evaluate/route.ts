import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import { type NextRequest, NextResponse } from "next/server"

// Allow responses up to 30 seconds for complex evaluations
export const maxDuration = 30

interface QuestionData {
  question: string
  answer: string[]
  category: string
}

interface EvaluationRequest {
  question: QuestionData
  user_answer: string
  role: string
  experience_level: string
}

interface ScoreBreakdown {
  coverage_score: number
  technical_accuracy: number
  communication_quality: number
  additional_insights: number
}

interface EvaluationResponse {
  success: boolean
  evaluation?: {
    overall_score: number
    breakdown: ScoreBreakdown
    feedback: {
      strengths: string[]
      improvements: string[]
      specific_suggestions: string[]
    }
    expert_reference: string[]
    xp_earned: number
  }
  error?: {
    code: string
    message: string
    details: string
  }
}

function calculateXP(overallScore: number): number {
  if (overallScore >= 90) return 35
  if (overallScore >= 80) return 30
  if (overallScore >= 70) return 25
  if (overallScore >= 60) return 20
  if (overallScore >= 50) return 15
  return 10
}

export async function POST(req: NextRequest) {
  try {
    const body: EvaluationRequest = await req.json()

    // Validate required fields
    if (!body.question || !body.user_answer || !body.role || !body.experience_level) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_REQUEST",
            message: "Missing required fields",
            details: "question, user_answer, role, and experience_level are required",
          },
        },
        { status: 400 },
      )
    }

    const { question, user_answer, role, experience_level } = body

    // Create evaluation prompt
    const evaluationPrompt = `
You are an expert cybersecurity interviewer evaluating a candidate's response for a ${role} position at ${experience_level} level.

QUESTION: ${question.question}
CATEGORY: ${question.category}

EXPERT ANSWER (Reference):
${question.answer.map((point, index) => `${index + 1}. ${point}`).join("\n")}

CANDIDATE'S ANSWER:
${user_answer}

Please evaluate the candidate's answer and provide a detailed assessment. Consider:

1. COVERAGE SCORE (0-30): How many key points from the expert answer were covered?
2. TECHNICAL ACCURACY (0-30): How technically correct and precise is the information?
3. COMMUNICATION QUALITY (0-25): How clear, structured, and professional is the response?
4. ADDITIONAL INSIGHTS (0-15): Any extra knowledge, best practices, or tools mentioned beyond the basic requirements?

Provide your response in the following JSON format:
{
  "coverage_score": <number 0-30>,
  "technical_accuracy": <number 0-30>,
  "communication_quality": <number 0-25>,
  "additional_insights": <number 0-15>,
  "strengths": [<array of specific strengths found in the answer>],
  "improvements": [<array of specific areas for improvement>],
  "specific_suggestions": [<array of actionable learning suggestions>]
}

Be specific and constructive in your feedback. Focus on cybersecurity best practices and industry standards.
`

    // Call OpenAI API using AI SDK
    const result = await generateText({
      model: openai("gpt-4o"),
      prompt: evaluationPrompt,
      temperature: 0.3, // Lower temperature for more consistent evaluations
    })

    // Parse the AI response
    let aiEvaluation
    try {
      // Extract JSON from the response
      const jsonMatch = result.text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error("No JSON found in AI response")
      }
      aiEvaluation = JSON.parse(jsonMatch[0])
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError)
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "EVALUATION_FAILED",
            message: "Unable to parse evaluation results",
            details: "AI response format error",
          },
        },
        { status: 500 },
      )
    }

    // Calculate overall score and XP
    const overallScore =
      aiEvaluation.coverage_score +
      aiEvaluation.technical_accuracy +
      aiEvaluation.communication_quality +
      aiEvaluation.additional_insights

    const xpEarned = calculateXP(overallScore)

    // Format response
    const evaluationResponse: EvaluationResponse = {
      success: true,
      evaluation: {
        overall_score: overallScore,
        breakdown: {
          coverage_score: aiEvaluation.coverage_score,
          technical_accuracy: aiEvaluation.technical_accuracy,
          communication_quality: aiEvaluation.communication_quality,
          additional_insights: aiEvaluation.additional_insights,
        },
        feedback: {
          strengths: aiEvaluation.strengths || [],
          improvements: aiEvaluation.improvements || [],
          specific_suggestions: aiEvaluation.specific_suggestions || [],
        },
        expert_reference: question.answer,
        xp_earned: xpEarned,
      },
    }

    return NextResponse.json(evaluationResponse)
  } catch (error: any) {
    console.error("API Error:", error)

    // Handle specific OpenAI errors
    if (error.message?.includes("rate limit")) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "RATE_LIMIT_EXCEEDED",
            message: "OpenAI API rate limit exceeded",
            details: "Please try again in a few moments",
          },
        },
        { status: 429 },
      )
    }

    if (error.message?.includes("API key")) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "API_KEY_ERROR",
            message: "OpenAI API key configuration error",
            details: "Please check your API key configuration",
          },
        },
        { status: 401 },
      )
    }

    // Generic error response
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "EVALUATION_FAILED",
          message: "Unable to evaluate the answer at this time",
          details: error.message || "Internal server error",
        },
      },
      { status: 500 },
    )
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "METHOD_NOT_ALLOWED",
        message: "GET method not supported",
        details: "Use POST to submit evaluation requests",
      },
    },
    { status: 405 },
  )
}
