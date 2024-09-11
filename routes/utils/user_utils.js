const DButils = require("./DButils");

async function markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`insert into FavoriteRecipes values ('${user_id}',${recipe_id})`);
}

async function getFavoriteRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from FavoriteRecipes where user_id='${user_id}'`);
    return recipes_id;
}

/**
 * Adds a record to the WatchedRecipes table with the user_id and recipe_id.
 * 
 * @param {number} user_id - The ID of the user.
 * @param {number} recipe_id - The ID of the recipe.
 */
async function addToWatchedRecipes(user_id, recipe_id) {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 19).replace('T', ' ');

    try {
        const checkQuery = `
            SELECT recipe_id
            FROM watchedrecipes
            WHERE recipe_id = ${recipe_id}
            LIMIT 1
        `;
        const checkResult = await DButils.execQuery(checkQuery);

        let query;
        if (checkResult.length === 0) {
            query = `
                INSERT INTO watchedrecipes (recipe_id, user_id, date_watched)
                VALUES (${recipe_id}, ${user_id}, '${formattedDate}')
            `;
        } else {
            query = `
                UPDATE watchedrecipes
                SET date_watched = '${formattedDate}'
                WHERE recipe_id = ${recipe_id} AND user_id = ${user_id}
            `;
        }

        await DButils.execQuery(query);
    } catch (error) {
        console.error(error);
    }
}

/**
 * Checks if a recipe has been watched or marked as favorite by a user.
 * 
 * @param {number} recipe_id - The ID of the recipe.
 * @param {number} user_id - The ID of the user.
 * @returns {Promise<Object>} An object containing the watched and favorite status of the recipe.
 */
async function checkWatchedOrFavorite(recipe_id, user_id) {
    const result = {};

    try {
        // Check if the recipe is watched
        const watchedQuery = `
            SELECT *
            FROM watchedRecipes
            WHERE user_id = ${user_id} AND recipe_id = ${recipe_id}
        `;
        const watchedResult = await DButils.execQuery(watchedQuery);
        result.watched = watchedResult.length > 0;

        // Check if the recipe is favorite
        const favoriteQuery = `
            SELECT *
            FROM favoriterecipes
            WHERE user_id = ${user_id} AND recipe_id = ${recipe_id}
        `;
        const favoriteResult = await DButils.execQuery(favoriteQuery);
        result.favorite = favoriteResult.length > 0;

        return result;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to check if recipe is watched or favorite');
    }
}

/**
 * Retrieves the most recent recipes watched by a user.
 * 
 * @param {number} user_id - The ID of the user.
 * @returns {Promise<number[]>} A promise that resolves to an array of recipe IDs.
 */
async function getRecentWatchedRecipes(user_id) {
    try {
        const query = `
            SELECT recipe_id
            FROM watchedrecipes
            WHERE user_id = ${user_id}
            ORDER BY date_watched DESC
            LIMIT 3
        `;
        const results = await DButils.execQuery(query);
        return results.map(result => result.recipe_id);
    } catch (error) {
        console.error(error);
        throw new Error('Failed to retrieve recent watched recipes');
    }
}

/**
 * Adds a new personal recipe to the database and saves the recipe ID and user ID in the mypersonalrecipes table.
 * 
 * @param {Object} recipe_details - The details of the recipe to be added.
 * @param {number} recipe_details.user_id - The ID of the user.
 * @param {string} recipe_details.title - The title of the recipe.
 * @param {number} recipe_details.readyInMinutes - The time required to prepare the recipe.
 * @param {string} recipe_details.image - The image URL of the recipe.
 * @param {number} recipe_details.servings - The number of servings.
 * @param {number} recipe_details.popularity - The popularity score of the recipe.
 * @param {boolean} recipe_details.vegan - Whether the recipe is vegan.
 * @param {boolean} recipe_details.vegetarian - Whether the recipe is vegetarian.
 * @param {boolean} recipe_details.glutenFree - Whether the recipe is gluten-free.
 * @param {string} recipe_details.extendedIngredients - The extended ingredients of the recipe.
 * @param {string} recipe_details.instructions - The instructions for the recipe.
 * @returns {Promise<void>}
 */
async function addPersonalRecipes(recipe_details) {
    try {
      console.log('Inserting recipe into database:', recipe_details); // Add this line
      await DButils.execQuery(
        `INSERT INTO personal_recipes (user_id, title, readyInMinutes, image, servings, popularity, vegan, vegetarian, glutenFree, extendedIngredients, instructions)
        VALUES (
          '${recipe_details.user_id}',
          '${recipe_details.title}',
          '${recipe_details.readyInMinutes}',
          '${recipe_details.image}',
          '${recipe_details.servings}',
          '${recipe_details.popularity}',
          '${recipe_details.vegan}',
          '${recipe_details.vegetarian}',
          '${recipe_details.glutenFree}',
          '${recipe_details.extendedIngredients}',
          '${recipe_details.instructions}'
        )`
      );
      console.log('Recipe inserted successfully'); // Add this line
    } catch (error) {
      console.error('Error inserting recipe into database:', error); // Add this line
      throw error;
    }
  }


/**
 * Retrieves all personal recipes in preview format for a given user from the database.
 * 
 * @param {number} user_id - The ID of the user.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of personal recipe previews.
 */
async function getPreviewPersonalRecipes(user_id) {
    const query = `
        SELECT m.recipe_id as id, title, readyInMinutes, image, popularity, vegan, vegetarian, glutenFree
        FROM recipes re
        JOIN mypersonalrecipes m ON re.recipe_id = m.recipe_id
        WHERE re.user_id = ${user_id}
    `;
    
    try {
        let result = await DButils.execQuery(query);
        
        result = result.map(row => ({
            ...row,
            glutenFree: row.glutenFree === 1,
            vegan: row.vegan === 1,
            vegetarian: row.vegetarian === 1
        }));
        
        return result;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to retrieve personal recipe previews');
    }
}

/**
 * Retrieves all personal recipes in full format for a given user from the database.
 * 
 * @param {number} user_id - The ID of the user.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of personal recipes in full format.
 */
async function getFullPersonalRecipes(user_id) {
    const query = `
        SELECT re.recipe_id as id, title, readyInMinutes, image, servings, popularity, vegan, vegetarian, glutenFree, extendedIngredients, instructions
        FROM recipes re
        JOIN mypersonalrecipes m ON re.recipe_id = m.recipe_id
        WHERE re.user_id = ${user_id}
    `;
    
    try {
        let result = await DButils.execQuery(query);
        
        result = result.map(row => ({
            ...row,
            glutenFree: row.glutenFree === 1,
            vegan: row.vegan === 1,
            vegetarian: row.vegetarian === 1
        }));
        
        return result;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to retrieve full personal recipes');
    }
}


/**
 * Retrieves all family recipes in preview format for a given user from the database.
 * 
 * @param {number} user_id - The ID of the user.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of family recipe previews.
 */
async function getFamilyPreviewRecipes(user_id) {
    const query = `
        SELECT re.recipe_id as id, title, readyInMinutes, image, popularity, vegan, vegetarian, glutenFree
        FROM recipes re
        JOIN familyrecipes f ON re.recipe_id = f.recipe_id
        WHERE re.user_id = ${user_id}
    `;
    
    try {
        let result = await DButils.execQuery(query);
        
        result = result.map(row => ({
            ...row,
            glutenFree: row.glutenFree === 1,
            vegan: row.vegan === 1,
            vegetarian: row.vegetarian === 1
        }));
        
        return result;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to retrieve family recipe previews');
    }
}


/**
 * Retrieves a family recipe in full format for a given user and recipe ID from the database.
 * 
 * @param {number} user_id - The ID of the user.
 * @param {number} recipe_id - The ID of the recipe.
 * @returns {Promise<Object>} A promise that resolves to an object containing the full family recipe details.
 */
async function getFamilyRecipeFullView(user_id, recipe_id) {
    const query = `
        SELECT re.recipe_id as id, title, readyInMinutes, image, about, occasion, servings, vegan, vegetarian, glutenFree, extendedIngredients, instructions, chef
        FROM recipes re
        JOIN familyrecipes f ON re.recipe_id = f.recipe_id
        WHERE re.user_id = ${user_id} AND re.recipe_id = ${recipe_id}
    `;
    
    try {
        let result = await DButils.execQuery(query);
        
        result = result.map(row => ({
            ...row,
            glutenFree: row.glutenFree === 1,
            vegan: row.vegan === 1,
            vegetarian: row.vegetarian === 1
        }));
        
        return result.length > 0 ? result[0] : null;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to retrieve full family recipe');
    }
}


/**
 * Retrieves the username from the database using the user ID.
 * 
 * @param {number} user_id - The ID of the user.
 * @returns {Promise<string>} A promise that resolves to the username.
 */
async function getUsernameById(user_id) {
    const query = `
        SELECT username
        FROM users
        WHERE id = ${user_id}
    `;
    
    try {
        const result = await DButils.execQuery(query);
        return result.length > 0 ? result[0].username : null;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to retrieve username');
    }
}



exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.addToWatchedRecipes = addToWatchedRecipes;
exports.getRecentWatchedRecipes = getRecentWatchedRecipes;
exports.addPersonalRecipes = addPersonalRecipes;
exports.getPreviewPersonalRecipes = getPreviewPersonalRecipes;
exports.getFullPersonalRecipes = getFullPersonalRecipes;
exports.checkWatchedOrFavorite = checkWatchedOrFavorite;
exports.getFamilyPreviewRecipes = getFamilyPreviewRecipes;
exports.getFamilyRecipeFullView = getFamilyRecipeFullView;
exports.getUsernameById = getUsernameById;