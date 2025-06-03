export type Passage = { label: string; value: string; code: string };

export const passages: Passage[] = [
  {
    label: "Hello World",
    value: "0",
    code: `console.log('Hello, world!');`,
  },
  {
    label: "Add Function",
    value: "1",
    code: `function add(a, b) {\n  return a + b;\n}\nconsole.log(add(2, 3));`,
  },
  {
    label: "Factorial",
    value: "2",
    code: `function factorial(n) {\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}\nconsole.log(factorial(5));`,
  },
  {
    label: "FizzBuzz",
    value: "3",
    code: `for (let i = 1; i <= 15; i++) {\n  let out = '';\n  if (i % 3 === 0) out += 'Fizz';\n  if (i % 5 === 0) out += 'Buzz';\n  console.log(out || i);\n}`,
  },
  {
    label: "Reverse String",
    value: "4",
    code: `function reverse(str) {\n  return str.split('').reverse().join('');\n}\nconsole.log(reverse('hello'));`,
  },
  {
    label: "Palindrome Check",
    value: "5",
    code: `function isPalindrome(str) {\n  const clean = str.replace(/[^a-z0-9]/gi, '').toLowerCase();\n  return clean === clean.split('').reverse().join('');\n}\nconsole.log(isPalindrome('racecar'));`,
  },
  {
    label: "Array Sum",
    value: "6",
    code: `const arr = [1, 2, 3, 4, 5];\nconst sum = arr.reduce((a, b) => a + b, 0);\nconsole.log(sum);`,
  },
  {
    label: "Object Keys",
    value: "7",
    code: `const obj = { a: 1, b: 2, c: 3 };\nconsole.log(Object.keys(obj));`,
  },
  {
    label: "Map Filter",
    value: "8",
    code: `const nums = [1, 2, 3, 4, 5, 6];\nconst even = nums.filter(n => n % 2 === 0).map(n => n * 2);\nconsole.log(even);`,
  },
  {
    label: "Async Await",
    value: "9",
    code: `async function fetchData() {\n  return await Promise.resolve('data');\n}\nfetchData().then(console.log);`,
  },
  {
    label: "Set Usage",
    value: "10",
    code: `const s = new Set([1, 2, 2, 3]);\nconsole.log([...s]);`,
  },
  {
    label: "Class Example",
    value: "11",
    code: `class Person {\n  constructor(name) {\n    this.name = name;\n  }\n  greet() {\n    return 'Hello, ' + this.name;\n  }\n}\nconsole.log(new Person('Alice').greet());`,
  },
  {
    label: "Destructuring",
    value: "12",
    code: `const [a, b] = [10, 20];\nconst { x, y } = { x: 1, y: 2 };\nconsole.log(a, b, x, y);`,
  },
  {
    label: "Default Params",
    value: "13",
    code: `function greet(name = 'World') {\n  return 'Hello, ' + name + '!';\n}\nconsole.log(greet());`,
  },
  {
    label: "Template Literals",
    value: "14",
    code: "const who = 'world';\nconsole.log(`Hello, ${who}!`);",
  },
  {
    label: "Long Loop Example",
    value: "15",
    code: Array.from(
      { length: 110 },
      (_, i) => `console.log('Line ${i + 1}');`
    ).join("\n"),
  },
];
