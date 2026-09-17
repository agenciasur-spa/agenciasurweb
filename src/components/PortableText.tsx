import { PortableText as PortableTextReact } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';

interface Props {
  value: PortableTextBlock[];
}

export default function PortableText({ value }: Props) {
  return (
    <PortableTextReact
      value={value}
      components={{
        block: {
          h2: ({ children }) => <h2 className="text-2xl font-bold mt-8 mb-4 text-white">{children}</h2>,
          h3: ({ children }) => <h3 className="text-xl font-bold mt-6 mb-3 text-white">{children}</h3>,
          normal: ({ children }) => <p className="mb-4 text-white/60">{children}</p>,
        },
        list: {
          bullet: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-2 text-white/60">{children}</ul>,
        },
        listItem: {
          bullet: ({ children }) => <li className="">{children}</li>,
        },
      }}
    />
  );
}
