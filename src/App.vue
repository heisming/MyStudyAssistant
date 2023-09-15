<template>
  <div class="container">
    <div class="setting">
      <el-text>按下空格键即可操作</el-text>
      <el-button plain type="success" @click="settingVisible = true">设置</el-button>
    </div>
    <main class="progress">
      <section class="modal">
        <el-progress type="circle" :color="progressColor" :percentage="percentage" :width="240"> 
          <el-tag :type="progressTimeType" class="countdown">{{ timer.hour }} : {{ timer.minutes }} : {{ timer.second }}</el-tag>
        </el-progress>
        <div class="control">
          <!-- <br /> -->
          <div class="control-div">
            <el-button v-if="isActive" plain type="danger" @click="stop">stop</el-button>
            <el-button v-else plain type="success" @click="start">start</el-button>
          </div>
        </div>
      </section>
    </main>

    <el-dialog v-model="settingVisible">
      <div>
        <el-form :model="setting" label-width="auto">
          <el-form-item label="倒计时">
            <el-radio-group v-model="setting.tomato.minutes">
              <el-radio-button v-for="tomato in tomatoArr" :key="tomato" :label="tomato" />
            </el-radio-group>
            <el-tag size="large">分钟</el-tag>
          </el-form-item>
          <el-form-item label="休息">
            <el-radio-group v-model="setting.rest.minutes">
              <el-radio-button v-for="rest in restArr" :key="rest" :label="rest" />
            </el-radio-group>
            <el-tag size="large">分钟</el-tag>
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
import { ref, reactive, onUnmounted } from 'vue';
import { useIntervalFn, useTimeoutFn } from '@vueuse/core';
import dayjs from 'dayjs';
import duration from "dayjs/plugin/duration";
// import { dayjs } from 'element-plus';

dayjs.extend(duration);

enum EMode {
  Start,
  Stop,
}

const settingVisible = ref(false);
const progressColor = ref('#67C23A');
const progressTimeType = ref<'success' | 'primary'>('success');
const percentage = ref(0);
const tomatoArr = [25, 30, 40, 1, 0];
const restArr = [10, 15, 20, 2, 0];
const setting = reactive({
  mode: EMode.Start,
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
const countTimer = (totalSec: number) => {
  const diffTime = dayjs.duration(1000 * totalSec);
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
  countTimer(setting.totalSec);
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
    const mode = setting.mode === EMode.Start;
    setting.mode = mode ? EMode.Stop : EMode.Start;
    progressColor.value = mode ? '#409EFF' : '#67C23A';
    progressTimeType.value = mode ? 'primary' : 'success';
    setting.totalSec = mode ? setting.rest.minutes * 60 + setting.rest.second : setting.tomato.minutes * 60 + setting.tomato.second;
  }
  setting.totalSec -= 1;
  percentage.value = Math.floor(setting.totalSec / initTotalSec.value * 10000) / 100;
  countTimer(setting.totalSec);
}, 1000, {
  immediate: false
})

const watchSpace = (e: any) => {
  if (e.keyCode === 32) {
    if (isActive.value) {
      pause();
    } else {
      resume();
    }
  }
};
window.addEventListener('keydown', watchSpace);
onUnmounted(() => {
  window.removeEventListener('keydown', watchSpace);
})
</script>
<style lang="scss" scoped>
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

.modal {
  position: relative;
}
.modal:hover .control {
  /* display: none; */
  display: block;
}
.control {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0%;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 50%;
  background-color: rgb(0, 0, 0, 0.3);
  display: none;
  &-div {
    text-align: center;
    margin-top: 43%;
  }
}
</style>
