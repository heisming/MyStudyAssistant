<template>
  <div class="container">
    <div class="setting">
      <el-button plain type="success" @click="settingVisible = true">设置</el-button>
    </div>
    <main class="progress">
      <section class="modal">
        <el-progress type="circle" :percentage="percentage" :width="240"> 
          <el-tag class="countdown">{{ timer.hour }} : {{ timer.minutes }} : {{ timer.second }}</el-tag>
          <div class="control">
            <!-- <br /> -->
            <el-button v-if="isActive" @click="stop">stop</el-button>
            <el-button v-else @click="start">start</el-button>
          </div>
        </el-progress>
      </section>
    </main>

    <el-dialog v-model="settingVisible">
      <div>
        <el-form :model="setting">
          <el-form-item>
            <el-radio-group v-model="setting.tomato.minutes">
              <el-radio-button v-for="tomato in tomatoArr" :key="tomato" :label="tomato" />
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-radio-group v-model="setting.rest.minutes">
              <el-radio-button v-for="rest in restArr" :key="rest" :label="rest" />
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="settingVisible = false">取消</el-button>
        <el-button type="success" @click="setConfirm">设置</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useIntervalFn, useTimeoutFn } from '@vueuse/core';
import dayjs from 'dayjs';
import duration from "dayjs/plugin/duration";
// import { dayjs } from 'element-plus';

dayjs.extend(duration);

const settingVisible = ref(false);

const percentage = ref(0);
const tomatoArr = [25, 30, 40, 0];
const restArr = [10, 15, 20, 0];
const setting = reactive({
  totalSec: 0,
  tomato: {
    minutes: 25,
    second: 0,
  },
  rest: {
    minutes: 10,
    second: 0,
  },
});

const timer = reactive({
  hour: '00',
  minutes: '00',
  second: '00',
});
const countTimer = () => {
  const diffTime = dayjs.duration(1000 * setting.totalSec);
  timer.hour = diffTime.hours().toString().padStart(2, '0');
  timer.minutes = diffTime.minutes().toString().padStart(2, '0');
  timer.second = diffTime.seconds().toString().padStart(2, '0');
  // timer.hour = Math.floor(setting.tomato / 60).toString().padStart(2, '0');
  // timer.minutes = (setting.tomato % 60).toString().padStart(2, '0');
  // timer.second = '00';
}

const initTotalSec = ref(0);
const setConfirm = () => {
  percentage.value = 100;
  setting.totalSec = setting.tomato.minutes * 60 + setting.tomato.second;
  initTotalSec.value = setting.totalSec;
  countTimer();
  settingVisible.value = false;
};
setConfirm();
const start = () => {
  resume();
};
const stop = () => {
  pause();
};
const { resume, pause, isActive } = useIntervalFn(() => {
  if (setting.totalSec === 0) {
    pause();
    return;
  }
  setting.totalSec -= 1;
  percentage.value = Math.floor(setting.totalSec / initTotalSec.value * 10000) / 100;
  countTimer();
}, 1000, {
  immediate: false
})
</script>

<style scoped>
.container {
  position: relative;
}
.setting {
  position: fixed;
  top: 10px;
  right: 10px;
}
.progress {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, 50%);
}
.countdown {
  height: 40px;
  font-size: 30px;
}
.modal:hover .control {
  /* display: none; */
  display: block;
}
.control {
  display: none;
}
</style>
