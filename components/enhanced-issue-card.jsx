'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MoreVertical, 
  Clock, 
  User, 
  MessageSquare, 
  Edit, 
  Trash2,
  CheckCircle2,
  AlertCircle,
  Circle
} from 'lucide-react';
import { formatRelativeTime, getInitials } from '@/lib/enhanced-utils';

const priorityColors = {
  LOW: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  MEDIUM: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  HIGH: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  URGENT: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
};

const statusIcons = {
  TODO: Circle,
  IN_PROGRESS: Clock,
  IN_REVIEW: MessageSquare,
  DONE: CheckCircle2
};

const statusColors = {
  TODO: 'text-gray-500',
  IN_PROGRESS: 'text-blue-500',
  IN_REVIEW: 'text-orange-500',
  DONE: 'text-green-500'
};

export default function EnhancedIssueCard({ issue, onUpdate, onDelete, className = '' }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const StatusIcon = statusIcons[issue.status] || Circle;

  const handleQuickStatusChange = async (newStatus) => {
    if (newStatus === issue.status) return;
    
    setIsLoading(true);
    try {
      await onUpdate?.(issue.id, { status: newStatus });
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this issue?')) {
      setIsLoading(true);
      try {
        await onDelete?.(issue.id);
      } catch (error) {
        console.error('Failed to delete issue:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Card 
      className={`
        group hover:shadow-md transition-all duration-200 cursor-pointer
        ${isLoading ? 'opacity-50 pointer-events-none' : ''}
        ${className}
      `}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-1">
            <StatusIcon className={`w-4 h-4 ${statusColors[issue.status]}`} />
            <h3 className="font-medium text-sm line-clamp-2 flex-1">
              {issue.title}
            </h3>
          </div>
          
          {showActions && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdate?.(issue.id);
                }}
              >
                <Edit className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 text-red-500 hover:text-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        {/* Description */}
        {issue.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {issue.description}
          </p>
        )}

        {/* Priority Badge */}
        <div className="flex items-center justify-between">
          <Badge 
            variant="secondary" 
            className={`text-xs ${priorityColors[issue.priority]}`}
          >
            {issue.priority}
          </Badge>
          
          {/* Quick Status Actions */}
          <div className="flex items-center gap-1">
            {['TODO', 'IN_PROGRESS', 'DONE'].map((status) => {
              const Icon = statusIcons[status];
              const isActive = issue.status === status;
              
              return (
                <Button
                  key={status}
                  size="sm"
                  variant="ghost"
                  className={`h-6 w-6 p-0 ${isActive ? statusColors[status] : 'text-gray-300 hover:text-gray-600'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickStatusChange(status);
                  }}
                  title={`Mark as ${status.replace('_', ' ').toLowerCase()}`}
                >
                  <Icon className="w-3 h-3" />
                </Button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          {/* Assignee */}
          <div className="flex items-center gap-1">
            {issue.assignee ? (
              <>
                <Avatar className="w-4 h-4">
                  <AvatarImage src={issue.assignee.imageUrl} alt={issue.assignee.name} />
                  <AvatarFallback className="text-xs">
                    {getInitials(issue.assignee.name || 'U')}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate max-w-20">
                  {issue.assignee.name || 'Unassigned'}
                </span>
              </>
            ) : (
              <>
                <User className="w-3 h-3" />
                <span>Unassigned</span>
              </>
            )}
          </div>

          {/* Created date */}
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{formatRelativeTime(issue.createdAt)}</span>
          </div>
        </div>

        {/* Progress indicator for IN_PROGRESS status */}
        {issue.status === 'IN_PROGRESS' && (
          <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full animate-pulse w-2/3" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}