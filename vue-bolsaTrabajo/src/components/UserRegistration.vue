<script setup>
import { ref } from 'vue'
import axios from 'axios'

const username = ref('')
const email = ref('')
const password = ref('')
const role = ref('Postulante') // Valor por defecto
const API_URL = 'https://671d78fd09103098807d2196.mockapi.io/v1/RegisteredUsers'

async function registerUser() {
    try {
        const response = await axios.post(API_URL, {
            username: username.value,
            email: email.value,
            password: password.value,
            role: role.value,
        })
        if (response.status === 201) {
            alert('Usuario registrado exitosamente')
            // Limpiar formulario
            username.value = ''
            email.value = ''
            password.value = ''
            role.value = 'Postulante'
        } else {
            alert('Error al registrar el usuario: Respuesta inesperada del servidor')
        }
    } catch (error) {
        console.error('Error de registro:', error)
        alert(`Hubo un error al registrar el usuario: ${error.message || 'Error desconocido'}`)
    }
}
</script>

<template>
    <div>
        <h2>Registrar Usuario</h2>
        <form @submit.prevent="registerUser">
            <label for="username">Nombre de Usuario</label>
            <input v-model="username" id="username" type="text" required />

            <label for="email">Correo Electrónico</label>
            <input v-model="email" id="email" type="email" required />

            <label for="password">Contraseña</label>
            <input v-model="password" id="password" type="password" required />

            <label for="role">Rol</label>
            <select v-model="role" id="role" required>
                <option value="Postulante">Postulante</option>
                <option value="Empresa">Empresa</option>
                <option value="Administrador">Administrador</option>
            </select>

            <button type="submit">Registrar</button>
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

input, select {
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