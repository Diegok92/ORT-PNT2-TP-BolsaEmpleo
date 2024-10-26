<script setup>
import { ref } from 'vue'
import axios from 'axios'

const jobTitle = ref('')
const jobDescription = ref('')
const API_URL = 'https://671d728409103098807d13b7.mockapi.io/api/v1/posteos'

async function postJob() {
    try {
        const response = await axios.post(API_URL, {
            title: jobTitle.value,
            description: jobDescription.value,
        })
        if (response.status === 201) { // Verifica si la respuesta fue exitosa
            alert('Trabajo publicado exitosamente')
            jobTitle.value = ''
            jobDescription.value = ''
        } else {
            alert('Error al publicar el trabajo: Respuesta inesperada del servidor')
        }
    } catch (error) {
        console.error('Error de publicación:', error)
        alert(`Hubo un error al publicar el trabajo: ${error.message || 'Error desconocido'}`)
    }
}
</script>

<template>
    <div>
        <h2>Publicar Trabajo</h2>
        <form @submit.prevent="postJob">
            <label for="titulo">Título del Trabajo</label>
            <input v-model="jobTitle" id="titulo" type="text" required />

            <label for="descripcion">Descripción</label>
            <textarea v-model="jobDescription" id="descripcion" required></textarea>

            <button type="submit">Publicar</button>
        </form>
    </div>
</template>

<style scoped>
/* Estilos aquí */
</style>
