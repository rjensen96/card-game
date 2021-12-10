<template>
  <div id="game-container">
    <!-- <div id="drawer">DRAWER</div> -->
    <div id="table">
      <h1>Hello Game</h1>
      <h1>Hello Game</h1>
      <h1>Hello Game</h1>
      <h1>Hello Game</h1>
      <h1>Hello Game</h1>
      <h1>Hello Game</h1>
      <h1>Hello Game</h1>
      <h1>Hello Game</h1>
      <h1>Hello Game</h1>
      <h1>Hello Game</h1>
      <h1>Hello Game</h1>
      <h1>HENLO Game</h1>
    </div>
    <div id="hand">HAND</div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({});
</script>

<style lang="scss" scoped>
// I should probably change this whole thing to use grid instead of flexbox.
//https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Introduction#grid_layout
#game-container {
  display: flex;
  height: 100%;
  margin: 30px 0px 150px 0px;

  //   display: grid;
  //   grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  //   grid-template-rows: auto;
}

#table {
  background-color: blue;
  color: white;
  flex-grow: 1;
  //   grid-row: 1/4;
  //   grid-column: 1 / 6;
}

#drawer {
  background-color: green;
  //   grid-area: "drawer";
  //   grid-row: 1/4;
  //   min-height: 500px;
  position: fixed;
  right: 0px;
  top: 0px;
  height: 100%;
  z-index: 1;
}

#hand {
  background-color: red;
  position: fixed;
  height: 150px;
  bottom: 0px;
  width: 100%;
  z-index: 0;

  //   grid-area: "hand";
  //   grid-row: 5/6;
  //   grid-column: 1/7;
}
</style>
