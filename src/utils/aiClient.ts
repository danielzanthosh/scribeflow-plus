import { AIConfig } from '../types';

export class OpenRouterClient {
  private config: AIConfig;

  constructor(config: AIConfig) {
    this.config = config;
  }

  public isAvailable(): boolean {
    return this.config.enabled && !!this.config.apiKey.trim();
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.config.apiKey.trim()}`,
    };

    // OpenRouter specific headers for app identification
    if (this.config.baseUrl.includes('openrouter.ai')) {
      headers['HTTP-Referer'] = 'https://scribeflow-plus.local';
      headers['X-Title'] = 'ScribeFlow+';
    }

    return headers;
  }

  private cleanEndpoint(endpoint: string): string {
    let base = this.config.baseUrl.trim().replace(/\/+$/, '');
    if (!base.endsWith('/chat/completions')) {
      base = `${base}/chat/completions`;
    }
    return base;
  }

  private async callChat(systemPrompt: string, userPrompt: string, temperature = 0.2): Promise<string> {
    if (!this.isAvailable()) {
      throw new Error('AI features require an active API key. Please configure your BYOK settings in ScribeFlow+ Settings.');
    }

    const endpoint = this.cleanEndpoint(this.config.baseUrl);
    const model = this.config.model.trim() || 'google/gemini-2.0-flash-001';

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature,
      }),
    });

    if (!response.ok) {
      let errDetail = `Status ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.error?.message) {
          errDetail = errorData.error.message;
        }
      } catch (e) {
        // fallback to status text
      }
      throw new Error(`AI Request Failed (${errDetail})`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('No content returned from AI provider.');
    }
    return content.trim();
  }

  /**
   * Enhances and fixes pasted notes:
   * Fixes typos, broken linebreaks, formats math formulas into KaTeX, and formats tables.
   */
  public async enhanceNotes(rawNotes: string): Promise<string> {
    const systemPrompt = `You are an expert academic scribe and study assistant.
Your task is to enhance and fix pasted study notes for a student copying them by hand into a physical notebook:
1. Fix typos, weird spacing, OCR artifacts, and broken linebreaks.
2. Convert math formulas into clean LaTeX ($inline$ or $$block$$).
3. Convert columnar data into Markdown tables (| Col 1 | Col 2 |).
4. Structure with clear Markdown headers (#, ##, ###) and clean bullet points.
5. PRESERVE all original meaning and facts. Do not add conversational commentary or fluff. Return ONLY the enhanced markdown notes.`;

    return this.callChat(systemPrompt, rawNotes, 0.2);
  }

  /**
   * Refines raw OCR output into pristine Markdown with LaTeX & Tables
   */
  public async refineOcrText(rawOcr: string): Promise<string> {
    const systemPrompt = `You are a specialist in academic OCR transcription.
You are given raw OCR text from a textbook, chalkboard, or handwritten note.
Refine and repair it:
- Fix character misrecognitions (e.g. '0' vs 'O', '1' vs 'l', missing symbols).
- Restore proper LaTeX formulas ($...$ and $$...$$).
- Format tables cleanly in GitHub Flavored Markdown.
- Keep headings and bullet hierarchies neat.
Return ONLY the corrected, clean markdown text.`;

    return this.callChat(systemPrompt, rawOcr, 0.1);
  }

  /**
   * AI-Assisted Semantic Phrase Boundaries
   * Optimizes phrasing for dense academic prose into natural 3-6 word handwriting chunks
   */
  public async optimizePhrases(content: string, targetWords: number = 4): Promise<string[]> {
    const systemPrompt = `You are a study flow assistant. Split the provided text into natural handwriting phrases (mostly ${targetWords}-${targetWords + 2} words each).
Rules:
- Never cut inside inline LaTeX ($...$).
- Keep prepositional and verb phrases naturally grouped.
- Output a strict JSON array of strings: ["phrase 1", "phrase 2", ...]
- Do not output markdown code blocks or explanations, only the raw JSON array.`;

    const raw = await this.callChat(systemPrompt, content, 0.1);
    try {
      const cleaned = raw.replace(/^```json\s*|^```\s*|```$/g, '').trim();
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed) && parsed.every(p => typeof p === 'string')) {
        return parsed;
      }
    } catch (e) {
      // Fallback
    }
    return [raw];
  }
}
