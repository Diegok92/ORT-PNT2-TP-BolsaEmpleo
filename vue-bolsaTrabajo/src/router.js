import { createRouter, createWebHashHistory } from "vue-router";
import Home from "./components/Home.vue";
import UserRegistration from "./components/UserRegistration.vue";
import UserLogin from "./components/UserLogin.vue";
import EmployerDashboard from "./components/EmployerDashboard.vue";
import ApplicantDashboard from "./components/ApplicantDashboard.vue";
import AdminDashboard from "./components/AdminDashboard.vue";

const routes = [
	{ path: "/", name: "Home", component: Home },
	{ path: "/register", name: "Register", component: UserRegistration },
	{ path: "/login", name: "Login", component: UserLogin },
	{
		path: "/employer-dashboard",
		name: "EmployerDashboard",
		component: EmployerDashboard,
	},
	{
		path: "/applicant-dashboard",
		name: "ApplicantDashboard",
		component: ApplicantDashboard,
	},
	{
		path: "/admin-dashboard",
		name: "AdminDashboard",
		component: AdminDashboard,
	},
];

const router = createRouter({
	history: createWebHashHistory(), // Cambia de createWebHistory() a createWebHashHistory()
	routes,
});

export default router;
