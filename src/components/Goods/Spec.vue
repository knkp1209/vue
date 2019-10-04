<template>
    <div>
        <div>
            <el-dialog width="700px" title="选择规格" :visible.sync="$store.state.dialogSpecVisible">
                <div v-loading="spec_loading">
                    <p style="display: inline-block; padding: 2px 15px" v-for="(spec,i) in spec_list">
                        <el-checkbox :indeterminate="is_indeterminate[i]" v-model="check_all[i]" @change="(val) => handleCheckAllChange(val,i)">
                        </el-checkbox>
                        <el-popover placement="top-start" :title="spec['name']" trigger="hover">
                            <el-checkbox-group size="mini" v-model="check_list[i]" @change="(value) => handleCheckedCitiesChange(value,i)">
                                <el-checkbox-button v-for="(value,index) in spec['values']" :label="index" :key="index">
                                    {{value}}
                                </el-checkbox-button>
                            </el-checkbox-group>
                            <el-button type="text" size="mini" slot="reference">{{spec['name']}}</el-button>
                        </el-popover>
                        <i @click="edit(i)" class="el-icon-edit mouse"></i>
                        <i @click="_delete(i)" class="el-icon-delete mouse"></i>
                    </p>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="$store.commit('MdialogSpecVisible', false)">取 消</el-button>
                    <el-button type="primary" @click="add">添加规格</el-button>
                    <el-button type="success" @click="out">确 定</el-button>
                </div>
            </el-dialog>
        </div>
        <el-dialog width="700px" title="添加规格" :visible.sync="dialog_add_spec_visible">
            <el-form label-position="right" label-width="80px">
                <el-form-item label="规格名称">
                    <el-input v-model="spec_name" placeholder="示例：颜色"></el-input>
                    <el-button @click="addSpecValue" size="mini" type="primary" icon="el-icon-edit">增加规格值</el-button>
                </el-form-item>
                <el-form-item label="规格值" :key="index" v-for="(item,index) in spec_values">
                    <el-input v-model="spec_values[index]" placeholder="示例：红色"></el-input>
                    <el-button type="primary" size="mini" @click.prevent="removeValue(index)">删除</el-button>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" v-loading="add_spec_loading">
                <el-button @click="dialog_add_spec_visible = false">取 消</el-button>
                <el-button @click="post" type="primary">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'Goods_Spec',
    data() {
        return {
            spec_name: '', // 规格名称
            spec_values: [], // 规格值集
            dialog_add_spec_visible: false, // 添加规格开关
            spec_list: {}, // 规格列表，从服务端获取的源数据
            check_list: {}, // 规格列表被选中的值
            check_all: {}, // 规格列表是否全选
            all_spec: {}, // 规格列表的所有值
            is_indeterminate: {}, // 规格列表的选中状态是否为部分
            return_spec_list: {}, // 返回给调用组件的选中规格
            spec_id: false, // 规格名称ID
            spec_loading: true, // 规格列表加载中
            add_spec_loading: false, // 规格编辑加载中
        };
    },
    created() {
        this.getSepcList() // 获取规格列表
    },
    methods: {
        /*
         *   请求服务端（get): 获取规格列表
         */
        getSepcList() {
            this.spec_loading = true
            this.$http(this.$api.Specs,'index').then(({data}) => {
                this.spec_list = data
                this.creatCheckboxGroup()
                this.spec_loading = false
            }).catch(msg => {
                this.$message.error(msg)
            })
        },
        /*
         *   请求服务端（post）：判断添加还是编辑给出不同的数据和请求地址
         */
        post(is_delete = false) {
            this.add_spec_loading = true
            let params = {}
            var type = 'save' // 默认新建请求
            var data = {
                name: this.spec_name,
                values: this.spec_values,
            }
            // 有ID先设置为修改请求
            if (this.spec_id !== false) {
                type = 'update'
                params.id = this.spec_id
            }
            // 是删除改为删除请求
            if (is_delete === true) {
                type = 'delete'
                data = {}
            }
            params.data = data
            this.$http(this.$api.Specs,type,params).then(({data}) => {
                this.dialog_add_spec_visible = false
                this.add_spec_loading = false
                if (is_delete === true) {
                    delete this.spec_list[this.spec_id]
                } else {
                    this.spec_list = data
                    this.creatCheckboxGroup()
                }
            }).catch(msg => {
                this.$message.error(msg);
                this.dialog_add_spec_visible = false
                this.add_spec_loading = false
            })
        },
        /*
         *   添加规格
         */
        add() {
            this.spec_id = false
            this.spec_name = ''
            this.spec_values = []
            this.dialog_add_spec_visible = true
        },
        /*
         *   编辑规格
         */
        edit(i) {
            this.spec_id = i
            this.spec_name = this.spec_list[i].name
            this.spec_values = Object.values(this.spec_list[i].values);
            this.dialog_add_spec_visible = true
        },
        /*
         *   删除规格
         */
        _delete(i) {
            this.spec_id = i
            this.$confirm('此操作将删除该规格, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.post(true)
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        /*
         *   添加规格值
         */
        addSpecValue() {
            this.spec_values.push('');
        },
        /**
         *  删除规格值
         */
        removeValue(index) {
            this.spec_values.splice(index, 1);
        },
        /*
         *   规格列表多选组初始化
         */
        creatCheckboxGroup() {
            Object.keys(this.spec_list).forEach((item) => {
                this.check_list[item] = []
                this.all_spec[item] = []
                let count = 0;
                let cities = Object.keys(this.spec_list[item]['values']);
                cities.forEach((index) => {
                    this.all_spec[item].push(index)
                })
                this.check_all[item] = false;
                this.is_indeterminate[item] = false;
            })
            this.check_list = Object.assign({}, this.check_list, this.check_list)
            this.check_all = Object.assign({}, this.check_all, this.check_all)
            this.is_indeterminate = Object.assign({}, this.is_indeterminate, this.is_indeterminate)
            this.all_spec = Object.assign({}, this.all_spec, this.all_spec)
        },
        /*
         * 全选
         */
        handleCheckAllChange(val, i) {
            this.check_list[i] = val ? this.all_spec[i] : [];
            this.is_indeterminate[i] = false;
        },
        /*
         * 选中某个时，检测所属组的状态 (组状态：全选，全不选，部分)
         */
        handleCheckedCitiesChange(value, i) {
            let checkedCount = value.length;
            this.check_all[i] = checkedCount === this.all_spec[i].length;
            this.is_indeterminate[i] = checkedCount > 0 && checkedCount < this.all_spec[i].length
        },
        /*
         *   将选中的规格整理输出给调用组件
         */
        out() {
            if (this.$store.state.dialogSpecVisible == false) {
                return false; // 防止用户多次点击
            }
            this.$store.commit('MdialogSpecVisible', false);
            let values = {};
            this.return_spec_list = {};
            Object.keys(this.check_list).forEach((key) => {
                if (this.check_list[key].length > 0) {
                    values = {};
                    this.return_spec_list[key] = {}
                    this.return_spec_list[key].name = this.spec_list[key]['name']
                    this.check_list[key].forEach((item) => {
                        values[item] = this.spec_list[key]['values'][item]
                    })
                    this.return_spec_list[key].values = values
                }
            })
            if(Object.keys(this.return_spec_list).length === 0 && this.return_spec_list.constructor === Object) {
                return false;
            }
            this.$emit('e_spec_list', this.return_spec_list)
        }
    }
}

</script>
<style scoped>
.el-input {
    width: auto;
}

.mouse:hover {
    color: #99AEFF;
    cursor: pointer;
}

</style>