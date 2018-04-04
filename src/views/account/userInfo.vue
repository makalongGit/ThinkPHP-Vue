<template>
<div class="app-container calendar-list-container">
  <div class="filter-container" style="padding-bottom:10px">
    <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="名称查询" v-model="listQuery.title">
    </el-input>
    <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="学号查询" v-model="listQuery.student_id">
    </el-input>
    <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
    <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">新增</el-button>
    <el-button class="filter-item" type="primary" :loading="downloadLoading" v-waves icon="el-icon-download" @click="handleDownload">导出</el-button>
  </div>
  <el-table :data="tableData" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">
    <el-table-column align="center" label="学号" >
      <template slot-scope="scope">
          <span>{{scope.row.uid}}</span>
        </template>
    </el-table-column>
    <el-table-column  label="名称" align="center">
      <template slot-scope="scope">
          <span class="link-type">{{scope.row.uname}}</span>
        </template>
    </el-table-column>
    <el-table-column  label="性别" align="center" width="100">
      <template slot-scope="scope">
          <span class="link-type">{{scope.row.sex | sexFilter}}</span>
        </template>
    </el-table-column>
    <el-table-column  label="描述" align="center">
      <template slot-scope="scope">
          <span class="link-type">{{scope.row.intro}}</span>
        </template>
    </el-table-column>
    <el-table-column align="center" label="操作"  class-name="small-padding fixed-width">
      <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
    </el-table-column>
  </el-table>
  <div class="pagination-container">
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[5,10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
  </div>
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="90px" style='width: 450px; margin-left:50px;'>
      <el-form-item label="学号" prop="uid">
        <el-input v-model="temp.uid"></el-input>
      </el-form-item>
      <el-form-item label="名称" prop="uname">
        <el-input v-model="temp.uname"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="sex" v-if="dialogStatus=='create'">
        <el-switch  v-model="temp.sex" active-text="男"  inactive-text="女" active-color="#13ce66" inactive-color="#ff4949" active-value="1"
      inactive-value="0">
        </el-switch>
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
import { fetchList, updateAccount } from '@/api/account'
import waves from '@/directive/waves' // 水波纹指令
export default {
  name: 'manage',
  directives: {
    waves
  },
  data() {
    return {
      listLoading: true,
      total: null,
      dialogStatus: '',
      dialogFormVisible: false,
      categoryOptions: [],
      textMap: {
        update: '编辑',
        create: '新增'
      },
      temp: {
        uname: '',
        intro: '',
        uid: null,
        sex: 1
      },
      rules: {
        intro: [{ required: true, message: 'intro is required', trigger: 'blur' }],
        uname: [{ required: true, message: 'name is required', trigger: 'blur' }],
        uid: [{ required: true, message: 'uid is required', trigger: 'blur' }],
      },
      downloadLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
        title: '',
        sex: '',
        uid: '',
        type: ''
      },
      tableData: []
    }
  },
  created() {
    this.getData()
  },
  filters: {
    sexFilter(status) {
      const statusMap = {
        '1': '男',
        '0': '女'
      }
      return statusMap[status]
    },
  },
  methods: {
    getData() {
      this.listLoading = true
      this.listQuery.type = 1
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
          createDevice(tempData).then((response) => {
            this.temp.id = response.data.id
            this.getData()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      delete this.temp.last_login_time
      delete this.temp.scope
      this.temp.type = 1
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
          console.log(this.temp)
          updateAccount(tempData).then(() => {
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
    handleDelete(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.$confirm('删除 ' + this.temp.name + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDevice(this.temp.id).then(() => {
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
        const tHeader = ['名称', '学号', '性别', '介绍']
        const filterVal = ['uname', 'uid', 'sex', 'intro']
        const data = this.formatJson(filterVal, this.tableData)
        excel.export_json_to_excel(tHeader, data, '学生数据')
        this.downloadLoading = false
      })
    },
    // 格式化
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'sex') {
          return this.$options.filters['sexFilter'](v[j])
        }
        return v[j]
      }))
    },
    resetTemp() {
      this.temp = {
        uname: '',
        intro: '',
        uid: null,
        sex: 1
      }
    }
  }
}
</script>
