* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    --primary: #6366f1;
    --primary-dark: #4f46e5;
    --secondary: #ec4899;
    --success: #10b981;
    --warning: #f59e0b;
    --danger: #ef4444;
    --bg-dark: #0f172a;
    --bg-light: #1e293b;
    --bg-card: rgba(30, 41, 59, 0.6);
    --text-primary: #f1f5f9;
    --text-secondary: #cbd5e1;
    --border: rgba(148, 163, 184, 0.1);
    --shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    --gradient-1: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --gradient-2: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    --gradient-3: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    --gradient-4: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

body {
    font-family: 'Poppins', sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
    background-attachment: fixed;
    color: var(--text-primary);
    line-height: 1.6;
    min-height: 100vh;
}

body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="%23ffffff" fill-opacity="0.05" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,101.3C1248,85,1344,75,1392,69.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>') repeat;
    pointer-events: none;
    z-index: 0;
}

.app-container {
    position: relative;
    z-index: 1;
}

.header {
    text-align: center;
    padding: 3rem 1rem 2rem;
    background: rgba(15, 23, 42, 0.3);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
}

.logo {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 0.5rem;
}

.logo-icon {
    font-size: 3rem;
    animation: float 3s ease-in-out infinite;
}

@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
}

.logo h1 {
    font-size: 2.5rem;
    font-weight: 700;
    background: linear-gradient(135deg, #fff 0%, #c084fc 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.tagline {
    font-size: 1.1rem;
    color: var(--text-secondary);
    font-weight: 300;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
}

.card {
    background: var(--bg-card);
    backdrop-filter: blur(20px);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 2rem;
    margin-bottom: 2rem;
    box-shadow: var(--shadow);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
}

.section-title {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

/* Mode Selector */
.mode-selector {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
}

.mode-btn {
    background: rgba(255, 255, 255, 0.05);
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 15px;
    padding: 1.5rem 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-primary);
    font-family: 'Poppins', sans-serif;
}

.mode-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: scale(1.05);
}

.mode-btn.active {
    background: var(--gradient-1);
    border-color: transparent;
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
}

.mode-icon {
    font-size: 2rem;
}

.mode-name {
    font-weight: 600;
    font-size: 1.1rem;
}

.mode-desc {
    font-size: 0.85rem;
    opacity: 0.8;
}

/* Subject Container */
.subject-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 15px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    position: relative;
}

.subject-header {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    align-items: center;
}

.input-group {
    flex: 1;
}

.input-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    color: var(--text-secondary);
    font-weight: 500;
}

.input-field {
    width: 100%;
    padding: 0.75rem 1rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    color: var(--text-primary);
    font-family: 'Poppins', sans-serif;
    font-size: 1rem;
    transition: all 0.3s ease;
}

.input-field:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.08);
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.remove-btn {
    background: var(--danger);
    border: none;
    color: white;
    width: 40px;
    height: 40px;
    border-radius: 10px;
    cursor: pointer;
    font-size: 1.2rem;
    transition: all 0.3s ease;
    margin-top: 1.8rem;
}

.remove-btn:hover {
    background: #dc2626;
    transform: scale(1.1);
}

.chapters-container {
    margin-top: 1rem;
    padding-left: 1rem;
    border-left: 3px solid rgba(99, 102, 241, 0.3);
}

.chapter-card {
    background: rgba(255, 255, 255, 0.02);
    border-radius: 10px;
    padding: 1rem;
    margin-bottom: 1rem;
}

.topics-container {
    margin-top: 1rem;
    padding-left: 1rem;
}

.topic-item {
    display: flex;
    gap: 1rem;
    align-items: center;
    margin-bottom: 0.75rem;
}

.topic-item .input-field {
    flex: 1;
}

.time-select {
    width: 180px;
    padding: 0.75rem 1rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    color: var(--text-primary);
    font-family: 'Poppins', sans-serif;
    cursor: pointer;
}

.time-select:focus {
    outline: none;
    border-color: var(--primary);
}

.add-btn {
    background: var(--gradient-1);
    border: none;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 10px;
    cursor: pointer;
    font-family: 'Poppins', sans-serif;
    font-size: 1rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
    margin-top: 1rem;
}

.add-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(99, 102, 241, 0.4);
}

.add-btn span {
    font-size: 1.2rem;
}

/* Personal Instructions */
.personal-textarea {
    width: 100%;
    min-height: 120px;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    color: var(--text-primary);
    font-family: 'Poppins', sans-serif;
    font-size: 1rem;
    resize: vertical;
    transition: all 0.3s ease;
}

.personal-textarea:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.08);
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

/* Date Grid */
.date-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
}

.date-input-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
}

.date-input {
    width: 100%;
    padding: 0.75rem 1rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    color: var(--text-primary);
    font-family: 'Poppins', sans-serif;
    font-size: 1rem;
    cursor: pointer;
}

.date-input:focus {
    outline: none;
    border-color: var(--primary);
}

/* Hours Selector */
.hours-selector {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1rem;
}

.hour-btn {
    background: rgba(255, 255, 255, 0.05);
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    padding: 1rem;
    cursor: pointer;
    color: var(--text-primary);
    font-family: 'Poppins', sans-serif;
    font-size: 1rem;
    font-weight: 500;
    transition: all 0.3s ease;
}

.hour-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: scale(1.05);
}

.hour-btn.active {
    background: var(--gradient-3);
    border-color: transparent;
    box-shadow: 0 10px 30px rgba(79, 172, 254, 0.4);
}

