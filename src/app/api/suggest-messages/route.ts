export const runtime = 'nodejs';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function GET() {
  try {
    console.log('Generating message suggestions...');
    
    if (!process.env.GEMINI_API_KEY) {
      console.error('Gemini API key not found');
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    console.log('API Key present:', process.env.GEMINI_API_KEY?.substring(0, 10) + '...');

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.8,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 100,
      },
    });

    const result = await model.generateContent('Create 3 short anonymous message suggestions separated by ||. Each under 50 characters.');
    const response = await result.response;
    const generatedText = response.text().trim();
    
    console.log('Message suggestions generated successfully:', generatedText);

    return NextResponse.json({ 
      success: true, 
      message: generatedText,
      suggestions: generatedText.split('||').map(s => s.trim()),
      model: 'gemini-1.5-flash'
    });
    
  } catch (error) {
    console.error('Error generating suggestions:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to generate suggestions', 
        details: error instanceof Error ? error.message : 'Unknown error',
        apiKeyPresent: !!process.env.GEMINI_API_KEY
      },
      { status: 500 }
    );
  }
} 