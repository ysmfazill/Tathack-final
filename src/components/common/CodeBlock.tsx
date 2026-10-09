import React, { useState } from 'react';
import { clsx } from 'clsx';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  badge?: string;
  maxHeight?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'json',
  title,
  badge,
  maxHeight = 'max-h-96',
  showLineNumbers = false,
  className,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.trim().split('\n');

  return (
    <div
      className={clsx(
        'rounded-lg bg-surface-container-lowest border border-outline-variant/30 overflow-hidden font-mono-code text-[12px] shadow-sm',
        className
      )}
    >
      {(title || badge || language) && (
        <div className="flex items-center justify-between px-3 py-1.5 bg-surface-container-low border-b border-outline-variant/20 select-none">
          <div className="flex items-center gap-2">
            {title && (
              <span className="font-mono-code text-on-surface font-medium">
                {title}
              </span>
            )}
            {badge && (
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-surface-container text-secondary border border-secondary/30">
                {badge}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-outline uppercase font-label-caps tracking-wider">
              {language}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="p-1 text-outline hover:text-on-surface rounded hover:bg-surface-container transition-colors flex items-center gap-1"
              title="Copy to clipboard"
            >
              <span className="material-symbols-outlined text-[14px]">
                {copied ? 'check' : 'content_copy'}
              </span>
              <span className="text-[11px] font-mono-code">
                {copied ? 'Copied' : 'Copy'}
              </span>
            </button>
          </div>
        </div>
      )}

      <div
        className={clsx(
          'p-3 overflow-x-auto text-on-surface/90 leading-relaxed scrollbar-thin',
          maxHeight
        )}
      >
        {showLineNumbers ? (
          <table className="w-full border-collapse">
            <tbody>
              {lines.map((line, idx) => (
                <tr key={idx} className="hover:bg-surface-container-low/50">
                  <td className="pr-4 text-outline/40 text-right select-none w-8 align-top text-[11px]">
                    {idx + 1}
                  </td>
                  <td className="text-on-surface whitespace-pre font-mono-code">
                    {line}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <pre className="font-mono-code whitespace-pre leading-relaxed">{code.trim()}</pre>
        )}
      </div>
    </div>
  );
};
