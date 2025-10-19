// Load and render individual project page
let projectData = null;

async function loadProjectPage() {
    try {
        // Get project ID from URL
        const projectId = getProjectIdFromUrl();
        
        if (!projectId) {
            console.error('No project ID found in URL');
            return;
        }

        // Fetch projects data
        const response = await fetch('../projects.json');
        const projects = await response.json();
        
        // Find project by ID
        projectData = projects.find(p => p.id === projectId);
        
        if (!projectData) {
            console.error('Project not found:', projectId);
            document.body.innerHTML = '<div class="container"><h1>Project not found</h1></div>';
            return;
        }
        
        // Render project details
        renderProjectDetails();
        
    } catch (error) {
        console.error('Error loading project page:', error);
    }
}

// Extract project ID from URL
function getProjectIdFromUrl() {
    const path = window.location.pathname;
    const matches = path.match(/\/projects\/(.+)\.html/);
    return matches ? matches[1] : null;
}

// Render all project details
function renderProjectDetails() {
    // Set page title
    document.title = `${projectData.title} | Your Name - ML Engineer & Manager`;
    
    // Render header
    document.getElementById('projectTitle').textContent = projectData.title;
    document.getElementById('projectRole').textContent = projectData.role;
    document.getElementById('projectDate').textContent = projectData.date;
    
    // Render content sections
    document.getElementById('projectChallenge').innerHTML = formatText(projectData.challenge);
    document.getElementById('projectSolution').innerHTML = formatText(projectData.solution);
    document.getElementById('projectTechnical').innerHTML = formatText(projectData.technical);
    document.getElementById('projectResults').innerHTML = formatText(projectData.results);
    
    // Render tech showcase
    renderTechShowcase();
}

// Format text content with proper paragraph breaks
function formatText(text) {
    if (!text) return '';
    
    // Split by double newlines or treat as single paragraph
    const paragraphs = text.split('\n').filter(p => p.trim());
    
    if (paragraphs.length > 1) {
        return paragraphs.map(p => `<p>${p.trim()}</p>`).join('');
    }
    
    return `<p>${text}</p>`;
}

// Render technology showcase
function renderTechShowcase() {
    const showcase = document.getElementById('techShowcase');
    showcase.innerHTML = '';
    
    if (projectData.technologies && projectData.technologies.length > 0) {
        projectData.technologies.forEach(tech => {
            const tag = document.createElement('span');
            tag.className = 'tech-tag';
            tag.textContent = tech;
            showcase.appendChild(tag);
        });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadProjectPage);