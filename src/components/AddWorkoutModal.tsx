import { useState } from 'react';
import { format } from 'date-fns';
import { X, Dumbbell, Timer, Route, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Workout } from '@/types/fitness';
import { cn } from '@/lib/utils';

interface AddWorkoutModalProps {
  date: Date;
  onClose: () => void;
  onAdd: (workout: Omit<Workout, 'id'>) => void;
}

const workoutTypes: { type: Workout['type']; label: string; icon: string }[] = [
  { type: 'run', label: 'Run', icon: '🏃' },
  { type: 'strength', label: 'Strength', icon: '💪' },
  { type: 'cross-training', label: 'Cross Training', icon: '🚴' },
  { type: 'rest', label: 'Rest Day', icon: '😴' },
];

export const AddWorkoutModal = ({ date, onClose, onAdd }: AddWorkoutModalProps) => {
  const [type, setType] = useState<Workout['type']>('run');
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [distance, setDistance] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      date: format(date, 'yyyy-MM-dd'),
      type,
      title: title || workoutTypes.find((t) => t.type === type)?.label || 'Workout',
      duration: parseInt(duration) || 0,
      distance: distance ? parseFloat(distance) : undefined,
      notes: notes || undefined,
      completed: false,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-card rounded-2xl p-6 w-full max-w-md animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-display font-bold text-foreground">
            Add Workout
          </h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <p className="text-muted-foreground mb-6">
          {format(date, 'EEEE, MMMM d, yyyy')}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Workout Type */}
          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">
              Workout Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {workoutTypes.map((wt) => (
                <button
                  key={wt.type}
                  type="button"
                  onClick={() => setType(wt.type)}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg border transition-all duration-200',
                    type === wt.type
                      ? 'border-primary bg-primary/10 glow-primary'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  <span className="text-xl">{wt.icon}</span>
                  <span className="font-medium">{wt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Title (optional)
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Morning run, Leg day..."
              className="bg-muted/50"
            />
          </div>

          {/* Duration and Distance */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <Timer className="h-4 w-4 text-primary" />
                Duration (min)
              </label>
              <Input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="45"
                className="bg-muted/50"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <Route className="h-4 w-4 text-primary" />
                Distance (km)
              </label>
              <Input
                type="number"
                step="0.1"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                placeholder="5.0"
                className="bg-muted/50"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How did it feel? Any notes..."
              rows={3}
              className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full" variant="glow" size="lg">
            <Dumbbell className="h-5 w-5 mr-2" />
            Add Workout
          </Button>
        </form>
      </div>
    </div>
  );
};
