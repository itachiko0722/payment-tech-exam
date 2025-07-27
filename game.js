// ゲーム状態管理
class GameState {
    constructor() {
        this.reset();
        this.loadProgress();
    }

    reset() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.timeRemaining = 60;
        this.selectedAnswer = null;
        this.userAnswers = [];
        this.questions = [];
        this.gameStatus = 'idle'; // idle, playing, paused, finished
        this.startTime = null;
        this.category = 'all';
        this.difficulty = 'basic';
        // マスコット情報は保持（リセットしない）
    }

    loadProgress() {
        const saved = localStorage.getItem('paymentTechProgress');
        this.progress = saved ? JSON.parse(saved) : {
            totalPlays: 0,
            totalScore: 0,
            highScore: 0,
            categoryStats: {},
            achievements: [],
            mascotLevel: 1,
            correctAnswers: 0,
            mascotExperience: 0
        };
        
        // マスコット経験値の初期化を確実にする
        if (typeof this.progress.mascotExperience === 'undefined') {
            this.progress.mascotExperience = 0;
        }
        
        console.log('進捗読み込み:', this.progress);
    }

    saveProgress() {
        console.log('進捗保存:', this.progress);
        localStorage.setItem('paymentTechProgress', JSON.stringify(this.progress));
    }

    updateProgress(score, answers) {
        this.progress.totalPlays++;
        this.progress.totalScore += score;
        if (score > this.progress.highScore) {
            this.progress.highScore = score;
        }

        // カテゴリ別統計を更新
        answers.forEach(answer => {
            const category = answer.question.category;
            if (!this.progress.categoryStats[category]) {
                this.progress.categoryStats[category] = { correct: 0, total: 0 };
            }
            this.progress.categoryStats[category].total++;
            if (answer.isCorrect) {
                this.progress.categoryStats[category].correct++;
            }
        });

        this.saveProgress();
    }
}

// タイマー管理
class GameTimer {
    constructor(duration, onTick, onComplete) {
        this.duration = duration;
        this.remaining = duration;
        this.onTick = onTick;
        this.onComplete = onComplete;
        this.intervalId = null;
    }

    start() {
        this.intervalId = setInterval(() => {
            this.remaining--;
            this.onTick(this.remaining);

            if (this.remaining <= 0) {
                this.stop();
                this.onComplete();
            }
        }, 1000);
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    pause() {
        this.stop();
    }

    resume() {
        if (this.remaining > 0) {
            this.start();
        }
    }

    reset(duration) {
        this.stop();
        this.duration = duration;
        this.remaining = duration;
    }
}

// スコア計算
class ScoreCalculator {
    static calculate(question, timeUsed, isCorrect) {
        if (!isCorrect) return 0;

        let baseScore = question.points;
        
        // 時間ボーナス
        const timeRatio = Math.max(0, (question.timeLimit - timeUsed) / question.timeLimit);
        const timeBonus = Math.round(baseScore * 0.5 * timeRatio);
        
        // 難易度ボーナス
        const difficultyMultiplier = {
            'basic': 1.0,
            'intermediate': 1.5,
            'advanced': 2.0
        }[question.difficulty] || 1.0;

        return Math.round((baseScore + timeBonus) * difficultyMultiplier);
    }
}

// アチーブメント管理
class AchievementManager {
    static checkAchievements(gameState, userAnswers) {
        const achievements = [];
        const correctCount = userAnswers.filter(a => a.isCorrect).length;
        const accuracy = correctCount / userAnswers.length;

        // パーフェクトゲーム
        if (accuracy === 1 && userAnswers.length >= 10) {
            achievements.push({ id: 'perfect_game', name: 'パーフェクトゲーム', description: '10問以上全問正解' });
        }

        // スピードマスター
        const avgTime = userAnswers.reduce((sum, a) => sum + a.timeUsed, 0) / userAnswers.length;
        if (avgTime < 15 && correctCount >= 8) {
            achievements.push({ id: 'speed_master', name: 'スピードマスター', description: '平均15秒以内で80%以上正解' });
        }

        // カテゴリマスター
        const categoryGroups = {};
        userAnswers.forEach(answer => {
            const cat = answer.question.category;
            if (!categoryGroups[cat]) categoryGroups[cat] = { correct: 0, total: 0 };
            categoryGroups[cat].total++;
            if (answer.isCorrect) categoryGroups[cat].correct++;
        });

        Object.entries(categoryGroups).forEach(([category, stats]) => {
            if (stats.total >= 5 && stats.correct === stats.total) {
                const catName = new QuestionManager().getCategoryName(category);
                achievements.push({
                    id: `master_${category}`,
                    name: `${catName}マスター`,
                    description: `${catName}で5問以上全問正解`
                });
            }
        });

        // 新規アチーブメントを保存
        achievements.forEach(achievement => {
            if (!gameState.progress.achievements.find(a => a.id === achievement.id)) {
                gameState.progress.achievements.push(achievement);
            }
        });

        return achievements;
    }
}

// マスコット管理クラス
class MascotManager {
    constructor() {
        this.stages = [
            { level: 1, name: 'たまご', svgPath: 'assets/mascot/stage0-egg.svg', requiredExp: 0 },
            { level: 2, name: 'ひよこ（孵化）', svgPath: 'assets/mascot/stage1-newborn.svg', requiredExp: 1 },
            { level: 3, name: 'ひよこ（成長）', svgPath: 'assets/mascot/stage2-chick.svg', requiredExp: 3 },
            { level: 4, name: '若鶏', svgPath: 'assets/mascot/stage3-young.svg', requiredExp: 6 },
            { level: 5, name: '成鶏', svgPath: 'assets/mascot/stage4-adult.svg', requiredExp: 10 },
            { level: 6, name: '金の鶏', svgPath: 'assets/mascot/stage5-golden.svg', requiredExp: 15 }
        ];
        this.svgCache = new Map(); // SVGキャッシュ
    }

