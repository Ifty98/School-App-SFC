<template>

    <div>
        <div class="container pt-5">
            <h3>Sort By</h3>
        </div>
        <div class="container pt-5">
            <div class="row">
                <div class="col-5">
                    <form>
                        <!-- form to sort lessons by subject, location, price or availability -->
                        <div class="form-check">
                            <input v-model="sort1" class="form-check-input" type="radio" name="sort" id="subject"
                                value="subject">
                            <label class="form-check-label" for="subject">Subject</label>
                        </div>
                        <div class="form-check">
                            <input v-model="sort1" class="form-check-input" type="radio" name="sort" id="location"
                                value="location">
                            <label class="form-check-label" for="location">Location</label>
                        </div>
                        <div class="form-check">
                            <input v-model="sort1" class="form-check-input" type="radio" name="sort" id="price"
                                value="price">
                            <label class="form-check-label" for="price">Price</label>
                        </div>
                        <div class="form-check">
                            <input v-model="sort1" class="form-check-input" type="radio" name="sort" id="availability"
                                value="availability">
                            <label class="form-check-label" for="availability">Availability</label>
                        </div>
                    </form>
                </div>
                <div class="col-5">
                    <form>
                        <!-- form to sort the lessons in ascending or descending order depending on (subject, location, price or availability) -->
                        <div class="form-check">
                            <input v-model="sort2" class="form-check-input" type="radio" name="sort2" id="ascending"
                                value="ascending">
                            <label class="form-check-label" for="ascending">Ascending</label>
                        </div>
                        <div class="form-check">
                            <input v-model="sort2" class="form-check-input" type="radio" name="sort2" id="descending"
                                value="descending">
                            <label class="form-check-label" for="descending">Descending</label>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div class="container pt-5">
            <div class="row">
                <div class="col-md-3">
                    <div class="input-group rounded">
                        <!-- input box to search items by subject or location -->
                        <input v-model.trim="searchInput" type="search" class="form-control rounded"
                            placeholder="Search" aria-label="Search" aria-describedby="search-addon" />
                        <span class="input-group-text border-0" id="search-addon">
                            <i class="fa-solid fa-magnifying-glass" style="color: #17b09e;"></i>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div class="main-box container pt-5">
            <div class="row">
                <!-- iterate through the array of lessons using v-for and for each lesson create a container to display it -->
                <div class="col-md-4 col-12 pt-5" v-for="lesson in sortedLessons">
                    <div class="card">
                        <div class="card-body">
                            <div class="container">
                                <div class="row">
                                    <div class="col">
                                        <p>Subject: {{ lesson.topic }}</p>
                                        <p>Location: {{ lesson.location }}</p>
                                        <p>Price: £{{ lesson.price }}</p>
                                        <p>Spaces: {{ lesson.space }}</p>
                                    </div>
                                    <div class="col">
                                        <div class="row pt-2">
                                            <img :src="getLessonImage(lesson)" alt="Lesson Image">
                                        </div>
                                        <div class="row pt-5">
                                            <!-- using v-if checks if the selected lesson still has spaces avilable or not to enable or disable the add to cart button -->
                                            <!-- clicking the button runs a method that takes as an argument the selected lesson -->
                                            <button v-if="lesson.space > 0" @click="addToCart(lesson)"
                                                class="add-to-cart-button" type="button">
                                                Add to Cart
                                            </button>
                                            <button v-else disabled style="background-color: red;"
                                                class="add-to-cart-button" type="button">
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>

