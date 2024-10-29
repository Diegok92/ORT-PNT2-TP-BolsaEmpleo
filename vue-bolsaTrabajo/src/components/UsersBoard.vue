<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const user = ref([]);
const API_URL =
  "https://671d78fd09103098807d2196.mockapi.io/v1/RegisteredUsers";

async function fetchuser() {
  try {
    const response = await axios.get(API_URL);
    if (response.status === 200) {
      // Verifica que la solicitud fue exitosa
      user.value = response.data;
    } else {
      console.warn(
        `Respuesta inesperada al cargar usuarios: ${response.statusText}`
      );
      alert("Error inesperado al cargar los usuarios.");
    }
  } catch (error) {
    console.error("Error al cargar los usuarios:", error);
    alert(
      `Error al cargar los usuarios: ${error.message || "Error desconocido"}`
    );
  }
}

onMounted(fetchuser);
</script>

<template>
  <div>
    <h2>Usuarios Registrados</h2>
    <ul>
      <li v-for="user in user" :key="user.id">
        <h3>{{ user.username }}</h3>
        <p>{{ user.email }}</p>
        <p>{{ user.role }}</p>
      </li>
    </ul>
  </div>
</template>
