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
