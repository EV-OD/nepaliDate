'use server';

/**
 * @fileOverview Analyzes and summarizes relevant holiday, marriage, and bratabandha dates for a given Bikram Sambat (BS) month using AI.
 *
 * - summarizeRelevantBsEvents - A function that handles the summarization process.
 * - SummarizeRelevantBsEventsInput - The input type for the summarizeRelevantBsEvents function.
 * - SummarizeRelevantBsEventsOutput - The return type for the summarizeRelevantBsEvents function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeRelevantBsEventsInputSchema = z.object({
  year: z.string().describe('The Bikram Sambat year.'),
  month: z.string().describe('The Bikram Sambat month.'),
  holiFest: z.array(z.string()).describe('Array of holiday and festival descriptions.'),
  marriage: z.array(z.string()).describe('Array of marriage date descriptions.'),
  bratabandha: z.array(z.string()).describe('Array of bratabandha date descriptions.'),
});
export type SummarizeRelevantBsEventsInput = z.infer<
  typeof SummarizeRelevantBsEventsInputSchema
>;

const SummarizeRelevantBsEventsOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A concise summary of the relevant holiday, marriage, and bratabandha dates for the specified BS month.'
    ),
});
export type SummarizeRelevantBsEventsOutput = z.infer<
  typeof SummarizeRelevantBsEventsOutputSchema
>;

export async function summarizeRelevantBsEvents(
  input: SummarizeRelevantBsEventsInput
): Promise<SummarizeRelevantBsEventsOutput> {
  return summarizeRelevantBsEventsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeRelevantBsEventsPrompt',
  input: {schema: SummarizeRelevantBsEventsInputSchema},
  output: {schema: SummarizeRelevantBsEventsOutputSchema},
  prompt: `You are an expert in summarizing cultural events and dates from the Bikram Sambat calendar.

  Given the following information about a specific BS month, provide a concise summary highlighting the important holidays, marriage dates, and bratabandha dates.

  Year: {{{year}}}
  Month: {{{month}}}
  Holidays and Festivals: {{#each holiFest}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Marriage Dates: {{#each marriage}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Bratabandha Dates: {{#each bratabandha}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

  Summary: `,
});

const summarizeRelevantBsEventsFlow = ai.defineFlow(
  {
    name: 'summarizeRelevantBsEventsFlow',
    inputSchema: SummarizeRelevantBsEventsInputSchema,
    outputSchema: SummarizeRelevantBsEventsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
