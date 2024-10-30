<script setup>
import { ref } from "vue";
import axios from "axios";

const username = ref("");
const email = ref("");
const password = ref("");
const role = ref("Postulante"); // Valor por defecto
const API_URL =
  "https://671d78fd09103098807d2196.mockapi.io/v1/RegisteredUsers";

async function UserLogin() {
  try {
    const response = await axios.post(API_URL, {
      email: email.value,
      password: password.value,
    });
    if (response.status === 201) {
      alert("Ingresado exitosamente");
      // Limpiar formulario
      email.value = "";
      password.value = "";
    } else {
      alert("Error al Ingresar el usuario: Respuesta inesperada del servidor");
    }
  } catch (error) {
    console.error("Error de registro:", error);
    alert(
      `Hubo un error al registrar el usuario: ${
        error.message || "Error desconocido"
      }`
    );
  }
}
</script>

<template>
  <div>
    <h2>Ingrese Usuario</h2>
    <form @submit.prevent="UserLogin">
      <label for="email">Correo Electrónico</label>
      <input v-model="email" id="email" type="email" required />

      <label for="password">Contraseña</label>
      <input v-model="password" id="password" type="password" required />

      <button type="submit">Ingresar</button>
    </form>
  </div>
</template>

<style scoped>
/* Estilos aquí */
form {
  display: flex;
  flex-direction: column;
}

label {
  margin-top: 10px;
}

input,
select {
  padding: 8px;
  margin-top: 5px;
}

button {
  margin-top: 10px;
  padding: 10px;
  background-color: #42b883;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
