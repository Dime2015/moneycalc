// 分数映射表
const scoreMapping = {
    // 问题1
    'q1': { 'A': 5, 'B': 3, 'C': 2, 'D': 4, 'E': 1 },
    // 问题2
    'q2': { 'A': 3, 'B': 1, 'C': 5, 'D': 2, 'E': 4 },
    // 问题3
    'q3': { 'A': 5, 'B': 1, 'C': 3, 'D': 2, 'E': 4 },
    // 问题4
    'q4': { 'A': 3, 'B': 5, 'C': 1, 'D': 2, 'E': 4 },
    // 问题5
    'q5': { 'A': 3, 'B': 1, 'C': 5, 'D': 2, 'E': 4 },
    // 问题6
    'q6': { 'A': 4, 'B': 2, 'C': 1, 'D': 5, 'E': 3 },
    // 问题7
    'q7': { 'A': 3, 'B': 1, 'C': 2, 'D': 4, 'E': 5 },
    // 问题8
    'q8': { 'A': 4, 'B': 5, 'C': 1, 'D': 2, 'E': 3 },
    // 问题9
    'q9': { 'A': 3, 'B': 5, 'C': 1, 'D': 2, 'E': 4 },
    // 问题10
    'q10': { 'A': 4, 'B': 3, 'C': 5, 'D': 1, 'E': 2 },
    // 问题11
    'q11': { 'A': 2, 'B': 3, 'C': 4, 'D': 1, 'E': 5 },
    // 问题12
    'q12': { 'A': 4, 'B': 3, 'C': 1, 'D': 5, 'E': 2 },
    // 问题13
    'q13': { 'A': 5, 'B': 1, 'C': 2, 'D': 4, 'E': 3 },
    // 问题14
    'q14': { 'A': 3, 'B': 2, 'C': 1, 'D': 5, 'E': 4 },
    // 问题15
    'q15': { 'A': 4, 'B': 3, 'C': 1, 'D': 5, 'E': 2 }
};

// 主导阶段映射
const stageMapping = [
    { range: [15, 25], name: "你一无所知", description: "特征：\"钱不就是钱吗？\"可能是你对于\"钱\"这个词的大部分认知。这和你家庭的物质条件无关，富可敌国和家徒四壁的家庭都会出现这样的孩子，尝试在wikipedia，youtube，知乎或者chatgpt上询问钱是什么吧，你将会获得新的启迪。" },
    { range: [26, 35], name: "你感到痛苦", description: "特征：你对金钱到底是什么已经开始有所思考，但目前你看到的主要是金钱复杂，压力和令人羞耻，不安的一面。无数人曾经到过你所在的地方，更有无数人尚未踏足于此。尝试和所有亲近的人聊聊钱这个话题，你终将征服这头猛兽。" },
    { range: [36, 45], name: "你已开始求知", description: "特征：恭喜！你已经开始自觉或者不自觉的学习和金钱打交道了，对于金钱的思考也开始逐渐逼近于本质！从小我就看出来你这人有大师气象。" },
    { range: [46, 55], name: "你已有所领悟", description: "特征：不得不承认，你小子有点东西，钱在你的理解中已经不光光是换取鸡蛋和牛奶的票子，更是一种和他人发生互动的一种媒介。你和巴菲特之间，可能只缺一个格雷厄姆。" },
    { range: [56, 65], name: "你正忙于征服", description: "特征：你已经在去往目的地的路上，任何关于钱的问题在你这里只是时间问题和运气问题。不要怀疑自己，我看福布斯排行榜上的人也只是比你运气好点。" },
    { range: [66, 70], name: "你已实现愿景", description: "特征：我应该没什么能够在这里对你评头论足的了，打开这份问卷应该也只是你花钱花累了之后的一种消遣。" },
    { range: [71, 75], name: "我佛慈悲", description: "特征：我想在生活中，人们往往叫您施主，偶尔也称呼您为爸爸。" }
];

