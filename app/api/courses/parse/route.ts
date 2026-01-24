import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const PARSE_PROMPT = `You are an expert at extracting structured course data from university documents.

Given the raw text from a course catalog PDF, extract all courses into a JSON array.

OUTPUT FORMAT (JSON only, no markdown):
{
  "courses": [
    {
      "code": "CSC101",
      "title": "Introduction to Computer Engineering",
      "units": 3,
      "semester_id": "100-1",
      "is_elective": false
    }
  ]
}

RULES:
- semester_id format: "LEVEL-SEMESTER" e.g., "100-1" = Year 1 Semester 1, "200-2" = Year 2 Semester 2
- Extract the level (100, 200, 300, 400, 500) from course codes if available
- units should be an integer (credit hours)
- is_elective: true if the course is optional/elective, false for compulsory
- Include ALL courses found in the text
- Return ONLY valid JSON, no markdown code blocks`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pdfText, department } = body as {
      pdfText: string;
      department?: string;
    };

    if (!pdfText || pdfText.trim().length < 50) {
      return NextResponse.json(
        { error: "Please provide more course content to parse" },
        { status: 400 },
      );
    }

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `${PARSE_PROMPT}\n\nDepartment: ${department || "Computer Engineering"}\n\nRAW COURSE CATALOG TEXT:\n${pdfText}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 8192,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "AI returned empty response" },
        { status: 500 },
      );
    }

    try {
      const parsed = JSON.parse(content);

      // Validate structure
      if (!parsed.courses || !Array.isArray(parsed.courses)) {
        return NextResponse.json(
          { error: "Invalid response structure", raw: content },
          { status: 500 },
        );
      }

      // Add department and SANITIZE units to valid range (1-6)
      const coursesWithDept = parsed.courses.map(
        (c: Record<string, unknown>) => ({
          ...c,
          department: department || "Computer Engineering",
          // Clamp units to valid range to avoid DB constraint violations
          units: Math.max(1, Math.min(6, Number(c.units) || 3)),
        }),
      );

      // DEDUPLICATE by course code - keep first occurrence
      const seen = new Set<string>();
      const uniqueCourses = coursesWithDept.filter(
        (course: { code: string }) => {
          if (seen.has(course.code)) {
            console.log(
              `Duplicate course code found and removed: ${course.code}`,
            );
            return false;
          }
          seen.add(course.code);
          return true;
        },
      );

      return NextResponse.json({
        courses: uniqueCourses,
        count: uniqueCourses.length,
      });
    } catch {
      return NextResponse.json(
        { error: "Failed to parse AI response", raw: content },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Course parse error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
