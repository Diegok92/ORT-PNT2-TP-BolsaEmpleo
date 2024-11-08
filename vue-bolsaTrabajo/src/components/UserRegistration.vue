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
		<div class="card mx-auto shadow-lg border-0" style="max-width: 600px">
			<div class="card-body">
				<h2 class="card-title text-center mb-4 text-primary">
					<i class="fas fa-user-plus"></i> Registrar Usuario
				</h2>
				<form @submit.prevent="registerUser">
					<div class="mb-3">
						<label for="username" class="form-label">Nombre de Usuario</label>
						<div class="input-group">
							<span class="input-group-text"><i class="fas fa-user"></i></span>
							<input
								v-model="username"
								id="username"
								type="text"
								required
								class="form-control"
								placeholder="Ingresa tu nombre de usuario"
							/>
						</div>
					</div>

					<div class="mb-3">
						<label for="email" class="form-label">Correo Electrónico</label>
						<div class="input-group">
							<span class="input-group-text"
								><i class="fas fa-envelope"></i
							></span>
							<input
								v-model="email"
								id="email"
								type="email"
								required
								class="form-control"
								placeholder="ejemplo@correo.com"
							/>
						</div>
					</div>

					<div class="mb-3">
						<label for="password" class="form-label">Contraseña</label>
						<div class="input-group">
							<span class="input-group-text"><i class="fas fa-lock"></i></span>
							<input
								v-model="password"
								id="password"
								type="password"
								required
								class="form-control"
								placeholder="Ingresa tu contraseña"
							/>
						</div>
					</div>

					<div class="mb-3">
						<label for="role" class="form-label">Rol</label>
						<select v-model="role" id="role" required class="form-select">
							<option value="Postulante">Postulante</option>
							<option value="Empleador">Empleador</option>
							<option value="Administrador">Administrador</option>
						</select>
					</div>

					<button type="submit" class="btn btn-success w-100">
						<i class="fas fa-user-plus"></i> Registrar
					</button>
				</form>
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
}

.btn-success {
	background-color: #28a745;
	border-color: #28a745;
}

.btn-success:hover {
	background-color: #218838;
	border-color: #1e7e34;
}
</style>
