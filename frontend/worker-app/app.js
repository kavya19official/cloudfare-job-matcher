class SkillSyncApp {
    constructor() {
        this.isRecording = false;
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.initializeAudio();
    }

    bindEvents() {
        // Voice recording
        document.getElementById('recordBtn').addEventListener('click', () => this.toggleRecording());
        
        // Submit button
        document.getElementById('submitBtn').addEventListener('click', () => this.handleSubmit());
        
        // Action buttons
        document.getElementById('tryAgainBtn').addEventListener('click', () => this.resetForm());
        document.getElementById('saveProfileBtn').addEventListener('click', () => this.saveProfile());
    }

    async initializeAudio() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(stream);
            
            this.mediaRecorder.ondataavailable = (event) => {
                this.audioChunks.push(event.data);
            };
            
            this.mediaRecorder.onstop = () => {
                const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
                this.audioChunks = [];
                this.processAudio(audioBlob);
            };
        } catch (error) {
            console.log('Audio not available:', error);
            this.showToast('Microphone access denied. Please use text input.', 'warning');
        }
    }

    toggleRecording() {
        if (!this.mediaRecorder) {
            this.showToast('Microphone not available. Please use text input.', 'error');
            return;
        }

        if (this.isRecording) {
            this.stopRecording();
        } else {
            this.startRecording();
        }
    }

    startRecording() {
        this.isRecording = true;
        this.mediaRecorder.start();
        
        const recordBtn = document.getElementById('recordBtn');
        const micIcon = document.getElementById('micIcon');
        const recordText = document.getElementById('recordText');
        const recordingStatus = document.getElementById('recordingStatus');
        const audioVisualizer = document.getElementById('audioVisualizer');
        
        recordBtn.classList.add('recording');
        micIcon.className = 'fas fa-stop';
        recordText.textContent = 'Stop Recording';
        recordingStatus.classList.add('active');
        audioVisualizer.classList.add('active');
        
        // Clear any existing text input
        document.getElementById('skillsText').value = '';
    }

    stopRecording() {
        this.isRecording = false;
        this.mediaRecorder.stop();
        
        const recordBtn = document.getElementById('recordBtn');
        const micIcon = document.getElementById('micIcon');
        const recordText = document.getElementById('recordText');
        const recordingStatus = document.getElementById('recordingStatus');
        const audioVisualizer = document.getElementById('audioVisualizer');
        
        recordBtn.classList.remove('recording');
        micIcon.className = 'fas fa-microphone';
        recordText.textContent = 'Start Recording';
        recordingStatus.classList.remove('active');
        audioVisualizer.classList.remove('active');
    }

    async processAudio(audioBlob) {
        // For demo purposes, simulate audio processing
        this.showToast('Audio recorded successfully!', 'success');
        
        // In a real implementation, you would send the audio to your backend
        // const formData = new FormData();
        // formData.append('audio', audioBlob);
        // const response = await fetch('/api/process-audio', { method: 'POST', body: formData });
    }

    async handleSubmit() {
        const textInput = document.getElementById('skillsText').value.trim();
        
        if (!textInput && !this.audioChunks.length) {
            this.showToast('Please provide your skills via voice or text input.', 'error');
            return;
        }
        
        this.showLoading();
        
        try {
            // Simulate API call delay
            await this.delay(2000);
            
            // For demo, use text input or generate fake skills
            const skillsData = textInput || this.generateDemoText();
            
            const skills = await this.analyzeSkills(skillsData);
            const jobs = await this.matchJobs(skills);
            
            this.displayResults(skills, jobs);
            
        } catch (error) {
            console.error('Error processing skills:', error);
            this.showToast('Error processing your skills. Please try again.', 'error');
            this.hideLoading();
        }
    }

    async analyzeSkills(inputText) {
        // Simulate AI skill analysis
        this.updateLoadingText('Analyzing your skills with AI...');
        await this.delay(1500);
        
        // For demo purposes, extract skills from common keywords
        const skillKeywords = {
            'javascript': { confidence: 85, category: 'Programming' },
            'react': { confidence: 80, category: 'Frontend' },
            'node': { confidence: 75, category: 'Backend' },
            'python': { confidence: 70, category: 'Programming' },
            'sql': { confidence: 65, category: 'Database' },
            'aws': { confidence: 60, category: 'Cloud' },
            'docker': { confidence: 55, category: 'DevOps' },
            'git': { confidence: 90, category: 'Tools' },
            'api': { confidence: 70, category: 'Backend' },
            'database': { confidence: 65, category: 'Database' },
            'web development': { confidence: 85, category: 'Programming' },
            'frontend': { confidence: 80, category: 'Frontend' },
            'backend': { confidence: 75, category: 'Backend' },
            'full stack': { confidence: 85, category: 'Programming' },
            'management': { confidence: 70, category: 'Leadership' },
            'team lead': { confidence: 75, category: 'Leadership' },
            'project management': { confidence: 80, category: 'Management' },
            'agile': { confidence: 70, category: 'Methodology' },
            'scrum': { confidence: 65, category: 'Methodology' }
        };
        
        const detectedSkills = [];
        const lowerInput = inputText.toLowerCase();
        
        for (const [skill, data] of Object.entries(skillKeywords)) {
            if (lowerInput.includes(skill)) {
                detectedSkills.push({
                    name: this.capitalizeWords(skill),
                    confidence: data.confidence + Math.random() * 20 - 10, // Add some randomness
                    category: data.category
                });
            }
        }
        
        // Add some default skills if none detected
        if (detectedSkills.length === 0) {
            detectedSkills.push(
                { name: 'Problem Solving', confidence: 85, category: 'Soft Skills' },
                { name: 'Communication', confidence: 80, category: 'Soft Skills' },
                { name: 'Teamwork', confidence: 75, category: 'Soft Skills' },
                { name: 'Time Management', confidence: 70, category: 'Soft Skills' }
            );
        }
        
        return detectedSkills;
    }

    async matchJobs(skills) {
        this.updateLoadingText('Finding perfect job matches...');
        await this.delay(1500);
        
        // Demo job data
        const availableJobs = [
            {
                id: 1,
                title: 'Senior Frontend Developer',
                company: 'TechCorp Inc.',
                location: 'San Francisco, CA',
                type: 'Full-time',
                salary: '$120k - $160k',
                match: 92,
                description: 'Join our innovative team building next-generation web applications. We\'re looking for a skilled developer with strong React experience.',
                requiredSkills: ['React', 'JavaScript', 'TypeScript', 'CSS', 'Git'],
                remote: true
            },
            {
                id: 2,
                title: 'Full Stack Engineer',
                company: 'StartupXYZ',
                location: 'Austin, TX',
                type: 'Full-time',
                salary: '$100k - $140k',
                match: 88,
                description: 'Build scalable web applications from frontend to backend. Perfect opportunity to work with cutting-edge technologies.',
                requiredSkills: ['Node.js', 'React', 'SQL', 'AWS', 'Docker'],
                remote: false
            },
            {
                id: 3,
                title: 'JavaScript Developer',
                company: 'WebSolutions LLC',
                location: 'Remote',
                type: 'Contract',
                salary: '$80/hour',
                match: 85,
                description: 'Work on exciting client projects with flexible hours. Strong JavaScript skills required.',
                requiredSkills: ['JavaScript', 'API Development', 'Git', 'Problem Solving'],
                remote: true
            },
            {
                id: 4,
                title: 'Team Lead - Web Development',
                company: 'Enterprise Corp',
                location: 'New York, NY',
                type: 'Full-time',
                salary: '$140k - $180k',
                match: 79,
                description: 'Lead a team of talented developers while contributing to architecture decisions. Management experience preferred.',
                requiredSkills: ['Team Leadership', 'Project Management', 'Web Development', 'Agile'],
                remote: false
            }
        ];
        
        // Sort by match score and return top matches
        return availableJobs
            .sort((a, b) => b.match - a.match)
            .slice(0, 4);
    }

    displayResults(skills, jobs) {
        this.hideLoading();
        
        // Show results section
        document.getElementById('onboardingSection').style.display = 'none';
        document.getElementById('resultsSection').style.display = 'block';
        
        // Display skills
        this.displaySkills(skills);
        
        // Display jobs
        this.displayJobs(jobs);
        
        // Scroll to results
        document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
    }

    displaySkills(skills) {
        const skillsGrid = document.getElementById('skillsGrid');
        skillsGrid.innerHTML = '';
        
        skills.forEach((skill, index) => {
            const skillElement = document.createElement('div');
            skillElement.className = 'skill-item';
            skillElement.innerHTML = `
                <div class="skill-name">${skill.name}</div>
                <div class="skill-confidence">${Math.round(skill.confidence)}% confidence</div>
                <div class="confidence-bar">
                    <div class="confidence-fill" style="width: 0%"></div>
                </div>
            `;
            skillsGrid.appendChild(skillElement);
            
            // Animate confidence bar
            setTimeout(() => {
                const fill = skillElement.querySelector('.confidence-fill');
                fill.style.width = `${skill.confidence}%`;
            }, index * 100);
        });
    }

    displayJobs(jobs) {
        const jobsContainer = document.getElementById('jobsContainer');
        jobsContainer.innerHTML = '';
        
        jobs.forEach(job => {
            const jobElement = document.createElement('div');
            jobElement.className = 'job-card';
            jobElement.innerHTML = `
                <div class="job-header">
                    <div>
                        <div class="job-title">${job.title}</div>
                        <div class="job-company">${job.company}</div>
                    </div>
                    <div class="match-score">${job.match}% match</div>
                </div>
                <div class="job-details">
                    <div class="job-detail">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${job.location}</span>
                    </div>
                    <div class="job-detail">
                        <i class="fas fa-clock"></i>
                        <span>${job.type}</span>
                    </div>
                    <div class="job-detail">
                        <i class="fas fa-dollar-sign"></i>
                        <span>${job.salary}</span>
                    </div>
                    <div class="job-detail">
                        <i class="fas fa-${job.remote ? 'home' : 'building'}"></i>
                        <span>${job.remote ? 'Remote' : 'On-site'}</span>
                    </div>
                </div>
                <div class="job-description">${job.description}</div>
                <div class="job-skills">
                    ${job.requiredSkills.map(skill => `<span class="job-skill">${skill}</span>`).join('')}
                </div>
            `;
            
            jobElement.addEventListener('click', () => this.showJobDetails(job));
            jobsContainer.appendChild(jobElement);
        });
    }

    showJobDetails(job) {
        this.showToast(`Opening application for ${job.title} at ${job.company}`, 'info');
        // In a real app, this would open a job application modal or redirect
    }

    resetForm() {
        document.getElementById('onboardingSection').style.display = 'block';
        document.getElementById('resultsSection').style.display = 'none';
        document.getElementById('skillsText').value = '';
        document.getElementById('onboardingSection').scrollIntoView({ behavior: 'smooth' });
    }

    saveProfile() {
        this.showToast('Profile saved successfully! You will receive job notifications.', 'success');
        // In a real app, this would save to backend
    }

    showLoading() {
        document.getElementById('onboardingSection').style.display = 'none';
        document.getElementById('loadingSection').style.display = 'block';
    }

    hideLoading() {
        document.getElementById('loadingSection').style.display = 'none';
    }

    updateLoadingText(text) {
        document.getElementById('loadingText').textContent = text;
    }

    generateDemoText() {
        const demoTexts = [
            "I have 5 years of experience in web development with strong skills in JavaScript, React, and Node.js. I've worked on e-commerce platforms and have experience with database design and API development.",
            "I'm a full-stack developer with expertise in modern web technologies. I have experience with Python, SQL, and cloud services like AWS. I enjoy working in agile environments and have some team leadership experience.",
            "I specialize in frontend development with React and have worked on mobile-responsive applications. I also have experience with backend APIs, Git version control, and project management."
        ];
        return demoTexts[Math.floor(Math.random() * demoTexts.length)];
    }

    showToast(message, type = 'info') {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        // Add toast styles
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--danger)' : type === 'warning' ? 'var(--warning)' : 'var(--primary)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 10);
        
        // Remove after 4 seconds
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    capitalizeWords(str) {
        return str.split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    new SkillSyncApp();
});