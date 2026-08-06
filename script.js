const recentProjects = [
  {
    title: "EBARA ELLIOT ENERGY DETAILED DESIGN DEVELOPMENT DAMMAM, SPARK",
    sector: "Industrial / Energy",
    location: "Dammam, SPARK, Saudi Arabia",
    role: "Lead Architecture & BIM Delivery",
    status: "Detailed design development",
    thumbnail: "https://raw.githubusercontent.com/dcpeterallan/Architectural-Portfolio/main/assets/projects/ebara-elliott/perspective.jpg",
    description: [
      "EBARA Elliott Energy (EEE) is a global provider of advanced turbomachinery and energy solutions serving the oil and gas, petrochemical, refining, and power generation industries. The company designs, manufactures, and services technologically advanced equipment such as centrifugal and axial compressors, steam turbines, power recovery expanders, custom pumps, and cryogenic systems used in large-scale industrial facilities worldwide.",
      "EEE is part of EBARA Corporation, a Japanese multinational engineering company founded in 1912 that specializes in industrial machinery, pumps, and environmental and energy technologies.",
      "To strengthen its presence in the Middle East and support the region’s growing energy sector, EBARA Elliott Energy is expanding its operational capabilities in Saudi Arabia by establishing advanced facilities dedicated to turbomachinery packaging, testing, service, and maintenance."
    ],
    scope: ["Master planning", "Architectural design", "Revit / BIM coordination", "Detailed design development", "Complete architectural drawings", "Authority coordination"],
    media: [
      { title: "Revit Model Screenshot", src: "https://raw.githubusercontent.com/dcpeterallan/Architectural-Portfolio/main/assets/projects/ebara-elliott/revit.jpg" },
      { title: "Perspective View", src: "https://raw.githubusercontent.com/dcpeterallan/Architectural-Portfolio/main/assets/projects/ebara-elliott/perspective.jpg" }
    ],
    documents: [
      { title: "Office Building – Complete Architectural Drawings", href: "https://raw.githubusercontent.com/dcpeterallan/Architectural-Portfolio/main/assets/projects/ebara-elliott/office-building-complete-architectural-drawings.pdf" },
      { title: "Production Building – Complete Architectural Drawings", href: "https://raw.githubusercontent.com/dcpeterallan/Architectural-Portfolio/main/assets/projects/ebara-elliott/production-building-complete-architectural-drawings.pdf" }
    ]
  },
  {
    title: "NUPCO Warehouse & Pharmaceutical Facility",
    sector: "Industrial / Logistics",
    location: "Asir, Saudi Arabia",
    role: "Architectural BIM & Coordination",
    status: "Portfolio content in preparation",
    description: ["Architectural and BIM development for a logistics and pharmaceutical warehouse environment, including building-envelope, operational, life-safety, and technical interfaces."],
    scope: ["LOD 300 modelling", "Warehouse planning", "Envelope coordination", "Drawing production", "Clash review"],
    placeholder: "NUPCO project material in development"
  },
  {
    title: "Qiddiya Residential Camps",
    sector: "Residential",
    location: "Qiddiya, Saudi Arabia",
    role: "Architecture, BIM & Visualization",
    status: "Portfolio content in preparation",
    description: ["Design, BIM modelling, and visualization support for high-capacity residential camp developments, with attention to repeatable planning, resident experience, and coordinated delivery."],
    scope: ["Residential planning", "BIM modelling", "Interior studies", "Visualization", "Technical coordination"],
    placeholder: "Qiddiya project material in development"
  }
];

const featuredProjects = [
  ["SCITRA / Zain Industrial Facility", "Lead Architect", "Industrial"],
  ["Ebara Pumps Office", "Lead Architect", "Workplace"],
  ["Toray Membrane Middle East", "Lead Architect", "Industrial"],
  ["Peugeot & Citroën Showroom", "Lead Architect", "Commercial"],
  ["L&T Solar Farm Facilities", "Assistant Architect", "Infrastructure"],
  ["L&T Wind Farm Facilities", "Assistant Architect", "Infrastructure"],
  ["Green Riyadh Nursery", "Assistant Architect", "Infrastructure"],
  ["NEOM High-Density Development", "Architectural BIM Support", "Residential"],
  ["Tiran Island Development", "Architecture & Visualization Support", "Destination"],
  ["NEOM – Professional Village", "Architecture & Visualization Support", "Residential"],
  ["UBI Ethanol Plant", "Quantity & Architectural Support", "Industrial"],
  ["Al Jomaih Beverage Facility", "Quantity & Architectural Support", "Industrial"],
  ["TAQA Well Services", "BOQ & Technical Support", "Industrial"]
];

