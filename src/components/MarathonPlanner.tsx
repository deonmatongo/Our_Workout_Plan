import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, Circle, Trophy, MapPin } from 'lucide-react';
import { marathonPlan } from '@/data/marathonPlan';
import { marathonProgressApi } from '@/services/api';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const MarathonPlanner = () => {
  const [expandedWeek, setExpandedWeek] = useState<number | null>(1);
  const [completedWorkouts, setCompletedWorkouts] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const progress = await marathonProgressApi.get();
      setCompletedWorkouts(new Set(progress.completedWorkouts));
    } catch (error) {
      console.error('Failed to load marathon progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleWorkout = async (weekDay: string) => {
    const newSet = new Set(completedWorkouts);
    if (newSet.has(weekDay)) {
      newSet.delete(weekDay);
    } else {
      newSet.add(weekDay);
    }
    
    setCompletedWorkouts(newSet);
    
    try {
      await marathonProgressApi.update({
        id: 'default',
        completedWorkouts: Array.from(newSet),
        lastUpdated: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to save marathon progress:', error);
      // Revert on error
      setCompletedWorkouts(completedWorkouts);
    }
  };

  const getTotalProgress = () => {
    const totalWorkouts = marathonPlan.reduce((sum, week) => sum + week.workouts.length, 0);
    return Math.round((completedWorkouts.size / totalWorkouts) * 100);
  };

  const getWeekProgress = (week: number) => {
    const weekWorkouts = marathonPlan[week - 1]?.workouts || [];
    const completed = weekWorkouts.filter((w) =>
      completedWorkouts.has(`${week}-${w.day}`)
    ).length;
    return Math.round((completed / weekWorkouts.length) * 100);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl gradient-primary">
            <Trophy className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground">
              21K Marathon Plan
            </h2>
            <p className="text-muted-foreground">8-week training program</p>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Overall Progress</span>
            <span className="text-primary font-bold">{getTotalProgress()}%</span>
          </div>
          <div className="h-4 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full gradient-primary rounded-full transition-all duration-500 glow-primary"
              style={{ width: `${getTotalProgress()}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {completedWorkouts.size} of{' '}
            {marathonPlan.reduce((sum, week) => sum + week.workouts.length, 0)} workouts completed
          </p>
        </div>
      </div>

      {/* Weeks */}
      <div className="space-y-3">
        {marathonPlan.map((week) => {
          const isExpanded = expandedWeek === week.week;
          const weekProgress = getWeekProgress(week.week);

          return (
            <div
              key={week.week}
              className={cn(
                'glass-card rounded-xl overflow-hidden transition-all duration-300',
                isExpanded && 'ring-1 ring-primary/50 glow-primary'
              )}
            >
              {/* Week Header */}
              <button
                onClick={() => setExpandedWeek(isExpanded ? null : week.week)}
                className="w-full p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center font-display font-bold',
                      weekProgress === 100
                        ? 'gradient-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    )}
                  >
                    W{week.week}
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-foreground">{week.focus}</p>
                    <p className="text-sm text-muted-foreground">
                      {week.totalDistance} km total
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-primary">{weekProgress}%</p>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </button>

              {/* Week Content */}
              {isExpanded && (
                <div className="px-4 pb-4 space-y-2 animate-fade-in">
                  {week.workouts.map((workout) => {
                    const workoutKey = `${week.week}-${workout.day}`;
                    const isCompleted = completedWorkouts.has(workoutKey);

                    return (
                      <div
                        key={workout.day}
                        className={cn(
                          'flex items-center gap-4 p-3 rounded-lg transition-all duration-200',
                          isCompleted ? 'bg-primary/10' : 'bg-muted/30 hover:bg-muted/50'
                        )}
                      >
                        <button
                          onClick={() => toggleWorkout(workoutKey)}
                          className="flex-shrink-0"
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="h-6 w-6 text-primary" />
                          ) : (
                            <Circle className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
                          )}
                        </button>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground text-sm w-10">
                              {workout.day}
                            </span>
                            <span
                              className={cn(
                                'font-medium',
                                isCompleted ? 'text-primary' : 'text-foreground'
                              )}
                            >
                              {workout.type}
                            </span>
                            {workout.distance && (
                              <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {workout.distance} km
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {workout.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
