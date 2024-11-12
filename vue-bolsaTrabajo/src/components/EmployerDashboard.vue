<script setup>
import { ref, onMounted } from "vue";
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
let applicantsChart = null;
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
			renderCharts();
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
}

async function updateJob() {
	try {
		const response = await axios.put(`${API_URL}/${selectedJob.value.id}`, {
			title: selectedJob.value.title,
			description: selectedJob.value.description,
			companyName: selectedJob.value.companyName,
			province: selectedJob.value.province,
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
			selectedJob.value = null; // Borramos el formulario de edicion
			renderCharts();
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
			newJob.value.title = "";
			newJob.value.description = "";
			newJob.value.companyName = "";
			newJob.value.province = "";
			renderCharts();
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
			renderCharts();
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
	}));
	const modalEl = document.getElementById("applicantsModal");
	const modal = new bootstrap.Modal(modalEl);
	modal.show();
}

function renderCharts() {
	renderApplicantsChart();
	renderGenderChart();
	renderEducationChart();
	renderAgeChart();
	renderProvinceChart();
}

function renderApplicantsChart() {
	if (applicantsChart) {
		applicantsChart.destroy();
	}

	const ctx = document.getElementById("applicantsChart").getContext("2d");
	applicantsChart = new Chart(ctx, {
		type: "bar",
		data: {
			labels: jobs.value.map((job) => job.title),
			datasets: [
				{
					label: "Cantidad de Postulantes",
					data: jobs.value.map((job) => job.applications.length),
					backgroundColor: "rgba(54, 162, 235, 0.6)",
					borderColor: "rgba(54, 162, 235, 1)",
					borderWidth: 1,
				},
			],
		},
		options: {
			responsive: true,
			plugins: {
				legend: {
					position: "top",
				},
				title: {
					display: true,
					text: "Cantidad de Postulantes por Trabajo",
				},
			},
		},
	});
}

async function renderGenderChart() {
	if (genderChart) {
		genderChart.destroy();
	}

	try {
		const response = await axios.get(USER_API_URL);
		if (response.status === 200) {
			const genderData = response.data.reduce(
				(acc, user) => {
					if (user.role === "Postulante") {
						acc[user.gender]++;
					}
					return acc;
				},
				{ Masculino: 0, Femenino: 0, Otro: 0 }
			);

			const ctx = document.getElementById("genderChart").getContext("2d");
			genderChart = new Chart(ctx, {
				type: "pie",
				data: {
					labels: Object.keys(genderData),
					datasets: [
						{
							data: Object.values(genderData),
							backgroundColor: [
								"rgba(255, 99, 132, 0.6)",
								"rgba(54, 162, 235, 0.6)",
								"rgba(255, 206, 86, 0.6)",
							],
							borderColor: [
								"rgba(255, 99, 132, 1)",
								"rgba(54, 162, 235, 1)",
								"rgba(255, 206, 86, 1)",
							],
							borderWidth: 1,
						},
					],
				},
				options: {
					responsive: true,
					plugins: {
						legend: {
							position: "top",
						},
						title: {
							display: true,
							text: "Distribución por Género de los Postulantes",
						},
					},
				},
			});
		}
	} catch (error) {
		console.error("Error al cargar datos de género:", error);
	}
}

async function renderEducationChart() {
	if (educationChart) {
		educationChart.destroy();
	}

	try {
		const response = await axios.get(USER_API_URL);
		if (response.status === 200) {
			const educationData = response.data.reduce((acc, user) => {
				if (user.role === "Postulante") {
					acc[user.educationLevel] = (acc[user.educationLevel] || 0) + 1;
				}
				return acc;
			}, {});

			const ctx = document.getElementById("educationChart").getContext("2d");
			educationChart = new Chart(ctx, {
				type: "bar",
				data: {
					labels: Object.keys(educationData),
					datasets: [
						{
							label: "Cantidad de Postulantes",
							data: Object.values(educationData),
							backgroundColor: "rgba(75, 192, 192, 0.6)",
							borderColor: "rgba(75, 192, 192, 1)",
							borderWidth: 1,
						},
					],
				},
				options: {
					responsive: true,
					plugins: {
						legend: {
							position: "top",
						},
						title: {
							display: true,
							text: "Nivel Educativo de los Postulantes",
						},
					},
				},
			});
		}
	} catch (error) {
		console.error("Error al cargar datos de educación:", error);
	}
}

