<template>
    <div>
        <el-button size="mini" type="primary" @click="dialog_add_category_visible = true">添加分类</el-button>
        <el-dialog width="550px" title="添加分类" center :visible.sync="dialog_add_category_visible">
            <el-form label-position="right" label-width="80px">
                <el-row type="flex" justify="center">
                    <el-form-item label="父级分类">
                        <el-select v-model="pid" filterable placeholder="请选择">
                            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-row>
                <el-row type="flex" justify="center">
                    <el-col :span="13">
                        <el-form-item label="名称">
                            <el-input v-model="name" name="name" v-validate="'required|max:200'" placeholder="分类名称 (必填)"></el-input>
                            <i class="my_err" v-show="errors.has('name')">{{errors.first('name')}}</i>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="提示">
                    <span class="my_tip">父级分类可不选，不选父级分类时，添加的分类为最高顶级分类</span>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" v-loading="add_category_loading">
                <el-button @click="cancel">取 消</el-button>
                <el-button @click="post" type="primary">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'Category',
    data() {
        return {
            name: '',
            dialog_add_category_visible: false,
            add_category_loading: false,
            options: [],
            pid: '',
        }
    },
    created() {
        let _this = this
        this.$ajax({
            dataType: 'json',
            method: 'get',
            url: this.base_url + '/index/index/category',
        }).then(function(res) {
            let { msg, result } = res.data
            _this.options = result
        }).catch(function(err) {
            console.log(err)
            alert('页面异常，请手动刷新页面，按 F5 ')
        })
    },
    methods: {
        post() {
            this.add_category_loading = true;
            let _this = this;
            let data = {};
            if (this.pid == '') {
                data.pid = 0;
            } else {
                data.pid = this.pid;
            }
            data.name = this.name;
            console.log(data);
            this.$ajax({
                dataType: 'json',
                method: 'post',
                url: this.base_url + '/index/index/add_category',
                data: data
            }).then(function(res) {
                _this.dialog_add_category_visible = false;
                _this.add_category_loading = false;
                _this.pid = '';
                _this.name = '';
                let { msg, result } = res.data
                // _this.options = result
                _this.$message({
                    message: msg,
                    type: 'success'
                });
                if (result.id) {
                    _this.$emit('emit_update', result);
                }
            }).catch(function(err) {
                _this.pid = '';
                _this.name = '';
                console.log(err)
                alert('页面异常，请手动刷新页面，按 F5 ')
            })
        },
        cancel() {
            this.dialog_add_category_visible = false;
            this.pid = '';
            this.name = '';
        }
    }
}

</script>
<style scoped>


</style>
