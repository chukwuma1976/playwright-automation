import test from "@playwright/test";

test.describe("These are coding challenges", () => {

    test("Reverse a string", () => {
        const input = "Hello, World!";
        const expectedOutput = "!dlroW ,olleH";
        const actualOutput = reverseString(input);
        console.log("Input: ", input);
        console.log("Expected Output: ", expectedOutput);
        console.log("Actual Output: ", actualOutput);
    })

    test("Reverse an array", () => {
        const input = [1, 2, 3, 4, 5];
        const expectedOutput = [5, 4, 3, 2, 1];
        const actualOutput = reverseArray(input);
        console.log("Input: ", input);
        console.log("Expected Output: ", expectedOutput);
        console.log("Actual Output: ", actualOutput);
    })

    test("Reverse words in a string", () => {
        const input = "Hello, World!";
        const expectedOutput = "World! Hello,";
        const actualOutput = reverseWordsInString(input);
        console.log("Input: ", input);
        console.log("Expected Output: ", expectedOutput);
        console.log("Actual Output: ", actualOutput);
    })

    test("Check if a number is prime", () => {
        const input = 7;
        const expectedOutput = true;
        const actualOutput = checkIfNumberIsPrime(input);
        console.log("Input: ", input);
        console.log("Expected Output: ", expectedOutput);
        console.log("Actual Output: ", actualOutput);
    })

    test("Check if two strings are anagrams", () => {
        const input1 = "listen";
        const input2 = "silent";
        const expectedOutput = true;
        const actualOutput = checkIfStringIsAnagram(input1, input2);
        console.log("Input 1: ", input1);
        console.log("Input 2: ", input2);
        console.log("Expected Output: ", expectedOutput);
        console.log("Actual Output: ", actualOutput);
    })

    test("Check if a string is a palindrome", () => {
        const input = "A man, a plan, a canal, Panama";
        const expectedOutput = true;
        const actualOutput = checkIfStringIsPalindrome(input);
        console.log("Input: ", input);
        console.log("Expected Output: ", expectedOutput);
        console.log("Actual Output: ", actualOutput);
    })

    function reverseString(str: string): string {
        let reversed = "";
        for (let i = str.length - 1; i >= 0; i--) {
            reversed += str[i];
        }
        return reversed;
    }

    function reverseArray(arr: any[]): any[] {
        const reversedArr = [];
        for (let i = arr.length - 1; i >= 0; i--) {
            reversedArr.push(arr[i]);
        }
        return reversedArr;
    }

    function reverseWordsInString(str: string): string {
        const words = str.split(" ");
        const reversedWords = [];
        for (let i = words.length - 1; i >= 0; i--) {
            reversedWords.push(words[i]);
        }
        return reversedWords.join(" ");
    }

    function checkIfNumberIsPrime(num: number): boolean {
        if (num <= 1) return false;
        for (let i = 2; i <= num / 2; i++) {
            if (num % i === 0) {
                return false;
            }
        }
        return true;
    }

    function checkIfStringIsAnagram(str1: string, str2: string): boolean {
        return str1.toLowerCase().split('').sort() === str2.toLowerCase().split('').sort();
    }

    function checkIfStringIsPalindrome(str: string): boolean {

        const sanitizedStr = str.toLowerCase().replace(/[^a-z0-9]/g, '');
        console.log(sanitizedStr);
        console.log(sanitizedStr.split('').reverse().join(''));

        let left = 0;
        let right = sanitizedStr.length - 1;

        while (left < right) {
            if (sanitizedStr[left] !== sanitizedStr[right]) {
                console.log(`Mismatch found: ${sanitizedStr[left]} !== ${sanitizedStr[right]}`);
                return false
            }
            left++;
            right--;
        }
        return true;
    }
})