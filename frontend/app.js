const API_BASE = '/api/v1';

const state = {
    jobs: [],
    contacts: [],
    companies: [],
    currentTab: 'jobs',
    currentMainView: 'tracker'
};

// DOM Elements
let jobsView, networkView, companiesView;
let tabJobs, tabNetwork, tabCompanies;
let modalOverlay, itemForm, formFieldsDiv, modalTitle, addBtnText, searchInput, addBtn;

// Init
document.addEventListener('DOMContentLoaded', () => {
    // Select elements
    jobsView = document.getElementById('jobs-view');
    networkView = document.getElementById('network-view');
    companiesView = document.getElementById('companies-view');
    tabJobs = document.getElementById('tab-jobs');
    tabNetwork = document.getElementById('tab-network');
    tabCompanies = document.getElementById('tab-companies');
    modalOverlay = document.getElementById('modal-overlay');
    itemForm = document.getElementById('item-form');
    formFieldsDiv = document.getElementById('form-fields');
    modalTitle = document.getElementById('modal-title');
    addBtnText = document.getElementById('add-btn-text');
    searchInput = document.getElementById('search-input');
    addBtn = document.getElementById('add-btn');

    // Load initial data
    loadData();

    // Form Submission
    if (itemForm) itemForm.addEventListener('submit', handleFormSubmit);

    // Tab Listeners
    if (tabJobs) tabJobs.addEventListener('click', () => switchTab('jobs'));
    if (tabNetwork) tabNetwork.addEventListener('click', () => switchTab('network'));
    if (tabCompanies) tabCompanies.addEventListener('click', () => switchTab('companies'));

    if (addBtn) addBtn.addEventListener('click', () => openModal());
    if (searchInput) searchInput.addEventListener('input', (e) => handleSearch(e.target.value));
});

// Navigation Logic
function switchMainTab(viewName) {
    state.currentMainView = viewName;
    
    // Update Sidebar
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    document.getElementById(`nav-${viewName}`).classList.add('active');
    
    // Update Main Content
    document.querySelectorAll('.main-view').forEach(el => el.style.display = 'none');
    document.getElementById(`view-${viewName}`).style.display = 'block';
}

// Resume Logic
async function generateResume() {
    const form = document.getElementById('resume-form');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Parse JSON experience if present (for now)
    try {
        if (data.experience_json) {
            data.experience = JSON.parse(data.experience_json);
            delete data.experience_json;
        } else {
            data.experience = [];
        }
    } catch (e) {
        alert("Invalid JSON in experience field");
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/resumes/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error('Generation failed');

        // Handle File Download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "Resume.docx"; // Backend sets filename but this is fallback
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        
    } catch (error) {
        console.error('Error generating resume:', error);
        alert('Failed to generate resume');
    }
}


// Load Data from API
async function loadData() {
    try {
        const [jobsRes, contactsRes, companiesRes] = await Promise.all([
            fetch(`${API_BASE}/jobs/`),
            fetch(`${API_BASE}/contacts/`),
            fetch(`${API_BASE}/companies/`)
        ]);

        state.jobs = await jobsRes.json();
        state.contacts = await contactsRes.json();
        state.companies = await companiesRes.json();

        renderJobs();
        renderContacts();
        renderCompanies();
        updateStats();

    } catch (error) {
        console.error('Error loading data:', error);
        alert('Failed to load data from backend.');
    }
}

// Switch Tabs
function switchTab(tab) {
    state.currentTab = tab;

    // Reset all
    [jobsView, networkView, companiesView].forEach(el => el.classList.remove('active'));
    [tabJobs, tabNetwork, tabCompanies].forEach(el => el.classList.remove('active'));

    const pageTitle = document.getElementById('page-title');
    if (tab === 'jobs') {
        jobsView.classList.add('active');
        tabJobs.classList.add('active');
        addBtnText.textContent = 'Add Job';
        if (pageTitle) pageTitle.textContent = 'Applications';
    } else if (tab === 'network') {
        networkView.classList.add('active');
        tabNetwork.classList.add('active');
        addBtnText.textContent = 'Add Contact';
        if (pageTitle) pageTitle.textContent = 'Network';
    } else if (tab === 'companies') {
        companiesView.classList.add('active');
        tabCompanies.classList.add('active');
        addBtnText.textContent = 'Add Company';
        if (pageTitle) pageTitle.textContent = 'Companies';
    }
}

