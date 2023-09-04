import { Serialport } from 'tauri-plugin-serialport-api';
import { reactive } from 'vue';

let serialport: Serialport | undefined = undefined;

const serialPortRef = reactive({
  path: '',
  baudRate: 115200,
  isOpen: false,
})

async function open(path: string, baudRate: number) {
  try {
    serialport = new Serialport({ path, baudRate});
    await serialport.open();
    serialPortRef.isOpen = true;
  } catch (error) {
    console.error(error);
  }
}

async function available_ports() {
  try {
    const res = await Serialport.available_ports()
    return res
  } catch (error) {
    console.error(error);
  }
}

async function close() {
  try {
    if (serialport) {
      await serialport.close();
      serialPortRef.isOpen = false;
    }
  } catch (error) {
    console.error(error);
  }
}

async function write(data: string) {
  try {
    if (serialPortRef.isOpen && serialport) {
      const res = await serialport.write(data);
      return res;
    }
  } catch (error) {
    console.error(error);
  }
}

export function useSerialPort() {
  return {
    available_ports,
    open,
    close,
    write,
    serialPortRef,
  };
}