async function renderAgeChart() {
	if (ageChart) {
		ageChart.destroy();
	}

	try {
		const response = await axios.get(USER_API_URL);
		if (response.status === 200) {
			const ageData = response.data.reduce((acc, user) => {
				if (user.role === "Postulante") {
					const ageGroup = `${Math.floor(user.age / 10) * 10}-${
						Math.floor(user.age / 10) * 10 + 9
					}`;
					acc[ageGroup] = (acc[ageGroup] || 0) + 1;
				}
				return acc;
			}, {});

			const ctx = document.getElementById("ageChart").getContext("2d");
			ageChart = new Chart(ctx, {
				type: "bar",
				data: {
					labels: Object.keys(ageData),
					datasets: [
						{
							label: "Cantidad de Postulantes",
							data: Object.values(ageData),
							backgroundColor: "rgba(153, 102, 255, 0.6)",
							borderColor: "rgba(153, 102, 255, 1)",
							borderWidth: 1,
						},
					],
				},
				options: {
					responsive: true,
					plugins: {
						legend: {
							position: "top",
						},
						title: {
							display: true,
							text: "Distribución por Edad de los Postulantes",
						},
					},
				},
			});
		}
	} catch (error) {
		console.error("Error al cargar datos de edad:", error);
	}
}

async function renderProvinceChart() {
	if (provinceChart) {
		provinceChart.destroy();
	}

	try {
		const response = await axios.get(USER_API_URL);
		if (response.status === 200) {
			const provinceData = response.data.reduce((acc, user) => {
				if (user.role === "Postulante") {
					acc[user.province] = (acc[user.province] || 0) + 1;
				}
				return acc;
			}, {});

			const ctx = document.getElementById("provinceChart").getContext("2d");
			provinceChart = new Chart(ctx, {
				type: "bar",
				data: {
					labels: Object.keys(provinceData),
					datasets: [
						{
							label: "Cantidad de Postulantes",
							data: Object.values(provinceData),
							backgroundColor: "rgba(255, 159, 64, 0.6)",
							borderColor: "rgba(255, 159, 64, 1)",
							borderWidth: 1,
						},
					],
				},
				options: {
					responsive: true,
					plugins: {
						legend: {
							position: "top",
						},
						title: {
							display: true,
							text: "Distribución por Provincia de los Postulantes",
						},
					},
				},
			});
		}
	} catch (error) {
		console.error("Error al cargar datos de provincia:", error);
	}
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

				<h3 class="text-primary mb-4">
					<i class="fas fa-plus-circle"></i> Crear Nuevo Trabajo
				</h3>
				<form
					@submit.prevent="createJob"
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
					<button type="submit" class="btn btn-success w-100">
						<i class="fas fa-save"></i> Crear Trabajo
					</button>
				</form>

				<h3 class="text-primary mb-4">
					<i class="fas fa-chart-bar"></i> Métricas de Mis Trabajos
				</h3>
				<div class="mb-5">
					<canvas id="applicantsChart"></canvas>
				</div>

				<h3 class="text-primary mb-4">
					<i class="fas fa-chart-pie"></i> Distribución por Género
				</h3>
				<div class="mb-5">
					<canvas id="genderChart"></canvas>
				</div>

				<h3 class="text-primary mb-4">
					<i class="fas fa-graduation-cap"></i> Nivel Educativo de Postulantes
				</h3>
				<div class="mb-5">
					<canvas id="educationChart"></canvas>
				</div>

				<h3 class="text-primary mb-4">
					<i class="fas fa-users"></i> Distribución por Edad de Postulantes
				</h3>
				<div class="mb-5">
					<canvas id="ageChart"></canvas>
				</div>

				<h3 class="text-primary mb-4">
					<i class="fas fa-map-marker-alt"></i> Distribución por Provincia de
					los Postulantes
				</h3>
				<div class="mb-5">
					<canvas id="provinceChart"></canvas>
				</div>

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
							<strong>Email:</strong> {{ applicant.email }}
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
