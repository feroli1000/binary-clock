class BinaryDecimalClock {

  constructor(table_id) {
    // Constants
    this.TABLE = document.getElementById(table_id);
    this.IMG_ON = './img/ton.jpg';
    this.IMG_OFF = './img/toff.jpg';
    this.OBJ_TIME = {
      hor_1: 0,
      hor_2: 0,
      min_1: 0,
      min_2: 0,
      seg_1: 0,
      seg_2: 0
    };
    // Variables
    this.time_mode = 'system';
    this.interval_id = 0;
  }

  init() {
    this.clearTable();
    this.createHead();
    this.createBody();
    this.createFoot();
    this.interval_id = window.setInterval(() => {
      this.printClock();
    }, 1000);
  }

  clearTable() {
    this.TABLE.innerHTML = '';
  }

  createHead() {
    const thead = document.createElement('thead');
    const tr = document.createElement('tr');
    tr.innerHTML =
      `<th>&nbsp;</th>
    <th>H</th>
    <th>H</th>
    <th>M</th>
    <th>M</th>
    <th>S</th>
    <th>S</th>`;
    thead.append(tr);
    this.TABLE.append(thead);
  }

  createBody() {
    const createTd = (content) => {
      const td = document.createElement('td');
      td.innerHTML = content;
      return td;
    };
    const tdEmpty = () => createTd('');
    const tdNumber = (num) => createTd(num);
    const tdFull = (id) => createTd(`<img id="${id}" src="${this.IMG_OFF}" />`);

    // Row  "8" = | 8 | _ | O | _ | O | _ | O |
    const tr8 = document.createElement('tr');
    tr8.append(
      tdNumber(8),
      tdEmpty(),
      tdFull('img_h8_2'),
      tdEmpty(),
      tdFull('img_m8_2'),
      tdEmpty(),
      tdFull('img_s8_2')
    );
    // Row "4" = | 4 | _ | O | O | O |
    const tr4 = document.createElement('tr');
    tr4.append(
      tdNumber(4),
      tdEmpty(),
      tdFull('img_h4_2'),
      tdFull('img_m4_1'),
      tdFull('img_m4_2'),
      tdFull('img_s4_1'),
      tdFull('img_s4_2')
    );
    // Row "2" = | 2 | O | O | O | O |
    const tr2 = document.createElement('tr');
    tr2.append(
      tdNumber(2),
      tdFull('img_h2_1'),
      tdFull('img_h2_2'),
      tdFull('img_m2_1'),
      tdFull('img_m2_2'),
      tdFull('img_s2_1'),
      tdFull('img_s2_2')
    );
    // Row "1" = | 1 | O | O | O | O |
    const tr1 = document.createElement('tr');
    tr1.append(
      tdNumber(1),
      tdFull('img_h1_1'),
      tdFull('img_h1_2'),
      tdFull('img_m1_1'),
      tdFull('img_m1_2'),
      tdFull('img_s1_1'),
      tdFull('img_s1_2')
    );
    const tbody = document.createElement('tbody');
    tbody.append(tr8, tr4, tr2, tr1);
    // Append rows in table
    this.TABLE.append(tbody);
  }

  createFoot() {
    const tfoot = document.createElement('tfoot');
    const tr1 = document.createElement('tr');
    const tr2 = document.createElement('tr');
    const tr3 = document.createElement('tr');
    tr1.innerHTML = `
      <th>&nbsp;</th>
      <th id="thor_1"></th>
      <th id="thor_2"></th>
      <th id="tmin_1"></th>
      <th id="tmin_2"></th>
      <th id="tseg_1"></th>
      <th id="tseg_2"></th>`;
    tr2.innerHTML = `
      <th id="clock-time" colspan="7"></th>`;
    tr3.innerHTML = `
      <th colspan="2"><button id="btn-system" class="btn btn-primary" data-mode="system">System Time</button></th>
      <th colspan="2"><button id="btn-random" class="btn btn-secondary" data-mode="random">Random Time</button></th>
      <th colspan="3" id="time-mode">
        <button id="btn-imperative" class="btn btn-secondary" data-mode="imperative">Imperative Time</button>
        <input id="imp-time" type="text" class="form-control" placeholder="hh:mm:ss" maxlength="8" value="18:23:57">
      </th>`;
    tfoot.append(tr1, tr2, tr3);
    this.TABLE.append(tfoot);
    const table_id = this.TABLE.getAttribute('id');
    const buttons = document.querySelectorAll(`#${table_id} tfoot button`);
    const _self = this;
    buttons.forEach(elem => {
      elem.addEventListener("click", function () {
        const mode = this.getAttribute('data-mode');
        _self.setTimeMode(mode);
      }, false);
    });
  }

  setTimeMode(mode) {
    this.time_mode = mode;
    const btn_system = document.getElementById('btn-system');
    const btn_random = document.getElementById('btn-random');
    const btn_imperative = document.getElementById('btn-imperative');
    const toogleClass = (elem, class_out, class_in) => {
      elem.classList.remove(class_out);
      elem.classList.add(class_in);
    };
    [btn_system, btn_random, btn_imperative].forEach(elem => {
      toogleClass(elem, 'btn_primay', 'btn-secondary');
    });
    if (mode === 'system') {
      toogleClass(btn_system, 'btn-secondary', 'btn-primary');
      // Restart looping interval
      this.init();
      return;
    }
    if (mode === 'random') {
      toogleClass(btn_random, 'btn-secondary', 'btn-primary');
    }
    if (mode === 'imperative') {
      toogleClass(btn_imperative, 'btn-secondary', 'btn-primary');
    }
    // Stop looping interval
    window.clearInterval(this.interval_id);
    this.printClock();
  }

  getTimeByMode() {
    const dt = new Date();

    if (this.time_mode === 'system') {
      return dt;
    }
    if (this.time_mode === 'random') {
      const random = (limit) => Math.floor(Math.random() * (limit + 1));
      const hours = random(23)  // 0..23
      const minutes = random(59); // 0..59
      const seconds = random(59); // 0..59
      dt.setHours(hours, minutes, seconds);
      return dt;
    }
    if (this.time_mode === 'imperative') {
      const isValidTime = (value) => /^([0-1][0-9]|[2][0-3]):([0-5][0-9]):([0-5][0-9])$/.test(value);
      const time = document.getElementById("imp-time").value;
      if (!isValidTime(time)) {
        alert(`${time} is not a valid time`);
        return null;
      }
      const hours = parseInt(time.substr(0, 2), 10);
      const minutes = parseInt(time.substr(3, 2), 10);
      const seconds = parseInt(time.substr(6, 2), 10);
      dt.setHours(hours, minutes, seconds);
      return dt;
    }
  }

  getBinaryTime() {
    const dt = this.getTimeByMode();
    if (!dt) {
      return;
    }
    const hours = dt.getHours().toString().padStart(2, '0'); // '00'..'23'
    const minutes = dt.getMinutes().toString().padStart(2, '0'); // '00'..'59'
    const seconds = dt.getSeconds().toString().padStart(2, '0'); // '00'..'59'
    this.OBJ_TIME = {
      hor_1: Number(hours.slice(0, 1)), // digit 1
      hor_2: Number(hours.slice(1)),    // digit 2
      min_1: Number(minutes.slice(0, 1)),
      min_2: Number(minutes.slice(1)),
      seg_1: Number(seconds.slice(0, 1)),
      seg_2: Number(seconds.slice(1))
    };
  }

  showHumanTime() {
    // Show values on cells of tfoot
    ['hor_1', 'hor_2', 'min_1', 'min_2', 'seg_1', 'seg_2'].forEach(elem => {
      document.getElementById(`t${elem}`).innerHTML = this.OBJ_TIME[elem];
    });
    const { hor_1, hor_2, min_1, min_2, seg_1, seg_2 } = this.OBJ_TIME;
    const time = `${hor_1}${hor_2}:${min_1}${min_2}:${seg_1}${seg_2}`;
    document.getElementById('clock-time').innerHTML = time;
  }

  printClock() {
    this.getBinaryTime();
    this.showHumanTime();

    const element = (id) => document.getElementById(id);
    const getSignal = (row, value) => {
      let ret = null;
      (row === 8) && (ret = [8, 9].indexOf(value) > -1 ? this.IMG_ON : this.IMG_OFF);
      (row === 4) && (ret = [4, 5, 6, 7].indexOf(value) > -1 ? this.IMG_ON : this.IMG_OFF);
      (row === 2) && (ret = [2, 3, 6, 7].indexOf(value) > -1 ? this.IMG_ON : this.IMG_OFF);
      (row === 1) && (ret = [1, 3, 5, 7, 9].indexOf(value) > -1 ? this.IMG_ON : this.IMG_OFF);
      return ret;
    }
    const objTime = this.OBJ_TIME;
    // Hours - 1º digit
    element('img_h2_1').src = getSignal(2, objTime.hor_1);
    element('img_h1_1').src = getSignal(1, objTime.hor_1);
    // Hours - 2º digit
    element('img_h8_2').src = getSignal(8, objTime.hor_2);
    element('img_h4_2').src = getSignal(4, objTime.hor_2);
    element('img_h2_2').src = getSignal(2, objTime.hor_2);
    element('img_h1_2').src = getSignal(1, objTime.hor_2);
    // Minutes - 1º digit
    element('img_m4_1').src = getSignal(4, objTime.min_1);
    element('img_m2_1').src = getSignal(2, objTime.min_1);
    element('img_m1_1').src = getSignal(1, objTime.min_1);
    // Minutes - 2º digit
    element('img_m8_2').src = getSignal(8, objTime.min_2);
    element('img_m4_2').src = getSignal(4, objTime.min_2);
    element('img_m2_2').src = getSignal(2, objTime.min_2);
    element('img_m1_2').src = getSignal(1, objTime.min_2);
    // Seconds - 1º digit
    element('img_s4_1').src = getSignal(4, objTime.seg_1);
    element('img_s2_1').src = getSignal(2, objTime.seg_1);
    element('img_s1_1').src = getSignal(1, objTime.seg_1);
    // Seconds - 2º digit
    element('img_s8_2').src = getSignal(8, objTime.seg_2);
    element('img_s4_2').src = getSignal(4, objTime.seg_2);
    element('img_s2_2').src = getSignal(2, objTime.seg_2);
    element('img_s1_2').src = getSignal(1, objTime.seg_2);
  }

}