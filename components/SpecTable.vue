<template>
    <div>
        <el-switch class="s_spec" v-model="unified" active-text="多规格" inactive-text="统一规格" @change="manySpec"></el-switch>
        <template v-if="unified">
            <Spec @e_spec_list="createSpecTable"></Spec>
        </template>
        <el-table :data="table_data" :max-height="700" stripe @selection-change="handleSelectionChange" ref="spec_table">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column width="100" fixed :label="item" :key="index" v-for="(item,index) in spec_names">
                <template slot-scope="scope">
                    {{scope.row[index]}}
                </template>
            </el-table-column>
            <el-table-column width="120" label="库存">
                <template slot-scope="scope">
                    <el-input @input.native="check($event,'库存','stock')" :name="'stock_' + scope.$index " v-validate="'required|numeric|min_value:0|max_value:99999999'" v-model="post_data[table_data[scope.$index]['index']].stock" placeholder="库存 (必填)"></el-input>
                </template>
            </el-table-column>
            <el-table-column width="150" label="销售价">
                <template slot-scope="scope">
                    <el-input @input.native="check($event,'销售价','sell_price')" v-validate="'required|decimal:2|min_value:0|max_value:99999999'" :name="'sell_price' + scope.$index " v-model="post_data[table_data[scope.$index]['index']].sell_price" placeholder="销售价 (必填)"></el-input>
                </template>
            </el-table-column>
            <el-table-column width="150" label="原价" select-on-indeterminate>
                <template slot-scope="scope">
                    <el-input @input.native="check($event,'原价','price')" v-validate="'decimal:2|min_value:0|max_value:99999999'" :name="'price' + scope.$index " v-model="post_data[table_data[scope.$index]['index']].price" placeholder="原价"></el-input>
                </template>
            </el-table-column>
            <el-table-column width="150" label="成本价">
                <template slot-scope="scope">
                    <el-input @input.native="check($event,'成本价','cost_price')" v-validate="'decimal:2|min_value:0|max_value:99999999'" :name="'cost_price' + scope.$index " v-model="post_data[table_data[scope.$index]['index']].cost_price" placeholder="成本价"></el-input>
                </template>
            </el-table-column>
            <el-table-column width="100" label="运费">
                <template slot-scope="scope">
                    <el-input @input.native="check($event,'运费','freight')" v-validate="'decimal:2|min_value:0|max_value:99999999'" :name="'freight' + scope.$index " v-model="post_data[table_data[scope.$index]['index']].freight" placeholder="运费"></el-input>
                </template>
            </el-table-column>
            <el-table-column width="100" label="重量">
                <template slot-scope="scope">
                    <el-input @input.native="check($event,'重量','weight')" v-validate="'numeric|min_value:0|max_value:99999999'" :name="'weight' + scope.$index " v-model="post_data[table_data[scope.$index]['index']].weight" placeholder="重量"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="条形码">
                <template slot-scope="scope">
                    <el-input @input.native="check($event,'条形码','bar_code')" v-validate="'max:14'" :name="'bar_code' + scope.$index " v-model="post_data[table_data[scope.$index]['index']].bar_code" placeholder="条形码"></el-input>
                </template>
            </el-table-column>
            <el-table-column width="180" label="货号">
                <template slot-scope="scope">
                    <el-input @input.native="check($event,'货号','product_number')" v-validate="'max:14'" :name="'product_number' + scope.$index " v-model="post_data[table_data[scope.$index]['index']].product_number" placeholder="货号">
                    </el-input>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="100" fixed="right">
                <template slot-scope="scope">
                    <el-button size="text" @click="handleEdit(scope.$index, scope.row)">编辑
                    </el-button>
                    <el-button size="text" type="danger" @click="deleteRow(scope.$index,table_data[scope.$index]['index'], table_data)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import Spec from '@/components/Spec'
