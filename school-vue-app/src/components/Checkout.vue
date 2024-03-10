<template>
    <div id="box">
        <div class="container mt-5">
            <h1>Shopping Cart</h1>
        </div>
        <div class="container mt-3" v-if="shoppingCart.length <= 0">
            <p class="cartMessage">No items in the cart!!</p>
        </div>
        <div class="main-box container pt-5">
            <div class="row">
                <div class="col-md-4 col-12 pt-5" v-for="lesson in shoppingCart">
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
                                            <!-- on click runs a method taking the selected lesson as an argument -->
                                            <button @click="removeFromCart(lesson)" class="add-to-cart-button"
                                                type="button">
                                                Remove
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
        <div class="container pt-5">
            <div class="row">
                <div class="col-md-3">
                    <h2>Check Out</h2>
                    <form>
                        <div class="form-group">
                            <label for="name">Name:</label>
                            <!-- using the v-model takes the input and runs the checkName function -->
                            <input class="form-control" id="name" @input="checkName" v-model.trim="name">
                        </div>
                        <div class="form-group">
                            <label for="number">Phone Number:</label>
                            <!-- using the v-model takes the input and runs the checkNumber function -->
                            <input class="form-control" id="number" @input="checkNumber" v-model.trim="phoneNumber">
                        </div>
                        <div>
                            <!-- if the method correct form returns true the button is enabled but if it returns false the button is disabled -->
                            <button v-if="correctForm && shoppingCart.length > 0" @click="submitForm"
                                class="checkOutButton">Confirm Order</button>
                            <button v-else disabled style="background-color: red;" class="checkOutButton"
                                type="submit">Confirm Order</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: "Checkout",
    props: {
        shoppingCart: {
            type: Array,
            default: () => [],
        },
        lessonIDs: {
            type: Array,
            default: () => [],
        },
        lessons: {
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
            name: '',
            phoneNumber: '',
        }
    },

    computed: {
        correctForm() {
            // Check if the trimmed inputs are not empty
            const isNameValid = this.name !== '';
            const isPhoneNumberValid = this.phoneNumber !== '';

            return isNameValid && isPhoneNumberValid;
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

        //method to remove the selected lesson from the shopping cart
        removeFromCart(lesson) {
            this.$emit('lesson-removed', lesson, lesson._id);
        },

        //replace any characters that are not letters (A-Za-z) with an empty string
        //only letters are allowed in the input
        checkName(event) {
            this.name = event.target.value.replace(/[^A-Za-z]/g, '');
        },
        //replace any characters that are not digits (0-9) with an empty string
        //only numeric digits are allowed in the input
        checkNumber(event) {
            this.phoneNumber = event.target.value.replace(/[^0-9]/g, '');
        },

        //post request to store a new order in the database
        async submitOrder() {
            try {
                //http://localhost:3000/orders
                const response = await fetch('https://firstapp-env.eba-c7ragnr7.eu-west-2.elasticbeanstalk.com/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: this.name,
                        phoneNumber: this.phoneNumber,
                        lessonIDs: this.lessonIDs,
                        numberOfSpaces: this.num,
                    }),
                });
            } catch (error) {
                console.error('Error submitting order:', error);
                //handle error
            }
        },

        //put request to update the number spaces of the lessons after an order have been done
        async updateLessonSpaces() {
            try {
                //http://localhost:3000/lessons/updateSpaces
                const response = await fetch('https://firstapp-env.eba-c7ragnr7.eu-west-2.elasticbeanstalk.com/lessons/updateSpaces', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        lessonIDs: this.lessonIDs,
                    }),
                });
            } catch (error) {
                console.error('Error updating lesson spaces:', error);
                //handle error
            }
        },

        //submitting the form send an alert
        submitForm() {
            this.submitOrder();
            this.updateLessonSpaces();
            alert("Order comfirmed");
        }
    }
};

</script>