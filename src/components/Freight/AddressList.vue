<template>
  <div>
    <el-button type="text" @click="dialogTableVisible = true">选择地区</el-button>
    <el-dialog width="700px" title="收货地址" :visible.sync="dialogTableVisible">
      <p style="display: inline-block; padding: 2px 15px" v-for="(province,i) in provinces">
        <el-checkbox :indeterminate="isIndeterminate[i]" v-model="checkAll[i]" @change="(val) => handleCheckAllChange(val,i)"></el-checkbox>
        <el-popover placement="top-start" :title="province['province']" trigger="hover">
          <el-checkbox-group size="mini" v-model="checkList[i]" @change="(value) => handleCheckedCitiesChange(value,i)">
            <el-checkbox-button v-for="(city,index) in province['city']" :label="index" :key=index :checked="city['checked']">{{city['name']}}
            </el-checkbox-button>
          </el-checkbox-group>
          <el-button type="text" size="mini" slot="reference">{{province['province']}}</el-button>
        </el-popover>
      </p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="print">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'AddressList',
  data() {
    return {
      provinces: '',
      checkList: {},
      before: false,
      isIndeterminate: {},
      checkAll: {},
      allcity: {},
      dialogTableVisible: false,
      checkedCode: [],
    }
  },
  created() {
    this.$store.commit('Mloading', true)
    this.$http(this.$api['Provinces-Cities'],'index').then(res => {
        let { msg, result } = res.data
        this.provinces = result
        this.creatCheckboxGroup()
        this.$store.commit('Mloading', false)
      })
      .catch(msg => {
        this.$store.commit('Mloading', false)
        this.$message.error(msg)
      })
  },
  methods: {
    /**
     *	创建整理数据
     */
    creatCheckboxGroup() {
      Object.keys(this.provinces).forEach((item) => {
        if (this.provinces[item]['city']) {
          this.checkList[item] = []
          this.allcity[item] = []
          let count = 0;
          let cities = Object.keys(this.provinces[item]['city']);
          cities.forEach((index) => {
            this.allcity[item].push(index)
            if (this.provinces[item]['city'][index]['checked'] == true) {
              count++;
            }
          })
          this.checkAll[item] = count === cities.length;
          this.isIndeterminate[item] = count > 0 && count < cities.length
        }
      })
      this.checkList = Object.assign({}, this.checkList, this.checkList)
      this.checkAll = Object.assign({}, this.checkAll, this.checkAll)
      this.isIndeterminate = Object.assign({}, this.isIndeterminate, this.isIndeterminate)
      this.allcity = Object.assign({}, this.allcity, this.allcity)
    },
    /*
     *	全选
     */
    handleCheckAllChange(val, i) {
      this.checkList[i] = val ? this.allcity[i] : [];
      this.isIndeterminate[i] = false;
    },
    /*
     *	选中某个时，检测所属组的状态 (组状态：全选，全不选，部分)
     */
    handleCheckedCitiesChange(value, i) {
      let checkedCount = value.length;
      this.checkAll[i] = checkedCount === this.allcity[i].length;
      this.isIndeterminate[i] = checkedCount > 0 && checkedCount < this.allcity[i].length
    },
    print() {
      this.checkedCode = [];
      let data = {};
      Object.keys(this.checkList).forEach((key) => {
        if (this.checkList[key]) {
          this.checkList[key].forEach((item) => {
          	data = {
          		code:item,
          		name:this.provinces[item.substring(0, 2) + '0000']['city'][item]['name']
          	}
            this.checkedCode.push(data)
          })
        }
      })
      this.$emit('emitRegion',this.checkedCode)
      this.dialogTableVisible = false
    }
  }
}

</script>
<style scoped>
</style>
