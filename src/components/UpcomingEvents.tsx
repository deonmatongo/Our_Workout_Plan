import { format, addDays, isSameDay, parseISO } from 'date-fns';
import { Calendar, Clock, MapPin, CheckCircle2, Circle, Footprints, Dumbbell, Bike, Moon, Check } from 'lucide-react';
import { Workout } from '@/types/fitness';
import { cn } from '@/lib/utils';

interface UpcomingEventsProps {
  workouts: Workout[];
  onSelectWorkout: (workout: Workout) => void;
  onToggleComplete: (id: string) => void;
}

export const UpcomingEvents = ({
  workouts,
  onSelectWorkout,
  onToggleComplete,
}: UpcomingEventsProps) => {
  const today = new Date();
  const next7Days = Array.from({ length: 7 }, (_, i) => addDays(today, i));

  const getWorkoutsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return workouts.filter((w) => w.date === dateStr);
  };

  const getWorkoutIcon = (type: Workout['type']) => {
    switch (type) {
      case 'run':
        return Footprints;
      case 'strength':
        return Dumbbell;
      case 'cross-training':
        return Bike;
      case 'rest':
        return Moon;
      default:
        return Calendar;
    }
  };

  const getWorkoutTypeColor = (type: Workout['type']) => {
    switch (type) {
      case 'run':
        return 'bg-workout-run/10 border-workout-run text-workout-run';
      case 'strength':
        return 'bg-workout-strength/10 border-workout-strength text-workout-strength';
      case 'cross-training':
        return 'bg-workout-cross/10 border-workout-cross text-workout-cross';
      case 'rest':
        return 'bg-workout-rest/10 border-workout-rest text-workout-rest';
      default:
        return 'bg-primary/10 border-primary text-primary';
    }
  };

  const upcomingWorkouts = next7Days.flatMap((date) => {
    const dayWorkouts = getWorkoutsForDate(date);
    return dayWorkouts.map((workout) => ({ date, workout }));
  });

  return (
    <div className="glass-card rounded-xl p-4 sm:p-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-5 w-5 text-primary" />
        <h2 className="text-lg sm:text-xl font-display font-bold text-foreground">
          Upcoming Events
        </h2>
        <span className="text-sm text-muted-foreground ml-auto">
          Next 7 days
        </span>
      </div>

      {upcomingWorkouts.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No upcoming workouts scheduled</p>
          <p className="text-xs mt-1">Add workouts to your calendar to see them here</p>
        </div>
      ) : (
        <div className="space-y-2">
          {upcomingWorkouts.map(({ date, workout }) => {
            const isToday = isSameDay(date, today);
            
            return (
              <div
                key={workout.id}
                onClick={() => onSelectWorkout(workout)}
                className={cn(
                  'group relative overflow-hidden rounded-lg border transition-all duration-200 cursor-pointer',
                  'hover:shadow-md hover:scale-[1.02]',
                  getWorkoutTypeColor(workout.type),
                  workout.completed && 'opacity-60'
                )}
              >
                <div className="p-3 sm:p-4">
                  <div className="flex items-start gap-3">
                    {/* Date badge */}
                    <div className={cn(
                      'flex-shrink-0 w-12 sm:w-14 text-center rounded-lg py-1.5 px-2',
                      isToday ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    )}>
                      <div className="text-xs font-medium uppercase">
                        {format(date, 'EEE')}
                      </div>
                      <div className="text-lg sm:text-xl font-bold">
                        {format(date, 'd')}
                      </div>
                    </div>

                    {/* Workout details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          {(() => {
                            const Icon = getWorkoutIcon(workout.type);
                            return <Icon className="h-5 w-5 flex-shrink-0" />;
                          })()}
                          <h3 className="font-semibold text-sm sm:text-base truncate">
                            {workout.title}
                          </h3>
                        </div>
                        
                        {/* Complete button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleComplete(workout.id);
                          }}
                          className="flex-shrink-0 p-1 hover:scale-110 transition-transform"
                        >
                          {workout.completed ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground" />
                          )}
                        </button>
                      </div>

                      {/* Workout metadata */}
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs sm:text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>{workout.duration} min</span>
                        </div>
                        {workout.distance && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>{workout.distance} km</span>
                          </div>
                        )}
                        {workout.completed && (
                          <div className="flex items-center gap-1 text-green-500 font-medium">
                            <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>Completed</span>
                          </div>
                        )}
                      </div>

                      {/* Notes preview */}
                      {workout.notes && (
                        <p className="text-xs sm:text-sm text-muted-foreground mt-2 line-clamp-1">
                          {workout.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Completed overlay */}
                {workout.completed && (
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-transparent pointer-events-none" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
