import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  href?: string;
  buttonLabel?: string;
}

export function SectionHeader({ title, href, buttonLabel }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
      <h2 className="text-xl font-bold tracking-tight" data-testid={`section-title-${title.toLowerCase().replace(/\s/g, "-")}`}>
        {title}
      </h2>
      {href && (
        <Link href={href}>
          <Button variant="ghost" size="sm" data-testid={`button-more-${title.toLowerCase().replace(/\s/g, "-")}`}>
            {buttonLabel || "View All"}
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      )}
    </div>
  );
}
