<template>
  <div id="canvas-page-container">
    <!-- 顶部菜单 -->
    <Menu :line="menu_arr.lineName"
          :from="menu_arr.fromArrow"
          :to="menu_arr.toArrow"
          :canvas="canvas"
          @on-change-menu="onChangeMenu"
          @import-canvas="onImportCanvas"
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
        <div ref="canvas"
             id="topology-canvas"
             class="full"
             @contextmenu="onContextMenu($event)"></div>
<!-- 导致选框错位 -->
<!--        :style="{-->
<!--        width: (canvas && canvas.options.width ? canvas.options.width : 1920) + 'px',-->
<!--        height: (canvas && canvas.options.height ? canvas.options.height : 1080) + 'px'}"-->
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
    <!-- 弹窗 -->
    <el-dialog title="绑定设备" :visible.sync="deviceFormVisible" width="600px" center>
      <el-form ref="deviceForm" :model="deviceForm">
        <template v-for="(item, index) in deviceForm.pensList">
          <el-form-item :key="item.key" :prop="'pensList.' + index + '.data.relations.deviceId'">
            <b>id：</b>{{item.id}}
            &#12288;
            <b>模型：</b>{{item.data.model.tags.name}}
            &#12288;
            <b>设备：</b>
            <el-select v-model="item.data.relations.deviceId" size="mini">
              <el-option v-for="(it, i) in deviceList" :key="i" :value="it.id" :label="it.id"></el-option>
            </el-select>
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="doView()" size="small">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// utils
import deviceService from '@/api/device/deviceService.js'
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
    canvasData: String,
    canvasOptions: String
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
      },
      // ---------------------------------------------------------------------------------------------------------------
      deviceFormVisible: false,
      deviceForm: {
        pensList: [
          {
            id: null,
            data: {
              model: {
                tags: {
                  name: null
                }
              },
              relations: {
                deviceId: null
              }
            }
          }
        ]
      },
      deviceList: []
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
    onImportCanvas (data) {
      if (this.canvas !== null) {
        this.canvas.delete(topology.data.pens)
        let pens = JSON.parse(data).pens
        for (let i = 0; i < pens.length; i++) {
          this.canvas.addNode(pens[i])
        }
        this.canvas.render()
      }
    },
    doView () {
      let data = JSON.parse(JSON.stringify(topology.data))
      let pens = data.pens
      for (let i = 0; i < this.deviceForm.pensList.length; i++) {
        if (this.deviceForm.pensList[i].data.relations.deviceId !== undefined) {
          pens.find(item => item.id === this.deviceForm.pensList[i].id).data.relations.deviceId = this.deviceForm.pensList[i].data.relations.deviceId
        }
      }
      for (let i = 0; i < pens.length; i++) {
        if (pens[i].data.relations.deviceId === undefined && pens[i].data.relations.parentId !== undefined) {
          pens[i].data.relations.deviceId = pens.find(item => item.id === pens[i].data.relations.parentId).data.relations.deviceId
        }
      }
      this.$emit('change-mode', false, JSON.stringify(data), JSON.stringify(this.canvas.options))
    },
    onViewCanvas () {
      deviceService.getDeviceList().then((res) => {
        this.deviceFormVisible = true
        this.$nextTick(() => {
          this.$refs['deviceForm'].resetFields()
          this.deviceList = res
          let list = JSON.parse(JSON.stringify(topology.data.pens.filter(it => it.data.relations.modelId && (it.data.relations.parentId === undefined || it.data.relations.parentId === null || it.data.relations.parentId === ''))))
          list.forEach(item => {
            item.data.relations.deviceId = null
          })
          this.deviceForm.pensList = list
        })
      })
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
      if (this.canvasOptions !== '') {
        canvasOptions = JSON.parse(this.canvasOptions)
      } else {
        canvasOptions = {
          width: 1200,
          height: 675,
          disableScale: true
        }
      }
      canvasOptions.on = this.onMessage
      this.canvas = new Topology('topology-canvas', canvasOptions)
      if (this.canvasData !== '') {
        this.open(JSON.parse(this.canvasData))
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
              vertical-align: middle;
              text-decoration: none !important;
              cursor: pointer;

              i {
                display: table-cell;
              }

              .topology {
                font-size: 28px;
              }

              .topoIconfont {
                font-size: 28px;
              }

              img {
                display: table-cell;
                margin: 5px;
                width: calc(100% - 10px);
                height: 30px;
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
    }

    .full {
      width: 100%;
      height: 100%;
      margin: auto;
    }

    .context-menu {
      position: fixed;
      z-index: 10;
    }
  }
</style>
