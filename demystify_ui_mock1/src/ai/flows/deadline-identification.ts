'use server';

/**
 * @fileOverview This file contains a Genkit flow for identifying deadlines in legal documents.
 *
 * - identifyDeadlines -  identifies deadlines and due dates mentioned in a legal document.
 * - IdentifyDeadlinesInput - The input type for the identifyDeadlines function.
 * - IdentifyDeadlinesOutput - The return type for the identifyDeadlines function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyDeadlinesInputSchema = z.object({
  documentText: z.string().describe('The text content of the legal document.'),
});
export type IdentifyDeadlinesInput = z.infer<typeof IdentifyDeadlinesInputSchema>;

const IdentifyDeadlinesOutputSchema = z.object({
  deadlines: z
    .array(
      z.object({
        date: z.string().describe('The identified deadline or due date.'),
        context: z
          .string()
          .describe('The surrounding text providing context for the deadline.'),
      })
    )
    .describe('An array of deadlines and their context found in the document.'),
});
export type IdentifyDeadlinesOutput = z.infer<typeof IdentifyDeadlinesOutputSchema>;

export async function identifyDeadlines(
  input: IdentifyDeadlinesInput
): Promise<IdentifyDeadlinesOutput> {
  return identifyDeadlinesFlow(input);
}

const identifyDeadlinesPrompt = ai.definePrompt({
  name: 'identifyDeadlinesPrompt',
  input: {schema: IdentifyDeadlinesInputSchema},
  output: {schema: IdentifyDeadlinesOutputSchema},
  prompt: `You are an AI assistant specializing in legal document analysis.
  Your task is to identify all deadlines and due dates mentioned in the provided legal document text.
  Return an array of deadlines, including the date and surrounding context (a short snippet of the sentence where the deadline is mentioned).

  Legal Document Text:
  {{documentText}}
  `,
});

const identifyDeadlinesFlow = ai.defineFlow(
  {
    name: 'identifyDeadlinesFlow',
    inputSchema: IdentifyDeadlinesInputSchema,
    outputSchema: IdentifyDeadlinesOutputSchema,
  },
  async input => {
    const {output} = await identifyDeadlinesPrompt(input);
    return output!;
  }
);
