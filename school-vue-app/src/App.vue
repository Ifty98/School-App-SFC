<template>
  <div id="app1">
    <div class="container pt-5">
      <div class="row">
        <div class="col-5">
          <h1>{{ webName }}</h1>
        </div>
        <div class="col-2">

        </div>
        <div class="col-4">
          <!-- using v-if checks if the shopping cart has items and the shopping cart is not showing to enable the button -->
          <!-- when the button is clicked the page changes -->
          <button v-if="num > 0 && currentView === 'ProductList'" class="shopping-cart" type="button"
            @click="changePage()">
            <i class="fa-solid fa-bag-shopping"></i>
            <!-- displays the number of items inside the shopping cart -->
            {{ num }} Shopping Cart
          </button>
          <!-- if it is showing the shopping cart page then the button is enabled -->
          <button v-else-if="currentView === 'Checkout'" class="shopping-cart" type="button" @click="changePage()">
            <i class="fa-solid fa-bag-shopping"></i>
            {{ num }} Shopping Cart
          </button>
          <!-- if not the button is disabled -->
          <button v-else disabled class="shopping-cart" type="button">
            <i class="fa-solid fa-bag-shopping"></i>
            {{ num }} Shopping Cart
          </button>

        </div>
      </div>
    </div>
    <div class="Test">
      <button @click="deleteAllCaches" class="test-elem">
        <span class="fas fa-trash"></span>
        Delete All Caches
      </button>
      <button @click="reloadPage" class="test-elem">
        <span class="fas fa-sync"></span>
        Reload Page
      </button>
      <strong class="test-elem">HTTPS Test: </strong>
      <a v-bind:href="'https://firstapp-env.eba-c7ragnr7.eu-west-2.elasticbeanstalk.com/lessons'"
        target="_blank">link</a>
      <button @click="unregisterAllServiceWorkers" class="test-elem">
        <span class="fab fa-uniregistry"></span>
        Unregister All ServiceWorkers
      </button>
    </div>
    <div>
      <component :is="currentView" :lessons="lessons" @lesson-added="updateShoppingCartAndNum1"
        :shoppingCart="shoppingCart" :lessonIDs="lessonIDs" :num="num" @lesson-removed="updateShoppingCartAndNum2">
      </component>
    </div>
  </div>
</template>

<script>
import ProductList from './components/ProductList.vue';
import Checkout from './components/Checkout.vue';

export default {
  name: "App",
  data() {
    return {
      webName: "After School Classes",
      //list of lessons in json format 
      lessons: [

      ],
      //lessons added to the shopping cart are stored here 
      shoppingCart: [

      ],
      // initial number of items in the shopping cart
      num: 0,
      currentView: 'ProductList',

      //ids of the lessons that are in the shopping cart
      lessonIDs: [

      ],
    };
  },

  components: {
    ProductList,
    Checkout,
  },

  created: function () {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register("service-worker.js");
        }
  },

  //run functions when the app is loaded
  mounted() {
    this.getLessons();
  },

  methods: {
    deleteAllCaches() {
      caches.keys().then(function (names) {
        for (let name of names)
          caches.delete(name);
      });
      console.log("All Caches Deleted");
    },

    unregisterAllServiceWorkers() {
      navigator.serviceWorker.getRegistrations().then(function (registrations) {
        for (let registration of registrations) {
          registration.unregister()
        }
      });
      console.log("ServiceWorkers Unregistered");
    },

    reloadPage() {
      window.location.reload();
    },

    //request to the server all data about the lessons
    async getLessons() {
      try {
        //send get request  
        //const response = await fetch('http://localhost:3000/lessons');
        const response = await fetch('https://firstapp-env.eba-c7ragnr7.eu-west-2.elasticbeanstalk.com/lessons');
        //get data and store it in the lessons array
        const data = await response.json();
        this.lessons = data;
      } catch (error) {
        //catch any error during the request
        console.error('Error fetching lessons:', error);
      }
    },

    //this method changes the value of showCart and showMain every time is executed
    changePage() {
      if (this.currentView === 'ProductList') {
        this.currentView = 'Checkout';
      } else {
        this.currentView = 'ProductList';
      }
    },

    updateShoppingCartAndNum1(lesson, updateLessonIDs) {
      this.addToCart(lesson);
      this.num++;
      this.lessonIDs.push(updateLessonIDs);
    },

    updateShoppingCartAndNum2(lesson, updateLessonIDs) {
      this.removeFromCart(lesson);
      this.num--;
      this.removeLessonID(updateLessonIDs);
    },

    removeLessonID(lessonId) {
      const index = this.lessonIDs.indexOf(lessonId);

      if (index !== -1) {
        this.lessonIDs.splice(index, 1);
      }
    },

    //method to add the selected lesson to the shopping cart
    addToCart(lesson) {
      // Check if the lesson is already in the shopping cart
      const cartLesson = this.shoppingCart.find(item => item._id === lesson._id);

      if (cartLesson) {
        // If the lesson is in the cart, increase its spaces by one
        lesson.space--;
        cartLesson.space++;
      } else {
        // If the lesson is not in the cart, add it to the cart
        lesson.space--;
        this.shoppingCart.push({ ...lesson, space: 1 });
      }
    },

    //method to remove the selected lesson from the shopping cart
    removeFromCart(lesson) {
      //decreases the spaces of the selected lesson in the shopping cart
      lesson.space--;
      //looks for the lesson in the lessons array using its id 
      const listLesson = this.lessons.find(item => item._id === lesson._id);
      //and increases its spaces
      listLesson.space++;
      // if the spaces for the lesson in the shopping cart reach 0, remove it from the shopping cart
      if (lesson.space === 0) {
        const lessonIndex = this.shoppingCart.findIndex(item => item._id === lesson._id);
        // if the lesson is found in the shopping cart, remove it
        if (lessonIndex !== -1) {
          this.shoppingCart.splice(lessonIndex, 1);
        }
      }

    },
  },
};

</script>
