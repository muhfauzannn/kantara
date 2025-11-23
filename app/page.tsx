import { Button } from "@/components/ui/button";
import { Diamond } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <div className="flex flex-col items-center py-10 justify-center gap-5">
      <Button className="w-fit">
        <Diamond />
        Primary
        <Diamond />
      </Button>
      <Button variant={"secondary"} className="w-fit">
        Secondary
      </Button>
      <Button variant={"ghost"} className="w-fit">
        Ghost
      </Button>
      <Input className="w-50" />
    </div>
  );
}
