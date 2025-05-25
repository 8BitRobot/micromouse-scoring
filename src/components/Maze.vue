<script setup lang="ts">
import { onMounted, ref } from 'vue';

type MouseMovementDirection = 'up' | 'down' | 'left' | 'right';

const emit = defineEmits(['completeMaze', 'completeRun', 'startNewRun']);

const maze = `o---o---o---o---o---o---o---o---o---o---o---o---o---o---o---o---o
|                       |               |       |           |   |
o   o   o   o   o---o   o   o   o   o   o   o   o   o---o   o   o
|   |   |   |   |       |   |   |   |   |   |       |   |   |   |
o   o   o---o   o---o   o   o   o   o   o   o---o   o   o   o   o
|                                                           |   |
o---o   o---o   o---o   o   o   o   o   o---o   o---o---o   o   o
|           |   |       |   |   |   |   |       |       |       |
o---o---o   o---o   o---o   o   o   o   o   o---o   o   o   o   o
|           |       |                   |   |       |   |   |   |
o   o   o---o   o---o   o---o---o---o---o   o---o---o   o   o   o
|   |   |       |       |                       |           |   |
o   o---o   o---o---o---o   o   o---o---o---o   o   o   o---o   o
|   |       |           |   |       |       |   |   |   |       |
o   o   o---o---o---o   o---o   o---o---o   o   o---o---o   o   o
|       |           |   |   |       |                       |   |
o   o---o   o---o---o   o   o   o   o   o---o---o---o---o---o   o
|   |                       |           |                       |
o   o   o---o---o   o   o---o---o---o---o---o---o---o---o---o   o
|   |               |                                   |       |
o   o   o---o---o---o   o---o---o---o   o---o   o---o   o   o   o
|   |   |               |               |   |       |   |   |   |
o   o   o   o   o---o   o   o---o---o---o   o---o   o   o---o   o
|           |   |           |           |       |   |       |   |
o   o---o---o   o---o---o---o   o---o   o   o---o   o---o   o   o
|   |                       |   |   |   |                   |   |
o   o   o---o   o---o   o   o---o   o   o   o---o   o---o   o   o
|   |       |       |   |                       |   |       |   |
o   o   o---o   o---o   o---o---o   o---o   o---o   o---o   o   o
|   |   |   |   |   |   |   |   |   |       |           |   |   |
o   o   o   o   o   o   o   o   o   o---o   o---o   o---o   o   o
|   |                                                           |
o---o---o---o---o---o---o---o---o---o---o---o---o---o---o---o---o`;

function createMazeGrid(maze: string) {
  const mazeGrid: ('peg' | 'hwall' | 'vwall' | 'nowall' | 'unvisited' | 'visited' | 'mouse' )[][] = [];

  const mazeRows = maze.split('\n');

  for (let i = 0; i < mazeRows.length; i++) {
    if (i % 2 === 0) {
      const mazeGridRow: ('peg' | 'hwall' | 'nowall')[] = [];
      // row with walls
      const row = mazeRows[i].split('o').slice(1, 17).map((cell, index) => {
        return cell === '---' ? 'hwall' : 'nowall';
      });
      for (const element of row) {
        mazeGridRow.push('peg');
        mazeGridRow.push(element);
      }
      mazeGridRow.push('peg');
      mazeGrid.push(mazeGridRow);
    } else {
      const mazeGridRow: ('vwall' | 'nowall' | 'unvisited')[] = [];
      // row with cells

      const row = mazeRows[i].split('').filter((cell, index) => index % 4 === 0);
      for (const element of row) {
        mazeGridRow.push(element === '|' ? 'vwall' : 'nowall');
        mazeGridRow.push('unvisited');
      }
      mazeGridRow.pop();
      mazeGrid.push(mazeGridRow);
    }
  }
  const flatMazeGrid = mazeGrid.flat();
  flatMazeGrid[1024] = 'visited';
  return flatMazeGrid;
}

const mazeGrid = ref(createMazeGrid(maze));

const mousePosition = ref(1024);

const moves = ref<{ cell: number, visitedBefore: boolean }[]>([]);

const cellsVisited = ref(0);

const mazeCompleted = ref(false);

function completeRun() {
  mousePosition.value = 1024;
  mazeGrid.value = createMazeGrid(maze);
  moves.value = [];
  console.log('Run completed:', cellsVisited.value, mazeCompleted.value);
  emit('completeRun', [cellsVisited.value, mazeCompleted.value]);
  cellsVisited.value = 0;
}

function getDeltaFromDirection(direction: MouseMovementDirection): number {
  switch (direction) {
    case 'up':
      return -66; // Move up in the grid
    case 'down':
      return 66; // Move down in the grid
    case 'left':
      return -2; // Move left in the grid
    case 'right':
      return 2; // Move right in the grid
    default:
      throw new Error('Invalid direction');
  }
}

