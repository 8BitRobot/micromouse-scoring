<script setup lang="ts">
import Maze from './components/Maze.vue';
import Timer from './components/Timer.vue';

import { ref } from 'vue';

const timerRunning = ref(false);
const newRun = ref(true);
const addNewRunEntry = ref([0, false]);

function disableTimer() {
  timerRunning.value = false;
}

function startNewRun() {
  timerRunning.value = true;
  newRun.value = false;
}

function endRun(e: [number, boolean]) {
  timerRunning.value = false;
  newRun.value = true;
  addNewRunEntry.value = e;
}
</script>

<template>
  <div id="main">
    <nav>All-America <span>Micromouse</span> Competition</nav>
    <div id="content">
      <section>
        <Maze @complete-maze="disableTimer" @start-new-run="startNewRun" @complete-run="(e) => endRun(e)"/>
      </section>
      <section>
        <Timer :running="timerRunning" :newRun="newRun" :newRunInfo="addNewRunEntry"/>
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
    padding: 1rem;
    width: 100%;
    text-align: center;

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
