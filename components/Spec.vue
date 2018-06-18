<template>
  <div>
    <template v-if="unified">
      <el-table style="width: 100%">
        <el-table-column label="日期" width="180">
          a
        </el-table-column>
        <el-table-column label="姓名" width="180">
          a
        </el-table-column>
        <el-table-column label="地址">
         a
        </el-table-column>
      </el-table>
    </template>
    <template v-else>
    </template>
  </div>
</template>
<script>
export default {
  name: 'spec',
  data() {
    return {
      unified: true,
    };
  },
  methods: {

  }
}

</script>
<style scoped>


</style>
<style>
.el-upload-dragger {
  width: 230px;
  height: 150px;
}

.el-upload--picture-card {
  width: auto;
  height: auto;
}

</style>
