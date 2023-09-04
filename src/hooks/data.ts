
  import { Serialport } from 'tauri-plugin-serialport-api';

  let serialport: Serialport | null  = null ;
  function openSerialport() {
    serialport = new Serialport({ path: 'COM10', baudRate: 9600 });
    serialport
      .open()
      .then((res) => {
        console.log('open serialport', res);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function available_ports() {
    Serialport.available_ports()
      .then((res) => {
        console.log('available_ports: ', res);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function close() {
    serialport
      .close()
      .then((res) => {
        console.log('close serialport', res);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function write() {
    serialport
      .write('1234')
      .then((res) => {
        console.log('write serialport: ', res);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function writeBinary() {
    serialport
      .writeBinary(new Uint8Array([1, 2, 3, 4, 5]))
      .then((res) => {
        console.log('write binary serialport: ', res);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function read() {
    serialport
      .read({ timeout: 1 * 1000 })
      .then((res) => {
        console.log('read serialport: ', res);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function listen() {
    serialport
      .listen((data: any[]) => {
        console.log('listen serialport data: ', data);
      }, false)
      .then((res) => {
        console.log('listen serialport: ', res);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function cancelRead() {
    serialport
      .cancelRead()
      .then((res) => {
        console.log('cancel read: ', res);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function closeAll() {
    Serialport.closeAll()
      .then(() => {
        console.log('删除全部成功!');
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function forceClose() {
    Serialport.forceClose('COM4')
      .then(() => {
        console.log('强制删除成功!');
      })
      .catch((err) => {
        console.error(err);
      });
  }
