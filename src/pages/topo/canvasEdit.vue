<template>
  <div id="canvas-page-container">
    <!-- 连线菜单 -->
    <Menu :line="menu_arr.lineName" :from="menu_arr.fromArrowType" :to="menu_arr.toArrowType" :topoForm.sync="topoForm" :canvas="canvas"
          @on-change-menu="onChangeMenu" @save-canvas="onSaveCanvas" @back="backToList">
    </Menu>
    <div class="canvas-box">
      <!-- 节点工具 -->
      <div class="tools">
        <div v-for="(item, index) in tools" :key="index">
          <div class="title">{{ item.name }}</div>
          <div class="buttons">
            <a v-for="(btn, i) in item.children" :key="i" :title="btn.name" :draggable="btn.data"
               :class="[item.showType === 'image' ? 'image-box' : '']" @dragstart="onDrag($event, btn)">
              <i v-if="item.showType === 'icon'" :class="`topology ${btn.icon}`"></i>
              <template v-else-if="item.showType === 'image'">
                <img :src="btn.image" alt="" />
                <span class="tools-title">{{ btn.name }}</span>
              </template>
            </a>
          </div>
        </div>
      </div>
      <!-- 画布内容 -->
      <div class="canvas-container">
        <div ref="canvas" id="topology-canvas" class="full" @contextmenu="onContextMenu($event)"></div>
      </div>
      <!-- 节点信息 -->
      <div class="props" v-if="props.multi || props.node">
        <Props :props.sync="props" :canvas="canvas" @change="onUpdateProps"></Props>
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
        fromArrowType: '',
        toArrowType: 'triangleSolid'
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
      topoInfo: {}
    }
  },
  created () {
    console.log(this.$route)
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
      this.open({pens: [], grid: true})
    },
    open (canvas) {
      this.canvas.open(canvas)
      // 初始化
      setTimeout(() => {
        this.canvas.data.lineName = this.menu_arr.lineName
        this.canvas.data.fromArrowType = this.menu_arr.fromArrowType
        this.canvas.data.toArrowType = this.menu_arr.toArrowType
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
      console.log('event', event)
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
        this.canvas.data[key] = value
        this.menu_arr[key] = value
        console.log(key, value)
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
    onSaveCanvas (topoForm) {
      if (!topoForm || !topoForm.topoName) {
        this.$message({
          type: 'error',
          message: '组态名称不能为空!'
        })
        return
      }
      var vm = this
      html2canvas(this.$refs.canvas).then((canvas) => {
        vm.isLoading = true
        var postForm = {
          name: topoForm.topoName,
          description: topoForm.topoDesc,
          content: JSON.stringify(topology.data),
          pic: canvas.toDataURL()
        }
        console.log(postForm)
      })
    },

    backToList: function () {
      this.$router.push({
        path: '/configuration/info'
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
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;

    .canvas-box {
      height: calc(100vh - 41px);
      flex-grow: 1;
      display: flex;
    }

    .tools {
      width: 200px;
      height: calc(100vh - 41px);
      /*padding: 5px;*/
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
      border-right: solid 1px #e6e6e6;
      /*border-top: none;*/
      overflow-y: auto;

      .title {
        color: #606060;
        font-weight: 600;
        font-size: 12px;
        line-height: 1;
        padding: 5px 10px;
        margin-top: 8px;
        border-bottom: 1px solid #ddd;

        &:first-child {
          border-top: none;
        }
      }

      .buttons {
        padding: 10px 5px 0;

        a {
          display: inline-block;
          color: #314659;
          line-height: 1;
          width: 55px;
          height: 50px;
          text-align: center;
          text-decoration: none !important;
          cursor: pointer;

          .topology {
            font-size: 32px;
          }

          &:hover {
            color: #1890ff;
          }
        }

        a.image-box {
          width: 48px;
          height: 40px;
          margin: 5px 0 0 9px;
        }

        img {
          width: 100%;
          height: 100%;
        }

        .tools-title {
          display: inline-block;
          width: 100%;
          font-size: 12px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
    }

    .canvas-container {
      width: calc(100vw - 201px - 241px);
      height: calc(100vh - 41px);
      overflow: auto;
    }
    .full {
      /*flex-grow: 1;*/
      width: 100%;
      height: 100%;
      /*min-width: 960px !important;*/
      /*width: auto !important;*/
      /*min-height: 540px;*/
    }

    .context-menu {
      position: fixed;
      z-index: 10;
    }
  }
</style>
