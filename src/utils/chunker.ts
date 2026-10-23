import { Chunk, ChunkType } from '../types';

interface ChunkOptions {
  mode: 'short' | 'balanced' | 'long' | 'sentence';
  targetWords?: number; // defaults: short=3, balanced=5, long=8
}

// Common prepositions, conjunctions, and auxiliary verbs that bind phrases
const PHRASE_STARTERS = new Set([
  'in', 'on', 'at', 'by', 'for', 'with', 'about', 'against', 'between',
  'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to',
  'from', 'up', 'down', 'under', 'over', 'and', 'but', 'or', 'nor', 'for',
  'yet', 'so', 'although', 'because', 'since', 'unless', 'while', 'where',
  'whereas', 'which', 'that', 'who', 'whom', 'whose', 'when', 'if', 'then',
  'such as', 'as well as', 'due to', 'in order to'
]);

// Words that should not be stranded alone at the end of a chunk
const DONT_END_WITH = new Set([
  'the', 'a', 'an', 'this', 'that', 'these', 'those', 'my', 'your', 'his',
  'her', 'its', 'our', 'their', 'of', 'to', 'in', 'for', 'on', 'with',
  'at', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'and', 'or', 'but'
]);

/**
 * Intelligent Non-AI Chunking Engine for ScribeFlow+
 * Accurately parses Markdown, Tables, LaTeX math, and prose
 * into optimized cognitive handwriting units (3-6 words).
 */
