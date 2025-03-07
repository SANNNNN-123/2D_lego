import { NextResponse } from 'next/server';
import { Together } from 'together-ai';

const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    
    const formattedPrompt = `A 2D pixel art of a ${prompt}, created using a grid of square pixels.`;
    const negativePrompt = "shadow, multiple objects";

    const response = await together.images.create({
      prompt: formattedPrompt,
      model: "black-forest-labs/FLUX.1-schnell-Free",
      width: 352, //must be multiple of 16
      height: 272, //must be multiple of 16
      steps: 4,
      n: 1,
      response_format: "base64",
      negative_prompt: negativePrompt
    });

    return NextResponse.json({ image: response.data[0].b64_json });
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
  }
} 