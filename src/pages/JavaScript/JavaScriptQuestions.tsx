import React, { useState } from "react";
import { Tabs, Tab } from "@nextui-org/react";
import ObjectCreation from "./ObjectCreation";

interface Question {
  question: string;

  answer: string;
  examples: any;
  note?: string;
  comparison?: any;
}

const JavaScriptQuestions = () => {
  const questions: Question[] = [
    {
      question: "Ways to Create Objects in JavaScript",
      answer:
        "JavaScript provides multiple ways to create objects. Each approach has its own use cases and benefits.",
      examples: [
        {
          id: "literal",
          title: "1. Object Literal Syntax",
          description:
            "The simplest way to create an object using curly braces.",
          code: `const object = {
          name: "John",
          age: 30
        };`,
        },
        {
          id: "constructor",
          title: "2. Object Constructor",
          description:
            "Creating objects using the Object constructor function.",
          code: `const object = new Object();
        // OR
        const object = Object();`,
        },
        {
          id: "create",
          title: "3. Object.create() Method",
          description:
            "Creates a new object with the specified prototype object and properties.",
          code: `const vehicle = {
          wheels: '4',
          fuelType: 'Gasoline'
        };
        
        const car = Object.create(vehicle, {
          type: { value: 'Volkswagen' },
          model: { value: 'Golf' }
        });`,
        },
        {
          id: "function",
          title: "4. Function Constructor",
          description:
            "Creating objects using a constructor function with the 'new' keyword.",
          code: `function Person(name) {
          this.name = name;
          this.age = 21;
        }
        const object = new Person("John");`,
        },
        {
          id: "prototype",
          title: "5. Function Constructor with Prototype",
          description:
            "Using prototype to add properties and methods to objects.",
          code: `function Person() {}
        Person.prototype.name = "John";
        const object = new Person();`,
        },
        {
          id: "assign",
          title: "6. Object.assign() Method",
          description:
            "Copying properties from one or more source objects to a target object.",
          code: `const orgObject = { company: 'XYZ Corp'};
        const carObject = { name: 'Toyota'};
        const staff = Object.assign({}, orgObject, carObject);`,
        },
        {
          id: "class",
          title: "7. ES6 Class Syntax",
          description:
            "Modern way to create objects using class syntax introduced in ES6.",
          code: `class Person {
          constructor(name) {
            this.name = name;
          }
        }
        const object = new Person("John");`,
        },
        {
          id: "singleton",
          title: "8. Singleton Pattern",
          description: "Creating an object that can only be instantiated once.",
          code: `const object = new (function() {
          this.name = "John";
        })();`,
        },
      ],
    },
    {
      question: "What is the purpose of the array slice method?",
      answer:
        "The slice() method returns selected elements from an array as a new array without modifying the original array. It extracts elements from the given start index up to (but not including) the end index. If the end index is omitted, it slices until the end of the array. Negative indexes can also be used to count from the end.",
      examples: [
        {
          id: "basic",
          title: "1. Basic Usage",
          description: "Extracts elements from index 0 to 2 (excluding 2).",
          code: "let arrayIntegers = [1, 2, 3, 4, 5];\nlet arrayIntegers1 = arrayIntegers.slice(0, 2); // returns [1, 2]",
        },
        {
          id: "singleElement",
          title: "2. Extracting a Single Element",
          description: "Extracts only the element at index 2.",
          code: "let arrayIntegers2 = arrayIntegers.slice(2, 3); // returns [3]",
        },
        {
          id: "fromIndex",
          title: "3. Slicing from a Specific Index",
          description: "Extracts elements from index 4 to the end.",
          code: "let arrayIntegers3 = arrayIntegers.slice(4); // returns [5]",
        },
        {
          id: "negativeIndex",
          title: "4. Using Negative Indexes",
          description: "Extracts elements from index -3 to -1 (excluding -1).",
          code: "let arrayIntegers4 = arrayIntegers.slice(-3, -1); // returns [3, 4]",
        },
      ],
      note: "The slice() method does not modify the original array; it returns a new array containing the extracted elements.",
    },
    {
      question: "What is the purpose of the array splice method?",
      answer:
        "The splice() method adds or removes elements from an array at a specified index. It modifies the original array and returns the removed elements. The first argument specifies the index to start the operation, the second argument (optional) defines how many elements to remove, and additional arguments specify new elements to insert.",
      examples: [
        {
          id: "removeElements",
          title: "1. Removing Elements",
          description: "Removes two elements starting from index 0.",
          code: "let arrayIntegersOriginal1 = [1, 2, 3, 4, 5];\nlet arrayIntegers1 = arrayIntegersOriginal1.splice(0, 2); // returns [1, 2]\n// Original array: [3, 4, 5]",
        },
        {
          id: "removeFromIndex",
          title: "2. Removing All Elements from an Index",
          description: "Removes all elements from index 3 onward.",
          code: "let arrayIntegersOriginal2 = [1, 2, 3, 4, 5];\nlet arrayIntegers2 = arrayIntegersOriginal2.splice(3); // returns [4, 5]\n// Original array: [1, 2, 3]",
        },
        {
          id: "replaceElements",
          title: "3. Replacing Elements",
          description:
            "Replaces one element at index 3 with 'a', 'b', and 'c'.",
          code: "let arrayIntegersOriginal3 = [1, 2, 3, 4, 5];\nlet arrayIntegers3 = arrayIntegersOriginal3.splice(3, 1, 'a', 'b', 'c'); // returns [4]\n// Original array: [1, 2, 3, 'a', 'b', 'c', 5]",
        },
      ],
      note: "The splice() method modifies the original array and returns the deleted elements as a new array.",
    },
    {
      question: "What is the difference between slice and splice?",
      answer:
        "The slice() and splice() methods are both used to work with arrays, but they have different behaviors. slice() is used to extract elements without modifying the original array, while splice() is used to add or remove elements and modifies the original array.",
      comparison: [
        {
          feature: "Modification",
          slice: "Does not modify the original array (immutable).",
          splice: "Modifies the original array (mutable).",
        },
        {
          feature: "Return Value",
          slice: "Returns a subset of the original array.",
          splice: "Returns the deleted elements as an array.",
        },
        {
          feature: "Usage",
          slice: "Used to extract elements from an array.",
          splice: "Used to insert or delete elements in an array.",
        },
      ],
      examples: [
        {
          id: "sliceExample",
          title: "Example of slice()",
          description:
            "Extracts elements from index 0 to 2 without modifying the original array.",
          code: "let arrayIntegers = [1, 2, 3, 4, 5];\nlet slicedArray = arrayIntegers.slice(0, 2); // returns [1, 2]\n// Original array remains unchanged: [1, 2, 3, 4, 5]",
        },
        {
          id: "spliceExample",
          title: "Example of splice()",
          description:
            "Removes two elements from index 0 and modifies the original array.",
          code: "let arrayIntegers = [1, 2, 3, 4, 5];\nlet splicedArray = arrayIntegers.splice(0, 2); // returns [1, 2]\n// Original array after modification: [3, 4, 5]",
        },
      ],
      note: "Use slice() when you need a non-destructive way to extract elements, and use splice() when you need to modify the array by inserting or removing elements.",
    },
    {
      question: "What is the difference between == and === operators?",
      answer:
        "JavaScript provides both loose (==, !=) and strict (===, !==) equality comparison. The loose equality operator (==) performs type coercion before comparing values, whereas the strict equality operator (===) compares both value and type without type conversion.",
      comparison: [
        {
          feature: "Type Coercion",
          doubleEquals: "Performs type conversion before comparison.",
          tripleEquals:
            "Does not perform type conversion; compares values as-is.",
        },
        {
          feature: "Comparison Logic",
          doubleEquals:
            "Converts different data types to a common type before checking equality.",
          tripleEquals:
            "Returns true only if both value and type match exactly.",
        },
        {
          feature: "Usage",
          doubleEquals:
            "Used when type conversion is acceptable (e.g., user input validation).",
          tripleEquals:
            "Used when strict comparison is required to avoid unexpected results.",
        },
      ],
      examples: [
        {
          id: "doubleEqualsExample",
          title: "Example of == operator",
          description: "Compares values with type conversion.",
          code: "0 == false   // true\n1 == '1'     // true\nnull == undefined // true",
        },
        {
          id: "tripleEqualsExample",
          title: "Example of === operator",
          description: "Compares values without type conversion.",
          code: "0 === false  // false\n1 === '1'    // false\nnull === undefined // false",
        },
        {
          id: "specialCases",
          title: "Special Cases",
          description: "Some cases where both operators behave differently.",
          code: "NaN == NaN // false\nNaN === NaN // false\n[] == [] // false (different objects in memory)\n{} === {} // false (different objects in memory)",
        },
      ],
      note: "Use === for safer comparisons to avoid unintended type coercion.",
    },
    {
      question: "What is the difference between let and var?",
      answer:
        "The `let` statement declares a block-scoped local variable, meaning it is limited in scope to the block, statement, or expression in which it is defined. On the other hand, `var` is function-scoped and does not respect block scope, making it accessible throughout the function or globally.",
      comparison: [
        {
          feature: "Scope",
          let: "Block-scoped (only accessible within the block it is defined in).",
          var: "Function-scoped (accessible throughout the entire function or globally).",
        },
        {
          feature: "Hoisting",
          let: "Hoisted but not initialized, so accessing it before declaration results in a ReferenceError.",
          var: "Hoisted and initialized as `undefined`, so it can be accessed before declaration.",
        },
        {
          feature: "Re-declaration",
          let: "Cannot be re-declared in the same scope.",
          var: "Can be re-declared within the same scope.",
        },
      ],
      examples: [
        {
          id: "letExample",
          title: "Example of let",
          description: "Variables declared with `let` are block-scoped.",
          code: "let counter = 30;\nif (counter === 30) {\n  let counter = 31;\n  console.log(counter); // 31\n}\nconsole.log(counter); // 30",
        },
        {
          id: "varExample",
          title: "Example of var",
          description:
            "Variables declared with `var` do not respect block scope.",
          code: "var counter = 30;\nif (counter === 30) {\n  var counter = 31;\n  console.log(counter); // 31\n}\nconsole.log(counter); // 31 (var affects the outer scope)",
        },
      ],
      note: "Use `let` over `var` to avoid accidental re-declarations and scope-related bugs.",
    },
    {
      question: "What is the difference between let and var?",
      answer:
        "The `let` statement declares a block-scoped local variable, meaning it is limited in scope to the block, statement, or expression in which it is defined. On the other hand, `var` is function-scoped and does not respect block scope, making it accessible throughout the function or globally.",
      comparison: [
        {
          feature: "Scope",
          let: "Block-scoped (only accessible within the block it is defined in).",
          var: "Function-scoped (accessible throughout the entire function or globally).",
        },
        {
          feature: "Hoisting",
          let: "Hoisted but not initialized, so accessing it before declaration results in a ReferenceError.",
          var: "Hoisted and initialized as `undefined`, so it can be accessed before declaration.",
        },
        {
          feature: "Re-declaration",
          let: "Cannot be re-declared in the same scope.",
          var: "Can be re-declared within the same scope.",
        },
      ],
      examples: [
        {
          id: "letExample",
          title: "Example of let",
          description: "Variables declared with `let` are block-scoped.",
          code: "let counter = 30;\nif (counter === 30) {\n  let counter = 31;\n  console.log(counter); // 31\n}\nconsole.log(counter); // 30",
        },
        {
          id: "varExample",
          title: "Example of var",
          description:
            "Variables declared with `var` do not respect block scope.",
          code: "var counter = 30;\nif (counter === 30) {\n  var counter = 31;\n  console.log(counter); // 31\n}\nconsole.log(counter); // 31 (var affects the outer scope)",
        },
      ],
      note: "Use `let` over `var` to avoid accidental re-declarations and scope-related bugs.",
    },
  ];

  const [selectedLevel, setSelectedLevel] = useState("junior");

  const filteredQuestions = questions.filter(
    (q) => q.difficulty === selectedLevel
  );

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <h1 className="text-4xl font-bold text-center mb-8">
        JavaScript Questions
      </h1>

      <Tabs
        aria-label="Difficulty levels"
        selectedKey={selectedLevel}
        onSelectionChange={(key) => setSelectedLevel(key as string)}
        className="mb-8"
      >
        <Tab key="junior" title="Junior Level">
          <div className="space-y-4">
            {questions.map((question, index) => (
              <ObjectCreation no={index + 1} key={index} question={question} />
            ))}
          </div>
        </Tab>
        <Tab key="intermediate" title="Intermediate Level" />
      </Tabs>
    </div>
  );
};

export default JavaScriptQuestions;
