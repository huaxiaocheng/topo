<template>
  <div class="menus">
    <el-menu
      class="canvas-context-menu"
      mode="horizontal"
      @select="handleMenuSelect"
      background-color="#fff"
      text-color="#303133"
      active-text-color="#409EFF">
      <template v-for="(item,index) in menuArr.filter(item => item.display)">
        <el-menu-item :index="item.index" :disabled="item.disabled" :key="item.index">{{ item.value }}</el-menu-item>
        <div class="line" v-if="item.line" :key="index"></div>
      </template>
    </el-menu>
  </div>
</template>

<script>
const commonArr = [
  {
    index: 'Top',
    value: '置顶',
    disabled: false,
    display: true,
    line: false
  },
  {
    index: 'Bottom',
    value: '置底',
    disabled: false,
    display: true,
    line: false
  }
]
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
      // @返回优先级 多选 > 连线 > 单节点 > 空白
      // 1. 多选返回 通用
      // 2. 连线存在返回 删除  + 通用
      // 3. 节点存在
      let props = this.props
      if (Object.values(props).every(item => !item)) {
        return []
      } else if (props.multi) { // 多选
        return commonArr
      } else if (props.line) { // 连线
        return [
          {
            index: 'DelLine',
            value: '删除',
            disabled: false,
            display: true,
            line: false
          }
        ]
      } else {
        return [
          {
            index: 'DelNode',
            value: '删除',
            disabled: false,
            display: true,
            line: true
          },
          ...commonArr
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
          color: #1890ff !important;
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
