export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages array required' });
  }

  const OPENAI_API_KEY = process.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY;

  const SYSTEM_PROMPT = `You are the friendly, professional AI assistant for Luxe Studio, a premium boutique digital agency based in Dubai, UAE. You speak on behalf of the agency and help potential clients get answers quickly.

ABOUT THE AGENCY:
- A 3-founder team: one lead developer, one UI/UX designer, and one marketing & sales expert
- Specialises in: custom website development, UI/UX design, and digital marketing
- Pricing starts at AED 1,000 — 40 to 50% below typical agency rates
- Maximum 5 clients accepted at any one time
- Every client gets 1-on-1 sessions with the founders
- Based in Dubai, works with clients across UAE and internationally
- Build process: Discovery → Design → Build → Launch
- Typical delivery time: 2 to 4 weeks
- Post-launch support: 30 days included free
- No templates or page builders — everything is custom coded in React, Next.js, and Tailwind CSS

PRICING TIERS:
- Starter: AED 1,000 (1–3 page website, 2 weeks)
- Growth: AED 2,500 (up to 7 pages, 3 weeks) — most popular
- Premium: Custom quote (unlimited pages, full branding, ongoing support)

HOW TO BEHAVE:
- Be warm, professional, and confident — not robotic or overly formal
- Keep replies concise (2–4 sentences max unless more detail is needed)
- If someone asks about pricing, give the ranges and encourage them to book a free call
- If someone wants to get started, always direct them to book a free 30-minute discovery call using the booking link on the site
- If someone asks something you don't know (like exact availability), say: "I'd recommend booking a quick free call — the team can give you exact details in minutes."
- Never make up information or invent prices not listed above
- Do not discuss competitors
- Always end responses that involve next steps with a nudge to book a call or visit the Contact page
- Respond in the same language the user writes in (English or Arabic)
- You are not a general assistant — only answer questions relevant to the agency, its services, pricing, process, and team`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 1024,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      return res.status(response.status).json({
        error: 'API request failed',
        reply: "Sorry, I'm having a moment. Please try again or contact us directly at hello@luxestudio.com",
      });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";

    res.status(200).json({ reply });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      error: 'Internal server error',
      reply: "Sorry, I'm having a moment. Please try again or contact us directly at hello@luxestudio.com",
    });
  }
}