    getCurrentStage(experience) {
        let currentStage = this.stages[0];
        for (let stage of this.stages) {
            if (experience >= stage.requiredExp) {
                currentStage = stage;
            } else {
                break;
            }
        }
        return currentStage;
    }

    getNextStage(experience) {
        const currentStage = this.getCurrentStage(experience);
        const currentIndex = this.stages.findIndex(s => s.level === currentStage.level);
        return currentIndex < this.stages.length - 1 ? this.stages[currentIndex + 1] : null;
    }

    async loadSvg(svgPath) {
        if (this.svgCache.has(svgPath)) {
            return this.svgCache.get(svgPath);
        }

        try {
            const response = await fetch(svgPath);
            const svgText = await response.text();
            this.svgCache.set(svgPath, svgText);
            return svgText;
        } catch (error) {
            console.error(`SVG読み込みエラー: ${svgPath}`, error);
            return null;
        }
    }

    async addExperience(amount) {
        const oldExperience = gameState.progress.mascotExperience || 0;
        const oldStage = this.getCurrentStage(oldExperience);
        
        // 経験値を確実に初期化
        if (!gameState.progress.mascotExperience) {
            gameState.progress.mascotExperience = 0;
        }
        
        gameState.progress.mascotExperience += amount;
        const newStage = this.getCurrentStage(gameState.progress.mascotExperience);
        
        console.log(`経験値追加: ${amount}, 合計: ${gameState.progress.mascotExperience}, レベル: ${newStage.level}`);
        
        // すぐにマスコット表示を更新
        await this.updateMascotDisplay();
        
        // レベルアップチェック - 少し遅延させてアニメーションを見やすくする
        setTimeout(() => {
            if (newStage.level > oldStage.level) {
                this.levelUp(newStage);
            } else {
                this.playHappyAnimation();
            }
        }, 100);
        
        // 即座に保存
        gameState.saveProgress();
    }

    levelUp(newStage) {
        // レベルアップアニメーション
        const mascot = document.getElementById('mascot');
        mascot.classList.add('grow');
        
        // パーティクルエフェクト
        this.createParticleEffect();
        
        // レベルアップメッセージ
        this.showLevelUpMessage(newStage);
        
        // アニメーションクリア
        setTimeout(() => {
            mascot.classList.remove('grow');
        }, 800);
    }

    playHappyAnimation() {
        const mascot = document.getElementById('mascot');
        mascot.classList.add('happy');
        setTimeout(() => {
            mascot.classList.remove('happy');
        }, 1000);
    }

