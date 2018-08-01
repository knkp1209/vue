<template>
    <div>
        <el-form label-width="80px">
            <el-row type="flex" justify="left">
                <el-col :xs="24" :sm="24" :md="16" :lg="8" :xl="8">
                    <el-form-item label="名称">
                        <el-input v-model="name" name="name" v-validate="'required|max:200'" placeholder="商品名称 (必填)"></el-input>
                        <i class="my_err" v-show="errors.has('name')">{{errors.first('name')}}</i>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row type="flex" justify="left">
                <el-col :xs="24" :sm="24" :md="16" :lg="8" :xl="8">
                    <el-form-item label="单位">
                        <el-input v-model="unit" name="unit" v-validate="'max:10'" placeholder="计件单位。如:件,箱,个"></el-input>
                        <i class="my_err" v-show="errors.has('name')">{{errors.first('unit')}}</i>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row type="flex" justify="left">
                <el-col :xs="24" :sm="24" :md="16" :lg="8" :xl="8">
                    <el-form-item label="排序">
                        <el-input v-model="sort" name="sort" v-validate="'numeric|min_value:0|max_value:99999999'" placeholder="填写的数字越大，排序越靠前"></el-input>
                        <i class="my_err" v-show="errors.has('sort')">{{errors.first('sort')}}</i>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row type="flex" justify="left">
                <el-form-item label="分类">
                    <div>
                        <el-col :xs="24" :sm="20" :md="16" :lg="14" :xl="18">
                            <el-row type="flex" :gutter="10">
                                <el-col :span="11">
                                    <el-select v-model="cat_id" filterable multiple style="width: 100%;" placeholder="请选择" @change="getSub">
                                        <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-col>
                                <el-col :span="11">
                                    <el-select v-model="sub_cat_id" filterable multiple style="width: 100%;" placeholder="请选择">
                                        <el-option v-for="item in options_sub" :key="item.id" :label="item.name" :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-col>
                                <el-col :span="1">
                                    <el-button size="mini" type="primary" @click="$store.commit('MvisibleCategory',true)">添加分类</el-button>
                                    <template v-if="$store.state.visibleCategory">
                                        <category></category>
                                    </template>
                                </el-col>
                            </el-row>
                        </el-col>
                    </div>
                </el-form-item>
            </el-row>
            <el-row type="flex" justify="left">
                <el-col :xs="24" :sm="20" :md="16" :lg="12" :xl="8">
                    <el-form-item label="上下架">
                        <el-switch v-model="is_shelf" active-text="上架" inactive-text="下架">
                        </el-switch>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row type="flex" justify="left">
                <el-col :xs="24" :sm="20" :md="16" :lg="12" :xl="8">
                    <el-form-item label="参数">
                        <dynamic-input :parameters="parameters" :tip_name="'a'" :tip_value="'b'"></dynamic-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row type="flex" justify="left">
                <el-col :xs="24" :sm="20" :md="16" :lg="12" :xl="8">
                    <el-form-item label="标记">
                        <tag key="mark" :dynamic-tags="mark" :tip="'例如：热卖 新品'"></tag>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row type="flex" justify="left">
                <el-col :xs="24" :sm="20" :md="16" :lg="12" :xl="8">
                    <el-form-item label="承诺">
                        <tag key="promise" :dynamic-tags="promise" :tip="'例如：包邮 正品保证 七天退换'"></tag>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>
<script>
import Tag from '@/components/Tag'
import DynamicInput from '@/components/DynamicInput'
// import Category from '@/components/Category'
export default {
    name: 'Goods_Base',
    data() {
        return {
            name: '',
            sort: '',
            unit: '',
            is_shelf: true,
            promise: [],
            mark: [],
            parameters: [],
            // options: [],
            options_sub: [],
            cat_id: [],
            sub_cat_id: []
        }
    },
    created() {
        this.getOption()
    },
    computed: {
        options () {
            return this.$store.state.topCategoryList
        }
    },
    components: { Tag, DynamicInput, 'category': () => import('@/components/Category')},
    methods: {
        getSub(val) {
            this.options_sub = [];
            val.forEach((id) => {
                for(var i = 0; i < this.options.length; i++) {
                    if (this.options[i].id  == id) {
                        if (this.options[i].children !== undefined ) {
                            this.options_sub.push.apply(this.options_sub,this.options[i].children);
                        }
                        break;
                    }
                }
            })
        },
        getOption() {
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
        checkAll() {
            this.$validator.validateAll().then(result => {
                if (!result) {
                    this.$message.error('基本信息有误')
                    this.$store.commit('MactiveGoodsTabs', 'first')
                } else {
                    let data = {}
                    data['name'] = this.name;
                    data['sort'] = this.sort;
                    data['unit'] = this.unit;
                    data['is_shelf'] = this.is_shelf;
                    data['mark'] = this.mark;
                    data['promise'] = this.promise;
                    data['parameters'] = this.parameters;
                    data['cat_id'] = this.cat_id;
                    data['sub_cat_id'] = this.sub_cat_id;
                    this.$emit('emit_v_base', 'base', data);
                }
            })
        }
    }
}

</script>
<style scoped>
.el-tag+.el-tag {
    margin-left: 10px;
}

.button-new-tag {
    height: 32px;
    line-height: 30px;
    margin-left: 10px;
    padding-bottom: 0;
    padding-top: 0;
}

.input-new-tag {
    margin-left: 10px;
    vertical-align: bottom;
    width: 180px;
    font-size: 12px;
}

</style>
