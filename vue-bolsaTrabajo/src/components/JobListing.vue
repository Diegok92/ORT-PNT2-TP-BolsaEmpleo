<script setup>
import { ref } from "vue";
import axios from "axios";
import { useAuthStore } from "../stores/auth";

const jobTitle = ref("");
const jobDescription = ref("");
const API_URL =
	"https://671d78fd09103098807d2196.mockapi.io/v1/RegisteredUsers/1/empleo";

const authStore = useAuthStore();

async function postJob() {
	try {
		const response = await axios.post(API_URL, {
			title: jobTitle.value,
			description: jobDescription.value,
			employerId: authStore.user.id,
			employerName: authStore.user.username,
		});
		if (response.status === 201) {
			alert("Trabajo publicado exitosamente");
			jobTitle.value = "";
			jobDescription.value = "";
		} else {
			alert("Error al publicar el trabajo: Respuesta inesperada del servidor");
		}
	} catch (error) {
		console.error("Error de publicación:", error);
		alert(
			`Hubo un error al publicar el trabajo: ${
				error.message || "Error desconocido"
			}`
		);
	}
}
</script>

<template>
	<div class="mt-5">
		<h2>Publicar Nuevo Trabajo</h2>
		<form @submit.prevent="postJob">
			<div class="mb-3">
				<label for="titulo" class="form-label">Título del Trabajo</label>
				<input
					v-model="jobTitle"
					id="titulo"
					type="text"
					required
					class="form-control"
				/>
			</div>
			<div class="mb-3">
				<label for="descripcion" class="form-label">Descripción</label>
				<textarea
					v-model="jobDescription"
					id="descripcion"
					required
					class="form-control"
				></textarea>
			</div>
			<button type="submit" class="btn btn-primary">Publicar</button>
		</form>
	</div>
</template>

<style scoped>
/* Estilos aquí */
</style>
