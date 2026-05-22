// Global State
let appState = {
    mode: 'relaxed',
    dailyHours: 4,
    revisionDays: 1,
    subjects: [],
    routine: [],
    completedTasks: new Set()
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    addSubject(); // Add first subject by default
});

function initializeApp() {
    // Mode selector
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            appState.mode = e.currentTarget.dataset.mode;
        });
    });

    // Hours selector
    document.querySelectorAll('.hour-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.hour-btn').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            appState.dailyHours = parseInt(e.currentTarget.dataset.hours);
        });
    });

    // Revision selector
    document.querySelectorAll('.revision-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.revision-btn').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            appState.revisionDays = parseInt(e.currentTarget.dataset.days);
        });
    });

    // Set default dates
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    document.getElementById('startDate').value = formatDateTimeLocal(now);
    document.getElementById('endDate').value = formatDateTimeLocal(nextWeek);
}

function formatDateTimeLocal(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// Subject Management
let subjectCounter = 0;

function addSubject() {
    const container = document.getElementById('subjectsContainer');
    const subjectId = `subject-${subjectCounter++}`;
    
    const subjectCard = document.createElement('div');
    subjectCard.className = 'subject-card';
    subjectCard.id = subjectId;
    
    subjectCard.innerHTML = `
        <div class="subject-header">
            <div class="input-group">
                <label>📚 Subject Name</label>
                <input type="text" class="input-field subject-name" placeholder="e.g., Mathematics">
            </div>
            <button class="remove-btn" onclick="removeSubject('${subjectId}')">×</button>
        </div>
        <div class="chapters-container" id="${subjectId}-chapters"></div>
        <button class="add-btn" onclick="addChapter('${subjectId}')">
            <span>+</span> Add Chapter
        </button>
    `;
    
    container.appendChild(subjectCard);
}

function removeSubject(subjectId) {
    const element = document.getElementById(subjectId);
    if (element) {
        element.remove();
    }
}

let chapterCounter = 0;

function addChapter(subjectId) {
    const container = document.getElementById(`${subjectId}-chapters`);
    const chapterId = `chapter-${chapterCounter++}`;
    
    const chapterCard = document.createElement('div');
    chapterCard.className = 'chapter-card';
    chapterCard.id = chapterId;
    
    chapterCard.innerHTML = `
        <div class="subject-header">
            <div class="input-group">
                <label>📖 Chapter Name</label>
                <input type="text" class="input-field chapter-name" placeholder="e.g., Calculus">
            </div>
            <button class="remove-btn" onclick="removeChapter('${chapterId}')">×</button>
        </div>
        <div class="topics-container" id="${chapterId}-topics"></div>
        <button class="add-btn" onclick="addTopic('${chapterId}')">
            <span>+</span> Add Topic
        </button>
    `;
    
    container.appendChild(chapterCard);
}

function removeChapter(chapterId) {
    const element = document.getElementById(chapterId);
    if (element) {
        element.remove();
    }
}

let topicCounter = 0;

function addTopic(chapterId) {
    const container = document.getElementById(`${chapterId}-topics`);
    const topicId = `topic-${topicCounter++}`;
    
    const topicItem = document.createElement('div');
    topicItem.className = 'topic-item';
    topicItem.id = topicId;
    
    topicItem.innerHTML = `
        <input type="text" class="input-field topic-name" placeholder="Topic name">
        <select class="time-select topic-time">
            <option value="15">কম সময় (15-30 মিনিট)</option>
            <option value="45" selected>মধ্যম সময় (30-60 মিনিট)</option>
            <option value="90">বেশি সময় (1-2 ঘন্টা)</option>
        </select>
        <button class="remove-btn" onclick="removeTopic('${topicId}')">×</button>
    `;
    
    container.appendChild(topicItem);
}

function removeTopic(topicId) {
    const element = document.getElementById(topicId);
    if (element) {
        element.remove();
    }
}

// Collect Input Data
function collectInputData() {
    const data = {
        mode: appState.mode,
        dailyHours: appState.dailyHours,
        revisionDays: appState.revisionDays,
        personalInstructions: document.getElementById('personalInstructions').value,
        startDate: new Date(document.getElementById('startDate').value),
        endDate: new Date(document.getElementById('endDate').value),
        subjects: []
    };

    // Collect subjects
    document.querySelectorAll('.subject-card').forEach(subjectCard => {
        const subjectName = subjectCard.querySelector('.subject-name').value.trim();
        if (!subjectName) return;

        const subject = {
            name: subjectName,
            chapters: []
        };

        subjectCard.querySelectorAll('.chapter-card').forEach(chapterCard => {
            const chapterName = chapterCard.querySelector('.chapter-name').value.trim();
            if (!chapterName) return;

            const chapter = {
                name: chapterName,
                topics: []
            };

            chapterCard.querySelectorAll('.topic-item').forEach(topicItem => {
                const topicName = topicItem.querySelector('.topic-name').value.trim();
                const topicTime = parseInt(topicItem.querySelector('.topic-time').value);
                
                if (topicName) {
                    chapter.topics.push({
                        name: topicName,
                        estimatedTime: topicTime
                    });
                }
            });

            if (chapter.topics.length > 0) {
                subject.chapters.push(chapter);
            }
        });

        if (subject.chapters.length > 0) {
            data.subjects.push(subject);
        }
    });

    return data;
}

// Validate Input
function validateInput(data) {
    if (data.subjects.length === 0) {
        alert('Please add at least one subject with topics!');
        return false;
    }

    if (!data.startDate || !data.endDate) {
        alert('Please select start and end dates!');
        return false;
    }

    if (data.endDate <= data.startDate) {
        alert('End date must be after start date!');
        return false;
    }

    return true;
}

// Generate Routine
async function generateRoutine() {
    const data = collectInputData();
    
    if (!validateInput(data)) {
        return;
    }

    // Show loading
    document.getElementById('loadingOverlay').classList.remove('hidden');

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate routine using AI logic
    const routine = generateSmartRoutine(data);
    appState.routine = routine;

    // Hide loading
    document.getElementById('loadingOverlay').classList.add('hidden');

    // Display routine
    displayRoutine(routine, data);

    // Switch to routine view
    document.getElementById('inputSection').classList.add('hidden');
    document.getElementById('routineSection').classList.remove('hidden');
}

// Smart Routine Generation Algorithm
function generateSmartRoutine(data) {
    const routine = [];
    const tasks = [];

    // Flatten all topics into tasks
    data.subjects.forEach(subject => {
        subject.chapters.forEach(chapter => {
            chapter.topics.forEach(topic => {
                tasks.push({
                    subject: subject.name,
                    chapter: chapter.name,
                    topic: topic.name,
                    estimatedTime: topic.estimatedTime,
                    difficulty: getDifficulty(topic.estimatedTime),
                    completed: false
                });
            });
        });
    });

    // Calculate total study time needed
    const totalMinutes = tasks.reduce((sum, task) => sum + task.estimatedTime, 0);
    const totalDays = Math.ceil((data.endDate - data.startDate) / (1000 * 60 * 60 * 24));
    
    // Get study days (excluding revision days)
    const studyDays = getStudyDays(data.startDate, data.endDate, data.revisionDays);
    
    // Apply mode multiplier
    const modeMultipliers = {
        relaxed: 0.7,
        balanced: 1.0,
        extreme: 1.3
    };
    
    const effectiveDailyMinutes = data.dailyHours * 60 * modeMultipliers[data.mode];
    
    // Sort tasks by difficulty (hard topics spread evenly)
    tasks.sort((a, b) => b.difficulty - a.difficulty);
    
    // Distribute tasks across days
    let currentDate = new Date(data.startDate);
    let currentDayTasks = [];
    let currentDayTime = 0;
    let taskIndex = 0;
    let lastSubject = null;

    studyDays.forEach(studyDay => {
        const dayTasks = [];
        let dayTime = 0;

        // Fill the day with tasks
        while (dayTime < effectiveDailyMinutes && taskIndex < tasks.length) {
            const task = tasks[taskIndex];
            
            // Avoid same subject consecutively if possible
            if (lastSubject === task.subject && taskIndex < tasks.length - 1) {
                // Try to find different subject
                const nextDiffIndex = tasks.findIndex((t, i) => 
                    i > taskIndex && t.subject !== lastSubject && !t.assigned
                );
                
                if (nextDiffIndex !== -1 && dayTime + tasks[nextDiffIndex].estimatedTime <= effectiveDailyMinutes) {
                    const nextTask = tasks[nextDiffIndex];
                    dayTasks.push(nextTask);
                    dayTime += nextTask.estimatedTime;
                    lastSubject = nextTask.subject;
                    nextTask.assigned = true;
                    continue;
                }
            }

            if (dayTime + task.estimatedTime <= effectiveDailyMinutes * 1.2) { // Allow 20% overflow
                dayTasks.push(task);
                dayTime += task.estimatedTime;
                lastSubject = task.subject;
                task.assigned = true;
                taskIndex++;
            } else {
                break;
            }
        }

        if (dayTasks.length > 0) {
            routine.push({
                date: new Date(studyDay),
                type: 'study',
                tasks: dayTasks,
                totalTime: dayTime
            });
        }
    });

    // Mark remaining tasks if any
    if (taskIndex < tasks.length) {
        // Redistribute remaining tasks
        const remaining = tasks.slice(taskIndex);
        let routineIndex = 0;
        
        remaining.forEach(task => {
            if (routine[routineIndex]) {
                routine[routineIndex].tasks.push(task);
                routine[routineIndex].totalTime += task.estimatedTime;
                routineIndex = (routineIndex + 1) % routine.length;
            }
        });
    }

    return routine;
}

function getDifficulty(estimatedTime) {
    if (estimatedTime <= 30) return 1; // Easy
    if (estimatedTime <= 60) return 2; // Medium
    return 3; // Hard
}

function getStudyDays(startDate, endDate, revisionDaysPerWeek) {
    const days = [];
    let current = new Date(startDate);
    let weekDay = 0;
    
    while (current <= endDate) {
        // Check if it's a revision day
        const dayOfWeek = current.getDay();
        const isRevisionDay = (weekDay % 7 === 6 && revisionDaysPerWeek >= 1) ||
                             (weekDay % 7 === 5 && revisionDaysPerWeek >= 2) ||
                             (weekDay % 7 === 0 && revisionDaysPerWeek >= 3);
        
        if (!isRevisionDay) {
            days.push(new Date(current));
        } else {
            // Add revision day marker
            days.push({
                date: new Date(current),
                isRevision: true
            });
        }
        
        current.setDate(current.getDate() + 1);
        weekDay++;
    }
    
    return days.filter(d => !d.isRevision);
}

// Display Routine
function displayRoutine(routine, data) {
    const container = document.getElementById('routineTimeline');
    container.innerHTML = '';

    // Update subtitle
    const subtitle = document.getElementById('routineSubtitle');
    subtitle.textContent = `Target Deadline: ${formatDate(data.endDate)}`;

    // Calculate total tasks
    const totalTasks = routine.reduce((sum, day) => sum + day.tasks.length, 0);
    document.getElementById('totalTasks').textContent = totalTasks;
    document.getElementById('completedTasks').textContent = appState.completedTasks.size;
    updateProgress();

    // Create day cards
    routine.forEach((day, index) => {
        const dayCard = createDayCard(day, index);
        container.appendChild(dayCard);
    });
}

function createDayCard(day, index) {
    const card = document.createElement('div');
    card.className = 'day-card';
    if (day.type === 'revision') {
        card.classList.add('revision-day');
    }

    const isRevision = day.type === 'revision';

    card.innerHTML = `
        <div class="day-header">
            <div class="day-date">
                📅 ${formatDate(day.date)}
            </div>
            <div class="day-badge ${isRevision ? 'badge-revision' : 'badge-study'}">
                ${isRevision ? '🔄 Revision Day' : '📚 Study Day'}
            </div>
        </div>
        <div class="tasks-list" id="tasks-day-${index}">
            ${day.tasks.map((task, taskIndex) => createTaskHTML(task, index, taskIndex)).join('')}
        </div>
    `;

    return card;
}

function createTaskHTML(task, dayIndex, taskIndex) {
    const taskId = `task-${dayIndex}-${taskIndex}`;
    const isCompleted = appState.completedTasks.has(taskId);

    return `
        <div class="task-item ${isCompleted ? 'completed' : ''}" data-task-id="${taskId}">
            <div class="task-checkbox ${isCompleted ? 'checked' : ''}" onclick="toggleTask('${taskId}')"></div>
            <div class="task-info">
                <div class="task-detail">
                    <span class="task-label">Subject</span>
                    <span class="task-value">${task.subject}</span>
                </div>
                <div class="task-detail">
                    <span class="task-label">Chapter</span>
                    <span class="task-value">${task.chapter}</span>
                </div>
                <div class="task-detail">
                    <span class="task-label">Topic</span>
                    <span class="task-value">${task.topic}</span>
                </div>
            </div>
        </div>
    `;
}

function formatDate(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[d.getDay()];
    return `${dayName}, ${day}/${month}/${year}`;
}

// Task Toggle
function toggleTask(taskId) {
    if (appState.completedTasks.has(taskId)) {
        appState.completedTasks.delete(taskId);
    } else {
        appState.completedTasks.add(taskId);
    }

    // Update UI
    const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
    if (taskElement) {
        taskElement.classList.toggle('completed');
        const checkbox = taskElement.querySelector('.task-checkbox');
        checkbox.classList.toggle('checked');
    }

    // Update progress
    updateProgress();
}

function updateProgress() {
    const totalTasks = appState.routine.reduce((sum, day) => sum + day.tasks.length, 0);
    const completed = appState.completedTasks.size;
    const percentage = totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0;

    document.getElementById('completedTasks').textContent = completed;
    document.getElementById('totalTasks').textContent = totalTasks;
    document.getElementById('percentageComplete').textContent = `${percentage}%`;
    document.getElementById('progressBar').style.width = `${percentage}%`;
}

// Re-arrange Plan
function rearrangePlan() {
    // Get incomplete tasks
    const incompleteTasks = [];
    
    appState.routine.forEach((day, dayIndex) => {
        day.tasks.forEach((task, taskIndex) => {
            const taskId = `task-${dayIndex}-${taskIndex}`;
            if (!appState.completedTasks.has(taskId)) {
                incompleteTasks.push(task);
            }
        });
    });

    if (incompleteTasks.length === 0) {
        alert('Congratulations! All tasks are completed! 🎉');
        return;
    }

    // Redistribute incomplete tasks
    const data = {
        ...collectInputData(),
        startDate: new Date() // Start from today
    };

    // Create new routine with incomplete tasks
    const newRoutine = [];
    const studyDays = getStudyDays(data.startDate, data.endDate, data.revisionDays);
    const effectiveDailyMinutes = data.dailyHours * 60;
    
    let taskIndex = 0;
    studyDays.forEach(studyDay => {
        const dayTasks = [];
        let dayTime = 0;

        while (dayTime < effectiveDailyMinutes && taskIndex < incompleteTasks.length) {
            const task = incompleteTasks[taskIndex];
            if (dayTime + task.estimatedTime <= effectiveDailyMinutes * 1.2) {
                dayTasks.push(task);
                dayTime += task.estimatedTime;
                taskIndex++;
            } else {
                break;
            }
        }

        if (dayTasks.length > 0) {
            newRoutine.push({
                date: new Date(studyDay),
                type: 'study',
                tasks: dayTasks,
                totalTime: dayTime
            });
        }
    });

    appState.routine = newRoutine;
    appState.completedTasks.clear();

    // Re-display
    displayRoutine(newRoutine, data);

    alert('Routine has been rearranged with incomplete tasks! 🔄');
}

// Back to Input
function backToInput() {
    document.getElementById('routineSection').classList.add('hidden');
    document.getElementById('inputSection').classList.remove('hidden');
}
