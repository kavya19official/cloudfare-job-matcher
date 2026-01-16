// backend/routes.ts

export async function handleRequest(request: Request): Promise<Response> {
    const url = new URL(request.url);
  
    // Temporary fake AI for testing
    function fakeInferSkills(text: string) {
      return [
        { name: "Electrical Wiring", confidence: 0.9 },
        { name: "Switch Repair", confidence: 0.8 },
      ];
    }
  
    function fakeMatchJobs(workerId: string | null) {
      return [
        { id: "1", title: "House Wiring", requiredSkills: ["Electrical Wiring"] },
        { id: "2", title: "Switch Installation", requiredSkills: ["Switch Repair"] },
      ];
    }
  
    if (url.pathname === '/onboard-worker' && request.method === 'POST') {
        const data: { text: string } = await request.json(); // tell TS what to expect
        const skills = fakeInferSkills(data.text);
        return new Response(JSON.stringify({ skills }), { status: 200 });
      }
      
  
    if (url.pathname === '/match-jobs' && request.method === 'GET') {
      const workerId = url.searchParams.get('workerId');
      const jobs = fakeMatchJobs(workerId);
      return new Response(JSON.stringify({ jobs }), { status: 200 });
    }
  
    return new Response('Not found', { status: 404 });
  }
  