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
      <el-option key="0" label="未开放" value="0"></el-option>
      <el-option key="1" label="开放中" value="1"></el-option>
    </el-select>
    <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
    <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">新增</el-button>
    <el-button class="filter-item" type="primary" :loading="downloadLoading" v-waves icon="el-icon-download" @click="handleDownload">导出</el-button>
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
          <el-tag>{{scope.row.category.name}}</el-tag>
        </template>
    </el-table-column>
    <el-table-column  label="描述" align="center">
      <template slot-scope="scope">
          <span class="link-type">{{scope.row.intro}}</span>
        </template>
    </el-table-column>
    <el-table-column  align="center" label="开放时间">
      <template slot-scope="scope">
          <span>{{scope.row.start_time}} - {{scope.row.end_time}}</span>
        </template>
    </el-table-column>
    <el-table-column class-name="status-col" label="状态" width="90" align="center">
      <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter" >{{scope.row.status | wordFilter}}</el-tag>
        </template>
    </el-table-column>
    <el-table-column align="center" label="操作"  class-name="small-padding fixed-width">
      <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-if="scope.row.status!=1" size="mini" type="success" @click="handleModifyStatus(scope.row,'开放中')">开放
          </el-button>
          <el-button v-if="scope.row.status!=0" size="mini" type="info" @click="handleModifyStatus(scope.row,'未开放')">禁止
          </el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
    </el-table-column>
  </el-table>
  <div class="pagination-container">
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[5,10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
  </div>
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :key='tableKey'>
    <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="90px" style='width: 450px; margin-left:50px;'>
      <el-form-item label="名称" prop="name">
        <el-input v-model="temp.name"></el-input>
      </el-form-item>
       <el-form-item label="类型" prop="cate_id">
        <el-select class="filter-item" v-model="temp.cate_id" placeholder="Please select" clearable @change="getCateName()">
          <el-option v-for="item in  categoryOptions" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="dialogStatus=='create'"label="是否开放" prop="status">
        <el-switch v-model="temp.status" active-color="#13ce66" inactive-color="#ff4949" active-value="1" inactive-value="0">
        </el-switch>
      </el-form-item>
      <el-form-item label="开发时间段" prop="time_slot">
        <el-time-select placeholder="起始时间" prop="start_time" style="width:170px" v-model="temp.start_time" :picker-options="{start: '08:30', step: '00:15', end: '22:30'}">
        </el-time-select>
        <el-time-select placeholder="关闭时间" prop="end_time" style="width:170px" v-model="temp.end_time" :picker-options="{start: '08:30', step: '00:15', end: '22:30', minTime: temp.start_time }" >
        </el-time-select>
      </el-form-item>
      <el-form-item label="描述" prop="intro">
        <el-input type="textarea" autosize placeholder="请输入内容" v-model="temp.intro"></el-input>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">创建</el-button>
      <el-button v-else type="primary" @click="updateData">更新</el-button>
    </div>
  </el-dialog>
</div>
</template>
<script>
import { fetchList, modifyStatus, createLaboratory, updateLaboratory, deleteLaboratory } from '@/api/laboratory'
import { getCategories } from '@/api/category'
import waves from '@/directive/waves' // 水波纹指令
export default {
  name: 'manage',
  directives: {
    waves
  },
  data() {
    return {
      listLoading: true,
      tableKey: 0,
      total: null,
      dialogStatus: '',
      dialogFormVisible: false,
      categoryOptions: [],
      showReviewer: false,
      textMap: {
        update: '编辑',
        create: '新增'
      },
      temp: {
        name: '',
        cate_id: '',
        category: {
          name: ''
        },
        intro: '',
        start_time: '',
        end_time: '',
        status: null
      },
      rules: {
        intro: [{ required: true, message: 'intro is required', trigger: 'blur' }],
        name: [{ required: true, message: 'name is required', trigger: 'blur' }],
        cate_id: [{ type: 'number', require: true, message: 'type is required', trigger: 'change' }],
        startTime: [{ require: true, message: 'startTime is required', trigger: 'blur' }],
        endTime: [{ require: true, message: 'endTime is required', trigger: 'blur' }]
      },
      downloadLoading: false,
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
    wordFilter(status) {
      const statusMap = {
        '1': '开放中',
        '0': '未开放'
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
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          createLaboratory(tempData).then((response) => {
            this.temp.id = response.data.id
            this.tableData.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          }, (response) => {
            console.log(response)
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          console.log(tempData)
          delete tempData.category
          updateLaboratory(tempData).then(() => {
            for (const v of this.tableData) {
              if (v.id === this.temp.id) {
                const index = this.tableData.indexOf(v)
                this.tableData.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
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
    handleDelete(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.$confirm('删除 ' + this.temp.name + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteLaboratory(this.temp.id).then(() => {
          for (const v of this.tableData) {
            if (v.id === this.temp.id) {
              const index = this.tableData.indexOf(v)
              this.tableData.splice(index, 1)
              break
            }
          }
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }, () => {
          this.$message({
            type: 'error',
            message: '删除失败，请重试!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getData()
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['分类', '名称', '介绍', '开放时间', '结束时间', '状态']
        const filterVal = ['cate_name', 'name', 'intro', 'start_time', 'end_time', 'status']
        const data = this.formatJson(filterVal, this.tableData)
        excel.export_json_to_excel(tHeader, data, '实验室数据')
        this.downloadLoading = false
      })
    },
    // 格式化
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'status') {
          return this.$options.filters['wordFilter'](v[j])
        }
        if (j === 'cate_name') {
          return v['category']['name']
        }
        return v[j]
      }))
    },
    getCateName() {
      const cate_id = this.temp.cate_id
      let obj = {}
      obj = this.categoryOptions.find(item => {
        return item.id === cate_id
      })
      this.temp.category.name = obj.name
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getData()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getData()
    },
    resetTemp() {
      this.temp = {
        name: '',
        cate_id: '',
        category: {
          name: ''
        },
        intro: '',
        start_time: '',
        end_time: '',
        status: null
      }
    }
  }
}
</script>
