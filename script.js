const jobs = [
	{
		title: "Desarrollador Frontend",
		vacancies: 2,
		company: "Tech Solutions",
		date: "2024-10-01",
		province: "Buenos Aires",
	},
	{
		title: "Analista de Datos",
		vacancies: 1,
		company: "Data Insights",
		date: "2024-09-25",
		province: "Córdoba",
	},
	{
		title: "Diseñador Gráfico",
		vacancies: 3,
		company: "Creative Agency",
		date: "2024-09-20",
		province: "Santa Fe",
	},
	{
		title: "Ingeniero de Software",
		vacancies: 4,
		company: "Innovatech",
		date: "2024-10-05",
		province: "Mendoza",
	},
];

function displayJobs() {
	const jobList = document.getElementById("job-items");
	jobs.forEach((job, index) => {
		const listItem = document.createElement("li");
		listItem.setAttribute("id", `job-${index}`);
		listItem.innerHTML = `
            <div>
                <h3>${job.title}</h3>
                <div class="job-details">
                    <span>${job.vacancies} vacantes</span>
                    <span>${job.company}</span>
                    <span>${job.date}</span>
                    <span>${job.province}</span>
                </div>
            </div>
            <button onclick="toggleApplication(${index})">Postularse</button>
        `;
		jobList.appendChild(listItem);
	});
}

function toggleApplication(index) {
	const jobItem = document.getElementById(`job-${index}`);
	const button = jobItem.querySelector("button");

	if (jobItem.classList.contains("postulated")) {
		jobItem.classList.remove("postulated");
		button.textContent = "Postularse";
	} else {
		jobItem.classList.add("postulated");
		button.textContent = "Retirar Postulación";
	}
}

window.onload = displayJobs;
