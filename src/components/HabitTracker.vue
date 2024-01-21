<template>
  <div class="habit-tracker">
    <h2>Habit Tracker</h2>
    <h3 class="week-of">Week {{ weekNumber }}</h3>
    <div class="habits-grid">
      <div class="habit-names">
        <div class="habit-name" v-for="habit in habits" :key="`name-${habit.HabitID}`">
          {{ habit.HabitName }}
          <span class="info-icon" :title="habit.Description">ℹ️</span>
        </div>
      </div>
      <div class="habit-days">
        <div class="days" v-for="(habit, index) in habits" :key="`days-${habit.HabitID}`">
          <div
            class="day"
            :class="{ 'is-done': habit.days[dayIndex], 'is-today': isToday(dayIndex), 'is-future': isFuture(dayIndex) }"
            v-for="(day, dayIndex) in days"
            :key="dayIndex"
            @click="!isFuture(dayIndex) && toggleHabitDay(index, dayIndex)"
          >
            <transition name="fade">
              <div class="checkmark" v-if="habit.days[dayIndex]">✓</div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

  
  <script>
  export default {
    data() {
      return {
        weekNumber: this.getWeekNumber(),
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        habits: [],
        currentWeek: null,
      };
    },
    methods: {
      toggleHabitDay(habitIndex, dayIndex) {
        this.habits[habitIndex].days[dayIndex] = !this.habits[habitIndex].days[dayIndex];
      },
      async getHabits() {
        // fetch the habits from the API
        const response = await fetch('/api/allHabits');
        const habits = await response.json();
        habits.forEach((habit) => {
          // Create a new array of 7 items, each initialized to false
          habit.days = Array(7).fill(false);
          this.habits.push(habit);
        });
        return this.habits;
      },
      isToday(dayIndex) {
        let today = new Date().getDay();
        today = today === 0 ? 7 : today; // If today is Sunday (0), make it 7. Otherwise, leave it as is.
        return dayIndex === today - 1; // Subtract 1 to make Monday as 0, Tuesday as 1, and so on.
      },
      isFuture(dayIndex) {
        const today = new Date().getDay();
        const adjustedToday = today === 0 ? 6 : today - 1; // Adjust for Monday as 0, Tuesday as 1, etc.
        return dayIndex > adjustedToday;
      },
      getWeekDates() {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const weekStart = new Date(today); // Copy date
        weekStart.setDate(today.getDate() - dayOfWeek + 1); // Set date to Monday
        const weekDates = [weekStart];
        for (let i = 1; i < 7; i += 1) {
          const nextDay = new Date(weekDates[i - 1]);
          nextDay.setDate(weekDates[i - 1].getDate() + 1);
          weekDates.push(nextDay);
        }
        return weekDates;
      },
      getWeekNumber() {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 1);
        const diff = now - start + (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);
        return Math.ceil((dayOfYear + (start.getDay() + 6) % 7) / 7);
      },
    },
    async created() {
      this.currentWeek = this.getWeekDates();
      this.habits = await this.getHabits();
    },
  };
  </script>
  
  <style>
  .habit-tracker {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .habits-grid {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 10px;
  }

  .habit-names, .habit-days {
    display: grid;
    gap: 10px; /* Vertical space between days */
  }

  .habit-name, .days {
    display: flex;
    align-items: center; /* This will vertically center the content inside the grid cell */
    min-height: 50px; /* Set a minimum height to ensure alignment */
  }
  
  .habit-name {
    justify-content: flex-end; /* This will right-align the habit name */
    /* make a font style that is like handwriting */
    font-family: 'Dancing Script', cursive;
    font-size: 1.5rem;
    font-weight: bold;
    color: #333;
  }

  .info-icon {
    margin-left: 5px;
    color: #007BFF; /* Bootstrap primary color */
    cursor: pointer;
  }
  
  .days .day {
    position: relative;
    display: flex;
    width: 40px;
    height: 40px;
    border-radius: 20px;
    margin: 5px;
    background-color: #eee;
    box-shadow: inset 0 0 0 1px #fff, inset 0 0 0 2px #bbb; /* bevel */
  }
  .days .day.is-today {
    width: 60px;
    height: 60px;
    border-radius: 30px;
  }
  .day.is-future {
    cursor: default;
    opacity: 0.6;
  }
  
  .checkmark {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    font-family: 'Dancing Script', cursive;
    font-size: 2.4rem;
    font-weight: bold;
    color: #02c39a;
    user-select: none;
  }
  
  .days .day.is-done .checkmark {
    transform: translate(-50%, -50%) scale(1);
  }
  
  .fade-enter-active, .fade-leave-active {
    transition: opacity 1.3s ease;
  }
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.3);
  }
  </style>