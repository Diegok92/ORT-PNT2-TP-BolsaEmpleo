<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";

const jobs = ref([]);
const API_URL =
  "https://671d78fd09103098807d2196.mockapi.io/v1/RegisteredUsers/1/empleo";
const authStore = useAuthStore();
const router = useRouter();

async function fetchJobs() {
  try {
    const response = await axios.get(API_URL);
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

async function applyToJob(job) {
  if (!authStore.user) {
    alert("Debe iniciar sesión para postularse a un trabajo.");
    router.push("/login");
    return;
  }

  if (authStore.user.role !== "Postulante") {
    alert("Solo los postulantes pueden aplicar a empleos.");
    return;
  }

  try {
    const response = await axios.post(`${API_URL}/${job.id}/postulaciones`, {
      userId: authStore.user.id,
      jobId: job.id,
      username: authStore.user.username,
    });

    if (response.status === 201 || response.status === 200) {
      alert(`Te has postulado exitosamente al trabajo "${job.title}"`);
    } else {
      alert("Error al postularse: Respuesta inesperada del servidor");
    }
  } catch (error) {
    console.error("Error al postularse:", error);
    alert(
      `Hubo un error al postularte: ${error.message || "Error desconocido"}`
    );
  }
}

onMounted(fetchJobs);
</script>

<template>
  <div class="container my-5" id="fondo" back>
    <div class="overlay">
      <div class="text-center mb-5">
        <h1 class="display-4 text-primary">Trabajos Disponibles</h1>
        <p class="lead text-secondary">
          Encuentra oportunidades laborales adecuadas para ti
        </p>
      </div>
      <div class="row g-4">
        <div class="col-lg-4 col-md-6" v-for="job in jobs" :key="job.id">
          <div class="card shadow-sm h-100">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title text-primary">{{ job.title }}</h5>
              <p class="card-text text-muted">{{ job.description }}</p>
              <div class="mt-auto">
                <button class="btn btn-primary w-100" @click="applyToJob(job)">
                  Postularse
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  background-color: rgba(255, 255, 255, 0.6); /* Fondo semitransparente */
  padding: 2rem;
  border-radius: 8px;
}

/* Contenedor */
.container {
  max-width: 1200px;
}

/* Estilos de la tarjeta */
.card {
  border: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
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
  background-color: #0069d9;
  border-color: #0062cc;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #004085;
}
</style>