    createParticleEffect() {
        const container = document.getElementById('mascotContainer');
        const mascot = document.getElementById('mascot');
        
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const angle = (360 / 8) * i;
            const radian = (angle * Math.PI) / 180;
            const distance = 40;
            
            particle.style.left = `${50 + Math.cos(radian) * distance}%`;
            particle.style.top = `${50 + Math.sin(radian) * distance}%`;
            
            container.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 1500);
        }
    }

    showLevelUpMessage(stage) {
        const mascot = document.getElementById('mascot');
        const message = document.createElement('div');
        message.className = 'level-up-effect';
        message.textContent = `Level ${stage.level}! ${stage.name}`;
        
        mascot.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 2000);
    }

    async updateMascotDisplay() {
        const mascot = document.getElementById('mascot');
        if (!mascot) return; // マスコットが存在しない場合は処理をスキップ
        
        const experience = gameState.progress.mascotExperience || 0;
        const currentStage = this.getCurrentStage(experience);
        const nextStage = this.getNextStage(experience);
        
        console.log(`マスコット更新: 経験値${experience}, レベル${currentStage.level}, ステージ${currentStage.name}`);
        
        // ステージクラスを更新（すべてのステージクラスを削除してから追加）
        mascot.className = mascot.className.replace(/stage-\d+/g, '');
        mascot.classList.add('mascot', `stage-${currentStage.level - 1}`);
        
        // SVGを読み込んで表示
        const svgContent = await this.loadSvg(currentStage.svgPath);
        if (svgContent) {
            mascot.innerHTML = `${svgContent}<div id="mascotTooltip" class="mascot-tooltip">${this.getTooltipText(currentStage, nextStage, experience)}</div>`;
        } else {
            // SVG読み込みに失敗した場合はフォールバック（従来の絵文字）
            const fallbackEmoji = ['🥚', '🐣', '🐤', '🐔', '🐓', '👑'][currentStage.level - 1] || '🐣';
            mascot.innerHTML = `${fallbackEmoji}<div id="mascotTooltip" class="mascot-tooltip">${this.getTooltipText(currentStage, nextStage, experience)}</div>`;
        }
        
        // 更新アニメーションを追加
        mascot.classList.add('bounce');
        setTimeout(() => {
            mascot.classList.remove('bounce');
        }, 600);
    }

    getTooltipText(currentStage, nextStage, experience) {
        let text = `Level ${currentStage.level}: ${currentStage.name}`;
        
        if (nextStage) {
            const needed = nextStage.requiredExp - experience;
            text += ` (あと${needed}問正解で成長!)`;
        } else {
            text += ' (最高レベル!)';
        }
        
        return text;
    }

    async showMascot() {
        const container = document.getElementById('mascotContainer');
        if (container) {
            container.classList.remove('hidden');
            console.log('マスコット表示開始');
            await this.updateMascotDisplay();
        } else {
            console.error('マスコットコンテナが見つかりません');
        }
    }

    hideMascot() {
        document.getElementById('mascotContainer').classList.add('hidden');
    }
}

// グローバル変数
let gameState = new GameState();
let questionManager = new QuestionManager(questionsDatabase);
let gameTimer = null;
let mascotManager = new MascotManager();

// 問題数の上限を更新
function updateQuestionLimit() {
    const category = document.getElementById('categorySelect').value;
    const difficulty = document.getElementById('difficultySelect').value;
    const questionCountInput = document.getElementById('questionCount');
    
    const availableQuestions = questionManager.filterQuestions(category, difficulty);
    const maxQuestions = availableQuestions.length;
    
    questionCountInput.max = maxQuestions;
    
    // 現在の値が上限を超えている場合は調整
    if (parseInt(questionCountInput.value) > maxQuestions) {
        questionCountInput.value = Math.max(1, maxQuestions);
    }
    
    // 問題数表示を更新
    const labels = document.querySelectorAll('label');
    for (let label of labels) {
        if (label.textContent.includes('問題数')) {
            label.textContent = `問題数 (最大: ${maxQuestions}問)`;
            break;
        }
    }
}

// ゲーム開始
function startGame() {
    const category = document.getElementById('categorySelect').value;
    const difficulty = document.getElementById('difficultySelect').value;
    const questionCount = parseInt(document.getElementById('questionCount').value);

    gameState.reset();
    gameState.category = category;
    gameState.difficulty = difficulty;
    gameState.questions = questionManager.selectRandomQuestions(category, difficulty, questionCount);

    if (gameState.questions.length === 0) {
        alert('選択した条件に該当する問題がありません。');
        return;
    }

    gameState.gameStatus = 'playing';
    gameState.startTime = Date.now();

    // 画面切り替え
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('gameScreen').classList.remove('hidden');

    // 総問題数を表示
    document.getElementById('totalQuestions').textContent = gameState.questions.length;
    
    // マスコットを表示
    mascotManager.showMascot();

    loadQuestion();
}

