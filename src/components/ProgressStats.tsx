import { Timer, Route, Target, TrendingUp } from 'lucide-react';
import { WeeklyStats } from '@/types/fitness';
import { cn } from '@/lib/utils';

interface ProgressStatsProps {
  weeklyStats: WeeklyStats;
  totalStats: WeeklyStats;
}

export const ProgressStats = ({ weeklyStats, totalStats }: ProgressStatsProps) => {
  const completionRate = weeklyStats.totalWorkouts > 0
    ? Math.round((weeklyStats.completedWorkouts / weeklyStats.totalWorkouts) * 100)
    : 0;

  const totalCompletionRate = totalStats.totalWorkouts > 0
    ? Math.round((totalStats.completedWorkouts / totalStats.totalWorkouts) * 100)
    : 0;

  const stats = [
    {
      label: 'This Week',
      value: `${weeklyStats.totalWorkouts}`,
      subtitle: 'workouts',
      icon: Target,
      color: 'text-primary',
    },
    {
      label: 'Distance',
      value: `${weeklyStats.totalDistance.toFixed(1)}`,
      subtitle: 'km this week',
      icon: Route,
      color: 'text-primary',
    },
    {
      label: 'Duration',
      value: `${Math.round(weeklyStats.totalDuration / 60)}`,
      subtitle: 'hours this week',
      icon: Timer,
      color: 'text-primary',
    },
    {
      label: 'Completion',
      value: `${completionRate}%`,
      subtitle: 'weekly rate',
      icon: TrendingUp,
      color: 'text-primary',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Weekly Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="glass-card rounded-xl p-4 hover-lift"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              <stat.icon className={cn('h-5 w-5', stat.color)} />
            </div>
            <p className="text-3xl font-display font-bold text-foreground">
              {stat.value}
            </p>
            <p className="text-sm text-muted-foreground">{stat.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="font-medium text-foreground">Weekly Progress</span>
          <span className="text-primary font-bold">{completionRate}%</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full gradient-primary rounded-full transition-all duration-500 glow-primary"
            style={{ width: `${completionRate}%` }}
          />
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {weeklyStats.completedWorkouts} of {weeklyStats.totalWorkouts} workouts completed
        </p>
        
        {/* Individual Partner Progress */}
        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border/50">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-sm font-medium">Daddy</span>
            </div>
            <p className="text-2xl font-bold text-blue-500">
              {weeklyStats.partner1Completed || 0}
            </p>
            <p className="text-xs text-muted-foreground">workouts completed</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-pink-500" />
              <span className="text-sm font-medium">Little Princess</span>
            </div>
            <p className="text-2xl font-bold text-pink-500">
              {weeklyStats.partner2Completed || 0}
            </p>
            <p className="text-xs text-muted-foreground">workouts completed</p>
          </div>
        </div>
      </div>

      {/* All Time Stats */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-display font-bold text-lg mb-4 text-foreground">
          All Time Stats
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Total Workouts</span>
            <span className="font-bold text-foreground">{totalStats.totalWorkouts}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Total Distance</span>
            <span className="font-bold text-foreground">{totalStats.totalDistance.toFixed(1)} km</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Total Time</span>
            <span className="font-bold text-foreground">
              {Math.round(totalStats.totalDuration / 60)} hours
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Completion Rate</span>
            <span className="font-bold text-primary">{totalCompletionRate}%</span>
          </div>
          
          {/* Individual Partner All-Time Stats */}
          <div className="pt-4 border-t border-border/50">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span className="text-sm font-medium text-blue-500">P1</span>
                </div>
                <p className="text-xl font-bold text-foreground">
                  {totalStats.partner1Completed || 0}
                </p>
                <p className="text-xs text-muted-foreground">total completed</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                  <span className="text-sm font-medium text-pink-500">P2</span>
                </div>
                <p className="text-xl font-bold text-foreground">
                  {totalStats.partner2Completed || 0}
                </p>
                <p className="text-xs text-muted-foreground">total completed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
