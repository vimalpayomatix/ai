export type AiResponse = {
  message?: string;
  response?: string;
  text?: string;
  answer?: string;
  [key: string]: unknown;
};

export type ResponseType = 'helpful' | 'unhelpful' | 'error';

export interface ProcessedResponse {
  content: string;
  type: ResponseType;
  isFiltered: boolean;
  originalContent?: string;
}

// Keywords and phrases that indicate unhelpful responses
const UNHELPFUL_INDICATORS = [
  "I'm not capable of directly searching",
  "I can't access real-time information",
  "I don't have access to",
  "I cannot browse the internet",
  "I'm unable to",
  "I don't have the ability to",
  "I cannot provide real-time",
  "my knowledge might not be up-to-date",
  "based on my last update",
  "I can guide you on how to find",
  "you can visit",
  "you can set up",
  "you can type in",
  "you can use",
  "you should try",
  "you might want to",
  "you could",
  "you may",
  "I suggest",
  "I recommend",
  "I advise",
  "Here are some steps",
  "Here's how you can",
  "To find",
  "To get",
  "To access"
];

// Check if response is unhelpful
function isUnhelpfulResponse(content: string): boolean {
  const lowerContent = content.toLowerCase();
  return UNHELPFUL_INDICATORS.some(indicator => 
    lowerContent.includes(indicator.toLowerCase())
  );
}

// Generate a helpful alternative response
function generateHelpfulResponse(originalPrompt: string, originalResponse: string): string {
  return `I understand you're looking for current information. While I can't provide real-time data, I can help you with:

• **General knowledge** on the topic
• **Historical context** and background information  
• **Analysis and insights** based on available information
• **Related concepts** that might be useful

Could you rephrase your question to focus on what specific information or analysis you're looking for? I'm here to help with explanations, summaries, and detailed information on topics within my knowledge base.`;
}

// Process and filter AI responses
export function processAiResponse(content: string, originalPrompt: string): ProcessedResponse {
  if (!content || typeof content !== 'string') {
    return {
      content: "I'm sorry, I couldn't generate a proper response. Please try rephrasing your question.",
      type: 'error',
      isFiltered: false
    };
  }

  if (isUnhelpfulResponse(content)) {
    return {
      content: generateHelpfulResponse(originalPrompt, content),
      type: 'unhelpful',
      isFiltered: true,
      originalContent: content
    };
  }

  return {
    content,
    type: 'helpful',
    isFiltered: false
  };
}

export async function sendPromptToApi(prompt: string): Promise<ProcessedResponse> {
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      promt: prompt,
      // Add system prompt to guide AI responses
      system: "You are a helpful AI assistant. Provide direct, useful answers to user questions. If you cannot provide real-time information, focus on what you can help with instead of listing limitations. Be concise and actionable."
    })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Request failed');
  }

  const data: AiResponse = await res.json();
  const candidate = data?.message ?? data?.response ?? data?.text ?? data?.answer;
  const rawContent = typeof candidate === 'string' ? candidate : JSON.stringify(data);
  
  return processAiResponse(rawContent, prompt);
}


