import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';
import type { ChatMessage } from '../types';

interface Props {
  message: ChatMessage;
}

const mdComponents: Components = {
  p({ children }) {
    return <p className="text-sm leading-relaxed mb-2 last:mb-0">{children}</p>;
  },
  ul({ children }) {
    return <ul className="list-disc pl-4 my-2 space-y-0.5 text-sm">{children}</ul>;
  },
  ol({ children }) {
    return <ol className="list-decimal pl-4 my-2 space-y-0.5 text-sm">{children}</ol>;
  },
  li({ children }) {
    return <li className="leading-relaxed">{children}</li>;
  },
  strong({ children }) {
    return <strong className="font-semibold">{children}</strong>;
  },
  em({ children }) {
    return <em className="italic">{children}</em>;
  },
  h1({ children }) {
    return <h1 className="text-base font-bold mt-3 mb-1">{children}</h1>;
  },
  h2({ children }) {
    return <h2 className="text-sm font-bold mt-3 mb-1">{children}</h2>;
  },
  h3({ children }) {
    return <h3 className="text-sm font-semibold mt-2 mb-1">{children}</h3>;
  },
  a({ href, children }) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline underline-offset-2"
      >
        {children}
      </a>
    );
  },
  blockquote({ children }) {
    return (
      <blockquote className="border-l-4 border-border pl-3 italic text-muted-foreground my-2">
        {children}
      </blockquote>
    );
  },
  pre({ children }) {
    return (
      <pre className="my-2 overflow-x-auto rounded-md bg-background/60 p-3 text-xs font-mono">
        {children}
      </pre>
    );
  },
  code({ className, children }) {
    if (className) {
      return <code className={`${className} font-mono text-xs`}>{children}</code>;
    }
    return (
      <code className="rounded bg-background/60 px-1.5 py-0.5 font-mono text-xs">
        {children}
      </code>
    );
  },
  hr() {
    return <hr className="my-3 border-border" />;
  },
  table({ children }) {
    return (
      <div className="my-2 overflow-x-auto">
        <table className="w-full border-collapse text-xs">{children}</table>
      </div>
    );
  },
  th({ children }) {
    return (
      <th className="border border-border bg-muted px-2 py-1 text-left font-semibold">
        {children}
      </th>
    );
  },
  td({ children }) {
    return <td className="border border-border px-2 py-1">{children}</td>;
  },
};

export function ChatMessageBubble({ message }: Props) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex animate-fade-in gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm">
          ✈️
        </div>
      )}

      <div
        className={`max-w-[82%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'rounded-br-sm bg-primary text-primary-foreground'
            : 'rounded-bl-sm bg-muted text-foreground'
        }`}
      >
        {isUser ? (
          <p className="text-sm leading-relaxed">{message.content}</p>
        ) : (
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
            {message.content}
          </ReactMarkdown>
        )}
      </div>

      {isUser && (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground">
          <span className="text-xs font-medium">You</span>
        </div>
      )}
    </div>
  );
}
