var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils");


router.use(async function (req, res, next) {
  console.log("before if")
  if (req.session && req.session.user_id) {
    console.log(req.session.user_id)
    DButils.execQuery("SELECT username FROM users").then((users) => {
      console.log("before if")
      console.log(req.session.user_id)
      if (users.find((x) => x.username === req.session.user_id)) {
        console.log("in if")
        req.user_id = req.session.user_id;
        console.log("before next")
        next();
      }
    }).catch(err => next(err));
  } else {
    res.sendStatus(401);
  }
});

// async function addRecipeToFavorites(req, res, next) {
//   try {
//     if (!req.session.user_id) {
//       throw { status: 401, message: "No User Logged in." };
//     }
//     const user_id = req.user.user_id; // Assuming user_id is set in the authenticateToken middleware
//     const recipe_id = req.body.recipeId;
//     await user_utils.addRecipeToFavorites(user_id, recipeId);
//     res.status(200).send({ message: 'Recipe added to favorites successfully' });
//   } catch (error) {
//     next(error);
//   }
// }
// router.post('/favorites', addRecipeToFavorites);

router.post('/favorites', async (req, res, next) => {
  console.log("here")
  try {
    const { username, recipeId } = req.body;
    if (!username || !recipeId) {
      return res.status(400).send({ message: "Username and recipe ID are required" });
    }

    await user_utils.addRecipeToFavorites(username, recipeId);
    res.status(201).send({ message: "Recipe added to favorites successfully" });
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns the favorites recipes that were saved by the logged-in user
 */
router.get('/favorites', async (req, res, next) => {
  try {
    const username = req.session.user_id;
    console.log('User ID from session:', username); // Log the user ID

    if (!username) {
      return res.status(401).send({ message: 'User not authenticated', success: false });
    }

    const favoriteRecipes = await user_utils.getFavoriteRecipes(username);
    console.log('Favorite Recipes:', favoriteRecipes); // Log the response data

    res.status(200).send(favoriteRecipes);
  } catch (error) {
    next(error);
  }
});

/**
 * This path adds the watch recipe to the logged in user
 */
router.post('/markAsWatched', async (req, res, next) => {
  try {
    const recipe_id = req.body.recipeId;
    const user_id = req.session.user_id;

    // Call the AddToWatchedRecipes function
    await user_utils.addToWatchedRecipes(user_id, recipe_id);

    res.status(201).send("Watched recipes added successfully");
  } catch (error) {
    next(error);
  }
});

/**
 * This path shows the three latest recipes that the user watched
 */
router.get('/getRecentWatched', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    let recent_watched_recipes = await user_utils.getRecentWatchedRecipes(user_id);
    recent_watched_recipes = await recipe_utils.getRecipesPreview(recent_watched_recipes);

    res.status(200).send({ recipes: recent_watched_recipes });
  } catch (error) {
    next(error);
  }
});

/**
 * This path adds a personal recipe of the logge in user to the database
 */
router.post('/createPersonalRecipe', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const vegan = req.body.vegan ? 1 : 0;
    const glutenFree = req.body.glutenFree ? 1 : 0;
    const vegetarian = req.body.vegetarian ? 1 : 0;

    const recipe_details = {
      user_id,
      title: req.body.title,
      readyInMinutes: req.body.readyInMinutes,
      image: req.body.image,
      servings: req.body.servings,
      popularity: req.body.popularity,
      vegan,
      vegetarian,
      glutenFree,
      extendedIngredients: req.body.extendedIngredients,
      instructions: req.body.instructions
    };
    let username = req.session.user_id;
    await user_utils.addPersonalRecipes(recipe_details, username);
    res.status(201).send("Personal recipe added successfully");
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns a preview of a personal recipe of the logged in user
 */
router.get('/getPreviewPersonalRecipe', async (req, res) => {
  try {
    const user_id = req.session.user_id;
    const preview_personal_recipes = await user_utils.getPreviewPersonalRecipes(user_id);

    console.log(preview_personal_recipes)
    res.status(200).send({preview_personal_recipes});

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * This path returns a detailed personal recipe of the logged in user
 */
router.get('/GetDetailedPersonalRecipe', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const full_personal_recipes = await user_utils.getFullPersonalRecipes(user_id);

    res.status(200).send({ full_personal_recipes });
  } catch (error) {
    next(error);
  }
});

/**
 * This path checks if the user watched or added recipes to favorites using a list of recipe IDs.
 * Returns a list that for each ID contains: {watched_bool, favorite_bool}
 */
router.get("/CheckFavoriteWatched/:recipeIds", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const ids_list = req.params.recipeIds.split(',');
    console.log('Recipe IDs received:', ids_list);

    const results = await Promise.all(ids_list.map(async (recipe_id) => {
      const status = await user_utils.checkWatchedOrFavorite(recipe_id, user_id);
      return { [recipe_id]: status };
    }));

    const response = results.reduce((acc, curr) => ({ ...acc, ...curr }), {});

    res.status(200).send(response);
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns preview of the family recipes of the logged in user
 */
router.get('/GetPreviewFamilyRecipes', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const result = await user_utils.getFamilyPreviewRecipes(user_id);

    res.status(200).send({ result });
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns a full view of a family recipe of the logged in user
 */
router.get('/GetFamilyRecipe/:recipe_id', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipe_id = req.params.recipe_id;
    const result = await user_utils.getFamilyRecipeFullView(user_id, recipe_id);

    res.status(200).send({ result });
  } catch (error) {
    next(error);
  }
});

router.get('/:recipe_id', async (req, res, next) => {
  try {
    const recipe_id = req.params.recipe_id;
    const recipe = await recipe_utils.getRecipeById(recipe_id);
    res.status(200).send(recipe);
  } catch (error) {
    next(error);
  }
});

module.exports = router;