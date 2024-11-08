<script setup>
import { ref } from "vue";
import axios from "axios";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const API_URL =
	"https://671d78fd09103098807d2196.mockapi.io/v1/RegisteredUsers";

const authStore = useAuthStore();
const router = useRouter();

async function UserLogin() {
	try {
		// Realizamos una solicitud GET para obtener todos los usuarios registrados
		const response = await axios.get(API_URL);

		if (response.status === 200) {
			// Buscamos el usuario en el listado de registros
			const users = response.data;
			const user = users.find(
				(u) => u.email === email.value && u.password === password.value
			);

			if (user) {
				// Guardamos la información del usuario en el store
				authStore.login(user);

				alert("Ingresado exitosamente");

				// Limpiar los campos de formulario
				email.value = "";
				password.value = "";

				// Redirigimos al usuario según su rol
				if (user.role === "Empleador") {
					router.push("/employer-dashboard");
				} else if (user.role === "Postulante") {
					router.push("/applicant-dashboard");
				} else if (user.role === "Administrador") {
					router.push("/admin-dashboard");
				} else {
					router.push("/");
				}
			} else {
				// Si no encuentra el usuario, mostramos un mensaje de error
				alert("Email o contraseña incorrectos");
			}
		} else {
			alert(
				"Error al verificar los usuarios: Respuesta inesperada del servidor"
			);
		}
	} catch (error) {
		console.error("Error al iniciar sesión:", error);
		alert(
			`Hubo un error al iniciar sesión: ${error.message || "Error desconocido"}`
		);
	}
}
</script>

<template>
	<div class="container mt-5">
		<div class="card mx-auto shadow-lg border-0" style="max-width: 500px">
			<div class="card-body">
				<h2 class="card-title text-center mb-4 text-primary">
					<i class="fas fa-sign-in-alt"></i> Iniciar Sesión
				</h2>
				<form @submit.prevent="UserLogin">
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

					<button type="submit" class="btn btn-primary w-100">
						<i class="fas fa-sign-in-alt"></i> Ingresar
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

.btn-primary {
	background-color: #1a73e8;
	border-color: #1a73e8;
}

.btn-primary:hover {
	background-color: #1769c0;
	border-color: #1769c0;
}
</style>
