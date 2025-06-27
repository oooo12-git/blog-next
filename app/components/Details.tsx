interface DetailsProps {
  summary: string;
  children: React.ReactNode;
}

export default function Details({ summary, children }: DetailsProps) {
  return (
    <details className="border border-gray-300 dark:border-gray-600 rounded-lg my-4 overflow-hidden">
      <summary className="bg-gray-50 dark:bg-gray-800 px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 font-semibold dark:text-white border-b border-gray-300 dark:border-gray-600">
        {summary}
      </summary>
      <div className="px-4 py-4">{children}</div>
    </details>
  );
}