function hasWallInDirection(value: number, direction: MouseMovementDirection): boolean {
  return mazeGrid.value[(value + getDeltaFromDirection(direction) / 2)] !== 'nowall';
}

function isMouseMovementInvalid(value: number, direction: MouseMovementDirection, forceMovement: 'default' | 'force'): boolean {
  // Check if the movement is valid based on the walls around the cell
  if (forceMovement === 'force') {
    return false; // Force movement ignores wall checks
  }
  if (hasWallInDirection(value, direction)) {
    return true; // Movement is invalid if there's a wall in the direction
  }
  return false;
}

function moveMouse(value: number, direction: MouseMovementDirection, forceMovement: 'default' | 'force' = 'default'): number {
  const delta = getDeltaFromDirection(direction);
  // return value if value + delta is out of bounds (0 to 33*33-1)
  if (value + delta < 0 || value + delta > 1088) {
    return value;
  }
  if (isMouseMovementInvalid(value, direction, forceMovement)) {
    return value;
  }
  const newValue = value + delta;
  if (newValue === 510 || newValue === 512 || newValue === 578 || newValue === 576) {
    emit('completeMaze');
    mazeCompleted.value = true;
  } else if (newValue === 1024) {
    completeRun();
  } else if (value === 1024) {
    emit('startNewRun');
    mazeCompleted.value = false;
  }
  moves.value.push({ cell: newValue, visitedBefore: mazeGrid.value[newValue] === 'visited' });
  if (mazeGrid.value[newValue] === 'unvisited') {
    cellsVisited.value++;
  }
  mazeGrid.value[newValue] = 'visited';
  return newValue;
}

function undoMoveMouse() {
  const lastMove = moves.value.pop();
  if (lastMove) {
    if (!lastMove.visitedBefore) {
      cellsVisited.value--;
    }
    mazeGrid.value[lastMove.cell] = lastMove.visitedBefore ? 'visited' : 'unvisited';
  }
  mousePosition.value = moves.value[moves.value.length - 1]?.cell ?? 1024;
}

onMounted(() => {
  window.addEventListener(
    "keydown",
    (event) => {
      if (event.code === 'ArrowUp') {
        mousePosition.value = moveMouse(mousePosition.value, 'up');
      } else if (event.code === 'ArrowDown') {
        mousePosition.value = moveMouse(mousePosition.value, 'down');
      } else if (event.code === 'ArrowRight') {
        mousePosition.value = moveMouse(mousePosition.value, 'right');
      } else if (event.code === 'ArrowLeft') {
        mousePosition.value = moveMouse(mousePosition.value, 'left');
      } else if (event.code === 'KeyZ') {
        undoMoveMouse();
      } else if (event.code === 'KeyC') {
        completeRun();
      }
    },
    true,
  );
})
</script>

<template>
  <div id="container">
    <h1>The Maze</h1>
    <div id="maze-grid-container">
      <div id="maze-grid">
        <div v-for="(cell, cellIndex) in mazeGrid.flat()" :key="cellIndex" :index="cellIndex" :class="{
          'peg': cell === 'peg',
          'hwall': cell === 'hwall',
          'vwall': cell === 'vwall',
          'nowall': cell === 'nowall',
          'unvisited': cell === 'unvisited',
          'visited': cell === 'visited',
          'mouse': cellIndex === mousePosition,
        }">
          <div v-if="cellIndex === mousePosition">M</div>
        </div>
      </div>
      <h3><span>{{ cellsVisited }}</span> cells visited</h3>
      <button @click="completeRun">Complete Run</button>
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

#maze-grid-container {
  flex: 1;
  
  h3 {
    margin-top: 20px;
    font-family: 'Manrope', sans-serif;
    font-size: 1rem;
    text-align: center;

    span {
      color: #199548;
    }
  }

  button {
    font-family: 'Manrope', sans-serif;
    display: block;
    margin: 0 auto;
    margin-top: 10px;
    padding: 8px 16px;
    background-color: #199548;
    color: white;
    outline: none;
    border: none;
    border-radius: 4px;
  }
}

#maze-grid {
  margin-top: 2rem;
  width: min-content;
  display: grid;
  grid-template-columns: repeat(16, 3px 30px) 3px;
  grid-template-rows: repeat(16, 3px 30px) 3px;
  box-sizing: border-box;

  & > div {
    box-sizing: border-box;
    background-color: #333;

    &.peg {
      background-color: #541818;
    }

    &.vwall, &.hwall {
      background-color: #ff9d9d;
    }

    &.visited {
      background-color: #79eca5;
    }

    &.mouse {
      display: flex;
      flex-flow: row;
      justify-content: center;
      align-items: center;
      color: black;
    }
  }
}
</style>