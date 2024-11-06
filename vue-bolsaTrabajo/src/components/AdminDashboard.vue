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
		<h2>Panel de Administrador</h2>
		<p>Bienvenido, {{ authStore.user.username }}</p>

		<h3>Usuarios Registrados</h3>
		<div class="row">
			<div class="col-md-4" v-for="user in users" :key="user.id">
				<div class="card mb-4">
					<div class="card-body">
						<h5 class="card-title">{{ user.username }}</h5>
						<p class="card-text">
							<strong>Correo Electrónico:</strong> {{ user.email }}
						</p>
						<p class="card-text"><strong>Rol:</strong> {{ user.role }}</p>
						<button class="btn btn-outline-primary" @click="editUser(user)">
							Editar
						</button>
						<button
							class="btn btn-outline-danger ms-2"
							@click="deleteUser(user.id)"
						>
							Eliminar
						</button>
					</div>
				</div>
			</div>
		</div>

		<div v-if="selectedUser" class="mt-5">
			<h3>Editar Usuario</h3>
			<form @submit.prevent="updateUser">
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
					<label for="edit-email" class="form-label">Correo Electrónico</label>
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
				<button type="submit" class="btn btn-primary">Actualizar</button>
				<button
					type="button"
					class="btn btn-secondary ms-2"
					@click="selectedUser = null"
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
