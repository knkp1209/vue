<template>
    <div>
        <el-switch class="s_spec" v-model="unified" active-text="多规格" inactive-text="统一规格" @change="manySpec"></el-switch>
        <el-button type="primary" size="mini" @click="$store.commit('MdialogSpecVisible', true)">添加规格</el-button>
        <keep-alive>
            <template v-if="$store.state.dialogSpecVisible">
                    <Spec @e_spec_list="createSpecTable"></Spec>
            </template>
        </keep-alive>
        <el-table :data="table_data" :max-height="700" stripe @selection-change="handleSelectionChange" ref="spec_table" v-loading="creating">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column width="100" fixed :label="item" :key="index" v-for="(item,index) in spec_names">
                <template slot-scope="scope">
                    {{scope.row[index]}}
                </template>
            </el-table-column>
            <el-table-column width="120" label="库存">
                <template slot-scope="scope">
                    <el-input @input.native="check($event,'库存','stock')" :name="'stock' + scope.$index " v-validate="'required|numeric|min_value:0|max_value:99999999'" v-model="post_data[table_data[scope.$index]['index']].stock" placeholder="库存 (必填)"></el-input>
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
            <el-table-column width="100" label="积分">
                <template slot-scope="scope">
                    <el-input @input.native="check($event,'积分','point')" v-validate="'numeric|min_value:0|max_value:99999999'" :name="'point' + scope.$index " v-model="post_data[table_data[scope.$index]['index']].point" placeholder="积分"></el-input>
                </template>
            </el-table-column>
            <el-table-column width="100" label="经验值">
                <template slot-scope="scope">
                    <el-input @input.native="check($event,'经验值','exp')" v-validate="'numeric|min_value:0|max_value:99999999'" :name="'exp' + scope.$index " v-model="post_data[table_data[scope.$index]['index']].exp" placeholder="经验值"></el-input>
                </template>
            </el-table-column>
            <el-table-column width="100" label="重量(克)">
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
            <el-table-column label="操作" width="80" fixed="right">
                <template slot-scope="scope">
                    <el-button size="mini" type="danger" @click="deleteRow(scope.$index,table_data[scope.$index]['index'], table_data)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import Spec from '@/components/Goods/Spec'
