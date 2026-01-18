export interface Profile {
  student: boolean | null;
  female: boolean | null;
  bpl: boolean | null;
  farmer: boolean | null;
  small_business_owner: boolean | null;
  disability: boolean | null;
  married: boolean | null;
  age: number | null;
  income: number | null;
  education_level: string | null;
  employment_status: string | null;
  extracted_at: string;
}

/**
 * extractProfile
 * Takes user input (text or transcribed voice) and generates a structured eligibility profile.
 *
 * Features:
 * - Handles missing fields with null
 * - Infers obvious info (student, farmer, BPL, etc.)
 * - Converts income to rupees
 * - Adds optional inferred fields: education_level, employment_status
 * - Safe JSON parsing even if AI returns extra text
 * - Logs warnings for debugging
 *
 * @param userText - Natural language text input from user
 * @param env - Cloudflare environment containing AI binding
 * @returns Structured JSON profile
 */
export async function extractProfile(userText: string, env: any): Promise<Profile | null> {
  // Inline prompt template
  const promptTemplate = `You are an assistant that extracts a structured eligibility profile from the given user input.
  
Please provide a JSON object with the following fields:
- student (boolean or null)
- female (boolean or null)
- bpl (boolean or null)
- farmer (boolean or null)
- small_business_owner (boolean or null)
- disability (boolean or null)
- married (boolean or null)
- age (number or null)
- income (number or null)

If any field is missing or unknown, use null.
Infer obvious info such as if the user is a student, farmer, or BPL.
Convert income to rupees if mentioned in other units.
Add optional inferred fields: education_level, employment_status.
Return only the JSON object.

User input:
{{USER_TEXT}}`;

  // Replace placeholder with user text
  const prompt = promptTemplate.replace("{{USER_TEXT}}", userText);

  // Call Cloudflare AI
  const response = await env.AI.run("@cf/meta/llama-3-8b-instruct", {
    prompt,
  });

  // Extract JSON safely
  let profile: Profile | null = null;
  try {
    const jsonMatch = response.response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      profile = JSON.parse(jsonMatch[0]);
    } else {
      console.warn("No JSON detected in AI response:", response.response);
      return null;
    }
  } catch (err) {
    console.error("Failed to parse AI response:", err, response.response);
    return null;
  }

  if (profile) {
    // Ensure booleans are true/false or null
    profile.student = profile.student === true ? true : profile.student === false ? false : null;
    profile.female = profile.female === true ? true : profile.female === false ? false : null;
    profile.bpl = profile.bpl === true ? true : profile.bpl === false ? false : null;
    profile.farmer = profile.farmer === true ? true : profile.farmer === false ? false : null;
    profile.small_business_owner = profile.small_business_owner === true ? true : profile.small_business_owner === false ? false : null;
    profile.disability = profile.disability === true ? true : profile.disability === false ? false : null;
    profile.married = profile.married === true ? true : profile.married === false ? false : null;

    // Ensure numbers are valid or null
    profile.age = typeof profile.age === "number" && !isNaN(profile.age) ? profile.age : null;
    profile.income = typeof profile.income === "number" && !isNaN(profile.income) ? profile.income : null;

    // Optional inferred fields
    profile.education_level = profile.student ? "Student" : null;
    profile.employment_status = profile.farmer
      ? "Self-Employed (Farmer)"
      : profile.small_business_owner
      ? "Self-Employed (Business)"
      : null;

    // Add timestamp
    profile.extracted_at = new Date().toISOString();
  }

  return profile;
}