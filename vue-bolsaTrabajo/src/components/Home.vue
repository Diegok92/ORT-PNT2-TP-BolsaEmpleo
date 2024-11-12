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

	if (
		job.applications &&
		job.applications.some(
			(application) => application.userId === authStore.user.id
		)
	) {
		alert("Ya te has postulado a este trabajo.");
		return;
	}

	try {
		// Agregamos la postulacion al array de postulantes del trabajo
		const response = await axios.put(`${API_URL}/${job.id}`, {
			...job,
			applications: [
				...(job.applications || []),
				{
					userId: authStore.user.id,
					username: authStore.user.username,
					email: authStore.user.email,
					gender: authStore.user.gender,
					age: authStore.user.age,
					province: authStore.user.province,
					educationLevel: authStore.user.educationLevel,
					appliedAt: new Date().toISOString(),
				},
			],
		});

		if (response.status === 200) {
			alert(`Te has postulado exitosamente al trabajo "${job.title}"`);
			fetchJobs(); // Actualizamos la lista de trabajos después de la postulacion
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

function isAlreadyApplied(job) {
	return (
		authStore.user &&
		job.applications &&
		job.applications.some(
			(application) => application.userId === authStore.user.id
		)
	);
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
					<div
						:class="[
							'card',
							'border-0',
							'shadow-sm',
							'h-100',
							{ 'bg-success text-light': isAlreadyApplied(job) },
						]"
					>
						<div class="card-body d-flex flex-column">
							<h5 class="card-title">{{ job.title }}</h5>
							<p class="card-text">
								<strong>Empresa:</strong> {{ job.companyName }}
							</p>
							<p class="card-text">
								<strong>Provincia:</strong> {{ job.province }}
							</p>
							<p class="card-text">{{ job.description }}</p>
							<div class="mt-auto">
								<button
									class="btn"
									:class="
										isAlreadyApplied(job)
											? 'btn-secondary'
											: 'btn-outline-primary'
									"
									@click="applyToJob(job)"
								>
									<i
										class="fas"
										:class="
											isAlreadyApplied(job)
												? 'fa-check-circle'
												: 'fa-paper-plane'
										"
									></i>
									{{
										isAlreadyApplied(job) ? "Ya te has postulado" : "Postularse"
									}}
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
	background-color: rgba(0, 0, 0, 0.7);
	padding: 2rem;
	border-radius: 8px;
	color: #fff;
}

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

.btn-secondary {
	cursor: not-allowed;
}
</style>
