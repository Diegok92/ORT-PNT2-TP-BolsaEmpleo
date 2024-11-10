<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useAuthStore } from "../stores/auth";

const users = ref([]);
const jobs = ref([]);
const selectedUser = ref(null);
const API_USERS_URL =
	"https://671d78fd09103098807d2196.mockapi.io/v1/RegisteredUsers";
const API_JOBS_URL =
	"https://671d78fd09103098807d2196.mockapi.io/v1/RegisteredUsers/1/empleo";
const authStore = useAuthStore();

async function fetchUsersAndJobs() {
	try {
		// Obtener todos los usuarios
		const usersResponse = await axios.get(API_USERS_URL);
		if (usersResponse.status === 200) {
			users.value = usersResponse.data;
		} else {
			console.warn(
				`Respuesta inesperada al cargar usuarios: ${usersResponse.statusText}`
			);
			alert("Error inesperado al cargar los usuarios.");
		}

		// Obtener todos los trabajos
		const jobsResponse = await axios.get(API_JOBS_URL);
		if (jobsResponse.status === 200) {
			jobs.value = jobsResponse.data;
		} else {
			console.warn(
				`Respuesta inesperada al cargar trabajos: ${jobsResponse.statusText}`
			);
			alert("Error inesperado al cargar los trabajos.");
		}

		// Calcular la cantidad de postulaciones para cada usuario
		users.value.forEach((user) => {
			user.appliedJobsCount = jobs.value.reduce((count, job) => {
				if (
					job.applications &&
					job.applications.some((application) => application.userId === user.id)
				) {
					count++;
				}
				return count;
			}, 0);
		});
	} catch (error) {
		console.error("Error al cargar usuarios o trabajos:", error);
		alert(`Error al cargar los datos: ${error.message || "Error desconocido"}`);
	}
}

function editUser(user) {
	selectedUser.value = { ...user }; // Copiar los datos del usuario seleccionado
}

async function updateUser() {
	try {
		const response = await axios.put(
			`${API_USERS_URL}/${selectedUser.value.id}`,
			{
				username: selectedUser.value.username,
				email: selectedUser.value.email,
				role: selectedUser.value.role,
			}
		);
		if (response.status === 200) {
			alert("Usuario actualizado exitosamente");
			// Actualizar la lista de usuarios
			const index = users.value.findIndex(
				(user) => user.id === selectedUser.value.id
			);
			if (index !== -1) {
				users.value[index] = response.data;
			}
			selectedUser.value = null; // Limpiar el formulario de edición
		} else {
			alert(
				"Error al actualizar el usuario: Respuesta inesperada del servidor"
			);
		}
	} catch (error) {
		console.error("Error al actualizar el usuario:", error);
		alert(
			`Hubo un error al actualizar el usuario: ${
				error.message || "Error desconocido"
			}`
		);
	}
}

async function deleteUser(userId) {
	try {
		const response = await axios.delete(`${API_USERS_URL}/${userId}`);
		if (response.status === 200) {
			alert("Usuario eliminado exitosamente");
			// Remover el usuario de la lista
			users.value = users.value.filter((user) => user.id !== userId);
		} else {
			alert("Error al eliminar el usuario: Respuesta inesperada del servidor");
		}
	} catch (error) {
		console.error("Error al eliminar el usuario:", error);
		alert(
			`Hubo un error al eliminar el usuario: ${
				error.message || "Error desconocido"
			}`
		);
	}
}

onMounted(fetchUsersAndJobs);
</script>

<template>
	<div class="container mt-5">
		<div class="card mx-auto shadow-lg border-0 p-4" style="max-width: 800px">
			<div class="card-body">
				<div class="text-center mb-5">
					<h2 class="display-4 text-primary">
						<i class="fas fa-users-cog"></i> Panel de Administrador
					</h2>
					<p class="lead text-secondary">
						Bienvenido, {{ authStore.user.username }}
					</p>
				</div>

				<h3 class="text-primary mb-4">
					<i class="fas fa-user-friends"></i> Usuarios Registrados
				</h3>
				<div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
					<div class="col" v-for="user in users" :key="user.id">
						<div class="card shadow-sm h-100 border-0">
							<div class="card-body">
								<h5 class="card-title text-primary">
									<i class="fas fa-user"></i> {{ user.username }}
								</h5>
								<p class="card-text text-muted">
									<strong>Correo Electrónico:</strong> {{ user.email }}
								</p>
								<p class="card-text text-muted">
									<strong>Rol:</strong> {{ user.role }}
								</p>
								<p class="card-text text-muted">
									<strong>Empleos Postulados:</strong>
									{{ user.appliedJobsCount }}
								</p>
								<div class="d-grid gap-2 mt-3">
									<button
										class="btn btn-outline-primary"
										@click="editUser(user)"
									>
										<i class="fas fa-edit"></i> Editar
									</button>
									<button
										class="btn btn-outline-danger"
										@click="deleteUser(user.id)"
									>
										<i class="fas fa-trash"></i> Eliminar
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div v-if="selectedUser" class="mt-5">
					<h3 class="text-primary mb-4">
						<i class="fas fa-edit"></i> Editar Usuario
					</h3>
					<form
						@submit.prevent="updateUser"
						class="shadow p-4 rounded-4 bg-light"
					>
						<div class="mb-3">
							<label for="edit-username" class="form-label"
								>Nombre de Usuario</label
							>
							<input
								v-model="selectedUser.username"
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
								v-model="selectedUser.email"
								id="edit-email"
								type="email"
								required
								class="form-control"
							/>
						</div>
						<div class="mb-3">
							<label for="edit-role" class="form-label">Rol</label>
							<select
								v-model="selectedUser.role"
								id="edit-role"
								required
								class="form-select"
							>
								<option value="Postulante">Postulante</option>
								<option value="Empleador">Empleador</option>
								<option value="Administrador">Administrador</option>
							</select>
						</div>
						<button type="submit" class="btn btn-primary">
							<i class="fas fa-save"></i> Actualizar
						</button>
						<button
							type="button"
							class="btn btn-secondary ms-2"
							@click="selectedUser = null"
						>
							<i class="fas fa-times"></i> Cancelar
						</button>
					</form>
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
