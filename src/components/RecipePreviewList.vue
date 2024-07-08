<template>
  <b-container>
    <h3>
      {{ title }}:
      <slot></slot>
    </h3>
    <b-button @click="updateRecipes">Refresh Recipes</b-button>
    <b-row>
      <b-col v-for="r in recipes" :key="r.id">
        <RecipePreview class="recipePreview" :recipe="r" />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import RecipePreview from "./RecipePreview.vue";
import { mockGetRecipesPreview } from "../services/recipes.js";
export default {
  name: "RecipePreviewList",
  components: {
    RecipePreview
  },
  props: {
    title: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      recipes: [],
      // randomRecipes: []
    };
  },
  mounted() {
    this.updateRecipes();
    // this.randomRecipes = this.getRandomRecipes();

  },
  methods: {
    // getRandomRecipes() {
    //   let randomRecipes = [];
    //   let copyRecipes = [...this.recipes]; // Create a copy of the recipes array
    //   for(let i = 0; i < 3; i++) {
    //     if(copyRecipes.length === 0) {
    //       break; // Exit the loop if there are no more recipes to select
    //     }
    //     let randomIndex = Math.floor(Math.random() * copyRecipes.length);
    //     randomRecipes.push(copyRecipes[randomIndex]);
    //     copyRecipes.splice(randomIndex, 1); // Remove the selected recipe from the copy
    //   }
    //   return randomRecipes;
    // },

    async updateRecipes() {
      try {
        // const response = await this.axios.get(
        //   this.$root.store.server_domain + "/recipes/random",
        // );

        // const amountToFetch = 5; // Set this to how many recipes you want to fetch
        const amountToFetch = 3; // Set this to how many recipes you want to fetch
        const response = mockGetRecipesPreview(amountToFetch);


        console.log(response);
        const recipes = response.data.recipes;
        console.log(recipes);
        this.recipes = [];
        this.recipes.push(...recipes);
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 400px;
}
</style>