// 問題を読み込む
function loadQuestion() {
    const question = gameState.questions[gameState.currentQuestionIndex];
    
    // 問題番号を更新
    document.getElementById('currentQuestionNumber').textContent = gameState.currentQuestionIndex + 1;
    
    // プログレスバーを更新
    const progress = ((gameState.currentQuestionIndex) / gameState.questions.length) * 100;
    document.getElementById('progressBar').style.width = `${progress}%`;

    // 問題情報を表示
    document.getElementById('questionCategory').textContent = questionManager.getCategoryName(question.category);
    document.getElementById('questionDifficulty').textContent = questionManager.getDifficultyName(question.difficulty);
    document.getElementById('questionText').textContent = question.question;

    // 選択肢を表示
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-button w-full text-left p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all';
        button.textContent = option;
        button.onclick = () => selectAnswer(option);
        optionsContainer.appendChild(button);
    });

    // 回答ボタンをリセット
    gameState.selectedAnswer = null;
    document.getElementById('submitAnswer').disabled = true;
    document.getElementById('submitAnswer').textContent = '回答を送信';

    // タイマーをリセット
    if (gameTimer) gameTimer.stop();
    gameTimer = new GameTimer(
        question.timeLimit,
        (remaining) => updateTimer(remaining),
        () => timeUp()
    );
    gameTimer.start();
}

// タイマー更新
function updateTimer(remaining) {
    const timerElement = document.getElementById('timer');
    timerElement.textContent = remaining;

    // 警告表示
    if (remaining <= 10) {
        timerElement.classList.add('timer-danger');
    } else if (remaining <= 20) {
        timerElement.classList.add('timer-warning');
    } else {
        timerElement.classList.remove('timer-warning', 'timer-danger');
    }
}

// 時間切れ
function timeUp() {
    submitAnswer(true);
}

// 回答選択
function selectAnswer(answer) {
    gameState.selectedAnswer = answer;
    
    // 選択状態を更新
    const buttons = document.querySelectorAll('.option-button');
    buttons.forEach(button => {
        button.classList.remove('selected');
        if (button.textContent === answer) {
            button.classList.add('selected');
        }
    });

    document.getElementById('submitAnswer').disabled = false;
}

// 回答送信
function submitAnswer(isTimeUp = false) {
    if (!isTimeUp && !gameState.selectedAnswer) return;

    const question = gameState.questions[gameState.currentQuestionIndex];
    const timeUsed = question.timeLimit - gameTimer.remaining;
    const isCorrect = gameState.selectedAnswer === question.correctAnswer;

    // タイマーを停止
    gameTimer.stop();

    // 結果を保存
    gameState.userAnswers.push({
        question: question,
        userAnswer: gameState.selectedAnswer,
        isCorrect: isCorrect,
        timeUsed: timeUsed
    });

    // スコアを計算
    if (isCorrect) {
        const points = ScoreCalculator.calculate(question, timeUsed, true);
        gameState.score += points;
        document.getElementById('score').textContent = gameState.score;
        document.getElementById('score').classList.add('score-increase');
        setTimeout(() => {
            document.getElementById('score').classList.remove('score-increase');
        }, 500);
        
        // マスコットに経験値を与える（正解ごとに必ず1経験値）
        const expGain = 1; // 1問正解ごとに確実に1経験値
        console.log(`正解！難易度: ${question.difficulty}, 獲得経験値: ${expGain}`);
        
        // マスコットの反応を遅延させて、スコア表示の後に実行
        setTimeout(() => {
            mascotManager.addExperience(expGain);
        }, 300);
    }

    // 正解/不正解を表示
    const buttons = document.querySelectorAll('.option-button');
    buttons.forEach(button => {
        if (button.textContent === question.correctAnswer) {
            button.classList.add('correct');
        } else if (button.textContent === gameState.selectedAnswer && !isCorrect) {
            button.classList.add('incorrect');
        }
        button.onclick = null;
    });

    // 次へボタンに変更
    const submitButton = document.getElementById('submitAnswer');
    submitButton.textContent = '次の問題へ';
    submitButton.onclick = nextQuestion;

    // 解説を表示（オプション）
    if (!isCorrect || isTimeUp) {
        setTimeout(() => {
            alert(`正解: ${question.correctAnswer}\n\n${question.explanation}`);
        }, 500);
    }
}

