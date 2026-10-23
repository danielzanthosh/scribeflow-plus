import React, { useEffect, useRef } from 'react';
import { Chunk } from '../types';
import { safeRenderKatex, parseInlineMarkdown } from '../utils/markdownRenderer';

interface DocumentViewProps {
  chunks: Chunk[];
  currentIndex: number;
  onSelectChunk: (index: number) => void;
}

export const DocumentView: React.FC<DocumentViewProps> = ({
  chunks,
  currentIndex,
  onSelectChunk,
}) => {
  const activeItemRef = useRef<HTMLDivElement>(null);

  // Auto-scroll active chunk into view smoothly
  useEffect(() => {
    if (activeItemRef.current) {
      activeItemRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentIndex]);

  return (
    <div className="h-full flex flex-col bg-theme-surface border-r border-theme-border overflow-hidden select-none">
      {/* Sidebar Header */}
      <div className="p-3.5 border-b border-theme-border bg-theme-surfaceHover/40 flex items-center justify-between text-xs font-semibold text-theme-text">
        <span className="flex items-center gap-2">
          <span>📜 Full Script Transcript</span>
        </span>
        <span className="font-mono text-xs text-theme-textMuted">
          {chunks.length} phrases
        </span>
      </div>

      {/* Script Chunks Stream */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 text-xs">
        {chunks.map((chunk, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={chunk.id}
              ref={isActive ? activeItemRef : null}
              onClick={() => onSelectChunk(idx)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                isActive
                  ? 'border-theme-accent bg-theme-activeChunkBg text-theme-activeChunk font-medium shadow-sm ring-1 ring-theme-accent'
                  : 'border-transparent hover:border-theme-border hover:bg-theme-surfaceHover text-theme-text opacity-75 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-theme-textSubtle mb-1">
                <span>#{idx + 1}</span>
                {chunk.type !== 'text' && (
                  <span className="font-mono uppercase">{chunk.type}</span>
                )}
              </div>

              {chunk.type === 'math-block' ? (
                <div
                  className="overflow-x-auto text-center py-1"
                  dangerouslySetInnerHTML={{
                    __html: safeRenderKatex(chunk.mathExpression || chunk.text, true),
                  }}
                />
              ) : (
                <div
                  className="font-serif leading-relaxed line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(chunk.text) }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
