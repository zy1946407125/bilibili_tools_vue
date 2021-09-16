<template>
    <div>
        <h1>关注任务</h1>
        <div style="display: flex;flex-direction: row">
            <el-button type="primary" @click="addTask()" icon="el-icon-s-promotion">添加任务</el-button>
            <div style="width: 300px"></div>
            <el-input v-model="selectedFollowID" clearable style="width: 300px" placeholder="请输入用户id"></el-input>
            <el-button type="primary" @click="filterFollowData()" icon="el-icon-search">搜索</el-button>
        </div>
        <el-table
                v-loading="loading2"
                element-loading-text="正在刷新..."
                element-loading-spinner="el-icon-loading"
                :data="followData"
                stripe
                style="width: 100%">
            <!--            <el-table-column-->
            <!--                    prop="id"-->
            <!--                    label="任务ID"-->
            <!--                    width="50">-->
            <!--            </el-table-column>-->
            <el-table-column
                    prop="mid"
                    label="用户id"
                    width="130">
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="用户昵称"
                    width="150">
            </el-table-column>
            <el-table-column
                    prop="startFollowNum"
                    label="开始关注数"
                    width="100">
            </el-table-column>
            <el-table-column
                    prop="nowFollowNum"
                    label="当前关注数"
                    width="100">
            </el-table-column>
            <el-table-column
                    prop="needFollowNum"
                    label="下单数量"
                    width="80">
            </el-table-column>
            <el-table-column
                    prop="requestNum"
                    label="请求次数"
                    width="80">
            </el-table-column>
            <el-table-column
                    prop="successNum"
                    label="成功次数"
                    width="80">
            </el-table-column>
            <el-table-column
                    prop="startTimeStr"
                    label="开始时间"
                    width="100px">
            </el-table-column>
            <el-table-column
                    prop="endTimeStr"
                    label="结束时间"
                    width="100px">
            </el-table-column>
            <el-table-column
                    prop="status"
                    label="当前状态"
                    width="80">
            </el-table-column>
            <el-table-column label="操作"
                             width="180">
                <template slot-scope="scope">
                    <!--                    <el-button-->
                    <!--                            size="mini"-->
                    <!--                            @click="refresh(scope.row)">刷新-->
                    <!--                    </el-button>-->
                    <el-button
                            size="mini"
                            type="danger"
                            :disabled="scope.row.status=='运行'?false:true"
                            @click="stop(scope.$index,scope.row)">停止
                    </el-button>
                    <el-button
                            size="mini"
                            type="warning"
                            :disabled="scope.row.status=='运行'?true:false"
                            @click="remove(scope.$index,scope.row)">移除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="新增关注任务" :visible.sync="dialogFormVisible" :show-close="false">
            <el-form :model="followDataReal" v-loading="loading"
                     :element-loading-text="loading_text"
                     element-loading-spinner="el-icon-loading">
                <el-form-item label="用户id">
                    <el-input v-model="followDataReal.mid" autocomplete="off" @blur="selectFollowData()"></el-input>
                </el-form-item>
                <el-form-item label="用户昵称">
                    <el-input disabled v-model="followDataReal.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="当前关注数">
                    <el-input disabled v-model="followDataReal.startFollow" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="下单数量">
                    <el-input-number v-model="followDataReal.needFollowNum" :min="10" :step="10"
                                     step-strictly>
                    </el-input-number>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel()">取 消</el-button>
                <el-button type="primary" @click="submitTask()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Follow",
        data() {
            return {
                dialogFormVisible: false,
                loading_text: "",
                selectedFollowID: "",
                loading: false,
                loading2: false,
                followData: [],
                followDataReal: {
                    mid: "",
                    name: "",
                    startFollow: "",
                    nowFollow: "",
                    startTimeStr: "",
                    startTimeStamp: "",
                    needFollowNum: 10,
                    threadNum: 1
                }
            }
        },
        methods: {
            selectFollowData() {
                console.log(this.followDataReal)
                if (this.followDataReal.mid != "") {
                    this.loading_text = "正在查询..."
                    this.loading = true
                    var that = this
                    var params = new URLSearchParams()
                    params.append('mid', this.followDataReal.mid)
                    axios.post("/getUserInfo", params).then(resp => {
                        that.loading = false
                        console.log(resp)
                        console.log(resp.data.userInfo.code)
                        if (resp.data.userInfo.code == 0) {
                            console.log(resp.data.userInfo.data.card.mid)
                            console.log(resp.data.userInfo.data.card.name)
                            that.followDataReal.mid = resp.data.userInfo.data.card.mid
                            that.followDataReal.name = resp.data.userInfo.data.card.name
                            that.followDataReal.startFollow = resp.data.userInfo.data.card.fans
                            that.followDataReal.nowFollow = resp.data.userInfo.data.card.fans
                            that.threadNumMax = resp.data.followThreadNum
                        } else {
                            that.$message.error("错误代码：" + resp.data.code + "    错误内容：" + resp.data.message)
                        }
                    })
                }
            },
            addTask() {
                this.dialogFormVisible = true
            },
            filterFollowData() {
                console.log(this.selectedFollowID)
                var that = this
                axios.post('/getFollowUserInfoList').then(resp => {
                    console.log(resp)
                    if (that.selectedFollowID == "") {
                        that.followData = resp.data
                    } else {
                        let filterFollowData = []
                        for (let i = 0; i < resp.data.length; i++) {
                            if (resp.data[i].mid == that.selectedFollowID) {
                                filterFollowData.push(resp.data[i])
                            }
                        }
                        that.followData = filterFollowData
                    }
                    console.log(that.followData)
                })
            },
            stop(index, row) {
                console.log(row)
                this.loading2 = true
                var that = this
                var params = new URLSearchParams()
                params.append('id', row.id)
                params.append('mid', row.mid)
                axios.post("/stopFollow", params).then(resp => {
                    console.log(resp)
                    that.loading2 = false
                    that.followData = resp.data.userInfos
                    if (resp.data.code == 0) {
                        that.$message.success("停止成功")
                    } else {
                        that.$message.warning("停止失败")
                    }
                })
            },
            updateTable() {
                var that = this
                axios.post('/getFollowUserInfoList').then(resp => {
                    console.log(resp)
                    that.followData = resp.data
                    console.log(that.followData)
                })
            },
            remove(index, row) {
                this.loading2 = true
                var that = this
                var params = new URLSearchParams()
                params.append('id', row.id)
                params.append('mid', row.mid)
                axios.post("/removeFollow", params).then(resp => {
                    console.log(resp)
                    that.loading2 = false
                    that.followData = resp.data.userInfos
                    if (resp.data.code == 0) {
                        that.$message.success("移除成功")
                    } else {
                        that.$message.warning("移除失败")
                    }
                })
            },
            cancel() {
                this.dialogFormVisible = false
                this.threadNumMax = 1
                this.followDataReal = {
                    mid: "",
                    name: "",
                    startFollow: "",
                    nowFollow: "",
                    startTimeStr: "",
                    startTimeStamp: "",
                    needFollowNum: 10,
                    threadNum: 1
                }
            },
            submitTask() {
                if (this.followDataReal.name != "") {
                    this.loading_text = "正在提交..."
                    this.loading = true
                    console.log(this.followDataReal)
                    var that = this
                    var params = new URLSearchParams()
                    params.append('mid', this.followDataReal.mid)
                    params.append('name', this.followDataReal.name)
                    params.append('startFollowNum', this.followDataReal.startFollow)
                    params.append('nowFollowNum', this.followDataReal.nowFollow)
                    params.append('needFollowNum', this.followDataReal.needFollowNum)
                    params.append('threadNum', this.followDataReal.threadNum)
                    params.append('taskType', "关注")
                    axios.post("/startFollow", params).then(resp => {
                        this.loading = false
                        console.log(resp)
                        if (resp.data.code == 0) {
                            that.$message.success("提交成功")
                            that.followDataReal = {
                                mid: "",
                                name: "",
                                startFollow: "",
                                nowFollow: "",
                                startTimeStr: "",
                                startTimeStamp: "",
                                needFollowNum: 10,
                                threadNum: 1
                            }
                            that.followData = resp.data.userInfos
                            that.dialogFormVisible = false
                            that.threadNumMax = 1
                        } else if (resp.data.code == 1) {
                            that.$message.warning("已经存在相同任务，请等待任务完成")
                            that.followData = resp.data.userInfos
                        } else if (resp.data.code == 2) {
                            that.$message.warning("暂无可用线程，请等待任务完成或停止某些任务")
                            that.followData = resp.data.userInfos
                        }
                    })
                } else {
                    this.$message.error("用户不存在，请核对用户id")
                }
            },
        },
        created() {
            this.updateTable()
        }
    }
</script>

<style scoped>

</style>
