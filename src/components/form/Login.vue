<template>
  <Card :padding="40">
    <h3 slot="title" style="text-align:center" v-show="pathType=='buyer'">欢迎VIP登录</h3>
    <h3 slot="title" style="text-align:center" v-if="pathType=='seller'">欢迎商家登录</h3>
    <Form ref="userInfo" :model="userInfo" :rules="rules" :label-width="80">
      <FormItem label="用户名" prop="userName">
        <Input placeholder="输入你的姓名" v-model="userInfo.userName" />
      </FormItem>
      <FormItem label="密码" prop="password">
        <Input v-model="userInfo.password" placeholder="输入你的密码" type="password" password />
      </FormItem>
      <FormItem label='验证码' prop='captcha'>
        <Input v-model="userInfo.captcha" placeholder="输入你的验证码" />
        <img :src='codeImg' alt="验证码" @click="changeCaptcha()">
      </FormItem>
      <FormItem>
        <Button type="primary" @click="login">登录</Button>
        <Button @click="toRegister" style="margin-left: 8px">没有账号，注册</Button>
      </FormItem>
    </Form>
  </Card>
</template>

<script>
export default {
  data () {
    return {
      codeImg: null,
      num: null,
      form: {
        userName: '',
        password: ''
      },
      userInfo: {
        userName: null,
        password: null,
        captcha: null,
        key: null
      },
      rules: {
        userName: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          },
          {
            pattern: "^\\w{6,20}$",
            message: "6-20位字母、数字、下划线"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入的密码"
          },
          {
            pattern: "^\\w{6,20}$",
            message: "6-20位字母、数字、下划线"
          }
        ],
        code: [
          {
            required: true,
            message: '请输入图片的验证码',
            trigger: "blur"
          }
        ]
      }
    };
  },
  props: {
    pathType: String
  },
  mounted () {

    var num = Math.ceil(Math.random() * 10);
    //保存随机数
    this.num = num
    //给userInfo.key赋值
    this.$set(this.userInfo, 'key', num)
    this.$api.captcha(this.userInfo.key).then(res => {
      //解密
      this.codeImg = 'data:image/png;base64,' + res.data

    })
  },
  methods: {
    changeCaptcha () {
      var num = Math.ceil(Math.random() * 10);
      this.$set(this.userInfo, 'key', num)
      this.$api.captcha(this.userInfo.key).then(res => {
        this.codeImg = 'data:image/png;base64,' + res.data
      })
    },
    login () {
      this.form.userName = this.userInfo.userName
      this.form.password = this.userInfo.password
      this.$axios({
        method: 'post',
        url: 'api',
      }).then(res => {
        console.log(res)//res变量获取到的打印出来
        //把取data的数据赋给 list: []中
        //请求成功返回的数据
      })

      // 这个参数是检验验证是否通过
      var that = this
      let checkResult = false;
      // 开始对参数进行验证
      this.$refs["userInfo"].validate(valid => {
        if (!valid) {
          // 验证没有通过
          this.$Message.error("请按格式输入信息");
          checkResult = false;
        } else {
          // 验证通过
          checkResult = true;
        }
      });
      // 如果验证没有通过就直接跳出
      if (!checkResult) {
        return;
      }
      if (this.pathType == "buyer") {
        //重新给userInfo.key赋值，不知道为什么在这步以前userInfo.key被删除了，所以重新给赋值
        //在这步以前可以打印出userInfo看下是否有四个变量
        that.$set(that.userInfo, 'key', that.num)
        this.$api.buyerLogin(this.userInfo).then(res => {
          console.log(res.data)
          if (res.success === true) {
            // 登录成功，弹出提示信息
            this.$Message.success("登录成功");
            // 进行一些设置
            this.$cookie.set("loginType", this.pathType, 120);
            this.$cookie.set("token", res.data.token, 120);
            this.$cookie.set("userName", res.data.buyerInfo.buyerName, 120);
            // 1.5s后跳转到主页
            setTimeout(e => {
              this.$router.push({
                path: "/"
              });
            }, 1500);
          } else {
            // 注册没有成功，弹出提示信息
            this.$Message.error(res.response.data.message);
          }
        });
      } else if (this.pathType == "seller") {
        // console.log(this.userInfo)
        //给 userIfo.key 赋值随机数，可能被动态清掉了
        this.$api.sellerLogin(this.userInfo).then(res => {
          if (res.success === true) {
            // 登录成功，弹出提示信息
            this.$Message.success("登录成功");
            // 进行一些设置
            this.$cookie.set("loginType", this.pathType, 120);
            this.$cookie.set("token", res.data.token, 120);
            this.$cookie.set("userName", res.data.sellerInfo.sellerName, 120);
            // 1.5s后跳转到主页
            setTimeout(e => {
              this.$router.push({
                path: "/"
              });
            }, 1500);
          } else {
            // 注册没有成功，弹出提示信息
            this.$Message.error(res.response.data.message);
          }
        });
      }
    },
    toRegister () {
      this.$router.push({
        path: "/" + this.pathType + "/register"
      });
    }
  },
  watch: {
    // 监听pathType的变化，有变化就清空输入框
    pathType () {
      this.userInfo = {
        userName: null,
        password: null
      };
    }
  }
};
</script>

<style>
</style>