export default {
    name: "ProductList",
    props: {
        lessons: {
            type: Array,
            required: true,
        },
        shoppingCart: {
            type: Array,
            required: true,
        },
        num: {
            type: Number,
            default: 0,
        },
    },

    data() {
        return {
            // initial value for the first sorting form
            sort1: '',
            // intial value for the second sorting form
            sort2: '',
            // initial value for the search bar
            searchInput: '',
            //lessons requested by the user using the search functionality
            searchedLessons: [

            ],
            //ids of the lessons that are in the shopping cart
            lessonIDs: [

            ],
        }
    },

    computed: {
        //function to sort the lessons 
        sortedLessons() {
            //if input value is subject 
            if (this.sort1 === 'subject') {
                //sort by subject in ascending order
                if (this.sort2 === 'ascending') {
                    /* using slice() creates a new array without changing the original array and sorts the new array
                    based on the comparison function added  */
                    return this.lessons.slice().sort((a, b) => a.topic.localeCompare(b.topic));
                }
                //sort by subject in descending order
                if (this.sort2 === 'descending') {
                    return this.lessons.slice().sort((a, b) => b.topic.localeCompare(a.topic));
                } else {
                    return this.lessons;
                }
            }

            if (this.sort1 === 'location') {
                if (this.sort2 === 'ascending') {
                    return this.lessons.slice().sort((a, b) => a.location.localeCompare(b.location));
                }
                if (this.sort2 === 'descending') {
                    return this.lessons.slice().sort((a, b) => b.location.localeCompare(a.location));
                } else {
                    return this.lessons;
                }
            }

            if (this.sort1 === 'price') {
                if (this.sort2 === 'ascending') {
                    return this.lessons.slice().sort((a, b) => a.price - b.price);
                }
                if (this.sort2 === 'descending') {
                    return this.lessons.slice().sort((a, b) => b.price - a.price);
                } else {
                    return this.lessons;
                }
            }

            if (this.sort1 === 'availability') {
                if (this.sort2 === 'ascending') {
                    return this.lessons.slice().sort((a, b) => a.space - b.space);
                }
                if (this.sort2 === 'descending') {
                    return this.lessons.slice().sort((a, b) => b.space - a.space);
                } else {
                    return this.lessons;
                }
            }
            //if user enters a text in the search space
            if (this.searchInput.length > 0) {
                //request to the server all the lessons searched by the user
                this.getSearchedLessons();
                //modify the lesssons array with the lessons got from the search request
                return this.lessons
                    .filter(lesson => this.searchedLessons.some(searchedLesson => searchedLesson._id === lesson._id));
            }

            else {
                return this.lessons;
            }
        },
    },

    methods: {
        getLessonImage(lesson) {
            if (lesson.topic == "Math") {
                //http://localhost:3000/lesson-images/math.png
                return this.lessonImage = "https://firstapp-env.eba-c7ragnr7.eu-west-2.elasticbeanstalk.com/lesson-images/math.png"
            }
            if (lesson.topic == "English") {
                //http://localhost:3000/lesson-images/english.png
                return this.lessonImage = "https://firstapp-env.eba-c7ragnr7.eu-west-2.elasticbeanstalk.com/lesson-images/english.png"
            }
            if (lesson.topic == "Music") {
                http://localhost:3000/lesson-images/music.png
                return this.lessonImage = "https://firstapp-env.eba-c7ragnr7.eu-west-2.elasticbeanstalk.com/lesson-images/music.png"
            }
            if (lesson.topic == "Science") {
                http://localhost:3000/lesson-images/science.png
                return this.lessonImage = "https://firstapp-env.eba-c7ragnr7.eu-west-2.elasticbeanstalk.com/lesson-images/science.png"
            }
        },

        //if user enters a text in the search space
        async getSearchedLessons() {
            try {
                //send get request with search input as a query parameter
                //const response = await fetch(`http://localhost:3000/lessons/search?userInput=${this.searchInput}`);
                const response = await fetch(`https://firstapp-env.eba-c7ragnr7.eu-west-2.elasticbeanstalk.com/lessons/search?userInput=${this.searchInput}`);
                //get data and store it in the searchedLessons array
                const data = await response.json();
                this.searchedLessons = data;
            } catch (error) {
                //catch any error during the request
                console.error('Error fetching lessons:', error);
            }
        },

        //method to add the selected lesson to the shopping cart
        addToCart(lesson) {
            this.$emit('lesson-added', lesson, lesson._id);
        },
    },
};

</script>