export default {
    name: 'SpecTable',
    data() {
        return {
            unified: false,
            table_data: [],
            spec_names: {},
            spec_names_length: 0,
            post_data: [],
            spec_checked_row: [],
            spec_data: {},
        };
    },
    components: { Spec },
    created() {
        this.manySpec(false);
    },
    methods: {
        handleEdit(index, row) {
            console.log(index, row);
        },
        deleteRow(index, p_index, rows) {
            rows.splice(index, 1);
            delete this.post_data[p_index];
        },
        manySpec(value) {
            this.post_data = []
            this.spec_names_length = 0;
            this.table_data = [];
            if (value === false) {
                this.spec_names = {}
                this.post_data.push({
                    spec_value: '',
                    stock: '',
                    sell_price: '',
                    price: '',
                    cost_price: '',
                    freight: '',
                    weight: '',
                    bar_code: '',
                    product_number: '',
                })
                this.$nextTick(() => {
                    this.table_data = [
                        { index: 0 }
                    ]
                })
            } else {
                this.table_data = []
            }
        },
        /*
         *   生成规格表格
         */
        createSpecTable(data) {
            this.table_data = []
            this.post_data = []
            this.spec_data = Object.assign({}, this.spec_data, data)
            // 此处由于可能是因为上面赋值问题
            this.$nextTick(() => {
                this.spec_names = {}
                let values = {}
                let data_key = Object.keys(data)
                if (data_key.length > 3) {
                    this.$message.error('规格不能超过3个,请重新选择！');
                    return false;
                }
                data_key.forEach((key, index) => {
                    this.spec_names[key] = data[key].name
                    this.spec_names = Object.assign({}, this.spec_names, this.spec_names)
                    values = data[key].values
                    let big_temp = [];
                    if (index == 0) {
                        Object.keys(values).forEach((v_key, v_index) => {
                            this.table_data.push({
                                [key]: values[v_key]
                            })
                        })
                    } else {
                        this.table_data.forEach((item) => {
                            Object.keys(values).forEach((v_key, v_index) => {
                                let temp = {}
                                temp = Object.assign({}, temp, item)
                                temp[key] = values[v_key]
                                big_temp.push(temp);
                            })
                        })
                        this.table_data = big_temp;
                    }
                })
                this.createSpuListStorage(this.table_data.length)
                this.creatteIndx(this.table_data.length)
            }, 0);
        },
        /*
         *   创建单品列表的信息容器
         */
        createSpuListStorage(length) {
            for (let i = 0; i < length; i++) {
                let temp = {}
                Object.keys(this.table_data[i]).forEach((key) => {
                    temp[this.spec_names[key]] = this.table_data[i][key]
                })
                this.post_data.push({
                    spec_value: JSON.stringify(temp),
                    stock: '',
                    sell_price: '',
                    price: '',
                    cost_price: '',
                    freight: '',
                    weight: '',
                    bar_code: '',
                    product_number: '',
                })
            }
        },
        /*
         *   创建表格下标
         */
        creatteIndx(length) {
            for (let i = 0; i < length; i++) {
                this.$set(this.table_data[i], 'index', i)
            }
        },
        /*
         *   选中行
         */
        handleSelectionChange(val) {
            this.spec_checked_row = [];
            val.forEach((item, index, arr) => {
                this.spec_checked_row.push(item['index'])
            })
        },
        /*
         *   规格信息输入验证
         */
        check(e, tip, name) {
            this.$validator.validate(e.target.name, e.target.value).then(result => {
                if (!result) {
                    // do stuff if not valid.
                    let error_tip = this.errors.items[0].msg;
                    let index = error_tip.indexOf(" ", 2) + 1;
                    this.$message({
                        showClose: true,
                        message: tip + error_tip.substring(index),
                        type: 'error',
                        duration: 1500,
                    });
                    $(e.target).addClass('input_error')
                } else {
                    $(e.target).removeClass('input_error')
                }
            });
            this.spec_checked_row.forEach((i) => {
                this.post_data[i][name] = e.target.value
            })
        },
        /*
         *   规格信息全部验证并将规格数据返回给父组件
         */
        checkAll() {
            this.$validator.validateAll().then(result => {
                if (!result) {
                    this.errors.items.forEach((item, index) => {
                        $("input[name='" + item['field'] + "']").addClass('input_error')
                    })
                    this.$message.error('规格有误')
                    this.$store.commit('MactiveGoodsTabs', 'third')
                } else {
                    let data = {}
                    // data['spec'] = this.spec_data
                    // data['products'] = this.post_data
                    if (this.table_data.length > 0) {
                        this.$emit('emit_v_spec', 'spec_table', this.post_data);
                    }
                }
            })
        }
    }
}

</script>
<style scoped>
.help {
    color: red;
    position: fixed;
    top: 25%;
    left: 50%;
}

.s_spec {
    float: left;
    height: 40px;
    margin-right: 20px;
}

</style>
<style>
.input_error {
    border: 1px solid red !important;
}

</style>