export function chunkDocument(rawContent: string, options: ChunkOptions): Chunk[] {
  if (!rawContent || !rawContent.trim()) {
    return [];
  }

  const lines = rawContent.split(/\r?\n/);
  const chunks: Chunk[] = [];
  let chunkCounter = 0;

  let inCodeBlock = false;
  let codeBlockLanguage = '';
  let inMathBlock = false;
  let mathBlockBuffer: string[] = [];
  let mathStartLine = 0;

  // Set target word boundaries according to mode
  const targetWords = options.targetWords || (
    options.mode === 'short' ? 3 :
    options.mode === 'balanced' ? 5 :
    options.mode === 'long' ? 8 : 12
  );

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const rawLine = lines[lineIdx];
    const trimmed = rawLine.trim();

    // Empty line
    if (!trimmed) {
      continue;
    }

    // Check for LaTeX display math block: $$ or \[
    if (trimmed.startsWith('$$') || trimmed.startsWith('\\[')) {
      if (inMathBlock) {
        // Closing math block
        mathBlockBuffer.push(trimmed);
        const formula = mathBlockBuffer.join('\n');
        chunks.push({
          id: `chunk-${chunkCounter++}`,
          index: chunks.length,
          type: 'math-block',
          text: formula,
          rawText: formula,
          sourceLine: mathStartLine,
          wordCount: formula.split(/\s+/).length,
          mathExpression: formula.replace(/^\$\$|\$\$$|^\\\[|\\\]$/g, '').trim(),
        });
        inMathBlock = false;
        mathBlockBuffer = [];
        continue;
      } else {
        // Opening math block (single-line or multiline)
        if ((trimmed.startsWith('$$') && trimmed.endsWith('$$') && trimmed.length > 2) ||
            (trimmed.startsWith('\\[') && trimmed.endsWith('\\]') && trimmed.length > 2)) {
          // Single-line block math
          chunks.push({
            id: `chunk-${chunkCounter++}`,
            index: chunks.length,
            type: 'math-block',
            text: trimmed,
            rawText: trimmed,
            sourceLine: lineIdx + 1,
            wordCount: trimmed.split(/\s+/).length,
            mathExpression: trimmed.replace(/^\$\$|\$\$$|^\\\[|\\\]$/g, '').trim(),
          });
          continue;
        } else {
          inMathBlock = true;
          mathStartLine = lineIdx + 1;
          mathBlockBuffer = [trimmed];
          continue;
        }
      }
    }

    if (inMathBlock) {
      mathBlockBuffer.push(trimmed);
      if (trimmed.endsWith('$$') || trimmed.endsWith('\\]')) {
        const formula = mathBlockBuffer.join('\n');
        chunks.push({
          id: `chunk-${chunkCounter++}`,
          index: chunks.length,
          type: 'math-block',
          text: formula,
          rawText: formula,
          sourceLine: mathStartLine,
          wordCount: formula.split(/\s+/).length,
          mathExpression: formula.replace(/^\$\$|\$\$$|^\\\[|\\\]$/g, '').trim(),
        });
        inMathBlock = false;
        mathBlockBuffer = [];
      }
      continue;
    }

    // Check for Code Block: ```
    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        inCodeBlock = false;
        continue;
      } else {
        inCodeBlock = true;
        codeBlockLanguage = trimmed.slice(3).trim();
        continue;
      }
    }

    if (inCodeBlock) {
      chunks.push({
        id: `chunk-${chunkCounter++}`,
        index: chunks.length,
        type: 'code',
        text: rawLine,
        rawText: rawLine,
        sourceLine: lineIdx + 1,
        wordCount: rawLine.trim().split(/\s+/).length,
      });
      continue;
    }

    // Check for Markdown Headings (# Header)
    if (trimmed.startsWith('#')) {
      chunks.push({
        id: `chunk-${chunkCounter++}`,
        index: chunks.length,
        type: 'heading',
        text: trimmed,
        rawText: trimmed,
        sourceLine: lineIdx + 1,
        wordCount: trimmed.split(/\s+/).length,
      });
      continue;
    }

    // Check for Markdown Table Rows (| Col 1 | Col 2 |)
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      // Check if it's a separator line (| --- | --- |)
      if (/^\|[\s\-:|]+\|$/.test(trimmed)) {
        continue; // Skip separator line
      }

      // Parse cells
      const cells = trimmed
        .split('|')
        .slice(1, -1)
        .map(c => c.trim());

      // If user is in cell mode, break each cell; otherwise row chunk
      const rowText = cells.join('  •  ');
      chunks.push({
        id: `chunk-${chunkCounter++}`,
        index: chunks.length,
        type: 'table-row',
        text: `📊 ${rowText}`,
        rawText: trimmed,
        sourceLine: lineIdx + 1,
        wordCount: rowText.split(/\s+/).length,
        tableInfo: {
          row: lineIdx + 1,
          col: cells.length,
          header: cells[0] || '',
          totalRows: 0,
          totalCols: cells.length,
        }
      });
      continue;
    }

    // Check for List Items (- item, * item, 1. item)
    const listMatch = trimmed.match(/^([-*+]|\d+\.)\s+(.+)$/);
    if (listMatch) {
      const prefix = listMatch[1];
      const body = listMatch[2];
      
      // If the list item is short, make it a single chunk
      const itemWords = body.split(/\s+/);
      if (itemWords.length <= targetWords + 2 || options.mode === 'sentence') {
        chunks.push({
          id: `chunk-${chunkCounter++}`,
          index: chunks.length,
          type: 'list-item',
          text: `${prefix} ${body}`,
          rawText: trimmed,
          sourceLine: lineIdx + 1,
          wordCount: itemWords.length + 1,
        });
      } else {
        // Chunk the list body with bullet prefix attached to first chunk
        const subChunks = chunkProseLine(body, targetWords, options.mode);
        subChunks.forEach((sc, i) => {
          chunks.push({
            id: `chunk-${chunkCounter++}`,
            index: chunks.length,
            type: 'list-item',
            text: i === 0 ? `${prefix} ${sc}` : `  ↳ ${sc}`,
            rawText: trimmed,
            sourceLine: lineIdx + 1,
            wordCount: sc.split(/\s+/).length,
          });
        });
      }
      continue;
    }

    // Standalone LaTeX equation line: $[math]$
    if (/^\$[^$]+\$$/.test(trimmed)) {
      chunks.push({
        id: `chunk-${chunkCounter++}`,
        index: chunks.length,
        type: 'math-inline',
        text: trimmed,
        rawText: trimmed,
        sourceLine: lineIdx + 1,
        wordCount: trimmed.split(/\s+/).length,
        mathExpression: trimmed.slice(1, -1).trim(),
      });
      continue;
    }

    // Standard Prose / Text line
    if (options.mode === 'sentence') {
      const sentenceChunks = splitIntoSentences(trimmed);
      for (const sent of sentenceChunks) {
        chunks.push({
          id: `chunk-${chunkCounter++}`,
          index: chunks.length,
          type: 'text',
          text: sent,
          rawText: sent,
          sourceLine: lineIdx + 1,
          wordCount: sent.split(/\s+/).length,
        });
      }
    } else {
      const proseChunks = chunkProseLine(trimmed, targetWords, options.mode);
      for (const pChunk of proseChunks) {
        // Check if chunk is primarily math
        const isMath = /^\$[^$]+\$$/.test(pChunk.trim());
        chunks.push({
          id: `chunk-${chunkCounter++}`,
          index: chunks.length,
          type: isMath ? 'math-inline' : 'text',
          text: pChunk,
          rawText: pChunk,
          sourceLine: lineIdx + 1,
          wordCount: pChunk.split(/\s+/).length,
          mathExpression: isMath ? pChunk.trim().slice(1, -1).trim() : undefined,
        });
      }
    }
  }

  return chunks;
}

