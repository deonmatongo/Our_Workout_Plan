import { useState } from 'react';
import { Calendar, BarChart3, Trophy, Dumbbell } from 'lucide-react';
import { FitnessCalendar } from '@/components/FitnessCalendar';
import { AddWorkoutModal } from '@/components/AddWorkoutModal';
import { WorkoutDetail } from '@/components/WorkoutDetail';
import { ProgressStats } from '@/components/ProgressStats';
import { MarathonPlanner } from '@/components/MarathonPlanner';
import { useWorkouts } from '@/hooks/useWorkouts';
import { Workout } from '@/types/fitness';
import { cn } from '@/lib/utils';

type TabType = 'calendar' | 'progress' | 'marathon';

const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'progress', label: 'Progress', icon: BarChart3 },
  { id: 'marathon', label: '21K Plan', icon: Trophy },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('calendar');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

  const {
    workouts,
    addWorkout,
    deleteWorkout,
    toggleComplete,
    getWeeklyStats,
    getTotalStats,
  } = useWorkouts();

  const weeklyStats = getWeeklyStats();
  const totalStats = getTotalStats();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-card border-b border-border/50">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary glow-primary flex items-center justify-center">
              <span className="text-xl font-display font-bold text-primary-foreground">M</span>
            </div>
            <div>
              <h1 className="text-xl font-display font-bold text-foreground">
                The Matongos
              </h1>
              <p className="text-sm text-muted-foreground">Your fitness journey</p>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="sticky top-[73px] z-30 glass-card border-b border-border/50">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="flex gap-1 py-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all duration-200',
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground glow-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container max-w-4xl mx-auto px-4 py-6">
        {activeTab === 'calendar' && (
          <FitnessCalendar
            workouts={workouts}
            onAddWorkout={(date) => setSelectedDate(date)}
            onSelectWorkout={(workout) => setSelectedWorkout(workout)}
            onToggleComplete={toggleComplete}
          />
        )}

        {activeTab === 'progress' && (
          <ProgressStats weeklyStats={weeklyStats} totalStats={totalStats} />
        )}

        {activeTab === 'marathon' && <MarathonPlanner />}
      </main>

      {/* Modals */}
      {selectedDate && (
        <AddWorkoutModal
          date={selectedDate}
          onClose={() => setSelectedDate(null)}
          onAdd={(workout) => {
            addWorkout(workout);
            setSelectedDate(null);
          }}
        />
      )}

      {selectedWorkout && (
        <WorkoutDetail
          workout={selectedWorkout}
          onClose={() => setSelectedWorkout(null)}
          onToggleComplete={toggleComplete}
          onDelete={deleteWorkout}
        />
      )}
    </div>
  );
};

export default Index;
