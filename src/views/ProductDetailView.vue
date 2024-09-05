<template>
  <Header />
  <div class="content clearfix">
    <div class="detail-left">
      <div class="detail-left-title">{{product.productName}}（{{product.productNo}}期）</div>
      <ul class="detail-left-number">
        <li>
          <span>历史年化收益率</span>
          <p><b>{{product.rate}}</b>%</p>
          <span>历史年化收益率</span>
        </li>
        <li>
          <span>募集金额（元）</span>
          <p><b>{{product.productMoney}}</b>元</p>
          <span v-if="product.leftProductMoney>0">募集中&nbsp;&nbsp;剩余募集金额{{product.leftProductMoney}}元</span>
          <span v-else>已满标</span>
        </li>
        <li>
          <span>投资周期</span>
          <p v-if="product.productType == 0"><b>{{product.cycle}}</b>天</p>
          <p v-else><b>{{product.cycle}}个月</b></p>
          <span>最大单次投资金额：{{product.bidMaxLimit}}元</span>
          <span>最小单次投资金额：{{product.bidMinLimit}}元</span>
        </li>

      </ul>
      <div class="detail-left-way">
        <span>收益获取方式</span>
        <span>收益返还：<i>到期还本付息</i></span>
      </div>
      <!--投资记录-->
      <div class="datail-record">
        <h2 class="datail-record-title">投资记录</h2>
        <div class="datail-record-list">
          <table align="center" width="880" border="0" cellspacing="0" cellpadding="0">
            <colgroup>
              <col style="width: 72px" />
              <col style="width: 203px" />
              <col style="width: 251px" />
              <col style="width: 354px" />
            </colgroup>
            <thead class="datail_thead">
            <tr>
              <th>序号</th>
              <th>投资人</th>
              <th>投资金额（元）</th>
              <th>投资时间</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(bid,index) in bidList" :key="bid.id">
              <td>{{index+1}}</td>
              <td class="datail-record-phone">{{bid.phone}}</td>
              <td>{{bid.bidMoney}}</td>
              <td>{{bid.bidTime}}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
    <!--右侧-->
    <div class="detail-right">
      <div class="detail-right-title">立即投资</div>
      <div class="detail-right-mode">
        <h3 class="detail-right-mode-title">收益方式</h3>
        <p class="detail-right-mode-p"><span>到期还本付息</span></p>
        <h3 class="detail-right-mode-title">我的账户可用</h3>
        <div class="detail-right-mode-rmb" v-if="isLogin==false">
          <p>资金（元）：******</p>
          <a href="javascript:void(0)"  @click="goLink('/page/user/login')">请登录</a>
        </div>
        <div class="detail-right-mode-rmb" v-else>
          <p>资金（元）：{{this.accountMoney}}</p>
        </div>
        <h3 class="detail-right-mode-title">预计利息收入 {{income}}（元）</h3>
        <form action="" id="number_submit">
          <p>请在下方输入投资金额</p>
          <input type="text" placeholder="请输入日投资金额，应为100元整倍数" name="" class="number-money" @blur="checkInvestMoney" v-model="investMoney">
          <div class="err">{{investMoneyErr}}</div>
          <input value="立即投资" class="submit-btn" type="button" @click="investProduct">
        </form>

      </div>
    </div>
  </div>
  <Footer />
</template>

<script>
import Header from "@/components/common/Header.vue";
import Footer from "@/components/common/Footer.vue";
import {doGet, doPost} from "@/api/httpRequest";

export default {
  name: "ProductDetailView",
  components: {
    Header,
    Footer
  },
  data() {
    return {
      product: {
        id: 0,
        productName: "",
        rate: 0.0,
        cycle: 0,
        releaseTime: 0,
        productType: 0,
        productNo: "",
        productMoney: 0,
        leftProductMoney: 0,
        bidMinLimit: 0,
        bidMaxLimit: "",
        productStatus: 0,
        productFullTime: 0,
        productDesc: ""
      },
      bidList: [{
        id:0,
        phone: "",
        bidMoney: 0.00,
        bidTime: "",
      }],
      isLogin: false,
      accountMoney: 0.0,
      investMoney: 100,
      investMoneyErr: "",
      income: ""
    };
  },
  mounted() {
    // check if login
    let token = localStorage.getItem("token");
    if (token){
      this.isLogin = true;
    }

    let productId = this.$route.query.productId
    doGet("/v1/product/info", {productId: productId}).then((response) => {
      if (response){
        this.product = response.data.data;
        this.bidList = response.data.list;
      }
    });

    // get available money
    doGet("/v1/user/usercenter").then((resp)=>{
      if (resp && resp.data.code === 1000){
        console.log(resp.data.data)
        this.accountMoney = resp.data.data.money
      }
    })
  },
  methods:{
    goLink(url, params){
      console.log('goLink', url, params);
      // use router to jump
      this.$router.push({
        path: url,
        query: params
      })
    },
    checkInvestMoney(){
      if (isNaN(this.investMoney)){
        this.investMoneyErr = "请输入数字";
      }
      else if (parseInt(this.investMoney) < 100){
        this.investMoneyErr = "投资金额不能小于100元";
      }
      else if (parseFloat(this.investMoney) % 100 !== 0){
        this.investMoneyErr = "投资金额必须是100的整数倍";
      }
      else{
        this.investMoneyErr = "";
        // compute the interest
        // interest = investMoney * rate * cycle
        let dayRate = this.product.rate / 100 / 365;
        let incomeMoney = 0.0
        if (this.product.productType === 0){
          incomeMoney = this.investMoney * dayRate * this.product.cycle;
        }
        else{
          incomeMoney = this.investMoney * dayRate * this.product.cycle * 30;
        }
        console.log("incomeMoney", incomeMoney);
        this.income = incomeMoney.toFixed(2);
    }
    },
    investProduct(){
      //1 check if the name is empty
      let userInfo = JSON.parse(window.localStorage.getItem("user"));
      if (!userInfo){
        alert("请先登录");
        this.goLink("/page/user/login");
        return;
      }
      if (userInfo.name === ""){
        alert("请先实名认证");
        this.goLink("/page/user/realname");
        return;
      }
      if (this.investMoneyErr === ""){
        // send request to backend
        let productId = this.product.id;
        let investMoney = this.investMoney;
        doPost("/v1/invest/product", {productId: productId, money: investMoney}).then((response)=>{
          if (response && response.data.code === 1000){
            alert("投资成功");
            // refresh the page
            this.initPage();
            //window.location.reload();
          }
          else{
            alert(response.data.msg);
          }
        })
    }
  },
  initPage() {
    // check if login
    let token = localStorage.getItem("token");
    if (token){
      this.isLogin = true;
    }

    let productId = this.$route.query.productId
    doGet("/v1/product/info", {productId: productId}).then((response) => {
      if (response){
        this.product = response.data.data;
        this.bidList = response.data.list;
      }
    });

    // get available money
    doGet("/v1/user/usercenter").then((resp)=>{
      if (resp && resp.data.code === 1000){
        console.log(resp.data.data)
        this.accountMoney = resp.data.data.money
      }
    })
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