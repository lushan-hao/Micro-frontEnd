<!--
 * @LastEditors: haols
-->

<template>
  <div>
    <h2>什么是快乐星球 {{ msg }}</h2>
    <button @click="getHappy">点我获取答案</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: "",
    };
  },
  methods: {
    async getHappy() {
      let toolsModule = await window.System.import("@study/tools");
      this.msg = toolsModule.happyStar("Vue");
    },
  },
};
</script>

<style></style>
