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
    {
      question: "What are lambda expressions or arrow functions?",
      answer:
        "An arrow function is a shorter/concise syntax for a function expression. It does not have its own `this`, `arguments`, `super`, or `new.target`. These functions are best suited for non-method functions and cannot be used as constructors.",
      examples: [
        {
          id: "arrowFunc1",
          title: "Arrow function with multiple parameters",
          description:
            "This is an example of an arrow function with two parameters.",
          code: "const arrowFunc1 = (a, b) => a + b;",
        },
        {
          id: "arrowFunc2",
          title: "Arrow function with a single parameter",
          description:
            "This is an example of an arrow function with a single parameter.",
          code: "const arrowFunc2 = a => a * 10;",
        },
        {
          id: "arrowFunc3",
          title: "Arrow function with no parameters",
          description:
            "This is an example of an arrow function with no parameters.",
          code: "const arrowFunc3 = () => {}",
        },
      ],
      note: "Arrow functions cannot be used as constructors and are not suitable for methods that require their own `this` or `arguments`.",
    },
    {
      question:
        "How do you redeclare variables in a switch block without an error?",
      answer:
        "In JavaScript, redeclaring variables in a `switch` block can cause errors because there is only one block scope for the entire `switch` statement. To avoid this error, you can create a nested block within each `case` clause to ensure a new block-scoped lexical environment for each redeclaration.",
      examples: [
        {
          id: "redeclareErrorExample",
          title:
            "Redeclaring variables without nested blocks (will cause error)",
          description:
            "This example throws a `SyntaxError` due to redeclaring variables in the same scope.",
          code: "let counter = 1;\nswitch (x) {\n  case 0:\n    let name;\n    break;\n\n  case 1:\n    let name; // SyntaxError for redeclaration.\n    break;\n}",
        },
        {
          id: "redeclareFixedExample",
          title: "Redeclaring variables with nested blocks (no error)",
          description:
            "This example uses nested blocks inside each `case` to avoid the redeclaration error.",
          code: "let counter = 1;\nswitch (x) {\n  case 0: {\n    let name;\n    break;\n  }\n  case 1: {\n    let name; // No SyntaxError for redeclaration.\n    break;\n  }\n}",
        },
      ],
      note: "To avoid redeclaration errors in `switch` blocks, always use nested blocks inside `case` clauses.",
    },
    {
      question: "What is an IIFE (Immediately Invoked Function Expression)?",
      answer:
        "An IIFE (Immediately Invoked Function Expression) is a JavaScript function that runs as soon as it is defined. It is often used to create a new scope, thereby providing data privacy. Any variables declared inside the IIFE cannot be accessed from the outside.",
      examples: [
        {
          id: "iifeExample",
          title: "Example of IIFE",
          description:
            "This is an example of an IIFE that runs immediately after it is defined.",
          code: "(function () {\n  var message = 'IIFE';\n  console.log(message);\n})();",
        },
        {
          id: "iifeErrorExample",
          title: "Accessing variables outside an IIFE",
          description:
            "Attempting to access variables declared inside an IIFE from the outside will result in an error.",
          code: "(function () {\n  var message = 'IIFE';\n  console.log(message);\n})();\nconsole.log(message); // Error: message is not defined",
        },
      ],
      note: "IIFEs are useful for creating private variables and encapsulating logic to prevent them from polluting the global scope.",
    },
    {
      question: "How do you decode or encode a URL in JavaScript?",
      answer:
        "In JavaScript, `encodeURI()` is used to encode a URL, while `decodeURI()` is used to decode it. These functions help handle special characters in URLs correctly.",
      examples: [
        {
          id: "encodeURIExample",
          title: "Example of encodeURI",
          description:
            "This example shows how to encode a URL using `encodeURI()`.",
          code: "let uri = 'employeeDetails?name=john&occupation=manager';\nlet encoded_uri = encodeURI(uri);\nconsole.log(encoded_uri);",
        },
        {
          id: "decodeURIExample",
          title: "Example of decodeURI",
          description:
            "This example demonstrates how to decode an encoded URL using `decodeURI()`.",
          code: "let decoded_uri = decodeURI(encoded_uri);\nconsole.log(decoded_uri);",
        },
        {
          id: "encodeURIComponentExample",
          title: "Example of encodeURIComponent",
          description:
            "If the URL contains special characters such as `/ ? : @ & = + $ #`, use `encodeURIComponent()` to encode them properly.",
          code: "let specialUri = 'https://example.com/search?query=hello world';\nlet encoded_specialUri = encodeURIComponent(specialUri);\nconsole.log(encoded_specialUri);",
        },
      ],
      note: "Use `encodeURIComponent()` instead of `encodeURI()` if you need to encode special characters like `/ ? : @ & = + $ #`.",
    },
    {
      question: "What is Hoisting?",
      answer:
        "Hoisting is a JavaScript mechanism where variable declarations, function declarations, and class declarations are moved to the top of their scope before code execution. However, only the declarations are hoisted, not the initializations.",
      examples: [
        {
          id: "variableHoisting",
          title: "Example of Variable Hoisting",
          description:
            "JavaScript hoists the variable declaration but not its initialization.",
          code: "console.log(message); // Output: undefined\nvar message = 'The variable has been hoisted';",
        },
        {
          id: "variableHoistingInterpretation",
          title: "How JavaScript Interprets Hoisting",
          description:
            "The JavaScript interpreter moves the variable declaration to the top.",
          code: "var message;\nconsole.log(message); // Output: undefined\nmessage = 'The variable has been hoisted';",
        },
        {
          id: "functionHoisting",
          title: "Example of Function Hoisting",
          description:
            "Functions can be used before they are declared because they are hoisted.",
          code: "message('Good morning'); // Output: Good morning\n\nfunction message(name) {\n  console.log(name);\n}",
        },
      ],
      note: "Hoisting allows function declarations to be used before they are defined. However, `let` and `const` variables are hoisted but not initialized, leading to a ReferenceError if accessed before declaration.",
    },
    {
      question: "What are classes in ES6?",
      answer:
        "In ES6, JavaScript classes provide a cleaner and more structured way to define objects and handle inheritance. They are syntactic sugar over JavaScript’s existing prototype-based inheritance.",
      comparison: [
        {
          feature: "Prototype-based",
          beforeES6:
            "Functions were used with prototypes to define object properties and methods.",
          es6: "Classes provide a more readable and structured syntax for object creation.",
        },
        {
          feature: "Constructor",
          beforeES6: "Constructors were defined as regular functions.",
          es6: "Classes use the `constructor` method inside the class.",
        },
        {
          feature: "Methods",
          beforeES6: "Methods were attached to the prototype manually.",
          es6: "Methods are defined directly inside the class.",
        },
      ],
      examples: [
        {
          id: "prototypeExample",
          title: "Prototype-based inheritance (Before ES6)",
          description:
            "Defining a constructor function and adding methods using prototype.",
          code: "function Bike(model, color) {\n  this.model = model;\n  this.color = color;\n}\n\nBike.prototype.getDetails = function () {\n  return this.model + ' bike has ' + this.color + ' color';\n};",
        },
        {
          id: "classExample",
          title: "ES6 Class Syntax",
          description: "Defining a class with a constructor and methods.",
          code: "class Bike {\n  constructor(model, color) {\n    this.model = model;\n    this.color = color;\n  }\n\n  getDetails() {\n    return `${this.model} bike has ${this.color} color`;\n  }\n}",
        },
      ],
      note: "Classes in ES6 make object-oriented programming in JavaScript more readable and maintainable.",
    },
    {
      question: "What is scope in JavaScript?",
      answer:
        "Scope in JavaScript determines the accessibility of variables, functions, and objects in different parts of the code during runtime. It defines where a variable can be accessed or modified.",
      comparison: [
        {
          feature: "Global Scope",
          description:
            "Variables declared outside of any function or block are accessible anywhere in the code.",
        },
        {
          feature: "Function Scope",
          description:
            "Variables declared inside a function are only accessible within that function.",
        },
        {
          feature: "Block Scope",
          description:
            "Variables declared with `let` or `const` inside a block (`{}`) are only accessible within that block.",
        },
        {
          feature: "Lexical Scope",
          description:
            "Inner functions can access variables from their outer functions due to lexical scoping.",
        },
      ],
      examples: [
        {
          id: "globalScopeExample",
          title: "Example of Global Scope",
          description:
            "A variable declared outside a function can be accessed anywhere in the script.",
          code: "let globalVar = 'I am global';\nfunction showGlobalVar() {\n  console.log(globalVar); // Accessible\n}\nshowGlobalVar();",
        },
        {
          id: "functionScopeExample",
          title: "Example of Function Scope",
          description:
            "A variable declared inside a function cannot be accessed outside of it.",
          code: "function myFunction() {\n  let localVar = 'I am local';\n  console.log(localVar); // Accessible inside function\n}\nmyFunction();\nconsole.log(localVar); // Error: localVar is not defined",
        },
        {
          id: "blockScopeExample",
          title: "Example of Block Scope",
          description:
            "Variables declared with `let` or `const` inside a block are only accessible within that block.",
          code: "{\n  let blockScoped = 'Inside block';\n  console.log(blockScoped); // Accessible inside block\n}\nconsole.log(blockScoped); // Error: blockScoped is not defined",
        },
        {
          id: "lexicalScopeExample",
          title: "Example of Lexical Scope",
          description:
            "Inner functions can access variables from their outer functions.",
          code: "function outer() {\n  let outerVar = 'I am outer';\n  function inner() {\n    console.log(outerVar); // Accessible due to lexical scope\n  }\n  inner();\n}\nouter();",
        },
      ],
      note: "Understanding scope helps prevent variable conflicts and ensures better memory management in JavaScript.",
    },
    {
      question: "What is a Cookie?",
      answer:
        "A cookie is a small piece of data stored in the user's browser by a website. It helps websites remember user information, such as login credentials, preferences, and session data.",
      comparison: [
        {
          feature: "Session Cookies",
          description:
            "These cookies are temporary and are deleted when the browser is closed.",
        },
        {
          feature: "Persistent Cookies",
          description:
            "These cookies remain stored in the browser until they expire or are manually deleted.",
        },
        {
          feature: "Third-Party Cookies",
          description:
            "These cookies are set by domains other than the website the user is visiting, often used for tracking and advertising.",
        },
      ],
      examples: [
        {
          id: "setCookieExample",
          title: "Example of Setting a Cookie",
          description:
            "This example sets a cookie with a name, value, and expiration date.",
          code: "document.cookie = 'username=JohnDoe; expires=Fri, 31 Dec 2025 23:59:59 GMT; path=/';",
        },
        {
          id: "getCookieExample",
          title: "Example of Getting a Cookie",
          description:
            "This function retrieves a specific cookie value by name.",
          code: "function getCookie(name) {\n  let cookies = document.cookie.split('; ');\n  for (let cookie of cookies) {\n    let [key, value] = cookie.split('=');\n    if (key === name) return value;\n  }\n  return null;\n}\nconsole.log(getCookie('username')); // Output: JohnDoe",
        },
        {
          id: "deleteCookieExample",
          title: "Example of Deleting a Cookie",
          description:
            "This example removes a cookie by setting its expiration date to the past.",
          code: "document.cookie = 'username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';",
        },
      ],
      note: "Cookies are commonly used for authentication, tracking user behavior, and storing preferences. However, they have size limitations and can be disabled by users.",
    },
    {
      question: "Why do you need a Cookie?",
      answer:
        "Cookies are used to store user-specific data in the browser, allowing websites to remember user preferences, login sessions, and other personalized information. This improves the user experience by maintaining state across visits.",
      comparison: [
        {
          feature: "User Authentication",
          description:
            "Cookies store login sessions, so users don’t have to log in every time they visit a website.",
        },
        {
          feature: "User Preferences",
          description:
            "Websites remember theme selection, language preferences, and other settings.",
        },
        {
          feature: "Shopping Carts",
          description:
            "E-commerce sites use cookies to keep track of items added to a shopping cart.",
        },
        {
          feature: "Analytics & Tracking",
          description:
            "Cookies help track user behavior, such as pages visited and time spent on a site, for analytics and advertising purposes.",
        },
      ],
      examples: [
        {
          id: "rememberUserExample",
          title: "Example of Remembering a User",
          description:
            "This example stores a username in a cookie and retrieves it when the user revisits the site.",
          code: "document.cookie = 'username=JohnDoe; expires=Fri, 31 Dec 2025 23:59:59 GMT; path=/';\n\nfunction getCookie(name) {\n  let cookies = document.cookie.split('; ');\n  for (let cookie of cookies) {\n    let [key, value] = cookie.split('=');\n    if (key === name) return value;\n  }\n  return null;\n}\nconsole.log('Welcome back, ' + getCookie('username'));",
        },
      ],
      note: "Cookies enhance the user experience but should be used responsibly, as they can also be used for tracking and targeted advertising.",
    },

    {
      question: "What are the options in a cookie?",
      answer:
        "Cookies have various options that control their behavior, such as expiration, scope, and security. These options allow developers to specify how and where a cookie should be stored and accessed.",
      comparison: [
        {
          feature: "Expires",
          description:
            "Defines when the cookie should expire. If not set, the cookie will be deleted when the browser is closed.",
        },
        {
          feature: "Max-Age",
          description:
            "Sets the lifespan of the cookie in seconds, after which it will be deleted.",
        },
        {
          feature: "Path",
          description:
            "Specifies the URL path that must be matched to send the cookie.",
        },
        {
          feature: "Domain",
          description:
            "Defines the domain for which the cookie is valid. It can be set to a higher-level domain to allow subdomains to access it.",
        },
        {
          feature: "Secure",
          description:
            "Ensures the cookie is only sent over HTTPS connections.",
        },
        {
          feature: "HttpOnly",
          description:
            "Prevents JavaScript from accessing the cookie, making it more secure against cross-site scripting (XSS) attacks.",
        },
        {
          feature: "SameSite",
          description:
            "Controls whether the cookie is sent with cross-site requests, helping to prevent CSRF attacks. Options include 'Strict', 'Lax', and 'None'.",
        },
      ],
      examples: [
        {
          id: "expiresExample",
          title: "Setting a cookie with an expiration date",
          description:
            "This example sets a cookie that expires on a specific date.",
          code: "document.cookie = 'username=John; expires=Fri, 31 Dec 2025 23:59:59 GMT; path=/';",
        },
        {
          id: "secureExample",
          title: "Setting a secure cookie",
          description:
            "This example sets a cookie that is only transmitted over HTTPS.",
          code: "document.cookie = 'sessionId=abc123; secure';",
        },
        {
          id: "sameSiteExample",
          title: "Setting a SameSite cookie",
          description:
            "This example sets a cookie with a 'Strict' SameSite policy to prevent cross-site requests.",
          code: "document.cookie = 'user=JohnDoe; SameSite=Strict';",
        },
      ],
      note: "Using secure options like HttpOnly, Secure, and SameSite can help improve security and prevent vulnerabilities like XSS and CSRF.",
    },
    {
      question: "How do you delete a cookie?",
      answer:
        "You can delete a cookie by setting the expiry date to a past date. You don't need to specify a cookie value in this case.",
      comparison: [
        {
          feature: "Expiration Date",
          description:
            "Setting an expiration date in the past ensures the browser removes the cookie immediately.",
        },
        {
          feature: "Path Parameter",
          description:
            "Defining the path ensures the correct cookie is deleted, as some browsers require it.",
        },
      ],
      examples: [
        {
          id: "deleteCookieExample",
          title: "Example of Deleting a Cookie",
          description:
            "This example removes a 'username' cookie by setting its expiration date to a past date.",
          code: "document.cookie = 'username=; expires=Fri, 07 Jun 2019 00:00:00 UTC; path=/';",
        },
      ],
      note: "You should define the cookie path option to ensure you delete the correct cookie. Some browsers do not allow deletion unless a path parameter is specified.",
    },
    {
      question:
        "What are the differences between cookies, local storage, and session storage?",
      answer:
        "Cookies, local storage, and session storage are all used for storing data in a browser, but they differ in terms of access, expiration, security, and storage capacity.",
      comparison: [
        {
          feature: "Accessed on Client or Server Side",
          description:
            "Cookies can be accessed on both the server-side (via HTTP headers) and the client-side (via JavaScript), whereas local storage and session storage are accessible only on the client-side.",
        },
        {
          feature: "Expiry",
          description:
            "Cookies expire based on the 'Expires' or 'Max-Age' attributes. Local storage persists indefinitely until manually deleted. Session storage lasts only until the browser tab is closed.",
        },
        {
          feature: "SSL Support",
          description:
            "Cookies support secure transmission over HTTPS using the Secure flag. Local storage and session storage do not provide built-in SSL support.",
        },
        {
          feature: "Maximum Data Size",
          description:
            "Cookies have a storage limit of 4KB, while local storage and session storage can store up to 5MB each.",
        },
        {
          feature: "Accessible From",
          description:
            "Cookies and local storage can be accessed from any window of the same origin, while session storage is restricted to the tab where it was created.",
        },
        {
          feature: "Sent with Requests",
          description:
            "Cookies are automatically sent with every HTTP request to the server, while local storage and session storage are not included in requests.",
        },
      ],
      examples: [
        {
          id: "cookieExample",
          title: "Setting a Cookie",
          description:
            "This example sets a cookie that expires on a specific date.",
          code: "document.cookie = 'username=John; expires=Fri, 31 Dec 2025 23:59:59 GMT; path=/';",
        },
        {
          id: "localStorageExample",
          title: "Using Local Storage",
          description:
            "This example stores a value in local storage and retrieves it.",
          code: "localStorage.setItem('username', 'JohnDoe');\nconsole.log(localStorage.getItem('username')); // Output: JohnDoe",
        },
        {
          id: "sessionStorageExample",
          title: "Using Session Storage",
          description:
            "This example stores a value in session storage and retrieves it.",
          code: "sessionStorage.setItem('sessionID', 'abc123');\nconsole.log(sessionStorage.getItem('sessionID')); // Output: abc123",
        },
      ],
      note: "Cookies are best for storing small, server-needed data such as authentication tokens, while local storage is useful for persistent client-side data. Session storage is ideal for temporary session-based data.",
    },
    {
      question:
        "What are the differences between cookies, local storage, and session storage?",
      answer:
        "Cookies, local storage, and session storage are all used for storing data in a browser, but they differ in terms of access, expiration, security, and storage capacity.",
      comparison: [
        {
          feature: "Accessed on Client or Server Side",
          cookie:
            "Both server-side & client-side. The 'Set-Cookie' HTTP response header is used by the server to send cookies to the client.",
          localStorage: "Client-side only.",
          sessionStorage: "Client-side only.",
        },
        {
          feature: "Expiry",
          cookie:
            "Manually configured using the 'Expires' or 'Max-Age' attributes.",
          localStorage: "Persists indefinitely until manually deleted.",
          sessionStorage: "Expires when the browser tab is closed.",
        },
        {
          feature: "SSL Support",
          cookie: "Supported with the Secure flag.",
          localStorage: "Not supported.",
          sessionStorage: "Not supported.",
        },
        {
          feature: "Maximum Data Size",
          cookie: "4KB.",
          localStorage: "5MB.",
          sessionStorage: "5MB.",
        },
        {
          feature: "Accessible From",
          cookie: "Any window of the same origin.",
          localStorage: "Any window of the same origin.",
          sessionStorage: "Same tab only.",
        },
        {
          feature: "Sent with Requests",
          cookie: "Yes, automatically sent with every HTTP request.",
          localStorage: "No.",
          sessionStorage: "No.",
        },
      ],
      examples: [
        {
          id: "cookieExample",
          title: "Setting a Cookie",
          description:
            "This example sets a cookie that expires on a specific date.",
          code: "document.cookie = 'username=John; expires=Fri, 31 Dec 2025 23:59:59 GMT; path=/';",
        },
        {
          id: "localStorageExample",
          title: "Using Local Storage",
          description:
            "This example stores a value in local storage and retrieves it.",
          code: "localStorage.setItem('username', 'JohnDoe');\nconsole.log(localStorage.getItem('username')); // Output: JohnDoe",
        },
        {
          id: "sessionStorageExample",
          title: "Using Session Storage",
          description:
            "This example stores a value in session storage and retrieves it.",
          code: "sessionStorage.setItem('sessionID', 'abc123');\nconsole.log(sessionStorage.getItem('sessionID')); // Output: abc123",
        },
      ],
      note: "Cookies are best for storing small, server-needed data such as authentication tokens, while local storage is useful for persistent client-side data. Session storage is ideal for temporary session-based data.",
    },
    {
      question:
        "What is the main difference between localStorage and sessionStorage?",
      answer:
        "LocalStorage and SessionStorage are both web storage mechanisms that store data in the browser, but they differ in persistence.",
      comparison: [
        {
          feature: "Persistence",
          localStorage:
            "Data persists even when the browser is closed and reopened. It has no expiration time.",
          sessionStorage:
            "Data is cleared when the page session ends (i.e., when the browser tab is closed).",
        },
        {
          feature: "Scope",
          localStorage: "Accessible from any tab or window of the same origin.",
          sessionStorage:
            "Accessible only within the same tab in which it was set.",
        },
      ],
      examples: [
        {
          id: "localStorageExample",
          title: "Using Local Storage",
          description:
            "This example stores a username in localStorage and retrieves it.",
          code: "localStorage.setItem('username', 'JohnDoe');\nconsole.log(localStorage.getItem('username')); // Output: JohnDoe",
        },
        {
          id: "sessionStorageExample",
          title: "Using Session Storage",
          description:
            "This example stores a session ID in sessionStorage and retrieves it.",
          code: "sessionStorage.setItem('sessionID', 'abc123');\nconsole.log(sessionStorage.getItem('sessionID')); // Output: abc123",
        },
      ],
      note: "Use localStorage for long-term data storage and sessionStorage for temporary session-based data.",
    },
  ];

  let uri = "employeeDetails? na me=jo hn & occupation = manager";
  let encoded_uri = encodeURI(uri);
  let decoded_uri = decodeURI(encoded_uri);

  console.log(decoded_uri, "decoded_uri", encoded_uri, "encoded_uri");

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
