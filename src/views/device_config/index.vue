<template>
  <el-card class="box-card">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
      <el-form-item label="设备UUID" prop="dev_uuid">
        <el-input v-model="ruleForm.dev_uuid" size="medium" style="width:40%" clearable />
        <el-button type="primary" plain style="padding:10px 20px" @click="on_create_uuid">生成</el-button>
      </el-form-item>
      <el-form-item label="运营商" prop="isp">
        <el-select v-model="ruleForm.isp" clearable placeholder="请选择运营商">
          <el-option
            v-for="item in configs.isps"
            :key="item.isp_id"
            :label="item.isp_name"
            :value="item.isp_id"
            style="width: 200px"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="省份" prop="province">
        <el-select v-model="ruleForm.province" clearable placeholder="请选择省份">
          <el-option
            v-for="item in configs.provinces"
            :key="item.province_id"
            :label="item.province_name"
            :value="item.province_id"
            style="width: 200px"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { v4 as uuidv4 } from 'uuid'

import {
  get_query_configs
} from '@/api/device_manager/device_manager'

export default {
  name: 'DeviceConfig',
  data() {
    return {
      ruleForm: {
        dev_uuid: '',
        isp: '',
        province: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      configs: {
        isps: null,
        provinces: null
      },
      rules: {
        dev_uuid: [
          { required: true, message: '请生成UUID', trigger: 'blur' }
        ],
        isp: [
          { required: true, message: '请选择运营商', trigger: 'blur' }
        ],
        province: [
          { required: true, message: '请选择省份', trigger: 'blur' }
        ],
        date1: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        date2: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
        type: [
          { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        ],
        resource: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请填写活动形式', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },

  mounted() {
    this.get_query_configs()
  },

  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$message({
            showClose: true,
            message: '请注意提交',
            type: 'error',
            duration: 0
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    resetForm(formName) {
      this.$refs[formName].resetFields()
    },

    get_query_configs() {
      get_query_configs().then(response => {
        const code = response.data.code
        if (code === 0) {
          this.configs.isps = response.data.result.isps
          this.configs.provinces = response.data.result.provinces
        } else {
          this.$message({
            showClose: true,
            message: response.data.error,
            type: 'error',
            duration: 0
          })
        }
      }).catch(error => {
        if (error.status !== 401) {
          this.$message.error('获取设备数据出错，可能是网络问题，请重试')
        }
      })
    },

    on_create_uuid() {
      this.ruleForm.dev_uuid = uuidv4()
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
