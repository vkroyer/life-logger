<template>
  <div class="image-wrapper">
    <img alt="An image" src="./assets/img.jpg" style="width:300px;">
  </div>
  <HabitTracker/>
</template>

<script>
import HabitTracker from './components/HabitTracker.vue'

export default {
  name: 'App',
  components: {
    HabitTracker
  }
}
</script>

<style>

body {
  margin: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background: linear-gradient(to top right, #0077b6, #90e0ef);
  color: #2c3e50;
  height: 100vh;
}

</style>
