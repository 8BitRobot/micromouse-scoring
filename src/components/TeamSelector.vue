<script setup lang="ts">
import type { TeamState } from '@/App.vue';
import { computed, onMounted, ref } from 'vue';

const selectedTeamName = defineModel<string>()

const props = defineProps({
  teams: {
    type: Array as () => Pick<TeamState, 'name' | 'members'>[],
    required: true,
  }
});

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
    const lastMember = teamMembers.pop();
    return `${teamMembers.join(', ')}, and ${lastMember}`;
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