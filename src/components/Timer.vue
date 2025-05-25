<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  completedRuns: {
    type: Array as () => { cells: number; time: number; mazeCompleted: boolean }[],
    required: true,
    default: () => []
  },
  clock: {
    type: Object as () => { startTime: number; currentTime: number },
    required: true,
  },
});

const stopwatch = computed(() => {
  const seconds = (props.clock.currentTime - props.clock.startTime) / 1000;
  return `${Math.trunc(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toFixed(2).toString().padStart(5, '0')}`;
});

</script>

<template>
  <div id="container">
    <h1>Timer</h1>
    <div>
      <h3>{{ stopwatch }}</h3>
    </div>
    <div id="run-summary-container">
      <div id="run-summary" v-for="(run, index) in props.completedRuns" :key="index" :class="{
        'complete': run.mazeCompleted,
        'incomplete': !run.mazeCompleted,
      }">
        <div><span>{{ run.cells }}</span> cells visited</div>
        <div><span>{{ run.time }}</span> seconds</div>
        <div><span>{{ run.mazeCompleted ? 'Maze complete' : 'Maze incomplete' }}</span></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
#container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-flow: column;
  align-items: center;
}

h1 {
  margin-top: 20px;
  font-family: 'Manrope', sans-serif;
  font-size: 2rem;
  text-align: center;
  flex: 0;
}

h3 {
  margin-top: 20px;
  font-family: monospace, sans-serif;
  font-size: 4rem;
  text-align: center;
  color: #199548;
}

#run-summary-container {
  width: 50%;
}

#run-summary {
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  width: 100%;
  padding: 0.5rem;
  border-bottom: 1px solid #ccc;
  
  span {
    font-weight: bold;
  }

  &.complete span {
    color: #1f9519;
  }

  &.incomplete span {
    color: #c1484e;
  }

  &.best {
    background-color: #163e25
  }
}

</style>