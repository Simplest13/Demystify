import { config } from 'dotenv';
config();

import '@/ai/flows/plain-language-translation.ts';
import '@/ai/flows/ai-summarization.ts';
import '@/ai/flows/interactive-qa.ts';
import '@/ai/flows/deadline-identification.ts';