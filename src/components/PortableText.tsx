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
          h2: ({ children }) => <h2 class="text-2xl font-bold mt-8 mb-4">{children}</h2>,
          h3: ({ children }) => <h3 class="text-xl font-bold mt-6 mb-3">{children}</h3>,
          normal: ({ children }) => <p class="mb-4">{children}</p>,
        },
        list: {
          bullet: ({ children }) => <ul class="list-disc pl-6 mb-4 space-y-2">{children}</ul>,
        },
        listItem: {
          bullet: ({ children }) => <li class="">{children}</li>,
        },
      }}
    />
  );
}