// 阶段颜色映射（用于饼图）
const stageColors = [
    '#FFF0C9', // 你一无所知
    '#FFE082', // 你感到痛苦
    '#FFD54F', // 你已开始求知
    '#FFD700', // 你已有所领悟 - 黄金色
    '#D4AF37', // 你正忙于征服
    '#C9B037', // 你已实现愿景
    '#AE9142'  // 我佛慈悲
];

// DOM元素
const nextButton = document.getElementById('next-button');
const submitButton = document.getElementById('submit-button');
const personalInfoSection = document.getElementById('personal-info-section');
const questionnaireSection = document.getElementById('questionnaire-section');
const resultSection = document.getElementById('result-section');
const chartsContainer = document.getElementById('charts-container');
const resultContent = document.getElementById('result-content');

// 存储用户选择
const userSelections = {};

// 从localStorage获取已提交的数据
function getSubmittedData() {
    const data = localStorage.getItem('moneyMaturityData');
    return data ? JSON.parse(data) : [];
}

// 保存数据到localStorage
function saveData(data) {
    const existingData = getSubmittedData();
    existingData.push(data);
    localStorage.setItem('moneyMaturityData', JSON.stringify(existingData));
}

// 根据得分确定主导阶段
function determineStage(score) {
    return stageMapping.find(stage => score >= stage.range[0] && score <= stage.range[1]);
}

// 计算总分
function calculateTotalScore(answers) {
    let totalScore = 0;
    
    for (const question in answers) {
        if (scoreMapping[question] && scoreMapping[question][answers[question]]) {
            totalScore += scoreMapping[question][answers[question]];
        }
    }
    
    return totalScore;
}

// 显示个人结果
function displayResult(personalInfo, answers) {
    const totalScore = calculateTotalScore(answers);
    const stage = determineStage(totalScore);
    
    resultContent.innerHTML = `
        <h3>您的货币成熟度得分: ${totalScore} 分</h3>
        <h3>主导阶段: ${stage.name}</h3>
        <p>${stage.description}</p>
    `;
    
    // 显示结果部分
    personalInfoSection.classList.add('hidden-section');
    personalInfoSection.classList.remove('active-section');
    questionnaireSection.classList.add('hidden-section');
    questionnaireSection.classList.remove('active-section');
    resultSection.classList.add('active-section');
    resultSection.classList.remove('hidden-section');
    
    // 检查数据点是否达到100个以上，显示统计图表
    const submittedData = getSubmittedData();
    if (submittedData.length >= 100) {
        chartsContainer.classList.remove('hidden-section');
        generateCharts(submittedData);
    }
}

// 生成饼图
function generateCharts(data) {
    generateChart('age-chart', '年龄', data);
    generateChart('gender-chart', '性别', data);
    generateChart('education-chart', '学历', data);
    generateChart('income-chart', '年收入', data);
}

