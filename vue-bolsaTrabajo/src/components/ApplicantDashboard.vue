<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";

const appliedJobs = ref([]);
const API_URL =
	"https://671d78fd09103098807d2196.mockapi.io/v1/RegisteredUsers/1/empleo";
const API_USERS_URL =
	"https://671d78fd09103098807d2196.mockapi.io/v1/RegisteredUsers";
const authStore = useAuthStore();
const router = useRouter();

const userData = ref({
	username: authStore.user.username,
	email: authStore.user.email,
	gender: authStore.user.gender || "",
	province: authStore.user.province || "",
	age: authStore.user.age || "",
	educationLevel: authStore.user.educationLevel || "",
});
const isEditingProfile = ref(false);

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

async function updateProfile() {
	try {
		const response = await axios.put(`${API_USERS_URL}/${authStore.user.id}`, {
			...userData.value,
		});
		if (response.status === 200) {
			alert("Perfil actualizado exitosamente");
			authStore.login(response.data); // Actualizar el store con los nuevos datos
			isEditingProfile.value = false; // Salir del modo de edición
		} else {
			alert("Error al actualizar el perfil: Respuesta inesperada del servidor");
		}
	} catch (error) {
		console.error("Error al actualizar el perfil:", error);
		alert(
			`Hubo un error al actualizar el perfil: ${
				error.message || "Error desconocido"
			}`
		);
	}
}

async function deleteAccount() {
	const confirmation = confirm(
		"¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer."
	);
	if (!confirmation) return;

	try {
		const response = await axios.delete(
			`${API_USERS_URL}/${authStore.user.id}`
		);
		if (response.status === 200) {
			alert("Cuenta eliminada exitosamente");
			authStore.logout(); // Cerrar sesión del usuario eliminado
			router.push("/"); // Redirigir a la página de inicio
		} else {
			alert("Error al eliminar la cuenta: Respuesta inesperada del servidor");
		}
	} catch (error) {
		console.error("Error al eliminar la cuenta:", error);
		alert(
			`Hubo un error al eliminar la cuenta: ${
				error.message || "Error desconocido"
			}`
		);
	}
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

				<!-- Sección de Editar Perfil -->
				<div class="mb-5">
					<h3 class="text-primary mb-4">
						<i class="fas fa-user-edit"></i> Editar Perfil
					</h3>
					<div v-if="isEditingProfile">
						<form
							@submit.prevent="updateProfile"
							class="shadow p-4 rounded-4 bg-light"
						>
							<div class="mb-3">
								<label for="edit-username" class="form-label"
									>Nombre de Usuario</label
								>
								<input
									v-model="userData.username"
									id="edit-username"
									type="text"
									required
									class="form-control"
								/>
							</div>
							<div class="mb-3">
								<label for="edit-email" class="form-label"
									>Correo Electrónico</label
								>
								<input
									v-model="userData.email"
									id="edit-email"
									type="email"
									required
									class="form-control"
								/>
							</div>
							<div class="mb-3">
								<label for="edit-gender" class="form-label">Sexo</label>
								<select
									v-model="userData.gender"
									id="edit-gender"
									class="form-select"
								>
									<option value="" disabled>Selecciona tu sexo</option>
									<option value="Masculino">Masculino</option>
									<option value="Femenino">Femenino</option>
									<option value="Otro">Otro</option>
								</select>
							</div>
							<div class="mb-3">
								<label for="edit-province" class="form-label">Provincia</label>
								<input
									v-model="userData.province"
									id="edit-province"
									type="text"
									class="form-control"
								/>
							</div>
							<div class="mb-3">
								<label for="edit-age" class="form-label">Edad</label>
								<input
									v-model="userData.age"
									id="edit-age"
									type="number"
									min="18"
									class="form-control"
								/>
							</div>
							<div class="mb-3">
								<label for="edit-educationLevel" class="form-label"
									>Nivel Académico Máximo</label
								>
								<select
									v-model="userData.educationLevel"
									id="edit-educationLevel"
									class="form-select"
								>
									<option value="" disabled>
										Selecciona tu nivel académico
									</option>
									<option value="Secundario">Secundario</option>
									<option value="Terciario">Terciario</option>
									<option value="Universitario">Universitario</option>
									<option value="Doctorado/Postgrado/Master">
										Doctorado/Postgrado/Master
									</option>
								</select>
							</div>
							<button type="submit" class="btn btn-primary">
								<i class="fas fa-save"></i> Guardar Cambios
							</button>
							<button
								type="button"
								class="btn btn-secondary ms-2"
								@click="isEditingProfile = false"
							>
								<i class="fas fa-times"></i> Cancelar
							</button>
							<hr />
							<div class="text-center mt-4">
								<button class="btn btn-outline-danger" @click="deleteAccount">
									<i class="fas fa-user-slash"></i> Eliminar Cuenta
								</button>
							</div>
						</form>
					</div>
					<div v-else>
						<button
							class="btn btn-outline-primary"
							@click="isEditingProfile = true"
						>
							<i class="fas fa-user-edit"></i> Editar Perfil
						</button>
					</div>
				</div>

				<!-- Sección de Mis Postulaciones -->
				<h3 class="text-primary mb-4">
					<i class="fas fa-file-alt"></i> Mis Postulaciones
				</h3>
				<div v-if="appliedJobs.length > 0" class="row g-4">
					<div class="col-md-6" v-for="job in appliedJobs" :key="job.id">
						<div class="card shadow-sm h-100 border-0">
							<div class="card-body d-flex flex-column">
								<h5 class="card-title text-primary">
									<i class="fas fa-briefcase"></i> {{ job.title }}
								</h5>
								<p class="card-text text-muted">{{ job.description }}</p>
								<p class="card-text">
									<strong>Empresa:</strong> {{ job.companyName }}
								</p>
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
				<div v-else class="text-center">
					<p class="lead text-muted">Aún no tienes postulaciones realizadas.</p>
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
