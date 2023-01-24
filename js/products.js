const url = "https://vue3-course-api.hexschool.io/v2";
const api_path = "yuna1002";
let productModal = "";
let delProductModal = "";
import pagination from "./pagination.js";

const app = Vue.createApp({
  data() {
    return {
      products: [],
      isNew: true, //因為開同一個model，判斷是新增/編輯
      tempProduct: {
        imagesUrl: [],
      },
      pages: {}, //儲存分頁資料，其中一屬性total_pages
    };
  },
  components: {
    pagination,
  },
  methods: {
    checkAccount() {
      axios
        .post(`${url}/api/user/check`)
        .then((res) => {
          this.getProducts();
        })
        .catch((err) => {
          alert(err.response.data.message);
          window.location = "login.html";
        });
    },
    getProducts(page = 1) {
      //page=1 預設第一頁
      axios
        .get(`${url}/api/${api_path}/admin/products/?page=${page}`)
        .then((res) => {
          //console.log(res.data);
          this.products = res.data.products;
          this.pages = res.data.pagination;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //判斷開啟的model種類
    openModel(state, product) {
      if (state == "new") {
        this.tempProduct = {
          imagesUrl: [],
        }; //**
        this.isNew = true;
        productModal.show();
      } else if (state == "edit") {
        this.isNew = false;
        this.tempProduct = { ...product };
        productModal.show();
      } else if (state == "delete") {
        this.tempProduct = { ...product }; //後端認id
        delProductModal.show();
      }
    },
    updateProduct() {
      //**
      let method = "post";
      let sub = `${url}/api/${api_path}/admin/product`;
      if (!this.isNew) {
        sub = `${url}/api/${api_path}/admin/product/${this.tempProduct.id}`;
        method = "put";
      }
      axios[method](sub, {
        data: this.tempProduct,
      })
        .then((res) => {
          productModal.hide();
          this.getProducts();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    deleteProduct() {
      //model裡的確定鍵
      axios
        .delete(`${url}/api/${api_path}/admin/product/${this.tempProduct.id}`)
        .then((res) => {
          delProductModal.hide();
          this.getProducts();
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  mounted() {
    //將token從cookie取出，並儲存在header
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)yunaToken\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    axios.defaults.headers.common["Authorization"] = token;
    this.checkAccount();

    //model實體化
    productModal = new bootstrap.Modal(document.getElementById("productModal"));
    delProductModal = new bootstrap.Modal(
      document.getElementById("delProductModal")
    );
  },
});
app.mount("#app");
