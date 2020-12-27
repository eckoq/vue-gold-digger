<template xmlns:el-col="http://www.w3.org/1999/html">
  <el-card class="box-card">
    <el-collapse v-model="activeNames" @change="handle_change">
      <el-collapse-item title="流量特性" class="blue" name="1">
        <el-row>
          <el-col :span="6">
            <div class="filter-item">
              <el-date-picker
                v-model="query_param.date_time"
                type="datetimerange"
                value-format="yyyy-MM-dd HH:mm:ss"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                clearable
                @change="handle_date"
              />
            </div>
          </el-col>
        </el-row>
        <template v-for="ifitem in interfaces">
          <el-row :key="ifitem.ifname">
            <el-col :span="12">
              <div :id="ifitem.ifname_up" class="filter-item" style="height: 300px; margin: 10px 0 10px 0" />
            </el-col>
            <el-col :span="12">
              <div :id="ifitem.ifname_down" class="filter-item" style="height: 300px; margin: 10px 0 10px 0" />
            </el-col>
          </el-row>
        </template>
        <el-row>
          <div id="draw_test" class="filter-item" />
        </el-row>
      </el-collapse-item>
    </el-collapse>
  </el-card>
</template>

<script>
import {
  get_netflow
} from '@/api/device_manager/device_manager'
import { Loading } from 'element-ui'

export default {
  name: 'DeviceDetail',
  props: {
    'device': { type: Object, default: null }
  },
  data() {
    return {
      activeNames: ['1'],
      query_param: {
        dev_uuid: null,
        date_time: null
      },
      interfaces: [
        { ifname: 'em1', ifname_up: 'em1_up', ifname_down: 'em1_down' },
        { ifname: 'em2', ifname_up: 'em2_up', ifname_down: 'em2_down' },
        { ifname: 'em3', ifname_up: 'em3_up', ifname_down: 'em3_down' },
        { ifname: 'em4', ifname_up: 'em4_up', ifname_down: 'em4_down' }
      ],
      chart_data: null
    }
  },
  watch: {
    device: {
      handler(new_value, old_value) {
        this.device = new_value
        this.query_param.dev_uuid = this.device.dev_uuid
        var today = new Date().toLocaleDateString().replace(/\//g, '-') + ' 00:00:00'
        this.query_param.date_time = [today]
        this.get_netflow()
      },
      deep: true
    }
  },
  mounted() {
    this.query_param.dev_uuid = this.device.dev_uuid
    var today = new Date().toLocaleDateString().replace(/\//g, '-') + ' 00:00:00'
    this.query_param.date_time = [today]
    this.get_netflow()
  },
  methods: {
    handle_change(val) {
    },

    handle_date(val) {
      if (val === null) {
        return
      }
      this.get_netflow()
    },

    get_netflow() {
      const options = {
        lock: true,
        text: '查询中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
        fullscreen: true
      }
      const loadingInstance = Loading.service(options)

      get_netflow(this.query_param).then(response => {
        const code = response.data.code
        if (code === 0) {
          const data = response.data.result
          this.chart_data = data
          this.print_netflow_chart()
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
          this.$message.error('获取流量信息出错，可能是网络问题，请重试')
          console.error(error)
        }
        loadingInstance.close()
      })
    },

    print_netflow_chart() {
      for (const item of this.interfaces) {
        if (!Object.prototype.hasOwnProperty.call(this.chart_data, item.ifname)) {
          continue
        }

        var x_data = this.chart_data[item.ifname].map(function(item) {
          return item[0]
        })
        var y_data = this.chart_data[item.ifname].map(function(item) {
          return item[1]
        })
        this.show_chart(item.ifname_up, item.ifname + ' 上行流量', 'kbps', x_data, y_data)

        y_data = this.chart_data[item.ifname].map(function(item) {
          return item[2]
        })
        this.show_chart(item.ifname_down, item.ifname + '下行流量', 'kbps', x_data, y_data)
      }
    },

    show_chart(chart_id, name, unit, x_data, y_data) {
      var echarts = require('echarts')
      var Chart = echarts.init(document.getElementById(chart_id))
      var ChartOption = {
        title: {
          text: name,
          // subtext: subtext,
          left: 'center',
          align: 'right'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          splitLine: {
            show: true
          },
          data: x_data
        },
        yAxis: {
          name: unit,
          type: 'value'
        },
        toolbox: {
          left: 'left',
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
          }
        },
        dataZoom: [{
          start: 0
        }, {
          type: 'inside'
        }],
        series: {
          name: name,
          type: 'line',
          itemStyle: {
            color: '#8ec6ad'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: '#8ec6ad'
            }, {
              offset: 1,
              color: '#ffe'
            }])
          },
          data: y_data
        }
      }
      Chart.setOption(ChartOption)
    }
  }
}
</script>
