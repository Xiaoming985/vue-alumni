<template>
  <div>
    <div class="my-btn" v-if="hidden">
      <el-button type="primary" size="small" @click="hidden = !hidden">编辑</el-button>
    </div>
    <div class="my-btn" v-else>
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" 
        border size="small">全选</el-checkbox>
      <el-button type="danger" size="small" @click="deleteImg">删除</el-button>
      <el-button type="info" size="small" @click="hidden = !hidden">取消编辑</el-button>
    </div>
    <el-checkbox-group class="images" v-model="checkList" @change="handleGroup">
      <div class="img-box" v-for="item in imgList" :key="item.imgId">
        <img :src="item.imgUrl" alt="">
        <el-checkbox :label="item.imgId" v-if="!hidden"></el-checkbox>
      </div>
    </el-checkbox-group>
    <Pagination :currentPage="currentPage" :pageSize="pageSize" :currentTotal="currentTotal"></Pagination>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination.vue";
export default {
  props: ["albumId"],
  components: {
    Pagination
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 40,
      currentTotal: 0,
      imgList: [],
      isIndeterminate: false,
      checkAll: false,
      checkList: [],
      hidden: true
    };
  },
  watch: {
    currentPage:function() {
      this.getImg();
    },
    pageSize:function() {
      this.getImg();
    }
  },
  methods: {
    async getImg() {
      let res = await this.$http.getImg({
        albumId: this.albumId,
        start: (this.currentPage - 1) * this.pageSize,
        pageSize: this.pageSize
      });
      if (res.status == 200) {
        this.imgList = res.data.imgList;
        this.currentTotal = res.data.imgCount;
      }
    },
    handleCheckAllChange(val) {
      let arr = [];
      this.imgList.forEach(item => {
        arr.push(item.imgId);
      });
      this.checkList = val ? arr : [];
      this.isIndeterminate = false;
    },
    handleGroup(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.imgList.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.imgList.length;
    },
    deleteImg() {
      this.$confirm('此操作不可逆, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.checkList.forEach(item => {
          this.imgList.forEach((element, index) => {
            if (element.imgId == item) {
              this.imgList.splice(index, 1);
            }
          });
        });
        this.currentTotal--;
        let res = await this.$http.deleteImg(this.$qs.stringify({
          imgId: this.checkList.join()
        }));
        this.$message.success('删除成功!');
      }).catch(() => {
        this.$message.error('已取消删除!');
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.my-btn {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 5px;
  .el-button {
    margin: 0 10px;
  }
}
.images {
  display: flex;
  flex-wrap: wrap;
  margin: 10px auto;
  .img-box {
    width: 100px;
    height: 100px;
    margin: 5px 5px 0 0;
    position: relative;
    img {
      width: 100px;
      height: 100px;
      object-fit: cover;
    }
    .el-checkbox {
      position: absolute;
      top: 5px;
      right: 5px;
    }
  }
}
</style>

<style lang="scss">
.img-box .el-checkbox__label {
  display: none;
}
</style>
