<script setup>
import { ref } from 'vue'
import JobListing from './components/JobListing.vue'
import JobBoard from './components/JobBoard.vue'
import UserRegistration from './components/UserRegistration.vue'

const isEmployer = ref(false) // Cambia este valor según el rol del usuario
</script>

<template>
  <div>
    <header>
      <h1>Bolsa de Trabajo</h1>
      <button @click="isEmployer = !isEmployer">
        Cambiar a {{ isEmployer ? 'Candidato' : 'Empleador' }}
      </button>
    </header>

    <section v-if="isEmployer">
      <JobListing />
    </section>
    <section v-else>
      <JobBoard />
    </section>

    <section>
    <UserRegistration />
    </section>
  </div>
</template>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1em;
  background-color: #42b883;
  color: white;
}

h1 {
  margin: 0;
}

button {
  background: white;
  color: #42b883;
  border: none;
  padding: 0.5em 1em;
  cursor: pointer;
  border-radius: 4px;
}
</style>
