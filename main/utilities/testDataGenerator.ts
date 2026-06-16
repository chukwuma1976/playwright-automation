export const generateTaskToAdd = (): { [key: string]: string } => {
    const title = `Task ${Date.now()}`;
    const categories = ["Work", "Personal", "Home"];
    const index = Math.floor(Math.random()) * 3;
    const category = categories[index];
    const description = `Add a task using under ${category}`;
    return {
        title,
        description,
        category,
    }
}

export const keyPresses = [
    { "F1": "You entered: F1" },
    { "F12": "You entered: F12" },
    { "Digit1": "You entered: 1" },
    { "Digit9": "You entered: 9" },
    { "KeyA": "You entered: A" },
    { "KeyZ": "You entered: Z" },
    { "Backquote": "You entered: BACK_QUOTE" },
    { "Backslash": "You entered: BACK_SLASH" },
    { "Backspace": "You entered: BACK_SPACE" },
    { "Tab": "You entered: TAB" },
    { "Delete": "You entered: DELETE" },
    { "Escape": "You entered: ESCAPE" },
    { "ArrowDown": "You entered: DOWN" },
    { "ArrowUp": "You entered: UP" },
    { "ArrowRight": "You entered: RIGHT" },
    { "ArrowLeft": "You entered: LEFT" },
    { "End": "You entered: END" },
    { "Home": "You entered: HOME" },
    { "Insert": "You entered: INSERT" },
    { "PageDown": "You entered: PAGE_DOWN" },
    { "PageUp": "You entered: PAGE_UP" },
    { "Shift": "You entered: SHIFT" },
    { "Control": "You entered: CONTROL" },
    { "Alt": "You entered: ALT" },
]
