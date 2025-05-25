# Micromouse Scoring Tool

This is a simple web-app I created to assist in tracking the performance of different teams in UCLA's All-American Micromouse Competition. It includes both timekeeping as well as mouse tracking with the arrow keys (and a few other quality-of-life features).

## Setting up and running the project

1. Install `nvm`, a Node version managing tool. https://github.com/nvm-sh/nvm

```sh
brew install nvm
```

2. Using `nvm`, install Node `v20.13.1`:

```sh
nvm install v20.13.1
```

3. Confirm that your active Node version is now `v20.13.1` (there will be an arrow pointing to it):

```sh
nvm list
```

4. Clone this Git repository and install the dependencies:

```sh
git clone https://github.com/8BitRobot/micromouse-scoring
cd micromouse-scoring
npm install
```

5. Run the tool:

```sh
npm run dev
```

## Using the tool

**The Timer**
* The timer starts automatically when the mouse leaves the starting corner and pauses automatically when the mouse reaches the center.
* The timer resets when the mouse returns to the starting corner, either by itself or by resetting the run.

**Keybinds**
* `Arrow keys` to move the mouse up, down, left, and right.
* `Z` is the undo button. If you make a mistake when inputting the mouse's movements, don't backtrack, as that won't reset the mouse's visited cell count. Use `Z` to undo the moves first instead.
* `C` terminates a run and brings the mouse back to the start. Use this when the mouse's owner physically picks it up out of the maze to replace it at the start.
* `J` cycles between teams.
* `Ctrl+D` downloads the scores you've tracked so far as a JSON file.
* `Ctrl+U` allows you to import scores from a previously-downloaded JSON file.
* `Ctrl+S` enables auto-save, which downloads the JSON file above after every completed run. Turn this on if you're worried about your computer dying, crashing, etc. so that you don't lose past runs.