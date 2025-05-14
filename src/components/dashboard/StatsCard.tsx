import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowDownIcon, ArrowUpIcon, ArrowRightIcon } from 'lucide-react';

export interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  type: 'increase' | 'decrease' | 'neutral';
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, change, type }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {type === 'increase' && <ArrowUpIcon className="h-4 w-4 text-green-500" />}
          {type === 'decrease' && <ArrowDownIcon className="h-4 w-4 text-red-500" />}
          {type === 'neutral' && <ArrowRightIcon className="h-4 w-4 text-gray-500" />}
        </div>
        <div className="mt-1">
          <h4 className="text-2xl font-bold">{value}</h4>
          <p className={`text-xs ${type === 'increase' ? 'text-green-500' : type === 'decrease' ? 'text-red-500' : 'text-gray-500'}`}>
            {change}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;