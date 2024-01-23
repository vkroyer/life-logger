<template>
  <div class="habit-tracker">
    <h2>Habit Tracker</h2>
    <h3 class="current-week-header">Week {{ weekNumber }} - {{ yearNumber }}</h3>
    <div class="habits-grid">
      <div class="header">
        <div class="header-item">Habits</div>
        <div class="header-item dates">
          <div class="date" v-for="(date, index) in weekDatesFormatted" :key="index">
            {{ date }}
          </div>
        </div>
      </div>
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
            <!-- <div class="date">{{ weekDates[dayIndex].getDate() }}</div> -->
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
        yearNumber: new Date().getFullYear(),
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        habits: [],
        weekDatesFormatted: this.getWeekDates(),
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
      getFormattedDate(date) {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        return `${day}/${month}`;
      },
      getWeekDates() {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const weekStart = new Date(today); // Copy date
        weekStart.setDate(today.getDate() - dayOfWeek + 1); // Set date to Monday
        const weekStartFormatted = this.getFormattedDate(weekStart);
        const weekDates = [weekStart];
        const weekDatesFormatted = [weekStartFormatted];
        for (let i = 1; i < 7; i += 1) {
          const nextDay = new Date(weekDates[i - 1]);
          nextDay.setDate(weekDates[i - 1].getDate() + 1);
          const nextDayFormatted = this.getFormattedDate(nextDay);
          weekDates.push(nextDay);
          weekDatesFormatted.push(nextDayFormatted);
        }
        return weekDatesFormatted;
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
      // this.currentWeek = this.getWeekDates();
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

  /* .habits-grid {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 10px;
  } */

  .habits-grid {
    display: grid;
    grid-template-columns: auto auto 1fr; /* Adjusted for three columns */
    gap: 10px;
  }

  .header {
    grid-column: 1 / -1; /* Span across all columns */
    display: flex;
    justify-content: space-between;
  }
  /* .header {
    display: flex;
    justify-content: space-between;
  } */

  .header-item {
    flex: 1;
    text-align: center;
  }

  .header-item.dates {
    display: flex;
    justify-content: space-between;
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
    grid-column: 2;
    justify-content: flex-end; /* This will right-align the habit name */
    font-family: 'Dancing Script', cursive;
    font-size: 1.5rem;
    font-weight: bold;
    color: #333;
  }

  .info-icon {
    margin-left: 5px;
    color: #007BFF;
    cursor: pointer;
  }

  .days {
    grid-column: 3;
    grid-template-columns: repeat(7, 1fr);
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