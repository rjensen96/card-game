<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link><br />
      <router-link to="/chat">Chat</router-link><br />
      <router-link to="/game">Game</router-link>
      <!-- I'll leave these here for now, but I'd  like to redesign navigation for the app. -->
    </div>
    <router-view />
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

body {
  margin: 0px;
}

// basis idea for marquee select: https://github.com/andi23rosca/drag-select-vue/blob/master/src/DragSelect.vue
// I don't think I want to install that, but might want to copy a bunch of the source.

#nav {
  // padding: 30px;
  // height: 50px;
  position: fixed;
  right: 0px;
  top: 0px;
  bottom: 0px;

  border-left: 1px solid #cecece;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
