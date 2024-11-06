<template>
	<div class="container mt-5 text-center">
		<!-- Comment 
		<img
			src="/assets/job-board.jpg"
			class="img-fluid rounded"
			alt="Bienvenido a la Bolsa de Trabajo"
		/>
		-->
		<h1 class="mt-4 text-primary">Bienvenido a la Bolsa de Trabajo</h1>
		<p class="lead mt-3">
			Conecta con oportunidades laborales que se adapten a tus habilidades o
			encuentra el mejor talento para tu empresa.
		</p>
		<router-link to="/register" class="btn btn-success btn-lg mt-3"
			>Regístrate ahora</router-link
		>
	</div>
</template>

<script setup></script>

<style scoped>
img {
	max-height: 400px;
	object-fit: cover;
}
</style>
