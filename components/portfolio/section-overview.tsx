import Link from 'next/link';
import { ArrowRight, LucideIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SectionOverviewProps {
  title: string;
  description: string;
  icon: LucideIcon;
  count: number;
  href: string;
  items?: React.ReactNode;
}

export function SectionOverview({
  title,
  description,
  icon: Icon,
  count,
  href,
  items,
}: SectionOverviewProps) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">{title}</CardTitle>
        </div>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="mb-4">
          <span className="text-3xl font-bold text-primary">{count}</span>
          <span className="text-muted-foreground ml-2">
            {count === 1 ? title.slice(0, -1) : title}
          </span>
        </div>
        
        {items && <div className="flex-1 mb-4">{items}</div>}
        
        <Button asChild variant="outline" className="w-full mt-auto">
          <Link href={href}>
            View All {title}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
