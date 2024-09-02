<template>
  <div>
    <Header />
    <div class="content clearfix">
      <!--排行榜-->
      <ul class="rank-list">
        <li v-for="(item, index) in rank" :key="item.phone">
          <img src="@/assets/image/list-rank1.png" alt="" v-if="index==0">
          <img src="@/assets/image/list-rank2.png" alt="" v-else-if="index==1">
          <img src="@/assets/image/list-rank3.png" alt="" v-else>
          <p class="rank-list-phone">{{item.phone}}</p>
          <span>{{item.money}}元</span>
        </li>
      </ul>
      <!--产品列表-->
      <ul class="preferred-select clearfix">
        <li v-for="product in productList" :key="product.id">
          <h3 class="preferred-select-title">
            <span>{{product.productName}}</span>
            <img src="@/assets/image/1-bg1.jpg" alt="">
          </h3>
          <div class="preferred-select-number">
            <p><b>{{product.rate}}</b>%</p>
            <span>历史年化收益率</span>
          </div>
          <div class="preferred-select-date">
            <div>
              <span>投资周期</span>
              <p><b>{{product.cycle}}</b>个月</p>
            </div>
            <div>
              <span>余利可投资金额</span>
              <p><b>{{product.leftProductMoney}}</b>元</p>
            </div>
          </div>
          <p class="preferred-select-txt">
            优选计划项目，投资回报周期{{product.cycle}}个月，起点低，适合短期资金周转、对流动性要求高的投资人。
          </p>
          <a href="javascript:void(0)" @click="goLink('/page/product/detail', {productId: product.id})" class="preferred-select-btn">立即投资</a>
        </li>
      </ul>

      <!--分页-->
      <div class="page_box">
        <ul class="pagination">
          <li><a href="javascript:void(0)" @click="first()">首页</a></li>
          <li><a href="javascript:void(0)" @click="prev()">上一页</a></li>
          <li class="active"><span>{{page.pageNo}}</span></li>
          <li><a href="javascript:void(0)" @click="next()">下一页</a></li>
          <li><a href="javascript:void(0)" @click="last()">尾页</a></li>
          <li class="totalPages"><span>共{{page.toalPage}}页</span></li>
        </ul>
      </div>

    </div>
    <Footer />
  </div>
</template>

<script>
import Footer from "@/components/common/Footer.vue";
import Header from "@/components/common/Header.vue";
import {doGet} from "@/api/httpRequest";

let productType = 0;

export default {
  name: "ProductList",
  components: {
    // eslint-disable-next-line vue/no-unused-components
    Header,
    // eslint-disable-next-line vue/no-unused-components
    Footer
  },
  data() {
    return {
      rank:[
        {
          "phone": "",
          "money": 0
        },
      ],
      productList:[{
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
        bitMaxLimit: "",
        productStatus: 0,
        productFullTime: 0,
        productDesc: ""
      }],
      page: {
        pageNo: 1,
        pageSize: 0,
        toalPage: 0,
        totalRecord: 0
      }
    };
  },
  mounted() {
    // get param
    productType = this.$route.query.ptype;
    // get rank
    doGet("/v1/invest/rank").then(res => {
      if (res){
        this.rank = res.data.list;
      }
    });
    this.initPage(productType, 1, 9);
  },
  methods: {
    initPage(productType, pNo, pSize){
      doGet("/v1/product/list", {ptype:productType, pageNo:pNo, pageSize:pSize}).then(res => {
        if (res){
          this.productList = res.data.list;
          this.page = res.data.page;
        }
      });
      window.scrollTo(0, 0);
    },
    first(){
      if (this.page.pageNo == 1){
        alert("已经是第一页了")
      }
      else{
        this.initPage(productType, 1, 9);
      }
    },
    last(){
      if (this.page.pageNo == this.page.toalPage){
        alert("已经是最后一页了")
      }
      else {
        this.initPage(productType, this.page.toalPage, 9);
      }
    },
    next(){
      if (this.page.pageNo == this.page.toalPage){
        alert("已经是最后一页了")
      }
      else{
        this.initPage(productType, this.page.pageNo + 1, 9);
      }
    },
    prev(){
      if (this.page.pageNo == 1){
        alert("已经是第一页了")
      }
      else{
        this.initPage(productType, this.page.pageNo - 1, 9);
      }
    },
    goLink(url, params){
      // use router to jump
      this.$router.push({
        path: url,
        query: params
      })
    }
  },
  watch: {
    '$route.query.ptype': function(newPtype, oldPtype) {
      console.log(`ptype changed from ${oldPtype} to ${newPtype}`);
      if(newPtype !== oldPtype) {
        this.productType = newPtype;
        this.initPage(newPtype);
      }
    }
  }
}
</script>

<style scoped>
@import "@/assets/css/list.css";
</style>