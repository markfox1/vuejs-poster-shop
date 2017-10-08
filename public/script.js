const PRICE = 9.99;
const LOAD_NUM = 10;

new Vue({
  el: '#app',
  data: {
    total: 0,
    items: [],
    results: [],
    cart: [],
    newSearch: 'anime',
    lastSearch: '',
    loading: false,
    price: PRICE
  },
  computed: {
    noMoreItems: function() {
      return this.items.length === this.results.length && this.results.length > 0;
    }
  },
  mounted: function() {
    this.onSubmit();

    let vue = this;
    let watcher = scrollMonitor.create(document.getElementById("product-list-bottom"));

    watcher.enterViewport(function() {
      vue.appendItems();
    });
  },
  methods: {
    addItem: function(index) {

      let item = this.items[index];
      let found = false;

      this.total += PRICE;

      for (let i = 0; i < this.cart.length; i++) {
        if (this.cart[i].id === item.id) {
          this.cart[i].qty += 1;
          found = true;
          break;
        }
      }

      if (!found) {
        this.cart.push({
          id: item.id,
          title: item.title,
          price: PRICE,
          qty: 1
        });
      }
    },
    appendItems: function() {
      if (this.items.length < this.results.length) {
        this.items = this.items.concat(this.results.slice(this.items.length, this.items.length + LOAD_NUM));
      }
    },
    inc: function(item) {
      item.qty++;
      this.total += PRICE;
    },
    dec: function(item) {
      item.qty--;
      this.total -= PRICE;

      if (item.qty <= 0) {
        for (let i = 0; i < this.cart.length; i++) {
          if (this.cart[i].id === item.id) {
            this.cart.splice(i, 1);
            break;
          }
        }
      }
    },
    onSubmit: function() {
      if (this.newSearch) {
        this.items = [];
        this.loading = true;
        this.$http
        .get('/search/'.concat(this.newSearch))
        .then(function(res) {
          this.lastSearch = this.newSearch;
          this.results = res.data;
          this.loading = false;
        }).then(this.appendItems);
      }
    }
  },
  filters: {
    currency: function(price) {
      return "$".concat(price.toFixed(2));
    }
  }
});
