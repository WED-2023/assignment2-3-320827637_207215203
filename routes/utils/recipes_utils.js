const axios = require("axios");
require("dotenv").config();
const api_domain = "https://api.spoonacular.com/recipes";
// const apiKey = process.env.SPOONACULAR_API_KEY; // Ensure this variable is correctly set in your .env file

const apiKey = "eee0057bb4964d09b8734fd44f51ad7f"

// Function to fetch detailed information about a specific recipe
async function getRecipeInformation(recipe_id) {
    try {
        const response = await axios.get(`${api_domain}/${recipe_id}/information`, {
            params: {
                apiKey: apiKey
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching recipe information:", error);
        throw error;
    }
}

// Function to fetch a list of recipe details based on an array of IDs
async function getRecipesPreview(recipes_ids_list) {
    try {
        const ids = recipes_ids_list.join(',');
        const response = await axios.get(`${api_domain}/informationBulk`, {
            params: {
                ids: ids,
                apiKey: apiKey
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching recipes previews:", error);
        throw error;
    }
}

// Function to fetch random recipes
async function getRandomRecipes(number = 4) {
    try {
        const response = await axios.get(`${api_domain}/random`, {
            params: {
                number: number,
                apiKey: apiKey
            }
        });
        return response.data.recipes;
    } catch (error) {
        console.error("Error fetching random recipes:", error);
        throw error;
    }
}

// Function to search for recipes based on various parameters
async function searchRecipe(queryParams) {
    try {
        const response = await axios.get(`${api_domain}/complexSearch`, {
            params: {
                ...queryParams,
                apiKey: apiKey
            }
        });
        // Assuming we want to get detailed info for each found recipe
        if (response.data.results.length > 0) {
            const ids = response.data.results.map(recipe => recipe.id);
            return await getRecipesPreview(ids);
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error searching for recipes:", error);
        throw error;
    }
}

// Optional: Add more functions if necessary, such as fetching recipes by image, etc.

module.exports = {
    getRecipeInformation,
    getRecipesPreview,
    getRandomRecipes,
    searchRecipe
};







// const axios = require("axios");
// const { get } = require("http");
// const api_domain = "https://api.spoonacular.com/recipes";
// require("dotenv").config();
// const path = require('path');
// require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
// const apiKey = "eee0057bb4964d09b8734fd44f51ad7f"


// /**
//  * Get recipes list from spooncular response and extract the relevant recipe data for preview
//  * @param {*} recipes_info 
//  */


// async function getRecipeInformation(recipe_id) {
//     return await axios.get(`${api_domain}/${recipe_id}/information`, {
//         params: {
//             includeNutrition: false,
//             apiKey: process.env.spooncular_apiKey
//         }
//     });
// }

// /**
//  * Fetches detailed information about a recipe by its ID.
//  * 
//  * @param {number} recipe_id - The ID of the recipe to fetch details for.
//  * @returns {Promise<Object>} An object containing detailed information about the recipe.
//  */

// async function getRecipeDetails(recipe_id) {
//     let recipe_info = await getRecipeInformation(recipe_id);
//     let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe_info.data;

//     return {
//         id: id,
//         title: title,
//         readyInMinutes: readyInMinutes,
//         image: image,
//         popularity: aggregateLikes,
//         vegan: vegan,
//         vegetarian: vegetarian,
//         glutenFree: glutenFree,
        
//     }
// }
// /**
//  * Fetches preview information for a list of recipes by their IDs.
//  * 
//  * @param {Array<number>} recipes_ids_list - A list of recipe IDs to fetch preview information for.
//  * @returns {Promise<Array<Object>>} A list of objects containing preview information for each recipe.
//  */

// async function getRecipesPreview(recipes_ids_list) {
//     const promises = recipes_ids_list.map(id => getRecipeInformation(id));
//     const info_res = await Promise.all(promises);
//     return extractPreviewRecipeDetails(info_res);
// }


// /**
//  * Extracts preview information from a list of recipe objects.
//  * 
//  * @param {Array<Object>} recipe - A list of recipe objects to extract preview information from.
//  * @returns {Array<Object>} A list of objects containing preview information for each recipe.
//  */
// function getRecipePreviewInfo(recipe) {
//     return recipe.map(({ data, ...rest }) => {
//         const {
//             id,
//             title,
//             readyInMinutes,
//             image,
//             aggregateLikes,
//             vegan,
//             vegetarian,
//             glutenFree,
//         } = data || rest;

//         return {
//             id,
//             title,
//             image,
//             readyInMinutes,
//             popularity: aggregateLikes,
//             vegan,
//             vegetarian,
//             glutenFree
//         };
//     });
// }

// /**
//  * Searches for recipes based on various parameters.
//  * 
//  * @param {string} recipeName - The name of the recipe to search for.
//  * @param {string} cuisine - The type of cuisine to filter the search by.
//  * @param {string} diet - The type of diet to filter the search by.
//  * @param {string} intolerance - Any intolerances to filter the search by.
//  * @param {number} number - The number of recipes to return.
//  * @param {string} username - The username of the person performing the search.
//  * @returns {Promise<Array<Object>>} A list of objects containing preview information for each recipe.
//  */

// async function searchRecipe(recipeName, cuisine, diet, intolerance, number, username) {
//     const response = await axios.get(`${api_domain}/complexSearch`, {
//         params: {
//             query: recipeName,
//             cuisine: cuisine,
//             diet: diet,
//             intolerances: intolerance,
//             number: number,
//             apiKey: process.env.spooncular_apiKey
//         }
//     });

//     return getRecipesPreview(response.data.results.map((element) => element.id), username);
// }

// /**
//  * Extracts recipe IDs from a response object.
//  * 
//  * @param {Object} response - The response object containing recipe data.
//  * @returns {Array<number>} A list of recipe IDs.
//  */
// function get_ids_from_res(response) {
//     return response.data.recipes.map(recipe => recipe.id);
// }

// /**
//  * Fetches a list of random recipes with valid instructions.
//  * 
//  * @returns {Promise<Array<Object>>} A list of objects containing preview information for each recipe.
//  */

// async function getRandomRecipes() {
//     let goodResult = false;
//     let responseBack;

//     while (!goodResult) {
//         responseBack = await axios.get(`${api_domain}/random`, {
//             params: {
//                 number: 3,
//                 apiKey: process.env.spooncular_apiKey
//             }
//         });

//         const validRecipes = responseBack.data.recipes.filter(recipe => recipe.analyzedInstructions.length > 0);

//         if (validRecipes.length === 3) {
//             goodResult = true;
//         }
//     }

//     const recipePreviews = extractRandomPreview(responseBack.data.recipes);
//     return recipePreviews;
// }


// /**
//  * Fetches detailed information about a recipe by its ID from a picture.
//  * 
//  * @param {number} id - The ID of the recipe to fetch details for.
//  * @returns {Promise<Object>} An object containing detailed information about the recipe.
//  */

// async function getRecipeInfoFromPicture(id) {
//     const searchInfo = await getRecipeInformation(recipe_id);
//     const recipesInformation = GetFullDataRecipe(searchInfo);
//     geIngredients(recipesInformation);
//     getInstruction(recipesInformation);
//     return recipesInformation;
// }

// /**
//  * Extracts the original ingredients from a recipe object.
//  * 
//  * @param {Object} recipe - The recipe object to extract ingredients from.
//  */

// function geIngredients(recipe){
//     const ingredientsList = recipe.extendedIngredients;
//     const ingredients = ingredientsList.map(ingredient => ingredient.original);
//     recipe.extendedIngredients = ingredients;
// }


// /**
//  * Extracts and formats the instructions from a recipe object.
//  * 
//  * @param {Object} recipe - The recipe object to extract instructions from.
//  */

// function getInstruction(recipe){
//     const instructionsList = recipe.analyzedInstructions;
//     const instructions = instructionsList.flatMap(instruction =>
//         instruction.steps.map(step => ({
//             number: step.number,
//             description: step.step
//         }))
//     );
//     instructions.forEach((instruction, index) => {
//         instruction.number = index + 1;
//     });

//     recipe.analyzedInstructions = instructions;
// }

// /**
//  * Extracts full recipe information from a recipe object.
//  * 
//  * @param {Object} recipe - The recipe object to extract full information from.
//  * @returns {Object} An object containing full information about the recipe.
//  */

// function getFullRecipe(recipe){
//     const {
//         id,
//         title,
//         readyInMinutes,
//         image,
//         servings,
//         aggregateLikes,
//         vegan,
//         vegetarian,
//         glutenFree,
//         extendedIngredients,
//         analyzedInstructions
//     } = recipe.data;

//     return {
//         id,
//         title,
//         readyInMinutes,
//         image,
//         servings,
//         popularity: aggregateLikes,
//         vegan,
//         vegetarian,
//         glutenFree,
//         extendedIngredients,
//         analyzedInstructions
//     };
// }


// /**
//  * Extracts specified parameters from a query object and adds them to a searching parameters object.
//  * 
//  * @param {Object} query - The query object containing parameters to extract.
//  * @param {Object} searchingParameters - The object to add the extracted parameters to.
//  */

// function extractParameters(query, searchingParameters) {
//     const parameterList = ["cuisine", "diet", "intolerance"];
//     parameterList.forEach(param => {
//         if (query[param]) {
//             searchingParameters[param] = query[param];
//         }
//     });
// }

// // exports.getRecipeDetails = getRecipeDetails;
// module.exports = {
//     getRecipeDetails:getRecipeDetails,
//     getRecipesPreview:getRecipesPreview,
//     extractParameters:extractParameters,
//     searchRecipe:searchRecipe,
//     getRecipeInfoFromPicture:getRecipeInfoFromPicture,
// }


