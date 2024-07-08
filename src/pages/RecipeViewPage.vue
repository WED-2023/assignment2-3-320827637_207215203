<template>
  <div class="container">
    <FullRecipe :recipe="recipe"/>
  </div>
</template>

<script>
import {mockGetRecipeFullDetails} from "../services/recipes.js";
import FullRecipe from '../components/FullRecipe.vue';
import {userBus} from "@/services/userBus";

export default {
  components: {
    FullRecipe
  },
  data() {
    return {
      recipe: null
    };
  },
  async created() {
    try {
      let response;
      response = mockGetRecipeFullDetails(this.$route.params.recipeId);
      console.log('Response:', response);

      if (!response.data || !response.data.recipe) {
        console.log('Response data or recipe is not defined');
        this.$router.replace("/NotFound");
      }

      let {
        analyzedInstructions,
        instructions,
        extendedIngredients,
        aggregateLikes,
        readyInMinutes,
        image,
        title,
        vegetarian,
        vegan,
        glutenFree,
        servings
      } = response.data.recipe;

      let _instructions = analyzedInstructions
          .map((fstep) => {
            fstep.steps[0].step = fstep.name + fstep.steps[0].step;
            return fstep.steps;
          })
          .reduce((a, b) => [...a, ...b], []);

      let _recipe = {
        instructions,
        _instructions,
        analyzedInstructions,
        extendedIngredients,
        aggregateLikes,
        readyInMinutes,
        image,
        title,
        vegetarian,
        vegan,
        glutenFree,
        servings
      };

      this.recipe = _recipe;
      userBus.markRecipeAsSeen(this.$route.params.recipeId);
    } catch (error) {
      console.log('Error in created() method:', error);
      console.log(error);
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  max-width: 800px;
}
</style>