let countdownTimer;
let totalTime = 40; // 倒计时总时长
let selectedAnswers = []; // 保存用户作答的结果
let isPracticeMode = true; // 当前是练习模式还是正式测试
let isTestStarted = false; // 标识是否进入正式测试
let currentWordIndex = 0; // 当前呈现的词语索引
let positionIndex = 0; // 当前字的位置索引 (0=左, 1=中, 2=右)
let startTime = 0; // 记录每个单词呈现时的开始时间

let correctCount = 0; // 正确作答数
let incorrectCount = 0; // 错误作答数

// 词语数组：练习和正式测试各自不同
let practiceWords = ["船", "", "往", "十", ""];
let practiceCorrectAnswers = [1, 0, 1, 1, 0]; // 1=是，0=否

let testWords = [
    "水", "", "火", "土", "日", "", "", "山", "井", "", "弓", "", "", "车", 
    "", "", "热", "", "", "伞", "", "", "雨", "冷", "", "好", "爬", "", 
    "气", "向", "", "", "歌", "", "", "", "马", "", "羊", "", "目", "跑", 
    "", "耳", "画", "梅", "", "", "豆", "", "头", "瓜", "米", "", "去", "", 
    "", "虾", "出", "", "", "来", "", "", "", "", "师", "", "女", "", 
    "校", "", "旗", "同", "星", "", "", "", "安", "红", "", "北", "", "球", 
    "太", "", "", "多", "", "地", "祖", "", "爱", "", "", "放", "护", "", 
    "士", ""
]
;
let testCorrectAnswers = [
    1, 0, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 
    0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 
    1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 
    0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 
    0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 
    1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 
    1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 
    1, 0
];

userFileName = prompt("请输入保存CSV文件的名称（不需要扩展名）", "results");
if (!userFileName) {  // 如果用户没有输入文件名，使用默认值
    userFileName = "results";
}

// 页面加载后显示指导语
document.addEventListener("DOMContentLoaded", function () {
    displayImage("image.png"); // 显示指导语图片

    // 监听按键事件，空格进入练习，回车进入正式测试
    document.addEventListener("keydown", function (event) {
        if (event.key === " " || event.keyCode === 32) {
            if (!isTestStarted) {
                hideImage();
                startPracticeMode();
            }
        } else if (event.key === "Enter") {
            if (isPracticeMode) {
                startTestMode();
            }
        }
    });
});

// 显示图片
function displayImage(imageSrc) {
    let imageElement = document.createElement("img");
    imageElement.src = imageSrc;
    imageElement.alt = "实验指导语";
    imageElement.id = "experimentImage";
    document.body.appendChild(imageElement);

    document.body.style.textAlign = "center";
    imageElement.style.marginTop = "20px";
    imageElement.style.maxWidth = "100%";
}

// 隐藏图片
function hideImage() {
    let imageElement = document.getElementById("experimentImage");
    if (imageElement) {
        imageElement.style.display = "none";
    }
}

// 练习模式
function startPracticeMode() {
    isPracticeMode = true;
    currentWordIndex = 0;
    selectedAnswers = [];
    alert("练习开始：按F键表示 '是'，J键表示 '否'，按回车进入正式测试。");
    presentNextWord(practiceWords);
}

// 正式测试模式
function startTestMode() {
    isTestStarted = true;
    isPracticeMode = false;
    currentWordIndex = 0;
    positionIndex = 0;
    selectedAnswers = [];
    correctCount = 0;
    incorrectCount = 0;
    alert("正式测试开始：按F键表示 '是'，J键表示 '否'。");
    createCountdown();
    startCountdown();
    presentNextWord(testWords);
}

// 倒计时显示
function createCountdown() {
    let countdownElement = document.createElement("div");
    countdownElement.id = "countdown";
    countdownElement.style.fontSize = "30px";
    countdownElement.style.textAlign = "center";
    countdownElement.style.marginTop = "20px";
    document.body.appendChild(countdownElement);
}

// 开始倒计时
function startCountdown() {
    let countdownElement = document.getElementById("countdown");
    countdownElement.textContent = totalTime;

    countdownTimer = setInterval(function () {
        totalTime--;
        countdownElement.textContent = totalTime;

        if (totalTime <= 0) {
            clearInterval(countdownTimer);
            endTest();
        }
    }, 1000);
}

// 显示下一个词语
function presentNextWord(wordArray) {
    if (currentWordIndex >= wordArray.length) {
        endTest();
        return;
    }

    const word = wordArray[currentWordIndex];
    const wordDiv = document.getElementById("word") || createWordDiv();

    const positions = ["left", "center", "right"];
    if (positions[positionIndex] === "left") {
        wordDiv.style.textAlign = "left";
        wordDiv.style.marginLeft = "100px";
        wordDiv.style.marginRight = "0";
    } else if (positions[positionIndex] === "center") {
        wordDiv.style.textAlign = "center";
        wordDiv.style.marginLeft = "0";
        wordDiv.style.marginRight = "0";
    } else if (positions[positionIndex] === "right") {
        wordDiv.style.textAlign = "right";
        wordDiv.style.marginLeft = "0";
        wordDiv.style.marginRight = "100px";
    }

    positionIndex = (positionIndex + 1) % positions.length;
    wordDiv.textContent = word;

    startTime = performance.now(); // 记录开始时间
    document.addEventListener("keydown", handleKeyPress);
}

// 创建显示单词的元素
function createWordDiv() {
    const wordDiv = document.createElement("div");
    wordDiv.id = "word";
    wordDiv.style.fontSize = "48px";
    wordDiv.style.textAlign = "center";
    wordDiv.style.marginTop = "50px";
    document.body.appendChild(wordDiv);
    return wordDiv;
}

// 按键响应
function handleKeyPress(event) {
    if (event.key === "f" || event.key === "F") {
        recordResponse(1);
    } else if (event.key === "j" || event.key === "J") {
        recordResponse(0);
    }
}

// 记录响应
function recordResponse(response) {
    document.removeEventListener("keydown", handleKeyPress);

    const wordArray = isPracticeMode ? practiceWords : testWords;
    const correctAnswers = isPracticeMode ? practiceCorrectAnswers : testCorrectAnswers;

    const word = wordArray[currentWordIndex];
    const correctAnswer = correctAnswers[currentWordIndex];
    const isCorrect = response === correctAnswer;

    const reactionTime = performance.now() - startTime; // 计算反应时间

    selectedAnswers.push({
        word: word,
        response: response,
        correctAnswer: correctAnswer,
        isCorrect: isCorrect,
        reactionTime: reactionTime // 添加反应时间
    });

    if (isCorrect) {
        correctCount++;
    } else {
        incorrectCount++;
    }

    currentWordIndex++;
    presentNextWord(wordArray);
}

// 测试结束
function endTest() {
    alert(`测试结束！正确数量: ${correctCount}, 错误数量: ${incorrectCount}`);
    exportResults();
}

// 导出结果为 CSV
function exportResults() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "词语,响应,正确答案,是否正确,反应时间(ms)\r\n";

    selectedAnswers.forEach((result) => {
        csvContent += `${result.word},${result.response === 1 ? "是" : "否"},${result.correctAnswer === 1 ? "是" : "否"},${result.isCorrect ? "是" : "否"},${result.reactionTime.toFixed(2)}\r\n`;
    });

    csvContent += `正确数量,${correctCount},错误数量,${incorrectCount}\r\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${userFileName}.csv`);  // 使用用户输入的文件名保存
    document.body.appendChild(link);
    link.click();
}
