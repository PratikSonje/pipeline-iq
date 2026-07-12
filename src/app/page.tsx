import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50">
      <main className="flex flex-col items-center gap-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Hello World from PipelineIQ
        </h1>
        <p className="text-lg text-gray-600 text-center max-w-md">
          This is our Day 1 Deployment. If you can see this, it means you have successfully authenticated through Clerk and the application is running!
        </p>
        <div className="p-4 bg-white rounded-full shadow-sm border border-gray-100">
          <UserButton />
        </div>
      </main>
    </div>
  );
}
