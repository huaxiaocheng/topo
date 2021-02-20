<template>
  <div id="canvas-page-container" class="not-select">
    <Menu :line="menu_arr.lineName"
          :from="menu_arr.fromArrow"
          :to="menu_arr.toArrow"
          :canvas="canvas"
          @on-change-menu="onChangeMenu"
          @save-canvas="onSaveCanvas">
    </Menu>

    <div class="canvas-box">
      <div class="tools">
        <el-collapse v-model="activeTools">
          <el-collapse-item v-for="(item, index) in tools" :key="index" :name="index">
            <template slot="title">
              <span class="collapse-title">{{item.name}}</span>
            </template>
            <div class="buttons">
              <a v-for="(btn, i) in item.children" :key="i" :title="btn.name" :draggable="btn.data"
                 :class="[item.showType === 'image' ? 'image-box' : '']" @dragstart="onDrag($event, btn)">
                <i v-if="item.showType === 'icon'" :class="`topology ${btn.icon}`"></i>
                <i v-else-if="item.showType === 'icon-charts'" :class="`topoIconfont ${btn.icon}`"></i>
                <template v-else-if="item.showType === 'image'">
                  <img :src="btn.image" alt="" />
                  <span class="tools-title">{{ btn.name }}</span>
                </template>
              </a>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>

      <div class="canvas-container">
        <div ref="canvas" id="topology-canvas" class="full" @contextmenu="onContextMenu($event)"></div>
      </div>

      <div v-if="canvas !== null && (props.multi || props.node)">
        <Props :props="props" :canvas="canvas" @change="onUpdateProps"></Props>
      </div>
      <div v-else-if="canvas !== null">
        <Overall :canvas="canvas"></Overall>
      </div>
      <!-- 右击菜单 -->
      <div class="context-menu" v-if="contextmenu.left" :style="contextmenu">
        <ContextMenu :props="props" :canvas="canvas" @context="handleNode" />
      </div>
    </div>
  </div>
</template>

<script>
// utils
import Tools from '../../utils/tools'
import html2canvas from 'html2canvas'
// 先导入库
import { Topology } from '@topology/core'
import Props from './canvasProps'
import Overall from './canvasOverall'
import Menu from './canvasMenu'
import ContextMenu from './canvasContextMenu'
import { register as registerChart } from '@topology/chart-diagram'
import * as echarts from 'echarts'
registerChart(echarts)
// 配置项
const canvasOptions = {
  font: {
    color: '#314659',
    fontSize: 12
  },
  color: '#314659',
  keydown: -1,
  disableEmptyLine: true
}

