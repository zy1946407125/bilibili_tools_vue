<template>
    <div>
        <h1>播放任务</h1>
        <div style="display: flex;flex-direction: row">
            <el-button type="primary" @click="addTask()" icon="el-icon-s-promotion">添加任务</el-button>
            <div style="width: 300px"></div>
            <el-input v-model="selectedBVID" clearable style="width: 300px" placeholder="请输入视频BV号"></el-input>
            <el-button type="primary" @click="filterBVData()" icon="el-icon-search">搜索</el-button>
        </div>
        <el-table
                v-loading="loading2"
                element-loading-text="正在刷新..."
                element-loading-spinner="el-icon-loading"
                :data="watchData"
                stripe
                style="width: 100%">
            <!--            <el-table-column-->
            <!--                    prop="id"-->
            <!--                    label="任务ID"-->
            <!--                    width="50">-->
            <!--            </el-table-column>-->
            <el-table-column align="center" type="index" width="60" label="序号">
                <template slot-scope="scope">
                    {{scope.$index + 1}}
                </template>
            </el-table-column>
            <el-table-column
                    prop="bvid"
                    label="视频ID"
                    width="130">
            </el-table-column>
            <el-table-column
                    prop="title"
                    label="标题"
                    width="150">
            </el-table-column>
            <el-table-column
                    prop="author"
                    label="作者"
                    width="110">
            </el-table-column>
            <el-table-column
                    prop="startWatchNum"
                    label="开始播放数"
                    width="110">
            </el-table-column>
            <el-table-column
                    prop="nowWatchNum"
                    label="当前播放数"
                    width="110">
            </el-table-column>
            <el-table-column
                    prop="needWatchNum"
                    label="下单数量"
                    width="110">
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
            <!--            <el-table-column-->
            <!--                    prop="taskTime"-->
            <!--                    label="任务时长"-->
            <!--                    width="80">-->
            <!--                <template slot-scope="scope">-->
            <!--                    <span>{{scope.row.taskTime}}分钟</span>-->
            <!--                </template>-->
            <!--            </el-table-column>-->
            <!--            <el-table-column-->
            <!--                    prop="threadNum"-->
            <!--                    label="线程数量"-->
            <!--                    width="80">-->
            <!--            </el-table-column>-->
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
        <el-dialog title="新增播放任务" :visible.sync="dialogFormVisible" :show-close="false">
            <el-form :model="BVDataReal" v-loading="loading"
                     :element-loading-text="loading_text"
                     element-loading-spinner="el-icon-loading">
                <el-form-item label="视频ID">
                    <el-input v-model="BVDataReal.bvid" autocomplete="off" @blur="selectBVData()"></el-input>
                </el-form-item>
                <el-form-item label="标题">
                    <el-input disabled v-model="BVDataReal.title" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="作者">
                    <el-input disabled v-model="BVDataReal.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="当前播放数">
                    <el-input disabled v-model="BVDataReal.startView" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="下单数量">
                    <el-input-number v-model="BVDataReal.needWatchNum" :min="100" :step="100"
                                     step-strictly>
                    </el-input-number>
                </el-form-item>
                <!--                <el-form-item label="线程数量">-->
                <!--                    <el-input-number v-model="BVDataReal.threadNum" :step="1" :min="threadNumMin" :max="threadNumMax"-->
                <!--                                     @change="updateThreadNum" step-strictly></el-input-number>-->
                <!--                    个-->
                <!--                </el-form-item>-->
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
        name: "Watch",
        data() {
            return {
                tableData: null,
                dialogFormVisible: false,
                taskTimeMin: 5,
                threadNumMin: 1,
                threadNumMax: 1,
                selectedBVID: "",
                BVDataReal: {
                    bvid: "",
                    title: "",
                    name: "",
                    startView: "",
                    nowView: "",
                    startLike: "",
                    nowLike: "",
                    startTimeStr: "",
                    startTimeStamp: "",
                    needWatchNum: 100,
                    threadNum: 1
                },
                loading_text: "",
                watchData: [],
                loading: false,
                loading2: false
            }
        },
        methods: {
            filterTag(value, row) {
                return row.tag === value;
            },
            filterBVData() {
                console.log(this.selectedBVID)
                var that = this
                axios.post('/getWatchBVInfoList').then(resp => {
                    console.log(resp)
                    if (that.selectedBVID == "") {
                        that.watchData = resp.data
                    } else {
                        let filterWatchData = []
                        for (let i = 0; i < resp.data.length; i++) {
                            if (resp.data[i].bvid == that.selectedBVID) {
                                filterWatchData.push(resp.data[i])
                            }
                        }
                        that.watchData = filterWatchData
                    }
                    console.log(that.watchData)
                })
            },
            cancel() {
                this.dialogFormVisible = false
                this.threadNumMax = 1
                this.BVDataReal = {
                    bvid: "",
                    title: "",
                    name: "",
                    startView: "",
                    nowView: "",
                    startLike: "",
                    nowLike: "",
                    startTimeStr: "",
                    startTimeStamp: "",
                    needWatchNum: 100,
                    threadNum: 1
                }
            },
            updateThreadNum() {
                if (this.BVDataReal.threadNum == this.threadNumMax) {
                    this.$message.warning("已达当前最大空闲线程数")
                }
            },
            updateTable() {
                var that = this
                axios.post('/getWatchBVInfoList').then(resp => {
                    console.log(resp)
                    that.watchData = resp.data
                })
            },
            stop(index, row) {
                console.log(row)
                this.loading2 = true
                var that = this
                var params = new URLSearchParams()
                params.append('id', row.id)
                params.append('bvid', row.bvid)
                axios.post("/stopWatch", params).then(resp => {
                    console.log(resp)
                    that.loading2 = false
                    that.watchData = resp.data.bvInfos
                    if (resp.data.code == 0) {
                        that.$message.success("停止成功")
                    } else {
                        that.$message.warning("停止失败")
                    }
                })
            },
            remove(index, row) {
                this.loading2 = true
                var that = this
                var params = new URLSearchParams()
                params.append('id', row.id)
                params.append('bvid', row.bvid)
                axios.post("/removeWatch", params).then(resp => {
                    console.log(resp)
                    that.loading2 = false
                    that.watchData = resp.data.bvInfos
                    if (resp.data.code == 0) {
                        that.$message.success("移除成功")
                    } else {
                        that.$message.warning("移除失败")
                    }
                })
            },
            // refresh(row) {
            //     console.log(row)
            //     this.loading2 = true
            //     var that = this
            //     var params = new URLSearchParams()
            //     params.append('bvid', row.bvid)
            //     axios.post("/refresh", params).then(resp => {
            //         that.loading2 = false
            //         console.log(resp)
            //         if (resp.data.code == 0) {
            //             row.bvid = resp.data.data.bvid
            //             row.title = resp.data.data.title
            //             row.name = resp.data.data.owner.name
            //             row.nowView = resp.data.data.stat.view
            //             row.nowLike = resp.data.data.stat.like
            //             console.log(that.watchData)
            //             localStorage.setItem("watchData", JSON.stringify(that.watchData))
            //         } else {
            //             that.$message.error("错误代码：" + resp.data.code + "    错误内容：" + resp.data.message)
            //         }
            //     })
            // },
            selectBVData() {
                if (this.BVDataReal.bvid != "") {
                    this.loading_text = "正在查询..."
                    this.loading = true
                    var that = this
                    var params = new URLSearchParams()
                    params.append('bvid', this.BVDataReal.bvid)
                    axios.post("/getBVInfo", params).then(resp => {
                        that.loading = false
                        console.log(resp)
                        if (resp.data.bvinfo.code == 0) {
                            that.BVDataReal.bvid = resp.data.bvinfo.data.bvid
                            that.BVDataReal.title = resp.data.bvinfo.data.title
                            that.BVDataReal.name = resp.data.bvinfo.data.owner.name
                            that.BVDataReal.startView = resp.data.bvinfo.data.stat.view
                            that.BVDataReal.startLike = resp.data.bvinfo.data.stat.like
                            that.BVDataReal.nowView = resp.data.bvinfo.data.stat.view
                            that.BVDataReal.nowLike = resp.data.bvinfo.data.stat.like
                            that.threadNumMax = resp.data.watchThreadNum
                        } else {
                            that.$message.error("错误代码：" + resp.data.code + "    错误内容：" + resp.data.message)
                        }
                    })
                }
            },
            addTask() {
                this.dialogFormVisible = true
            },
            submitTask() {
                if (this.BVDataReal.title != "") {
                    this.loading_text = "正在提交..."
                    this.loading = true
                    // this.BVDataReal.startTimeStamp = parseInt(new Date().getTime() / 1000)
                    // this.BVDataReal.startTimeStr = this.getTimeStr(this.BVDataReal.startTimeStamp)
                    console.log(this.BVDataReal)
                    var that = this
                    var params = new URLSearchParams()
                    params.append('bvid', this.BVDataReal.bvid)
                    params.append('title', this.BVDataReal.title)
                    params.append('author', this.BVDataReal.name)
                    params.append('startWatchNum', this.BVDataReal.startView)
                    params.append('startLikeNum', this.BVDataReal.startLike)
                    params.append('nowWatchNum', this.BVDataReal.nowView)
                    params.append('nowLikeNum', this.BVDataReal.nowLike)
                    params.append('needWatchNum', this.BVDataReal.needWatchNum)
                    params.append('threadNum', this.BVDataReal.threadNum)
                    params.append('taskType', "播放")
                    axios.post("/startWatch", params).then(resp => {
                        this.loading = false
                        console.log(resp)
                        if (resp.data.code == 0) {
                            that.$message.success("提交成功")
                            that.BVDataReal = {
                                bvid: "",
                                title: "",
                                name: "",
                                startView: "",
                                nowView: "",
                                startLike: "",
                                nowLike: "",
                                startTimeStr: "",
                                startTimeStamp: "",
                                needWatchNum: 100,
                                threadNum: 1
                            }
                            that.watchData = resp.data.bvInfos
                            that.dialogFormVisible = false
                            that.threadNumMax = 1
                        } else if (resp.data.code == 1) {
                            that.$message.warning("已经存在相同任务，请等待任务完成")
                            that.watchData = resp.data.bvInfos
                        } else if (resp.data.code == 2) {
                            that.$message.warning("暂无可用线程，请等待任务完成或停止某些任务")
                            that.watchData = resp.data.bvInfos
                        }
                    })
                } else {
                    this.$message.error("视频不存在，请核对BV号")
                }
            },
        },
        created() {
            this.updateTable()
        },
    }
</script>

<style scoped>

</style>
