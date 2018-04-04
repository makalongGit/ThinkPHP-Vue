<template>
<div class="app-container calendar-list-container">
  <div class="filter-container" style="padding-bottom:10px">

    <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.status" placeholder="状态">
      <el-option key="1" label="已维修" value="1"></el-option>
      <el-option key="0" label="未维修" value="0"></el-option>
    </el-select>
    <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
  </div>
  <el-table :data="tableData" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">
    <el-table-column align="center" label="ID" width="65">
      <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
    </el-table-column>
    <el-table-column  label="设备名称" align="center">
      <template slot-scope="scope">
          <span class="link-type">{{scope.row.device.name}}</span>
        </template>
    </el-table-column>
    <el-table-column  label="编号" align="center" width="100">
      <template slot-scope="scope">
          <span class="link-type">{{scope.row.model}}</span>
        </template>
    </el-table-column>
    <el-table-column  label="报修人" align="center" width="100">
      <template slot-scope="scope">
          <span class="link-type">{{scope.row.account.uname}}</span>
        </template>
    </el-table-column>
    <el-table-column  label="故障描述" align="center">
      <template slot-scope="scope">
          <span class="link-type">{{scope.row.detail}}</span>
        </template>
    </el-table-column>
    <el-table-column class-name="status-col" label="状态" width="90" align="center">
      <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter" >{{scope.row.status | wordFilter}}</el-tag>
        </template>
    </el-table-column>
    <el-table-column align="center" label="操作"  class-name="small-padding fixed-width">
      <template slot-scope="scope">
          <el-button v-if="scope.row.status!='1'" size="mini" type="success" @click="handleModifyStatus(scope.row)">已维修
          </el-button>
        </template>
    </el-table-column>
  </el-table>
  <div class="pagination-container">
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[5,10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
  </div>
</div>
</template>
<script>
import { fetchList, modifyStatus } from '@/api/repair'
import waves from '@/directive/waves' // 水波纹指令
export default {
  name: 'repair',
  directives: {
    waves
  },
  data() {
    return {
      listLoading: true,
      total: null,
      listQuery: {
        page: 1,
        limit: 10,
        status: ''
      },
      tableData: []
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '1': 'success',
        '0': 'danger'
      }
      return statusMap[status]
    },
    WordFilter(status) {
      const statusMap = {
        '1': '已维修',
        '0': '待维修'
      }
      return statusMap[status]
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.tableData = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getData()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getData()
    },
    handleModifyStatus(row) {
      modifyStatus(row.id).then((response) => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        row.status = response.data.status
      }, () => {
        this.$message({
          message: '操作失败,请重试',
          type: 'warning'
        })
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getData()
    }
  }
}
</script>
