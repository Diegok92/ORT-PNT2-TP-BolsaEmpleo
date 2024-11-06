<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useAuthStore } from "../stores/auth";

const applications = ref([]);
const APPLICATIONS_API_URL = "https://mockapi.io/api/v1/applications";

const authStore = useAuthStore();

async function fetchApplications() {
	try {
		const response = await axios.get(APPLICATIONS_API_URL, {
			params: { userId: authStore.user.id },
		});
		if (response.status === 200) {
			applications.value = response.data;
		} else {
			console.warn(
				`Respuesta inesperada al cargar las postulaciones: ${response.statusText}`
			);
			alert("Error inesperado al cargar las postulaciones.");
		}
	} catch (error) {
		console.error("Error al cargar las postulaciones:", error);
		alert(
			`Error al cargar las postulaciones: ${
				error.message || "Error desconocido"
			}`
		);
	}
}

onMounted(fetchApplications);
</script>

<template>
	<div class="container mt-5">
		<h2>Panel de Postulante</h2>
		<p>Bienvenido, {{ authStore.user.username }}</p>
		<h3>Trabajos a los que te has postulado</h3>
		<div class="row">
			<div
				class="col-md-4"
				v-for="application in applications"
				:key="application.id"
			>
				<div class="card mb-4">
					<div class="card-body">
						<h5 class="card-title">{{ application.jobTitle }}</h5>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
/* Estilos aquí */
</style>
