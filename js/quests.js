// Quest System
const Quests = {
    data: [],
    templates: [
        { id: 'q1', type: 'plant', cropId: 'carrot', target: 5, reward: 50, title: 'Plant 5 Carrots 🥕' },
        { id: 'q2', type: 'harvest', cropId: 'corn', target: 3, reward: 80, title: 'Harvest 3 Corn 🌽' },
        { id: 'q3', type: 'harvest', cropId: 'tomato', target: 5, reward: 150, title: 'Harvest 5 Tomatoes 🍅' }
    ],

    load() {
        this.data = Storage.load('quests', this.generateNewQuests());
    },

    save() {
        Storage.save('quests', this.data);
    },

    generateNewQuests() {
        // Deep copy templates
        return this.templates.map(t => ({...t, progress: 0, completed: false, claimed: false}));
    },

    checkProgress(type, amount, cropId = null) {
        let updated = false;
        this.data.forEach(q => {
            if (!q.completed && q.type === type && (q.cropId === cropId || !q.cropId)) {
                q.progress += amount;
                if (q.progress >= q.target) {
                    q.progress = q.target;
                    q.completed = true;
                }
                updated = true;
            }
        });
        if (updated) this.save();
    },

    render() {
        const list = document.getElementById('quests-list');
        list.innerHTML = '';
        
        let allClaimed = true;

        this.data.forEach(q => {
            if (!q.claimed) allClaimed = false;
            
            const div = document.createElement('div');
            div.className = 'list-item';
            
            let btnHTML = `<button class="btn-action" disabled>${q.progress}/${q.target}</button>`;
            if (q.completed && !q.claimed) {
                btnHTML = `<button class="btn-action" style="background:#4CAF50; color:white;" onclick="Quests.claim('${q.id}')">Claim</button>`;
            } else if (q.claimed) {
                btnHTML = `<button class="btn-action" disabled>Done ✅</button>`;
            }

            div.innerHTML = `
                <div class="item-info">
                    <h4>${q.title}</h4>
                    <p>Reward: ${q.reward} 💰</p>
                </div>
                ${btnHTML}
            `;
            list.appendChild(div);
        });

        if (allClaimed) {
            const resetBtn = document.createElement('button');
            resetBtn.className = 'btn-large';
            resetBtn.style.marginTop = '15px';
            resetBtn.style.width = '100%';
            resetBtn.textContent = 'Get New Quests';
            resetBtn.onclick = () => {
                this.data = this.generateNewQuests();
                this.save();
                this.render();
            };
            list.appendChild(resetBtn);
        }
    },

    claim(id) {
        const q = this.data.find(x => x.id === id);
        if (q && q.completed && !q.claimed) {
            q.claimed = true;
            Player.addCoins(q.reward);
            AudioSys.playLevelUp();
            this.save();
            this.render();
        }
    }
};
