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