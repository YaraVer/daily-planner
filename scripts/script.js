class DailyPlanner {
    constructor() {
        this.tasks = [];
        this.form = document.getElementById('taskForm');
        this.tasksList = document.getElementById('tasksList');
        this.taskTitleInput = document.getElementById('taskTitle');
        this.taskDescriptionInput = document.getElementById('taskDescription');
        
        this.init();
    }
    
    init() {
                this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTask();
        });
        
                this.loadTasks();
    }
    
    addTask() {
        const title = this.taskTitleInput.value.trim();
        const description = this.taskDescriptionInput.value.trim();
        
        if (!title) {
            this.showError('Пожалуйста, введите название задачи');
            return;
        }
        
        const task = {
            id: Date.now().toString(),
            title: title,
            description: description,
            createdAt: new Date().toLocaleString('ru-RU')
        };
        
        this.tasks.unshift(task); // Добавляем в начало массива
        this.saveTasks();
        this.renderTasks();
        this.clearForm();
    }
    
    deleteTask(taskId) {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.saveTasks();
        this.renderTasks();
    }
    
    renderTasks() {
        if (this.tasks.length === 0) {
            this.tasksList.innerHTML = '<p class="tasks__empty">Задачи отсутствуют. Добавьте первую задачу!</p>';
            return;
        }
        
        this.tasksList.innerHTML = this.tasks.map(task => `
            <div class="task-card" data-task-id="${task.id}">
                <h3 class="task-card__title">${this.escapeHtml(task.title)}</h3>
                ${task.description ? `<p class="task-card__description">${this.escapeHtml(task.description)}</p>` : ''}
                <div class="task-card__meta">
                    <small>Добавлено: ${task.createdAt}</small>
                </div>
                <button class="task-card__delete" onclick="planner.deleteTask('${task.id}')">
                    Удалить
                </button>
            </div>
        `).join('');
    }
    
    clearForm() {
        this.form.reset();
        this.taskTitleInput.focus();
    }
    
    showError(message) {
                alert(message);
    }
    
    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    
    saveTasks() {
        localStorage.setItem('dailyPlannerTasks', JSON.stringify(this.tasks));
    }
    
    loadTasks() {
        const savedTasks = localStorage.getItem('dailyPlannerTasks');
        if (savedTasks) {
            this.tasks = JSON.parse(savedTasks);
            this.renderTasks();
        }
    }
}
document.addEventListener('DOMContentLoaded', () => {
    window.planner = new DailyPlanner();
});