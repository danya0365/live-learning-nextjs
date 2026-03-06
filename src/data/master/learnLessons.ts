// Learn Lessons Master Data
// Lessons for the /learn page

export interface LearnLesson {
  id: string;
  topicId: string;
  slug: string;
  title: string;
  titleTh: string;
  description: string;
  content: string;
  order: number;
  duration: number;
  codeExample?: string;
  challenge?: {
    description: string;
    starterCode: string;
    expectedOutput: string;
    hints: string[];
  };
  quiz?: {
    question: string;
    options: string[];
    correctAnswer: number; // index of correct option (0-based)
  }[];
}

export const learnLessons: LearnLesson[] = [
  // ============================================
  // Topic: Basics (JavaScript Fundamentals)
  // ============================================
  {
    id: "learn-basics-1",
    topicId: "topic-basics",
    slug: "introduction",
    title: "Introduction to JavaScript",
    titleTh: "แนะนำ JavaScript",
    description: "What is JavaScript and why learn it",
    order: 1,
    duration: 10,
    content: `
# แนะนำ JavaScript

JavaScript เป็นภาษาโปรแกรมที่ใช้กันอย่างแพร่หลายที่สุดในโลก!

## ทำไมต้องเรียน JavaScript?
- 🌐 ทำงานได้บน Browser ทุกตัว
- 📱 พัฒนา Mobile App ได้ (React Native)
- 🖥️ พัฒนา Desktop App ได้ (Electron)
- 🎮 พัฒนาเกมได้

## Hello World
\`\`\`javascript
console.log("Hello World!");
\`\`\`

## JavaScript ทำอะไรได้บ้าง?
- เปลี่ยนเนื้อหาในเว็บไซต์แบบ Dynamic
- ตรวจสอบข้อมูลฟอร์มก่อนส่ง
- สร้าง Animation และ Effects
- เชื่อมต่อกับ API และฐานข้อมูล
    `,
    codeExample: `// ลองพิมพ์ข้อความ
console.log("Hello World!");
console.log("สวัสดี JavaScript!");

// แสดงข้อความหลายบรรทัด
console.log("Welcome to");
console.log("JavaScript!");`,
    challenge: {
      description: "พิมพ์ชื่อของคุณออกมาด้วย console.log",
      starterCode: `// พิมพ์ชื่อของคุณ
console.log("ชื่อของคุณ");`,
      expectedOutput: "ชื่อ",
      hints: ["ใช้ console.log()", "ใส่ข้อความใน quotes"]
    },
    quiz: [
      {
        question: "JavaScript ใช้ทำอะไรได้?",
        options: ["แก้ไขรูปภาพ", "สร้างเว็บที่มี Dynamic", "ออกแบบ Database", "เขียน System OS"],
        correctAnswer: 1
      },
      {
        question: "คำสั่งใดใช้แสดงข้อความบน Console?",
        options: ["print()", "echo()", "console.log()", "display()"],
        correctAnswer: 2
      }
    ]
  },
  {
    id: "learn-basics-2",
    topicId: "topic-basics",
    slug: "variables",
    title: "Variables",
    titleTh: "ตัวแปร",
    description: "let, const and var",
    order: 2,
    duration: 15,
    content: `
# ตัวแปรใน JavaScript

ตัวแปรใช้เก็บข้อมูล เหมือนกล่องที่ใส่ของได้

## let vs const
\`\`\`javascript
let age = 25;        // เปลี่ยนค่าได้
const name = "John"; // เปลี่ยนค่าไม่ได้
\`\`\`

## var (ไม่แนะนำ)
\`\`\`javascript
var oldStyle = "legacy"; // แบบเก่า ไม่แนะนำ
\`\`\`

## กฎการตั้งชื่อ
- ห้ามขึ้นต้นด้วยตัวเลข
- ห้ามมีช่องว่าง
- ใช้ camelCase เช่น myName, totalScore
- Case-sensitive (name ≠ Name)
    `,
    codeExample: `let score = 100;
const playerName = "Hero";

console.log(playerName);
console.log(score);

score = 200; // เปลี่ยนค่าได้
console.log(score);

// playerName = "Villain"; // Error! const เปลี่ยนค่าไม่ได้`,
    challenge: {
      description: "สร้างตัวแปรเก็บอายุและชื่อ แล้วพิมพ์ออกมา",
      starterCode: `// สร้างตัวแปร
let age = 25;
const name = "Hero";

console.log(name, age);`,
      expectedOutput: "Hero 25",
      hints: ["ใช้ let สำหรับ age", "ใช้ const สำหรับ name"]
    },
    quiz: [
      {
        question: "คำสั่งใดใช้ประกาศตัวแปรที่เปลี่ยนค่าได้?",
        options: ["const", "let", "final", "static"],
        correctAnswer: 1
      },
      {
        question: "ชื่อตัวแปรใดถูกต้อง?",
        options: ["1stPlayer", "player name", "playerScore", "player-score"],
        correctAnswer: 2
      },
      {
        question: "const ใช้ทำอะไร?",
        options: ["ประกาศตัวแปรที่เปลี่ยนค่าได้", "ประกาศค่าคงที่", "สร้าง function", "วน loop"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "learn-basics-3",
    topicId: "topic-basics",
    slug: "data-types",
    title: "Data Types",
    titleTh: "ชนิดข้อมูล",
    description: "Numbers, Strings, Booleans",
    order: 3,
    duration: 15,
    content: `
# ชนิดข้อมูล

## 1. Number (ตัวเลข)
\`\`\`javascript
let age = 25;
let price = 99.99;
let negative = -10;
\`\`\`

## 2. String (ข้อความ)
\`\`\`javascript
let name = "John";
let message = 'Hello';
let template = \`Hello \${name}\`;
\`\`\`

## 3. Boolean (จริง/เท็จ)
\`\`\`javascript
let isActive = true;
let isGameOver = false;
\`\`\`

## 4. Undefined & Null
\`\`\`javascript
let notDefined;       // undefined
let empty = null;     // null (ตั้งใจให้ว่าง)
\`\`\`
    `,
    codeExample: `// Number
let score = 100;
let health = 75.5;

// String  
let playerName = "Hero";
let greeting = \`Hello \${playerName}!\`;

// Boolean
let isAlive = true;

console.log(typeof score);      // "number"
console.log(typeof playerName); // "string"
console.log(typeof isAlive);    // "boolean"
console.log(greeting);          // "Hello Hero!"`,
    challenge: {
      description: "ใช้ typeof เพื่อหาชนิดของตัวแปร myVar",
      starterCode: `let myVar = "Hello";

// ใช้ typeof แล้วพิมพ์ผลลัพธ์
console.log(typeof myVar);`,
      expectedOutput: "string",
      hints: ["typeof จะคืนค่าเป็น string บอกชนิดข้อมูล", "ใช้ typeof ตัวแปร"]
    },
    quiz: [
      {
        question: "ค่า true หรือ false เป็นชนิดข้อมูลอะไร?",
        options: ["String", "Number", "Boolean", "Object"],
        correctAnswer: 2
      },
      {
        question: "typeof 42 จะได้ผลลัพธ์อะไร?",
        options: ["\"integer\"", "\"number\"", "\"numeric\"", "\"float\""],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "learn-basics-4",
    topicId: "topic-basics",
    slug: "operators",
    title: "Operators",
    titleTh: "ตัวดำเนินการ",
    description: "Arithmetic and comparison operators",
    order: 4,
    duration: 15,
    content: `
# Operators

## Arithmetic Operators (คำนวณ)
\`\`\`javascript
let a = 10 + 5;  // 15 (บวก)
let b = 10 - 5;  // 5  (ลบ)
let c = 10 * 5;  // 50 (คูณ)
let d = 10 / 5;  // 2  (หาร)
let e = 10 % 3;  // 1  (เศษ)
let f = 2 ** 3;  // 8  (ยกกำลัง)
\`\`\`

## Comparison Operators (เปรียบเทียบ)
\`\`\`javascript
10 > 5    // true  (มากกว่า)
10 < 5    // false (น้อยกว่า)
10 >= 10  // true  (มากกว่าหรือเท่ากับ)
10 === 10 // true  (เท่ากับ)
10 !== 5  // true  (ไม่เท่ากับ)
\`\`\`

## Logical Operators (ตรรกะ)
\`\`\`javascript
true && true   // true  (และ)
true || false  // true  (หรือ)
!true          // false (กลับค่า)
\`\`\`
    `,
    codeExample: `let a = 10;
let b = 5;

console.log("a + b =", a + b);
console.log("a - b =", a - b);
console.log("a * b =", a * b);
console.log("a / b =", a / b);
console.log("a % b =", a % b);
console.log("a > b:", a > b);
console.log("a === 10:", a === 10);`,
    challenge: {
      description: "คำนวณพื้นที่สี่เหลี่ยม (กว้าง x ยาว)",
      starterCode: `let width = 5;
let height = 10;

// คำนวณพื้นที่
let area = width * height;

console.log("พื้นที่ =", area);`,
      expectedOutput: "พื้นที่ = 50",
      hints: ["ใช้ * เพื่อคูณ", "area = width * height"]
    },
    quiz: [
      {
        question: "10 % 3 จะได้ผลลัพธ์เท่าไหร่?",
        options: ["3", "1", "0", "3.33"],
        correctAnswer: 1
      },
      {
        question: "ตัวดำเนินการใดใช้เปรียบเทียบว่าเท่ากัน?",
        options: ["=", "==", "===", "!="],
        correctAnswer: 2
      },
      {
        question: "true && false จะได้ผลลัพธ์อะไร?",
        options: ["true", "false", "undefined", "error"],
        correctAnswer: 1
      }
    ]
  },

  // ============================================
  // Topic: Control Flow
  // ============================================
  {
    id: "learn-control-1",
    topicId: "topic-control",
    slug: "if-else",
    title: "If...Else",
    titleTh: "เงื่อนไข If...Else",
    description: "Conditional statements",
    order: 1,
    duration: 15,
    content: `
# If...Else

ใช้ตัดสินใจว่าจะทำอะไรตามเงื่อนไข

## โครงสร้างพื้นฐาน
\`\`\`javascript
if (condition) {
  // ทำเมื่อ condition เป็น true
} else {
  // ทำเมื่อ condition เป็น false
}
\`\`\`

## หลายเงื่อนไข
\`\`\`javascript
let score = 85;

if (score >= 80) {
  console.log("เกรด A");
} else if (score >= 70) {
  console.log("เกรด B");
} else if (score >= 60) {
  console.log("เกรด C");
} else {
  console.log("เกรด F");
}
\`\`\`
    `,
    codeExample: `let age = 18;

if (age >= 18) {
  console.log("คุณเป็นผู้ใหญ่แล้ว");
} else {
  console.log("คุณยังเป็นเด็ก");
}

// Ternary operator (แบบสั้น)
let status = age >= 18 ? "ผู้ใหญ่" : "เด็ก";
console.log("สถานะ:", status);`,
    challenge: {
      description: "เช็คว่า score เกิน 50 หรือไม่ ถ้าเกินให้พิมพ์ 'ผ่าน'",
      starterCode: `let score = 75;

// เขียน if statement
if (score > 50) {
  console.log("ผ่าน");
} else {
  console.log("ไม่ผ่าน");
}`,
      expectedOutput: "ผ่าน",
      hints: ["ใช้ score > 50 หรือ score >= 50", "อย่าลืมปีกกา {}"]
    },
    quiz: [
      {
        question: "else if ใช้ทำอะไร?",
        options: ["จบ loop", "เช็คเงื่อนไขเพิ่มเติม", "สร้าง function", "ประกาศตัวแปร"],
        correctAnswer: 1
      },
      {
        question: "ถ้า if condition เป็น false จะเกิดอะไร?",
        options: ["Error", "ทำ code ใน if", "ทำ code ใน else", "หยุดทำงาน"],
        correctAnswer: 2
      }
    ]
  },
  {
    id: "learn-control-2",
    topicId: "topic-control",
    slug: "for-loop",
    title: "For Loop",
    titleTh: "For Loop",
    description: "Repeating code with for loop",
    order: 2,
    duration: 15,
    content: `
# For Loop

ใช้ทำซ้ำตามจำนวนรอบที่กำหนด

## โครงสร้าง
\`\`\`javascript
for (เริ่มต้น; เงื่อนไข; เพิ่มค่า) {
  // code ที่ทำซ้ำ
}
\`\`\`

## ตัวอย่าง
\`\`\`javascript
for (let i = 1; i <= 5; i++) {
  console.log("รอบที่", i);
}
\`\`\`

## ส่วนประกอบ
1. \`let i = 1\` - ค่าเริ่มต้น
2. \`i <= 5\` - เงื่อนไข (ทำซ้ำตราบที่เป็น true)
3. \`i++\` - เพิ่มค่าหลังทำแต่ละรอบ
    `,
    codeExample: `// นับ 1 ถึง 5
console.log("นับขึ้น:");
for (let i = 1; i <= 5; i++) {
  console.log(i);
}

// นับถอยหลัง
console.log("\\nนับถอยหลัง:");
for (let i = 5; i >= 1; i--) {
  console.log(i);
}`,
    challenge: {
      description: "ใช้ loop พิมพ์ตัวเลข 1 ถึง 3",
      starterCode: `// เขียน for loop
for (let i = 1; i <= 3; i++) {
  console.log(i);
}`,
      expectedOutput: "1\n2\n3",
      hints: ["เริ่มที่ i = 1", "เงื่อนไข i <= 3", "เพิ่มค่า i++"]
    },
    quiz: [
      {
        question: "i++ หมายความว่าอะไร?",
        options: ["i = i - 1", "i = i + 1", "i = i * 2", "i = 0"],
        correctAnswer: 1
      },
      {
        question: "for loop จะหยุดเมื่อไหร่?",
        options: ["เมื่อ code จบ", "เมื่อ condition เป็น false", "ไม่เคยหยุด", "เมื่อเจอ continue"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "learn-control-3",
    topicId: "topic-control",
    slug: "while-loop",
    title: "While Loop",
    titleTh: "While Loop",
    description: "Loop with condition",
    order: 3,
    duration: 12,
    content: `
# While Loop

ทำซ้ำตราบที่เงื่อนไขเป็น true

## โครงสร้าง
\`\`\`javascript
while (condition) {
  // code ที่ทำซ้ำ
}
\`\`\`

## ตัวอย่าง
\`\`\`javascript
let count = 0;
while (count < 3) {
  console.log(count);
  count++;
}
\`\`\`

## Do-While (ทำอย่างน้อย 1 รอบ)
\`\`\`javascript
do {
  // code
} while (condition);
\`\`\`
    `,
    codeExample: `let hp = 100;

console.log("เริ่มเกม HP:", hp);

while (hp > 0) {
  hp -= 30;
  console.log("โดนตี! HP เหลือ:", hp);
}

console.log("Game Over!");`,
    challenge: {
      description: "ใช้ while loop นับ 1, 2, 3",
      starterCode: `let i = 1;

while (i <= 3) {
  console.log(i);
  i++;
}`,
      expectedOutput: "1\n2\n3",
      hints: ["เริ่มที่ i = 1", "เงื่อนไข i <= 3", "อย่าลืม i++ ไม่งั้น loop ไม่จบ"]
    },
    quiz: [
      {
        question: "while loop ต่างจาก for loop อย่างไร?",
        options: ["ทำซ้ำไม่ได้", "ไม่มีเงื่อนไข", "ไม่รู้จำนวนรอบล่วงหน้า", "เร็วกว่า"],
        correctAnswer: 2
      }
    ]
  },

  // ============================================
  // Topic: Functions
  // ============================================
  {
    id: "learn-functions-1",
    topicId: "topic-functions",
    slug: "function-basics",
    title: "Function Basics",
    titleTh: "พื้นฐานฟังก์ชัน",
    description: "Creating and calling functions",
    order: 1,
    duration: 15,
    content: `
# ฟังก์ชัน

ฟังก์ชันคือชุดคำสั่งที่สามารถเรียกใช้ซ้ำได้

## ประกาศฟังก์ชัน
\`\`\`javascript
function greet(name) {
  console.log("Hello, " + name);
}
\`\`\`

## เรียกใช้ฟังก์ชัน
\`\`\`javascript
greet("John"); // Hello, John
greet("Jane"); // Hello, Jane
\`\`\`

## Return ค่า
\`\`\`javascript
function add(a, b) {
  return a + b;
}

let result = add(5, 3); // result = 8
\`\`\`
    `,
    codeExample: `function add(a, b) {
  return a + b;
}

function greet(name) {
  return "Hello, " + name + "!";
}

let sum = add(5, 3);
let message = greet("Hero");

console.log("5 + 3 =", sum);
console.log(message);`,
    challenge: {
      description: "สร้างฟังก์ชัน multiply ที่คูณเลขสองตัว",
      starterCode: `function multiply(a, b) {
  return a * b;
}

console.log(multiply(4, 5));`,
      expectedOutput: "20",
      hints: ["ใช้ return a * b", "อย่าลืม return"]
    },
    quiz: [
      {
        question: "function ใช้ทำอะไร?",
        options: ["เก็บข้อมูล", "รวม code ที่ใช้ซ้ำได้", "สร้าง loop", "ประกาศตัวแปร"],
        correctAnswer: 1
      },
      {
        question: "return ทำอะไร?",
        options: ["จบ function", "ส่งค่ากลับและจบ function", "พิมพ์ค่า", "สร้าง loop"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "learn-functions-2",
    topicId: "topic-functions",
    slug: "arrow-functions",
    title: "Arrow Functions",
    titleTh: "Arrow Functions",
    description: "Modern function syntax",
    order: 2,
    duration: 15,
    content: `
# Arrow Functions

วิธีเขียนฟังก์ชันแบบสั้นกระชับ (ES6+)

## เปรียบเทียบ
\`\`\`javascript
// แบบปกติ
function add(a, b) {
  return a + b;
}

// Arrow Function
const add = (a, b) => a + b;
\`\`\`

## รูปแบบต่างๆ
\`\`\`javascript
// หลายบรรทัด
const greet = (name) => {
  const msg = "Hello, " + name;
  return msg;
};

// Parameter ตัวเดียว (ไม่ต้องมีวงเล็บ)
const double = n => n * 2;
\`\`\`
    `,
    codeExample: `const greet = (name) => "Hello, " + name;

const add = (a, b) => a + b;

const double = n => n * 2;

console.log(greet("John"));
console.log(add(10, 5));
console.log(double(7));`,
    challenge: {
      description: "สร้าง arrow function ที่ยกกำลังสอง",
      starterCode: `const square = n => n * n;

console.log(square(5));`,
      expectedOutput: "25",
      hints: ["ใช้ n * n หรือ n ** 2", "arrow function ไม่ต้อง return ถ้าบรรทัดเดียว"]
    },
    quiz: [
      {
        question: "Arrow function ต่างจาก function ปกติอย่างไร?",
        options: ["ทำงานเร็วกว่า", "สั้นกว่า ไม่มี this ของตัวเอง", "ใช้ parameter ไม่ได้", "ไม่มี return"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "learn-functions-3",
    topicId: "topic-functions",
    slug: "scope",
    title: "Scope",
    titleTh: "ขอบเขตตัวแปร",
    description: "Variable scope and closure",
    order: 3,
    duration: 15,
    content: `
# Scope (ขอบเขตตัวแปร)

## Global Scope
\`\`\`javascript
let globalVar = "ใช้ได้ทุกที่";

function test() {
  console.log(globalVar); // OK
}
\`\`\`

## Local Scope
\`\`\`javascript
function test() {
  let localVar = "ใช้ได้ใน function นี้เท่านั้น";
  console.log(localVar); // OK
}
// console.log(localVar); // Error!
\`\`\`

## Block Scope (let, const)
\`\`\`javascript
if (true) {
  let blockVar = "ใช้ได้ใน block นี้";
}
// console.log(blockVar); // Error!
\`\`\`
    `,
    codeExample: `let globalScore = 100;

function updateScore(points) {
  let bonus = 10;
  globalScore += points + bonus;
  console.log("Bonus:", bonus);
  console.log("Total:", globalScore);
}

updateScore(50);
console.log("Final Score:", globalScore);
// console.log(bonus); // Error - bonus is local`,
    challenge: {
      description: "สร้าง function ที่เข้าถึง global variable",
      starterCode: `let playerName = "Hero";

function showPlayer() {
  console.log("Player:", playerName);
}

showPlayer();`,
      expectedOutput: "Player: Hero",
      hints: ["Global variable ใช้ได้ใน function", "ไม่ต้องส่งเป็น parameter"]
    },
    quiz: [
      {
        question: "let และ const มี scope แบบไหน?",
        options: ["Global เสมอ", "Function scope", "Block scope", "ไม่มี scope"],
        correctAnswer: 2
      }
    ]
  },

  // ============================================
  // Topic: Objects & Arrays
  // ============================================
  {
    id: "learn-objects-1",
    topicId: "topic-objects",
    slug: "objects",
    title: "Objects",
    titleTh: "Objects",
    description: "Creating and using objects",
    order: 1,
    duration: 20,
    content: `
# Objects

Object เก็บข้อมูลเป็นคู่ key-value

## สร้าง Object
\`\`\`javascript
const player = {
  name: "Hero",
  level: 10,
  health: 100
};
\`\`\`

## เข้าถึงข้อมูล
\`\`\`javascript
console.log(player.name);    // "Hero"
console.log(player["level"]); // 10
\`\`\`

## แก้ไขข้อมูล
\`\`\`javascript
player.health = 80;
player.mana = 50; // เพิ่ม property ใหม่
\`\`\`
    `,
    codeExample: `const player = {
  name: "Hero",
  health: 100,
  attack: 25,
  defend: function() {
    console.log(this.name + " is defending!");
  }
};

console.log(player.name);
console.log("HP:", player.health);

player.health = 80;
console.log("HP หลังโดนตี:", player.health);

player.defend();`,
    challenge: {
      description: "สร้าง object ที่มี name และ level แล้วพิมพ์ออกมา",
      starterCode: `const enemy = {
  name: "Slime",
  level: 5
};

console.log(enemy.name, "Lv.", enemy.level);`,
      expectedOutput: "Slime Lv. 5",
      hints: ["ใช้ {} เพื่อสร้าง object", "ใช้ . เพื่อเข้าถึง property"]
    },
    quiz: [
      {
        question: "Object เก็บข้อมูลแบบไหน?",
        options: ["ตัวเลขเท่านั้น", "คู่ key-value", "แบบ array", "text เท่านั้น"],
        correctAnswer: 1
      },
      {
        question: "วิธีเข้าถึง property ของ object?",
        options: ["object.property", "object(property)", "object[property]", "ทั้ง A และ C"],
        correctAnswer: 3
      }
    ]
  },
  {
    id: "learn-objects-2",
    topicId: "topic-objects",
    slug: "arrays",
    title: "Arrays",
    titleTh: "Arrays",
    description: "Working with arrays",
    order: 2,
    duration: 20,
    content: `
# Arrays

Array เก็บข้อมูลหลายค่าในตัวแปรเดียว

## สร้าง Array
\`\`\`javascript
const fruits = ["Apple", "Banana", "Orange"];
const numbers = [1, 2, 3, 4, 5];
\`\`\`

## เข้าถึงข้อมูล (index เริ่มจาก 0)
\`\`\`javascript
console.log(fruits[0]); // "Apple"
console.log(fruits[1]); // "Banana"
\`\`\`

## Array Methods
\`\`\`javascript
fruits.push("Mango");    // เพิ่มท้าย
fruits.pop();            // ลบท้าย
fruits.length;           // จำนวนสมาชิก
\`\`\`
    `,
    codeExample: `const items = ["Sword", "Shield", "Potion"];

console.log("มี", items.length, "ไอเท็ม");
console.log("ไอเท็มแรก:", items[0]);

items.push("Bow");
console.log("เพิ่ม Bow:", items);

items.forEach((item, i) => {
  console.log(i + 1 + ".", item);
});`,
    challenge: {
      description: "สร้าง array ของตัวเลข แล้วหาผลรวม",
      starterCode: `const numbers = [10, 20, 30];

let sum = 0;
for (let num of numbers) {
  sum += num;
}

console.log("ผลรวม:", sum);`,
      expectedOutput: "ผลรวม: 60",
      hints: ["ใช้ for...of หรือ forEach", "sum += num เพื่อบวกเข้า"]
    },
    quiz: [
      {
        question: "Array index เริ่มจากเลขอะไร?",
        options: ["1", "0", "-1", "ไม่มี index"],
        correctAnswer: 1
      },
      {
        question: "push() ทำอะไร?",
        options: ["ลบตัวแรก", "เพิ่มตัวท้าย", "เรียงลำดับ", "กลับด้าน"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "learn-objects-3",
    topicId: "topic-objects",
    slug: "array-methods",
    title: "Array Methods",
    titleTh: "Array Methods",
    description: "map, filter, reduce",
    order: 3,
    duration: 20,
    content: `
# Array Methods ขั้นสูง

## map() - แปลงทุกตัว
\`\`\`javascript
const nums = [1, 2, 3];
const doubled = nums.map(n => n * 2);
// [2, 4, 6]
\`\`\`

## filter() - กรอง
\`\`\`javascript
const nums = [1, 2, 3, 4, 5];
const evens = nums.filter(n => n % 2 === 0);
// [2, 4]
\`\`\`

## reduce() - รวม
\`\`\`javascript
const nums = [1, 2, 3, 4];
const sum = nums.reduce((acc, n) => acc + n, 0);
// 10
\`\`\`
    `,
    codeExample: `const scores = [85, 92, 78, 65, 90];

// map: เพิ่มคะแนน 5
const adjusted = scores.map(s => s + 5);
console.log("ปรับคะแนน:", adjusted);

// filter: เอาเฉพาะที่ผ่าน
const passed = scores.filter(s => s >= 80);
console.log("ผ่าน:", passed);

// reduce: หาผลรวม
const total = scores.reduce((sum, s) => sum + s, 0);
console.log("รวม:", total);`,
    challenge: {
      description: "ใช้ filter หาตัวเลขที่มากกว่า 50",
      starterCode: `const numbers = [25, 75, 50, 100, 30];

const big = numbers.filter(n => n > 50);

console.log(big);`,
      expectedOutput: "[75, 100]",
      hints: ["filter รับ function ที่ return true/false", "n > 50 คือเงื่อนไข"]
    },
    quiz: [
      {
        question: "map() ทำอะไร?",
        options: ["กรองข้อมูล", "แปลงทุกตัวใน array", "รวมข้อมูล", "เรียงลำดับ"],
        correctAnswer: 1
      },
      {
        question: "[1,2,3].filter(n => n > 1) ได้ผลลัพธ์อะไร?",
        options: ["[1, 2, 3]", "[2, 3]", "[1]", "[]"],
        correctAnswer: 1
      }
    ]
  },

  // ============================================
  // Topic: HTML Basics
  // ============================================
  {
    id: "learn-html-1",
    topicId: "topic-html-basics",
    slug: "introduction",
    title: "Introduction to HTML",
    titleTh: "แนะนำ HTML",
    description: "What is HTML and how it works",
    order: 1,
    duration: 15,
    content: `
# แนะนำ HTML

HTML (HyperText Markup Language) คือภาษาหลักสำหรับสร้างเว็บเพจ!

## HTML ทำอะไร?
- 📄 กำหนดโครงสร้างเนื้อหา
- 🏗️ สร้างหัวข้อ, ย่อหน้า, รายการ
- 🔗 สร้าง links และใส่รูปภาพ
- 📝 สร้างแบบฟอร์ม

## โครงสร้างพื้นฐาน
\`\`\`html
<!DOCTYPE html>
<html>
  <head>
    <title>My Page</title>
  </head>
  <body>
    <h1>Hello World!</h1>
  </body>
</html>
\`\`\`
    `,
    codeExample: `<!DOCTYPE html>
<html>
  <head>
    <title>My First Page</title>
  </head>
  <body>
    <h1>Welcome!</h1>
    <p>This is my first webpage.</p>
  </body>
</html>`,
    challenge: {
      description: "สร้างหน้าเว็บพื้นฐานที่มี title และ heading",
      starterCode: `<!DOCTYPE html>
<html>
  <head>
    <title>My Page</title>
  </head>
  <body>
    <h1>Hello World!</h1>
  </body>
</html>`,
      expectedOutput: "Hello World!",
      hints: ["ใช้ <h1> สำหรับหัวข้อหลัก", "title แสดงบน tab ของ browser"]
    },
    quiz: [
      {
        question: "HTML ย่อมาจากอะไร?",
        options: ["Home Tool Markup Language", "HyperText Markup Language", "HighTech Modern Language", "HyperText Machine Language"],
        correctAnswer: 1
      },
      {
        question: "<html> tag ใช้ทำอะไร?",
        options: ["ครอบส่วน head", "กำหนด root element", "สร้างหัวข้อ", "ใส่ JavaScript"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "learn-html-2",
    topicId: "topic-html-basics",
    slug: "text-elements",
    title: "Text Elements",
    titleTh: "องค์ประกอบข้อความ",
    description: "Headings, paragraphs, and text formatting",
    order: 2,
    duration: 15,
    content: `
# Text Elements

## Headings (หัวข้อ)
\`\`\`html
<h1>Heading ใหญ่สุด</h1>
<h2>Heading 2</h2>
<h3>Heading 3</h3>
<h4>Heading 4</h4>
<h5>Heading 5</h5>
<h6>Heading เล็กสุด</h6>
\`\`\`

## Paragraphs (ย่อหน้า)
\`\`\`html
<p>This is a paragraph.</p>
<p>Another paragraph.</p>
\`\`\`

## Text Formatting
\`\`\`html
<strong>ตัวหนา</strong>
<em>ตัวเอียง</em>
<br> ขึ้นบรรทัดใหม่
\`\`\`
    `,
    codeExample: `<h1>Welcome to My Website</h1>
<h2>About Me</h2>
<p>Hello! I'm learning <strong>HTML</strong>.</p>
<p>It's really <em>fun</em> to create websites!</p>

<h2>My Skills</h2>
<p>I can create:</p>
<p>- Headings<br>- Paragraphs<br>- Formatted text</p>`,
    challenge: {
      description: "สร้างหน้าเว็บที่มี 2 headings และ 2 paragraphs",
      starterCode: `<h1>My Blog</h1>
<h2>First Post</h2>
<p>This is my <strong>first</strong> blog post.</p>
<p>I'm learning <em>HTML</em> today!</p>`,
      expectedOutput: "My Blog",
      hints: ["h1-h6 สำหรับหัวข้อ", "p สำหรับย่อหน้า"]
    },
    quiz: [
      {
        question: "<h1> ถึง <h6> ต่างกันอย่างไร?",
        options: ["สีต่างกัน", "ขนาดและความสำคัญต่างกัน", "ไม่ต่างกัน", "font ต่างกัน"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "learn-html-3",
    topicId: "topic-html-basics",
    slug: "links-images",
    title: "Links & Images",
    titleTh: "ลิงก์และรูปภาพ",
    description: "Adding links and images to your page",
    order: 3,
    duration: 20,
    content: `
# Links & Images

## Links (ลิงก์)
\`\`\`html
<a href="https://google.com">Go to Google</a>
<a href="about.html">About Page</a>
<a href="#section1">Jump to Section</a>
\`\`\`

## Images (รูปภาพ)
\`\`\`html
<img src="photo.jpg" alt="My Photo">
<img src="https://example.com/logo.png" alt="Logo" width="200">
\`\`\`

## Image as Link
\`\`\`html
<a href="https://google.com">
  <img src="google-logo.png" alt="Google">
</a>
\`\`\`
    `,
    codeExample: `<h1>My Portfolio</h1>

<p>Check out my <a href="https://github.com">GitHub</a>!</p>

<h2>My Photo</h2>
<img src="https://via.placeholder.com/300x200" alt="Profile Photo">

<h2>Quick Links</h2>
<a href="#top">Back to Top</a>`,
    challenge: {
      description: "สร้างหน้าเว็บที่มี link และ image",
      starterCode: `<h1>My Links</h1>

<p>Visit <a href="https://google.com">Google</a></p>

<img src="https://via.placeholder.com/200" alt="Placeholder">`,
      expectedOutput: "My Links",
      hints: ["href ระบุ URL ปลายทาง", "alt ระบุข้อความสำหรับรูปภาพ"]
    },
    quiz: [
      {
        question: "attribute ใดระบุ URL ของ link?",
        options: ["src", "href", "link", "url"],
        correctAnswer: 1
      },
      {
        question: "alt ใน <img> ใช้ทำอะไร?",
        options: ["เปลี่ยนสี", "อธิบายรูปภาพ", "ย่อขนาด", "หมุนรูป"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "learn-html-4",
    topicId: "topic-html-basics",
    slug: "lists",
    title: "Lists",
    titleTh: "รายการ",
    description: "Creating ordered and unordered lists",
    order: 4,
    duration: 15,
    content: `
# Lists (รายการ)

## Unordered List (ไม่เรียงลำดับ)
\`\`\`html
<ul>
  <li>Apple</li>
  <li>Banana</li>
  <li>Orange</li>
</ul>
\`\`\`

## Ordered List (เรียงลำดับ)
\`\`\`html
<ol>
  <li>First step</li>
  <li>Second step</li>
  <li>Third step</li>
</ol>
\`\`\`

## Nested Lists
\`\`\`html
<ul>
  <li>Fruits
    <ul>
      <li>Apple</li>
      <li>Banana</li>
    </ul>
  </li>
</ul>
\`\`\`
    `,
    codeExample: `<h1>My Shopping List</h1>

<h2>Fruits</h2>
<ul>
  <li>Apple</li>
  <li>Banana</li>
  <li>Orange</li>
</ul>

<h2>Recipe Steps</h2>
<ol>
  <li>Wash the fruits</li>
  <li>Cut into pieces</li>
  <li>Mix together</li>
  <li>Enjoy!</li>
</ol>`,
    challenge: {
      description: "สร้าง unordered list ของ 3 items",
      starterCode: `<h1>My Hobbies</h1>

<ul>
  <li>Gaming</li>
  <li>Coding</li>
  <li>Reading</li>
</ul>`,
      expectedOutput: "My Hobbies",
      hints: ["ul สำหรับ unordered list", "ol สำหรับ ordered list"]
    },
    quiz: [
      {
        question: "<ul> สร้าง list แบบไหน?",
        options: ["เรียงลำดับ 1,2,3", "bullet points", "definition list", "table"],
        correctAnswer: 1
      }
    ]
  },

  // ============================================
  // Topic: Semantic HTML
  // ============================================
  {
    id: "learn-html-5",
    topicId: "topic-html-semantic",
    slug: "semantic-intro",
    title: "Introduction to Semantic HTML",
    titleTh: "แนะนำ Semantic HTML",
    description: "What is semantic HTML and why it matters",
    order: 1,
    duration: 15,
    content: `
# Semantic HTML

Semantic HTML ใช้ tags ที่อธิบายความหมายของเนื้อหา

## ทำไมต้อง Semantic?
- 🔍 SEO ดีขึ้น
- ♿ Accessibility ดีขึ้น
- 📖 Code อ่านง่ายขึ้น

## Non-Semantic vs Semantic
\`\`\`html
<!-- Non-Semantic -->
<div id="header">...</div>
<div id="nav">...</div>

<!-- Semantic -->
<header>...</header>
<nav>...</nav>
\`\`\`
    `,
    codeExample: `<header>
  <h1>My Website</h1>
  <nav>
    <a href="/">Home</a>
    <a href="/about">About</a>
  </nav>
</header>

<main>
  <article>
    <h2>Welcome!</h2>
    <p>This is semantic HTML.</p>
  </article>
</main>

<footer>
  <p>© 2024 My Website</p>
</footer>`,
    challenge: {
      description: "สร้างโครงสร้างเว็บด้วย semantic tags",
      starterCode: `<header>
  <h1>My Blog</h1>
</header>

<main>
  <article>
    <h2>First Post</h2>
    <p>Hello World!</p>
  </article>
</main>

<footer>
  <p>© 2024</p>
</footer>`,
      expectedOutput: "My Blog",
      hints: ["header, main, footer, article, nav, section"]
    },
    quiz: [
      {
        question: "Semantic HTML ช่วยเรื่องอะไร?",
        options: ["แค่สวยขึ้น", "SEO และ Accessibility", "Load เร็วขึ้น", "ใช้ memory น้อยลง"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "learn-html-6",
    topicId: "topic-html-semantic",
    slug: "layout-elements",
    title: "Layout Elements",
    titleTh: "องค์ประกอบ Layout",
    description: "header, nav, main, footer, section, article",
    order: 2,
    duration: 20,
    content: `
# Layout Elements

## header
\`\`\`html
<header>
  <h1>Site Title</h1>
  <nav>...</nav>
</header>
\`\`\`

## nav
\`\`\`html
<nav>
  <a href="/">Home</a>
  <a href="/about">About</a>
</nav>
\`\`\`

## main
\`\`\`html
<main>
  <!-- เนื้อหาหลัก -->
</main>
\`\`\`

## footer
\`\`\`html
<footer>
  <p>Copyright 2024</p>
</footer>
\`\`\`

## section & article
\`\`\`html
<section>
  <article>...</article>
  <article>...</article>
</section>
\`\`\`
    `,
    codeExample: `<header>
  <h1>News Site</h1>
  <nav>
    <a href="/">Home</a>
    <a href="/tech">Tech</a>
    <a href="/sports">Sports</a>
  </nav>
</header>

<main>
  <section>
    <h2>Latest News</h2>
    <article>
      <h3>Breaking News</h3>
      <p>Something happened today...</p>
    </article>
  </section>
</main>

<footer>
  <p>Contact: news@example.com</p>
</footer>`,
    challenge: {
      description: "สร้าง layout ด้วย header, nav, main, footer",
      starterCode: `<header>
  <h1>My Site</h1>
  <nav>
    <a href="/">Home</a>
    <a href="/blog">Blog</a>
  </nav>
</header>

<main>
  <h2>Welcome</h2>
  <p>Main content here.</p>
</main>

<footer>
  <p>© 2024</p>
</footer>`,
      expectedOutput: "My Site",
      hints: ["header อยู่บนสุด", "main คือเนื้อหาหลัก", "footer อยู่ล่างสุด"]
    },
    quiz: [
      {
        question: "<main> ใช้กี่ครั้งในหน้าเว็บ?",
        options: ["ไม่จำกัด", "1 ครั้งเท่านั้น", "2 ครั้ง", "ไม่ควรใช้"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "learn-html-7",
    topicId: "topic-html-semantic",
    slug: "forms",
    title: "Forms",
    titleTh: "แบบฟอร์ม",
    description: "Creating forms and input elements",
    order: 3,
    duration: 25,
    content: `
# Forms (แบบฟอร์ม)

## Basic Form
\`\`\`html
<form action="/submit" method="POST">
  <label for="name">Name:</label>
  <input type="text" id="name" name="name">
  <button type="submit">Submit</button>
</form>
\`\`\`

## Input Types
\`\`\`html
<input type="text" placeholder="Text">
<input type="email" placeholder="Email">
<input type="password" placeholder="Password">
<input type="number" min="0" max="100">
<input type="checkbox"> Remember me
<input type="radio" name="gender" value="m"> Male
\`\`\`

## Textarea
\`\`\`html
<textarea rows="4" cols="50">
Text here...
</textarea>
\`\`\`
    `,
    codeExample: `<form>
  <h2>Contact Form</h2>
  
  <label for="name">Name:</label>
  <input type="text" id="name" name="name" required>
  
  <label for="email">Email:</label>
  <input type="email" id="email" name="email" required>
  
  <label for="message">Message:</label>
  <textarea id="message" name="message" rows="4"></textarea>
  
  <button type="submit">Send Message</button>
</form>`,
    challenge: {
      description: "สร้างแบบฟอร์ม login ง่ายๆ",
      starterCode: `<form>
  <h2>Login</h2>
  
  <label for="username">Username:</label>
  <input type="text" id="username" name="username">
  
  <label for="password">Password:</label>
  <input type="password" id="password" name="password">
  
  <button type="submit">Login</button>
</form>`,
      expectedOutput: "Login",
      hints: ["label ช่วย accessibility", "input type ระบุชนิดข้อมูล"]
    },
    quiz: [
      {
        question: "input type='password' ทำอะไร?",
        options: ["ตรวจรหัสผ่าน", "ซ่อนตัวอักษรที่พิมพ์", "เข้ารหัส", "ส่งข้อมูล"],
        correctAnswer: 1
      },
      {
        question: "label for='email' เชื่อมกับอะไร?",
        options: ["name='email'", "id='email'", "class='email'", "type='email'"],
        correctAnswer: 1
      }
    ]
  },

  // ============================================
  // Topic: Classes & OOP
  // ============================================
  {
    id: "learn-classes-1",
    topicId: "topic-classes",
    slug: "class-basics",
    title: "Class Basics",
    titleTh: "พื้นฐาน Class",
    description: "Creating classes and objects",
    order: 1,
    duration: 20,
    content: `
# Class คืออะไร?

Class เป็นพิมพ์เขียว (blueprint) สำหรับสร้าง Object

## สร้าง Class
\`\`\`javascript
class Player {
  constructor(name, level) {
    this.name = name;
    this.level = level;
  }
  
  greet() {
    console.log(\`Hello, I'm \${this.name}\`);
  }
}
\`\`\`

## สร้าง Object
\`\`\`javascript
const player1 = new Player("Hero", 10);
player1.greet(); // Hello, I'm Hero
\`\`\`

## this
\`this\` หมายถึง object ปัจจุบัน
    `,
    codeExample: `class Player {
  constructor(name, level) {
    this.name = name;
    this.level = level;
    this.health = 100;
  }
  
  attack() {
    console.log(this.name + " attacks!");
  }
  
  levelUp() {
    this.level++;
    console.log(this.name + " is now level " + this.level);
  }
}

const hero = new Player("Hero", 1);
console.log(hero.name, "Lv.", hero.level);
hero.attack();
hero.levelUp();`,
    challenge: {
      description: "สร้าง class Enemy ที่มี name และ health",
      starterCode: `class Enemy {
  constructor(name, health) {
    this.name = name;
    this.health = health;
  }
  
  takeDamage(damage) {
    this.health -= damage;
    console.log(this.name + " HP: " + this.health);
  }
}

const slime = new Enemy("Slime", 50);
slime.takeDamage(10);`,
      expectedOutput: "Slime HP: 40",
      hints: ["ใช้ class keyword", "constructor รับ parameters"]
    },
    quiz: [
      {
        question: "Class ใช้ทำอะไร?",
        options: ["เก็บข้อมูล", "เป็นพิมพ์เขียวสร้าง Object", "สร้าง loop", "ประกาศตัวแปร"],
        correctAnswer: 1
      },
      {
        question: "this ใน class หมายถึง?",
        options: ["Global object", "Object ปัจจุบัน", "Class parent", "Function"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "learn-classes-2",
    topicId: "topic-classes",
    slug: "inheritance",
    title: "Inheritance",
    titleTh: "การสืบทอด",
    description: "Extending classes",
    order: 2,
    duration: 20,
    content: `
# Inheritance (การสืบทอด)

Class สามารถสืบทอดคุณสมบัติจาก class อื่นได้

## extends
\`\`\`javascript
class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    console.log(this.name + " makes a sound");
  }
}

class Dog extends Animal {
  speak() {
    console.log(this.name + " barks!");
  }
}
\`\`\`

## super
\`\`\`javascript
class Cat extends Animal {
  constructor(name, color) {
    super(name); // เรียก parent constructor
    this.color = color;
  }
}
\`\`\`
    `,
    codeExample: `class Character {
  constructor(name, health) {
    this.name = name;
    this.health = health;
  }
  
  attack() {
    console.log(this.name + " attacks!");
  }
}

class Warrior extends Character {
  constructor(name) {
    super(name, 150);
    this.weapon = "Sword";
  }
  
  attack() {
    console.log(this.name + " slashes with " + this.weapon + "!");
  }
}

const warrior = new Warrior("Knight");
console.log(warrior.name, "HP:", warrior.health);
warrior.attack();`,
    challenge: {
      description: "สร้าง class Mage ที่สืบทอดจาก Character",
      starterCode: `class Character {
  constructor(name, health) {
    this.name = name;
    this.health = health;
  }
}

class Mage extends Character {
  constructor(name) {
    super(name, 80);
    this.mana = 100;
  }
  
  castSpell() {
    console.log(this.name + " casts Fireball!");
  }
}

const mage = new Mage("Wizard");
console.log(mage.name, "HP:", mage.health, "MP:", mage.mana);
mage.castSpell();`,
      expectedOutput: "Wizard HP: 80 MP: 100\nWizard casts Fireball!",
      hints: ["ใช้ extends", "super() เรียก parent constructor"]
    },
    quiz: [
      {
        question: "extends ใช้ทำอะไร?",
        options: ["สร้าง function", "สืบทอด class", "ประกาศตัวแปร", "สร้าง loop"],
        correctAnswer: 1
      },
      {
        question: "super() ทำอะไร?",
        options: ["สร้าง object ใหม่", "เรียก constructor ของ parent", "ลบ object", "หยุด program"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "learn-classes-3",
    topicId: "topic-classes",
    slug: "static-methods",
    title: "Static Methods",
    titleTh: "Static Methods",
    description: "Class-level methods and properties",
    order: 3,
    duration: 15,
    content: `
# Static Methods

Static methods เรียกใช้ได้โดยไม่ต้องสร้าง instance

## ประกาศ Static Method
\`\`\`javascript
class MathHelper {
  static add(a, b) {
    return a + b;
  }
  
  static PI = 3.14159;
}
\`\`\`

## ใช้งาน
\`\`\`javascript
MathHelper.add(5, 3);  // 8
MathHelper.PI;         // 3.14159

// ไม่ต้อง new
// const helper = new MathHelper();
\`\`\`
    `,
    codeExample: `class GameUtils {
  static generateId() {
    return Math.random().toString(36).substr(2, 9);
  }
  
  static rollDice() {
    return Math.floor(Math.random() * 6) + 1;
  }
  
  static MAX_LEVEL = 100;
}

console.log("Player ID:", GameUtils.generateId());
console.log("Dice roll:", GameUtils.rollDice());
console.log("Max Level:", GameUtils.MAX_LEVEL);`,
    challenge: {
      description: "สร้าง class Calculator ที่มี static methods",
      starterCode: `class Calculator {
  static add(a, b) {
    return a + b;
  }
  
  static multiply(a, b) {
    return a * b;
  }
}

console.log("5 + 3 =", Calculator.add(5, 3));
console.log("4 * 7 =", Calculator.multiply(4, 7));`,
      expectedOutput: "5 + 3 = 8\n4 * 7 = 28",
      hints: ["ใช้ static keyword", "เรียกใช้โดย ClassName.method()"]
    },
    quiz: [
      {
        question: "Static method ต่างจาก method ปกติอย่างไร?",
        options: ["เร็วกว่า", "ไม่ต้องสร้าง instance", "มี this", "ใส่ parameter ไม่ได้"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "learn-classes-4",
    topicId: "topic-classes",
    slug: "getters-setters",
    title: "Getters & Setters",
    titleTh: "Getters & Setters",
    description: "Computed properties and validation",
    order: 4,
    duration: 15,
    content: `
# Getters & Setters

ใช้ควบคุมการเข้าถึง properties

## Getter
\`\`\`javascript
class Circle {
  constructor(radius) {
    this._radius = radius;
  }
  
  get area() {
    return Math.PI * this._radius ** 2;
  }
}

const c = new Circle(5);
console.log(c.area); // ไม่ต้อง ()
\`\`\`

## Setter
\`\`\`javascript
class Player {
  set health(value) {
    this._health = Math.max(0, value); // ไม่ต่ำกว่า 0
  }
}
\`\`\`
    `,
    codeExample: `class Player {
  constructor(name) {
    this.name = name;
    this._level = 1;
    this._exp = 0;
  }
  
  get level() {
    return this._level;
  }
  
  set exp(value) {
    this._exp = value;
    if (this._exp >= 100) {
      this._level++;
      this._exp = 0;
      console.log("Level Up! Now Lv." + this._level);
    }
  }
  
  get exp() {
    return this._exp;
  }
}

const hero = new Player("Hero");
console.log("Level:", hero.level);
hero.exp = 50;
console.log("Exp:", hero.exp);
hero.exp = 100;`,
    challenge: {
      description: "สร้าง class ที่มี getter คำนวณ fullName",
      starterCode: `class Person {
  constructor(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
  }
  
  get fullName() {
    return this.firstName + " " + this.lastName;
  }
}

const person = new Person("John", "Doe");
console.log(person.fullName);`,
      expectedOutput: "John Doe",
      hints: ["ใช้ get keyword", "ไม่ต้องใช้ () ตอนเรียก"]
    },
    quiz: [
      {
        question: "Getter ใช้ทำอะไร?",
        options: ["ลบ property", "อ่านค่าแบบคำนวณ", "สร้าง object", "สร้าง loop"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "learn-classes-5",
    topicId: "topic-classes",
    slug: "private-fields",
    title: "Private Fields",
    titleTh: "Private Fields",
    description: "Encapsulation with private properties",
    order: 5,
    duration: 15,
    content: `
# Private Fields

ปกป้อง properties ไม่ให้เข้าถึงจากภายนอก

## # prefix (ES2022+)
\`\`\`javascript
class BankAccount {
  #balance = 0;
  
  deposit(amount) {
    this.#balance += amount;
  }
  
  getBalance() {
    return this.#balance;
  }
}

const acc = new BankAccount();
acc.deposit(100);
console.log(acc.getBalance()); // 100
// console.log(acc.#balance); // Error!
\`\`\`

## ประโยชน์
- ป้องกันการแก้ไขโดยตรง
- ซ่อน implementation details
    `,
    codeExample: `class Inventory {
  #items = [];
  #maxSlots = 10;
  
  addItem(item) {
    if (this.#items.length < this.#maxSlots) {
      this.#items.push(item);
      console.log("Added:", item);
      return true;
    }
    console.log("Inventory full!");
    return false;
  }
  
  getItems() {
    return [...this.#items]; // return copy
  }
  
  get count() {
    return this.#items.length;
  }
}

const inv = new Inventory();
inv.addItem("Sword");
inv.addItem("Potion");
console.log("Items:", inv.getItems());
console.log("Count:", inv.count);`,
    challenge: {
      description: "สร้าง class ที่มี private password field",
      starterCode: `class User {
  #password;
  
  constructor(username, password) {
    this.username = username;
    this.#password = password;
  }
  
  checkPassword(input) {
    return input === this.#password;
  }
}

const user = new User("admin", "secret123");
console.log("Check 'wrong':", user.checkPassword("wrong"));
console.log("Check 'secret123':", user.checkPassword("secret123"));`,
      expectedOutput: "Check 'wrong': false\nCheck 'secret123': true",
      hints: ["ใช้ # นำหน้าชื่อ field", "เข้าถึง private ได้เฉพาะใน class"]
    },
    quiz: [
      {
        question: "Private field ใช้สัญลักษณ์อะไร?",
        options: ["_", "#", "@", "$"],
        correctAnswer: 1
      }
    ]
  },

  // ============================================
  // Topic: Async JavaScript
  // ============================================
  {
    id: "learn-async-1",
    topicId: "topic-async",
    slug: "callbacks",
    title: "Callbacks",
    titleTh: "Callbacks",
    description: "Understanding callback functions",
    order: 1,
    duration: 15,
    content: `
# Callbacks

Callback คือ function ที่ส่งไปให้ function อื่นเรียกใช้ทีหลัง

## ตัวอย่าง
\`\`\`javascript
function greet(name, callback) {
  console.log("Hello, " + name);
  callback();
}

greet("John", function() {
  console.log("Done greeting!");
});
\`\`\`

## setTimeout
\`\`\`javascript
setTimeout(() => {
  console.log("3 seconds later...");
}, 3000);
\`\`\`

## Callback Hell 😱
callbacks ซ้อนกันมากๆ อ่านยาก
    `,
    codeExample: `// setTimeout ใช้ callback
console.log("Start");

setTimeout(() => {
  console.log("After 1 second");
}, 1000);

setTimeout(() => {
  console.log("After 2 seconds");
}, 2000);

console.log("End (but runs first!)");

// Array methods ก็ใช้ callback
const nums = [1, 2, 3];
nums.forEach(n => console.log("Number:", n));`,
    challenge: {
      description: "ใช้ setTimeout แสดงข้อความหลังจาก 1 วินาที",
      starterCode: `console.log("Start");

setTimeout(() => {
  console.log("Hello after 1 second!");
}, 1000);

console.log("End");`,
      expectedOutput: "Start\nEnd\nHello after 1 second!",
      hints: ["setTimeout รับ callback และเวลา (ms)", "1000 ms = 1 second"]
    },
    quiz: [
      {
        question: "Callback คืออะไร?",
        options: ["Variable", "Function ที่ส่งไปให้เรียกทีหลัง", "Loop", "Class"],
        correctAnswer: 1
      },
      {
        question: "setTimeout(fn, 2000) จะเรียก fn หลังจากกี่วินาที?",
        options: ["1", "2", "20", "2000"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "learn-async-2",
    topicId: "topic-async",
    slug: "promises",
    title: "Promises",
    titleTh: "Promises",
    description: "Working with Promises",
    order: 2,
    duration: 20,
    content: `
# Promises

Promise เป็นวิธีจัดการ async ที่ดีกว่า callback

## สถานะ
- **pending** - กำลังทำงาน
- **fulfilled** - สำเร็จ
- **rejected** - ล้มเหลว

## สร้าง Promise
\`\`\`javascript
const promise = new Promise((resolve, reject) => {
  // async operation
  if (success) {
    resolve("Success!");
  } else {
    reject("Error!");
  }
});
\`\`\`

## ใช้งาน
\`\`\`javascript
promise
  .then(result => console.log(result))
  .catch(error => console.log(error));
\`\`\`
    `,
    codeExample: `function fetchData(success) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (success) {
        resolve({ id: 1, name: "Hero" });
      } else {
        reject("Failed to fetch data");
      }
    }, 1000);
  });
}

console.log("Fetching...");

fetchData(true)
  .then(data => {
    console.log("Success:", data);
  })
  .catch(error => {
    console.log("Error:", error);
  });`,
    challenge: {
      description: "สร้าง Promise ที่ resolve หลัง 1 วินาที",
      starterCode: `const myPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("Done!");
  }, 1000);
});

myPromise.then(result => {
  console.log(result);
});`,
      expectedOutput: "Done!",
      hints: ["resolve() สำหรับสำเร็จ", ".then() รับ result"]
    },
    quiz: [
      {
        question: "Promise มีกี่สถานะ?",
        options: ["1", "2", "3", "4"],
        correctAnswer: 2
      },
      {
        question: ".catch() ใช้จับอะไร?",
        options: ["Success", "Error", "Pending", "All"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "learn-async-3",
    topicId: "topic-async",
    slug: "async-await",
    title: "Async/Await",
    titleTh: "Async/Await",
    description: "Modern async syntax",
    order: 3,
    duration: 20,
    content: `
# Async/Await

Syntax ที่อ่านง่ายกว่า .then()

## async function
\`\`\`javascript
async function getData() {
  const result = await fetch(url);
  return result;
}
\`\`\`

## await
- ใช้ได้เฉพาะใน async function
- "รอ" Promise resolve แล้วค่อยทำต่อ

## try/catch
\`\`\`javascript
async function getData() {
  try {
    const data = await fetchData();
    console.log(data);
  } catch (error) {
    console.log("Error:", error);
  }
}
\`\`\`
    `,
    codeExample: `function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function gameLoop() {
  console.log("Game starting...");
  
  await delay(1000);
  console.log("Loading assets...");
  
  await delay(1000);
  console.log("Ready to play!");
  
  return "Game loaded!";
}

gameLoop().then(msg => console.log(msg));`,
    challenge: {
      description: "ใช้ async/await รอ delay แล้วพิมพ์ข้อความ",
      starterCode: `function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log("Start");
  await delay(1000);
  console.log("After 1 second");
}

main();`,
      expectedOutput: "Start\nAfter 1 second",
      hints: ["await รอ Promise", "async function ต้องมี async keyword"]
    },
    quiz: [
      {
        question: "await ใช้ได้ที่ไหน?",
        options: ["ทุกที่", "เฉพาะใน async function", "เฉพาะ global", "ใน loop"],
        correctAnswer: 1
      },
      {
        question: "async function return อะไร?",
        options: ["undefined", "Promise", "value ปกติ", "Error"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "learn-async-4",
    topicId: "topic-async",
    slug: "fetch-api",
    title: "Fetch API",
    titleTh: "Fetch API",
    description: "Making HTTP requests",
    order: 4,
    duration: 20,
    content: `
# Fetch API

ใช้ส่ง HTTP requests

## GET Request
\`\`\`javascript
fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => console.log(data));
\`\`\`

## ใช้กับ async/await
\`\`\`javascript
async function getData() {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}
\`\`\`

## POST Request
\`\`\`javascript
fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'John' })
});
\`\`\`
    `,
    codeExample: `// จำลอง fetch
async function fetchUser(id) {
  // สมมติว่าเรียก API
  await new Promise(r => setTimeout(r, 500));
  
  const users = {
    1: { id: 1, name: "Hero", level: 10 },
    2: { id: 2, name: "Mage", level: 15 }
  };
  
  return users[id] || null;
}

async function main() {
  console.log("Fetching user...");
  const user = await fetchUser(1);
  
  if (user) {
    console.log("Found:", user.name, "Lv.", user.level);
  } else {
    console.log("User not found");
  }
}

main();`,
    challenge: {
      description: "เขียน function ที่ fetch และ return ข้อมูล",
      starterCode: `async function getPlayerData() {
  // จำลอง API call
  await new Promise(r => setTimeout(r, 500));
  
  return {
    name: "Hero",
    score: 1000,
    rank: "Gold"
  };
}

async function main() {
  const data = await getPlayerData();
  console.log(data.name, "-", data.rank, "- Score:", data.score);
}

main();`,
      expectedOutput: "Hero - Gold - Score: 1000",
      hints: ["await getPlayerData()", "return object จาก async function"]
    },
    quiz: [
      {
        question: "fetch() return อะไร?",
        options: ["String", "Object", "Promise", "Array"],
        correctAnswer: 2
      }
    ]
  },
  {
    id: "learn-async-5",
    topicId: "topic-async",
    slug: "promise-all",
    title: "Promise.all",
    titleTh: "Promise.all",
    description: "Running promises in parallel",
    order: 5,
    duration: 15,
    content: `
# Promise.all

รัน promises หลายตัวพร้อมกัน

## Syntax
\`\`\`javascript
const results = await Promise.all([
  promise1,
  promise2,
  promise3
]);
\`\`\`

## ประโยชน์
- รันพร้อมกัน = เร็วกว่า
- รอทุกตัวเสร็จ = ได้ผลลัพธ์พร้อมกัน

## ถ้าตัวใดตัวหนึ่ง reject?
- ทั้ง Promise.all จะ reject
- ใช้ Promise.allSettled ถ้าต้องการผลทุกตัว
    `,
    codeExample: `function delay(ms, value) {
  return new Promise(resolve => {
    setTimeout(() => resolve(value), ms);
  });
}

async function loadGame() {
  console.log("Loading game assets...");
  
  const start = Date.now();
  
  const [player, items, map] = await Promise.all([
    delay(1000, { name: "Hero" }),
    delay(800, ["Sword", "Shield"]),
    delay(600, { level: 1 })
  ]);
  
  const time = Date.now() - start;
  
  console.log("Player:", player);
  console.log("Items:", items);
  console.log("Map:", map);
  console.log("Total time:", time, "ms");
}

loadGame();`,
    challenge: {
      description: "ใช้ Promise.all โหลด 2 resources พร้อมกัน",
      starterCode: `function loadResource(name, time) {
  return new Promise(resolve => {
    setTimeout(() => resolve(name + " loaded"), time);
  });
}

async function main() {
  const [a, b] = await Promise.all([
    loadResource("Textures", 500),
    loadResource("Sounds", 300)
  ]);
  
  console.log(a);
  console.log(b);
}

main();`,
      expectedOutput: "Textures loaded\nSounds loaded",
      hints: ["Promise.all รับ array ของ promises", "destructure ผลลัพธ์ได้"]
    },
    quiz: [
      {
        question: "Promise.all ต่างจากการ await ทีละตัวอย่างไร?",
        options: ["ช้ากว่า", "รันพร้อมกัน เร็วกว่า", "เหมือนกัน", "ไม่รอผล"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "learn-async-6",
    topicId: "topic-async",
    slug: "error-handling",
    title: "Error Handling",
    titleTh: "การจัดการ Error",
    description: "Handling async errors",
    order: 6,
    duration: 15,
    content: `
# Error Handling

จัดการ error ใน async code

## try/catch
\`\`\`javascript
async function getData() {
  try {
    const data = await fetchData();
    return data;
  } catch (error) {
    console.log("Error:", error.message);
    return null;
  }
}
\`\`\`

## finally
\`\`\`javascript
try {
  await doSomething();
} catch (error) {
  handleError(error);
} finally {
  cleanup(); // ทำเสมอ
}
\`\`\`
    `,
    codeExample: `function fetchData(shouldFail) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error("Network error"));
      } else {
        resolve({ data: "Success!" });
      }
    }, 500);
  });
}

async function loadData() {
  console.log("Loading...");
  
  try {
    const result = await fetchData(true);
    console.log("Data:", result);
  } catch (error) {
    console.log("Caught error:", error.message);
  } finally {
    console.log("Done loading");
  }
}

loadData();`,
    challenge: {
      description: "ใช้ try/catch จัดการ error",
      starterCode: `async function riskyOperation() {
  throw new Error("Something went wrong!");
}

async function main() {
  try {
    await riskyOperation();
    console.log("Success");
  } catch (error) {
    console.log("Caught:", error.message);
  }
}

main();`,
      expectedOutput: "Caught: Something went wrong!",
      hints: ["try {} catch (error) {}", "error.message เข้าถึงข้อความ error"]
    },
    quiz: [
      {
        question: "finally block ทำงานเมื่อไหร่?",
        options: ["เมื่อสำเร็จ", "เมื่อ error", "ทำเสมอ", "ไม่ทำเลย"],
        correctAnswer: 2
      }
    ]
  },

  // ============================================
  // Topic: DOM & Events
  // ============================================
  {
    id: "learn-dom-1",
    topicId: "topic-dom",
    slug: "dom-basics",
    title: "DOM Basics",
    titleTh: "พื้นฐาน DOM",
    description: "Understanding the DOM tree",
    order: 1,
    duration: 15,
    content: `
# DOM คืออะไร?

DOM = Document Object Model
แสดง HTML เป็น tree ของ objects

## โครงสร้าง
\`\`\`
document
└── html
    ├── head
    │   └── title
    └── body
        ├── h1
        └── p
\`\`\`

## เข้าถึง Elements
\`\`\`javascript
document.getElementById("myId")
document.querySelector(".myClass")
document.querySelectorAll("p")
\`\`\`
    `,
    codeExample: `// จำลอง DOM environment
const document = {
  getElementById: (id) => ({ id, textContent: "Hello" }),
  querySelector: (sel) => ({ selector: sel, innerHTML: "<p>Text</p>" }),
  querySelectorAll: (sel) => [{ tag: "p" }, { tag: "p" }]
};

const element = document.getElementById("title");
console.log("Element ID:", element.id);
console.log("Content:", element.textContent);

const items = document.querySelectorAll("p");
console.log("Found", items.length, "paragraphs");`,
    challenge: {
      description: "เข้าถึง element ด้วย getElementById",
      starterCode: `// จำลอง DOM
const document = {
  getElementById: (id) => ({
    id: id,
    textContent: "Welcome to JavaScript!"
  })
};

const header = document.getElementById("header");
console.log("ID:", header.id);
console.log("Text:", header.textContent);`,
      expectedOutput: "ID: header\nText: Welcome to JavaScript!",
      hints: ["getElementById รับ string เป็น id", "element.textContent อ่านข้อความ"]
    },
    quiz: [
      {
        question: "DOM ย่อมาจาก?",
        options: ["Data Object Model", "Document Object Model", "Display Object Method", "Dynamic Object Manager"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "learn-dom-2",
    topicId: "topic-dom",
    slug: "manipulating-elements",
    title: "Manipulating Elements",
    titleTh: "การจัดการ Elements",
    description: "Changing content and styles",
    order: 2,
    duration: 20,
    content: `
# จัดการ Elements

## เปลี่ยน Content
\`\`\`javascript
element.textContent = "New text";
element.innerHTML = "<b>Bold text</b>";
\`\`\`

## เปลี่ยน Style
\`\`\`javascript
element.style.color = "red";
element.style.fontSize = "24px";
\`\`\`

## เปลี่ยน Class
\`\`\`javascript
element.classList.add("active");
element.classList.remove("hidden");
element.classList.toggle("dark");
\`\`\`

## เปลี่ยน Attribute
\`\`\`javascript
element.setAttribute("src", "image.png");
element.getAttribute("href");
\`\`\`
    `,
    codeExample: `// จำลอง element
const element = {
  textContent: "Original",
  style: {},
  classList: {
    classes: [],
    add(c) { this.classes.push(c); },
    has(c) { return this.classes.includes(c); }
  }
};

console.log("Before:", element.textContent);


element.textContent = "Updated!";
console.log("After:", element.textContent);

element.style.color = "blue";
element.style.fontSize = "20px";
console.log("Style:", element.style);

element.classList.add("active");
element.classList.add("highlight");
console.log("Classes:", element.classList.classes);`,
    challenge: {
      description: "เปลี่ยน textContent และ style ของ element",
      starterCode: `const element = {
  textContent: "Hello",
  style: {}
};

element.textContent = "Hello World!";
element.style.color = "green";

console.log("Text:", element.textContent);
console.log("Color:", element.style.color);`,
      expectedOutput: "Text: Hello World!\nColor: green",
      hints: ["กำหนดค่าให้ property โดยตรง", "style เป็น object"]
    },
    quiz: [
      {
        question: "textContent vs innerHTML ต่างกันอย่างไร?",
        options: ["เหมือนกัน", "textContent เป็น text, innerHTML รับ HTML", "innerHTML เร็วกว่า", "textContent รับ HTML"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "learn-dom-3",
    topicId: "topic-dom",
    slug: "event-listeners",
    title: "Event Listeners",
    titleTh: "Event Listeners",
    description: "Handling user interactions",
    order: 3,
    duration: 20,
    content: `
# Event Listeners

รับ event จากผู้ใช้

## addEventListener
\`\`\`javascript
button.addEventListener("click", function() {
  console.log("Clicked!");
});
\`\`\`

## Events ที่ใช้บ่อย
- click - คลิก
- mouseover - hover
- keydown - กดคีย์
- submit - ส่งฟอร์ม
- change - ค่าเปลี่ยน
- load - โหลดเสร็จ

## Event Object
\`\`\`javascript
element.addEventListener("click", (event) => {
  console.log(event.target);
});
\`\`\`
    `,
    codeExample: `// จำลอง event system
class Element {
  constructor(name) {
    this.name = name;
    this.listeners = {};
  }
  
  addEventListener(event, callback) {
    this.listeners[event] = callback;
  }
  
  trigger(event, data) {
    if (this.listeners[event]) {
      this.listeners[event](data);
    }
  }
}

const button = new Element("button");

button.addEventListener("click", (e) => {
  console.log("Button clicked!");
  console.log("Event data:", e);
});

// จำลองการคลิก
button.trigger("click", { type: "click", x: 100, y: 50 });`,
    challenge: {
      description: "สร้าง event listener สำหรับ click",
      starterCode: `const button = {
  listeners: {},
  addEventListener(event, fn) {
    this.listeners[event] = fn;
  },
  click() {
    if (this.listeners["click"]) {
      this.listeners["click"]();
    }
  }
};

button.addEventListener("click", () => {
  console.log("Button was clicked!");
});

button.click();`,
      expectedOutput: "Button was clicked!",
      hints: ["addEventListener รับ event name และ callback", "callback จะถูกเรียกเมื่อเกิด event"]
    },
    quiz: [
      {
        question: "addEventListener ใช้ทำอะไร?",
        options: ["สร้าง element", "ฟัง event จากผู้ใช้", "ลบ element", "เปลี่ยน style"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "learn-dom-4",
    topicId: "topic-dom",
    slug: "creating-elements",
    title: "Creating Elements",
    titleTh: "สร้าง Elements",
    description: "Dynamic element creation",
    order: 4,
    duration: 15,
    content: `
# สร้าง Elements

## createElement
\`\`\`javascript
const div = document.createElement("div");
div.textContent = "Hello";
div.className = "box";
\`\`\`

## appendChild
\`\`\`javascript
parent.appendChild(div);
\`\`\`

## remove
\`\`\`javascript
element.remove();
\`\`\`

## insertBefore
\`\`\`javascript
parent.insertBefore(newChild, referenceChild);
\`\`\`
    `,
    codeExample: `// จำลอง DOM creation
class MockElement {
  constructor(tag) {
    this.tagName = tag;
    this.textContent = "";
    this.className = "";
    this.children = [];
  }
  
  appendChild(child) {
    this.children.push(child);
    return child;
  }
}

const document = {
  createElement: (tag) => new MockElement(tag)
};

// สร้าง elements
const ul = document.createElement("ul");
ul.className = "todo-list";

const li1 = document.createElement("li");
li1.textContent = "Learn JavaScript";

const li2 = document.createElement("li");
li2.textContent = "Build a game";

ul.appendChild(li1);
ul.appendChild(li2);

console.log("List created:", ul.tagName);
console.log("Items:", ul.children.length);
ul.children.forEach((li, i) => {
  console.log((i+1) + ".", li.textContent);
});`,
    challenge: {
      description: "สร้าง element และเพิ่มเข้า parent",
      starterCode: `const parent = { children: [], appendChild(c) { this.children.push(c); } };
const createElement = (tag) => ({ tagName: tag, textContent: "" });

const item = createElement("div");
item.textContent = "New Item";
parent.appendChild(item);

console.log("Children count:", parent.children.length);
console.log("Content:", parent.children[0].textContent);`,
      expectedOutput: "Children count: 1\nContent: New Item",
      hints: ["createElement สร้าง element ใหม่", "appendChild เพิ่ม element"]
    },
    quiz: [
      {
        question: "createElement ทำอะไร?",
        options: ["ลบ element", "สร้าง element ใหม่", "หา element", "เปลี่ยน element"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "learn-dom-5",
    topicId: "topic-dom",
    slug: "forms",
    title: "Working with Forms",
    titleTh: "การทำงานกับ Forms",
    description: "Form handling and validation",
    order: 5,
    duration: 20,
    content: `
# Forms

## อ่านค่า Input
\`\`\`javascript
const input = document.getElementById("name");
console.log(input.value);
\`\`\`

## Submit Event
\`\`\`javascript
form.addEventListener("submit", (e) => {
  e.preventDefault(); // ป้องกัน refresh
  // process form
});
\`\`\`

## Validation
\`\`\`javascript
if (input.value.trim() === "") {
  alert("กรุณากรอกข้อมูล");
}
\`\`\`
    `,
    codeExample: `// จำลอง form handling
const form = {
  inputs: {
    username: { value: "john_doe" },
    email: { value: "john@example.com" },
    age: { value: "25" }
  },
  
  getData() {
    return {
      username: this.inputs.username.value,
      email: this.inputs.email.value,
      age: parseInt(this.inputs.age.value)
    };
  },
  
  validate() {
    const data = this.getData();
    if (!data.username) return "Username required";
    if (!data.email.includes("@")) return "Invalid email";
    if (data.age < 0) return "Invalid age";
    return null;
  }
};

const error = form.validate();
if (error) {
  console.log("Error:", error);
} else {
  console.log("Form data:", form.getData());
}`,
    challenge: {
      description: "ตรวจสอบว่า input ไม่ว่างเปล่า",
      starterCode: `function validateForm(username, email) {
  if (!username || username.trim() === "") {
    return "Username is required";
  }
  if (!email || !email.includes("@")) {
    return "Valid email is required";
  }
  return null; // valid
}

console.log(validateForm("", "test@test.com"));
console.log(validateForm("john", "invalid"));
console.log(validateForm("john", "john@test.com"));`,
      expectedOutput: "Username is required\nValid email is required\nnull",
      hints: ["ใช้ trim() ลบ whitespace", "includes('@') เช็ค email"]
    },
    quiz: [
      {
        question: "e.preventDefault() ทำอะไร?",
        options: ["ลบ form", "ป้องกัน default behavior", "ส่ง form", "Clear form"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "learn-dom-6",
    topicId: "topic-dom",
    slug: "local-storage",
    title: "Local Storage",
    titleTh: "Local Storage",
    description: "Storing data locally",
    order: 6,
    duration: 15,
    content: `
# Local Storage

เก็บข้อมูลใน browser

## บันทึก
\`\`\`javascript
localStorage.setItem("key", "value");
\`\`\`

## อ่าน
\`\`\`javascript
const value = localStorage.getItem("key");
\`\`\`

## ลบ
\`\`\`javascript
localStorage.removeItem("key");
localStorage.clear(); // ลบทั้งหมด
\`\`\`

## เก็บ Object
\`\`\`javascript
localStorage.setItem("user", JSON.stringify(user));
const user = JSON.parse(localStorage.getItem("user"));
\`\`\`
    `,
    codeExample: `// จำลอง localStorage
const localStorage = {
  data: {},
  setItem(key, value) {
    this.data[key] = value;
  },
  getItem(key) {
    return this.data[key] || null;
  },
  removeItem(key) {
    delete this.data[key];
  }
};

// เก็บ settings
const settings = {
  volume: 80,
  difficulty: "hard",
  darkMode: true
};

localStorage.setItem("gameSettings", JSON.stringify(settings));

// อ่าน settings
const saved = JSON.parse(localStorage.getItem("gameSettings"));
console.log("Settings:", saved);
console.log("Volume:", saved.volume);
console.log("Dark Mode:", saved.darkMode);`,
    challenge: {
      description: "เก็บและอ่าน player data จาก storage",
      starterCode: `const storage = {
  data: {},
  setItem(k, v) { this.data[k] = v; },
  getItem(k) { return this.data[k] || null; }
};

const player = { name: "Hero", level: 10, gold: 500 };
storage.setItem("player", JSON.stringify(player));

const loaded = JSON.parse(storage.getItem("player"));
console.log("Loaded:", loaded.name, "Lv.", loaded.level);`,
      expectedOutput: "Loaded: Hero Lv. 10",
      hints: ["JSON.stringify เปลี่ยน object เป็น string", "JSON.parse เปลี่ยน string เป็น object"]
    },
    quiz: [
      {
        question: "localStorage เก็บข้อมูลแบบไหน?",
        options: ["ชั่วคราว", "ถาวร (จนกว่าจะลบ)", "เฉพาะ session", "บน server"],
        correctAnswer: 1
      },
      {
        question: "ทำไมต้องใช้ JSON.stringify?",
        options: ["ให้เร็วขึ้น", "localStorage เก็บได้แค่ string", "ให้ปลอดภัย", "ให้เล็กลง"],
        correctAnswer: 1
      }
    ]
  },
];

export function getLessonsByTopic(topicId: string): LearnLesson[] {
  return learnLessons.filter(l => l.topicId === topicId).sort((a, b) => a.order - b.order);
}

export function getLessonBySlug(topicSlug: string, lessonSlug: string): LearnLesson | undefined {
  // Map topic slug to topic ID
  const slugToId: Record<string, string> = {
    "basics": "topic-basics",
    "control-flow": "topic-control",
    "functions": "topic-functions",
    "objects-arrays": "topic-objects",
    "classes": "topic-classes",
    "async": "topic-async",
    "dom": "topic-dom",
    "typescript": "topic-typescript"
  };
  
  const topicId = slugToId[topicSlug] || `topic-${topicSlug}`;
  return learnLessons.find(l => l.topicId === topicId && l.slug === lessonSlug);
}

export function getLessonById(id: string): LearnLesson | undefined {
  return learnLessons.find(l => l.id === id);
}

// ============================================
// Go Language Lessons
// ============================================

// Go Basics Topic
const goBasicsLessons: LearnLesson[] = [
  {
    id: "learn-go-basics-1",
    topicId: "topic-go-basics",
    slug: "introduction",
    title: "Introduction to Go",
    titleTh: "แนะนำ Go",
    description: "What is Go and why learn it",
    order: 1,
    duration: 10,
    content: `
# แนะนำ Go

Go (หรือ Golang) เป็นภาษาที่พัฒนาโดย Google!

## ทำไมต้องเรียน Go?
- ⚡ เร็วมาก (compile เป็น machine code)
- 🧵 Concurrency ง่าย (Goroutines)
- 📦 Deploy ง่าย (single binary)
- 🔧 เรียบง่าย อ่านง่าย

## Hello World

package main

import "fmt"

func main() {
    fmt.Println("Hello, Go!")
}

## Go ใช้ทำอะไร?
- Backend API / Microservices
- Cloud Infrastructure (Docker, K8s เขียนด้วย Go)
- CLI Tools
- DevOps Tools
    `,
    codeExample: `// Try Go at: play.golang.org
package main

import "fmt"

func main() {
    fmt.Println("Hello, Go!")
    fmt.Println("Welcome to Golang!")
}`,
    quiz: [
      {
        question: "Go ถูกพัฒนาโดยบริษัทอะไร?",
        options: ["Microsoft", "Google", "Facebook", "Amazon"],
        correctAnswer: 1
      },
      {
        question: "Go มีจุดเด่นเรื่องอะไร?",
        options: ["Graphics", "Concurrency", "Mobile Apps", "Animation"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "learn-go-basics-2",
    topicId: "topic-go-basics",
    slug: "variables",
    title: "Variables in Go",
    titleTh: "ตัวแปรใน Go",
    description: "var, const, and short declaration",
    order: 2,
    duration: 15,
    content: `
# ตัวแปรใน Go

## ประกาศตัวแปร

var name string = "John"
var age int = 25

// หรือแบบสั้น (ใน function)
name := "John"
age := 25

## Constants

const PI = 3.14159
const MaxScore = 100

## Zero Values

var i int      // 0
var s string   // ""
var b bool     // false
    `,
    codeExample: `package main

import "fmt"

func main() {
    // Full declaration
    var name string = "Hero"
    var score int = 100
    
    // Short declaration
    level := 10
    isAlive := true
    
    fmt.Println("Name:", name)
    fmt.Println("Score:", score)
    fmt.Println("Level:", level)
    fmt.Println("Alive:", isAlive)
}`,
    quiz: [
      {
        question: ":= ใน Go ใช้ทำอะไร?",
        options: ["เปรียบเทียบ", "ประกาศตัวแปรแบบสั้น", "ลบค่า", "คูณค่า"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "learn-go-basics-3",
    topicId: "topic-go-basics",
    slug: "functions",
    title: "Functions in Go",
    titleTh: "ฟังก์ชันใน Go",
    description: "Creating and using functions",
    order: 3,
    duration: 15,
    content: `
# ฟังก์ชันใน Go

## โครงสร้างพื้นฐาน

func greet(name string) string {
    return "Hello, " + name
}

## Multiple Return Values

func divide(a, b int) (int, error) {
    if b == 0 {
        return 0, errors.New("cannot divide by zero")
    }
    return a / b, nil
}

## Named Returns

func swap(a, b int) (x, y int) {
    x = b
    y = a
    return
}
    `,
    codeExample: `package main

import "fmt"

func add(a, b int) int {
    return a + b
}

func swap(a, b int) (int, int) {
    return b, a
}

func main() {
    result := add(5, 3)
    fmt.Println("5 + 3 =", result)
    
    x, y := swap(10, 20)
    fmt.Println("Swapped:", x, y)
}`,
    quiz: [
      {
        question: "Go สามารถ return ได้กี่ค่า?",
        options: ["1 ค่าเท่านั้น", "2 ค่า", "หลายค่า", "ไม่ได้"],
        correctAnswer: 2
      }
    ]
  },
];

// Go Concurrency Topic
const goConcurrencyLessons: LearnLesson[] = [
  {
    id: "learn-go-concurrency-1",
    topicId: "topic-go-concurrency",
    slug: "goroutines",
    title: "Goroutines",
    titleTh: "Goroutines",
    description: "Lightweight threads in Go",
    order: 1,
    duration: 20,
    content: `
# Goroutines

Goroutine คือ lightweight thread ของ Go

## สร้าง Goroutine

go functionName()

## ตัวอย่าง

func sayHello() {
    fmt.Println("Hello from goroutine!")
}

func main() {
    go sayHello() // รันแบบ concurrent
    fmt.Println("Hello from main!")
    time.Sleep(time.Second)
}
    `,
    codeExample: `package main

import (
    "fmt"
    "time"
)

func printNumbers() {
    for i := 1; i <= 3; i++ {
        fmt.Println("Number:", i)
        time.Sleep(100 * time.Millisecond)
    }
}

func main() {
    go printNumbers()
    
    time.Sleep(time.Second)
    fmt.Println("Done!")
}`,
    quiz: [
      {
        question: "go keyword ใช้ทำอะไร?",
        options: ["สร้างตัวแปร", "รัน function แบบ concurrent", "จบ program", "สร้าง loop"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "learn-go-concurrency-2",
    topicId: "topic-go-concurrency",
    slug: "channels",
    title: "Channels",
    titleTh: "Channels",
    description: "Communication between goroutines",
    order: 2,
    duration: 20,
    content: `
# Channels

Channel ใช้สื่อสารระหว่าง goroutines

## สร้าง Channel

ch := make(chan int)

## ส่งและรับค่า

ch <- 42    // ส่งค่า
value := <-ch  // รับค่า

## Buffered Channel

ch := make(chan int, 3) // buffer 3 ค่า
    `,
    codeExample: `package main

import "fmt"

func sendMessage(ch chan string) {
    ch <- "Hello from goroutine!"
}

func main() {
    ch := make(chan string)
    
    go sendMessage(ch)
    
    message := <-ch
    fmt.Println("Received:", message)
}`,
    quiz: [
      {
        question: "Channel ใน Go ใช้ทำอะไร?",
        options: ["เก็บข้อมูล", "สื่อสารระหว่าง goroutines", "สร้าง loop", "ประกาศตัวแปร"],
        correctAnswer: 1
      }
    ]
  },
];

// Add Go lessons to the main array
learnLessons.push(...goBasicsLessons, ...goConcurrencyLessons);
