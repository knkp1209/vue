<template>
    <div>
        <el-switch v-model="unified" active-text="多规格" inactive-text="统一规格" @change="manySpec"></el-switch>
        <template v-if="unified">
            <Spec @e_spec_list="createSpecTable"></Spec>
        </template>
        <el-table :data="table_data" stripe @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column width="100" :label="item" :key="index" v-for="(item,index) in spec_names">
                <template slot-scope="scope">
                    {{scope.row[index]}}
                </template>
            </el-table-column>
            <el-table-column width="120" label="库存">
                <template slot-scope="scope">
                    <el-input @input.native="check($event,'库存','stock')" :name="'stock_' + scope.$index" v-validate="'required|numeric|min_value:0|max_value:99999999'" v-model="post_data[scope.$index].stock" placeholder="库存"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="销售价">
                <template slot-scope="scope">
                    <el-input @input.native="check($event,'销售价','sell_price')" v-validate="'required|decimal:2|min_value:0|max_value:99999999'" :name="'sell_price' + scope.$index" v-model="post_data[scope.$index].sell_price" placeholder="销售价"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="原价" select-on-indeterminate>
                <template slot-scope="scope">
                    <el-input @input.native="check($event,'原价','price')" v-validate="'required|decimal:2|min_value:0|max_value:99999999'" :name="'price' + scope.$index" v-model="post_data[scope.$index].price" placeholder="原价"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="成本价">
                <template slot-scope="scope">
                    <el-input @input.native="check($event,'成本价','cost_price')" v-validate="'decimal:2|min_value:0|max_value:99999999'" :name="'cost_price' + scope.$index" v-model="post_data[scope.$index].cost_price" placeholder="成本价"></el-input>
                </template>
            </el-table-column>
            <el-table-column width="100" label="运费">
                <template slot-scope="scope">
                    <el-input @input.native="check($event,'运费','freight')" v-validate="'decimal:2|min_value:0|max_value:99999999'" :name="'freight' + scope.$index" v-model="post_data[scope.$index].freight" placeholder="运费"></el-input>
                </template>
            </el-table-column>
            <el-table-column width="100" label="重量">
                <template slot-scope="scope">
                    <el-input @input.native="check($event,'重量','weight')" v-validate="'numeric|min_value:0|max_value:99999999'" :name="'weight' + scope.$index" v-model="post_data[scope.$index].weight" placeholder="重量"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="条形码">
                <template slot-scope="scope">
                    <el-input @input.native="check($event,'条形码','bar_code')" v-validate="'max:14'" :name="'bar_code' + scope.$index" v-model="post_data[scope.$index].bar_code" placeholder="条形码"></el-input>
                </template>
            </el-table-column>
            <el-table-column width="180" label="货号">
                <template slot-scope="scope">
                    <el-input @input.native="check($event,'货号','product_number')" v-validate="'max:14'" :name="'product_number' + scope.$index" v-model="post_data[scope.$index].product_number" placeholder="货号">
                    </el-input>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑
                    </el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除
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
            unified: true,
            table_data: [],
            spec_names: {},
            post_data: [{
                stock: '',
                sell_price: '',
                price: '',
                cost_price: '',
                freight: '',
                weight: '',
                bar_code: '',
                product_number: '',
            }],
            spec_checked_row:[],
        };
    },
    components: { Spec },
    created() {
        // this.manySpec(false);
    },
    methods: {
        handleEdit(index, row) {
            console.log(index, row);
        },
        handleDelete(index, row) {
            console.log(index, row);
        },
        manySpec(value) {
            if (value === false) {
                this.spec_names = {}
                this.table_data = [
                    []
                ]
            }
        },
        /*
         *   生成规格表格
         */
        createSpecTable(data) {
            this.table_data = []
            let values = {}
            let data_key = Object.keys(data)
            if (data_key.length > 3) {
                this.$message.error('规格不能超过3个,请重新选择！');
                return false;
            }
            data_key.forEach((key, index) => {
                values = data[key].values
                let big_temp = [];
                if (index == 0) {
                    Object.keys(values).forEach((v_key, v_index) => {
                        this.$set(this.table_data, v_index, {
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
                this.spec_names[key] = data[key].name
            })
            this.spec_names = Object.assign({}, this.spec_names, this.spec_names)
            this.createSpuListStorage(this.table_data.length)
            this.creatteIndx(this.table_data.length)
        },
        /*
         *   创建单品列表的信息容器
         */
        createSpuListStorage(length) {
            for (let i = 0; i < length; i++) {
                this.$set(this.post_data, i, {
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
                this.table_data[i]['index'] = i;
            }
        },
        handleSelectionChange(val) {
            this.spec_checked_row = [];
            val.forEach((item,index,arr) => {
                this.spec_checked_row.push(item['index'])
            })
            console.log(this.spec_checked_row);
        },
        test() {
            console.log(this.post_data);
        },
        check(e, tip, name) {    
            this.$validator.validate(e.target.name, e.target.value).then(result => {
                if (!result) {
                    // do stuff if not valid.
                    console.log(this.errors.items)
                    let error_tip = this.errors.items[0].msg;
                    let index = error_tip.indexOf(" ",2) + 1;
                    this.$message({
                        showClose: true,
                        message:tip + error_tip.substring(index),
                        type:'error',
                        duration:1500,
                    });
                    // e.target.focus()
                }
            });
            let _this = this;
            this.spec_checked_row.forEach((i) => {
                _this.post_data[i][name] =  e.target.value
            })
        },

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

</style>
