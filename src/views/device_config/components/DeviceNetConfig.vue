<template>
  <el-card class="box-card">
    <el-form ref="device_net_config" :model="device_net_config" :rules="rules" label-width="100px">
      <el-form-item label="PPPoE账号" prop="ppp_user">
        <el-input v-model="device_net_config.ppp_user" size="medium" style="width:40%" clearable />
      </el-form-item>
      <el-form-item label="PPPoE密码" prop="ppp_passwd">
        <el-input v-model="device_net_config.ppp_passwd" size="medium" style="width:40%" clearable />
      </el-form-item>
      <el-form-item label="PPPoE链路带宽(Kbps)" prop="ppp_link_up_bandwidth">
        <el-input v-model="device_net_config.ppp_link_up_bandwidth" size="medium" style="width:40%" clearable />
      </el-form-item>
      <el-form-item label="VLAN ID" prop="ppp_vlan_id">
        <el-input v-model="device_net_config.ppp_vlan_id" size="medium" style="width:40%" clearable />
      </el-form-item>
      <el-form-item label="VLAN父网卡" prop="ppp_vlan_parent">
        <el-input v-model="device_net_config.ppp_vlan_parent" size="medium" style="width:40%" clearable />
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'DeviceNetConfig',
  data() {
    return {
      device_net_config: {
        ppp_user: '',
        ppp_passwd: '',
        ppp_link_up_bandwidth: '',
        ppp_vlan_id: '',
        ppp_vlan_parent: '',
      },
      rules: {
        ppp_user: [
          { required: true, message: '请填写PPPoE账号', trigger: 'blur' }
        ],
        ppp_passwd: [
          { required: true, message: '请填写账号密码', trigger: 'blur' }
        ],
        ppp_link_up_bandwidth: [
          { required: true, message: '请填写PPPoE链路带宽', trigger: 'blur' }
        ],
        ppp_vlan_id: [
          { required: true, message: '请填写PPPoE所属Vlan ID', trigger: 'blur' }
        ],
        ppp_vlan_parent: [
          { required: true, message: '请填写VLAN物理网卡', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
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
