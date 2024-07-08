<template>
  <div>
    <RecipePreviewList title="Family Recipes">
      <!-- You can put additional content here -->
    </RecipePreviewList>
  </div>
</template>

<script>
import RecipePreviewList from "../components/RecipePreviewList.vue";

export default {
  name: "FamilyRecipesPage",
  components: {
    RecipePreviewList
  },
  data() {
    return {
      // data properties go here
    };
  },
  methods: {
    // methods go here
  },
  computed: {
    // computed properties go here
  },
  mounted() {
    // lifecycle hooks go here
  }
};
</script>

<style scoped>
/* CSS styles go here */
</style>