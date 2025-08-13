document.addEventListener('DOMContentLoaded', () => {
    // Page Navigation
    window.showPage = function(pageId) {
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        document.querySelectorAll('.nav-button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(pageId).classList.add('active');
        event.target.classList.add('active');
    };

    // Enrollment Logic
    const enrollButtons = {
        'enroll-python': { xp: '+100 XP' },
        'enroll-web': { xp: '+150 XP' }
    };

    Object.keys(enrollButtons).forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            console.log(`Found enroll button: ${id}`);
            btn.addEventListener('click', () => {
                console.log(`Enroll button clicked: ${id}`);
                btn.textContent = 'Enrolled!';
                btn.style.background = 'linear-gradient(45deg, #2ecc71, #27ae60)';
                btn.disabled = true;
                const card = btn.previousElementSibling;
                const xp = card.querySelector('.xp-reward');
                xp.style.display = 'block';
                setTimeout(() => {
                    xp.style.opacity = '0';
                    xp.style.transform = 'translateY(-20px)';
                }, 1000);

                // Update Profile Card Stats and Learning Path
                const totalXp = document.getElementById('total-xp');
                const coursesEnrolled = document.getElementById('courses-enrolled');
                totalXp.textContent = parseInt(totalXp.textContent) + parseInt(enrollButtons[id].xp.replace('+', '').replace(' XP', ''));
                coursesEnrolled.textContent = parseInt(coursesEnrolled.textContent) + 1;
                updateLearningPath();
                updateBadges();
            });
        } else {
            console.error(`Button not found: ${id}`);
        }
    });

    // Quiz Logic
    window.checkAnswer = function(button, correctAnswer) {
        const answer = button.textContent;
        if (answer === correctAnswer) {
            button.classList.add('correct');
            alert('Correct! +10 XP');
            let quizzesCompleted = parseInt(localStorage.getItem('quizzesCompleted') || '0');
            quizzesCompleted += 1;
            localStorage.setItem('quizzesCompleted', quizzesCompleted);
            updateBadges();
        } else {
            button.classList.add('incorrect');
            alert('Wrong! Try again.');
        }
        button.disabled = true;
    };

    // Dark Mode
    window.toggleDarkMode = function() {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    };

    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }

    // Progress Bar Animation
    document.querySelectorAll('.progress-fill').forEach(bar => {
        const targetWidth = bar.dataset.percentage + '%';
        bar.style.width = '0';
        setTimeout(() => {
            bar.style.width = targetWidth;
        }, 500);
    });

    // Particle Background
    const particles = document.getElementById('particles');
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = Math.random() * 100 + 'vh';
        particle.style.animationDuration = Math.random() * 5 + 5 + 's';
        particles.appendChild(particle);
    }

    // Learning Path Logic
    function updateLearningPath() {
        const coursesEnrolled = parseInt(document.getElementById('courses-enrolled').textContent);
        const milestones = [
            { id: 'milestone-1', threshold: 0 },
            { id: 'milestone-2', threshold: 1 },
            { id: 'milestone-3', threshold: 2 }
        ];

        milestones.forEach((milestone, index) => {
            const element = document.getElementById(milestone.id);
            if (coursesEnrolled >= milestone.threshold) {
                element.classList.add('unlocked');
                if (index > 0) {
                    element.previousElementSibling.classList.add('active');
                }
            }
        });
    }

    // Badges System
    const badges = [
        { id: 'badge-enroller', icon: '🎓', name: 'Enroller', threshold: 1, type: 'enrollment' },
        { id: 'badge-quiz', icon: '🧠', name: 'Quiz Whiz', threshold: 1, type: 'quiz' },
        { id: 'badge-master', icon: '🏆', name: 'Course Master', threshold: 2, type: 'enrollment' }
    ];

    function initializeBadges() {
        const badgesList = document.getElementById('badges-list');
        badges.forEach(badge => {
            const badgeElement = document.createElement('div');
            badgeElement.id = badge.id;
            badgeElement.className = 'badge';
            badgeElement.innerHTML = `
                <span class="badge-icon">${badge.icon}</span>
                <p>${badge.name}</p>
            `;
            badgesList.appendChild(badgeElement);
        });
        updateBadges();
    }

    function updateBadges() {
        const coursesEnrolled = parseInt(document.getElementById('courses-enrolled').textContent);
        const quizzesCompleted = parseInt(localStorage.getItem('quizzesCompleted') || '0');
        badges.forEach(badge => {
            const badgeElement = document.getElementById(badge.id);
            const progress = badge.type === 'enrollment' ? coursesEnrolled : quizzesCompleted;
            if (progress >= badge.threshold) {
                badgeElement.classList.add('unlocked');
            }
        });
    }

    // Initialize on load
    updateLearningPath();
    initializeBadges();
});