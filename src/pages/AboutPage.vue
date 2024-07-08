<template>
  <div class="container">
    <h1 class="title">About Us</h1>
    <p>Welcome to our recipe haven, a delightful corner of the web where culinary creativity meets family traditions. We're Mark and Itamer, two friends with a shared passion for cooking and a mission to bring people together through the love of food.</p>

    <h2 class="subtitle">Our Mission</h2>
    <p>Our website is designed to be a comprehensive resource for food enthusiasts of all levels. Whether you're a seasoned chef or a kitchen novice, our goal is to inspire you with a diverse array of recipes sourced from around the world. We utilize the Spoonacular API to provide you with an extensive collection of recipes, ensuring you have access to a wide variety of dishes to explore and enjoy.</p>

    <h2 class="subtitle">Create and Share</h2>
    <p>Beyond just offering recipes, we believe in the power of sharing. We know that some of the best recipes come from family traditions and personal creativity. That’s why we’ve made it easy for you to create your own recipes and share them with our community. Have a secret family recipe for the best lasagna? Or perhaps a unique twist on a classic dish? Share it with us and let others experience the magic.</p>

    <h2 class="subtitle">Connect Through Food</h2>
    <p>Food has a unique ability to bring people together, and we want our website to be a place where this connection happens. Discover new recipes, share your culinary creations, and celebrate the joy of cooking with friends and family. Our platform is built to be interactive and community-driven, fostering a space where everyone can contribute and benefit from shared culinary knowledge.</p>

    <h2 class="subtitle">Join Us</h2>
    <p>We invite you to join our community, explore new flavors, and contribute your own culinary masterpieces. Together, we can create a vibrant space where recipes are not just about food, but about the stories, traditions, and creativity that make each dish special.</p>

    <p>Thank you for being a part of our journey. Let's cook, share, and celebrate the love of food together!</p>

    <p class="signature">Mark & Itamar</p>
  </div>
</template>

<script>
export default {
  name: "About"
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: #333;
}

.title {
  text-align: center;
  color: #333;
  font-size: 2em;
  margin-bottom: 20px;
}

.subtitle {
  color: #666;
  font-size: 1.5em;
  margin-top: 20px;
  margin-bottom: 10px;
}

.signature {
  text-align: right;
  font-style: italic;
  margin-top: 30px;
}
</style>