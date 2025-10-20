// Load and render projects on homepage
let projectsData = [];
let currentFilter = 'all';

// Get unique tags from all projects
function getUniqueTags() {
    const tags = new Set();
    projectsData.forEach(project => {
        project.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
}

// Render filter tags
function renderFilterTags() {
    const filterTagsContainer = document.getElementById('filterTags');
    
    const allTag = document.createElement('button');
    allTag.className = 'filter-tag active';
    allTag.textContent = 'All';
    allTag.dataset.filter = 'all';
    allTag.addEventListener('click', () => filterProjects('all'));
    filterTagsContainer.appendChild(allTag);
    
    const tags = getUniqueTags();
    tags.forEach(tag => {
        const tagElement = document.createElement('button');
        tagElement.className = 'filter-tag';
        tagElement.textContent = tag.charAt(0).toUpperCase() + tag.slice(1);
        tagElement.dataset.filter = tag;
        tagElement.addEventListener('click', () => filterProjects(tag));
        filterTagsContainer.appendChild(tagElement);
    });
}

// Create a project card element
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.dataset.tags = project.tags.join(',');
    
    const header = document.createElement('div');
    header.className = 'project-header';
    
    const titleDiv = document.createElement('div');
    const title = document.createElement('div');
    title.className = 'project-title';
    title.textContent = project.title;
    
    const date = document.createElement('div');
    date.className = 'project-date';
    date.textContent = project.date;
    
    const company = document.createElement('div');
    company.className = 'project-company';
    company.textContent = project.company;
    
    titleDiv.appendChild(title);
    titleDiv.appendChild(company);
    titleDiv.appendChild(date);
    header.appendChild(titleDiv);
    
    const badge = document.createElement('div');
    badge.className = 'role-badge';
    badge.textContent = project.role;
    header.appendChild(badge);
    
    card.appendChild(header);
    
    const description = document.createElement('p');
    description.className = 'project-description';
    description.textContent = project.description;
    card.appendChild(description);
    
    // Metrics
    if (project.metrics && project.metrics.length > 0) {
        const metrics = document.createElement('div');
        metrics.className = 'project-metrics';
        project.metrics.forEach(metric => {
            const badge = document.createElement('span');
            badge.className = 'metric-badge';
            badge.textContent = metric;
            metrics.appendChild(badge);
        });
        card.appendChild(metrics);
    }
    
    // Technologies
    const tags = document.createElement('div');
    tags.className = 'project-tags';
    project.technologies.forEach(tech => {
        const tag = document.createElement('span');
        tag.className = 'tech-tag';
        tag.textContent = tech;
        tags.appendChild(tag);
    });
    card.appendChild(tags);
    
    // View Details Link
    const expandLink = document.createElement('a');
    expandLink.className = 'project-expand';
    expandLink.textContent = 'View Details →';
    expandLink.href = `/projects/${project.id}.html`;
    card.appendChild(expandLink);
    
    return card;
}

// Render all projects in reverse chronological order (latest to oldest)
function renderAllProjects() {
    const projectsContainer = document.getElementById('projectsTimeline');
    
    if (!projectsContainer) {
        console.error('Projects container not found');
        return;
    }
    
    projectsContainer.innerHTML = '';
    
    // Create grid container
    const grid = document.createElement('div');
    grid.className = 'projects-grid';
    
    // Sort projects by start date (latest first)
    const sortedProjects = [...projectsData].sort((a, b) => {
        const aYear = parseInt(a.year.split('-')[0]);
        const bYear = parseInt(b.year.split('-')[0]);
        if (aYear !== bYear) return bYear - aYear;
        
        // If same year, sort by month if available
        const aDate = new Date(a.date);
        const bDate = new Date(b.date);
        return bDate - aDate;
    });
    
    // Filter and add project cards
    const filteredProjects = currentFilter === 'all' 
        ? sortedProjects 
        : sortedProjects.filter(p => p.tags.includes(currentFilter));
    
    filteredProjects.forEach(project => {
        const card = createProjectCard(project);
        grid.appendChild(card);
    });
    
    projectsContainer.appendChild(grid);
}

// Filter projects by tag
function filterProjects(filter) {
    currentFilter = filter;
    
    // Update active filter button
    document.querySelectorAll('.filter-tag').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        }
    });
    
    // Filter and re-render (reverse chronological)
    renderAllProjects();
}

// Setup navigation active state
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-item');
    
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

// Fetch projects data
async function loadProjects() {
    try {
        console.log('Loading projects...');
        const response = await fetch('projects.json');
        projectsData = await response.json();
        console.log('Projects loaded:', projectsData.length);
        
        // Render filter tags
        renderFilterTags();
        
        // Render all projects (reverse chronological)
        renderAllProjects();
        
        // Add click handlers to nav links
        setupNavigation();
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadProjects);