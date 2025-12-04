const form = document.querySelector("form");
const sidemenu = document.getElementById("sidemenu");
const projectContainer = document.getElementById("projectContainer");

const nameInput = document.getElementById("projectName");
const startInput = document.getElementById("startDate");
const endInput = document.getElementById("endDate");

const techNode = document.getElementById("tech-node");
const techNext = document.getElementById("tech-next");
const techReact = document.getElementById("tech-react");
const techTS = document.getElementById("tech-ts");

const imageInput = document.getElementById("fileUpload");
const clearBtn = document.getElementById("clear");


clearBtn.onclick = (e) => {
    e.preventDefault();
    localStorage.removeItem("projects");
    renderProjects();
};


form.addEventListener("submit", (e) => {
    e.preventDefault();

    const pickedTechs = [];
    if (techNode.checked) pickedTechs.push("node");
    if (techNext.checked) pickedTechs.push("next");
    if (techReact.checked) pickedTechs.push("react");
    if (techTS.checked) pickedTechs.push("ts");

    const imageFile = imageInput.files?.[0];

    const newEntry = {
        name: nameInput.value,
        start: startInput.value,
        end: endInput.value,
        techs: pickedTechs,
        image: imageFile ? URL.createObjectURL(imageFile) : null
    };

    const saved = JSON.parse(localStorage.getItem("projects") || "[]");
    saved.push(newEntry);
    localStorage.setItem("projects", JSON.stringify(saved));

    renderProjects();
});


function renderProjects() {
    const saved = JSON.parse(localStorage.getItem("projects") || "[]");

    projectContainer.innerHTML = saved.map(project => makeCard(project)).join("");

    lucide.createIcons();
}

function makeCard(project) {
    return `
        <div class="bg-white shadow p-3 rounded-xl flex flex-col gap-2 text-sm">

            ${project.image ? `<img src="${project.image}" class="w-full h-40 object-cover rounded-lg">` : ""}

            <p class="text-lg font-bold truncate">${project.name}</p>

            <div class="flex flex-row flex-wrap gap-1">
                ${project.techs.map(drawIcon).join("")}
            </div>

            <p class="text-xs text-gray-600">${project.start} → ${project.end}</p>
        </div>
    `;
}

function drawIcon(name) {
    const icons = {
        node: `<i data-lucide="server"></i>`,
        next: `<i data-lucide="circle"></i>`,
        react: `<i data-lucide="atom"></i>`,
        ts: `<i data-lucide="code"></i>`
    };

    return `<div class="p-2 bg-gray-200 rounded">${icons[name] || ""}</div>`;
}

renderProjects();
