import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center space-y-4 p-8 text-center animate-in fade-in zoom-in duration-500">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-xl mb-4">
        <SearchX className="h-12 w-12 text-blue-400" />
      </div>
      <h2 className="text-3xl font-bold tracking-tight text-white">
        404 - Page Not Found
      </h2>
      <p className="text-slate-400 max-w-md mx-auto">
        We couldn't find the page you were looking for. It might have been moved or deleted.
      </p>
      <div className="pt-6">
        <Link href="/">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 h-11">
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
