<template>
  <div class="canvas-outside">
    <el-button class="goBack" size="mini" type="primary" icon="el-icon-back" @click="goBack()">返回</el-button>
    <div id="canvas-page-container" :style="{width: (canvasOptions !== '' ? JSON.parse(canvasOptions).width : 1920) + 'px', height: (canvasOptions !== '' ? JSON.parse(canvasOptions).height : 1080) + 'px'}">
      <div id="topology-canvas" class="full"></div>
    </div>
  </div>
</template>

<script>
import { Topology } from '@topology/core'

export default {
  props: {
    canvasData: String,
    canvasOptions: String
  },
  data () {
    return {
      canvas: null,
      wsList: []
    }
  },
  beforeDestroy: function () {
    if (this.$store.state.ws !== null) {
      for (let i = 0; i < this.wsList.length; i++) {
        this.$store.state.ws.unsubscribe(this.wsList[i])
      }
    }
  },
  mounted () {
    this.initCanvas()
    console.log('wsStatus 初始化', this.$store.state.wsStatus)
    if (this.$store.state.wsStatus) {
      this.subscribe()
    }
  },
  watch: {
    '$store.state.wsStatus': function (val) {
      console.log('wsStatus 状态监听', val)
      if (val) {
        this.subscribe()
      }
    }
  },
  methods: {
    initCanvas () {
      let canvasOptions = JSON.parse(this.canvasOptions)
      canvasOptions.disableScale = true
      canvasOptions.on = this.onMessage
      this.canvas = new Topology('topology-canvas', canvasOptions)
      this.open(JSON.parse(this.canvasData))
    },
    open (canvas) {
      canvas.grid = false
      canvas.rule = false
      canvas.locked = 2
      this.canvas.open(canvas)
      // 初始化
      this.canvas.data.pens.forEach(pen => {
        if (pen.data && pen.data.device) {
          this.handleData(pen, {})
        }
      })
    },
    goBack () {
      let data = JSON.parse(this.canvasData)
      let pens = data.pens
      for (let i = 0; i < pens.length; i++) {
        if (pens[i].data.relations.deviceId !== undefined) {
          delete pens[i].data.relations.deviceId
        }
      }
      this.$emit('change-mode', true, JSON.stringify(data), this.canvasOptions)
    },
    // 订阅
    subscribe () {
      let deviceList = []
      this.canvas.data.pens.forEach(pen => {
        if (pen.data && pen.data.relations.deviceId) {
          deviceList.push(pen.data.relations.deviceId)
        }
      })
      deviceList = [...new Set(deviceList)]
      deviceList.forEach(deviceId => {
        this.wsList.push(deviceId)
        this.$store.state.ws.subscribe('/channel/device/' + deviceId, msg => {
          let message = JSON.parse(msg.body)
          this.handleData(deviceId, message)
        }, {id: deviceId})
      })
    },
    handleData (device, message) {
      let pens = this.canvas.data.pens.filter(item => item.data.relations.deviceId && item.data.relations.deviceId === device)
      for (let i = 0; i < pens.length; i++) {
        if (pens[i].data.relations.modelPropId[0] === 'tags') {
          pens[i].text = message.tags[pens[i].data.relations.modelPropId[1]]
        } else if (pens[i].data.relations.modelPropId[0] === 'reported') {
          pens[i].text = message.properties.reported[pens[i].data.relations.modelPropId[1]]
        }
      }
      // 重新计算节点属性
      this.canvas.updateProps('', [pens])
      this.canvas.render()
    },
    onMessage (event, data) {
      if (event === 'node') {
        if (data.events.length > 0 && data.events[0].action === 100) {
          let msg = {
            id: data.data.relations.deviceId,
            properties: {
              desired: JSON.parse(data.events[0].value)
            }
          }
          this.$store.state.ws.send('/channel/device/send/' + data.data.relations.deviceId, {}, JSON.stringify(msg))
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .canvas-outside {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .goBack {
      position: absolute;
      right: 10px;
      top: 20px;
      z-index: 999;
    }
  }
  #canvas-page-container {
    width: 100%;
    height: 100%;
    .full {
      width: 100%;
      height: 100%;
    }
  }
</style>
