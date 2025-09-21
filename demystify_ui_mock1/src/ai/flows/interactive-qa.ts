'use server';

/**
 * @fileOverview This file defines a Genkit flow for answering user questions about a legal document.
 *
 * - interactiveQA - A function that takes a document and a question and returns an answer.
 * - InteractiveQAInput - The input type for the interactiveQA function.
 * - InteractiveQAOutput - The return type for the interactiveQA function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InteractiveQAInputSchema = z.object({
  documentText: z
    .string()
    .describe('The text content of the legal document.'),
  question: z.string().describe('The user question about the document.'),
});
export type InteractiveQAInput = z.infer<typeof InteractiveQAInputSchema>;

const InteractiveQAOutputSchema = z.object({
  answer: z.string().describe('The AI-powered answer to the user question.'),
});
export type InteractiveQAOutput = z.infer<typeof InteractiveQAOutputSchema>;

export async function interactiveQA(input: InteractiveQAInput): Promise<InteractiveQAOutput> {
  return interactiveQAFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interactiveQAPrompt',
  input: {schema: InteractiveQAInputSchema},
  output: {schema: InteractiveQAOutputSchema},
  prompt: `You are an AI assistant specialized in answering questions about legal documents.

  Here is the document text:
  {{documentText}}

  Now, answer the following question:
  {{question}}

  Provide a concise and accurate answer based on the information in the document.
  If the answer is not contained within the document, respond that you cannot answer the question.`,
});

const interactiveQAFlow = ai.defineFlow(
  {
    name: 'interactiveQAFlow',
    inputSchema: InteractiveQAInputSchema,
    outputSchema: InteractiveQAOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
