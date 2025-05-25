<script setup lang="ts">
import Maze from './components/Maze.vue';
import Timer from './components/Timer.vue';
import TeamSelector from './components/TeamSelector.vue';

import { onMounted, ref } from 'vue';

export type TeamState = {
  name: string;
  members: string[];
  completedRuns: { cells: number; time: number; mazeCompleted: boolean }[];
};

const allTeamStates = ref<TeamState[]>([
  { name: 'Bigger Chunky', members: ['Parth Pandhare', 'Matthew Chandler'], completedRuns: [] },
  { name: 'Gus the Sus', members: ['Nat Nguyendinh'], completedRuns: [] },
])
  
const currentTeam = ref<string>('Gus the Sus');

const timerState = ref<'running' | 'paused' | 'stopped'>('stopped');

const clock = ref({ startTime: Date.now(), currentTime: Date.now() });

function disableTimer() {
  timerState.value = 'paused';
}

function startNewRun() {
  timerState.value = 'running';
}

function findTeamStateObject(name: string): TeamState {
  const state = allTeamStates.value.find((obj) => obj.name === currentTeam.value);
  if (state === undefined) {
    throw new Error(`Team state for "${name}" not found.`);
  }
  return state;
}

function endRun(e: [number, boolean]) {
  timerState.value = 'stopped';
  const state = findTeamStateObject(currentTeam.value);
  state.completedRuns.push({
    cells: e[0],
    time: (clock.value.currentTime - clock.value.startTime) / 1000,
    mazeCompleted: e[1]
  });
}


onMounted(() => {
  setInterval(() => {
    if (timerState.value === 'stopped') {
      clock.value.startTime = Date.now();
      clock.value.currentTime = Date.now();
    } else if (timerState.value === 'running') {
      clock.value.currentTime = Date.now();
    }
  }, 10);
});
</script>

<template>
  <div id="main">
    <nav>
      <p>All-America <span>Micromouse</span> Competition</p>
      <div id="team-info">
        <TeamSelector :teams="allTeamStates" v-model="currentTeam"/>
      </div>
    </nav>
    <div id="content">
      <section>
        <Maze @complete-maze="disableTimer" @start-new-run="startNewRun" @complete-run="(e) => endRun(e)"/>
      </section>
      <section>
        <Timer :completed-runs="findTeamStateObject(currentTeam).completedRuns" :clock="clock"/>
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
#main {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  
  nav {
    font-family: 'Manrope', sans-serif;
    font-size: 2rem;
    background-color: #333;
    color: white;
    padding: 1rem 2rem;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    span {
      color: #ffbcbc;
    }
  }
}

#content {
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  width: 100%;
  height: 100%;

  section {
    flex-grow: 1;
    flex-basis: 50%;
    height: 100%;
  }
}
</style>
