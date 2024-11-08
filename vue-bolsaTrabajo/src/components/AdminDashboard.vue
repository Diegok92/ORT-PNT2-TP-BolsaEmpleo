<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useAuthStore } from "../stores/auth";

const users = ref([]);
const selectedUser = ref(null);
const API_URL =
	"https://671d78fd09103098807d2196.mockapi.io/v1/RegisteredUsers";
const authStore = useAuthStore();

async function fetchUsers() {
	try {
		const response = await axios.get(API_URL);
		if (response.status === 200) {
			users.value = response.data;
		} else {
			console.warn(
				`Respuesta inesperada al cargar usuarios: ${response.statusText}`
			);
			alert("Error inesperado al cargar los usuarios.");
		}
	} catch (error) {
		console.error("Error al cargar los usuarios:", error);
		alert(
			`Error al cargar los usuarios: ${error.message || "Error desconocido"}`
		);
	}
}

function editUser(user) {
	selectedUser.value = { ...user }; // Copiar los datos del usuario seleccionado
}

async function updateUser() {
	try {
		const response = await axios.put(`${API_URL}/${selectedUser.value.id}`, {
			username: selectedUser.value.username,
			email: selectedUser.value.email,
			role: selectedUser.value.role,
		});
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
		const response = await axios.delete(`${API_URL}/${userId}`);
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

onMounted(fetchUsers);
</script>

<template>
	<div class="container mt-5">
		<div class="card mx-auto shadow-lg border-0 p-4" style="max-width: 800px">
			<div class="card-body">
				<div class="text-center mb-5">
					<h2 class="display-4 text-primary">
						<i class="fas fa-user-shield"></i> Panel de Administrador
					</h2>
					<p class="lead text-secondary">
						Bienvenido, {{ authStore.user.username }}
					</p>
				</div>

				<h3 class="text-primary mb-4">
					<i class="fas fa-users"></i> Usuarios Registrados
				</h3>
				<div class="row g-4">
					<div class="col-md-6" v-for="user in users" :key="user.id">
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
								<button class="btn btn-outline-primary" @click="editUser(user)">
									<i class="fas fa-edit"></i> Editar
								</button>
								<button
									class="btn btn-outline-danger ms-2"
									@click="deleteUser(user.id)"
								>
									<i class="fas fa-trash"></i> Eliminar
								</button>
							</div>
						</div>
					</div>
				</div>

				<div v-if="selectedUser" class="mt-5">
					<h3 class="text-primary mb-4">
						<i class="fas fa-user-edit"></i> Editar Usuario
					</h3>
					<form
						@submit.prevent="updateUser"
						class="shadow p-4 rounded-4 bg-light"
					>
						<div class="mb-3">
							<label for="edit-username" class="form-label"
								>Nombre de Usuario</label
							>
							<div class="input-group">
								<span class="input-group-text"
									><i class="fas fa-user"></i
								></span>
								<input
									v-model="selectedUser.username"
									id="edit-username"
									type="text"
									required
									class="form-control"
								/>
							</div>
						</div>
						<div class="mb-3">
							<label for="edit-email" class="form-label"
								>Correo Electrónico</label
							>
							<div class="input-group">
								<span class="input-group-text"
									><i class="fas fa-envelope"></i
								></span>
								<input
									v-model="selectedUser.email"
									id="edit-email"
									type="email"
									required
									class="form-control"
								/>
							</div>
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
</style>
