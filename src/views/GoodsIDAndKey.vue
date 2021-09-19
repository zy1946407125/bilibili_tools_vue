<template>
    <div>
        <h1>商品id与密钥</h1>
        <el-table
                v-loading="loading2"
                element-loading-text="正在刷新..."
                element-loading-spinner="el-icon-loading"
                :data="goodsIDAndKey"
                stripe
                style="width: 100%">
            <el-table-column
                    prop="key"
                    label="商品功能"
                    width="280">
            </el-table-column>
            <el-table-column
                    prop="goodsId"
                    label="商品ID"
                    width="280">
            </el-table-column>
            <el-table-column
                    prop="apikey"
                    label="apiKey"
                    width="280">
            </el-table-column>
            <el-table-column label="操作"
                             width="180">
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            type="warning"
                            @click="updateGoods(scope.$index,scope.row)">修改
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="修改商品" :visible.sync="dialogFormVisible" :show-close="false">
            <el-form :model="goodDataReal" v-loading="loading"
                     :element-loading-text="loading_text"
                     element-loading-spinner="el-icon-loading">
                <el-form-item label="商品功能">
                    <el-input v-model="goodDataReal.key" disabled autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="商品ID">
                    <el-input v-model="goodDataReal.goodsId" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="apikey">
                    <el-input v-model="goodDataReal.apikey" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel()">取 消</el-button>
                <el-button type="primary" @click="submitGoods()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "GoodsIDAndKey",
        data() {
            return {
                goodsIDAndKey: [],
                loading: false,
                loading2: false,
                loading_text: "",
                dialogFormVisible: false,
                goodDataReal: {
                    key: "",
                    goodsId: "",
                    apikey: ""
                }
            }
        },
        methods: {
            getAllGoodsIDAndKey() {
                var that = this
                this.loading2 = true
                axios.post("/getAllGoodsIDAndKey").then(resp => {
                    console.log(resp)
                    that.goodsIDAndKey = resp.data
                    that.loading2 = false
                })
            },
            updateGoods(index, row) {
                this.goodDataReal = row
                this.dialogFormVisible = true
            },
            cancel() {
                this.goodDataReal = {
                    key: "",
                    goodsId: "",
                    apikey: ""
                }
                this.dialogFormVisible = false
                this.getAllGoodsIDAndKey()
            },
            submitGoods() {
                var that = this
                var params = new URLSearchParams()
                params.append('key', this.goodDataReal.key)
                params.append('goodsId', this.goodDataReal.goodsId)
                params.append('apikey', this.goodDataReal.apikey)
                this.loading_text = "正在更新"
                this.loading = true
                axios.post("/setGoodsIDAndKey", params).then(resp => {
                    console.log(resp)
                    that.loading = false
                    if (resp.data.code == 0) {
                        that.$message.success("更新成功")
                        that.goodsIDAndKey = resp.data.data
                        that.goodDataReal = {
                            key: "",
                            goodsId: "",
                            apikey: ""
                        }
                        that.dialogFormVisible = false
                    } else {
                        that.$message.success("更新失败")
                    }
                })
            }
        },
        created() {
            this.getAllGoodsIDAndKey()
        }
    }
</script>

<style scoped>

</style>
