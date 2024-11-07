<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useAuthStore } from "../stores/auth";

const appliedJobs = ref([]);
const API_URL =
	"https://671d78fd09103098807d2196.mockapi.io/v1/RegisteredUsers/1/empleo";
const authStore = useAuthStore();

async function fetchAppliedJobs() {
	if (!authStore.user) {
		alert("Debe iniciar sesión para ver sus postulaciones.");
		return;
	}

	try {
		const response = await axios.get(API_URL);
		if (response.status === 200) {
			// Filtrar los empleos a los que se ha postulado el usuario
			appliedJobs.value = response.data.filter(
				(job) =>
					job.postulaciones &&
					job.postulaciones.some((p) => p.userId === authStore.user.id)
			);
		} else {
			console.warn(
				`Respuesta inesperada al cargar trabajos: ${response.statusText}`
			);
			alert("Error inesperado al cargar los trabajos.");
		}
	} catch (error) {
		console.error("Error al cargar los trabajos postulados:", error);
		alert(
			`Error al cargar los trabajos postulados: ${
				error.message || "Error desconocido"
			}`
		);
	}
}

onMounted(fetchAppliedJobs);
</script>

<template>
	<div class="container mt-5">
		<h2>Panel del Postulante</h2>
		<p>Bienvenido, {{ authStore.user.username }}</p>

		<h3 class="mt-4">Mis Postulaciones</h3>
		<div class="row">
			<div class="col-md-4" v-for="job in appliedJobs" :key="job.id">
				<div class="card mb-4">
					<div class="card-body">
						<h5 class="card-title">{{ job.title }}</h5>
						<p class="card-text">{{ job.description }}</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.card {
	transition: transform 0.3s ease-in-out;
}

.card:hover {
	transform: scale(1.05);
}
</style>
