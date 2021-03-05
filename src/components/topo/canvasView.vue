<template>
  <div id="canvas-page-container">
    <el-button class="goBack" size="mini" type="primary" icon="el-icon-back" @click="goBack()">返回</el-button>
    <div id="topology-canvas" class="full"></div>
  </div>
</template>

<script>
import { Topology } from '@topology/core'

export default {
  props: {
    canvasString: String
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
      let canvasOptions = {}
      canvasOptions.on = this.onMessage
      this.canvas = new Topology('topology-canvas', canvasOptions)
      this.open(JSON.parse(this.canvasString))
    },
    open (canvas) {
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
      this.$emit('change-mode', true, this.canvasString)
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
  #canvas-page-container {
    position: relative;
    width: 100vw;
    height: 100vh;
    .goBack {
      position: absolute;
      right: 10px;
      top: 20px;
      z-index: 999;
    }
    .full {
      width: 100%;
      height: 100%;
    }
  }
</style>
