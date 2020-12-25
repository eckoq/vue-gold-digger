<template xmlns:el-col="http://www.w3.org/1999/html">
  <el-card class="box-card">
    <el-row>
      <el-col :span="6">
        <div>
          <div class="filter-item">
            <label class="el-form-item__label">设备ID</label>
            <el-input
              id="device_id_input"
              v-model="query_param.device_id"
              type="textarea"
              :rows="1"
              placeholder="设备ID"
              class="el-form-item__content"
              size="small"
              style="width: 200px"
              @focus="handle_device_id_focus"
            />
          </div>
          <div v-show="show_big_textarea" class="big_textarea_div" :style="BigTextareaDivStyle">
            <el-input
              ref="big_textarea_div"
              v-model="query_param.device_id"
              type="textarea"
              :rows="10"
              placeholder="一行一个设备UUID"
              @blur="handle_device_id_blur"
            />
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="filter-item">
          <label class="el-form-item__label">运营商</label>
          <el-select v-model="query_param.isp_id" clearable placeholder="请选择" size="small">
            <el-option
              v-for="item in configs.isps"
              :key="item.isp_id"
              :label="item.isp_name"
              :value="item.isp_id"
              style="width: 200px"
            />
          </el-select>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="filter-item">
          <label class="el-form-item__label">省份</label>
          <el-select v-model="query_param.province_id" clearable placeholder="请选择" size="small">
            <el-option
              v-for="item in configs.provinces"
              :key="item.province_id"
              :label="item.province_name"
              :value="item.province_id"
              style="width: 200px"
            />
          </el-select>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-button type="primary" size="small" icon="el-icon-search" @click="on_query">查询</el-button>
    </el-row>
    <div style="margin-top: 10px;">
      <div>
        <el-table
          style="width: 100%"
          border
          :data="device_table"
        >
          <el-table-column type="index" />
          <template v-for="(value, key, index) in display_column">
            <el-table-column
              :key="index"
              :prop="key"
              :label="value"
              :formatter="formatter"
              :min-width="100"
              sortable
            />
          </template>
          <el-table-column label="操作" fixed="right" width="100">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="on_device_info(scope.row)">设备详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page.sync="current_page"
          :page-sizes="[15, 50, 100, 200, 500, 1000]"
          :page-size="page_size"
          layout="total, sizes, prev, pager, next"
          :total="total"
          :hide-on-single-page="true"
          style="margin: 20px 0 0 0"
          @size-change="handle_size_change"
          @current-change="handle_cur_change"
        />
      </div>
    </div>
    <div>
      <el-dialog width="95%" title="设备详情" :visible.sync="show_device_info">
        <DeviceDetail :device="device_info" />
      </el-dialog>
    </div>
  </el-card>
</template>

<script>
import {
  get_query_configs, get_device
} from '@/api/device_manager/device_manager'
import { Loading } from 'element-ui'
import DeviceDetail from './component/DeviceDetail'

export default {
  name: 'DeviceManager',
  components: {
    DeviceDetail
  },
  data() {
    return {
      query_param: {
        device_id: null,
        isp_id: null,
        province_id: null
      },
      configs: {
        isps: null,
        provinces: null
      },
      display_column: {
        'dev_uuid': '设备UUID',
        'isp': '运营商',
        'province': '省份',
        'city': '城市',
        'link_upload_speed': '链路上行带宽(kbps)'
      },
      device_table: null,
      current_page: 1,
      page_size: 15,
      total: 0,
      show_big_textarea: false,
      show_device_info: false,
      device_info: null,
      BigTextareaDivStyle: {
        left: '',
        top: '',
        float: 'left'
      }
    }
  },
  mounted() {
    this.get_query_configs()
    this.get_device()
    this.BigTextareaDivStyle.left = document.getElementById('device_id_input').offsetParent.offsetLeft + 'px'
    this.BigTextareaDivStyle.top = document.getElementById('device_id_input').offsetParent.offsetTop + 'px'
  },

  methods: {
    handle_device_id_focus() {
      this.show_big_textarea = true
      this.$nextTick(() => {
        this.$refs.big_textarea_div.$refs.textarea.focus()
      })
    },

    handle_device_id_blur(val) {
      this.show_big_textarea = false
    },

    handle_size_change(val) {
      this.page_size = val
      this.get_device()
    },

    handle_cur_change(val) {
      this.current_page = val
      this.get_device()
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

    get_device() {
      const query_param = this.query_param
      query_param['cur_page'] = this.current_page
      query_param['page_size'] = this.page_size
      query_param['display_column'] = this.display_column
      const options = {
        lock: true,
        text: '查询中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
        fullscreen: true
      }
      const loadingInstance = Loading.service(options)

      get_device(query_param).then(response => {
        const code = response.data.code
        if (code === 0) {
          const data = response.data.result
          this.device_table = data.nodes
          this.total = data.count
        } else {
          this.$message({
            showClose: true,
            message: response.data.error,
            type: 'error',
            duration: 0
          })
        }
        loadingInstance.close()
      }).catch(error => {
        if (error.status !== 401) {
          this.$message.error('获取设备数据出错，可能是网络问题，请重试')
          console.error(error)
        }
        loadingInstance.close()
      })
    },

    on_query() {
      this.get_device()
    },

    formatter(row, column, cellValue, index) {
      if (this.configs.isps == null ||
          this.configs.provinces == null) {
        return ''
      }

      const property = column.property
      return this.transform_cellValue(property, cellValue)
    },

    transform_cellValue(property, cellValue) {
      if (property === 'isp') {
        const val = this.configs.isps.filter(function(isp) {
          return isp.isp_id === cellValue
        })
        return val.length === 0 ? '未知' : val[0].isp_name
      } else if (property === 'province') {
        const val = this.configs.provinces.filter(function(province) {
          return province.province_id === cellValue
        })
        return val.length === 0 ? '未知' : val[0].province_name
      } else {
        return cellValue
      }
    },

    on_device_info(row) {
      const temp_row = {}
      for (var key in row) {
        var value = this.transform_cellValue(key, row[key])
        temp_row[key] = value
      }
      this.device_info = temp_row
      this.show_device_info = true
    }
  }
}
</script>
<style scoped>
.el-row {
  margin-bottom: 10px;
}

.box-card {
  margin: 24px;
}

.big_textarea_div {
  position: absolute;
  width: 200px;
  z-index: 99999999;
  display: block;
}
</style>
