/**
 * Componente de tarjeta de estadísticas
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  change?: {
    value: string | number;
    type: 'increase' | 'decrease' | 'neutral';
  };
  isLoading?: boolean;
  className?: string;
}

/**
 * Componente de tarjeta de estadísticas
 */
const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  change,
  isLoading = false,
  className,
}) => {
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            <Skeleton className="h-4 w-24" />
          </CardTitle>
          <Skeleton className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-4 w-32" />
        </CardContent>
      </Card>
    );
  }

  const getChangeColor = (type: string) => {
    switch (type) {
      case 'increase':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'decrease':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'neutral':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center space-x-2 mt-1">
          {change && (
            <Badge 
              variant="outline" 
              className={getChangeColor(change.type)}
            >
              {change.type === 'increase' && '+'}
              {change.value}
            </Badge>
          )}
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
