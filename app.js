Vue.component('price', {
    data: function () {
        return {}
    },
    props: {
        value: Number,
        prefix: {
            type: String,
            default: '$'
        },
        precision: {
            type: Number,
            default: 2
        }
    },
    template: `<span class="font-weight-bold">{{ this.prefix + Number.parseFloat(this.value).toFixed(this.precision) }}</span>`
})

Vue.component('product-list', {
    props: ['products', 'maximum'],
    methods: {
        before: function(element) {
            element.className = "d-none"
        },
        enter: function(element) {
            var delay = element.dataset.index * 100
            setTimeout(function() {
                element.className = "row d-flex mb-3 align-items-center animated fadeInRight"
            }, delay)
        },
        leave: function(element) {
            var delay = element.dataset.index * 100
            setTimeout(function() {
                element.className = "row d-flex mb-3 align-items-center animated fadeOutRight"
            }, delay)
        },
    },
    template: `
    <transition-group name="fade" tag="div" @beforeEnter="before" @enter="enter" @leave="leave">
        <div class="row d-none mb-3 align-items-center" v-for="(item, index) in products" :key="item.id" v-if="item.price <= Number(maximum)" :data-index="index">
            <div class="col-1 m-auto">
                <button class="btn btn-info" @click="$emit('add', item)">+</button>
            </div>
            <div class="col-sm-4">
                <img :src="item.image" alt="item.name" class="img-fluid d-block">
            </div>
            <div class="col">
                <h3 class="text-info">{{ item.name }}</h3>
                <p class="mb-0">{{ item.description }}</p>
                <button class="btn btn-outline-warning btn-lg float-right">
                    <price  :value="Number(item.price)"
                            :prefix="'$'"
                            :precision="2"
                    ></price>
                </button>
            </div>
        </div>
    </transition-group>
    `
})

var app = new Vue({
    el: '#app',
    data: {
        maximum: 50,
        products: null,
        cart: [],
        style: {
            label: ['font-weight-bold', 'mr-2'],
            inputWidth: 60,
            sliderStatus: false
        }
    },
    mounted: function() {
        fetch("https://hplussport.com/api/products/order/price")
        .then(response => response.json())
        .then(data => {
            this.products = data;
        });
    },
    computed: {
        sliderState: function() {
            return this.style.sliderStatus ? 'd-flex' : 'd-none'
        },
        cartTotal: function() {
            let sum = 0
            for (key in this.cart) {
                sum = sum + (this.cart[key].product.price * this.cart[key].qty)
            }
            return sum;
        },
        cartQty: function() {
            let qty = 0
            for (key in this.cart) {
                qty = qty + this.cart[key].qty
            }
            return qty;
        },
    },
    filters: {
        currencyFormat: function (value) {
            return '$' + Number.parseFloat(value).toFixed(2)
        }
    },
    methods: {
        addItem: function(product) {
            var productIndex;
            var productExist = this.cart.filter(function (item, index) {
                if (item.product.id == Number(product.id)) {
                    productIndex = index;
                    return true
                } else {
                    return false
                }
            })

            if (productExist.length) {
                this.cart[productIndex].qty++
            } else {
                this.cart.push({ product: product, qty: 1 })
            }
        },
        deleteItem: function (key) {
            if (this.cart[key].qty > 1) {
                this.cart[key].qty--
            } else {
                this.cart.splice(key, 1)
            }
        }
        
        
    },
});