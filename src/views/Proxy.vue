<template>
    <div>
        <h1>代理配置</h1>
        <el-form :model="ruleForm" status-icon ref="ruleForm" label-width="100px" class="demo-ruleForm"
                 v-loading="loading">
            <el-form-item label="代理账号" prop="proxyUser">
                <el-input v-model="ruleForm.proxyUser" autocomplete="off" style="width: 800px"></el-input>
            </el-form-item>
            <el-form-item label="代理密码" prop="proxyPass">
                <el-input v-model="ruleForm.proxyPass" autocomplete="off" style="width: 800px"></el-input>
            </el-form-item>
            <el-form-item label="代理地址" prop="proxyHost">
                <el-input v-model="ruleForm.proxyHost" autocomplete="off" style="width: 800px"></el-input>
            </el-form-item>
            <el-form-item label="代理端口" prop="proxyPort">
                <el-input type="number" v-model="ruleForm.proxyPort" autocomplete="off" style="width: 800px"></el-input>
            </el-form-item>
            <el-form-item label="代理状态" prop="proxyOpen">
                <el-radio v-model="ruleForm.proxyOpen" label="1">开启</el-radio>
                <el-radio v-model="ruleForm.proxyOpen" label="2">关闭</el-radio>
            </el-form-item>
        </el-form>
        <el-button @click="updateProxyInfo()">更新</el-button>
    </div>
</template>

<script>
    export default {
        name: "Proxy",
        data() {
            return {
                ruleForm: {
                    proxyUser: "",
                    proxyPass: "",
                    proxyHost: "",
                    proxyPort: "",
                    proxyOpen: ""
                },
                loading: false
            }
        },
        methods: {
            updateProxyInfo() {
                console.log(this.ruleForm)
                if (this.ruleForm.proxyUser == "" || this.ruleForm.proxyPass == "" || this.ruleForm.proxyHost == "" || this.ruleForm.proxyPort == "" || this.ruleForm.proxyOpen == "") {
                    this.$message.error("请输入完整信息")
                } else {
                    this.loading = true
                    var that = this
                    var params = new URLSearchParams()
                    params.append('proxyUser', this.ruleForm.proxyUser)
                    params.append('proxyPass', this.ruleForm.proxyPass)
                    params.append('proxyHost', this.ruleForm.proxyHost)
                    params.append('proxyPort', this.ruleForm.proxyPort)
                    if (this.ruleForm.proxyOpen == "1") {
                        params.append('proxyOpen', "true")
                    } else {
                        params.append('proxyOpen', "false")
                    }
                    axios.post("/updateProxyInfo", params).then(resp => {
                        console.log(resp)
                        that.loading = false
                        if (resp.data.code == 0) {
                            that.$message.success("更新成功")
                        } else {
                            that.$message.error("更新失败")
                        }
                    })
                }
            }
        },
        created() {
            var that = this
            that.loading = true
            axios.post("/getProxyInfo").then(resp => {
                console.log(resp)
                that.loading = false
                if (resp.data.code == 0) {
                    that.ruleForm.proxyUser = resp.data.data.proxyUser
                    that.ruleForm.proxyPass = resp.data.data.proxyPass
                    that.ruleForm.proxyHost = resp.data.data.proxyHost
                    that.ruleForm.proxyPort = resp.data.data.proxyPort
                    that.ruleForm.proxyOpen = resp.data.data.proxyOpen == true ? "1" : "2"
                } else {
                    that.$message.error("获取代理配置信息失败")
                }
            })
        }
    }
</script>

<style scoped>

</style>
