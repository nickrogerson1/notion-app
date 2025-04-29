import { Button } from "@/components/ui/button";
import { ArrowLeftCircle } from "lucide-react";

export default function Home() {
  return (
  <main className="flex space-x-2 items-center animate-pulse">
    <ArrowLeftCircle className="h-12 w-12 text-blue-500" />
    <h1 className="font-bold">Get started with creating a new doc</h1>
  </main>
  );
}
