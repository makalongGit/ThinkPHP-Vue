<template>
<div class="app-container calendar-list-container">
  <div class="filter-container" style="padding-bottom:10px">
    <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="名称查询" v-model="listQuery.title">
    </el-input>
    <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.type" placeholder="类型">
      <el-option v-for="item in  categoryOptions" :key="item.id" :label="item.name" :value="item.id">
      </el-option>
    </el-select>
    <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.status" placeholder="状态">
      <el-option key="0" label="不外借" value="0"></el-option>
      <el-option key="1" label="可外借" value="1"></el-option>
    </el-select>
    <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
  </div>
  <el-table :data="tableData" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">
    <el-table-column align="center" label="ID" width="65">
      <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
    </el-table-column>
    <el-table-column  label="名称" align="center">
      <template slot-scope="scope">
          <span class="link-type">{{scope.row.name}}</span>
        </template>
    </el-table-column>
    <el-table-column  label="型号" align="center" width="100">
      <template slot-scope="scope">
          <span class="link-type">{{scope.row.model}}</span>
        </template>
    </el-table-column>
    <el-table-column label="数量" align="center" width="90">
      <template slot-scope="scope">
          <span class="link-type">{{scope.row.num}}</span>
        </template>
    </el-table-column>
    <el-table-column  label="描述" align="center">
      <template slot-scope="scope">
          <span class="link-type">{{scope.row.intro}}</span>
        </template>
    </el-table-column>
    <el-table-column class-name="status-col" label="状态" width="90" align="center">
      <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter" >{{scope.row.status | wordFilter}}</el-tag>
        </template>
    </el-table-column>
    <el-table-column align="center" label="操作"  class-name="small-padding fixed-width">
      <template slot-scope="scope">
          <el-button v-if="scope.row.status===1" type="primary" size="mini" @click="handleLoan(scope.row)">租借</el-button>
          <el-button type="primary" size="mini" @click="handleRepair(scope.row)">报修</el-button>
        </template>
    </el-table-column>
  </el-table>
  <div class="pagination-container">
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[5,10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
  </div>
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible1">
    <el-form :rules="rules" ref="dataForm1" :model="temp" label-position="left" label-width="90px" style='width: 450px; margin-left:50px;'>
      <el-form-item label="租借日期" prop="borrow_date">
        <el-date-picker v-model="temp.borrow_date" type="date" placeholder="租借日期" format="yyyy 年 MM 月 dd 日"
      value-format="yyyy-MM-dd" :picker-options="pickerBrrowOptions"></el-date-picker>
      </el-form-item>
      <el-form-item label="归还日期" prop="return_date">
      <el-date-picker v-model="temp.return_date" type="date" placeholder="归还日期" format="yyyy 年 MM 月 dd 日"
    value-format="yyyy-MM-dd" :picker-options="pickerReturnOptions"></el-date-picker>
      </el-form-item>

      <el-form-item label="数量" prop="count">
        <el-input-number size="small" v-model="temp.count" :min="1"></el-input-number>
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
        <el-input v-model="temp.phone" clearable style="width:170px"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="detail">
        <el-input type="textarea" v-model="temp.detail"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button type="primary" @click="sendLoan">提交</el-button>
    </div>
  </el-dialog>
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible2">
    <el-form :rules="rules" ref="dataForm2" :model="temp1" label-position="left" label-width="90px" style='width: 450px; margin-left:50px;'>
      <el-form-item label="设备编号" prop="model">
        <el-input  v-model="temp1.model"> <template slot="prepend">{{temp1.dev_name}}</template></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="detail">
        <el-input type="textarea" v-model="temp1.detail"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible2 = false">取消</el-button>
      <el-button type="primary" @click="sendRepair">提交</el-button>
    </div>
  </el-dialog>
</div>
</template>
<script>
import { fetchList } from '@/api/equipment'
import { createLoan } from '@/api/circulate'
import { getCategories } from '@/api/category'
import { createRepair } from '@/api/repair'
import waves from '@/directive/waves' // 水波纹指令
export default {
  name: 'loan',
  directives: {
    waves
  },
  data() {
    return {
      listLoading: true,
      total: null,
      dialogStatus: '',
      dialogFormVisible1: false,
      dialogFormVisible2: false,
      categoryOptions: [],
      textMap: {
        booking: '预约',
        repair: '报修'
      },

      temp: {
        dev_id: null,
        borrow_date: '',
        return_date: '',
        count: '',
        detail: '',
        phone: ''
      },
      temp1: {
        dev_name: '',
        dev_id: null,
        detail: '',
        model: ''
      },
      pickerBrrowOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        }
      },
      pickerReturnOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        }
      },
      rules: {
        title: [{ required: true, message: 'title is required', trigger: 'blur' }],
        borrow_date: [{ required: true, message: 'borrow_date is required', trigger: 'change' }],
        return_date: [{ required: true, message: 'return_date is required', trigger: 'change' }],
        phone: [
          { required: true, message: 'phoneis required', trigger: 'blur' },
          { pattern: /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/, message: 'phone invalid', trigger: 'blur' }
        ],
        detail: [{ required: true, message: 'detail is required', trigger: 'blur' }],
        model: [{ required: true, message: 'model is required', trigger: 'blur' }]
      },
      listQuery: {
        page: 1,
        limit: 10,
        title: '',
        type: '',
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
        '1': '可外借',
        '0': '不外借'
      }
      return statusMap[status]
    }
  },
  created() {
    this.getData()
    this.getCateData()
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
    getCateData() {
      getCategories().then(response => {
        this.categoryOptions = response.data.items
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
    handleRepair(row) {
      this.resetTemp()
      this.temp1.dev_id = row.id
      this.temp1.dev_name = row.name
      this.dialogStatus = 'repair'
      this.dialogFormVisible2 = true
      this.$nextTick(() => {
        this.$refs['dataForm2'].clearValidate()
      })
    },
    sendRepair() {
      this.$refs['dataForm2'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp1)
          createRepair(tempData).then(() => {
            this.dialogFormVisible2 = false
            this.$notify({
              title: '成功',
              message: '报修成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleLoan(row) {
      this.resetTemp()
      this.temp.dev_id = row.id
      this.dialogStatus = 'booking'
      this.dialogFormVisible1 = true
      this.$nextTick(() => {
        this.$refs['dataForm1'].clearValidate()
      })
    },
    sendLoan() {
      this.$refs['dataForm1'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          createLoan(tempData).then(() => {
            this.dialogFormVisible1 = false
            this.$notify({
              title: '成功',
              message: '租借成功，等待审核',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },

    resetTemp() {
      this.temp = {
        lab_id: null,
        title: '',
        order_date: '',
        num: '',
        detail: '',
        phone: ''
      }
      this.temp1 = {
        dev_name: '',
        dev_id: null,
        detail: '',
        model: ''
      }
    }
  }
}
</script>
