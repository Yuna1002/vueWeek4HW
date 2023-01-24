const url = "https://vue3-course-api.hexschool.io/v2";
const app = Vue.createApp({
  data() {
    return {
      user: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    login() {
      axios
        .post(`${url}/admin/signin`, this.user)
        .then((res) => {
          //將token、expired儲存在cookie
          const { token, expired } = res.data;
          document.cookie = `yunaToken=${token}; expires=${new Date(expired)}`;
          //跳轉頁面
          window.location = "products.html";
        })
        .catch((err) => {
          if (err.data.success == false) {
            alert("輸入錯誤，請重新輸入");
            this.user.username = "";
            this.user.password = "";
          }
        });
    },
  },
});
app.mount("#app");
