<script setup>
import { useAuthStore } from "./stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

function logout() {
	authStore.logout();
	router.push("/");
}
</script>

<template>
	<div>
		<!-- Navbar -->
		<nav class="navbar navbar-expand-lg navbar-dark bg-primary">
			<div class="container-fluid">
				<router-link class="navbar-brand" to="/">
					<i class="bi bi-briefcase-fill"></i> Bolsa de Trabajo
				</router-link>
				<button
					class="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarNav"
					aria-controls="navbarNav"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span class="navbar-toggler-icon"></span>
				</button>
				<div class="collapse navbar-collapse" id="navbarNav">
					<ul class="navbar-nav ms-auto">
						<li class="nav-item">
							<router-link class="nav-link" to="/">Inicio</router-link>
						</li>
						<li v-if="!authStore.user" class="nav-item">
							<router-link class="nav-link" to="/register">
								<i class="bi bi-person-plus-fill"></i> Registrarse
							</router-link>
						</li>
						<li v-if="!authStore.user" class="nav-item">
							<router-link class="nav-link" to="/login">
								<i class="bi bi-box-arrow-in-right"></i> Iniciar Sesión
							</router-link>
						</li>
						<li v-if="authStore.user" class="nav-item dropdown">
							<a
								class="nav-link dropdown-toggle"
								href="#"
								id="navbarDropdown"
								role="button"
								data-bs-toggle="dropdown"
								aria-expanded="false"
							>
								<i class="bi bi-person-circle"></i>
								{{ authStore.user.username }}
							</a>
							<ul
								class="dropdown-menu dropdown-menu-end"
								aria-labelledby="navbarDropdown"
							>
								<li v-if="authStore.user.role === 'Empleador'">
									<router-link class="dropdown-item" to="/employer-dashboard"
										>Mi Panel</router-link
									>
								</li>
								<li v-if="authStore.user.role === 'Postulante'">
									<router-link class="dropdown-item" to="/applicant-dashboard"
										>Mi Panel</router-link
									>
								</li>
								<li v-if="authStore.user.role === 'Administrador'">
									<router-link class="dropdown-item" to="/admin-dashboard"
										>Panel Admin</router-link
									>
								</li>
								<li><hr class="dropdown-divider" /></li>
								<li>
									<a class="dropdown-item" href="#" @click.prevent="logout">
										<i class="bi bi-box-arrow-left"></i> Cerrar Sesión
									</a>
								</li>
							</ul>
						</li>
					</ul>
				</div>
			</div>
		</nav>

		<!-- Router View -->
		<router-view></router-view>
	</div>
</template>

<style>
/* Colores y estilos adicionales */
body {
	font-family: "Roboto", sans-serif;
	background-color: #f0f2f5;
}
</style>