// Render Jobs
function renderJobs() {
    const grid = document.getElementById('jobs-grid');
    grid.innerHTML = '';

    state.jobs.forEach((job, index) => {
        const card = document.createElement('div');
        card.className = 'card glass-panel';
        card.style.animationDelay = `${index * 0.1}s`;
        card.innerHTML = `
            <div class="card-header">
                <div>
                    <h3 class="card-title">${escapeHtml(job.company)}</h3>
                    <div class="card-subtitle">${escapeHtml(job.position)}</div>
                </div>
                <span class="status-badge ${getStatusClass(job.status)}">${job.status}</span>
            </div>
            <div class="card-body">
                <div class="info-row"><i class="fa-solid fa-location-dot"></i> ${escapeHtml(job.location || 'Remote')}</div>
                <div class="info-row"><i class="fa-regular fa-calendar"></i> ${formatDate(job.date_applied)}</div>
                ${job.contact_id ? `<div class="info-row"><i class="fa-solid fa-user-tag"></i> Referred by ${getContactName(job.contact_id)}</div>` : ''}
            </div>
            <div class="card-actions">
                <button class="btn-icon" onclick="editItem('job', '${job.id}')"><i class="fa-solid fa-pen"></i></button>
                <button class="btn-icon" onclick="deleteItem('job', '${job.id}')"><i class="fa-solid fa-trash"></i></button>
                <a href="${job.url}" target="_blank" class="btn-icon" ${!job.url ? 'style="display:none"' : ''}><i class="fa-solid fa-external-link-alt"></i></a>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Render Contacts
function renderContacts() {
    const grid = document.getElementById('contacts-grid');
    grid.innerHTML = '';

    state.contacts.forEach((contact, index) => {
        const card = document.createElement('div');
        card.className = 'card glass-panel';
        card.style.animationDelay = `${index * 0.1}s`;
        card.innerHTML = `
            <div class="card-header">
                <div>
                    <h3 class="card-title">${escapeHtml(contact.name)}</h3>
                    <div class="card-subtitle">${escapeHtml(contact.role)} @ ${escapeHtml(contact.company)}</div>
                </div>
                <button class="btn-icon" onclick="window.open('${contact.linkedin}', '_blank')" ${!contact.linkedin ? 'disabled' : ''}>
                    <i class="fa-brands fa-linkedin" style="color: #0077b5; font-size: 1.2rem;"></i>
                </button>
            </div>
            <div class="card-body">
                <div class="info-row"><i class="fa-solid fa-handshake"></i> ${escapeHtml(contact.relationship || 'Connection')}</div>
                <div class="info-row"><i class="fa-solid fa-bolt"></i> referral: ${contact.referral_status || 'None'}</div>
                <div class="info-row"><i class="fa-solid fa-envelope"></i> outreach: ${contact.outreach_status || 'Not Contacted'}</div>
                
                <!-- Task Section -->
                <div class="task-section">
                    <ul class="task-list">
                        ${(contact.tasks || []).map(task => `
                            <li class="task-item">
                                <input type="checkbox" class="task-checkbox" 
                                    ${task.completed ? 'checked' : ''} 
                                    onchange="toggleTask('${contact.id}', '${task.id}')">
                                <span class="task-text">${escapeHtml(task.text)}</span>
                                <button class="task-delete" onclick="deleteTask('${contact.id}', '${task.id}')">
                                    <i class="fa-solid fa-times"></i>
                                </button>
                            </li>
                        `).join('')}
                    </ul>
                    <div class="task-input-group">
                        <input type="text" id="task-input-${contact.id}" class="task-input" placeholder="Add checked item...">
                        <button class="task-add-btn" onclick="addTask('${contact.id}')">
                            <i class="fa-solid fa-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div class="card-actions">
                <button class="btn-icon" onclick="editItem('contact', '${contact.id}')"><i class="fa-solid fa-pen"></i></button>
                <button class="btn-icon" onclick="deleteItem('contact', '${contact.id}')"><i class="fa-solid fa-trash"></i></button>
                <a href="${contact.whatsapp ? 'https://wa.me/' + contact.whatsapp : '#'}" target="_blank" class="btn-icon" ${!contact.whatsapp ? 'style="display:none"' : ''}><i class="fa-brands fa-whatsapp" style="color: #25D366;"></i></a>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Render Companies
function renderCompanies() {
    const grid = document.getElementById('companies-grid');
    grid.innerHTML = '';

    state.companies.forEach((company, index) => {
        const card = document.createElement('div');
        card.className = 'card glass-panel';
        card.style.animationDelay = `${index * 0.1}s`;
        card.innerHTML = `
            <div class="card-header">
                <div>
                    <h3 class="card-title">${escapeHtml(company.name)}</h3>
                </div>
                <a href="${company.url}" target="_blank" class="btn-icon" ${!company.url ? 'style="display:none"' : ''}>
                    <i class="fa-solid fa-external-link-alt"></i>
                </a>
            </div>
            <div class="card-body">
                <div class="info-row">${escapeHtml(company.notes || 'No notes.')}</div>
            </div>
            <div class="card-actions">
                <button class="btn-icon" onclick="editItem('company', '${company.id}')"><i class="fa-solid fa-pen"></i></button>
                <button class="btn-icon" onclick="deleteItem('company', '${company.id}')"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Modal & Forms
function openModal(editId = null) {
    let type;
    if (state.currentTab === 'jobs') type = 'job';
    else if (state.currentTab === 'network') type = 'contact';
    else type = 'company';

    const isEdit = !!editId;

    document.getElementById('entry-type').value = type;
    document.getElementById('entry-id').value = editId || '';

    let titleType = type === 'job' ? 'Job' : (type === 'contact' ? 'Contact' : 'Company');
    modalTitle.textContent = isEdit ? `Edit ${titleType}` : `Add New ${titleType}`;

    // Helper to get value
    const getVal = (field) => {
        if (!isEdit) return '';
        let data;
        if (type === 'job') data = state.jobs.find(j => j.id == editId);
        else if (type === 'contact') data = state.contacts.find(c => c.id == editId);
        else data = state.companies.find(c => c.id == editId);
        return data ? data[field] || '' : '';
    };

    if (type === 'job') {
        formFieldsDiv.innerHTML = `
            <div class="form-group">
                <label>Company Name</label>
                <input type="text" name="company" class="form-control" required value="${getVal('company')}">
            </div>
            <div class="form-group">
                <label>Position Title</label>
                <input type="text" name="position" class="form-control" required value="${getVal('position')}">
            </div>
            <div class="form-group" style="display: flex; gap: 1rem;">
                <div style="flex: 1;">
                    <label>Status</label>
                    <select name="status" class="form-control">
                        <option value="Applied" ${getVal('status') === 'Applied' ? 'selected' : ''}>Applied</option>
                        <option value="Interviewing" ${getVal('status') === 'Interviewing' ? 'selected' : ''}>Interviewing</option>
                        <option value="Offer" ${getVal('status') === 'Offer' ? 'selected' : ''}>Offer</option>
                        <option value="Rejected" ${getVal('status') === 'Rejected' ? 'selected' : ''}>Rejected</option>
                    </select>
                </div>
                <div style="flex: 1;">
                    <label>Date Applied</label>
                    <input type="date" name="date_applied" class="form-control" value="${getVal('date_applied') || new Date().toISOString().split('T')[0]}">
                </div>
            </div>
            <div class="form-group">
                <label>Job URL</label>
                <input type="url" name="url" class="form-control" placeholder="https://..." value="${getVal('url')}">
            </div>
            <div class="form-group">
                <label>Referral Contact (Optional)</label>
                <select name="contact_id" class="form-control">
                    <option value="">None</option>
                    ${state.contacts.map(c => `<option value="${c.id}" ${getVal('contact_id') == c.id ? 'selected' : ''}>${escapeHtml(c.name)} (${c.company})</option>`).join('')}
                </select>
            </div>
        `;
    } else if (type === 'contact') {
        formFieldsDiv.innerHTML = `
            <div class="form-group">
                <label>Full Name</label>
                <input type="text" name="name" class="form-control" required value="${getVal('name')}">
            </div>
            <div class="form-group" style="display: flex; gap: 1rem;">
                <div style="flex: 1;">
                    <label>Company</label>
                    <input type="text" name="company" class="form-control" required value="${getVal('company')}">
                </div>
                <div style="flex: 1;">
                    <label>Role</label>
                    <input type="text" name="role" class="form-control" value="${getVal('role')}">
                </div>
            </div>
            <div class="form-group">
                <label>LinkedIn URL</label>
                <input type="url" name="linkedin" class="form-control" placeholder="https://linkedin.com/in/..." value="${getVal('linkedin')}">
            </div>
            <div class="form-group">
                <label>WhatsApp Number</label>
                <input type="text" name="whatsapp" class="form-control" placeholder="1234567890 (No + or spaces)" value="${getVal('whatsapp')}">
            </div>
            <div class="form-group">
                <label>Outreach Status</label>
                <select name="outreach_status" class="form-control">
                    <option value="Not Contacted" ${getVal('outreach_status') === 'Not Contacted' ? 'selected' : ''}>Not Contacted</option>
                    <option value="Cold Email Sent" ${getVal('outreach_status') === 'Cold Email Sent' ? 'selected' : ''}>Cold Email Sent</option>
                    <option value="Awaiting Response" ${getVal('outreach_status') === 'Awaiting Response' ? 'selected' : ''}>Awaiting Response</option>
                    <option value="Responded" ${getVal('outreach_status') === 'Responded' ? 'selected' : ''}>Responded</option>
                    <option value="Ghosted" ${getVal('outreach_status') === 'Ghosted' ? 'selected' : ''}>Ghosted</option>
                </select>
            </div>
            <div class="form-group">
                <label>Referral Potential</label>
                <select name="referral_status" class="form-control">
                    <option value="Unknown" ${getVal('referral_status') === 'Unknown' ? 'selected' : ''}>Unknown</option>
                    <option value="Requested" ${getVal('referral_status') === 'Requested' ? 'selected' : ''}>Requested</option>
                    <option value="Promised" ${getVal('referral_status') === 'Promised' ? 'selected' : ''}>Promised</option>
                    <option value="Referred" ${getVal('referral_status') === 'Referred' ? 'selected' : ''}>Referred</option>
                </select>
            </div>
        `;
    } else {
        // Company Form
        formFieldsDiv.innerHTML = `
            <div class="form-group">
                <label>Company Name</label>
                <input type="text" name="name" class="form-control" required value="${getVal('name')}">
            </div>
            <div class="form-group">
                <label>Career Page URL</label>
                <input type="url" name="url" class="form-control" placeholder="https://careers..." value="${getVal('url')}">
            </div>
            <div class="form-group">
                <label>Notes</label>
                <textarea name="notes" class="form-control" rows="3">${getVal('notes')}</textarea>
            </div>
        `;
    }

    modalOverlay.classList.add('open');
}

function closeModal() {
    modalOverlay.classList.remove('open');
    itemForm.reset();
}

async function handleFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData(itemForm);
    const type = document.getElementById('entry-type').value;
    const id = document.getElementById('entry-id').value;

    const entry = Object.fromEntries(formData.entries());

    // Fix empty strings for optional fields
    Object.keys(entry).forEach(key => {
        if (entry[key] === '') entry[key] = null;
    });

    // Fix integer fields
    if (entry.contact_id) entry.contact_id = parseInt(entry.contact_id);

    try {
        let endpoint = '';
        if (type === 'job') endpoint = `${API_BASE}/jobs/`;
        else if (type === 'contact') endpoint = `${API_BASE}/contacts/`;
        else endpoint = `${API_BASE}/companies/`;

        let method = id ? 'PUT' : 'POST';
        let url = id ? `${endpoint}${id}` : endpoint;

        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(entry)
        });

        if (!response.ok) throw new Error('Failed to save');

        await loadData();
        closeModal();
    } catch (error) {
        console.error('Error saving:', error);
        alert('Error saving data');
    }
}

function editItem(type, id) {
    // If editing a resource in a different tab, switch tabs first
    if ((type === 'job' && state.currentTab !== 'jobs') ||
        (type === 'contact' && state.currentTab !== 'network') ||
        (type === 'company' && state.currentTab !== 'companies')) {
        let tab = type === 'job' ? 'jobs' : (type === 'contact' ? 'network' : 'companies');
        switchTab(tab);
    }
    openModal(id);
}

async function deleteItem(type, id) {
    if (!confirm('Are you sure you want to delete this?')) return;

    try {
        let endpoint = '';
        if (type === 'job') endpoint = `${API_BASE}/jobs/${id}`;
        else if (type === 'contact') endpoint = `${API_BASE}/contacts/${id}`;
        else endpoint = `${API_BASE}/companies/${id}`;

        const response = await fetch(endpoint, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete');

        await loadData();
    } catch (error) {
        console.error('Error deleting:', error);
        alert('Error deleting item');
    }
}

// Helpers
function getStatusClass(status) {
    switch (status) {
        case 'Applied': return 'status-applied';
        case 'Interviewing': return 'status-interviewing';
        case 'Offer': return 'status-offer';
        case 'Rejected': return 'status-rejected';
        default: return '';
    }
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    // Handle YYYY-MM-DD
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getContactName(id) {
    const contact = state.contacts.find(c => c.id == id);
    return contact ? contact.name : 'Unknown';
}

function updateStats() {
    document.getElementById('stat-total-jobs').textContent = state.jobs.length;
    document.getElementById('stat-interviewing').textContent = state.jobs.filter(j => j.status === 'Interviewing').length;
    document.getElementById('stat-offers').textContent = state.jobs.filter(j => j.status === 'Offer').length;

    document.getElementById('stat-total-contacts').textContent = state.contacts.length;
    document.getElementById('stat-referrals').textContent = state.contacts.filter(c => c.referral_status === 'Referred').length;

    document.getElementById('stat-total-companies').textContent = state.companies.length;
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Task Management
async function addTask(contactId) {
    const input = document.getElementById(`task-input-${contactId}`);
    const text = input.value.trim();

    if (!text) return;

    try {
        const response = await fetch(`${API_BASE}/contacts/${contactId}/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: text })
        });

        if (!response.ok) throw new Error('Failed to add task');

        input.value = '';
        await loadData();
    } catch (error) {
        console.error('Error adding task:', error);
    }
}

