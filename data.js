// ================= 比赛历史与记录管理 =================
function getHistory() {
    try {
        let history = localStorage.getItem('matchHistory');
        return history ? JSON.parse(history) : [];
    } catch(e) { return []; }
}

// 1. 写一条“正在打”的记录
function addOngoingHistory(roomInfo) {
    try {
        let history = getHistory();
        // 删掉旧的进行中
        history = history.filter(item => item.status !== '正在进行中');
        
        history.unshift({
            time: new Date().toLocaleString('zh-CN', { hour12: false }),
            roomId: roomInfo.id,
            level: roomInfo.level,
            rank: '-',
            rewardText: '比赛进行中...',
            status: '正在进行中',
            allPlayers: [] 
        });
        
        // 最多只存 20 条
        if (history.length > 20) history.pop();
        localStorage.setItem('matchHistory', JSON.stringify(history));
        console.log("✅ 记录已写入：比赛开始");
    } catch(e) { console.error("写入记录失败", e); }
}

// 2. 结算时，把记录变成“已完成”
function completeOngoingHistory(rank, rewardText, allPlayersList) {
    try {
        let history = getHistory();
        let updated = false;
        for (let i = 0; i < history.length; i++) {
            if (history[i].status === '正在进行中') {
                history[i].rank = rank;
                history[i].rewardText = rewardText;
                history[i].status = '已完成';
                history[i].allPlayers = allPlayersList;
                updated = true;
                break;
            }
        }
        localStorage.setItem('matchHistory', JSON.stringify(history));
        console.log("✅ 记录已更新：比赛完成");
    } catch(e) { console.error("更新记录失败", e); }
}
