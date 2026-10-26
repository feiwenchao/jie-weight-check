// data.js
if (!localStorage.getItem('playerData')) {
    const initData = {
        treasures: 500,
        cards: { low: 3, mid: 1, high: 1 },
        cardExpiry: {}
    };
    localStorage.setItem('playerData', JSON.stringify(initData));
}

function getPlayer() { return JSON.parse(localStorage.getItem('playerData')); }
function savePlayer(data) { localStorage.setItem('playerData', JSON.stringify(data)); }
function generateRacerName() { return `赛车手${Math.floor(10000000 + Math.random() * 90000000)}`; }
if (!localStorage.getItem('myRacerName')) localStorage.setItem('myRacerName', generateRacerName());
function getMyName() { return localStorage.getItem('myRacerName'); }

// 记录管理
function getHistory() {
    let history = localStorage.getItem('matchHistory');
    return history ? JSON.parse(history) : [];
}

function addOngoingHistory(roomInfo) {
    let history = getHistory();
    history = history.filter(item => item.status !== '正在进行中');
    
    history.unshift({
        time: new Date().toLocaleString('zh-CN', { hour12: false }),
        roomId: roomInfo.id,
        level: roomInfo.level,
        // ⚠️ 新增核心字段：开赛时间
        startTime: roomInfo.startTime || null, 
        rank: '-',
        rewardText: '等待结算...',
        status: '正在进行中',
        allPlayers: []
    });
    localStorage.setItem('matchHistory', JSON.stringify(history));
}

function completeOngoingHistory(rank, rewardText, allPlayersList) {
    let history = getHistory();
    for (let i = 0; i < history.length; i++) {
        if (history[i].status === '正在进行中') {
            history[i].rank = rank;
            history[i].rewardText = rewardText;
            history[i].status = '已完成';
            history[i].allPlayers = allPlayersList;
            break;
        }
    }
    localStorage.setItem('matchHistory', JSON.stringify(history));
}

// ⚠️ 新增：更新历史记录里的开赛时间
function updateHistoryStartTime(startTime) {
    let history = getHistory();
    for (let i = 0; i < history.length; i++) {
        if (history[i].status === '正在进行中') {
            history[i].startTime = startTime;
            break;
        }
    }
    localStorage.setItem('matchHistory', JSON.stringify(history));
}
