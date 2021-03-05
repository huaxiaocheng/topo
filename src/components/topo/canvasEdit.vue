<template>
  <div id="canvas-page-container" class="not-select">
    <!-- 顶部菜单 -->
    <Menu :line="menu_arr.lineName"
          :from="menu_arr.fromArrow"
          :to="menu_arr.toArrow"
          :canvas="canvas"
          @on-change-menu="onChangeMenu"
          @save-canvas="onSaveCanvas"
          @view-canvas="onViewCanvas">
    </Menu>
    <!-- 顶部菜单 -->
    <!-- 工具 -->
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
      <!-- 工具 -->
      <!-- 画布 -->
      <div class="canvas-container">
        <div ref="canvas" id="topology-canvas" class="full" @contextmenu="onContextMenu($event)"></div>
      </div>
      <!-- 画布 -->
      <!-- 属性 -->
      <div v-if="canvas !== null && (props.node || props.line || props.nodes)">
        <Props :props="props" :canvas="canvas" @change="onUpdateProps"></Props>
      </div>
      <div v-else-if="canvas !== null">
        <Overall :canvas="canvas"></Overall>
      </div>
      <!-- 属性 -->
      <!-- 右键菜单 -->
      <div class="context-menu" v-if="contextmenu.left" :style="contextmenu">
        <ContextMenu :props="props" :canvas="canvas" @context="handleNode" />
      </div>
      <!-- 右键菜单 -->
    </div>
  </div>
</template>

<script>
// utils
import Tools from '../../utils/tools'
// import html2canvas from 'html2canvas'
import { Topology } from '@topology/core'
import Props from './canvasProps'
import Overall from './canvasOverall'
import Menu from './canvasMenu'
import ContextMenu from './canvasContextMenu'
import { register as registerChart } from '@topology/chart-diagram'
import * as echarts from 'echarts'
registerChart(echarts)

