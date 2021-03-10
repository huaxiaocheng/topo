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
      this.$emit('change-mode', true, this.canvasData, this.canvasOptions)
    },
    // 订阅
    subscribe () {
      this.canvas.data.pens.forEach(pen => {
        if (pen.data && pen.data.device) {
          this.$store.state.ws.subscribe('/topic/property/18/' + pen.data.device.serialNo, msg => {
            let message = JSON.parse(msg.body)
            this.wsList.push(pen.data.device.serialNo)
            this.handleData(pen, message)
          }, {id: pen.data.device.serialNo})
        }
      })
    },
    handleData (pen, message) {
      if (pen.children) {
        let str = ''
        pen.data.pointList.forEach((item, index) => {
          if (index < pen.data.pointList.length - 1) {
            str += item.displayName + '：' + (message[item.identifier] ? message[item.identifier] : '') + (item.unit ? item.unit : '') + '\n'
          } else {
            str += item.displayName + '：' + (message[item.identifier] ? message[item.identifier] : '') + (item.unit ? item.unit : '')
          }
        })
        pen.children[0].text = str
        // 重新计算节点属性
        this.canvas.updateProps('', [pen])
        this.canvas.render()
      }
    },
    onMessage (event, data) {
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
