<template>
<div class="app-container calendar-list-container">
  <div class="filter-container" style="padding-bottom:10px">
    <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="名称查询" v-model="listQuery.title">
    </el-input>
    <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.status" placeholder="状态">
      <el-option key="0" label="未审核" value="0"></el-option>
      <el-option key="1" label="已通过" value="1"></el-option>
      <el-option key="2" label="未通过" value="2"></el-option>
    </el-select>
    <el-date-picker v-model="listQuery.borrow_date" type="date" placeholder="借用日期" format="yyyy 年 MM 月 dd 日"
  value-format="yyyy-MM-dd"></el-date-picker>
  <el-date-picker v-model="listQuery.return_date" type="date" placeholder="归还日期" format="yyyy 年 MM 月 dd 日"
value-format="yyyy-MM-dd"></el-date-picker>
    <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
  </div>
  <el-table :data="tableData" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">
    <el-table-column align="center" label="ID" width="65">
      <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
    </el-table-column>
    <el-table-column  label="设备" align="center">
      <template slot-scope="scope">
          <span class="link-type">{{scope.row.device.name}}</span>
        </template>
    </el-table-column>
    <el-table-column  align="center" label="申请时间">
      <template slot-scope="scope">
          <span>{{scope.row.create_time}}</span>
        </template>
    </el-table-column>
    <el-table-column  align="center" label="借用时间">
      <template slot-scope="scope">
          <span>{{scope.row.borrow_date}} ~ {{scope.row.return_date}}</span>
        </template>
    </el-table-column>
    <el-table-column class-name="status-col" label="状态" width="90" align="center">
      <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter" >{{scope.row.status | wordFilter}}</el-tag>
        </template>
    </el-table-column>
    <el-table-column align="center" label="操作"  class-name="small-padding fixed-width">
      <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="information(scope.row)" >详情</el-button>
        </template>
    </el-table-column>
  </el-table>
  <div class="pagination-container">
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[5,10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
  </div>
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    <el-form  ref="dataForm" :model="temp" label-position="left" label-width="90px" style='width: 450px; margin-left:50px;'>
      <el-form-item label="设备:">{{temp.dev_name}}-{{temp.model}}</el-form-item>
      <el-form-item label="借还日期:">{{temp.borrow_date}} ~ {{temp.return_date}}
      </el-form-item>
      <el-form-item label="个数:" > {{temp.count}} </el-form-item>
      <el-form-item label="联系电话:" > {{temp.phone}} </el-form-item>
      <el-form-item label="备注:">{{temp.detail}}</el-form-item>
      <el-form-item label="审核结果:">{{temp.status | wordFilter }}</el-form-item>
      <el-form-item label="审核说明:" prop="reason">{{temp.reason}}</el-form-item>
    </el-form>
  </el-dialog>
</div>
</template>
<style lang="css" scoped>
  .el-form{
    width: 450px;
    margin-left:50px;
  }
  .el-form-item{
    margin-bottom: 0px;
  }
</style>
<script>
import { fetchMyBook } from '@/api/circulate'
import waves from '@/directive/waves' // 水波纹指令
export default {
  name: 'auditing',
  directives: {
    waves
  },
  data() {
    return {
      listLoading: true,
      total: null,
      dialogStatus: '',
      dialogFormVisible: false,
      textMap: {
        booking: '审核',
        imformation: '详情'
      },
      temp: {
        user_name: '',
        dev_name: '',
        borrow_date: '',
        return_date: '',
        count: null,
        detail: '',
        id: null,
        status: 1,
        reason: ''
      },
      listQuery: {
        page: 1,
        limit: 10,
        status: '',
        return_date: '',
        borrow_date: ''
      },
      tableData: []
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: 'info',
        1: 'success',
        2: 'danger'
      }
      return statusMap[status]
    },
    wordFilter(status) {
      const statusMap = {
        0: '审核中',
        1: '已通过',
        2: '未通过'
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
      fetchMyBook(this.listQuery).then(response => {
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
    handleFilter() {
      this.listQuery.page = 1
      this.getData()
    },
    information(row) {
      this.temp = {
        phone: row.phone,
        dev_name: row.device.name,
        borrow_date: row.borrow_date,
        return_date: row.return_date,
        count: row.count,
        detail: row.detail,
        id: row.id,
        status: row.status,
        reason: row.reason,
        model: row.device.model
      }
      this.dialogFormVisible = true
      this.dialogStatus = 'information'
    }
  }
}
</script>
