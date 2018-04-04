<template>
<div class="app-container calendar-list-container">
  <div style="margin: 10px 0">
    <el-button type="primary" plain @click="handleCreate()">添加分类</el-button>
  </div>
<el-table :data="tableData" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">
  <el-table-column align="center" label="ID" :sort-method="changesort" sortable width="65">
    <template slot-scope="scope">
        <span>{{scope.row.id}}</span>
      </template>
  </el-table-column>
  <el-table-column min-width="130px" label="名称" align="center">
    <template slot-scope="scope">
        <span class="link-type">{{scope.row.name}}</span>
      </template>
  </el-table-column>
  <el-table-column min-width="160px" label="描述" align="center">
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

<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
  <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
    <el-form-item label="名称" prop="name">
      <el-input v-model="temp.name"></el-input>
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
import { getCategories, updateCategory, deleteCategory, createCategory } from '@/api/category'
export default {
  name: 'manage',
  data() {
    return {
      listLoading: false,
      total: null,
      dialogFormVisible: false,
      dialogStatus: '',
      tableData: [],
      textMap: {
        update: '编辑',
        create: '新增'
      },
      temp: {
        id: undefined,
        name: '',
        intro: ''
      },
      rules: {
        intro: [{ required: true, message: 'intro is required', trigger: 'blur' }],
        name: [{ required: true, message: 'name is required', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    changesort(a, b) {
      if (parseInt(a) > parseInt(b)) {
        return true
      } else {
        return false
      }
    },
    getData() {
      this.listLoading = false
      getCategories().then(response => {
        this.tableData = response.data.items
        this.listLoading = false
      })
    },
    restTemp() {
      this.temp = {
        id: undefined,
        name: '',
        intro: ''
      }
    },
    handleCreate() {
      this.restTemp()
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
          tempData.parent_id = 0
          createCategory(tempData).then((response) => {
            this.temp.id = response.data.id
            this.tableData.unshift(this.temp)
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
          updateCategory(tempData).then(() => {
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
        deleteCategory(this.temp.id).then(() => {
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
    }
  }
}
</script>
