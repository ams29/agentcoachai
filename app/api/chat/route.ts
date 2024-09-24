import { NextRequest } from 'next/server';
import axios from 'axios';

const NEXT_PUBLIC_OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const REAL_ESTATE_BASE_URL = process.env.REAL_ESTATE_BASE_URL;
const SALES_BASE_URL = process.env.SALES_BASE_URL;
const MARKETING_BASE_URL = process.env.MARKETING_BASE_URL;
const MOTIVATION_BASE_URL = process.env.MOTIVATION_BASE_URL;

// Map of chatbot types to their base URLs
const BASE_URLS: { [key: string]: string } = {
  real_estate: REAL_ESTATE_BASE_URL!,
  sales: SALES_BASE_URL!,
  marketing: MARKETING_BASE_URL!,
  motivation: MOTIVATION_BASE_URL!,
};

const systemPrompt = {
  general:
    "You are an exceptional real estate expert and a representative of agentcoach.ai, the leading AI real estate coaching platform...",
  real_estate:
    'As a seasoned real estate expert, provide in-depth knowledge and advice on real estate industry trends...',
  sales:
    "As a top-tier sales expert specializing in real estate, offer cutting-edge, practical sales techniques and strategies...",
  marketing:
    'As a seasoned marketing and communication expert in real estate, provide innovative strategies to enhance branding...',
  negotiation:
    'As a world-class negotiator in real estate transactions, provide strategic advice on successful negotiations...',
  motivation:
    'You are an elite motivational coach with unparalleled empathy and insight, specializing in inspiring real estate professionals...',
};

async function getTopKResults(body: Record<string, unknown>, baseUrl: string) {
  try {
    const response = await fetch(`${baseUrl}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': PINECONE_API_KEY!,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in getTopKResults:', error);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { messages, chatbot, expert } = await req.json();

    if (!messages || !chatbot || !expert) {
      return new Response(JSON.stringify({ error: 'Messages, chatbot type, and expert are required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Map 'general' and 'negotiation' to 'real_estate' base URL
    let baseUrl = BASE_URLS[chatbot];
    if (!baseUrl) {
      baseUrl = REAL_ESTATE_BASE_URL!;
    }

    const question = messages[messages.length - 1].content;

    const embeddingResponse = await axios.post(
      'https://api.openai.com/v1/embeddings',
      {
        model: 'text-embedding-3-large',
        input: question,
      },
      {
        headers: {
          Authorization: `Bearer ${NEXT_PUBLIC_OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const embedding = embeddingResponse.data.data[0].embedding;

    const body = {
      vector: embedding,
      topK: 7,
      includeValues: false,
      includeMetadata: true,
    };

    const topKResults = await getTopKResults(body, baseUrl);
    let context = 'This is the Context : ';

    if (topKResults && Array.isArray(topKResults.matches)) {
      topKResults.matches.forEach((match: { metadata: { values: string } }) => {
        context += match.metadata.values + ' ';
      });
    } else {
      console.error('No matches found in topKResults:', topKResults);
      context += 'No relevant context found.';
    }

    // Use the 'expert' parameter to select the appropriate prompt
    const promptKey = expert.toLowerCase().replace(/\s+/g, '_') as keyof typeof systemPrompt;
    const systemMessage = systemPrompt[promptKey] || systemPrompt['general'];

    // Prepare the messages for OpenAI API
    const openAIMessages = [{ role: 'system', content: systemMessage + context }, ...messages];

    // Create a stream to handle the OpenAI streaming response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${NEXT_PUBLIC_OPENAI_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'gpt-4o-mini', // Replace with 'gpt-4-mini' if available
              messages: openAIMessages,
              stream: true,
            }),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(`OpenAI API error: ${error.error.message}`);
          }

          const reader = response.body!.getReader();
          const decoder = new TextDecoder();
          let done = false;

          while (!done) {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            const chunkValue = decoder.decode(value);
            // Parse the chunkValue to extract the assistant's message
            const lines = chunkValue.split('\n').filter((line) => line.trim() !== '');
            for (const line of lines) {
              const message = line.replace(/^data: /, '');
              if (message === '[DONE]') {
                controller.close();
                return;
              }
              try {
                const parsed = JSON.parse(message);
                const content = parsed.choices[0].delta.content;
                if (content) {
                  controller.enqueue(new TextEncoder().encode(content));
                }
              } catch (e) {
                console.error('Error parsing OpenAI response:', e);
              }
            }
          }
        } catch (e) {
          console.error('Error in streaming:', e);
          controller.error(e);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Detailed error in LLM generation:', error);

    let errorMessage = 'Internal Server Error';
    let statusCode = 500;

    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', error.response?.data);
      errorMessage = error.response?.data?.error || 'Error in API request';
      statusCode = error.response?.status || 500;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return new Response(
      JSON.stringify({
        error: errorMessage,
        details: error instanceof Error ? error.stack : 'Unknown error',
      }),
      {
        status: statusCode,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
