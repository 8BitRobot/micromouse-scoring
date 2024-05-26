<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

const startTime = ref(Date.now());
const currentTime = ref(Date.now());
const addedCompleteRun = ref(false);

const completedRuns = ref<{ cells: number; time: number, mazeCompleted: boolean }[]>([]);

const timerState = ref<'running' | 'paused' | 'stopped'>('stopped');

const props = defineProps(['running', 'newRun', 'newRunInfo'])

onMounted(() => {
  setInterval(() => {
    if (timerState.value === 'stopped') {
      startTime.value = Date.now();
      currentTime.value = Date.now();
    } else if (timerState.value === 'running') {
      currentTime.value = Date.now();
    }

    if (props.newRun) {
      timerState.value = 'stopped';
      if (!addedCompleteRun.value) {
        completedRuns.value.push({ cells: props.newRunInfo[0], time: (currentTime.value - startTime.value) / 1000, mazeCompleted: props.newRunInfo[1]});
      }
      addedCompleteRun.value = true;
    } else if (!props.running) {
      timerState.value = 'paused';
    } else {
      timerState.value = 'running';
      addedCompleteRun.value = false;
    }
  }, 10);
});

const stopwatch = computed(() => {
  const seconds = (currentTime.value - startTime.value) / 1000;
  return `${Math.trunc(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toFixed(2).toString().padStart(5, '0')}`;
});

function bestRun() {
  // sort the array completedRuns in the following manner:
  // 1. Maze completed runs first, sorted by fastest time
  // 2. Maze incomplete runs second, sorted by most cells visited

  const mazeCompletedRuns = completedRuns.value.map((run, index) => ({ ...run, index: index})).filter(run => run.mazeCompleted).sort((a, b) => a.time - b.time);
  if (mazeCompletedRuns.length > 0) {
    return mazeCompletedRuns[0].index;
  }

  const mazeIncompleteRuns = completedRuns.value.map((run, index) => ({ ...run, index: index})).filter(run => !run.mazeCompleted).sort((a, b) => b.cells - a.cells);
  if (mazeIncompleteRuns.length > 0) {
    return mazeIncompleteRuns[0].index;
  }
}

</script>

<template>
  <div id="container">
    <h1>Timer</h1>
    <div>
      <h3>{{ stopwatch }}</h3>
    </div>
    <div id="run-summary-container">
      <div id="run-summary" v-for="(run, index) in completedRuns.slice(1)" :key="index" :class="{
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