/* Revision Selector */
.revision-selector {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1rem;
}

.revision-btn {
    background: rgba(255, 255, 255, 0.05);
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    padding: 1rem;
    cursor: pointer;
    color: var(--text-primary);
    font-family: 'Poppins', sans-serif;
    font-size: 1rem;
    font-weight: 500;
    transition: all 0.3s ease;
}

.revision-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: scale(1.05);
}

.revision-btn.active {
    background: var(--gradient-4);
    border-color: transparent;
    box-shadow: 0 10px 30px rgba(67, 233, 123, 0.4);
}

/* Generate Button */
.generate-btn {
    width: 100%;
    background: var(--gradient-2);
    border: none;
    color: white;
    padding: 1.5rem 2rem;
    border-radius: 15px;
    cursor: pointer;
    font-family: 'Poppins', sans-serif;
    font-size: 1.3rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    transition: all 0.3s ease;
    margin-top: 2rem;
    box-shadow: 0 15px 40px rgba(245, 87, 108, 0.4);
}

.generate-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 20px 50px rgba(245, 87, 108, 0.5);
}

.btn-icon {
    font-size: 1.5rem;
}

/* Routine Section */
.routine-section {
    background: rgba(15, 23, 42, 0.3);
    backdrop-filter: blur(20px);
    min-height: 100vh;
    padding: 2rem 0;
}

.routine-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
}

.routine-main-title {
    font-size: 2.5rem;
    font-weight: 700;
    background: linear-gradient(135deg, #fff 0%, #c084fc 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 0.5rem;
}

.routine-subtitle {
    font-size: 1.1rem;
    color: var(--text-secondary);
}

.routine-actions {
    display: flex;
    gap: 1rem;
}

.action-btn {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 10px;
    cursor: pointer;
    font-family: 'Poppins', sans-serif;
    font-size: 1rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
}

.action-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
}

/* Progress Card */
.progress-card {
    background: var(--bg-card);
    backdrop-filter: blur(20px);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 2rem;
    margin-bottom: 2rem;
    box-shadow: var(--shadow);
}

.progress-info h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
}

.progress-stats {
    display: flex;
    gap: 2rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
}

.stat-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.stat-label {
    font-size: 0.9rem;
    color: var(--text-secondary);
}

.stat-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--primary);
}

.progress-bar-container {
    width: 100%;
    height: 20px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    overflow: hidden;
}

.progress-bar {
    height: 100%;
    background: var(--gradient-1);
    border-radius: 10px;
    transition: width 0.5s ease;
    width: 0%;
}

/* Routine Timeline */
.day-card {
    background: var(--bg-card);
    backdrop-filter: blur(20px);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 2rem;
    margin-bottom: 1.5rem;
    box-shadow: var(--shadow);
    transition: all 0.3s ease;
}

.day-card:hover {
    transform: translateX(5px);
    box-shadow: 0 15px 50px rgba(0, 0, 0, 0.4);
}

.day-card.revision-day {
    background: linear-gradient(135deg, rgba(67, 233, 123, 0.1) 0%, rgba(56, 249, 215, 0.1) 100%);
    border-color: rgba(67, 233, 123, 0.3);
}

.day-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border);
}

.day-date {
    font-size: 1.3rem;
    font-weight: 600;
}

.day-badge {
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 500;
}

.badge-revision {
    background: var(--gradient-4);
}

.badge-study {
    background: var(--gradient-1);
}

.tasks-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.task-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 10px;
    border-left: 4px solid var(--primary);
    transition: all 0.3s ease;
}

.task-item:hover {
    background: rgba(255, 255, 255, 0.05);
    transform: translateX(5px);
}

.task-item.completed {
    opacity: 0.6;
}

.task-checkbox {
    width: 24px;
    height: 24px;
    border: 2px solid var(--primary);
    border-radius: 6px;
    cursor: pointer;
    flex-shrink: 0;
    position: relative;
    transition: all 0.3s ease;
}

.task-checkbox.checked {
    background: var(--primary);
}

.task-checkbox.checked::after {
    content: '✓';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 1rem;
    font-weight: bold;
}

.task-info {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1rem;
}

.task-detail {
    display: flex;
    flex-direction: column;
}

.task-label {
    font-size: 0.8rem;
    color: var(--text-secondary);
    margin-bottom: 0.25rem;
}

.task-value {
    font-size: 1rem;
    font-weight: 500;
}

/* Loading Overlay */
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(15, 23, 42, 0.95);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

.loading-content {
    text-align: center;
}

.loader {
    width: 60px;
    height: 60px;
    border: 5px solid rgba(255, 255, 255, 0.1);
    border-top-color: var(--primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1.5rem;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.loading-text {
    font-size: 1.3rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
}

.loading-subtext {
    font-size: 1rem;
    color: var(--text-secondary);
}

/* Utility */
.hidden {
    display: none !important;
}

/* Responsive */
@media (max-width: 768px) {
    .logo h1 {
        font-size: 2rem;
    }
    
    .routine-main-title {
        font-size: 1.8rem;
    }
    
    .routine-header {
        flex-direction: column;
        align-items: flex-start;
    }
    
    .task-info {
        grid-template-columns: 1fr;
        gap: 0.5rem;
    }
    
    .mode-selector {
        grid-template-columns: 1fr;
    }
    
    .date-grid {
        grid-template-columns: 1fr;
    }
}
