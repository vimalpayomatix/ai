export type AiResponse = {
  message?: string;
  response?: string;
  text?: string;
  answer?: string;
  [key: string]: unknown;
};

export async function sendPromptToApi(prompt: string): Promise<string> {
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ promt: prompt })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Request failed');
  }

  const data: AiResponse = await res.json();
  const candidate = data?.message ?? data?.response ?? data?.text ?? data?.answer;
  return typeof candidate === 'string' ? candidate : JSON.stringify(data);
}


