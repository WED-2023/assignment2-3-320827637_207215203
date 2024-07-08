export const userBus = {
    data: {
        user: null,
        seenRecipes: []
    },
    getUser() {
        return this.data.user;
    },
    setUser(user) {
        this.data.user = user;
    },
    markRecipeAsSeen(recipeId) {
        return new Promise(resolve => {
            console.log('Marking recipe as seen in userBus:', recipeId);
            this.data.seenRecipes.push(Number(recipeId));
            setTimeout(resolve, 100); // Wait for 100ms before resolving the promise
        });
    },
    hasSeenRecipe(recipeId) {
        const hasSeen = this.data.seenRecipes.includes(Number(recipeId));
        console.log('Checking if recipe has been seen in userBus:', recipeId, hasSeen);
        return hasSeen;
    }
};