// 次の問題へ
function nextQuestion() {
    gameState.currentQuestionIndex++;

    if (gameState.currentQuestionIndex < gameState.questions.length) {
        loadQuestion();
        document.getElementById('submitAnswer').onclick = () => submitAnswer();
    } else {
        endGame();
    }
}

// ゲーム終了
function endGame() {
    gameState.gameStatus = 'finished';
    
    // 進捗を更新
    gameState.updateProgress(gameState.score, gameState.userAnswers);

    // アチーブメントをチェック
    const newAchievements = AchievementManager.checkAchievements(gameState, gameState.userAnswers);

    // マスコットを隠す
    mascotManager.hideMascot();

    // 結果画面を表示
    showResults(newAchievements);
}

// 結果表示
function showResults(newAchievements) {
    document.getElementById('gameScreen').classList.add('hidden');
    document.getElementById('resultScreen').classList.remove('hidden');

    const correctCount = gameState.userAnswers.filter(a => a.isCorrect).length;
    
    document.getElementById('finalScore').textContent = gameState.score;
    document.getElementById('correctCount').textContent = correctCount;
    document.getElementById('totalCount').textContent = gameState.questions.length;

    // カテゴリ別結果
    const categoryResults = {};
    gameState.userAnswers.forEach(answer => {
        const cat = answer.question.category;
        if (!categoryResults[cat]) {
            categoryResults[cat] = { correct: 0, total: 0 };
        }
        categoryResults[cat].total++;
        if (answer.isCorrect) {
            categoryResults[cat].correct++;
        }
    });

    const categoryResultsDiv = document.getElementById('categoryResults');
    categoryResultsDiv.innerHTML = '';
    
    Object.entries(categoryResults).forEach(([category, stats]) => {
        const percentage = Math.round((stats.correct / stats.total) * 100);
        const div = document.createElement('div');
        div.className = 'flex justify-between items-center p-2 bg-gray-50 rounded';
        div.innerHTML = `
            <span>${questionManager.getCategoryName(category)}</span>
            <span class="font-semibold">${stats.correct}/${stats.total} (${percentage}%)</span>
        `;
        categoryResultsDiv.appendChild(div);
    });

    // アチーブメント表示
    const achievementsDiv = document.getElementById('achievements');
    achievementsDiv.innerHTML = '';
    
    if (newAchievements.length > 0) {
        newAchievements.forEach(achievement => {
            const badge = document.createElement('div');
            badge.className = 'achievement-badge';
            badge.textContent = achievement.name;
            badge.title = achievement.description;
            achievementsDiv.appendChild(badge);
        });
    } else {
        achievementsDiv.innerHTML = '<p class="text-gray-500">今回は新しいアチーブメントを獲得できませんでした</p>';
    }
}

// ゲーム一時停止
function pauseGame() {
    if (gameState.gameStatus !== 'playing') return;
    
    gameState.gameStatus = 'paused';
    gameTimer.pause();
    document.getElementById('pauseModal').classList.remove('hidden');
}

// ゲーム再開
function resumeGame() {
    gameState.gameStatus = 'playing';
    gameTimer.resume();
    document.getElementById('pauseModal').classList.add('hidden');
}

// 解答確認
function reviewAnswers() {
    if (!gameState.userAnswers || gameState.userAnswers.length === 0) {
        alert('確認できる解答がありません。');
        return;
    }

    document.getElementById('resultScreen').classList.add('hidden');
    document.getElementById('reviewScreen').classList.remove('hidden');
    
    generateReviewContent();
}

// 解答確認画面を閉じる
function closeReview() {
    document.getElementById('reviewScreen').classList.add('hidden');
    document.getElementById('resultScreen').classList.remove('hidden');
}

