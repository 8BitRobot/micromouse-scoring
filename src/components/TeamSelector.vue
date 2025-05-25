<script setup lang="ts">
import type { TeamState } from '@/App.vue';
import { computed, onMounted, ref } from 'vue';
import { sortRuns } from '../utils';

const selectedTeamName = defineModel<string>()

const props = defineProps({
  teams: {
    type: Array as () => TeamState[],
    required: true,
  }
});

const medalToShow = computed(() => {
  const bestRunForEachTeam = props.teams.map(team => {
    const completedRuns = team.completedRuns;
    if (completedRuns.length === 0) return null;
    return {
      teamName: team.name,
      ...sortRuns(completedRuns)[0],
    };
  }).filter(run => run !== null);

  if (bestRunForEachTeam.length === 0) return '';
  
  const leaderboard = sortRuns(bestRunForEachTeam);

  if (leaderboard[0].teamName === selectedTeamName.value) {
    return 'gold';
  } else if (leaderboard[1]?.teamName === selectedTeamName.value) {
    return 'silver';
  } else if (leaderboard[2]?.teamName === selectedTeamName.value) {
    return 'bronze';
  } else {
    return '';
  }
})

const membersNamesListedNaturally = computed(() => {
  const selectedTeam = props.teams.find(team => team.name === selectedTeamName.value);
  if (selectedTeam == null) {
    return '';
  }

  const teamMembers = selectedTeam.members;
  
  if (teamMembers.length === 0) {
    return '';
  } else if (teamMembers.length === 1) {
    return teamMembers[0];
  } else if (teamMembers.length === 2) {
    return `${teamMembers[0]} and ${teamMembers[1]}`;
  } else {
    const lastMember = teamMembers[teamMembers.length - 1];
    return `${teamMembers.slice(0, teamMembers.length - 1).join(', ')}, and ${lastMember}`;
  }
});


onMounted(() => {
  window.addEventListener(
    "keydown",
    (event) => {
      if (event.code === 'KeyJ') {
        selectedTeamName.value = props.teams[((props.teams.findIndex(team => team.name === selectedTeamName.value) + 1) % props.teams.length)].name;  
      }
    },
    true,
  );
})

</script>

<template>
  <div id="container">
    <div id="medal">
      {{ medalToShow === 'gold' ? '🥇' : medalToShow === 'silver' ? '🥈' : medalToShow === 'bronze' ? '🥉' : '' }}
    </div>
    <div id="team-selector">
      <div class="name">{{ selectedTeamName }}</div>
      <div class="members">
        {{ membersNamesListedNaturally }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

#container {
  width: 600px;
  text-align: right;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
}

#medal {
  font-size: 3.2rem;
  margin-right: 20px;
}

.members {
  font-size: 1.2rem;
  color: #ccc;
  margin-top: 5px;
}

select {
  outline: none;
  font-family: 'Manrope', sans-serif;
  font-size: 1.4rem;
  background-color: transparent;
  border: none;
  color: #fff;
}

</style>