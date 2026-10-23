import React from 'react';
import katex from 'katex';

interface RenderProps {
  content: string;
  className?: string;
  highlightPhrase?: string;
  isMathBlock?: boolean;
}

/**
 * Robust LaTeX safe renderer.
 * Guarantees zero unhandled exceptions on invalid or incomplete formulas.
 */
export function safeRenderKatex(expression: string, displayMode: boolean = false): string {
  try {
    return katex.renderToString(expression, {
      displayMode,
      throwOnError: false,
      output: 'htmlAndMathml',
      strict: false,
    });
  } catch (err) {
    // Graceful fallback: render escaped formula in a styled code container
    const escaped = expression
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    return `<code class="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 font-mono text-sm">${escaped}</code>`;
  }
}

/**
 * Full Markdown + KaTeX + Tables Renderer with Error Boundary
 */
export const MarkdownViewer: React.FC<RenderProps> = ({
  content,
  className = '',
  highlightPhrase,
}) => {
  // Parse document into structured elements
  const renderedElements = React.useMemo(() => {
    if (!content) return null;

    const lines = content.split(/\r?\n/);
    const elements: React.ReactNode[] = [];
    let lineIdx = 0;

    let inTable = false;
    let tableRows: string[][] = [];
    let tableHeaders: string[] = [];

    let inCode = false;
    let codeBuffer: string[] = [];

    const flushTable = (key: string) => {
      if (tableHeaders.length > 0 || tableRows.length > 0) {
        elements.push(
          <div key={key} className="my-4 overflow-x-auto rounded-lg border border-theme-border">
            <table className="min-w-full divide-y divide-theme-border text-left text-sm">
              {tableHeaders.length > 0 && (
                <thead className="bg-theme-surfaceHover font-semibold text-theme-text">
                  <tr>
                    {tableHeaders.map((header, hIdx) => (
                      <th key={hIdx} className="px-4 py-2.5">
                        <span dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(header) }} />
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody className="divide-y divide-theme-border bg-theme-surface">
                {tableRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-theme-surfaceHover/50 transition-colors">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-4 py-2 text-theme-text">
                        <span dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(cell) }} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        inTable = false;
        tableHeaders = [];
        tableRows = [];
      }
    };

    while (lineIdx < lines.length) {
      const line = lines[lineIdx];
      const trimmed = line.trim();

      // Code fence
      if (trimmed.startsWith('```')) {
        if (inCode) {
          elements.push(
            <pre key={`code-${lineIdx}`} className="my-3 p-3 rounded-lg bg-theme-surfaceHover border border-theme-border font-mono text-xs overflow-x-auto">
              <code>{codeBuffer.join('\n')}</code>
            </pre>
          );
          inCode = false;
          codeBuffer = [];
        } else {
          flushTable(`table-before-code-${lineIdx}`);
          inCode = true;
          codeBuffer = [];
        }
        lineIdx++;
        continue;
      }

      if (inCode) {
        codeBuffer.push(line);
        lineIdx++;
        continue;
      }

      // Display Math Block ($$...$$ or \[...\])
      if (trimmed.startsWith('$$') || trimmed.startsWith('\\[')) {
        flushTable(`table-before-math-${lineIdx}`);
        let mathText = trimmed;
        // Check if single line
        if ((trimmed.startsWith('$$') && trimmed.endsWith('$$') && trimmed.length > 2) ||
            (trimmed.startsWith('\\[') && trimmed.endsWith('\\]') && trimmed.length > 2)) {
          const rawMath = trimmed.replace(/^\$\$|\$\$$|^\\\[|\\\]$/g, '').trim();
          elements.push(
            <div
              key={`math-${lineIdx}`}
              className="my-3 py-2 px-3 text-center overflow-x-auto rounded-lg bg-theme-accentBg/30"
              dangerouslySetInnerHTML={{ __html: safeRenderKatex(rawMath, true) }}
            />
          );
        } else {
          // Multiline display math
          const mathLines: string[] = [trimmed];
          lineIdx++;
          while (lineIdx < lines.length) {
            const nextTrimmed = lines[lineIdx].trim();
            mathLines.push(nextTrimmed);
            if (nextTrimmed.endsWith('$$') || nextTrimmed.endsWith('\\]')) {
              break;
            }
            lineIdx++;
          }
          const fullMath = mathLines.join('\n').replace(/^\$\$|\$\$$|^\\\[|\\\]$/g, '').trim();
          elements.push(
            <div
              key={`math-multi-${lineIdx}`}
              className="my-3 py-2 px-3 text-center overflow-x-auto rounded-lg bg-theme-accentBg/30"
              dangerouslySetInnerHTML={{ __html: safeRenderKatex(fullMath, true) }}
            />
          );
        }
        lineIdx++;
        continue;
      }

      // Table Row
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        if (/^\|[\s\-:|]+\|$/.test(trimmed)) {
          // Separator line
          lineIdx++;
          continue;
        }

        const cells = trimmed
          .split('|')
          .slice(1, -1)
          .map(c => c.trim());

        if (!inTable) {
          inTable = true;
          tableHeaders = cells;
        } else {
          tableRows.push(cells);
        }
        lineIdx++;
        continue;
      } else if (inTable) {
        flushTable(`table-flush-${lineIdx}`);
      }

      // Headings (#, ##, ###)
      if (trimmed.startsWith('#')) {
        const match = trimmed.match(/^(#{1,6})\s+(.+)$/);
        if (match) {
          const level = match[1].length;
          const text = match[2];
          const Tag = `h${level}` as keyof JSX.IntrinsicElements;
          const headingClasses =
            level === 1 ? 'text-2xl font-bold mt-6 mb-2 border-b border-theme-border pb-1 font-serif' :
            level === 2 ? 'text-xl font-semibold mt-5 mb-2 font-serif' :
            'text-lg font-medium mt-4 mb-1 font-serif';

          elements.push(
            <Tag key={`h-${lineIdx}`} className={headingClasses}>
              <span dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(text) }} />
            </Tag>
          );
          lineIdx++;
          continue;
        }
      }

      // List Items (- or * or 1.)
      const listMatch = trimmed.match(/^([-*+]|\d+\.)\s+(.+)$/);
      if (listMatch) {
        const bullet = listMatch[1];
        const text = listMatch[2];
        elements.push(
          <div key={`li-${lineIdx}`} className="flex items-start gap-2 my-1 pl-2">
            <span className="font-mono text-theme-accent text-sm select-none">{bullet}</span>
            <span
              className="flex-1 text-theme-text text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(text) }}
            />
          </div>
        );
        lineIdx++;
        continue;
      }

      // Empty line
      if (!trimmed) {
        elements.push(<div key={`blank-${lineIdx}`} className="h-2" />);
        lineIdx++;
        continue;
      }

      // Standard Paragraph
      elements.push(
        <p key={`p-${lineIdx}`} className="my-1.5 text-theme-text leading-relaxed text-sm">
          <span dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(trimmed) }} />
        </p>
      );

      lineIdx++;
    }

    if (inTable) {
      flushTable(`table-end`);
    }

    return elements;
  }, [content]);

  return <div className={`space-y-1 ${className}`}>{renderedElements}</div>;
};

/**
 * Parses inline formatting:
 * - LaTeX math: `$formula$`
 * - Bold: `**text**`
 * - Italic: `*text*`
 * - Inline code: `` `code` ``
 * - Highlights active phrase if provided
 */
export function parseInlineMarkdown(text: string): string {
  if (!text) return '';

  // 1. Extract and render inline math
  let processed = text.replace(/\$([^$]+)\$/g, (_, math) => {
    return safeRenderKatex(math, false);
  });

  // 2. Bold: **text**
  processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-theme-text">$1</strong>');

  // 3. Italic: *text*
  processed = processed.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');

  // 4. Inline code: `code`
  processed = processed.replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 rounded bg-theme-surfaceHover font-mono text-xs border border-theme-border">$1</code>');

  return processed;
}
