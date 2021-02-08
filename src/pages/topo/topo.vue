<template>
  <div>
    <component :is="componentId"></component>
  </div>
</template>

<script>
import CanvasEdit from './canvasEdit'
import CanvasView from './canvasView'

export default {
  components: {
    CanvasEdit,
    CanvasView
  },
  data () {
    return {
      componentId: null
    }
  },
  created () {
    // 通过拓扑ID 输入组件类型
    this.componentId = 'CanvasEdit' // 'CanvasView'
  }
}
</script>

<style scoped>

</style>