// 解答確認の内容を生成
function generateReviewContent() {
    const reviewContent = document.getElementById('reviewContent');
    reviewContent.innerHTML = '';
    
    gameState.userAnswers.forEach((answer, index) => {
        const question = answer.question;
        const isCorrect = answer.isCorrect;
        
        const reviewItem = document.createElement('div');
        reviewItem.className = 'border rounded-lg p-4 ' + (isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50');
        
        reviewItem.innerHTML = `
            <div class="flex items-start justify-between mb-3">
                <h3 class="text-lg font-semibold">問題 ${index + 1}</h3>
                <div class="flex items-center">
                    <span class="text-sm px-2 py-1 rounded ${isCorrect ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}">
                        ${isCorrect ? '正解' : '不正解'}
                    </span>
                    <span class="ml-2 text-sm text-gray-600">${answer.timeUsed}秒</span>
                </div>
            </div>
            
            <div class="mb-3">
                <p class="text-sm text-gray-600 mb-1">
                    カテゴリ: ${questionManager.getCategoryName(question.category)} | 
                    難易度: ${questionManager.getDifficultyName(question.difficulty)}
                </p>
                <p class="font-medium mb-3">${question.question}</p>
            </div>
            
            <div class="space-y-2 mb-4">
                ${question.options.map(option => {
                    let optionClass = 'p-2 rounded border';
                    let icon = '';
                    
                    if (option === question.correctAnswer) {
                        optionClass += ' bg-green-100 border-green-300 text-green-800';
                        icon = '<span class="float-right">✓</span>';
                    } else if (option === answer.userAnswer && !isCorrect) {
                        optionClass += ' bg-red-100 border-red-300 text-red-800';
                        icon = '<span class="float-right">✗</span>';
                    } else {
                        optionClass += ' bg-gray-50 border-gray-200';
                    }
                    
                    return `<div class="${optionClass}">${option}${icon}</div>`;
                }).join('')}
            </div>
            
            <div class="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                <p class="text-sm"><strong>解説:</strong> ${question.explanation}</p>
            </div>
            
            ${isCorrect ? `
                <div class="mt-2 text-sm text-green-600">
                    獲得スコア: ${ScoreCalculator.calculate(question, answer.timeUsed, true)}点
                </div>
            ` : ''}
        `;
        
        reviewContent.appendChild(reviewItem);
    });
}

// ゲーム再開始
function restartGame() {
    // すべての画面を隠してスタート画面を表示
    document.getElementById('resultScreen').classList.add('hidden');
    document.getElementById('reviewScreen').classList.add('hidden');
    document.getElementById('progressScreen').classList.add('hidden');
    document.getElementById('gameScreen').classList.add('hidden');
    document.getElementById('startScreen').classList.remove('hidden');
}

// 進捗画面表示
function showProgress() {
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('progressScreen').classList.remove('hidden');

    const progress = gameState.progress;
    
    document.getElementById('totalPlays').textContent = progress.totalPlays;
    document.getElementById('averageScore').textContent = progress.totalPlays > 0 
        ? Math.round(progress.totalScore / progress.totalPlays) 
        : 0;
    document.getElementById('highScore').textContent = progress.highScore;
    
    // マスコット情報を表示
    const experience = progress.mascotExperience || 0;
    const currentStage = mascotManager.getCurrentStage(experience);
    const mascotInfoDiv = document.querySelector('.mascot-info');
    if (mascotInfoDiv) {
        mascotInfoDiv.remove();
    }
    
    const statsContainer = document.querySelector('#progressScreen .grid');
    const mascotInfoElement = document.createElement('div');
    mascotInfoElement.className = 'bg-purple-50 p-4 rounded-lg mascot-info';
    mascotInfoElement.innerHTML = `
        <h3 class="font-semibold text-gray-700">マスコット</h3>
        <p class="text-2xl font-bold text-purple-600">${currentStage.emoji} Lv.${currentStage.level}</p>
        <p class="text-sm text-gray-600">${currentStage.name}</p>
        <p class="text-xs text-gray-500">経験値: ${experience}</p>
    `;
    statsContainer.appendChild(mascotInfoElement);

    // カテゴリ別統計
    const categoryStatsDiv = document.getElementById('categoryStats');
    categoryStatsDiv.innerHTML = '';
    
    Object.entries(progress.categoryStats).forEach(([category, stats]) => {
        const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
        const div = document.createElement('div');
        div.className = 'bg-gray-50 p-3 rounded-lg';
        div.innerHTML = `
            <div class="flex justify-between items-center">
                <span class="font-semibold">${questionManager.getCategoryName(category)}</span>
                <span>${accuracy}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div class="bg-blue-600 h-2 rounded-full" style="width: ${accuracy}%"></div>
            </div>
            <div class="text-sm text-gray-600 mt-1">${stats.correct}/${stats.total} 問正解</div>
        `;
        categoryStatsDiv.appendChild(div);
    });

    // 獲得済みアチーブメント
    const allAchievementsDiv = document.getElementById('allAchievements');
    allAchievementsDiv.innerHTML = '';
    
    if (progress.achievements.length > 0) {
        progress.achievements.forEach(achievement => {
            const div = document.createElement('div');
            div.className = 'bg-purple-50 p-3 rounded-lg text-center';
            div.innerHTML = `
                <div class="font-semibold text-purple-700">${achievement.name}</div>
                <div class="text-sm text-gray-600 mt-1">${achievement.description}</div>
            `;
            allAchievementsDiv.appendChild(div);
        });
    } else {
        allAchievementsDiv.innerHTML = '<p class="text-gray-500 col-span-full text-center">まだアチーブメントを獲得していません</p>';
    }
}

// スタート画面に戻る
function backToStart() {
    document.getElementById('progressScreen').classList.add('hidden');
    document.getElementById('startScreen').classList.remove('hidden');
}

// マスコット情報を表示
function showMascotInfo() {
    const experience = gameState.progress.mascotExperience || 0;
    const currentStage = mascotManager.getCurrentStage(experience);
    const nextStage = mascotManager.getNextStage(experience);
    
    let message = `${currentStage.emoji} Level ${currentStage.level}: ${currentStage.name}\n`;
    message += `経験値: ${experience}\n\n`;
    
    if (nextStage) {
        const needed = nextStage.requiredExp - experience;
        message += `次のレベル: ${nextStage.name}\n`;
        message += `必要経験値: あと ${needed}\n\n`;
    } else {
        message += '最高レベルに到達しました！\nおめでとうございます！\n\n';
    }
    
    // デバッグ用：経験値を強制的に1追加するオプション
    if (confirm(message + '\n[デバッグ] 経験値を1追加しますか？')) {
        console.log('手動で経験値追加');
        mascotManager.addExperience(1);
    }
}

// クイズをやめる（確認モーダルを表示）
function quitGame() {
    document.getElementById('quitModal').classList.remove('hidden');
}

// クイズ終了をキャンセル
function cancelQuit() {
    document.getElementById('quitModal').classList.add('hidden');
}

// クイズ終了を確定
function confirmQuit() {
    // タイマーを停止
    if (gameTimer) {
        gameTimer.stop();
    }
    
    // 一時停止モーダルがあれば閉じる
    document.getElementById('pauseModal').classList.add('hidden');
    document.getElementById('quitModal').classList.add('hidden');
    
    // ゲーム画面を隠してスタート画面を表示
    document.getElementById('gameScreen').classList.add('hidden');
    document.getElementById('startScreen').classList.remove('hidden');
    
    // マスコットを隠す
    mascotManager.hideMascot();
    
    // ゲーム状態をリセット
    gameState.reset();
}

// ページロード時の初期化
document.addEventListener('DOMContentLoaded', async () => {
    // 初期の問題数上限を設定
    updateQuestionLimit();
    
    // マスコット状態を初期化
    await mascotManager.updateMascotDisplay();
    
    // カテゴリ・難易度変更時に問題数上限を更新
    document.getElementById('categorySelect').addEventListener('change', updateQuestionLimit);
    document.getElementById('difficultySelect').addEventListener('change', updateQuestionLimit);
    
    // キーボードショートカット
    document.addEventListener('keydown', (e) => {
        // エンターキーでの回答送信
        if (e.key === 'Enter' && gameState.gameStatus === 'playing' && gameState.selectedAnswer) {
            submitAnswer();
        }
        
        // Escapeキーでクイズ終了確認（ゲーム中のみ）
        if (e.key === 'Escape' && gameState.gameStatus === 'playing') {
            quitGame();
        }
        
        // Escapeキーでモーダルを閉じる
        if (e.key === 'Escape') {
            // 一時停止モーダルが開いている場合
            if (!document.getElementById('pauseModal').classList.contains('hidden')) {
                document.getElementById('pauseModal').classList.add('hidden');
                if (gameState.gameStatus === 'paused') {
                    resumeGame();
                }
            }
            
            // クイズ終了確認モーダルが開いている場合
            if (!document.getElementById('quitModal').classList.contains('hidden')) {
                cancelQuit();
            }
        }
    });
});