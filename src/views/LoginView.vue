<template>
  <div>
    <Header/>
    <div class="login-content">
      <div class="login-flex">
        <div class="login-left">
          <h3>加入动力金融网</h3>
          <p>坐享<span>{{platInfo.historyAvgRate}}</span>历史年化收益</p>
          <p>平台用户<span>{{ platInfo.registerUsers }}</span>位  </p>
          <p>累计成交金额<span>{{platInfo.sumBidMoney}}</span>元</p>
        </div>
        <!---->
        <div class="login-box">
          <h3 class="login-title">欢迎登录</h3>
          <form action="" id="login_Submit">
            <div class="alert-input">
              <!--<input class="form-border user-name" name="username" type="text" placeholder="您的姓名">
              <p class="prompt_name"></p>-->
              <input type="text" class="form-border user-num" name="mobile" v-model="phone"
                     @blur="checkPhone" placeholder="请输入11位手机号">
              <div class="error">{{ phoneErr }}</div>

              <p class="prompt_num"></p>
              <input type="password" placeholder="请输入登录密码" class="form-border user-pass" v-model="password"
                     @blur="checkPassword" autocomplete name="password">
              <div class="error">{{ passwordErr }}</div>
              <p class="prompt_pass"></p>


              <div class="form-yzm form-border">
                <input class="yzm-write" type="text" v-model="code"
                       @blur="checkCode" placeholder="输入短信验证码">
                <input class="yzm-send" type="text" v-bind:value="yzmText"
                       v-bind:disabled="yzmDisabled" id="yzmBtn" readonly="readonly" @click="requestSmsCode">
              </div>
              <div class="error">{{ codeErr }}</div>
              <p class="prompt_yan"></p>
            </div>
            <div class="alert-input-btn">
              <input type="submit" class="login-submit" @click="requestUserLogin" value="登录">
            </div>
          </form>

        </div>

      </div>
    </div>
    <Footer/>
  </div>

</template>

<script>
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import {doGet, doPost} from "@/api/httpRequest";
import md5 from "js-md5";


export default {
  name: "LoginView",
  components: {
    Header,
    Footer
  },
  data() {
    return {
      platInfo: {historyAvgRate: 0, sumBidMoney: 0, registerUsers: 0},
      phone: "",
      phoneErr: "",
      password: "",
      passwordErr: "",
      code: "",
      codeErr: "",
      yzmText:'获取验证码',
      yzmDisabled:false,
    }
  },
  mounted() {
    doGet('v1/plat/info').then((response) => {
      this.platInfo = response.data.data;
    })
  },
  methods:{
    checkPhone() {
      if (!this.phone || this.phone == undefined) {
        this.phoneErr = "手机号不能为空";
        return false;
      } else if (
          !/^1[3456789]\d{9}$/.test(this.phone) ||
          this.phone.length != 11
      ) {
        this.phoneErr = "手机号格式不正确";
        return false;
      }
      this.phoneErr = "";
      return true;
    },
    checkPassword() {
      if (!this.password || this.password == undefined) {
        this.passwordErr = "密码不能为空";
        return false;
      } else if (
          !/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/.test(this.password)
      ) {
        this.passwordErr = "密码必须包含数字和字母，且不包含符号，长度为6-20位";
        return false;
      }
      this.passwordErr = "";
      return true;
    },
    checkCode() {
      if (!this.code || this.code == undefined) {
        this.codeErr = "验证码不能为空";
        return false;
      }
      this.codeErr = "";
      return true;
    },
    requestSmsCode() {
      this.checkPhone();
      if (this.phoneErr == "") {
        this.yzmDisabled = true;
        // if the timer is not over, disable the button
        let btn = document.getElementById("yzmBtn");
        btn.style.color = 'gray';
        // send request to backend to get the login code
        doGet("v1/sms/code/login", { phone: this.phone }).then(
            (response) => {
              if (response.data.code === 1000) {
                // set a timer
                let time = 60;
                let timeId = setInterval(() => {
                  time--;
                  if (time > 0){
                    this.yzmText = time + "s后重新获取";
                  }
                  else{
                    this.yzmText = "获取验证码";
                    btn.style.color = '#688EF9';
                    this.yzmDisabled = false;
                    clearInterval(timeId);
                  }
                }, 1000);
                this.codeErr = "";
              } else {
                btn.style.color = '#688EF9';
                this.codeErr = response.data.msg;
                this.yzmDisabled = false;
              }
            }
        );
      }
    },
    async requestUserLogin(event){
      // prevent the form from submitting
      event.preventDefault();
      this.checkPhone();
      this.checkPassword();
      this.checkCode();
      if (this.phoneErr == '' && this.passwordErr == '' && this.codeErr == ''){
        // data is correct, send register request
        // use md5 to encrypt the password in frontend
        let newPassword = md5(this.password);
        doPost("/v1/user/login", {phone: this.phone, pword: newPassword, scode: this.code}).then(response => {
          console.log("login succeed",response)
          if (response && response.data.code === 1000){
            console.log(response.data.data)
            // store the jwt
            window.localStorage.setItem('token', response.data.accessToken);
            // store user information
            window.localStorage.setItem('user', JSON.stringify(response.data.data));
            // login successfully
            if (response.data.data.name == ''){
              console.log("name is empty")
              // go to user validation page
              this.$router.push('/page/user/realname');
            }
            else{
              // go to user center page
              this.$router.push('/page/user/usercenter');
            }
          }
          else{
            // login failed
            console.log("login failed1",response)
          }
        }).catch((error) => {
          console.log("login failed2",error)
        });

      }
      return true;
    }
  }
}
</script>

<style scoped>
  .error {
    color: red;
    font-size: 18px;
  }
</style>