export default {
  name: 'canvasEdit',
  components: {
    Props,
    Overall,
    Menu,
    ContextMenu
  },
  props: {},
  data () {
    return {
      tools: [],
      // 初始化菜单 连线 锚点 样式
      menu_arr: {
        lineName: 'curve',
        fromArrow: '',
        toArrow: 'triangleSolid'
      },
      topoForm: {
        // 组态图名称
        topoName: '',
        // 组态图描述
        topoDesc: ''
      },
      // 当前节点props数据
      props: {
        node: null,
        line: null,
        nodes: null,
        multi: false,
        expand: false,
        locked: false
      },
      contextmenu: {
        left: null,
        top: null,
        bottom: null
      },
      canvas: null,

      isLoading: false,
      // 当前拓扑id
      topoId: this.$route.params.topoId,
      topoInfo: {},
      activeTools: [0, 1],
      scale: 1
    }
  },
  created () {
    document.onclick = event => {
      this.contextmenu = {
        left: null,
        top: null,
        bottom: null
      }
    }
  },
  mounted () {
    console.log('编辑画布')
    /**
     *  @为画布初始化事件绑定
     *
     * */
    this.initCanvas()
    this.initBaseTools()
  },
  methods: {
    initCanvas () {
      canvasOptions.on = this.onMessage
      this.canvas = new Topology('topology-canvas', canvasOptions)
      console.log(this.canvas)
      this.open({pens: [], grid: true, rule: true})
    },
    open (canvas) {
      this.canvas.open(canvas)
      // 初始化
      setTimeout(() => {
        this.canvas.data.lineName = this.menu_arr.lineName
        this.canvas.data.fromArrow = this.menu_arr.fromArrow
        this.canvas.data.toArrow = this.menu_arr.toArrow
        this.canvas.render()
      }, 0)
    },
    onContextMenu (event) {
      event.preventDefault()
      event.stopPropagation()
      console.log('onContextMenu-props', this.props)
      if (event.clientY + 360 < document.body.clientHeight) {
        this.contextmenu = {
          left: event.clientX + 'px',
          top: event.clientY + 'px'
        }
      } else {
        this.contextmenu = {
          left: event.clientX + 'px',
          bottom: document.body.clientHeight - event.clientY + 'px'
        }
      }
    },
    onDrag (event, node) {
      event.dataTransfer.setData('Topology', JSON.stringify(node.data))
    },
    onMessage (event, data) {
      if (this.props.node && this.props.node.id !== data.id && ['node', 'addNode'].indexOf(event) > -1) {
        this.props = {
          node: null,
          line: null,
          multi: false,
          nodes: null,
          locked: false
        }
      }
      console.log('event', event, data)
      console.log('canvas', this.canvas)
      if (!event.includes('move')) {
        this.contextmenu = {
          left: null,
          top: null,
          bottom: null
        }
      }
      // 右侧输入框编辑状态时点击编辑区域其他元素，onMessage执行后才执行onUpdateProps方法，通过setTimeout让onUpdateProps先执行
      setTimeout(() => {
        switch (event) {
          case 'node':
            this.contextmenu = {
              left: null,
              top: null,
              bottom: null
            }
            this.props = {
              node: data,
              line: null,
              multi: false,
              expand: false,
              nodes: null,
              locked: data.locked,
              propShow: data.data // data.data ? true : false
            }
            console.log(data)
            break
          case 'moveInNode':
            break
          case 'addNode':
            console.log('onMessage', data)
            this.props = {
              node: data,
              line: null,
              multi: false,
              expand: this.props.expand,
              nodes: null,
              locked: data.locked
            }
            break
          case 'delete':
            this.props = {
              node: null,
              line: null,
              multi: false,
              nodes: null,
              locked: false
            }
            break
          case 'dblclick':
            // 自定义节点禁用
            if (!data.data) return
            console.log(data, data.constructor.name)
            this.$emit('dbclick', {
              line: data.constructor.name === 'Line' ? data : null,
              node: data.constructor.name === 'Node' ? data : null
            })
            break
          case 'line':
            console.log(data)
            data.locked = 1
            break
          case 'addLine':
            this.props = {
              node: null,
              line: data,
              multi: false,
              nodes: null,
              locked: data.locked
            }
            break
          case 'multi':
            console.log(event, data)
            this.props = {
              node: data.length === 1 ? data[0] : null,
              line: null,
              multi: data.length > 1, // data.length > 1 ? true : false
              nodes: data.length > 1 ? data : null,
              locked: null
            }
            break
          case 'space':
            this.props = {
              node: null,
              line: null,
              multi: false,
              nodes: null,
              locked: false
            }
            break
        }
      }, 0)
    },
    onUpdateProps (node) {
      // 如果是node属性改变，需要传入node，重新计算node相关属性值
      // 如果是line属性改变，无需传参
      this.canvas.updateProps(node)
    },
    onChangeMenu ({ key, value }) {
      this.$nextTick(() => {
        console.log(key, value)
        this.canvas.data[key] = value
        this.menu_arr[key] = value
        this.canvas.render()
      })
    },
    // 初始化设备组件
    initBaseTools: function () {
      this.tools = Tools([])
    },
    /** 处理节点返回的所有事件 */
    handleNode ({ state, node, nodes, line, multi }) {
      console.log(state)
      this[`on${state}`]({
        node,
        nodes,
        line,
        multi
      })
    },
    onSaveCanvas () {
      var vm = this
      html2canvas(this.$refs.canvas).then((canvas) => {
        vm.isLoading = true
        var postForm = {
          name: '1',
          description: '1',
          content: JSON.stringify(topology.data),
          pic: canvas.toDataURL()
        }
        console.log(postForm)
      })
    },

    onDelNode ({ node }) {
      // 自定义节点 直接删除
      if (!node.data) return this.canvas.delete()
      // 实例节点 do...
      this.$confirm('确认删除该组态节点？此操作无法恢复！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.canvas.delete()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    onTop ({ node, nodes }) {
      if (nodes && nodes.length) {
        for (const item of nodes) {
          this.canvas.top(item)
        }
      }
      if (node) {
        this.canvas.top(node)
      }
      this.canvas.render()
    },
    onBottom ({ node, nodes }) {
      if (nodes && nodes.length) {
        for (const item of nodes) {
          this.canvas.bottom(item)
        }
      }
      if (node) {
        this.canvas.bottom(node)
      }
      this.canvas.render()
    }
  }
}
</script>

<style lang="scss" scoped>
  #canvas-page-container {
    position: relative;
    width: 100%;
    height: 100%;

    .canvas-box {
      display: flex;
      height: calc(100% - 41px);
      position: relative;

      .tools {
        width: 200px;
        border-right: 1px solid #C0C4CC;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        overflow-y: auto;

        /deep/ .el-collapse-item__header {
          background: #fafafa;

          .collapse-title {
            padding-left: 10px;
          }
        }

        /deep/ .el-collapse-item__content {
          padding-bottom: 0;

          .buttons {
            padding: 5%;

            a {
              display: inline-table;
              color: #303133;
              line-height: 1;
              width: 33.3333%;
              height: 50px;
              text-align: center;
              text-decoration: none !important;
              cursor: pointer;

              i {
                display: table-cell;
                vertical-align: middle;
              }

              .topology {
                font-size: 32px;
              }

              .topoIconfont {
                font-size: 32px;
              }
            }
          }
        }
      }
    }

    .canvas-container {
      position: absolute;
      left: 220px;
      right: 320px;
      top: 20px;
      bottom: 20px;
      overflow: auto;
      display: flex;
      justify-items: center;
      align-items: center;
    }

    .full {
      /*width: 100%;*/
      /*height: 100%;*/
      width: 1200px;
      height: 675px;
      border: 2px solid #fafafa;
      margin: auto;
    }

    .context-menu {
      position: fixed;
      z-index: 10;
    }
  }
</style>
