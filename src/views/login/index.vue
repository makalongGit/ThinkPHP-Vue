<template>
<div class="login-container">
  <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="0px" class="card-box login-form">
    <h3 class="title">高校实验室管理系统</h3>
    <el-form-item prop="username">
      <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
      <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="username" />
    </el-form-item>
    <el-form-item prop="password">
      <span class="svg-container">
          <svg-icon icon-class="password"></svg-icon>
        </span>
      <el-input name="password" :type="pwdType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on" placeholder="password"></el-input>
      <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye" /></span>
    </el-form-item>
    <el-form-item prop="loginType">
      <span class="svg-container svg-container_loginType">
        </span>
      <el-radio-group v-model="loginForm.loginType" @change="changeType">
        <el-radio label="1">student</el-radio>
        <el-radio label="2">teacher</el-radio>
        <el-radio label="3">admin</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
        Sign in
      </el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
export default {
  name: 'login',
  data() {
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码不能小于5位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '142011059',
        password: '123123',
        loginType: '1'
      },
      loginRules: {
        username: [{
          required: true,
          trigger: 'blur'
        }],
        password: [{
          required: true,
          trigger: 'blur',
          validator: validatePass
        }]
      },
      loading: false,
      pwdType: 'password'
    }
  },
  methods: {
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    changeType(value) {
      if (value === '3') {
        this.loginForm.username = '110'
        this.loginForm.password = 'admin'
      }
      if (value === '1') {
        this.loginForm.username = '142011059'
        this.loginForm.password = '123123'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('Login', this.loginForm).then(() => {
            this.loading = false
            this.$router.push({
              path: '/'
            })
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
    position: fixed;
    height: 100%;
    width: 100%;
    background-color: $bg;
    input:-webkit-autofill {
        -webkit-box-shadow: 0 0 0 1000px #293444 inset !important;
        -webkit-text-fill-color: #fff !important;
    }
    input {
        background: transparent;
        border: 0;
        -webkit-appearance: none;
        border-radius: 0;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
    }
    .el-input {
        display: inline-block;
        height: 47px;
        width: 85%;
    }
    .tips {
        font-size: 14px;
        color: #fff;
        margin-bottom: 10px;
    }
    .svg-container {
        padding: 6px 5px 6px 15px;
        color: $dark_gray;
        vertical-align: middle;
        width: 30px;
        display: inline-block;
        &_login {
            font-size: 20px;
        }
    }
    .title {
        font-size: 26px;
        font-weight: 400;
        color: $light_gray;
        margin: 0 auto 40px;
        text-align: center;
        font-weight: bold;
    }
    .login-form {
        position: absolute;
        left: 0;
        right: 0;
        width: 400px;
        padding: 35px 35px 15px;
        margin: 120px auto;
    }
    .el-form-item {
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        color: #454545;
    }
    .show-pwd {
        position: absolute;
        right: 10px;
        top: 7px;
        font-size: 16px;
        color: $dark_gray;
        cursor: pointer;
        user-select: none;
    }
    .thirdparty-button {
        position: absolute;
        right: 35px;
        bottom: 28px;
    }
}
</style>
