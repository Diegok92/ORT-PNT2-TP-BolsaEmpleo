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
	<div class="container my-5" id="fondo">
		<div class="overlay p-5 rounded-4 shadow-lg">
			<div class="text-center mb-5">
				<h1 class="display-4 text-light">Trabajos Disponibles</h1>
				<p class="lead text-light">
					Encuentra oportunidades laborales adecuadas para ti
				</p>
			</div>
			<div class="row g-4">
				<div class="col-lg-4 col-md-6" v-for="job in jobs" :key="job.id">
					<div class="card border-0 shadow-sm h-100">
						<div class="card-body d-flex flex-column">
							<h5 class="card-title text-primary">{{ job.title }}</h5>
							<p class="card-text text-muted">{{ job.description }}</p>
							<div class="mt-auto">
								<button
									class="btn btn-outline-primary w-100"
									@click="applyToJob(job)"
								>
									<i class="fas fa-paper-plane"></i> Postularse
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.overlay {
	background-color: rgba(0, 0, 0, 0.7); /* Fondo semitransparente oscuro */
	padding: 2rem;
	border-radius: 8px;
	color: #fff;
}

/* Estilos de la tarjeta */
.card {
	border: none;
	transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
	transform: translateY(-5px);
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.card-title {
	font-weight: 700;
}

.card-text {
	font-size: 1rem;
}

.btn-primary {
	background-color: #1a73e8;
	border-color: #1a73e8;
}

.btn-primary:hover {
	background-color: #1769c0;
	border-color: #1769c0;
}
</style>
