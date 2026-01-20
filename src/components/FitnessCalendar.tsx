import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Dumbbell, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Workout } from '@/types/fitness';
import { cn } from '@/lib/utils';

interface FitnessCalendarProps {
  workouts: Workout[];
  onAddWorkout: (date: Date) => void;
  onSelectWorkout: (workout: Workout) => void;
  onToggleComplete: (id: string) => void;
}

export const FitnessCalendar = ({
  workouts,
  onAddWorkout,
  onSelectWorkout,
  onToggleComplete,
}: FitnessCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const getWorkoutsForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return workouts.filter((w) => w.date === dateStr);
  };

  const getWorkoutTypeColor = (type: Workout['type']) => {
    switch (type) {
      case 'run':
        return 'bg-workout-run';
      case 'strength':
        return 'bg-workout-strength';
      case 'cross-training':
        return 'bg-workout-cross';
      case 'rest':
        return 'bg-workout-rest';
      default:
        return 'bg-primary';
    }
  };

  // Calculate the starting day offset (Monday = 0)
  const startDayOffset = (monthStart.getDay() + 6) % 7;

  return (
    <div className="glass-card rounded-xl p-3 sm:p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-2xl font-display font-bold text-foreground">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-1 sm:gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="h-8 w-8 sm:h-10 sm:w-10"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="h-8 w-8 sm:h-10 sm:w-10"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </div>

      {/* Week days header */}
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-xs sm:text-sm font-medium text-muted-foreground py-1 sm:py-2"
          >
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{day.charAt(0)}</span>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
        {/* Empty cells for offset */}
        {Array.from({ length: startDayOffset }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {/* Days */}
        {days.map((day) => {
          const dayWorkouts = getWorkoutsForDay(day);
          const isToday = isSameDay(day, new Date());
          const hasWorkouts = dayWorkouts.length > 0;

          return (
            <div
              key={day.toISOString()}
              className={cn(
                'aspect-square p-0.5 sm:p-1 rounded-md sm:rounded-lg transition-all duration-200 group relative',
                'hover:bg-muted/50 active:bg-muted cursor-pointer touch-manipulation',
                isToday && 'ring-1 sm:ring-2 ring-primary ring-offset-1 sm:ring-offset-2 ring-offset-background'
              )}
              onClick={() => onAddWorkout(day)}
            >
              <div className="h-full flex flex-col">
                <span
                  className={cn(
                    'text-xs sm:text-sm font-medium',
                    isToday ? 'text-primary font-bold' : 'text-foreground'
                  )}
                >
                  {format(day, 'd')}
                </span>

                {/* Workout indicators */}
                <div className="flex-1 flex flex-wrap gap-0.5 mt-0.5 sm:mt-1">
                  {dayWorkouts.slice(0, 3).map((workout) => (
                    <div
                      key={workout.id}
                      className={cn(
                        'w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full',
                        getWorkoutTypeColor(workout.type),
                        workout.completed && 'ring-1 ring-foreground/30'
                      )}
                      title={workout.title}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectWorkout(workout);
                      }}
                    />
                  ))}
                  {dayWorkouts.length > 3 && (
                    <span className="text-[8px] sm:text-[10px] text-muted-foreground">
                      +{dayWorkouts.length - 3}
                    </span>
                  )}
                </div>

                {/* Add button on hover (desktop only) */}
                <div className="hidden sm:flex absolute inset-0 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-primary/20 rounded-full p-1">
                    <Plus className="h-4 w-4 text-primary" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 sm:gap-4 mt-4 sm:mt-6 text-xs sm:text-sm">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-workout-run" />
          <span className="text-muted-foreground">Run</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-workout-strength" />
          <span className="text-muted-foreground">Strength</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-workout-cross" />
          <span className="text-muted-foreground">Cross-training</span>
        </div>
      </div>
    </div>
  );
};
