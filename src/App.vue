<template>
  <div id="app">
    <el-container style="height: 960px; border: 1px solid #eee">
      <el-aside width="150px" style="background-color: rgb(238, 241, 246)">
        <el-menu :default-openeds="['1', '2']" router>
          <el-submenu index="1">
            <template slot="title"><i class="el-icon-s-claim"></i>任务列表</template>
            <el-menu-item index="/watch">播放任务</el-menu-item>
            <el-menu-item index="/like">点赞任务</el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title"><i class="el-icon-s-tools"></i>配置中心</template>
            <el-menu-item index="/proxy">代理设置</el-menu-item>
            <el-menu-item index="/account">小号设置</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header style="text-align: center; font-size: 30px">
          <span>哔哩哔哩工具箱</span>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  export default {
  };
</script>

<style>
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }

  .el-aside {
    color: #333;
  }
</style>
