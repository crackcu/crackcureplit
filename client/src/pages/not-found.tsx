import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { useSEO } from "@/hooks/use-seo";

export default function NotFound() {
  useSEO({ title: "Page Not Found", description: "The page you are looking for does not exist.", noIndex: true });

  return (
    <div className="min-h-[60vh] w-full flex items-center justify-center">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">404 - Page Not Found</h1>
          <p className="text-sm text-muted-foreground mb-6">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <Link href="/">
            <Button data-testid="button-go-home">Go Back Home</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
