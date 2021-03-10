<template>
  <div>
    <CanvasEdit v-if="edit" @change-mode="changeMode" :canvasData="canvasData" :canvasOptions="canvasOptions" style="height: 100vh;"></CanvasEdit>
    <CanvasView v-if="!edit" @change-mode="changeMode" :canvasData="canvasData" :canvasOptions="canvasOptions" style="height: 100vh;"></CanvasView>
  </div>
</template>

<script>
import CanvasEdit from '@/components/topo/canvasEdit'
import CanvasView from '@/components/topo/CanvasView'
import * as websocket from '@/utils/websocket.js'

export default {
  components: {
    CanvasEdit,
    CanvasView
  },
  data () {
    return {
      edit: true,
      canvasData: '',
      canvasOptions: ''
    }
  },
  methods: {
    changeMode (val, data, options) {
      this.edit = val
      this.canvasData = data
      this.canvasOptions = options
    }
  },
  mounted () {
    // websocket.wsConnection()
  }
}
</script>

<style scoped>

</style>
