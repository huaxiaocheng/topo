<template>
  <div class="menus">
    <el-menu
      class="canvas-context-menu"
      mode="horizontal"
      @select="handleMenuSelect"
      background-color="#fff"
      text-color="#303133"
      active-text-color="#409EFF">
      <template v-for="(item,index) in menuArr">
        <el-menu-item :index="item.index" :disabled="item.disabled" :key="item.index">
          <span>{{ item.value }}</span>
          <span>{{ item.keyPosition }}</span>
        </el-menu-item>
        <div class="line" v-if="item.line" :key="index"></div>
      </template>
    </el-menu>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  props: {
    menu: {
      type: Array,
      default: () => []
    },
    canvas: {
      type: Object,
      require: true
    },
    props: {
      type: Object,
      require: true
    }
  },
  methods: {
    handleMenuSelect (val) {
      this.$emit('context', { state: val, ...this.props })
    }
  },
  computed: {
    menuArr: function () {
      if (Object.values(this.props).every(item => !item)) { // 空白处
        return [
          {
            index: 'Undo',
            value: '撤销',
            disabled: false,
            line: false,
            keyPosition: 'Ctrl + Z'
          },
          {
            index: 'Redo',
            value: '重做',
            disabled: false,
            line: true,
            keyPosition: 'Ctrl + Shift + Z'
          },
          {
            index: 'Copy',
            value: '复制',
            disabled: true,
            line: false,
            keyPosition: 'Ctrl + C'
          },
          {
            index: 'Paste',
            value: '粘贴',
            disabled: false,
            line: false,
            keyPosition: 'Ctrl + V'
          }
        ]
      } else if (this.props.nodes && this.props.nodes.length) {
        return [
          {
            index: 'Top',
            value: '置顶',
            disabled: false,
            line: false,
            keyPosition: null
          },
          {
            index: 'Bottom',
            value: '置底',
            disabled: false,
            line: false,
            keyPosition: null
          },
          {
            index: 'Up',
            value: '上移一层',
            disabled: true,
            line: false,
            keyPosition: null
          },
          {
            index: 'Down',
            value: '下移一层',
            disabled: true,
            line: true,
            keyPosition: null
          },
          {
            index: 'Delete',
            value: '删除',
            disabled: false,
            line: true,
            keyPosition: 'Delete'
          },
          {
            index: 'Undo',
            value: '撤销',
            disabled: false,
            line: false,
            keyPosition: 'Ctrl + Z'
          },
          {
            index: 'Redo',
            value: '重做',
            disabled: false,
            line: true,
            keyPosition: 'Ctrl + Shift + Z'
          },
          {
            index: 'Copy',
            value: '复制',
            disabled: false,
            line: false,
            keyPosition: 'Ctrl + C'
          },
          {
            index: 'Paste',
            value: '粘贴',
            disabled: false,
            line: false,
            keyPosition: 'Ctrl + V'
          }
        ]
      } else {
        return [
          {
            index: 'Top',
            value: '置顶',
            disabled: false,
            line: false,
            keyPosition: null
          },
          {
            index: 'Bottom',
            value: '置底',
            disabled: false,
            line: false,
            keyPosition: null
          },
          {
            index: 'Up',
            value: '上移一层',
            disabled: false,
            line: false,
            keyPosition: null
          },
          {
            index: 'Down',
            value: '下移一层',
            disabled: false,
            line: true,
            keyPosition: null
          },
          {
            index: 'Delete',
            value: '删除',
            disabled: false,
            line: true,
            keyPosition: 'Delete'
          },
          {
            index: 'Undo',
            value: '撤销',
            disabled: false,
            line: false,
            keyPosition: 'Ctrl + Z'
          },
          {
            index: 'Redo',
            value: '重做',
            disabled: false,
            line: true,
            keyPosition: 'Ctrl + Shift + Z'
          },
          {
            index: 'Copy',
            value: '复制',
            disabled: false,
            line: false,
            keyPosition: 'Ctrl + C'
          },
          {
            index: 'Paste',
            value: '粘贴',
            disabled: false,
            line: false,
            keyPosition: 'Ctrl + V'
          }
        ]
      }
    }
  }
}
</script>

<style lang="scss">
  .menus {
    color: #303133;
    background-color: #fff;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
    text-align: left;
    padding: 8px 0;

    .canvas-context-menu {
      border-bottom: none !important;
      display: flex;
      flex-direction: column;

      .el-menu-item {
        float: initial !important;
        border: none !important;

        &:hover,
        &:focus {
          color: #409EFF !important;
          background-color: transparent !important;
        }
      }

      .el-menu-item.is-disabled {
        cursor: default
      }

      .el-menu--popup {
        margin: 0;
      }

      .el-menu, .el-menu-item {
        min-width: 180px;
        font-size: 12px;
        padding: 0 20px;
        height: 26px;
        line-height: 26px;
        display: flex;
        justify-content: space-between;

        span:last-child {
          color: #909399;
        }
      }

      .el-submenu__title {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .el-submenu {
        position: relative;

        .canvas-context-sub-menu {
          position: absolute !important;
          left: 185px !important;
          top: -5px !important;
        }
      }
    }

    .line {
      background-color: transparent !important;
      padding: 0;
      margin: 5px 0;
      border-top: 1px solid #eee;
    }
  }
</style>
