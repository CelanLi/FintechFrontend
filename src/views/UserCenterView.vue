<template>
  <Header/>
  <div class="content clearfix">
    <!--个人信息-->
    <div class="user-head">
      <div class="user-head-left fl">
        <div class="user-head-img">
          <img src="@/assets/image/user-head.png" alt="">
        </div>
        <p>上传头像</p>
      </div>
      <div class="user-head-right fl">
        <ul class="user-head-name fl">
          <li><b>{{userBaseInfo.name}}</b></li>
          <li>{{userBaseInfo.phone}}</li>
          <li>最近登录：{{userBaseInfo.lastLoginTime}}</li>
        </ul>
        <div class="user-head-money fr">
          <p>可用余额：<span>￥{{userBaseInfo.money}}元</span></p>
          <a href="user_pay.html" style="color: red" target="_blank" class="user-head-a1">充值</a>
          <a href="details.html" style="color: red" target="_blank" class="user-head-a2">投资</a>
        </div>
      </div>

    </div>
    <!--记录-->
    <div class="user-record-box clearfix">
      <div class="user-record user-record-1">
        <h3 class="user-record-title">最近投资</h3>
        <table align="center" width="388" border="0" cellspacing="0" cellpadding="0">
          <thead class="datail_thead">
          <tr>
            <th>序号</th>
            <th>投资产品</th>
            <th>投资金额</th>
            <th>投资时间</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>1</td>
            <td>新手宝</td>
            <td>1500.0</td>
            <td>2021-08-19 </td>
          </tr>
          <tr>
            <td>2</td>
            <td>新手宝</td>
            <td>1500.0</td>
            <td>2021-08-19 </td>
          </tr>
          <tr>
            <td>3</td>
            <td>新手宝</td>
            <td>1500.0</td>
            <td>2021-08-19 </td>
          </tr>
          <tr>
            <td>4</td>
            <td>新手宝</td>
            <td>1500.0</td>
            <td>2021-08-19 </td>
          </tr>
          <tr>
            <td>5</td>
            <td>新手宝</td>
            <td>1500.0</td>
            <td>2021-08-19 </td>
          </tr>
          <tr>
            <td>6</td>
            <td>新手宝</td>
            <td>1500.0</td>
            <td>2021-08-19 </td>
          </tr>
          </tbody>
        </table>
        <!--无记录-->
        <p class="user-record-no">还没有投资记录，请投资：<a href="user_center.html" target="_blank">投资</a></p>
      </div>
      <div class="user-record user-record-2">
        <h3 class="user-record-title">最近充值</h3>
        <table align="center" width="388" border="0" cellspacing="0" cellpadding="0">
          <thead class="datail_thead">
          <tr>
            <th>序号</th>
            <th>充值结果</th>
            <th>充值金额</th>
            <th>充值时间</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item,index) in rechargeList" :key="item.id">
            <td>{{index+1}}</td>
            <td>{{item.result}}</td>
            <td>{{item.rechargeMoney}}</td>
            <td>{{item.rechargeDate}}</td>
          </tr>
          </tbody>
        </table>
        <!--无记录-->
        <p class="user-record-no" v-if="rechargeList.length === 0">还没有充值记录，请充值：<a href="user_pay.html" target="_blank">充值</a></p>
      </div>
      <div class="user-record user-record-3">
        <h3 class="user-record-title ">最近收益</h3>
        <table align="center" width="388" border="0" cellspacing="0" cellpadding="0">
          <thead class="datail_thead">
          <tr>
            <th>序号</th>
            <th>项目名称</th>
            <th>投资日期</th>
            <th>收益金额</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>1</td>
            <td>新手宝</td>
            <td>2021-08-19 </td>
            <td>0.46  </td>
          </tr>
          <tr>
            <td>2</td>
            <td>新手宝</td>
            <td>2021-08-19 </td>
            <td>0.46  </td>
          </tr>
          <tr>
            <td>3</td>
            <td>新手宝</td>
            <td>2021-08-19 </td>
            <td>0.46  </td>
          </tr>
          <tr>
            <td>4</td>
            <td>新手宝</td>
            <td>2021-08-19 </td>
            <td>0.46  </td>
          </tr>
          <tr>
            <td>5</td>
            <td>新手宝</td>
            <td>2021-08-19 </td>
            <td>0.46  </td>
          </tr>
          <tr>
            <td>6</td>
            <td>新手宝</td>
            <td>2021-08-19 </td>
            <td>0.46  </td>
          </tr>
          </tbody>
        </table>
        <!--无记录-->
        <p class="user-record-no">还没有收益记录</p>
      </div>

    </div>


  </div>
  <Footer/>
</template>

<script>
import Header from "@/components/common/Header.vue";
import Footer from "@/components/common/Footer.vue";
import {doGet} from "@/api/httpRequest";

export default {
  name: "UserCenterView",
  components: {
    Header,
    Footer,
  },
  data(){
    return{
      userBaseInfo:{
        lastLoginTime: "",
        money: 0.0,
        phone: "",
        headerImage: "",
        name: ""
      },
      rechargeList:    {
        id: 0,
        result: "",
        rechargeDate: "",
        rechargeMoney: 0
      },
    }

  },
  mounted() {
    doGet('/v1/user/usercenter').then((response) => {
      if (response && response.data.code === 1000) {
        console.log(response.data.data)
        this.userBaseInfo = response.data.data;
      }
    })
    doGet('/v1/recharge/records', {pageNo:1, pageSize:6}).then((response) => {
      if (response && response.data.code === 1000) {
        console.log(response.data.list)
        this.rechargeList = response.data.list;
      }
    })
  },
}
</script>

<style scoped>

</style>