export default {
  name: 'canvasEdit',
  components: {
    // 顶部菜单
    Menu,
    // 右键菜单
    ContextMenu,
    // 节点属性
    Props,
    // 画布属性
    Overall
  },
  props: {
    canvasString: String
  },
  data () {
    return {
      // ---------------------------------------------------------------------------------------------------------------
      // 连线类型、起点箭头、终点箭头
      menu_arr: {
        lineName: 'curve',
        fromArrow: '',
        toArrow: 'triangleSolid'
      },
      // ---------------------------------------------------------------------------------------------------------------
      // 工具
      tools: [],
      // 默认展开
      activeTools: [0, 1],
      // ---------------------------------------------------------------------------------------------------------------
      // 画布
      canvas: null,
      // ---------------------------------------------------------------------------------------------------------------
      // 右键菜单
      contextmenu: {
        left: null,
        top: null,
        bottom: null
      },
      // ---------------------------------------------------------------------------------------------------------------
      // 当前节点
      props: {
        node: null,
        line: null,
        nodes: null
      }
      // ---------------------------------------------------------------------------------------------------------------
    }
  },
  created () {
    // 任意点击之后隐藏右键菜单
    document.onclick = event => {
      this.contextmenu = {
        left: null,
        top: null,
        bottom: null
      }
    }
  },
  mounted () {
    this.initCanvas()
    this.initBaseTools()
  },
  methods: {
    // -----------------------------------------------------------------------------------------------------------------
    // 修改连线类型、起点箭头、终点箭头
    onChangeMenu ({ key, value }) {
      this.$nextTick(() => {
        this.canvas.data[key] = value
        this.menu_arr[key] = value
        this.canvas.render()
      })
    },
    // 保存
    onSaveCanvas () {
      console.log(JSON.stringify(topology.data))
    },
    onViewCanvas () {
      this.$emit('change-mode', false, JSON.stringify(topology.data))
    },
    // -----------------------------------------------------------------------------------------------------------------
    // 初始化工具
    initBaseTools: function () {
      this.tools = Tools([])
    },
    // 拖拽工具
    onDrag (event, node) {
      event.dataTransfer.setData('Topology', JSON.stringify(node.data))
    },
    // -----------------------------------------------------------------------------------------------------------------
    // 初始化画布
    initCanvas () {
      let canvasOptions = {}
      canvasOptions.on = this.onMessage
      this.canvas = new Topology('topology-canvas', canvasOptions)
      if (this.canvasString !== '') {
        this.open(JSON.parse(this.canvasString))
      } else {
        this.open({pens: []})
      }
    },
    // 打开画布
    open (canvas) {
      canvas.grid = true
      canvas.rule = true
      canvas.locked = 0
      this.canvas.open(canvas)
      // 打开画布后初始化连线类型、起点箭头、终点箭头
      setTimeout(() => {
        this.canvas.data.lineName = this.menu_arr.lineName
        this.canvas.data.fromArrow = this.menu_arr.fromArrow
        this.canvas.data.toArrow = this.menu_arr.toArrow
        this.canvas.render()
      }, 0)
    },
    // 画布事件
    onContextMenu (event) {
      event.preventDefault()
      event.stopPropagation()
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
    // 画布监听
    onMessage (event, data) {
      if (this.props.node && this.props.node.id !== data.id && ['node', 'addNode'].indexOf(event) > -1) {
        this.props = {
          node: null,
          line: null,
          nodes: null
        }
      }
      console.log('event', event, data)

      // 除moveInNode和moveOutNode，其他操作时隐藏右键菜单
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
              nodes: null
            }
            break
          case 'moveInNode':
            break
          case 'addNode':
            this.props = {
              node: data,
              line: null,
              nodes: null
            }
            break
          case 'delete':
            this.props = {
              node: null,
              line: null,
              nodes: null
            }
            break
          case 'dblclick':
            break
          case 'line':
            this.props = {
              node: null,
              line: data,
              nodes: null
            }
            break
          case 'addLine':
            this.props = {
              node: null,
              line: data,
              nodes: null
            }
            break
          case 'multi':
            this.props = {
              node: null,
              line: null,
              nodes: data
            }
            break
          case 'space':
            this.props = {
              node: null,
              line: null,
              nodes: null
            }
            break
        }
      }, 0)
    },
    // -----------------------------------------------------------------------------------------------------------------
    // 右击事件
    handleNode ({ state, node, line, nodes }) {
      // console.log(state, node, line, nodes)
      this[`on${state}`]({node, line, nodes})
    },
    // 右击事件 - 撤销
    onUndo ({ node, line, nodes }) {
      this.canvas.undo()
      this.canvas.render()
    },
    // 右击事件 - 重做
    onRedo ({ node, line, nodes }) {
      this.canvas.redo()
      this.canvas.render()
    },
    // 右击事件 - 删除
    onDelete ({ node, line, nodes }) {
      this.canvas.delete()
      this.canvas.render()
    },
    // 右击事件 - 置顶
    onTop ({ node, line, nodes }) {
      if (node) {
        this.canvas.top(node)
      }
      if (line) {
        this.canvas.top(line)
      }
      if (nodes && nodes.length) {
        for (let item of nodes) {
          this.canvas.top(item)
        }
      }
      this.canvas.render()
    },
    // 右击事件 - 置底
    onBottom ({ node, line, nodes }) {
      if (node) {
        this.canvas.bottom(node)
      }
      if (line) {
        this.canvas.bottom(line)
      }
      if (nodes && nodes.length) {
        for (let item of nodes) {
          this.canvas.bottom(item)
        }
      }
      this.canvas.render()
    },
    // 右击事件 - 上移一层
    onUp ({ node, line, nodes }) {
      if (node) {
        this.canvas.up(node)
      }
      if (line) {
        this.canvas.up(line)
      }
      if (nodes && nodes.length) {
        for (let item of nodes) {
          this.canvas.up(item)
        }
      }
      this.canvas.render()
    },
    // 右击事件 - 下移一层
    onDown ({ node, line, nodes }) {
      if (node) {
        this.canvas.down(node)
      }
      if (line) {
        this.canvas.down(line)
      }
      if (nodes && nodes.length) {
        for (let item of nodes) {
          this.canvas.down(item)
        }
      }
      this.canvas.render()
    },
    // 右击事件 - 复制
    onCopy ({ node, line, nodes }) {
      if (node) {
        this.canvas.copy(node)
      }
      if (line) {
        this.canvas.copy(line)
      }
      if (nodes && nodes.length) {
        for (let item of nodes) {
          this.canvas.copy(item)
        }
      }
      this.canvas.render()
    },
    // 右击事件 - 粘贴
    onPaste ({ node, line, nodes }) {
      this.canvas.paste()
      this.canvas.render()
    },
    // -----------------------------------------------------------------------------------------------------------------
    // 修改属性
    onUpdateProps (node) {
      // 如果是node属性改变，需要传入node，重新计算node相关属性值
      // 如果是line属性改变，无需传参
      this.canvas.updateProps(node)
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
              width: 25%;
              height: 40px;
              text-align: center;
              text-decoration: none !important;
              cursor: pointer;

              i {
                display: table-cell;
                vertical-align: middle;
              }

              .topology {
                font-size: 28px;
              }

              .topoIconfont {
                font-size: 28px;
              }

              img {
                display: table-cell;
                vertical-align: middle;
                margin: 5px;
                width: calc(100% - 10px);
                height: calc(100% - 10px);
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
      width: calc(100% - 4px);
      height: calc(100% - 4px);
      /*width: 1200px;*/
      /*height: 675px;*/
      border: 2px solid #fafafa;
      margin: auto;
    }

    .context-menu {
      position: fixed;
      z-index: 10;
    }
  }
</style>
