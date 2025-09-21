'use server';

/**
 * @fileOverview This file defines a Genkit flow for translating legal jargon into plain language.
 *
 * - translateToPlainLanguage - A function that translates legal text into plain language.
 * - TranslateToPlainLanguageInput - The input type for the translateToPlainLanguage function.
 * - TranslateToPlainLanguageOutput - The return type for the translateToPlainLanguage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateToPlainLanguageInputSchema = z.object({
  legalText: z
    .string()
    .describe('The legal text to be translated into plain language.'),
});
export type TranslateToPlainLanguageInput = z.infer<
  typeof TranslateToPlainLanguageInputSchema
>;

const TranslateToPlainLanguageOutputSchema = z.object({
  plainLanguageText: z
    .string()
    .describe('The translated text in plain, easily understandable language.'),
});
export type TranslateToPlainLanguageOutput = z.infer<
  typeof TranslateToPlainLanguageOutputSchema
>;

export async function translateToPlainLanguage(
  input: TranslateToPlainLanguageInput
): Promise<TranslateToPlainLanguageOutput> {
  return translateToPlainLanguageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translateToPlainLanguagePrompt',
  input: {schema: TranslateToPlainLanguageInputSchema},
  output: {schema: TranslateToPlainLanguageOutputSchema},
  prompt: `You are an expert legal translator. Your task is to translate complex legal jargon into plain, easily understandable language.

Legal Text: {{{legalText}}}

Translation:`,
});

const translateToPlainLanguageFlow = ai.defineFlow(
  {
    name: 'translateToPlainLanguageFlow',
    inputSchema: TranslateToPlainLanguageInputSchema,
    outputSchema: TranslateToPlainLanguageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
