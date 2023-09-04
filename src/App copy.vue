<script setup lang="ts">
import { ref } from 'vue';
import { useSerialPort } from './hooks/useSerialPort';

const { serialPortRef, available_ports, open, close, write } = useSerialPort();
const data = ref([''])
const port = ref('')
const sendValue = ref('')
const baudRate = ref(9600)
const BaudRateList = [1200, 2400, 4800, 9600, 19200, 38400, 57600, 115200, 230400, 250000, 460800, 500000, 600000, 750000, 1000000];

const openSerialPort = () => {
  open(port.value, baudRate.value);
}

const closeSerialPort = () => {
  close();
}

const getAvailablePorts = async() => {
  try {
    const res = await available_ports();
    data.value = res.data;
  } catch (error) {
    console.error("🚀 ~ file: App.vue:12 ~ getAvailablePorts ~ error", error)
  }
}
getAvailablePorts();

const sendData = async () => {
  try {
    const res = await write(sendValue.value)
    console.log("🚀 ~ file: App.vue:33 ~ sendData ~ res", res)
  } catch (error) {
    console.error(error);
  }
}
</script>

<template>
  <div class="container">
    <select v-model="port" class="test-select" @click="getAvailablePorts" :disabled="serialPortRef?.isOpen">
      <option v-for="(com, index) in data" :key="com" :value="com" :selected="index === 0 ? 'true': 'false'">{{ com }}</option>
    </select>
    <select v-model="baudRate" class="test-select" :disabled="serialPortRef?.isOpen">
      <option v-for="baudRate in BaudRateList" :key="baudRate" :value="baudRate">{{ baudRate }}</option>
    </select>
    <button v-if="!serialPortRef?.isOpen" class="test-button" @click="openSerialPort">打开</button>
    <button v-else class="test-button" @click="closeSerialPort">关闭</button>
    <input v-model="sendValue" />
    <button class="test-button" @click="sendData">发送数据</button>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  float: left;
}
.test-button {
  width: 100px;
}
.test-select {
  width: 100px;
}
</style>