var t_b = [];
var s_n = {};
export default {
    name: 'Goods_SpecTable',
    data() {
        return {
            unified: false,
            table_data: [],
            spec_names: {},
            post_data: [],
            spec_checked_row: [],
            spec_data: {},
            creating:false,
            open_spec:false, // 打开规格选择窗
        };
    },
    props:{
        specs:{ // 规格名
            type:Object,
            // required:true,
        },
        products:{ // 货品
            type:Array,
            // required:true,
        }
    },
    components: { Spec },
    created() {
        if (this.products.length > 0) {
            this.post_data = this.products;
            let temp = {}
            if (this.specs != null) {
                this.spec_data = this.specs;
                let spec_names = this.specs;
                let spec_names_key = [];
                let temp_spec_names = [];
                for (let i in spec_names) {
                    spec_names_key.push(i);
                    temp[i] = spec_names[i]['name'];
                }
                this.spec_names = temp;
                this.unified = true;
                let big = [];
                temp = {};
                let ii = 0;
                for (let i = 0; i < this.products.length; i++) {
                    let spec_value = JSON.parse(this.products[i].spec_value);
                    ii = 0;
                    temp = {};
                    for(let j in spec_value) {
                        temp[spec_names_key[ii]] = spec_value[j];
                        ii++;
                    }
                    temp['index'] = i;
                    big.push(temp);
                }
                this.table_data = big;
            } else {
                console.log('yang');
                this.post_data = this.products;
                this.table_data = [
                    { index: 0 }
                ];
                this.unified = false;
            }
        } else {
            this.manySpec(false);
        }       
    },
    methods: {
        deleteRow(index, p_index, rows) {
            console.log(rows);
            console.log(index);
            console.log(p_index);
            rows.splice(index, 1);
            delete this.post_data[p_index];
            this.$nextTick(() => {
                $(".input_error").removeClass('input_error')
            });
        },
        manySpec(value) {
            this.post_data = []
            this.table_data = [];
            this.spec_data = {};
            if (value === false) {
                this.spec_names = {}
                this.post_data.push({
                    spec_value: '',
                    stock: '',
                    sell_price: '',
                    price: '',
                    cost_price: '',
                    point: '',
                    exp: '',
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
        /**
         *  分包
        */
        chunk(array,process,i){
            let data_key = Object.keys(array)
            var len = data_key.length; //这里要注意在执行过程中数组最好是不变的
            setTimeout(() => {
                process( array[data_key[i]],data_key[i],i++); //循环体要做的操作
                if(i < len ){
                    setTimeout(() => {
                        this.chunk(array,process,i)
                    },50)
                }else{
                    this.spec_names = Object.assign({}, this.spec_names, s_n);
                    this.table_data = t_b;
                    console.log(this.spec_names);
                    console.log(this.table_data);
                    s_n = [];
                    t_b = [];
                    this.createSpuListStorage(this.table_data.length)
                    this.creatteIndx(this.table_data.length)
                    this.creating = false;
                }
            })
        },
        /**
         *  生成规格表格的核心
        */
        core(data,key,index){
            s_n[key] = data.name
            let values = data.values
            let big_temp = [];
            if (index == 0) {
                Object.keys(values).forEach((v_key, v_index) => {
                    t_b.push({
                        [key]: values[v_key]
                    })
                })
            } else {
                t_b.forEach((item) => {
                    Object.keys(values).forEach((v_key, v_index) => {
                        let temp = {}
                        temp = Object.assign({}, temp, item)
                        temp[key] = values[v_key]
                        big_temp.push(temp);
                    })
                })
                t_b = big_temp;
            }
        },
        /*
         *   生成规格表格
         */
        createSpecTable(data) {
            this.creating = true;
            this.table_data = []
            this.post_data = []
            this.spec_data = Object.assign({}, {}, data)
            this.spec_names = {}
            let values = {}
            let data_key = Object.keys(data)
            if (data_key.length > 3) {
                this.$message.error('规格不能超过3个,请重新选择！');
                return false;
            }
            this.chunk(data,this.core,0)
        },

        /*
         *   创建单品列表的信息容器
         */
        createSpuListStorage(length) {
            for (let i = 0; i < length; i++) {
                let temp = {}
                Object.keys(this.table_data[i]).forEach((key) => {
                    temp[this.spec_names[key]] = this.table_data[i][key];
                })
                this.post_data.push({
                    spec_value: JSON.stringify(temp),
                    stock: '',
                    sell_price: '',
                    price: '',
                    cost_price: '',
                    point: '',
                    exp: '',
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
            let is_error = false;
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
                    is_error = true;
                    $(e.target).addClass('input_error')
                } else {
                    is_error = false;
                    $(e.target).removeClass('input_error')
                }
            });
            let indexs = [];
            let input_name = [];
            if (!is_error) {
                if (this.spec_checked_row.length > 0) {
                    this.table_data.forEach((item) => {
                        // 由于有删除操作，table_data 的下标（element ui）会改变，所以要把 table_data 里面每一项的index (creatteIndx 生成的) 存起来，后面可以根据index 定位到下标
                        indexs.push(item.index);
                    })
                    this.spec_checked_row.forEach((i) => {
                        // 选中行的某个输入框
                        input_name.push(name + indexs.indexOf(i));
                    });
                    if (input_name.indexOf(e.target.name) != -1) {
                        // 在选中行中
                        input_name.forEach((item) => {
                            if (item != e.target.name) {
                                this.$nextTick(() => {
                                    $("input[name='" + item + "']").removeClass('input_error');
                                })
                            }
                        });
                        this.spec_checked_row.forEach((i) => {
                            this.post_data[i][name] = e.target.value
                        })
                    }
                }
            }
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