<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useAuthStore } from "../stores/auth";

const jobs = ref([]);
const selectedJob = ref(null);
const newJob = ref({ title: "", description: "" });
const API_URL =
	"https://671d78fd09103098807d2196.mockapi.io/v1/RegisteredUsers/1/empleo";
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

function editJob(job) {
	selectedJob.value = { ...job }; // Copiar los datos del empleo seleccionado
}

async function updateJob() {
	try {
		const response = await axios.put(`${API_URL}/${selectedJob.value.id}`, {
			title: selectedJob.value.title,
			description: selectedJob.value.description,
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
			employerId: authStore.user.id,
		});
		if (response.status === 201) {
			alert("Trabajo creado exitosamente");
			jobs.value.push(response.data);
			newJob.value.title = "";
			newJob.value.description = "";
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

onMounted(fetchJobs);
</script>

<template>
	<div class="container mt-5">
		<h2>Panel de Empleador</h2>
		<p>Bienvenido, {{ authStore.user.username }}</p>

		<h3 class="mt-4">Crear Nuevo Trabajo</h3>
		<form @submit.prevent="createJob" class="mb-5">
			<div class="mb-3">
				<label for="new-title" class="form-label">Título del Trabajo</label>
				<input
					v-model="newJob.title"
					id="new-title"
					type="text"
					required
					class="form-control"
				/>
			</div>
			<div class="mb-3">
				<label for="new-description" class="form-label">Descripción</label>
				<textarea
					v-model="newJob.description"
					id="new-description"
					required
					class="form-control"
				></textarea>
			</div>
			<button type="submit" class="btn btn-success">Crear Trabajo</button>
		</form>

		<h3>Mis Trabajos Publicados</h3>
		<div class="row">
			<div class="col-md-4" v-for="job in jobs" :key="job.id">
				<div class="card mb-4">
					<div class="card-body">
						<h5 class="card-title">{{ job.title }}</h5>
						<p class="card-text">{{ job.description }}</p>
						<button class="btn btn-outline-primary" @click="editJob(job)">
							Editar
						</button>
						<button
							class="btn btn-outline-danger ms-2"
							@click="deleteJob(job.id)"
						>
							Eliminar
						</button>
					</div>
				</div>
			</div>
		</div>

		<div v-if="selectedJob" class="mt-5">
			<h3>Editar Trabajo</h3>
			<form @submit.prevent="updateJob">
				<div class="mb-3">
					<label for="edit-title" class="form-label">Título del Trabajo</label>
					<input
						v-model="selectedJob.title"
						id="edit-title"
						type="text"
						required
						class="form-control"
					/>
				</div>
				<div class="mb-3">
					<label for="edit-description" class="form-label">Descripción</label>
					<textarea
						v-model="selectedJob.description"
						id="edit-description"
						required
						class="form-control"
					></textarea>
				</div>
				<button type="submit" class="btn btn-primary">Actualizar</button>
				<button
					type="button"
					class="btn btn-secondary ms-2"
					@click="selectedJob = null"
				>
					Cancelar
				</button>
			</form>
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
