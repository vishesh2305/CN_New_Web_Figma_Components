import FlowBlock from "@/components/FlowBlock";

export default function FlowBlockPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center mb-12">
        <h1 className="text-6xl font-sans font-bold ">
          Just Press
          <span className="ml-4 px-4 py-2 border border-gray-700 rounded-xl">
            Tab
          </span>
        </h1>
      </div>
      <FlowBlock />
    </main>
  );
}