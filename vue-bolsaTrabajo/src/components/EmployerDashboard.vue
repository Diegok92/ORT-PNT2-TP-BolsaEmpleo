<script setup>
import { ref, onMounted, nextTick } from "vue";
import axios from "axios";
import { useAuthStore } from "../stores/auth";
import * as bootstrap from "bootstrap";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const jobs = ref([]);
const selectedJob = ref(null);
const newJob = ref({
	title: "",
	description: "",
	companyName: "",
	province: "",
});
const applicants = ref([]);
const API_URL =
	"https://671d78fd09103098807d2196.mockapi.io/v1/RegisteredUsers/1/empleo";
const USER_API_URL =
	"https://671d78fd09103098807d2196.mockapi.io/v1/RegisteredUsers";
const authStore = useAuthStore();
let genderChart = null;
let educationChart = null;
let ageChart = null;
let provinceChart = null;

async function fetchJobs() {
	try {
		const response = await axios.get(API_URL, {
			params: { employerId: authStore.user.id },
		});
		if (response.status === 200) {
			jobs.value = response.data.filter(
				(job) => job.employerId === authStore.user.id
			);
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

function editJob(job) {
	selectedJob.value = { ...job };
	newJob.value = { ...job }; // Copiamos los datos al formulario de nuevo empleo para editarlo
	scrollToForm();
}

async function updateJob() {
	try {
		const response = await axios.put(`${API_URL}/${selectedJob.value.id}`, {
			title: newJob.value.title,
			description: newJob.value.description,
			companyName: newJob.value.companyName,
			province: newJob.value.province,
		});
		if (response.status === 200) {
			alert("Trabajo actualizado exitosamente");
			// Actualizamos la lista de los posteos
			const index = jobs.value.findIndex(
				(job) => job.id === selectedJob.value.id
			);
			if (index !== -1) {
				jobs.value[index] = response.data;
			}
			cancelEdit(); // Borra el formulario de edit
		} else {
			alert(
				"Error al actualizar el trabajo: Respuesta inesperada del servidor"
			);
		}
	} catch (error) {
		console.error("Error al actualizar el trabajo:", error);
		alert(
			`Hubo un error al actualizar el trabajo: ${
				error.message || "Error desconocido"
			}`
		);
	}
}

async function createJob() {
	try {
		const response = await axios.post(API_URL, {
			title: newJob.value.title,
			description: newJob.value.description,
			companyName: newJob.value.companyName,
			province: newJob.value.province,
			employerId: authStore.user.id,
			employerName: authStore.user.username,
			applications: [],
		});
		if (response.status === 201) {
			alert("Trabajo creado exitosamente");
			jobs.value.push(response.data);
			resetForm();
		} else {
			alert("Error al crear el trabajo: Respuesta inesperada del servidor");
		}
	} catch (error) {
		console.error("Error al crear el trabajo:", error);
		alert(
			`Hubo un error al crear el trabajo: ${
				error.message || "Error desconocido"
			}`
		);
	}
}

async function deleteJob(jobId) {
	try {
		const response = await axios.delete(`${API_URL}/${jobId}`);
		if (response.status === 200) {
			alert("Trabajo eliminado exitosamente");
			// Borramos el posteo de la lista
			jobs.value = jobs.value.filter((job) => job.id !== jobId);
		} else {
			alert("Error al eliminar el trabajo: Respuesta inesperada del servidor");
		}
	} catch (error) {
		console.error("Error al eliminar el trabajo:", error);
		alert(
			`Hubo un error al eliminar el trabajo: ${
				error.message || "Error desconocido"
			}`
		);
	}
}

function viewApplicants(job) {
	applicants.value = job.applications.map((application) => ({
		username: application.username,
		email: application.email,
		gender: application.gender,
		age: application.age,
		province: application.province,
		educationLevel: application.educationLevel,
	}));
	const modalEl = document.getElementById("applicantsModal");
	const modal = new bootstrap.Modal(modalEl);
	modal.show();
}

function viewJobMetrics(job) {
	const jobApplicants = job.applications;
	renderJobMetricsCharts(job.title, jobApplicants);
	const modalEl = document.getElementById("jobMetricsModal");
	const modal = new bootstrap.Modal(modalEl);
	modal.show();
}

function renderJobMetricsCharts(jobTitle, jobApplicants) {
	if (genderChart) {
		genderChart.destroy();
	}
	const genderCtx = document.getElementById("jobGenderChart").getContext("2d");
	const genderData = jobApplicants.reduce((acc, applicant) => {
		if (applicant.gender) {
			acc[applicant.gender] = (acc[applicant.gender] || 0) + 1;
		}
		return acc;
	}, {});
	genderChart = new Chart(genderCtx, {
		type: "pie",
		data: {
			labels: Object.keys(genderData),
			datasets: [
				{
					data: Object.values(genderData),
					backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
				},
			],
		},
		options: {
			plugins: {
				title: {
					display: true,
					text: `Género de Postulantes para "${jobTitle}"`,
				},
			},
		},
	});

	if (educationChart) {
		educationChart.destroy();
	}
	const educationCtx = document
		.getElementById("jobEducationChart")
		.getContext("2d");
	const educationData = jobApplicants.reduce((acc, applicant) => {
		if (applicant.educationLevel) {
			acc[applicant.educationLevel] = (acc[applicant.educationLevel] || 0) + 1;
		}
		return acc;
	}, {});
	educationChart = new Chart(educationCtx, {
		type: "bar",
		data: {
			labels: Object.keys(educationData),
			datasets: [
				{
					label: "Nivel Académico",
					data: Object.values(educationData),
					backgroundColor: "rgba(75, 192, 192, 0.6)",
				},
			],
		},
		options: {
			plugins: {
				title: {
					display: true,
					text: `Nivel Académico de Postulantes para "${jobTitle}"`,
				},
			},
		},
	});

	if (ageChart) {
		ageChart.destroy();
	}
	const ageCtx = document.getElementById("jobAgeChart").getContext("2d");
	const ageData = jobApplicants.reduce((acc, applicant) => {
		if (applicant.age) {
			acc[applicant.age] = (acc[applicant.age] || 0) + 1;
		}
		return acc;
	}, {});
	ageChart = new Chart(ageCtx, {
		type: "bar",
		data: {
			labels: Object.keys(ageData),
			datasets: [
				{
					label: "Edad de Postulantes",
					data: Object.values(ageData),
					backgroundColor: "rgba(153, 102, 255, 0.6)",
				},
			],
		},
		options: {
			plugins: {
				title: {
					display: true,
					text: `Edad de Postulantes para "${jobTitle}"`,
				},
			},
		},
	});

	if (provinceChart) {
		provinceChart.destroy();
	}
	const provinceCtx = document
		.getElementById("jobProvinceChart")
		.getContext("2d");
	const provinceData = jobApplicants.reduce((acc, applicant) => {
		if (applicant.province) {
			acc[applicant.province] = (acc[applicant.province] || 0) + 1;
		}
		return acc;
	}, {});
	provinceChart = new Chart(provinceCtx, {
		type: "bar",
		data: {
			labels: Object.keys(provinceData),
			datasets: [
				{
					label: "Provincia de Origen",
					data: Object.values(provinceData),
					backgroundColor: "rgba(255, 159, 64, 0.6)",
				},
			],
		},
		options: {
			plugins: {
				title: {
					display: true,
					text: `Provincia de Origen de Postulantes para "${jobTitle}"`,
				},
			},
		},
	});
}

function cancelEdit() {
	selectedJob.value = null;
	resetForm();
}

function resetForm() {
	newJob.value = {
		title: "",
		description: "",
		companyName: "",
		province: "",
	};
}

function scrollToForm() {
	nextTick(() => {
		const formElement = document.getElementById("jobForm");
		if (formElement) {
			formElement.scrollIntoView({ behavior: "smooth" });
		}
	});
}

onMounted(fetchJobs);
</script>

<template>
	<div class="container mt-5">
		<div class="card mx-auto shadow-lg border-0 p-4" style="max-width: 800px">
			<div class="card-body">
				<div class="text-center mb-5">
					<h2 class="display-4 text-primary">
						<i class="fas fa-building"></i> Panel de Empleador
					</h2>
					<p class="lead text-secondary">
						Bienvenido, {{ authStore.user.username }}
					</p>
				</div>

				<h3 class="text-primary mb-4" id="jobForm">
					<i class="fas fa-plus-circle"></i>
					{{ selectedJob ? "Actualizar Trabajo" : "Crear Nuevo Trabajo" }}
				</h3>
				<form
					@submit.prevent="selectedJob ? updateJob() : createJob()"
					class="shadow p-4 rounded-4 bg-light mb-5"
				>
					<div class="mb-3">
						<label for="new-title" class="form-label">Título del Trabajo</label>
						<div class="input-group">
							<span class="input-group-text"
								><i class="fas fa-briefcase"></i
							></span>
							<input
								v-model="newJob.title"
								id="new-title"
								type="text"
								required
								class="form-control"
							/>
						</div>
					</div>
					<div class="mb-3">
						<label for="new-company" class="form-label"
							>Nombre de la Empresa</label
						>
						<div class="input-group">
							<span class="input-group-text"
								><i class="fas fa-building"></i
							></span>
							<input
								v-model="newJob.companyName"
								id="new-company"
								type="text"
								required
								class="form-control"
							/>
						</div>
					</div>
					<div class="mb-3">
						<label for="new-description" class="form-label">Descripción</label>
						<div class="input-group">
							<span class="input-group-text"
								><i class="fas fa-align-left"></i
							></span>
							<textarea
								v-model="newJob.description"
								id="new-description"
								required
								class="form-control"
							></textarea>
						</div>
					</div>
					<div class="mb-3">
						<label for="new-province" class="form-label">Provincia</label>
						<div class="input-group">
							<span class="input-group-text"
								><i class="fas fa-map-marker-alt"></i
							></span>
							<input
								v-model="newJob.province"
								id="new-province"
								type="text"
								required
								class="form-control"
							/>
						</div>
					</div>
					<div class="d-flex justify-content-between">
						<button type="submit" class="btn btn-success">
							<i class="fas fa-save"></i>
							{{ selectedJob ? "Actualizar Trabajo" : "Crear Trabajo" }}
						</button>
						<button
							v-if="selectedJob"
							type="button"
							class="btn btn-secondary"
							@click="cancelEdit"
						>
							<i class="fas fa-times"></i> Cancelar
						</button>
					</div>
				</form>

				<h3 class="text-primary mb-4">
					<i class="fas fa-briefcase"></i> Mis Trabajos Publicados
				</h3>
				<div
					v-if="jobs.length > 0"
					class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4"
				>
					<div class="col" v-for="job in jobs" :key="job.id">
						<div class="card shadow-sm h-100 border-0">
							<div class="card-body d-flex flex-column">
								<h5 class="card-title text-primary">
									<i class="fas fa-briefcase"></i> {{ job.title }}
								</h5>
								<p class="card-text text-muted">
									<strong>Empresa:</strong> {{ job.companyName }}
								</p>
								<p class="card-text text-muted">{{ job.description }}</p>
								<p class="card-text text-muted">
									<strong>Provincia:</strong> {{ job.province }}
								</p>
								<p class="card-text text-muted">
									<strong>Cantidad de Postulantes:</strong>
									{{ job.applications.length }}
								</p>
								<div class="mt-auto d-grid gap-2">
									<button class="btn btn-outline-primary" @click="editJob(job)">
										<i class="fas fa-edit"></i> Editar
									</button>
									<button
										class="btn btn-outline-info"
										@click="viewApplicants(job)"
									>
										<i class="fas fa-users"></i> Ver Postulantes
									</button>
									<button
										class="btn btn-outline-success"
										@click="viewJobMetrics(job)"
									>
										<i class="fas fa-chart-pie"></i> Métricas
									</button>
									<button
										class="btn btn-outline-danger"
										@click="deleteJob(job.id)"
									>
										<i class="fas fa-trash"></i> Eliminar
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div v-else class="text-center">
					<p class="lead text-muted">No tienes trabajos publicados aún.</p>
				</div>
			</div>
		</div>
	</div>

	<div
		class="modal fade"
		id="applicantsModal"
		tabindex="-1"
		aria-labelledby="applicantsModalLabel"
		aria-hidden="true"
	>
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" id="applicantsModalLabel">
						Detalles de los Postulantes
					</h5>
					<button
						type="button"
						class="btn-close"
						data-bs-dismiss="modal"
						aria-label="Close"
					></button>
				</div>
				<div class="modal-body">
					<ul class="list-group">
						<li
							class="list-group-item"
							v-for="applicant in applicants"
							:key="applicant.email"
						>
							<strong>Nombre:</strong> {{ applicant.username }}<br />
							<strong>Email:</strong> {{ applicant.email }}<br />
							<strong>Sexo:</strong> {{ applicant.gender }}<br />
							<strong>Edad:</strong> {{ applicant.age }}<br />
							<strong>Provincia:</strong> {{ applicant.province }}<br />
							<strong>Nivel Académico:</strong> {{ applicant.educationLevel }}
						</li>
					</ul>
				</div>
				<div class="modal-footer">
					<button
						type="button"
						class="btn btn-secondary"
						data-bs-dismiss="modal"
					>
						Cerrar
					</button>
				</div>
			</div>
		</div>
	</div>

	<div
		class="modal fade"
		id="jobMetricsModal"
		tabindex="-1"
		aria-labelledby="jobMetricsModalLabel"
		aria-hidden="true"
	>
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header">
					<button
						type="button"
						class="btn-close"
						data-bs-dismiss="modal"
						aria-label="Close"
					></button>
				</div>
				<div class="modal-body">
					<div class="mb-5">
						<canvas id="jobGenderChart"></canvas>
					</div>
					<div class="mb-5">
						<canvas id="jobEducationChart"></canvas>
					</div>
					<div class="mb-5">
						<canvas id="jobAgeChart"></canvas>
					</div>
					<div class="mb-5">
						<canvas id="jobProvinceChart"></canvas>
					</div>
				</div>
				<div class="modal-footer">
					<button
						type="button"
						class="btn btn-secondary"
						data-bs-dismiss="modal"
					>
						Cerrar
					</button>
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

.btn-primary {
	background-color: #1a73e8;
	border-color: #1a73e8;
}

.btn-primary:hover {
	background-color: #1769c0;
	border-color: #1769c0;
}

.btn-success {
	background-color: #28a745;
	border-color: #28a745;
}

.btn-success:hover {
	background-color: #218838;
	border-color: #1e7e34;
}

.d-grid {
	gap: 10px;
}

.chart-container {
	margin-bottom: 3rem;
}

canvas {
	max-width: 100%;
	height: auto;
}
</style>