/**
 * Splits text into sentences, protecting decimals and abbreviations
 */
function splitIntoSentences(text: string): string[] {
  // Protect common abbreviations and numbers with decimals (e.g. 3.14, e.g., Dr., Fig.)
  const protectedText = text
    .replace(/(\d+)\.(\d+)/g, '$1__DECIMAL__$2')
    .replace(/(e\.g\.|i\.e\.|etc\.|vs\.|Dr\.|Prof\.|Fig\.|al\.)/gi, (match) => {
      return match.replace(/\./g, '__DOT__');
    });

  const rawSentences = protectedText.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];
  return rawSentences
    .map(s => s.replace(/__DECIMAL__/g, '.').replace(/__DOT__/g, '.').trim())
    .filter(s => s.length > 0);
}

/**
 * Intelligent syntactic clause chunker:
 * Breaks a prose line into 3-6 word phrases, respecting clause punctuation,
 * conjunctions, prepositions, and inline math ($...$).
 */
function chunkProseLine(line: string, targetWords: number, mode: string): string[] {
  // First, extract inline math so it never gets broken mid-formula
  const mathTokens: string[] = [];
  const tokenizedLine = line.replace(/\$([^$]+)\$/g, (_, math) => {
    mathTokens.push(`$${math}$`);
    return `__MATH_TOKEN_${mathTokens.length - 1}__`;
  });

  // Split into punctuation-delimited clauses (commas, semicolons, dashes, colons)
  const clauseRegex = /([^,;:—]+[,;:—]?)/g;
  const rawClauses = tokenizedLine.match(clauseRegex) || [tokenizedLine];

  const resultChunks: string[] = [];
  let currentWords: string[] = [];

  for (const clause of rawClauses) {
    const clauseTrimmed = clause.trim();
    if (!clauseTrimmed) continue;

    const words = clauseTrimmed.split(/\s+/);

    // If the entire clause fits nicely in target range (e.g. 3 to targetWords + 1)
    if (currentWords.length === 0 && words.length <= targetWords + 1) {
      resultChunks.push(restoreMath(words.join(' '), mathTokens));
      continue;
    }

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const lowerWord = word.toLowerCase().replace(/[^a-z]/g, '');

      // Check if we should split before this word
      const wordCountSoFar = currentWords.length;
      const shouldConsiderSplit = wordCountSoFar >= targetWords - 1;
      const isNaturalBreakPoint = PHRASE_STARTERS.has(lowerWord);

      if (shouldConsiderSplit && isNaturalBreakPoint && wordCountSoFar > 0) {
        // Ensure previous chunk didn't end with a weak dangling word
        const lastWord = currentWords[currentWords.length - 1].toLowerCase().replace(/[^a-z]/g, '');
        if (!DONT_END_WITH.has(lastWord)) {
          resultChunks.push(restoreMath(currentWords.join(' '), mathTokens));
          currentWords = [];
        }
      }

      currentWords.push(word);

      // Force split if we exceeded maximum target words (target + 2)
      if (currentWords.length >= targetWords + 2) {
        const lastWord = currentWords[currentWords.length - 1].toLowerCase().replace(/[^a-z]/g, '');
        // Don't end on "the", "of", "and" if we have upcoming words
        if (!DONT_END_WITH.has(lastWord) || i === words.length - 1) {
          resultChunks.push(restoreMath(currentWords.join(' '), mathTokens));
          currentWords = [];
        }
      }
    }

    // Check if the clause has a natural punctuation ending (, ; : —)
    if (currentWords.length >= targetWords - 1) {
      resultChunks.push(restoreMath(currentWords.join(' '), mathTokens));
      currentWords = [];
    }
  }

  // Push any remaining words
  if (currentWords.length > 0) {
    // If the remaining is just 1 or 2 words and we already have chunks, merge with last chunk
    // to avoid lonely awkward words
    if (currentWords.length <= 2 && resultChunks.length > 0) {
      const last = resultChunks.pop()!;
      resultChunks.push(`${last} ${restoreMath(currentWords.join(' '), mathTokens)}`);
    } else {
      resultChunks.push(restoreMath(currentWords.join(' '), mathTokens));
    }
  }

  return resultChunks.filter(c => c.trim().length > 0);
}

/**
 * Re-injects math expressions back into tokenized text
 */
function restoreMath(text: string, mathTokens: string[]): string {
  return text.replace(/__MATH_TOKEN_(\d+)__/g, (_, idxStr) => {
    const idx = parseInt(idxStr, 10);
    return mathTokens[idx] || '';
  });
}
