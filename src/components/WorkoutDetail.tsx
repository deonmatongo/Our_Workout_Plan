import { format } from 'date-fns';
import { X, CheckCircle2, Circle, Trash2, Timer, Route } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Workout } from '@/types/fitness';
import { cn } from '@/lib/utils';

interface WorkoutDetailProps {
  workout: Workout;
  onClose: () => void;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export const WorkoutDetail = ({
  workout,
  onClose,
  onToggleComplete,
  onDelete,
}: WorkoutDetailProps) => {
  const typeEmoji = {
    run: '🏃',
    strength: '💪',
    'cross-training': '🚴',
    rest: '😴',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-card rounded-2xl p-6 w-full max-w-md animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{typeEmoji[workout.type]}</span>
            <div>
              <h3 className="text-xl font-display font-bold text-foreground">
                {workout.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {format(new Date(workout.date), 'EEEE, MMMM d')}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {workout.duration > 0 && (
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Timer className="h-4 w-4" />
                <span className="text-sm">Duration</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {workout.duration} min
              </p>
            </div>
          )}
          {workout.distance && (
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Route className="h-4 w-4" />
                <span className="text-sm">Distance</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {workout.distance} km
              </p>
            </div>
          )}
        </div>

        {/* Notes */}
        {workout.notes && (
          <div className="bg-muted/30 rounded-lg p-4 mb-6">
            <p className="text-sm text-muted-foreground mb-1">Notes</p>
            <p className="text-foreground">{workout.notes}</p>
          </div>
        )}

        {/* Status */}
        <div
          className={cn(
            'flex items-center gap-3 p-4 rounded-lg mb-6',
            workout.completed ? 'bg-primary/10' : 'bg-muted/30'
          )}
        >
          {workout.completed ? (
            <CheckCircle2 className="h-6 w-6 text-primary" />
          ) : (
            <Circle className="h-6 w-6 text-muted-foreground" />
          )}
          <span
            className={cn(
              'font-medium',
              workout.completed ? 'text-primary' : 'text-foreground'
            )}
          >
            {workout.completed ? 'Completed' : 'Not completed'}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant={workout.completed ? 'outline' : 'glow'}
            className="flex-1"
            onClick={() => onToggleComplete(workout.id)}
          >
            {workout.completed ? (
              <>
                <Circle className="h-5 w-5 mr-2" />
                Mark Incomplete
              </>
            ) : (
              <>
                <CheckCircle2 className="h-5 w-5 mr-2" />
                Mark Complete
              </>
            )}
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => {
              onDelete(workout.id);
              onClose();
            }}
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
