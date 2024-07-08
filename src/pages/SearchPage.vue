<template>
  <div class="search-page">
    <h1>Search Recipes</h1>
    <div>
      <input type="text" v-model="searchQuery" placeholder="Search for recipes...">
      <select v-model="selectedCuisine">
        <option value="">All Cuisines</option>
        <option v-for="cuisine in cuisines" :key="cuisine" :value="cuisine">{{ cuisine }}</option>
      </select>
      <select v-model="selectedDiet">
        <option value="">All Diets</option>
        <option v-for="diet in diets" :key="diet" :value="diet">{{ diet }}</option>
      </select>
      <select v-model="selectedIntolerance">
        <option value="">No Intolerance</option>
        <option v-for="intolerance in intolerances" :key="intolerance" :value="intolerance">{{ intolerance }}</option>
      </select>
      <select v-model="resultsLimit">
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="15">15</option>
      </select>
      <button @click="fetchRecipes">Search</button>
    </div>
    <div v-if="searchResults.length">
      <div v-for="result in sortedResults" :key="result.id" class="recipe-preview">
        <img :src="result.image" @click="goToRecipe(result.id)">
        <div>
          <h3>{{ result.title }}</h3>
          <p>Prep Time: {{ result.readyInMinutes }} minutes</p>
          <p>Likes: {{ result.aggregateLikes }}</p>
        </div>
      </div>
    </div>
    <div v-else-if="searchInitiated">
      <p>No recipes found. Try adjusting your search criteria.</p>
    </div>
  </div>
</template>

<script>
import { mockGetRecipesPreview } from "@/services/recipes"; // Ensure the path matches your project structure

export default {
  data() {
    return {
      searchQuery: '',
      searchResults: [],
      selectedCuisine: '',
      selectedDiet: '',
      selectedIntolerance: '',
      resultsLimit: '5',
      cuisines: ['Italian', 'Mexican', 'Chinese'],
      diets: ['Vegetarian', 'Keto', 'Vegan'],
      intolerances: ['Dairy', 'Gluten', 'Peanut'],
      searchInitiated: false, // Tracks if search has been performed
    };
  },
  methods: {
    fetchRecipes() {
      this.searchInitiated = true;
      const { recipes } = mockGetRecipesPreview(parseInt(this.resultsLimit)).data;
      this.searchResults = recipes.filter(recipe => {
        return (this.searchQuery.length === 0 || recipe.title.toLowerCase().includes(this.searchQuery.toLowerCase())) &&
               (this.selectedCuisine === '' || recipe.cuisine === this.selectedCuisine) &&
               (this.selectedDiet === '' || recipe.diet === this.selectedDiet) &&
               (this.selectedIntolerance === '' || recipe.intolerances.includes(this.selectedIntolerance));
      });
      localStorage.setItem('lastSearch', JSON.stringify({
        query: this.searchQuery,
        cuisine: this.selectedCuisine,
        diet: this.selectedDiet,
        intolerance: this.selectedIntolerance,
        number: this.resultsLimit
      }));
    },
    initializeSearch() {
      const lastSearch = JSON.parse(localStorage.getItem('lastSearch'));
      if (lastSearch) {
        this.searchQuery = lastSearch.query;
        this.selectedCuisine = lastSearch.cuisine;
        this.selectedDiet = lastSearch.diet;
        this.selectedIntolerance = lastSearch.intolerance;
        this.resultsLimit = lastSearch.number;
      }
    },
    goToRecipe(id) {
      this.$router.push({ name: 'recipe', params: { recipeId: id } });
    }
  },
  computed: {
    sortedResults() {
      return this.searchResults.sort((a, b) => a.readyInMinutes - b.readyInMinutes);
    }
  }
};
</script>

<style scoped>
.search-page {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.recipe-preview {
  display: flex;
  align-items: center;
  cursor: pointer;
}
.recipe-preview img {
  width: 100px;
  height: 100px;
  margin-right: 20px;
}
</style>