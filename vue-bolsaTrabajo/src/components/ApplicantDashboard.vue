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
			// Filtrar los empleos a los que se ha postulado el usuario y extraer la fecha de postulación
			appliedJobs.value = response.data
				.filter(
					(job) =>
						job.applications &&
						job.applications.some(
							(application) => application.userId === authStore.user.id
						)
				)
				.map((job) => {
					const application = job.applications.find(
						(application) => application.userId === authStore.user.id
					);
					return {
						...job,
						appliedAt: application ? application.appliedAt : null,
					};
				});
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

async function withdrawApplication(job) {
	try {
		// Filtrar la postulación del usuario del array de aplicaciones del trabajo
		const updatedApplications = job.applications.filter(
			(application) => application.userId !== authStore.user.id
		);

		const response = await axios.put(`${API_URL}/${job.id}`, {
			...job,
			applications: updatedApplications,
		});

		if (response.status === 200) {
			alert("Te has despostulado exitosamente del trabajo.");
			fetchAppliedJobs(); // Actualizar la lista de trabajos después de despostularse
		} else {
			alert("Error al despostularse: Respuesta inesperada del servidor");
		}
	} catch (error) {
		console.error("Error al despostularse:", error);
		alert(
			`Hubo un error al despostularte: ${error.message || "Error desconocido"}`
		);
	}
}

function formatAppliedAt(appliedAt) {
	if (!appliedAt) return "No disponible";
	const date = new Date(appliedAt);
	return date.toLocaleString();
}

onMounted(fetchAppliedJobs);
</script>

<template>
	<div class="container mt-5">
		<div class="card mx-auto shadow-lg border-0 p-4" style="max-width: 800px">
			<div class="card-body">
				<div class="text-center mb-5">
					<h2 class="display-4 text-primary">
						<i class="fas fa-briefcase"></i> Panel del Postulante
					</h2>
					<p class="lead text-secondary">
						Bienvenido, {{ authStore.user.username }}
					</p>
				</div>

				<h3 class="text-primary mb-4">
					<i class="fas fa-file-alt"></i> Mis Postulaciones
				</h3>
				<div class="row g-4">
					<div class="col-md-6" v-for="job in appliedJobs" :key="job.id">
						<div class="card shadow-sm h-100 border-0">
							<div class="card-body d-flex flex-column">
								<h5 class="card-title text-primary">
									<i class="fas fa-briefcase"></i> {{ job.title }}
								</h5>
								<p class="card-text text-muted">{{ job.description }}</p>
								<p class="card-text">
									<strong>Fecha de Postulación:</strong>
									{{ formatAppliedAt(job.appliedAt) }}
								</p>
								<div class="mt-auto">
									<button
										class="btn btn-outline-danger w-100"
										@click="withdrawApplication(job)"
									>
										<i class="fas fa-times-circle"></i> Despostularse
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.container {
	margin-top: 5rem;
}

.card {
	border-radius: 12px;
	transition: transform 0.3s ease-in-out;
}

.card:hover {
	transform: translateY(-5px);
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.card-title {
	font-weight: 600;
}

.card-text {
	font-size: 0.95rem;
}

.btn-primary {
	background-color: #1a73e8;
	border-color: #1a73e8;
}

.btn-primary:hover {
	background-color: #1769c0;
	border-color: #1769c0;
}

.btn-outline-danger {
	transition: background-color 0.3s ease, color 0.3s ease;
}

.btn-outline-danger:hover {
	background-color: #dc3545;
	color: #fff;
}
</style>
