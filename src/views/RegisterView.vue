<template>
  <div>
    <Header />
    <div class="login-content">
      <div class="login-flex">
        <div class="login-left">
          <p>
            万民用户知心托付&nbsp;&nbsp;&nbsp;&nbsp;<span
              >{{ historyAvgRate }}%</span
            >历史年化收益
          </p>
          <p>千万级技术研发投入&nbsp;&nbsp;&nbsp;&nbsp;亿级注册资本平台</p>
        </div>
        <!---->
        <div class="login-box">
          <h3 class="login-title">用户注册</h3>
          <form action="" id="register_Submit">
            <div class="alert-input">
              <input
                type="text"
                class="form-border user-num"
                name="phone"
                placeholder="请输入11位手机号"
                v-model="phone"
                @blur="checkPhone"
              />
              <div class="error">{{ phoneErr }}</div>
              <p class="prompt_num"></p>
              <input
                type="password"
                placeholder="请输入6-20位英文和数字混合密码"
                class="form-border user-pass"
                autocomplete
                name="password"
                v-model="password"
                @blur="checkPassword"
              />
              <div class="error">{{ passwordErr }}</div>
              <p class="prompt_pass"></p>
              <div class="form-yzm form-border">
                <input
                  class="yzm-write"
                  type="text"
                  name="code"
                  placeholder="输入短信验证码"
                  v-model="code"
                  @blur="checkCode"
                />
                <input
                  class="yzm-send"
                  type="text"
                  v-bind:value="yzmText"
                  v-bind:disabled="yzmDisabled"
                  id="yzmBtn"
                  readonly="readonly"
                  @click="requestSmsCode"
                />
              </div>
              <div class="error">{{ codeErr }}</div>
              <p class="prompt_yan"></p>
            </div>
            <div class="alert-input-agree">
              <input type="checkbox" v-model="agree">我已阅读并同意<a
                href="javascript:;"
                target="_blank"
                >《动力金融网注册服务协议》</a
              >
            </div>
            <div class="alert-input-btn">
              <input type="text" class="login-submit" @click="requestUserRegister" value="注册" />
            </div>
          </form>
          <div class="login-skip">
            已有账号？ <a href="javascript:void(0)" @click="goLink('/page/user/login')">登录</a>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from "@/components/common/Header.vue";
import Footer from "@/components/common/Footer.vue";
import {doGet, doPost} from "@/api/httpRequest";
import goLinkMixin from '@/mixins/mixin.js';
import md5 from "js-md5";

export default {
  name: "RegisterView",
  mixins: [goLinkMixin],
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      historyAvgRate: 0.0,
      phone: "",
      phoneErr: "",
      password: "",
      passwordErr: "",
      code: "",
      codeErr: "",
      yzmText:'获取验证码',
      yzmDisabled:false,
      agree: false,
    };
  },
  mounted() {
    doGet("/v1/plat/info").then((response) => {
      if (response.data.code === 1000) {
        this.historyAvgRate = response.data.data.historyAvgRate;
      }
    });
  },
  methods: {
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
      // send request to backend to check if the phone number is already registered
      doGet("/v1/user/phone/exists", { phone: this.phone }).then((response) => {
        if (response.data.code === 1000) {
          this.phoneErr = "";
        } else {
          this.phoneErr = response.data.msg;
        }
      });
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
        // send request to backend to get the sms code
        doGet("/v1/sms/code/register", { phone: this.phone }).then(
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
    async requestUserRegister(){
      await this.checkPhone();
      await this.checkPassword();
      await this.checkCode();
      if (this.phoneErr == '' && this.passwordErr == '' && this.codeErr == ''){
        // data is correct, send register request
        // use md5 to encrypt the password in frontend
        let newPassword = md5(this.password);
        doPost("/v1/user/register", {phone: this.phone, pword: newPassword, scode: this.code}).then(response => {
          console.log(response.data)
          if (response && response.data.code === 1000){
            // register successfully
            this.$router.push({
              path: '/page/user/login'}
            );
          }
          else{
            this.codeErr = response.data.msg;
          }
        });

      }
      return true;
    }
  },
};
</script>

<style scoped>
  .error {
    color: red;
    font-size: 18px;
  }
</style>
