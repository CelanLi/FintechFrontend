<template>
<div>
  <Header/>
  <div class="login-content">
    <div class="login-flex">
      <div class="login-left"></div>
      <!---->
      <div class="login-box">
        <h3 class="login-title">实名认证</h3>
        <form action="" id="renZ_Submit">
          <div class="alert-input">
            <input type="text" class="form-border user-name" name="username" v-model="name" @blur="checkName" placeholder="请输入您的真实姓名">
            <div class="error">{{ nameErr }}</div>
            <p class="prompt_name"></p>
            <input type="text" class="form-border user-sfz" name="sfz" v-model="idCard" @blur="checkIdCard" placeholder="请输入15位或18位身份证号">
            <div class="error">{{ idCardErr }}</div>
            <p class="prompt_sfz"></p>
            <input type="text" class="form-border user-num" name="mobile" v-model="phone" @blur="checkPhone" placeholder="请输入11位手机号">
            <div class="error">{{ phoneErr }}</div>
            <p class="prompt_num"></p>
            <div class="form-yzm form-border">
              <input class="yzm-write" type="text" v-model="code" @blur="checkCode" placeholder="输入短信验证码">
              <input class="yzm-send" type="text" v-bind:value="yzmText" v-bind:disabled="yzmDisabled" id="yzmBtn" readonly="readonly" @click="requestSmsCode">
            </div>
            <div class="error">{{ codeErr }}</div>
            <p class="prompt_yan"></p>
          </div>
          <div class="alert-input-agree">
            <input type="checkbox" v-model="agree">我已阅读并同意
            <a href="javascript:;" target="_blank">《动力金融网注册服务协议》</a>
          </div>
          <div class="alert-input-btn">
            <input type="submit" class="login-submit" @click="requestRealname" value="认证">
          </div>
        </form>
        <div class="login-skip">
          暂不认证？ <a href="javascript:;" @click="goLink('/page/user/usercenter')">跳过</a>
        </div>
      </div>

    </div>
  </div>

  <Footer/>
</div>
</template>

<script>
import Header from "@/components/common/Header.vue";
import Footer from "@/components/common/Footer.vue";
import {doGet, doPostJson} from "@/api/httpRequest";

export default {
  name: "RealNameView",
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      name:'',
      nameErr:'',
      idCard:'',
      idCardErr:'',
      phone:'',
      phoneErr:'',
      code:'',
      codeErr:'',
      agree:false,
      yzmText:'获取验证码',
      yzmDisabled:false,
    }
  },
  mounted() {
    // get phone in localstorage
    let user = window.localStorage.getItem('user');
    if(user){
      this.phone = JSON.parse(user).phone;
    }
  },
  methods: {
    checkName(){
      if(this.name === '' || this.name === null){
        this.nameErr = '姓名不能为空';
      }else if (this.name.length < 2 || this.name.length > 10){
        this.nameErr = '姓名不正确';
      }else if (!/^[\u4e00-\u9fa5]{2,10}$/.test(this.name)){
        this.nameErr = '姓名应为中文';
      }else {
        this.nameErr = '';
      }
    },
    checkIdCard(){
      if(this.idCard === '' || this.idCard === null){
        this.idCardErr = '身份证号不能为空';
      }else if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.idCard)){
        this.idCardErr = '身份证号不正确';
      }else {
        this.idCardErr = '';
      }
    },
    checkPhone(){
      if(this.phone === '' || this.phone === null){
        this.phoneErr = '手机号不能为空';
      }else if (!/^1[3456789]\d{9}$/.test(this.phone) || this.phone.length != 11){
        this.phoneErr = '手机号格式不正确';
      }else {
        this.phoneErr = '';
      }
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
        doGet("/v1/sms/code/realname", { phone: this.phone }).then(
            (response) => {
              console.log("aaaaa",response)
              if (response && response.data && response.data.code === 1000) {
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
    requestRealname(event){
      // prevent the form from submitting
      event.preventDefault();
      this.checkName();
      this.checkPhone();
      this.checkIdCard();
      this.checkCode();
      if(this.nameErr === '' && this.idCardErr === '' && this.phoneErr === '' && this.codeErr === '' && this.agree){
        // send request to backend
        // give a json
        let param = {
          name: this.name,
          idCard: this.idCard,
          phone: this.phone,
          code: this.code
        }
        doPostJson('/v1/user/realname', param).then((response) => {
          if(response.data.code === 1000){
            // jump to user center
            this.$router.push('/page/user/usercenter');
          }
        })
      }
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