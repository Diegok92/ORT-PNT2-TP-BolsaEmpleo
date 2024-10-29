<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const jobs = ref([]);
const API_URL = "https://671d728409103098807d13b7.mockapi.io/api/v1/posteos";

async function fetchJobs() {
  try {
    const response = await axios.get(API_URL);
    if (response.status === 200) {
      // Verifica que la solicitud fue exitosa
      jobs.value = response.data;
    } else {
      console.warn(
        `Respuesta inesperada al cargar trabajos: ${response.statusText}`
      );
      alert("Error inesperado al cargar los trabajos.");
    }
  } catch (error) {
    console.error("Error al cargar los trabajos:", error);
    alert(
      `Error al cargar los trabajos: ${error.message || "Error desconocido"}`
    );
  }
}

async function applyToJob(jobId) {
  try {
    // Ejemplo: agrega aquí tu lógica de postulación
    alert(`Te postulaste al trabajo con ID: ${jobId}`);
  } catch (error) {
    console.error("Error al postularse:", error);
    alert("Hubo un error al postularte");
  }
}

onMounted(fetchJobs);
</script>

<template>
  <div>
    <h2>Trabajos Disponibles</h2>
    <ul>
      <li v-for="job in jobs" :key="job.id">
        <h3>{{ job.title }}</h3>
        <p>{{ job.description }}</p>
        <button @click="applyToJob(job.id)">Postularse</button>
      </li>
    </ul>
  </div>
</template>
