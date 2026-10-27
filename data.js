// data.js
const TICKET_RATE = 0.21; // 1券 = 0.21秘宝

if (!localStorage.getItem('playerData')) {
    const initData = {
        treasures: 500,
        tickets: 0, // 通兑券
        taskProgress: 0, // 解卡任务进度
        // 房卡分类：分为购买的 permanent（永久，但周一清零）和 赢来的 temp（48小时）
        cards: { 
            low: { perm: 3, temp: [] }, 
            mid: { perm: 1, temp: [] }, 
            high: { perm: 1, temp: [] } 
        }
    };
    localStorage.setItem('playerData', JSON.stringify(initData));
}

function getPlayer() { return JSON.parse(localStorage.getItem('playerData')); }
function savePlayer(data) { localStorage.setItem('playerData', JSON.stringify(data)); }

function getRandom8Digits() { return Math.floor(10000000 + Math.random() * 90000000); }
function generateRacerName() { return `赛车手${getRandom8Digits()}`; }
if (!localStorage.getItem('myRacerName')) localStorage.setItem('myRacerName', generateRacerName());
function getMyName() { return localStorage.getItem('myRacerName'); }

// 获取房卡数量（包含永久和未过期的限时卡）
function getCardCount(level) {
    let p = getPlayer();
    if (!p.cards[level]) return 0;
    // 清理已经过期的限时卡
    let now = Date.now();
    p.cards[level].temp = p.cards[level].temp.filter(expire => expire > now);
    savePlayer(p);
    return p.cards[level].perm + p.cards[level].temp.length;
}

// 比赛记录相关
function getHistory() { return JSON.parse(localStorage.getItem('matchHistory')) || []; }
function addOngoingHistory(roomInfo) { /* 略，保持你原有的 */ }
function updateHistoryStartTime(startTime) { /* 略，保持你原有的 */ }
function completeOngoingHistory(rank, rewardText, allPlayersList) { /* 略，保持你原有的 */ }

// 解卡任务结算
function checkAndClearTask(basePrice, isHostUsedTaskCard) {
    if (!isHostUsedTaskCard) return null;
    let p = getPlayer();
    p.taskProgress = (p.taskProgress || 0) + 1;
    if (p.taskProgress >= 2) {
        p.taskProgress -= 2;
        p.treasures += basePrice;
        let rewardTickets = basePrice / TICKET_RATE;
        p.tickets += rewardTickets;
        savePlayer(p);
        return { success: true, msg: `【任务达成】凑齐2次解卡，退还 ${basePrice} 秘宝，发放 ${rewardTickets.toFixed(1)} 张通兑券！` };
    }
    savePlayer(p);
    return { success: false, msg: `【任务进度】解卡进度：${p.taskProgress}/2` };
}
