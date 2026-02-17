import { Skill } from '@/lib/models/portfolio';
import { Badge } from '@/components/ui/badge';

interface SkillBadgeProps {
  skill: Skill;
  showCount?: boolean;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function SkillBadge({ skill, showCount, count, size = 'md' }: SkillBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  return (
    <Badge variant="secondary" className={sizeClasses[size]}>
      {skill.name}
      {showCount && count !== undefined && (
        <span className="ml-1.5 text-xs opacity-60">({count})</span>
      )}
    </Badge>
  );
}