async function toggleTask(contactId, taskId) {
    try {
        const response = await fetch(`${API_BASE}/contacts/${contactId}/tasks/${taskId}/toggle`, {
            method: 'PUT'
        });

        if (!response.ok) throw new Error('Failed to toggle task');

        // Optimistic UI update or reload
        await loadData();
    } catch (error) {
        console.error('Error toggling task:', error);
    }
}

async function deleteTask(contactId, taskId) {
    try {
        const response = await fetch(`${API_BASE}/contacts/${contactId}/tasks/${taskId}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete task');

        await loadData();
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

// Search
function handleSearch(query) {
    query = query.toLowerCase();

    // Filter Jobs
    if (state.currentTab === 'jobs') {
        const filteredJobs = state.jobs.filter(job =>
            (job.company && job.company.toLowerCase().includes(query)) ||
            (job.position && job.position.toLowerCase().includes(query)) ||
            (job.status && job.status.toLowerCase().includes(query))
        );
        renderFilteredJobs(filteredJobs);
    }
    // Filter Contacts
    else if (state.currentTab === 'network') {
        const filteredContacts = state.contacts.filter(contact =>
            (contact.name && contact.name.toLowerCase().includes(query)) ||
            (contact.company && contact.company.toLowerCase().includes(query)) ||
            (contact.role && contact.role.toLowerCase().includes(query))
        );
        renderFilteredContacts(filteredContacts);
    }
    // Filter Companies
    else {
        const filteredCompanies = state.companies.filter(company =>
            (company.name && company.name.toLowerCase().includes(query)) ||
            (company.notes && company.notes.toLowerCase().includes(query))
        );
        renderFilteredCompanies(filteredCompanies);
    }
}

function renderFilteredJobs(jobs) {
    const grid = document.getElementById('jobs-grid');
    grid.innerHTML = '';

    if (jobs.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 2rem;">No jobs found.</div>';
        return;
    }

    jobs.forEach((job, index) => {
        // ... (Reuse the rendering logic or refactor renderJobs to accept data)
        // For simplicity, let's just refactor renderJobs to take an optional argument
        // But since I can't easily change the previous function signature in this replace block without changing the whole file,
        // I'll just Duplicate the card creation logic here for now, or better yet, update renderJobs to handle this.
        // Let's go with updating renderJobs in a subsequent call or doing it right here.
        // Actually, let's just manually render here to be safe and quick.
        const card = document.createElement('div');
        card.className = 'card glass-panel';
        card.style.animationDelay = `${index * 0.1}s`;
        card.innerHTML = `
            <div class="card-header">
                <div>
                    <h3 class="card-title">${escapeHtml(job.company)}</h3>
                    <div class="card-subtitle">${escapeHtml(job.position)}</div>
                </div>
                <span class="status-badge ${getStatusClass(job.status)}">${job.status}</span>
            </div>
            <div class="card-body">
                <div class="info-row"><i class="fa-solid fa-location-dot"></i> ${escapeHtml(job.location || 'Remote')}</div>
                <div class="info-row"><i class="fa-regular fa-calendar"></i> ${formatDate(job.dateApplied)}</div>
                ${job.contactId ? `<div class="info-row"><i class="fa-solid fa-user-tag"></i> Referred by ${getContactName(job.contactId)}</div>` : ''}
            </div>
            <div class="card-actions">
                <button class="btn-icon" onclick="editItem('job', '${job.id}')"><i class="fa-solid fa-pen"></i></button>
                <button class="btn-icon" onclick="deleteItem('job', '${job.id}')"><i class="fa-solid fa-trash"></i></button>
                <a href="${job.url}" target="_blank" class="btn-icon" ${!job.url ? 'style="display:none"' : ''}><i class="fa-solid fa-external-link-alt"></i></a>
            </div>
        `;
        grid.appendChild(card);
    });
}

function renderFilteredContacts(contacts) {
    const grid = document.getElementById('contacts-grid');
    grid.innerHTML = '';

    if (contacts.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 2rem;">No contacts found.</div>';
        return;
    }

    contacts.forEach((contact, index) => {
        const card = document.createElement('div');
        card.className = 'card glass-panel';
        card.style.animationDelay = `${index * 0.1}s`;
        card.innerHTML = `
            <div class="card-header">
                <div>
                    <h3 class="card-title">${escapeHtml(contact.name)}</h3>
                    <div class="card-subtitle">${escapeHtml(contact.role)} @ ${escapeHtml(contact.company)}</div>
                </div>
                <button class="btn-icon" onclick="window.open('${contact.linkedin}', '_blank')" ${!contact.linkedin ? 'disabled' : ''}>
                    <i class="fa-brands fa-linkedin" style="color: #0077b5; font-size: 1.2rem;"></i>
                </button>
            </div>
            <div class="card-body">
                <div class="info-row"><i class="fa-solid fa-handshake"></i> ${escapeHtml(contact.relationship || 'Connection')}</div>
                <div class="info-row"><i class="fa-solid fa-bolt"></i> referral: ${contact.referralStatus || 'None'}</div>
                <div class="info-row"><i class="fa-solid fa-envelope"></i> outreach: ${contact.outreachStatus || 'Not Contacted'}</div>
            </div>
            <div class="card-actions">
                <button class="btn-icon" onclick="editItem('contact', '${contact.id}')"><i class="fa-solid fa-pen"></i></button>
                <button class="btn-icon" onclick="deleteItem('contact', '${contact.id}')"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
        grid.appendChild(card);
    });
}


function renderFilteredCompanies(companies) {
    const grid = document.getElementById('companies-grid');
    grid.innerHTML = '';

    if (companies.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 2rem;">No companies found.</div>';
        return;
    }

    companies.forEach((company, index) => {
        const card = document.createElement('div');
        card.className = 'card glass-panel';
        card.style.animationDelay = `${index * 0.1}s`;
        card.innerHTML = `
            <div class="card-header">
                <div>
                    <h3 class="card-title">${escapeHtml(company.name)}</h3>
                </div>
                <a href="${company.url}" target="_blank" class="btn-icon" ${!company.url ? 'style="display:none"' : ''}>
                    <i class="fa-solid fa-external-link-alt"></i>
                </a>
            </div>
            <div class="card-body">
                <div class="info-row">${escapeHtml(company.notes || 'No notes.')}</div>
            </div>
            <div class="card-actions">
                <button class="btn-icon" onclick="editItem('company', '${company.id}')"><i class="fa-solid fa-pen"></i></button>
                <button class="btn-icon" onclick="deleteItem('company', '${company.id}')"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
        grid.appendChild(card);
    });
}


