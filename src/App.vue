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

const teamInfo = [
  {
    "Team Name": "Chunky",
    "Group Member(s)": "Parth Pandhare, Matthew Chandler",
  },
  {
    "Team Name": "Maze Runners",
    "Group Member(s)": "David Farag, Rohan Soni",
  },
  {
    "Team Name": "Phoenix",
    "Group Member(s)": "Magnus Adams, Hung Le, Alec Tandoc, Lucas Wu",
  },
  {
    "Team Name": "Meat",
    "Group Member(s)": "Eaton Huang, Lucas Zhong",
  },
  {
    "Team Name": "The Harness",
    "Group Member(s)": "Michael Ward",
  },
  {
    "Team Name": "The Menace",
    "Group Member(s)": "Nat Nguyendinh",
  },
  {
    "Team Name": "The Fetaration",
    "Group Member(s)": "Gil Ben, Ami Strum, Peter Le",
  },
  {
    "Team Name": "Maus 66",
    "Group Member(s)": "Will Craychee, Kai Chan, Haile Do",
  },
  {
    "Team Name": "Formula Remi",
    "Group Member(s)": "Jeffrey Frederick, Youngwoo Chang, Chad Wong",
  },
  {
    "Team Name": "Long Beach",
    "Group Member(s)": "Adan Arevalo,Brody Liudzius,Jeffrey Madrid,Andres Valladares",
  },
  {
    "Team Name": "Maud' Dib",
    "Group Member(s)": "Jeremiah Yong, Adam Wu, Jayce Spurgiasz",
  },
  {
    "Team Name": "BMFC",
    "Group Member(s)": "Brandon Crossman",
  },
  {
    "Team Name": "L1ghtn1ng R4ts",
    "Group Member(s)": "Amanda McKay, Leslie Dong, Justin Chen",
  },
  {
    "Team Name": "The Chargers",
    "Group Member(s)": "Kevin Xiao",
  },
  {
    "Team Name": "The Hammer",
    "Group Member(s)": "Nicholas Ward",
  },
  {
    "Team Name": "BoMouse",
    "Group Member(s)": "Nathan Chen, Jerard Agravante",
  },
  {
    "Team Name": "Ben10",
    "Group Member(s)": "Kyle Cheng, Xaiver Chan, Benjamin Yan",
  }
]

const allTeamStates = ref<TeamState[]>(
  teamInfo.map(team => ({
    name: team['Team Name'].trim(),
    members: team['Group Member(s)'].split(',').map(member => member.trim()),
    completedRuns: [],
  }))
)

const autosaveEnabled = ref(false);

function downloadStatesAsJSON() {
  // Download the team states as a JSON file to `team-states.json` in the Downloads folder.
  const dataStr = JSON.stringify(allTeamStates.value, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'team-states.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function uploadStatesFromJSON(file: File) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target?.result as string);
      allTeamStates.value = data;
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }
  };
  reader.readAsText(file);
}

const currentTeam = ref<string>(teamInfo[0]['Team Name'].trim());

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
  if (autosaveEnabled.value) {
    downloadStatesAsJSON();
  }
}

onMounted(() => {
  window.addEventListener('keydown', (e) => {
    if (e.code === 'KeyS' && e.ctrlKey) {
      e.preventDefault();
      autosaveEnabled.value = !autosaveEnabled.value;
    } else if (e.code === 'KeyD' && e.ctrlKey) {
      e.preventDefault();
      downloadStatesAsJSON();
    } else if (e.code === 'KeyU' && e.ctrlKey) {
      e.preventDefault();
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
          uploadStatesFromJSON(file);
        }
      };
      input.click();
    }
  });
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
        <Maze @complete-maze="disableTimer" @start-new-run="startNewRun" @complete-run="(e) => endRun(e)" :autosaveEnabled="autosaveEnabled"/>
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
