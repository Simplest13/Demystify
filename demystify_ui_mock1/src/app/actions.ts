
'use server';

import { summarizeDocument, SummarizeDocumentInput } from '@/ai/flows/ai-summarization';
import { identifyDeadlines } from '@/ai/flows/deadline-identification';
import { interactiveQA, InteractiveQAInput } from '@/ai/flows/interactive-qa';
import { translateToPlainLanguage } from '@/ai/flows/plain-language-translation';

export async function analyzeText(text: string) {
  if (!text) {
    return { error: 'Please enter some text to analyze.' };
  }
  try {
    const [translation, deadlines] = await Promise.all([
      translateToPlainLanguage({ legalText: text }),
      identifyDeadlines({ documentText: text }),
    ]);

    return {
      translation: translation.plainLanguageText,
      deadlines: deadlines.deadlines,
      error: null,
    };
  } catch (error) {
    console.error('Error analyzing text:', error);
    return { error: 'An error occurred while analyzing the text.' };
  }
}

export async function summarizeFile(input: SummarizeDocumentInput) {
  try {
    const result = await summarizeDocument(input);
    return { summary: result.summary, error: null };
  } catch (error) {
    console.error('Error summarizing file:', error);
    return { error: 'An error occurred while summarizing the file.' };
  }
}

export async function askQuestion(input: InteractiveQAInput) {
  try {
    const result = await interactiveQA(input);
    return { answer: result.answer, error: null };
  } catch (error) {
    console.error('Error asking question:', error);
    return { error: 'An error occurred while getting an answer.' };
  }
}
