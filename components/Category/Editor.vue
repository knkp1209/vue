<template>
    <div>
        <el-dialog width="550px" title="添加分类" center :visible.sync="$store.state.visibleCategory">
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
                <el-row type="flex" justify="center">
                    <el-col :span="13">
                        <el-form-item label="图片">
                            <my-image v-if="$store.state.appSet" key="category" name="category" @emit_set_img="setImgUrl" :imageUrl="img_url" :max_size="max_size" :max_upload="1"></my-image>
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
import MyImage from '@/components/MyImage'
export default {
    name: 'Category_Editor',
    data() {
        return {
            img_url: '',
            name: '',
            add_category_loading: false,
            pid: '',
        }
    },
    computed: {
        options() {
            return this.$store.state.topCategoryList
        },
        max_size() {
            return this.$store.state.appSet.maxSize.value
        }
    },
    components: { MyImage },
    created() {
        if (this.options.length == 0) {
            this.init();
        }
    },
    methods: {
        init() {
            let _this = this
            this.$ajax({
                dataType: 'json',
                method: 'get',
                url: this.base_url + '/admin/categorys',
            }).then(function(res) {
                let { msg, result } = res.data
                _this.$store.commit('MtopCategoryList', result)
            }).catch(function(err) {
                console.log(err)
                alert('页面异常，请手动刷新页面，按 F5 ')
            })
        },
        post() {
            this.$validator.validateAll().then(result => {
                if (result) {
                    this.add_category_loading = true;
                    let _this = this;
                    let data = {};
                    if (this.pid == '') {
                        data.pid = 0;
                    } else {
                        data.pid = this.pid;
                    }
                    data.name = this.name;
                    data.url = this.img_url
                        this.$ajax({
                            dataType: 'json',
                            method: 'post',
                            url: this.base_url + '/admin/categorys',
                            data: data
                        }).then(function(res) {
                            _this.$store.commit('MvisibleCategory', false)
                            _this.add_category_loading = false;
                            _this.pid = '';
                            _this.name = '';
                            let { msg, result } = res.data
                            _this.$message({
                                message: msg,
                                type: 'success'
                            });
                            if (data.pid == 0) {
                                _this.options.push(result);
                            } else {
                                for (var i = 0; i < _this.options.length; i++) {
                                    if (_this.options[i].id == data.pid) {
                                        if(_this.options[i].children === undefined) {
                                            _this.options[i].children = [];
                                        }
                                        _this.options[i].children.push(result);
                                        break;
                                    }
                                }
                            }
                        }).catch(function(err) {
                            console.log(err)
                            _this.pid = '';
                            _this.name = '';
                            _this.$store.commit('MvisibleCategory', false)
                            _this.$message({
                                message: '添加失败',
                                type: 'error'
                            });
                        })
                }
            })
        },
        cancel() {
            this.$store.commit('MvisibleCategory', false)
            this.pid = '';
            this.name = '';
        },
        setImgUrl (val) {
            this.img_url = val;
        },
    }
}

</script>
<style scoped>


</style>
