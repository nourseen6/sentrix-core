/* Stage-one bench model. Pin rules follow hardware/stage1/CONNECTION_SHEET.md. */
(function (root) {
  const boards = [
    {
      id: "npm",
      name: "nPM1300 EK",
      tag: "Power",
      w: 300,
      h: 280,
      x: 16,
      y: 16,
      doc: "https://docs.nordicsemi.com/bundle/ug_npm1300_ek/page/UG/npm1300_ek/using_nrf5340_dk.html",
      limit: "Powers the nRF5340 SoC through P21. LDO voltages exist only after nPM PowerUP is configured. GPIO1–GPIO4 and SHPHLD are left unwired.",
      pins: [
        pin("npm_vout2", "P5.1 VOUT2", "left", "pwr_out", { v: 3.0, detail: "Official. P5 pin 1, default 3.0 V via VSET2, into the DK external supply." }),
        pin("npm_vsys", "VSYS", "left", "pwr_out", { v: 3.7, detail: "Unregulated battery rail. Header designator is Figure 6 of the EK user guide." }),
        pin("npm_gnd", "P5.3 GND", "left", "gnd", { detail: "Official ground to nRF5340 P21 pin 2." }),
        pin("npm_ldoin1", "P8.1 IN1", "left", "pwr_in", { vmax: 5.5, detail: "LDO1 input. Reference feed is VOUT2." }),
        pin("npm_ldoout1", "P8.3 OUT1", "left", "pwr_out", { v: 1.8, derived: "npm_ldoin1", detail: "1.8 V only after LDO mode, P16 fitted, and nPM PowerUP." }),
        pin("npm_ldoin2", "P8.2 IN2", "left", "pwr_in", { vmax: 5.5, detail: "LDO2 input. A 3.3 V output needs a source above 3.3 V, so the feed is VSYS." }),
        pin("npm_ldoout2", "P8.4 OUT2", "left", "pwr_out", { v: 3.3, derived: "npm_ldoin2", detail: "3.3 V rail for the microphone and the haptic driver." }),
        pin("npm_sda", "P11.1 SDA", "right", "sda", { addr: 0x6b, detail: "Official TWI to nRF5340 P1.02. Address 0x6B." }),
        pin("npm_scl", "P11.2 SCL", "right", "scl", { detail: "Official TWI clock to nRF5340 P1.03." }),
        pin("npm_gpio0", "P12.1 GPIO0", "right", "gpio", { dir: "out", detail: "Official interrupt to nRF5340 P1.10 / D8." })
      ]
    },
    {
      id: "nrf",
      name: "nRF5340 DK",
      tag: "MCU · BLE",
      w: 440,
      h: 420,
      x: 340,
      y: 16,
      doc: "https://docs.nordicsemi.com/bundle/ug_nrf5340_dk/page/UG/dk/connector_if.html",
      limit: "Lab kit. SWD stays open. Button 1 (P0.23) stands in for the SOS switch. Sensor GPIOs are a SentriX lab map on free Arduino pins.",
      pins: [
        pin("nrf_p21p", "P21.1 EXT", "left", "pwr_in", { vmax: 3.6, detail: "External supply, 1.7–3.6 V. SW10 ON and SW9 at VDD select this pin." }),
        pin("nrf_gnd", "P21.2 GND", "left", "gnd", { detail: "DK ground." }),
        pin("nrf_vdd", "VDD", "left", "pwr_out", { v: 3.0, derived: "mcu", detail: "SoC rail. 3.0 V from VOUT2, or about 3 V from DK USB when SW9 is USB." }),
        pin("nrf_sda", "D14 P1.02 SDA", "right", "sda", { io: "mcu", detail: "Official TWI data, P4 pin 9." }),
        pin("nrf_scl", "D15 P1.03 SCL", "right", "scl", { io: "mcu", detail: "Official TWI clock, P4 pin 10." }),
        pin("nrf_gpio0", "D8 P1.10", "right", "gpio", { dir: "in", io: "mcu", detail: "Official nPM1300 GPIO0." }),
        pin("nrf_tx", "D2 P1.04 TX", "right", "tx", { dir: "out", io: "mcu", detail: "Lab UART TX toward the nRF9151 RX pin." }),
        pin("nrf_rx", "D3 P1.05 RX", "right", "rx", { dir: "in", io: "mcu", detail: "Lab UART RX from the nRF9151 TX pin." }),
        pin("nrf_sck", "D4 P1.06 SCK", "right", "sck", { dir: "out", io: "mcu", detail: "Lab SPI clock to MAX86176." }),
        pin("nrf_mosi", "D5 P1.07 MOSI", "right", "mosi", { dir: "out", io: "mcu", detail: "Lab SPI MOSI to MAX86176 SDI." }),
        pin("nrf_miso", "D6 P1.08 MISO", "right", "miso", { dir: "in", io: "mcu", detail: "Lab SPI MISO from MAX86176 SDO." }),
        pin("nrf_cs", "D7 P1.09 CS", "right", "cs", { dir: "out", io: "mcu", detail: "Lab SPI chip select." }),
        pin("nrf_ppg", "A0 P0.04 INT", "right", "gpio", { dir: "in", io: "mcu", detail: "Lab PPG interrupt." }),
        pin("nrf_pdmclk", "A1 P0.05 CLK", "right", "pdm_clk", { dir: "out", io: "mcu", detail: "Lab PDM clock." }),
        pin("nrf_pdmdat", "A2 P0.06 DATA", "right", "pdm_data", { dir: "in", io: "mcu", detail: "Lab PDM data." }),
        pin("nrf_imu", "A3 P0.07 INT", "right", "gpio", { dir: "in", io: "mcu", detail: "Lab BMI270 INT1." }),
        pin("nrf_alert", "A5 P0.26 ALERT", "right", "gpio", { dir: "in", io: "mcu", detail: "Lab MAX30208 alert." })
      ]
    },
    {
      id: "modem",
      name: "nRF9151 DK",
      tag: "LTE · GNSS",
      w: 280,
      h: 220,
      x: 820,
      y: 16,
      doc: "https://docs.nordicsemi.com/bundle/ug_nrf9151_dk/page/UG/nrf91_dk/intro.html",
      limit: "Separate USB supply and the DK antenna. Stage one does not feed this board from the nPM1300 EK. Stock Serial Modem firmware still wants flow control and DTR.",
      pins: [
        pin("modem_tx", "P0.02 TX", "left", "tx", { dir: "out", detail: "Serial Modem external-MCU overlay. Connector P4." }),
        pin("modem_rx", "P0.03 RX", "left", "rx", { dir: "in", detail: "Crossed with the nRF5340 TX pin. 115200 baud." }),
        pin("modem_gnd", "GND", "left", "gnd", { detail: "Common ground with the nRF5340 DK." })
      ]
    },
    {
      id: "drv",
      name: "DRV2605EVM-CT",
      tag: "Haptic",
      w: 250,
      h: 240,
      x: 1140,
      y: 16,
      doc: "https://www.ti.com/lit/ug/slou348b/slou348b.pdf",
      limit: "The specification says DRV2605L-class, not a locked part number. EN has to be high before external I2C works.",
      pins: [
        pin("drv_vdd", "VDD", "left", "pwr_in", { vmax: 5.5, detail: "3.3 V from LDO2." }),
        pin("drv_gnd", "GND", "left", "gnd", { detail: "Common ground." }),
        pin("drv_en", "EN", "left", "tie_high", { detail: "Tied high. The EVM I2C port is silent while EN is low." }),
        pin("drv_sda", "SDA", "right", "sda", { addr: 0x5a, detail: "Address 0x5A, fixed." }),
        pin("drv_scl", "SCL", "right", "scl", { detail: "Shared I2C clock." }),
        pin("drv_outp", "OUT+", "right", "haptic_p", { dir: "out", detail: "LRA positive terminal." }),
        pin("drv_outn", "OUT-", "right", "haptic_n", { dir: "out", detail: "LRA negative terminal." })
      ]
    },
    {
      id: "bmi",
      name: "BMI270 shuttle",
      tag: "Motion",
      w: 280,
      h: 260,
      x: 16,
      y: 470,
      doc: "https://www.bosch-sensortec.com/media/boschsensortec/downloads/shuttle_board_flyer/application_board_3_1/bst-bmi270-sf000.pdf",
      limit: "Shuttle pins, hand-wired. The Bosch application board is a separate nRF52840 demo and is not this cable.",
      pins: [
        pin("bmi_vdd", "VDD", "left", "pwr_in", { vmax: 3.6, detail: "1.71–3.6 V from the DK VDD rail." }),
        pin("bmi_vddio", "VDDIO", "left", "pwr_in", { vmax: 3.6, detail: "IO rail, same 3.0 V domain as the DK." }),
        pin("bmi_gnd", "GND", "left", "gnd", { detail: "Shuttle ground." }),
        pin("bmi_csb", "CSB", "left", "tie_high", { detail: "Tied to VDDIO so the host interface is I2C." }),
        pin("bmi_sdo", "SDO", "left", "tie_low", { detail: "Tied to GND. Address 0x68. Left high it would be 0x69." }),
        pin("bmi_scl", "SCL", "right", "scl", { detail: "Shuttle SCK/SCL pin." }),
        pin("bmi_sda", "SDA", "right", "sda", { addr: 0x68, detail: "Shuttle MOSI/SDA pin. Address 0x68 with SDO low." }),
        pin("bmi_int1", "INT1", "right", "gpio", { dir: "out", io: 3.0, detail: "Fall and tap interrupt into the DK." })
      ]
    },
    {
      id: "temp",
      name: "MAX30208",
      tag: "Temperature",
      w: 250,
      h: 230,
      x: 330,
      y: 500,
      doc: "https://www.analog.com/en/products/max30208.html",
      limit: "Signal wiring of the sensor. The stock EV system is hosted by a MAX32630FTHR, not by this DK.",
      pins: [
        pin("temp_vdd", "VDD", "left", "pwr_in", { vmax: 3.6, detail: "1.7–3.6 V from DK VDD." }),
        pin("temp_gnd", "GND", "left", "gnd", { detail: "Sensor ground." }),
        pin("temp_sda", "SDA", "right", "sda", { addr: 0x50, detail: "Default 7-bit address 0x50 when GPIO0 and GPIO1 read low." }),
        pin("temp_scl", "SCL", "right", "scl", { detail: "Shared I2C clock." }),
        pin("temp_alert", "ALERT", "right", "gpio", { dir: "out", io: 3.0, detail: "GPIO0 as the alert output." })
      ]
    },
    {
      id: "ppg",
      name: "MAX86176",
      tag: "PPG · ECG",
      w: 270,
      h: 280,
      x: 620,
      y: 470,
      doc: "https://www.analog.com/en/products/max86176.html",
      limit: "SPI signals of the part. MAX86176EVSYS brings its own MCU and a Bluetooth dongle; that USB demo is not this connector.",
      pins: [
        pin("ppg_vdd", "VDD 1V8", "left", "pwr_in", { vmax: 2.0, detail: "Analog rail from LDO1 at 1.8 V. Digital IO is treated as that same rail because the specification names no second IO supply." }),
        pin("ppg_gnd", "GND", "left", "gnd", { detail: "AFE ground." }),
        pin("ppg_sck", "SCLK", "right", "sck", { dir: "in", io: 1.8, detail: "SPI clock." }),
        pin("ppg_sdi", "SDI", "right", "mosi", { dir: "in", io: 1.8, detail: "SPI data in." }),
        pin("ppg_sdo", "SDO", "right", "miso", { dir: "out", io: 1.8, detail: "SPI data out." }),
        pin("ppg_cs", "CSB", "right", "cs", { dir: "in", io: 1.8, detail: "Chip select, active low." }),
        pin("ppg_int", "INT", "right", "gpio", { dir: "out", io: 1.8, detail: "FIFO / data-ready interrupt." })
      ]
    },
    {
      id: "mic",
      name: "IM69D130 flex",
      tag: "Microphone",
      w: 250,
      h: 240,
      x: 930,
      y: 430,
      doc: "https://www.infineon.com/evaluation-board/EVAL-IM69D130-FLEXKIT",
      limit: "Flex adapter pins. SELECT tied low picks the left PDM channel. Shield2Go is a different board: it converts PDM to I2S.",
      pins: [
        pin("mic_vdd", "1 VDD", "left", "pwr_in", { vmax: 3.6, detail: "Adapter pin 1. Specification rail is 3.3 V." }),
        pin("mic_gnd", "GND", "left", "gnd", { detail: "Adapter ground." }),
        pin("mic_sel", "4 SELECT", "left", "tie_low", { detail: "Adapter pin 4. Tied to GND for the left channel." }),
        pin("mic_data", "2 DATA", "right", "pdm_data", { dir: "out", io: 3.3, detail: "Adapter pin 2, PDM data." }),
        pin("mic_clk", "3 CLOCK", "right", "pdm_clk", { dir: "in", io: 3.3, detail: "Adapter pin 3, PDM clock." })
      ]
    },
    {
      id: "lra",
      name: "LRA",
      tag: "Actuator",
      w: 180,
      h: 150,
      x: 1220,
      y: 360,
      doc: "https://www.ti.com/lit/ug/slou348b/slou348b.pdf",
      limit: "Discrete actuator on the driver OUT block. The EVM's onboard LRA is disconnected when an external one is fitted.",
      pins: [
        pin("lra_p", "LRA +", "left", "haptic_p", { dir: "in", detail: "Positive lead." }),
        pin("lra_n", "LRA −", "left", "haptic_n", { dir: "in", detail: "Negative lead." })
      ]
    }
  ];

  const referencePairs = [
    ["npm_vout2", "nrf_p21p"],
    ["npm_gnd", "nrf_gnd"],
    ["npm_sda", "nrf_sda"],
    ["npm_scl", "nrf_scl"],
    ["npm_gpio0", "nrf_gpio0"],
    ["npm_vout2", "npm_ldoin1"],
    ["npm_vsys", "npm_ldoin2"],
    ["npm_ldoout1", "ppg_vdd"],
    ["npm_ldoout2", "mic_vdd"],
    ["npm_ldoout2", "drv_vdd"],
    ["nrf_vdd", "bmi_vdd"],
    ["nrf_vdd", "bmi_vddio"],
    ["nrf_vdd", "temp_vdd"],
    ["nrf_gnd", "bmi_gnd"],
    ["nrf_gnd", "temp_gnd"],
    ["nrf_gnd", "ppg_gnd"],
    ["nrf_gnd", "mic_gnd"],
    ["nrf_gnd", "drv_gnd"],
    ["nrf_gnd", "modem_gnd"],
    ["bmi_scl", "nrf_scl"],
    ["bmi_sda", "nrf_sda"],
    ["bmi_csb", "bmi_vddio"],
    ["bmi_sdo", "bmi_gnd"],
    ["bmi_int1", "nrf_imu"],
    ["temp_sda", "nrf_sda"],
    ["temp_scl", "nrf_scl"],
    ["temp_alert", "nrf_alert"],
    ["ppg_sck", "nrf_sck"],
    ["ppg_sdi", "nrf_mosi"],
    ["ppg_sdo", "nrf_miso"],
    ["ppg_cs", "nrf_cs"],
    ["ppg_int", "nrf_ppg"],
    ["mic_clk", "nrf_pdmclk"],
    ["mic_data", "nrf_pdmdat"],
    ["mic_sel", "mic_gnd"],
    ["nrf_tx", "modem_rx"],
    ["nrf_rx", "modem_tx"],
    ["drv_sda", "nrf_sda"],
    ["drv_scl", "nrf_scl"],
    ["drv_en", "drv_vdd"],
    ["drv_outp", "lra_p"],
    ["drv_outn", "lra_n"]
  ];

  function pin(id, label, side, kind, extra) {
    return Object.assign({ id, label, side, kind, dir: "bidir" }, extra || {});
  }

  function place(board) {
    const left = board.pins.filter((p) => p.side !== "right");
    const right = board.pins.filter((p) => p.side === "right");
    const step = 22;
    const top = 52;
    left.forEach((p, i) => { p.lx = 0; p.ly = top + i * step; });
    right.forEach((p, i) => { p.lx = board.w; p.ly = top + i * step; });
    const n = Math.max(left.length, right.length, 1);
    board.h = Math.max(top + n * step + 18, 120);
  }

  boards.forEach(place);

  const pinById = {};
  const boardByPin = {};
  boards.forEach((board) => {
    board.pins.forEach((p) => {
      pinById[p.id] = p;
      boardByPin[p.id] = board;
      if (p.dir === "bidir" && (p.kind === "pwr_out" || p.kind === "tx" || p.kind === "haptic_p" || p.kind === "haptic_n")) p.dir = "out";
      if (p.dir === "bidir" && (p.kind === "pwr_in" || p.kind === "rx" || p.kind === "tie_high" || p.kind === "tie_low")) p.dir = "in";
      if (p.kind === "gnd" || p.kind === "sda" || p.kind === "scl") p.dir = "bidir";
    });
  });

  function defaultPower() {
    return { vbat: true, vbus: false, sw10: true, sw9: "vdd", modemUsb: true };
  }

  function referenceWires() {
    return referencePairs.map(([a, b]) => ({ a, b }));
  }

  function cloneWires(wires) {
    return wires.map((w) => ({ a: w.a, b: w.b }));
  }

  const MIX = {
    sda: ["sda"],
    scl: ["scl"],
    tx: ["tx", "rx"],
    rx: ["tx", "rx"],
    sck: ["sck"],
    mosi: ["mosi"],
    miso: ["miso"],
    cs: ["cs"],
    pdm_clk: ["pdm_clk"],
    pdm_data: ["pdm_data"],
    gpio: ["gpio"],
    haptic_p: ["haptic_p"],
    haptic_n: ["haptic_n"]
  };

  function validate(wires, power) {
    const errors = [];
    const warnings = [];
    const seen = new Set();
    wires.forEach((w) => {
      if (!pinById[w.a] || !pinById[w.b]) errors.push({ id: "missing-pin", text: "A wire lands on a pin that is not on this bench." });
      const key = [w.a, w.b].sort().join("|");
      if (seen.has(key)) errors.push({ id: "dup-" + key, text: "The same two pins are wired twice." });
      seen.add(key);
      if (w.a === w.b) errors.push({ id: "loop", text: "A pin is wired to itself." });
    });

    const parent = {};
    function find(id) {
      if (parent[id] !== id) parent[id] = find(parent[id]);
      return parent[id];
    }
    function unite(a, b) {
      const pa = find(a);
      const pb = find(b);
      if (pa !== pb) parent[pa] = pb;
    }
    Object.keys(pinById).forEach((id) => { parent[id] = id; });
    wires.forEach((w) => { if (pinById[w.a] && pinById[w.b]) unite(w.a, w.b); });

    const groups = {};
    Object.keys(pinById).forEach((id) => {
      const rootId = find(id);
      if (!groups[rootId]) groups[rootId] = [];
      groups[rootId].push(pinById[id]);
    });
    const nets = Object.keys(groups)
      .map((id) => groups[id])
      .filter((pins) => pins.length > 1);

    nets.forEach((pins, index) => {
      const kinds = {};
      pins.forEach((p) => { kinds[p.kind] = true; });
      const signal = Object.keys(kinds).filter((k) => MIX[k]);
      if (signal.length) {
        const allowed = MIX[signal[0]];
        signal.forEach((k) => {
          if (allowed.indexOf(k) === -1) {
            errors.push({ id: "mix-" + index, text: "Net mixes " + signal.join(" and ") + ". " + labelOf(pins) + "." });
          }
        });
        Object.keys(kinds).forEach((k) => {
          if (k !== "gnd" && !MIX[k] && k !== "tie_high" && k !== "tie_low" && k !== "pwr_out" && k !== "pwr_in") return;
          if (k === "pwr_out" || k === "pwr_in" || k === "gnd" || k === "tie_high" || k === "tie_low") {
            errors.push({ id: "power-data-" + index, text: "Power or ground is tied to a data pin. " + labelOf(pins) + "." });
          }
        });
      }
      const drivers = pins.filter((p) => p.dir === "out" && p.kind !== "pwr_out");
      if (drivers.length > 1 && signal.length) {
        errors.push({ id: "fight-" + index, text: "Two outputs drive one net (" + drivers.map((p) => p.label).join(", ") + ")." });
      }
      const supplies = pins.filter((p) => p.kind === "pwr_out");
      if (supplies.length > 1) {
        errors.push({ id: "supply-short-" + index, text: "Two regulator outputs are tied: " + supplies.map((p) => p.label).join(" and ") + "." });
      }
      supplies.forEach((src) => {
        pins.filter((p) => p.kind === "pwr_in" && p.vmax != null).forEach((dst) => {
          if (src.v > dst.vmax + 0.05) {
            errors.push({ id: "overvolt-" + src.id + "-" + dst.id, text: src.label + " at " + src.v.toFixed(1) + " V exceeds " + dst.label + " (max " + dst.vmax.toFixed(1) + " V)." });
          }
        });
      });
      if (kinds.tie_high && (kinds.gnd || kinds.tie_low)) {
        errors.push({ id: "tie-short-" + index, text: "A pin that must sit high is tied to ground." });
      }
      const ioPins = pins.filter((p) => p.io != null || p.io === "mcu");
      if (ioPins.length >= 2 && signal.length) {
        const volts = ioPins.map((p) => (p.io === "mcu" ? 3.0 : p.io)).filter((v) => typeof v === "number");
        if (volts.length >= 2) {
          const hi = Math.max.apply(null, volts);
          const lo = Math.min.apply(null, volts);
          if (hi - lo > 0.25) {
            warnings.push({ id: "io-" + signal[0] + "-" + index, text: signal[0].toUpperCase() + " net spans " + lo.toFixed(1) + " V and " + hi.toFixed(1) + " V IO. " + labelOf(ioPins) + "." });
          }
        }
      }
    });

    const gndParent = {};
    boards.forEach((b) => { gndParent[b.id] = b.id; });
    function gndFind(id) {
      if (gndParent[id] !== id) gndParent[id] = gndFind(gndParent[id]);
      return gndParent[id];
    }
    nets.forEach((pins) => {
      if (!pins.every((p) => p.kind === "gnd" || p.kind === "tie_low")) return;
      const ids = unique(pins.map((p) => boardByPin[p.id].id).filter((id) => boardHasGnd(id)));
      for (let i = 1; i < ids.length; i++) gndParent[gndFind(ids[i])] = gndFind(ids[0]);
    });

    nets.forEach((pins, index) => {
      const data = pins.some((p) => MIX[p.kind] || p.kind === "pwr_out" || p.kind === "pwr_in");
      if (!data) return;
      const ids = unique(pins.map((p) => boardByPin[p.id].id).filter((id) => boardHasGnd(id)));
      for (let i = 1; i < ids.length; i++) {
        if (gndFind(ids[i]) !== gndFind(ids[0])) {
          errors.push({ id: "gnd-" + index, text: boardName(ids[0]) + " and " + boardName(ids[i]) + " share a net and do not share ground." });
          break;
        }
      }
    });

    const live = {};
    const pmicOn = !!(power && (power.vbat || power.vbus));
    if (pmicOn) live.npm_vout2 = true;
    if (pmicOn && power.vbat) live.npm_vsys = true;
    let guard = 0;
    let grew = true;
    while (grew && guard < 12) {
      grew = false;
      guard += 1;
      nets.forEach((pins) => {
        const fed = pins.some((p) => p.kind === "pwr_out" && live[p.id]);
        if (!fed) return;
        pins.forEach((p) => {
          if (p.kind === "pwr_in" && !live[p.id]) {
            live[p.id] = true;
            grew = true;
          }
        });
      });
      boards.forEach((board) => {
        board.pins.forEach((p) => {
          if (p.kind !== "pwr_out" || !p.derived || live[p.id]) return;
          const ready = p.derived === "mcu" ? mcuOn(power, live) : !!live[p.derived];
          if (ready) {
            live[p.id] = true;
            grew = true;
          }
        });
      });
    }

    const sdaNet = netPins(nets, "nrf_sda");
    const addrs = {};
    if (sdaNet) {
      sdaNet.filter((p) => p.addr != null).forEach((p) => {
        const key = "0x" + p.addr.toString(16);
        if (addrs[key]) errors.push({ id: "addr-" + key, text: "I2C address " + key + " is claimed by two devices." });
        addrs[key] = p.id;
      });
    }
    if (pinOnNet(nets, "bmi_sda", "nrf_sda") && !tiedHigh(nets, "bmi_csb")) {
      errors.push({ id: "bmi-cs", text: "BMI270 SDA is connected and CSB is not tied high, so the part is not in I2C mode." });
    }
    if (pinOnNet(nets, "bmi_sda", "nrf_sda") && !pinOnNet(nets, "bmi_sdo", "bmi_gnd")) {
      warnings.push({ id: "bmi-addr", text: "BMI270 SDO is not tied to GND. The 0x68 address used by this bench is not selected." });
    }
    if (sdaNet && sdaNet.some((p) => p.id === "nrf_sda")) {
      warnings.push({ id: "i2c-pullups", text: "I2C pull-ups are not wires. Short DK solder bridge SB32, or fit resistors from SDA and SCL to VDD." });
    }
    if (pinOnNet(nets, "nrf_tx", "modem_rx") || pinOnNet(nets, "nrf_rx", "modem_tx")) {
      warnings.push({ id: "uart-flow", text: "TX/RX only. Stock Serial Modem firmware also wants RTS, CTS, and DTR until the external-MCU overlay turns them off, and VCOM0/VCOM1 must be released." });
      warnings.push({ id: "uart-level", text: "Match nRF9151 VDD_GPIO to the nRF5340 VDD before trusting the UART levels. The DK user guide is the source for VDD_GPIO." });
    }
    if (live.npm_ldoout1 || live.npm_ldoout2) {
      warnings.push({ id: "ldo-config", text: "LDO1 is assumed 1.8 V and LDO2 3.3 V. Those numbers come from nPM PowerUP, not from plugging the cable in." });
    }

    const mcu = mcuOn(power, live);
    const modem = !!(power && power.modemUsb);
    const i2c = !!(mcu && pmicOn && pinOnNet(nets, "nrf_sda", "npm_sda") && pinOnNet(nets, "nrf_scl", "npm_scl") && sameGround("nrf", "npm"));
    const links = {
      mcu,
      pmic: pmicOn,
      modem,
      i2c,
      uart: !!(mcu && modem && pinOnNet(nets, "nrf_tx", "modem_rx") && pinOnNet(nets, "nrf_rx", "modem_tx") && sameGround("nrf", "modem")),
      spi: !!(mcu && live.ppg_vdd && pinOnNet(nets, "nrf_sck", "ppg_sck") && pinOnNet(nets, "nrf_mosi", "ppg_sdi") && pinOnNet(nets, "nrf_miso", "ppg_sdo") && pinOnNet(nets, "nrf_cs", "ppg_cs")),
      ppgInt: pinOnNet(nets, "nrf_ppg", "ppg_int"),
      pdm: !!(mcu && live.mic_vdd && pinOnNet(nets, "nrf_pdmclk", "mic_clk") && pinOnNet(nets, "nrf_pdmdat", "mic_data")),
      imu: !!(mcu && live.bmi_vdd && live.bmi_vddio && i2c && pinOnNet(nets, "bmi_sda", "nrf_sda") && pinOnNet(nets, "bmi_int1", "nrf_imu") && tiedHigh(nets, "bmi_csb")),
      temp: !!(mcu && live.temp_vdd && i2c && pinOnNet(nets, "temp_sda", "nrf_sda") && pinOnNet(nets, "temp_alert", "nrf_alert")),
      haptic: !!(mcu && live.drv_vdd && i2c && pinOnNet(nets, "drv_sda", "nrf_sda") && tiedHigh(nets, "drv_en") && pinOnNet(nets, "drv_outp", "lra_p") && pinOnNet(nets, "drv_outn", "lra_n")),
      vdd: !!live.nrf_vdd
    };

    const rawWarnings = uniqueBy(warnings, "id");
    const ioNotes = rawWarnings.filter((w) => w.id.indexOf("io-") === 0);
    const kept = rawWarnings.filter((w) => w.id.indexOf("io-") !== 0);
    if (ioNotes.some((w) => w.text.indexOf("1.8") !== -1)) {
      kept.push({ id: "io-1v8", text: "MAX86176 SPI and interrupt sit at 1.8 V. The nRF5340 DK IO is at 3.0 V. The specification assigns those rails and does not name a level shifter." });
    }
    if (ioNotes.some((w) => w.text.indexOf("3.3") !== -1)) {
      kept.push({ id: "io-3v3", text: "Microphone PDM is at 3.3 V into DK pins at 3.0 V. Keep the two IO rails in mind before a real cable." });
    }

    return {
      errors: uniqueBy(errors, "id"),
      warnings: kept,
      links,
      live
    };

    function sameGround(a, b) {
      return gndFind(a) === gndFind(b);
    }
  }

  function mcuOn(power, live) {
    if (!power) return false;
    if (power.sw9 === "usb") return true;
    return power.sw9 === "vdd" && !!power.sw10 && !!live.nrf_p21p;
  }

  function boardHasGnd(id) {
    const board = boards.find((b) => b.id === id);
    return !!board && board.pins.some((p) => p.kind === "gnd");
  }

  function boardName(id) {
    const board = boards.find((b) => b.id === id);
    return board ? board.name : id;
  }

  function labelOf(pins) {
    return pins.map((p) => boardName(boardByPin[p.id].id) + " " + p.label).join(", ");
  }

  function netPins(nets, pinId) {
    return nets.find((pins) => pins.some((p) => p.id === pinId)) || null;
  }

  function pinOnNet(nets, a, b) {
    const net = netPins(nets, a);
    return !!net && net.some((p) => p.id === b);
  }

  function tiedHigh(nets, pinId) {
    const net = netPins(nets, pinId);
    if (!net) return false;
    return net.some((p) => p.kind === "pwr_out" || p.kind === "pwr_in");
  }

  function unique(list) {
    const out = [];
    list.forEach((item) => { if (out.indexOf(item) === -1) out.push(item); });
    return out;
  }

  function uniqueBy(list, key) {
    const seen = {};
    return list.filter((item) => {
      if (seen[item[key]]) return false;
      seen[item[key]] = true;
      return true;
    });
  }

  function bringup(report, power) {
    const lines = [];
    if (report.errors.length) {
      lines.push("Power stays off. The net has a fault.");
      report.errors.forEach((e) => lines.push("FAULT  " + e.text));
      return lines;
    }
    const L = report.links;
    const sw9 = power && power.sw9 === "usb" ? "USB" : "VDD";
    lines.push("Bench supplies applied. PMIC input " + (L.pmic ? "present" : "absent") + ". SW9 is " + sw9 + ".");
    lines.push(L.vdd ? "nRF5340 VDD is up." : "nRF5340 VDD is down. SW10, SW9, and the P21 cable decide that.");
    if (L.i2c) lines.push("I2C scan  0x6B nPM1300   0x68 BMI270   0x50 MAX30208   0x5A DRV2605");
    else lines.push("I2C scan skipped. TWI cable or a rail is open.");
    lines.push(L.spi ? "MAX86176 SPI selected. No skin contact yet, optical count is flat." : "MAX86176 SPI is open.");
    lines.push(L.pdm ? "PDM clock running. Microphone idle." : "PDM is open.");
    lines.push(L.uart ? "UART 115200 crossed to nRF9151. Modem USB is up." : "Modem UART is not a link yet.");
    lines.push("Button 1 (P0.23) is the SOS input. It does not wait for a model.");
    return lines;
  }

  function stimulus(report, scenario, action) {
    const lines = [];
    const L = report.links;
    if (report.errors.length) {
      lines.push("Stimulus ignored. Clear the faults first.");
      return { lines, wave: [] };
    }
    if (!L.mcu) {
      lines.push("SoC rail is down, so the DK cannot see the stimulus.");
      return { lines, wave: flatWave() };
    }
    if (action === "sos") {
      lines.push("P0.23 Button 1 pressed.");
      lines.push("SOS is local. No model was asked.");
      path(lines, L, scenario, "sos");
      return { lines, wave: waveFor(scenario, L) };
    }
    if (scenario.motion === "fall") {
      if (L.imu) {
        lines.push("BMI270 INT1  fall signature. Accelerometer left the rest window.");
        path(lines, L, scenario, "fall");
      } else lines.push("Fall stimulus is on the bench, and the IMU interrupt is not a closed link.");
    } else if (scenario.motion === "walk") {
      lines.push(L.imu ? "BMI270 periodic samples. Motion is walking, interrupt stays quiet." : "Walk stimulus has no IMU link.");
    } else {
      lines.push(L.imu ? "BMI270 at rest. About 1 g, gyro near zero." : "IMU link is open.");
    }
    if (scenario.ppg === "contact") {
      lines.push(L.spi ? "MAX86176 INT  pulsatile optical count." : "PPG contact has no SPI link.");
    } else lines.push(L.spi ? "MAX86176 optical count flat. No skin contact." : "PPG link is open.");
    if (L.temp) {
      const hot = scenario.temp >= 38;
      lines.push("MAX30208 " + scenario.temp.toFixed(1) + " °C." + (hot ? " ALERT pin asserted." : " Alert threshold not crossed."));
    }
    if (scenario.mic === "tone") lines.push(L.pdm ? "PDM data is a test tone, not a person." : "Tone has no PDM link.");
    else lines.push(L.pdm ? "PDM idle." : "Microphone link is open.");
    return { lines, wave: waveFor(scenario, L) };
  }

  function path(lines, links, scenario, why) {
    if (links.haptic) lines.push("DRV2605 0x5A effect 1, strong click, on the external LRA.");
    else lines.push("Haptic driver is not a closed link, so the pulse stays in the log only.");
    if (scenario.phone === "near") {
      lines.push("BLE notify to the paired phone. Payload: " + why + ". Lab fixture, no user.");
      return;
    }
    lines.push("No phone on BLE.");
    if (links.uart && scenario.lte === "up") {
      lines.push("UART TX  AT");
      lines.push("nRF9151    Ready");
      lines.push("UART TX  AT+CFUN=1");
      lines.push("UART TX  AT#XSEND \"" + why + ",lab,0,0\"");
      lines.push("nRF9151    OK  lab coordinate, not a person");
      return;
    }
    if (!links.uart) lines.push("Modem UART is down, so the alert stays on the bench.");
    else lines.push("UART is wired and the network scenario is unregistered. Alert stays on the bench.");
  }

  function waveFor(scenario, links) {
    if (!(links && links.spi)) return [];
    const contact = scenario.ppg === "contact";
    const out = [];
    for (let i = 0; i < 64; i++) {
      const t = i / 64;
      if (!contact) {
        out.push(8);
        continue;
      }
      const phase = (t * 3) % 1;
      const beat = Math.exp(-Math.pow(phase - 0.25, 2) / 0.008);
      out.push(18 + beat * 70);
    }
    return out;
  }

  function flatWave() {
    return [];
  }

  root.SentriXBench = {
    boards,
    pinById,
    boardByPin,
    defaultPower,
    referenceWires,
    cloneWires,
    validate,
    bringup,
    stimulus
  };
})(typeof globalThis !== "undefined" ? globalThis : this);
