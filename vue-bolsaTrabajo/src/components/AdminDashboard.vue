<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useAuthStore } from "../stores/auth";

const users = ref([]);
const jobs = ref([]);
const applications = ref([]);

const USERS_API_URL =
	"https://671d78fd09103098807d2196.mockapi.io/v1/RegisteredUsers";
const JOBS_API_URL =
	"https://671d728409103098807d13b7.mockapi.io/api/v1/posteos";
const APPLICATIONS_API_URL = "https://mockapi.io/api/v1/applications";

const authStore = useAuthStore();

async function fetchData() {
	try {
		const [usersResponse, jobsResponse, applicationsResponse] =
			await Promise.all([
				axios.get(USERS_API_URL),
				axios.get(JOBS_API_URL),
				axios.get(APPLICATIONS_API_URL),
			]);

		if (usersResponse.status === 200) {
			users.value = usersResponse.data;
		}

		if (jobsResponse.status === 200) {
			jobs.value = jobsResponse.data;
		}

		if (applicationsResponse.status === 200) {
			applications.value = applicationsResponse.data;
		}
	} catch (error) {
		console.error("Error al cargar datos:", error);
		alert(`Error al cargar datos: ${error.message || "Error desconocido"}`);
	}
}

onMounted(fetchData);
</script>

<template>
	<div class="container mt-5">
		<h2>Panel de Administrador</h2>
		<p>Bienvenido, {{ authStore.user.username }}</p>

		<h3>Usuarios Registrados</h3>
		<div class="row">
			<div class="col-md-4" v-for="user in users" :key="user.id">
				<div class="card mb-4">
					<div class="card-body">
						<h5 class="card-title">{{ user.username }}</h5>
						<p>{{ user.email }}</p>
						<p>Rol: {{ user.role }}</p>
					</div>
				</div>
			</div>
		</div>

		<h3>Trabajos Publicados</h3>
		<div class="row">
			<div class="col-md-4" v-for="job in jobs" :key="job.id">
				<div class="card mb-4">
					<div class="card-body">
						<h5 class="card-title">{{ job.title }}</h5>
						<p>{{ job.description }}</p>
						<p>Empleador: {{ job.employerName }}</p>
					</div>
				</div>
			</div>
		</div>

		<h3>Postulaciones</h3>
		<div class="row">
			<div
				class="col-md-4"
				v-for="application in applications"
				:key="application.id"
			>
				<div class="card mb-4">
					<div class="card-body">
						<h5 class="card-title">Trabajo: {{ application.jobTitle }}</h5>
						<p>Postulante: {{ application.userName }}</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
/* Estilos aquí */
</style>
