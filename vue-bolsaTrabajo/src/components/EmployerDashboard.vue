<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useAuthStore } from "../stores/auth";
import * as bootstrap from "bootstrap";

const jobs = ref([]);
const selectedJob = ref(null);
const newJob = ref({ title: "", description: "", companyName: "" });
const applicants = ref([]);
const API_URL =
	"https://671d78fd09103098807d2196.mockapi.io/v1/RegisteredUsers/1/empleo";
const authStore = useAuthStore();

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
	selectedJob.value = { ...job }; // Copiar los datos del empleo seleccionado
}

async function updateJob() {
	try {
		const response = await axios.put(`${API_URL}/${selectedJob.value.id}`, {
			title: selectedJob.value.title,
			description: selectedJob.value.description,
			companyName: selectedJob.value.companyName,
		});
		if (response.status === 200) {
			alert("Trabajo actualizado exitosamente");
			// Actualizar la lista de trabajos
			const index = jobs.value.findIndex(
				(job) => job.id === selectedJob.value.id
			);
			if (index !== -1) {
				jobs.value[index] = response.data;
			}
			selectedJob.value = null; // Limpiar el formulario de edición
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
			employerId: authStore.user.id,
			employerName: authStore.user.username,
			applications: [], // Inicializa un array vacío para las postulaciones
		});
		if (response.status === 201) {
			alert("Trabajo creado exitosamente");
			jobs.value.push(response.data);
			newJob.value.title = "";
			newJob.value.description = "";
			newJob.value.companyName = "";
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
			// Remover el trabajo de la lista
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
	}));
	const modalEl = document.getElementById("applicantsModal");
	const modal = new bootstrap.Modal(modalEl);
	modal.show();
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
					<button type="submit" class="btn btn-success w-100">
						<i class="fas fa-save"></i> Crear Trabajo
					</button>
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

	<!-- Modal para Ver los Postulantes -->
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
</style>
