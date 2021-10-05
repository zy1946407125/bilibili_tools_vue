<template>
    <div>
        <h1>小号设置</h1>
        <div style="display: flex;flex-direction: row">
            <el-button type="primary" @click="addAccount()" icon="el-icon-s-promotion">添加小号</el-button>
            <div style="width: 300px"></div>
            <el-button type="primary" @click="addAccount2()" icon="el-icon-s-promotion">批量导入</el-button>
            <div style="width: 300px"></div>
            <el-input v-model="selectedAccount" clearable style="width: 300px" placeholder="请输入DedeUserID"></el-input>
            <el-button type="primary" @click="filterAccount()" icon="el-icon-search">搜索</el-button>
        </div>
        <el-table
                v-loading="loading2"
                element-loading-text="正在刷新..."
                element-loading-spinner="el-icon-loading"
                :data="accountData"
                stripe
                style="width: 100%">
            <el-table-column
                    prop="dedeUserID"
                    label="DedeUserID"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="buvid2"
                    label="buvid2"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="buvid3"
                    label="buvid3"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="bili_jct"
                    label="bili_jct"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="sessData"
                    label="SESSDATA"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="likeRequestNum"
                    label="点赞请求次数"
                    width="110">
            </el-table-column>
            <el-table-column
                    prop="likeSuccessNum"
                    label="点赞成功次数"
                    width="110">
            </el-table-column>
            <el-table-column
                    prop="followRequestNum"
                    label="关注请求次数"
                    width="110">
            </el-table-column>
            <el-table-column
                    prop="followSuccessNum"
                    label="关注成功次数"
                    width="110">
            </el-table-column>
            <el-table-column label="操作"
                             width="180">
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            type="warning"
                            :disabled="scope.row.status=='运行'?true:false"
                            @click="remove(scope.$index,scope.row)">移除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="新增小号" :visible.sync="dialogFormVisible" :show-close="false">
            <el-form :model="accountDataReal" v-loading="loading"
                     :element-loading-text="loading_text"
                     element-loading-spinner="el-icon-loading">
                <el-form-item label="DedeUserID">
                    <el-input v-model="accountDataReal.dedeUserID" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="buvid2">
                    <el-input v-model="accountDataReal.buvid2" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="buvid3">
                    <el-input v-model="accountDataReal.buvid3" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="bili_jct">
                    <el-input v-model="accountDataReal.bili_jct" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="SESSDATA">
                    <el-input v-model="accountDataReal.sessData" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel()">取 消</el-button>
                <el-button type="primary" @click="submitAccount()">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="批量导入" :visible.sync="dialogFormVisible2" :show-close="false">
            <el-input type="textarea"
                      :rows="5"
                      v-model="accountText"
                      autocomplete="off" placeholder="不同账号间用换行(回车)隔开"></el-input>
            <el-button @click="importAccount()">导入</el-button>
            <el-table
                    :data="accountDataTable"
                    stripe
                    style="width: 100%">
                <el-table-column
                        prop="dedeUserID"
                        label="DedeUserID"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="buvid2"
                        label="buvid2"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="buvid3"
                        label="buvid3"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="bili_jct"
                        label="bili_jct"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="sessData"
                        label="SESSDATA"
                        width="180">
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel2()">取 消</el-button>
                <el-button type="primary" @click="submitAccount2()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Account",
        data() {
            return {
                loading2: false,
                selectedAccount: "",
                accountData: [],
                accountDataTable: [],
                dialogFormVisible: false,
                dialogFormVisible2: false,
                accountDataReal: {
                    dedeUserID: "",
                    buvid2: "",
                    buvid3: "",
                    bili_jct: "",
                    sessData: ""
                },
                loading_text: "",
                loading: false,
                accountText: "",
            }
        },
        methods: {
            addAccount() {
                this.dialogFormVisible = true
            },
            addAccount2() {
                this.dialogFormVisible2 = true
            },
            filterAccount() {
                console.log(this.selectedAccount)
                var that = this
                axios.post('/getAccounts').then(resp => {
                    console.log(resp)
                    if (that.selectedAccount == "") {
                        that.accountData = resp.data.accountData
                    } else {
                        let filterAccount = []
                        for (let i = 0; i < resp.data.accountData.length; i++) {
                            if (resp.data.accountData[i].dedeUserID == that.selectedAccount) {
                                filterAccount.push(resp.data.accountData[i])
                            }
                        }
                        that.accountData = filterAccount
                    }
                    console.log(that.accountData)
                })
            },
            remove(index, row) {
                this.loading2 = true
                var that = this
                var params = new URLSearchParams()
                params.append('dedeUserID', row.dedeUserID)
                axios.post("/removeAccount", params).then(resp => {
                    console.log(resp)
                    that.loading2 = false
                    that.accountData = resp.data.accountData
                    if (resp.data.code == 0) {
                        that.$message.success("移除成功")
                    } else {
                        that.$message.warning("移除失败")
                    }
                })
            },
            cancel() {
                this.dialogFormVisible = false
                this.accountDataReal = {
                    dedeUserID: "",
                    buvid2: "",
                    buvid3: "",
                    bili_jct: "",
                    sessData: ""
                }
            },
            cancel2() {
                this.dialogFormVisible2 = false
                this.accountDataReal = {
                    dedeUserID: "",
                    buvid2: "",
                    buvid3: "",
                    bili_jct: "",
                    sessData: ""
                }
                this.accountDataTable = []
                this.accountText = ""
            },
            selectAccount() {
                this.loading2 = true
                var that = this
                axios.post("/getAccounts").then(resp => {
                    if (resp.data.code == 0) {
                        that.loading2 = false
                        that.accountData = resp.data.accountData
                    }
                })
            },
            submitAccount() {
                if (this.accountDataReal.dedeUserID != "" && this.accountDataReal.buvid2 != "" && this.accountDataReal.buvid3 != "" && this.accountDataReal.bili_jct != "" && this.accountDataReal.sessData != "") {
                    this.loading_text = "正在添加..."
                    this.loading = true
                    console.log(this.accountDataReal)
                    var that = this
                    var params = new URLSearchParams()
                    params.append('dedeUserID', this.accountDataReal.dedeUserID)
                    params.append('buvid2', this.accountDataReal.buvid2)
                    params.append('buvid3', this.accountDataReal.buvid3)
                    params.append('bili_jct', this.accountDataReal.bili_jct)
                    params.append('sessData', this.accountDataReal.sessData)
                    axios.post("/addAccount", params).then(resp => {
                        this.loading = false
                        console.log(resp)
                        if (resp.data.code == 0) {
                            that.$message.success("添加成功")
                            that.accountDataReal = {
                                dedeUserID: "",
                                buvid2: "",
                                buvid3: "",
                                bili_jct: "",
                                sessData: ""
                            }
                            that.accountData = resp.data.accountData
                            that.dialogFormVisible = false
                        } else {
                            that.$message.warning("添加失败")
                            that.accountData = resp.data.accountData
                        }
                    })
                } else {
                    this.$message.error("请填写完整信息")
                }
            },
            importAccount() {
                console.log(this.accountText)
                this.accountDataTable = [];
                let accounts = this.accountText.split("\n");
                for (let i = 0; i < accounts.length; i++) {
                    let DedeUserID = accounts[i].match(/DedeUserID=(\S*);/);
                    if (DedeUserID != null && DedeUserID.length >= 2) {
                        this.accountDataReal.dedeUserID = DedeUserID[1]
                    } else {
                        this.$message.error("DedeUserID为null，请核实")
                    }

                    let buvid2 = accounts[i].match(/buvid2=(\S*);/);
                    let buvid3 = accounts[i].match(/buvid3=(\S*);/);
                    if (buvid2 == null && buvid3 == null) {
                        this.$message.error("buvid2与buvid3均为null，请核实")
                    }
                    if (buvid2 != null && buvid2.length >= 2) {
                        this.accountDataReal.buvid2 = buvid2[1]
                    } else {
                        this.accountDataReal.buvid2 = buvid3[1]
                    }
                    if (buvid3 != null && buvid3.length >= 2) {
                        this.accountDataReal.buvid3 = buvid3[1]
                    } else {
                        this.accountDataReal.buvid3 = buvid2[1]
                    }

                    let bili_jct = accounts[i].match(/bili_jct=(\S*);/);
                    if (bili_jct != null && bili_jct.length >= 2) {
                        this.accountDataReal.bili_jct = bili_jct[1]
                    } else {
                        this.$message.error("bili_jct为null，请核实")
                    }

                    let SESSDATA = accounts[i].match(/SESSDATA=(\S*);/);
                    if (SESSDATA != null && SESSDATA.length >= 2) {
                        this.accountDataReal.sessData = SESSDATA[1]
                    } else {
                        this.$message.error("SESSDATA为null，请核实")
                    }

                    this.accountDataTable.push(this.accountDataReal)
                    this.accountDataReal = {
                        dedeUserID: "",
                        buvid2: "",
                        buvid3: "",
                        bili_jct: "",
                        sessData: ""
                    }
                }
                console.log(this.accountDataTable)
            },
            submitAccount2() {
                if (this.accountDataTable.length == 0) {
                    this.$message.error("请输入账号信息")
                } else {
                    let i = 0;
                    for (i = 0; i < this.accountDataTable.length; i++) {
                        console.log(this.accountDataTable[i].dedeUserID)
                        if (this.accountDataTable[i].dedeUserID == "" || this.accountDataTable[i].dedeUserID == null) {
                            this.$message.error("第" + (i + 1) + "个账号dedeUserID为null")
                            break
                        }
                    }
                    if (i == this.accountDataTable.length) {
                        this.loading_text = "正在添加..."
                        this.loading = true
                        var that = this
                        var params = new URLSearchParams()
                        params.append('accounts', JSON.stringify(this.accountDataTable))
                        axios({
                            url: "/addAccounts",
                            method: "post",
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            data: JSON.stringify(this.accountDataTable)
                        }).then(resp => {
                            this.loading = false
                            console.log(resp)
                            if (resp.data.code == 0) {
                                that.$message.success("添加成功")
                                this.accountDataReal = {
                                    dedeUserID: "",
                                    buvid2: "",
                                    buvid3: "",
                                    bili_jct: "",
                                    sessData: ""
                                }
                                this.accountDataTable = []
                                this.accountText = ""
                                that.accountData = resp.data.accountData
                                that.dialogFormVisible = false
                            } else {
                                that.$message.warning("添加失败")
                                that.accountData = resp.data.accountData
                            }
                        })

                        // axios.post("/addAccounts", params).then(resp => {
                        //     this.loading = false
                        //     console.log(resp)
                        //     if (resp.data.code == 0) {
                        //         that.$message.success("添加成功")
                        //         this.accountDataReal = {
                        //             dedeUserID: "",
                        //             buvid2: "",
                        //             buvid3: "",
                        //             bili_jct: "",
                        //             sessData: ""
                        //         }
                        //         this.accountDataTable = []
                        //         this.accountText = ""
                        //         that.accountData = resp.data.accountData
                        //         that.dialogFormVisible = false
                        //     } else {
                        //         that.$message.warning("添加失败")
                        //         that.accountData = resp.data.accountData
                        //     }
                        // })
                    }
                }
            },
        },
        created() {
            this.selectAccount()
        }
    }
</script>

<style scoped>

</style>
