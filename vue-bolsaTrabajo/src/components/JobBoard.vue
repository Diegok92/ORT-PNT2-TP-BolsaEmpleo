<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const jobs = ref([]);
const API_URL =
	"https://671d78fd09103098807d2196.mockapi.io/v1/RegisteredUsers/1/empleo";

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

async function applyToJob(jobId) {
	try {
		alert(`Te postulaste al trabajo con ID: ${jobId}`);
	} catch (error) {
		console.error("Error al postularse:", error);
		alert("Hubo un error al postularte");
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
							@click="applyToJob(job.id)"
							class="btn btn-outline-primary w-100"
						>
							<i class="bi bi-send"></i> Postularse
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