// 生成特定类别的饼图
function generateChart(chartId, category, data) {
    const canvas = document.getElementById(chartId);
    
    // 根据类别分组数据
    const categoryGroups = {};
    
    // 初始化类别组
    data.forEach(entry => {
        const categoryValue = entry.personalInfo[category.toLowerCase()];
        if (!categoryGroups[categoryValue]) {
            categoryGroups[categoryValue] = {
                stageCount: {
                    "你一无所知": 0,
                    "你感到痛苦": 0,
                    "你已开始求知": 0,
                    "你已有所领悟": 0,
                    "你正忙于征服": 0,
                    "你已实现愿景": 0,
                    "我佛慈悲": 0
                },
                total: 0
            };
        }
        
        const stage = determineStage(calculateTotalScore(entry.answers));
        categoryGroups[categoryValue].stageCount[stage.name]++;
        categoryGroups[categoryValue].total++;
    });
    
    // 准备图表数据
    const chartData = {
        labels: Object.keys(categoryGroups),
        datasets: []
    };
    
    // 为每个阶段创建数据集
    stageMapping.forEach((stage, index) => {
        const dataset = {
            label: stage.name,
            data: Object.keys(categoryGroups).map(categoryValue => 
                (categoryGroups[categoryValue].stageCount[stage.name] / categoryGroups[categoryValue].total) * 100
            ),
            backgroundColor: stageColors[index]
        };
        chartData.datasets.push(dataset);
    });
    
    new Chart(canvas, {
        type: 'pie',
        data: {
            labels: chartData.labels,
            datasets: [{
                data: chartData.datasets.map(dataset => dataset.data.reduce((sum, value) => sum + value, 0)),
                backgroundColor: stageColors
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw.toFixed(1)}%`;
                        }
                    }
                }
            }
        }
    });
}

// 为选项按钮添加选择事件
function setupOptionButtons() {
    const optionButtons = document.querySelectorAll('.option-button');
    
    optionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const name = this.getAttribute('data-name');
            const value = this.getAttribute('data-value');
            
            // 移除同一组中其他按钮的选中状态
            document.querySelectorAll(`.option-button[data-name="${name}"]`).forEach(btn => {
                btn.classList.remove('selected');
            });
            
            // 选中当前按钮
            this.classList.add('selected');
            
            // 记录选择
            userSelections[name] = value;
        });
    });
}

// 验证表单是否完整
function validateForm(formId) {
    let isValid = true;
    const questions = {};
    
    // 获取表单中的所有问题
    document.querySelectorAll(`#${formId} .question`).forEach(question => {
        const buttons = question.querySelectorAll('.option-button');
        if (buttons.length > 0) {
            const name = buttons[0].getAttribute('data-name');
            questions[name] = false;
        }
    });
    
    // 检查每个问题是否有选择
    for (const name in questions) {
        if (userSelections[name]) {
            questions[name] = true;
        }
    }
    
    // 检查是否有未回答的问题
    if (Object.values(questions).includes(false)) {
        alert('请回答所有问题后再提交。');
        return false;
    }
    
    return true;
}

// 获取表单数据
function getFormData(formId) {
    const data = {};
    
    // 获取表单中的所有问题名称
    document.querySelectorAll(`#${formId} .option-button`).forEach(button => {
        const name = button.getAttribute('data-name');
        if (userSelections[name]) {
            data[name] = userSelections[name];
        }
    });
    
    return data;
}

// 随机化选项顺序
function randomizeOptions() {
    const questions = document.querySelectorAll('#questionnaire-form .question');
    
    questions.forEach(question => {
        const options = question.querySelector('.options');
        const buttons = Array.from(options.querySelectorAll('.option-button'));
        
        // 随机排序按钮
        for (let i = buttons.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            options.appendChild(buttons[j]);
        }
    });
}

// 事件监听
document.addEventListener('DOMContentLoaded', function() {
    // 设置选项按钮
    setupOptionButtons();
    
    // 下一步按钮事件
    nextButton.addEventListener('click', function() {
        if (validateForm('personal-info-form')) {
            personalInfoSection.classList.remove('active-section');
            personalInfoSection.classList.add('hidden-section');
            questionnaireSection.classList.remove('hidden-section');
            questionnaireSection.classList.add('active-section');
            
            // 随机化问卷选项顺序
            randomizeOptions();
            
            // 滚动到顶部
            window.scrollTo(0, 0);
        }
    });
    
    // 提交按钮事件
    submitButton.addEventListener('click', function() {
        if (validateForm('questionnaire-form')) {
            const personalInfo = getFormData('personal-info-form');
            const answers = getFormData('questionnaire-form');
            
            // 保存数据
            saveData({
                personalInfo,
                answers,
                timestamp: new Date().toISOString()
            });
            
            // 显示结果
            displayResult(personalInfo, answers);
            
            // 滚动到顶部
            window.scrollTo(0, 0);
        }
    });
}); 