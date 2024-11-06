<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const username = ref("");
const email = ref("");
const password = ref("");
const role = ref("Postulante");
const API_URL =
	"https://671d78fd09103098807d2196.mockapi.io/v1/RegisteredUsers";

const router = useRouter();

async function registerUser() {
	try {
		const response = await axios.post(API_URL, {
			username: username.value,
			email: email.value,
			password: password.value,
			role: role.value,
		});
		if (response.status === 201) {
			alert("Usuario registrado exitosamente");
			username.value = "";
			email.value = "";
			password.value = "";
			role.value = "Postulante";
			router.push("/login");
		} else {
			alert("Error al registrar el usuario: Respuesta inesperada del servidor");
		}
	} catch (error) {
		console.error("Error de registro:", error);
		alert(
			`Hubo un error al registrar el usuario: ${
				error.message || "Error desconocido"
			}`
		);
	}
}
</script>

<template>
	<div class="container mt-5">
		<div class="card mx-auto" style="max-width: 600px">
			<div class="card-body">
				<h2 class="card-title text-center mb-4 text-primary">
					Registrar Usuario
				</h2>
				<form @submit.prevent="registerUser">
					<div class="mb-3">
						<label for="username" class="form-label">Nombre de Usuario</label>
						<input
							v-model="username"
							id="username"
							type="text"
							required
							class="form-control"
							placeholder="Ingresa tu nombre de usuario"
						/>
					</div>

					<div class="mb-3">
						<label for="email" class="form-label">Correo Electrónico</label>
						<input
							v-model="email"
							id="email"
							type="email"
							required
							class="form-control"
							placeholder="ejemplo@correo.com"
						/>
					</div>

					<div class="mb-3">
						<label for="password" class="form-label">Contraseña</label>
						<input
							v-model="password"
							id="password"
							type="password"
							required
							class="form-control"
							placeholder="Ingresa tu contraseña"
						/>
					</div>

					<div class="mb-3">
						<label for="role" class="form-label">Rol</label>
						<select v-model="role" id="role" required class="form-select">
							<option value="Postulante">Postulante</option>
							<option value="Empleador">Empleador</option>
							<option value="Administrador">Administrador</option>
						</select>
					</div>

					<button type="submit" class="btn btn-primary w-100">Registrar</button>
				</form>
			</div>
		</div>
	</div>
</template>

<style scoped>
body {
	background-color: #f8f9fa;
}
</style>
