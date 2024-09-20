const DButils = require("./DButils");
const axios = require("axios");
require("dotenv").config();
const api_domain = "https://api.spoonacular.com/recipes";
const apiKey = process.env.SPOONACULAR_API_KEY; // Ensure this variable is correctly set in your .env file

async function markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`insert into FavoriteRecipes values ('${user_id}',${recipe_id})`);
}

// async function getFavoriteRecipes(user_id){
//     const recipes_id = await DButils.execQuery(`select recipe_id from FavoriteRecipes where user_id='${user_id}'`);
//     return recipes_id;
// }

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
async function addPersonalRecipes(recipe_details, username) {
    try {
        const user_id = await DButils.execQuery(`SELECT id
                                                    FROM users
                                                    WHERE username = '${username}'`);
        console.log(user_id[0].id);
        // Insert the recipe details into the recipes table
        // Set default values if any field is undefined
        const title = recipe_details.title || '';
        const readyInMinutes = recipe_details.readyInMinutes || 0;
        const image = recipe_details.image ? `'${recipe_details.image}'` : 'NULL';
        const servings = recipe_details.servings || 0;
        const popularity = recipe_details.popularity || 0;
        const vegan = recipe_details.vegan ? 1 : 0;
        const vegetarian = recipe_details.vegetarian ? 1 : 0;
        const glutenFree = recipe_details.glutenFree ? 1 : 0;
        const extendedIngredients = recipe_details.extendedIngredients || '';
        const instructions = recipe_details.instructions || '';

        // Insert the recipe details into the recipes table
        await DButils.execQuery(`
            INSERT INTO recipes (
                user_id, title, readyInMinutes, image, servings, popularity, vegan, vegetarian, glutenFree, extendedIngredients, instructions
            ) VALUES (
                '${user_id[0].id}', '${title}', '${readyInMinutes}', ${image}, ${servings}, ${popularity}, ${vegan},
                ${vegetarian}, ${glutenFree}, '${extendedIngredients}', '${instructions}'
            )
        `);

        // Get the ID of the newly inserted recipe
        const maxRecipeIdResult = await DButils.execQuery('SELECT MAX(recipe_id) AS max_recipe_id FROM recipes;');
        const maxRecipeId = maxRecipeIdResult[0].max_recipe_id;

        // Insert the recipe ID and user ID into the mypersonalrecipes table
        await DButils.execQuery(`
            INSERT INTO mypersonalrecipes (recipe_id, user_id) VALUES ('${maxRecipeId}', '${user_id[0].id}')
        `);
    } catch (error) {
        console.error(error);
        throw new Error('Failed to add personal recipe');
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

/**
 * Retrieves all favorite recipes for a given user from the database.
 *
 * @param {number} username - The ID of the user.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of favorite recipes.
 */

async function getFavoriteRecipes(username) {
    try {
        const userResult = await DButils.execQuery(`SELECT id
                                                    FROM users
                                                    WHERE username = '${username}'`);
        if (userResult.length === 0) {
            throw new Error('User not found');
        }
        const id = userResult[0].id;

        const query = `
            SELECT recipe_id as id
            FROM favoriterecipes
            WHERE user_id = ${id}
        `;


        console.log('Executing SQL Query:', query); // Log the SQL query
        let result = await DButils.execQuery(query);
        console.log('User ID:', id); // Log the user ID
        console.log('SQL Query Result:', result); // Log the SQL query result

        return result.map(row => row.id); // Return only the recipe IDs
    }
    catch (error) {
        console.error('Error executing query:', error);
        throw new Error('Failed to retrieve favorite recipes');
    }
}

/**
 * Adds a recipe to the user's favorites.
 *
 * @param {string} username - The ID of the user.
 * @param {number} recipe_id - The ID of the recipe.
 * @returns {Promise<void>}
 */
async function addRecipeToFavorites(username, recipe_id) {
    try{
        const userResult = await DButils.execQuery(`SELECT id FROM users WHERE username = '${username}'`);
        if (userResult.length === 0) {
            throw new Error('User not found');
        }
        const user_id = userResult[0].id;
        await DButils.execQuery(`INSERT INTO FavoriteRecipes (user_id, recipe_id) VALUES ('${user_id}', ${recipe_id})`);
    } catch (error) {
        console.error('Error adding recipe to favorites:', error);
        throw new Error('Failed to add recipe to favorites');
    }
}


async function getRecipeById(recipe_id) {
    try {
        const response = await axios.get(`${api_domain}/${recipe_id}/information`, {
            params: {
                apiKey: apiKey
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

exports.markAsFavorite = markAsFavorite;
exports.addToWatchedRecipes = addToWatchedRecipes;
exports.getRecentWatchedRecipes = getRecentWatchedRecipes;
exports.addPersonalRecipes = addPersonalRecipes;
exports.getPreviewPersonalRecipes = getPreviewPersonalRecipes;
exports.getFullPersonalRecipes = getFullPersonalRecipes;
exports.checkWatchedOrFavorite = checkWatchedOrFavorite;
exports.getFamilyPreviewRecipes = getFamilyPreviewRecipes;
exports.getFamilyRecipeFullView = getFamilyRecipeFullView;
exports.getUsernameById = getUsernameById;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.getRecipeById = getRecipeById;
exports.addRecipeToFavorites = addRecipeToFavorites;