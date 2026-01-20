import { useState } from 'react';
import { Calendar, BarChart3, Trophy, Dumbbell } from 'lucide-react';
import { FitnessCalendar } from '@/components/FitnessCalendar';
import { UpcomingEvents } from '@/components/UpcomingEvents';
import { AddWorkoutModal } from '@/components/AddWorkoutModal';
import { WorkoutDetail } from '@/components/WorkoutDetail';
import { ProgressStats } from '@/components/ProgressStats';
import { MarathonPlanner } from '@/components/MarathonPlanner';
import { UserSwitcher } from '@/components/UserSwitcher';
import { useWorkouts } from '@/hooks/useWorkouts';
import { useUser } from '@/contexts/UserContext';
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
  const { currentUser } = useUser();

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
        <div className="container max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl gradient-primary glow-primary flex items-center justify-center flex-shrink-0">
                <span className="text-lg sm:text-xl font-display font-bold text-primary-foreground">M</span>
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-display font-bold text-foreground truncate">
                  The Matongos
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">OUR fitness journey</p>
              </div>
            </div>
            <UserSwitcher />
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="sticky top-[65px] sm:top-[73px] z-30 glass-card border-b border-border/50">
        <div className="container max-w-4xl mx-auto px-3 sm:px-4">
          <div className="flex gap-1 py-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-2 sm:px-4 rounded-lg font-medium transition-all duration-200 touch-manipulation',
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground glow-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
              >
                <tab.icon className="h-4 w-4 flex-shrink-0" />
                <span className="hidden sm:inline text-sm">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {activeTab === 'calendar' && (
          <>
            <FitnessCalendar
              workouts={workouts}
              onAddWorkout={(date) => setSelectedDate(date)}
              onSelectWorkout={(workout) => setSelectedWorkout(workout)}
              onToggleComplete={(id) => toggleComplete(id, currentUser)}
            />
            <UpcomingEvents
              workouts={workouts}
              onSelectWorkout={(workout) => setSelectedWorkout(workout)}
              onToggleComplete={(id) => toggleComplete(id, currentUser)}
            />
          </>
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
          onToggleComplete={(id) => toggleComplete(id, currentUser)}
          onDelete={deleteWorkout}
        />
      )}
    </div>
  );
};

export default Index;