const projectGrid = document.querySelector("#project-grid");
const featuredGrid = document.querySelector("#featured-grid");
const dialog = document.querySelector("#project-dialog");
const dialogContent = document.querySelector("#dialog-content");

function visualMarkup(project, className = "project-media") {
  if (project.thumbnail) {
    return `<div class="${className}"><img class="project-image" src="${project.thumbnail}" alt="${project.title} perspective"></div>`;
  }
  return `<div class="${className}"><div class="visual-placeholder"><span>${project.placeholder}</span></div></div>`;
}

function projectCard(project, index) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `project-card${index === 0 ? " featured" : ""}`;
  button.setAttribute("aria-label", `Open ${project.title} project details`);
  button.innerHTML = `${visualMarkup(project)}<div class="project-info"><div><h3 class="project-title">${project.title}</h3><div class="project-meta">${project.location} · ${project.role}</div></div><span class="project-index">${String(index + 1).padStart(2, "0")}</span></div>`;
  button.addEventListener("click", () => openProject(project));
  return button;
}

function openProject(project) {
  const hero = project.thumbnail
    ? `<div class="dialog-hero"><img src="${project.thumbnail}" alt="${project.title} perspective"></div>`
    : `<div class="dialog-hero"><div class="visual-placeholder"><span>${project.placeholder}</span></div></div>`;
  const media = project.media?.length
    ? `<div class="deliverables">${project.media.map(item => `<article class="deliverable-card"><div class="deliverable-media"><img src="${item.src}" alt="${project.title} ${item.title}"></div><h3>${item.title}</h3></article>`).join("")}</div>`
    : "";
  const documents = project.documents?.length
    ? `<div class="document-list">${project.documents.map((doc, index) => `<a class="document-link" href="${doc.href}" target="_blank" rel="noopener noreferrer"><span>${String(index + 1).padStart(2, "0")}</span><strong>${doc.title}</strong><em>View PDF ↗</em></a>`).join("")}</div>`
    : `<p class="asset-note">Detailed project presentation will be added as the current work is finalized and cleared for portfolio use.</p>`;

  dialogContent.innerHTML = `${hero}<div class="dialog-body"><p class="eyebrow">${project.sector}</p><h2 class="dialog-title">${project.title}</h2><div class="dialog-meta"><div><span>Location</span><strong>${project.location}</strong></div><div><span>Role</span><strong>${project.role}</strong></div><div><span>Status</span><strong>${project.status}</strong></div><div><span>Portfolio</span><strong>${project.documents?.length ? "Revit · Perspective · Drawings" : "In preparation"}</strong></div></div><div class="dialog-copy">${project.description.map(paragraph => `<p>${paragraph}</p>`).join("")}</div><div class="dialog-tags">${project.scope.map(item => `<span>${item}</span>`).join("")}</div>${media}${documents}</div>`;
  dialog.showModal();
}

recentProjects.forEach((project, index) => projectGrid.appendChild(projectCard(project, index)));
featuredProjects.forEach((project, index) => {
  const article = document.createElement("article");
  article.innerHTML = `<span>${String(index + 1).padStart(2, "0")}</span><h3>${project[0]}</h3><p>${project[1]}</p><small>${project[2]}</small>`;
  featuredGrid.appendChild(article);
});

document.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
document.querySelector(".menu-toggle").addEventListener("click", event => {
  const nav = document.querySelector("#site-nav");
  const open = nav.classList.toggle("open");
  event.currentTarget.setAttribute("aria-expanded", String(open));
});
document.querySelectorAll("#site-nav a").forEach(link => link.addEventListener("click", () => document.querySelector("#site-nav").classList.remove("open")));
document.querySelector("#year").textContent = new Date().getFullYear();
