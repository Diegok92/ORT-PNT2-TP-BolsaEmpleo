<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";

const jobs = ref([]);
const API_URL =
	"https://671d78fd09103098807d2196.mockapi.io/v1/RegisteredUsers/1/empleo";
const authStore = useAuthStore();
const router = useRouter();

async function fetchJobs() {
	try {
		const response = await axios.get(API_URL);
		if (response.status === 200) {
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

async function applyToJob(job) {
	if (!authStore.user) {
		alert("Debe iniciar sesión para postularse a un trabajo.");
		router.push("/login");
		return;
	}

	if (authStore.user.role !== "Postulante") {
		alert("Solo los postulantes pueden aplicar a empleos.");
		return;
	}

	try {
		const response = await axios.post(`${API_URL}/${job.id}/postulaciones`, {
			userId: authStore.user.id,
			jobId: job.id,
			username: authStore.user.username,
		});

		if (response.status === 201 || response.status === 200) {
			alert(`Te has postulado exitosamente al trabajo "${job.title}"`);
		} else {
			alert("Error al postularse: Respuesta inesperada del servidor");
		}
	} catch (error) {
		console.error("Error al postularse:", error);
		alert(
			`Hubo un error al postularte: ${error.message || "Error desconocido"}`
		);
	}
}

onMounted(fetchJobs);
</script>

<template>
	<div class="container mt-5">
		<h2 class="text-center text-primary">Trabajos Disponibles</h2>
		<div class="row mt-4">
			<div class="col-md-4" v-for="job in jobs" :key="job.id">
				<div class="card mb-4">
					<div class="card-body">
						<h5 class="card-title">{{ job.title }}</h5>
						<p class="card-text">{{ job.description }}</p>
						<button
							class="btn btn-outline-primary w-100"
							@click="applyToJob(job)"
						>
							Postularse
						</button>
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
