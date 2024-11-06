<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useAuthStore } from "../stores/auth";
import JobListing from "./JobListing.vue";

const jobs = ref([]);
const API_URL = "https://671d728409103098807d13b7.mockapi.io/api/v1/posteos";
const authStore = useAuthStore();

async function fetchJobs() {
	try {
		const response = await axios.get(API_URL, {
			params: { employerId: authStore.user.id },
		});
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

onMounted(fetchJobs);
</script>

<template>
	<div class="container mt-5">
		<h2>Panel de Empleador</h2>
		<p>Bienvenido, {{ authStore.user.username }}</p>
		<h3>Mis Trabajos Publicados</h3>
		<div class="row">
			<div class="col-md-4" v-for="job in jobs" :key="job.id">
				<div class="card mb-4">
					<div class="card-body">
						<h5 class="card-title">{{ job.title }}</h5>
						<p class="card-text">{{ job.description }}</p>
					</div>
				</div>
			</div>
		</div>
		<JobListing />
	</div>
</template>

<style scoped>
/* Estilos aquí */
</style>
