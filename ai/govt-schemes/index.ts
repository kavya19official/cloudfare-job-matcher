import { extractProfile, Profile } from './logic/profile';
import { matchSchemes } from './logic/matcher';

// Define the environment interface for Cloudflare Workers
interface Env {
  AI: any; // AI binding, specify type as needed
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    try {
      // Parse user input from JSON body, expecting a "text" field
      const body = await req.json();
      const userText: unknown = body.text;

      // Validate that userText is a non-empty string
      if (typeof userText !== 'string' || userText.trim() === '') {
        return new Response(
          JSON.stringify({ error: 'No valid user text provided' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Extract structured profile using the AI binding
      const profile: Profile | null = await extractProfile(userText, env);
      if (!profile) {
        return new Response(
          JSON.stringify({ error: 'Failed to extract profile' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Match the extracted profile against available schemes
      const eligibleSchemes = matchSchemes(profile);

      // Construct the response payload with profile and matched schemes
      const responsePayload = {
        profile,
        eligibleSchemes,
      };

      // Return the successful JSON response
      return new Response(JSON.stringify(responsePayload), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err: unknown) {
      // Handle unexpected errors gracefully
      const message = err instanceof Error ? err.message : String(err);
      console.error('Error in Cloudflare Worker:', message);

      return new Response(
        JSON.stringify({ error: 'Internal server error', details: message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  },
};