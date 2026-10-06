import { parseMarkdown, type Block, type InlineNode } from "@/lib/markdown";

function Inline({ nodes }: { nodes: InlineNode[] }) {
  return (
    <>
      {nodes.map((node, index) => {
        if (node.type === "strong") return <strong key={index}>{node.text}</strong>;
        if (node.type === "em") return <em key={index}>{node.text}</em>;
        return node.text;
      })}
    </>
  );
}

function BlockView({ block }: { block: Block }) {
  if (block.type === "heading") {
    return (
      <h4 className="type-body font-medium text-ink-900">
        <Inline nodes={block.inline} />
      </h4>
    );
  }
  if (block.type === "list") {
    const Tag = block.ordered ? "ol" : "ul";
    return (
      <Tag className={block.ordered ? "list-decimal pl-5" : "list-disc pl-5"}>
        {block.items.map((item, index) => (
          <li key={index}>
            <Inline nodes={item} />
          </li>
        ))}
      </Tag>
    );
  }
  return (
    <p>
      <Inline nodes={block.inline} />
    </p>
  );
}

/** Hiển thị văn bản Markdown cơ bản (đoạn, tiêu đề, danh sách, đậm/nghiêng). Không cho HTML thô. */
export function Markdown({ source }: { source: string }) {
  return (
    <div className="grid gap-3">
      {parseMarkdown(source).map((block, index) => (
        <BlockView key={index} block={block} />
      ))}
    </div>
  );
}
