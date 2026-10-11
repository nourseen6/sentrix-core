(function () {
  const Bench = globalThis.SentriXBench;
  const THREE = globalThis.THREE;
  const wrap = document.getElementById("bench-wrap");
  const SCALE = 0.011;
  const ORIGIN_X = 760;
  const ORIGIN_Z = 410;

  const state = {
    wires: [],
    powerOn: false,
    power: Bench.defaultPower(),
    scenario: { motion: "rest", ppg: "none", phone: "away", lte: "up", temp: 36.5, mic: "quiet" },
    draft: null,
    selectedWire: -1,
    selectedPin: null,
    selectedBoard: null,
    log: ["Bench idle. Load the reference net, or wire a pin to a pin."],
    wave: []
  };

  const $ = (id) => document.getElementById(id);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.setClearColor(0xc9bfb0);
  wrap.insertBefore(renderer.domElement, wrap.firstChild);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.05, 80);
  const target = new THREE.Vector3(0, 0, 0);
  const spherical = new THREE.Spherical(13, 1.05, 0.45);
  const world = new THREE.Group();
  scene.add(world);

  const table = new THREE.Mesh(
    new THREE.PlaneGeometry(28, 18),
    new THREE.MeshStandardMaterial({ color: 0xd7cbb8, roughness: 0.92 })
  );
  table.rotation.x = -Math.PI / 2;
  table.receiveShadow = true;
  scene.add(table);

  scene.add(new THREE.HemisphereLight(0xf4efe6, 0x8a7560, 0.85));
  const sun = new THREE.DirectionalLight(0xfff6e8, 1.15);
  sun.position.set(6, 10, 4);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  scene.add(sun);

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const draftLine = new THREE.Line(
    new THREE.BufferGeometry(),
    new THREE.LineBasicMaterial({ color: 0xf4efe6 })
  );
  draftLine.visible = false;
  scene.add(draftLine);

  let pointerDown = null;

  $("load").addEventListener("click", () => {
    state.wires = Bench.referenceWires();
    state.selectedWire = -1;
    note("Reference net loaded from the stage-one connection sheet.");
    refresh();
  });
  $("clear").addEventListener("click", () => {
    state.wires = [];
    state.powerOn = false;
    state.selectedWire = -1;
    note("Wires cleared. Power is off.");
    refresh();
  });
  $("power").addEventListener("click", () => {
    const report = Bench.validate(state.wires, state.power);
    if (report.errors.length) {
      state.powerOn = false;
      note(Bench.bringup(report, state.power).join("\n"));
      refresh();
      return;
    }
    state.powerOn = !state.powerOn;
    if (state.powerOn) {
      const lines = Bench.bringup(report, state.power);
      const stim = Bench.stimulus(report, state.scenario, "scenario");
      state.wave = stim.wave;
      note(lines.concat(stim.lines).join("\n"));
    } else note("Rails off.");
    refresh();
  });
  $("sos").addEventListener("click", pressSos);
  $("zoom-in").addEventListener("click", () => dolly(0.85));
  $("zoom-out").addEventListener("click", () => dolly(1.15));

  bindSeg("motion", "motion");
  bindSeg("ppg", "ppg");
  bindSeg("phone", "phone");
  bindSeg("lte", "lte");
  $("temp").addEventListener("input", () => {
    state.scenario.temp = Number($("temp").value);
    $("temp-out").textContent = state.scenario.temp.toFixed(1);
    restimulate();
  });
  $("mic").addEventListener("change", () => {
    state.scenario.mic = $("mic").checked ? "tone" : "quiet";
    restimulate();
  });
  $("sw-vbat").addEventListener("change", () => { state.power.vbat = $("sw-vbat").checked; onSwitch(); });
  $("sw-vbus").addEventListener("change", () => { state.power.vbus = $("sw-vbus").checked; onSwitch(); });
  $("sw-sw10").addEventListener("change", () => { state.power.sw10 = $("sw-sw10").checked; onSwitch(); });
  $("sw-sw9").addEventListener("change", () => { state.power.sw9 = $("sw-sw9").value; onSwitch(); });
  $("sw-modem").addEventListener("change", () => { state.power.modemUsb = $("sw-modem").checked; onSwitch(); });

  window.addEventListener("keydown", (event) => {
    if (event.target && (event.target.tagName === "INPUT" || event.target.tagName === "SELECT")) return;
    if (event.key === "Escape") {
      state.draft = null;
      refresh();
    }
    if (event.key === "Delete" && state.selectedWire >= 0) {
      state.wires.splice(state.selectedWire, 1);
      state.selectedWire = -1;
      dropPowerIfFault();
      refresh();
    }
  });

  renderer.domElement.addEventListener("contextmenu", (event) => event.preventDefault());
  renderer.domElement.addEventListener("pointerdown", (event) => {
    pointerDown = { x: event.clientX, y: event.clientY, button: event.button, moved: false };
  });
  window.addEventListener("pointermove", (event) => {
    if (pointerDown) {
      const dx = event.clientX - pointerDown.x;
      const dy = event.clientY - pointerDown.y;
      if (Math.hypot(dx, dy) > 3) pointerDown.moved = true;
      if (pointerDown.moved && pointerDown.button === 0) {
        spherical.theta -= dx * 0.007;
        spherical.phi = clamp(spherical.phi + dy * 0.005, 0.28, 1.25);
      }
      if (pointerDown.moved && pointerDown.button === 2) pan(dx, dy);
      if (pointerDown.moved) {
        pointerDown.x = event.clientX;
        pointerDown.y = event.clientY;
        placeCamera();
      }
    }
    if (state.draft) updateDraft(event);
  });
  window.addEventListener("pointerup", (event) => {
    const click = pointerDown && !pointerDown.moved && pointerDown.button === 0;
    pointerDown = null;
    if (!click) return;
    const hit = pick(event);
    if (!hit) return;
    const data = hit.object.userData;
    if (data.pinId) {
      state.selectedPin = data.pinId;
      state.selectedBoard = Bench.boardByPin[data.pinId].id;
      if (!state.draft) state.draft = { pin: data.pinId };
      else if (state.draft.pin !== data.pinId) commitWire(state.draft.pin, data.pinId);
      else state.draft = null;
      refresh();
      return;
    }
    if (data.wireIndex != null) {
      state.selectedWire = data.wireIndex;
      state.draft = null;
      refresh();
      return;
    }
    if (data.boardId) {
      state.selectedBoard = data.boardId;
      state.selectedPin = null;
      refresh();
    }
  });
  renderer.domElement.addEventListener("wheel", (event) => {
    event.preventDefault();
    dolly(event.deltaY > 0 ? 1.08 : 0.92);
  }, { passive: false });

  new ResizeObserver(resize).observe(wrap);
  resize();
  placeCamera();
  refresh();
  renderer.setAnimationLoop(() => renderer.render(scene, camera));

  function pressSos() {
    const report = currentReport();
    if (!state.powerOn) {
      note("SOS pressed with the rails off. Button 1 does nothing until the DK is powered.");
      refresh();
      return;
    }
    const stim = Bench.stimulus(report, state.scenario, "sos");
    state.wave = stim.wave;
    note(stim.lines.join("\n"));
    refresh();
  }

  function commitWire(a, b) {
    const key = [a, b].sort().join("|");
    const exists = state.wires.some((w) => [w.a, w.b].sort().join("|") === key);
    if (!exists) state.wires.push({ a, b });
    state.draft = null;
    state.selectedWire = state.wires.length - 1;
    dropPowerIfFault();
  }

  function dropPowerIfFault() {
    const report = Bench.validate(state.wires, state.power);
    if (state.powerOn && report.errors.length) {
      state.powerOn = false;
      note("Power dropped. " + report.errors[0].text);
    }
  }

  function onSwitch() {
    if (!state.powerOn) {
      refresh();
      return;
    }
    const report = currentReport();
    if (report.errors.length) {
      state.powerOn = false;
      note(Bench.bringup(report, state.power).join("\n"));
    } else {
      const stim = Bench.stimulus(report, state.scenario, "scenario");
      state.wave = stim.wave;
      note(Bench.bringup(report, state.power).concat(stim.lines).join("\n"));
    }
    refresh();
  }

  function restimulate() {
    if (!state.powerOn) {
      refresh();
      return;
    }
    const report = currentReport();
    const stim = Bench.stimulus(report, state.scenario, "scenario");
    state.wave = stim.wave;
    note(stim.lines.join("\n"));
    refresh();
  }

  function currentReport() {
    return Bench.validate(state.wires, state.power);
  }

  function note(text) {
    state.log.push(text);
    if (state.log.length > 40) state.log.splice(0, state.log.length - 40);
  }

  function refresh() {
    const report = currentReport();
    renderWorld();
    renderSide(report);
    renderLog();
    $("power").classList.toggle("on", state.powerOn);
    $("power").textContent = state.powerOn ? "Rails on" : "Apply power";
  }

  function renderWorld() {
    disposeGroup(world);
    world.clear();
    Bench.boards.forEach(addBoard);
    state.wires.forEach((wire, index) => addWire(wire, index));
    draftLine.visible = false;
  }

  function addBoard(board) {
    const group = new THREE.Group();
    group.position.copy(boardCenter(board));
    const width = board.w * SCALE;
    const depth = board.h * SCALE;
    const color = boardColor(board.id);
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(width, 0.16, depth),
      new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.72,
        metalness: 0.04,
        emissive: board.id === state.selectedBoard ? 0x123024 : 0x000000,
        emissiveIntensity: 0.35
      })
    );
    body.position.y = 0.04;
    body.castShadow = true;
    body.receiveShadow = true;
    body.userData.boardId = board.id;
    group.add(body);

    const title = makeSprite(board.name, { w: Math.min(width * 0.9, 2.4), h: 0.32, size: 56 });
    title.position.set(0, 0.55, 0);
    group.add(title);

    if (board.id === "nrf" || board.id === "modem") {
      const antenna = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.02, 0.22),
        new THREE.MeshStandardMaterial({ color: 0xf7f4ee, roughness: 0.4 })
      );
      antenna.position.set(width / 2 - 0.38, 0.06, -depth / 2 + 0.2);
      antenna.castShadow = true;
      group.add(antenna);
      const usb = new THREE.Mesh(
        new THREE.BoxGeometry(0.28, 0.08, 0.12),
        new THREE.MeshStandardMaterial({ color: 0xc5c8cc, metalness: 0.6, roughness: 0.3 })
      );
      usb.position.set(-width / 2 + 0.2, 0.04, -depth / 2);
      group.add(usb);
    }
    if (board.id === "nrf") {
      const button = new THREE.Mesh(
        new THREE.CylinderGeometry(0.09, 0.09, 0.05, 16),
        new THREE.MeshStandardMaterial({
          color: state.powerOn ? 0xc4473a : 0x6e3a34,
          emissive: state.powerOn ? 0x5a100c : 0x000000,
          roughness: 0.45
        })
      );
      button.position.set(-width / 2 + 0.28, 0.08, depth / 2 - 0.28);
      button.userData.boardId = board.id;
      group.add(button);
      const led = new THREE.Mesh(
        new THREE.SphereGeometry(0.05, 12, 12),
        new THREE.MeshStandardMaterial({
          color: state.powerOn ? 0x7dffb2 : 0x234232,
          emissive: state.powerOn ? 0x1f8a4c : 0x000000,
          emissiveIntensity: 0.8
        })
      );
      led.position.set(-width / 2 + 0.5, 0.08, depth / 2 - 0.28);
      group.add(led);
    }
    if (board.id === "lra") {
      const puck = new THREE.Mesh(
        new THREE.CylinderGeometry(0.22, 0.22, 0.1, 20),
        new THREE.MeshStandardMaterial({ color: 0x8d9094, metalness: 0.7, roughness: 0.28 })
      );
      puck.position.y = 0.08;
      puck.castShadow = true;
      group.add(puck);
    }

    board.pins.forEach((pin) => {
      const local = pinLocal(board, pin);
      const hot = state.draft && state.draft.pin === pin.id;
      const head = new THREE.Mesh(
        new THREE.CylinderGeometry(hot ? 0.075 : 0.055, 0.05, 0.36, 10),
        new THREE.MeshStandardMaterial({
          color: hot || state.selectedPin === pin.id ? 0xffe7a3 : 0xc6a15a,
          metalness: 0.65,
          roughness: 0.28,
          emissive: hot ? 0x6a5420 : 0x000000
        })
      );
      head.position.copy(local);
      head.position.y = 0.24;
      head.castShadow = true;
      head.userData.pinId = pin.id;
      group.add(head);
      const label = makeSprite(shortLabel(pin.label), { w: 0.7, h: 0.18, size: 64, color: "#f7f1e6" });
      const inward = local.x < 0 ? 0.36 : -0.36;
      label.position.set(local.x + inward, 0.52, local.z);
      group.add(label);
    });

    world.add(group);
  }

  function addWire(wire, index) {
    const a = pinWorld(wire.a);
    const b = pinWorld(wire.b);
    if (!a || !b) return;
    const mid = a.clone().lerp(b, 0.5);
    mid.y += Math.min(1.4, a.distanceTo(b) * 0.45 + 0.15);
    const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
    const selected = index === state.selectedWire;
    const mesh = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 28, selected ? 0.028 : 0.016, 5, false),
      new THREE.MeshStandardMaterial({ color: wireColor(wire), roughness: 0.45, metalness: 0.15 })
    );
    mesh.castShadow = true;
    mesh.userData.wireIndex = index;
    world.add(mesh);
  }

  function updateDraft(event) {
    if (!state.draft) {
      draftLine.visible = false;
      return;
    }
    const start = pinWorld(state.draft.pin);
    const end = groundPoint(event);
    if (!start || !end) return;
    const mid = start.clone().lerp(end, 0.5);
    mid.y += 0.45;
    draftLine.geometry.dispose();
    draftLine.geometry = new THREE.BufferGeometry().setFromPoints([start, mid, end]);
    draftLine.visible = true;
  }

  function renderSide(report) {
    const faults = report.errors.length;
    const notes = report.warnings.length;
    $("summary").textContent = "Faults " + faults + " · Notes " + notes + (state.powerOn ? " · Rails on" : " · Rails off");
    const chips = [
      ["MCU", report.links.mcu && state.powerOn],
      ["I2C", report.links.i2c && state.powerOn],
      ["SPI", report.links.spi && state.powerOn],
      ["PDM", report.links.pdm && state.powerOn],
      ["UART", report.links.uart && state.powerOn],
      ["IMU", report.links.imu && state.powerOn],
      ["PPG", report.links.spi && state.powerOn],
      ["Temp", report.links.temp && state.powerOn],
      ["Haptic", report.links.haptic && state.powerOn]
    ];
    $("chips").innerHTML = chips.map(([name, on]) => '<span class="chip' + (on ? " on" : "") + '">' + name + "</span>").join("");
    const items = [];
    if (!faults && !notes) items.push('<div class="check"><p>No faults on this net.</p></div>');
    report.errors.forEach((item) => items.push('<div class="check bad"><p>' + escapeXml(item.text) + "</p></div>"));
    report.warnings.forEach((item) => items.push('<div class="check warn"><p>' + escapeXml(item.text) + "</p></div>"));
    $("checks").innerHTML = items.join("");
    renderInspector();
  }

  function renderInspector() {
    const pin = state.selectedPin ? Bench.pinById[state.selectedPin] : null;
    const board = boardById(state.selectedBoard) || (pin ? Bench.boardByPin[pin.id] : null);
    if (!board) {
      $("inspector").innerHTML = '<p class="muted">Click a board or a pin.</p>';
      return;
    }
    const pinBlock = pin
      ? '<p class="inspector-detail"><strong>' + escapeXml(pin.label) + "</strong> — " + escapeXml(pin.detail || "") + "</p>"
      : "";
    $("inspector").innerHTML =
      '<p class="inspector-name">' + escapeXml(board.name) + "</p>" +
      pinBlock +
      '<p class="inspector-detail">' + escapeXml(board.limit) + "</p>" +
      '<p class="inspector-detail"><a href="' + board.doc + '" target="_blank" rel="noreferrer">Manufacturer document</a></p>';
  }

  function renderLog() {
    $("log").textContent = state.log.join("\n\n");
    $("log").scrollTop = $("log").scrollHeight;
    const wave = $("wave");
    wave.innerHTML = "";
    if (!state.wave.length) return;
    const max = Math.max.apply(null, state.wave);
    const pts = state.wave.map((value, index) => {
      const x = (index / (state.wave.length - 1)) * 320;
      const y = 44 - (value / max) * 40;
      return x.toFixed(1) + "," + y.toFixed(1);
    }).join(" ");
    const line = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    line.setAttribute("points", pts);
    wave.appendChild(line);
  }

  function boardCenter(board) {
    return new THREE.Vector3(
      (board.x + board.w / 2 - ORIGIN_X) * SCALE,
      0.04,
      (board.y + board.h / 2 - ORIGIN_Z) * SCALE
    );
  }

  function pinLocal(board, pin) {
    return new THREE.Vector3(
      (pin.lx - board.w / 2) * SCALE,
      0,
      (pin.ly - board.h / 2) * SCALE
    );
  }

  function pinWorld(id) {
    const pin = Bench.pinById[id];
    if (!pin) return null;
    const board = Bench.boardByPin[id];
    return boardCenter(board).add(pinLocal(board, pin)).setY(0.25);
  }

  function shortLabel(label) {
    const parts = String(label).split(" ");
    return parts[parts.length - 1];
  }

  function boardColor(id) {
    if (id === "modem") return 0x1a4f66;
    if (id === "lra") return 0x4a4036;
    if (id === "npm") return 0x184e34;
    return 0x1f6b43;
  }

  function wireColor(wire) {
    const kinds = [Bench.pinById[wire.a].kind, Bench.pinById[wire.b].kind];
    if (kinds.indexOf("gnd") !== -1 || kinds.indexOf("tie_low") !== -1) return 0x2a241c;
    if (kinds.indexOf("pwr_out") !== -1 || kinds.indexOf("pwr_in") !== -1 || kinds.indexOf("tie_high") !== -1) return 0xb3392b;
    if (kinds.indexOf("sda") !== -1 || kinds.indexOf("scl") !== -1) return 0xc4922a;
    if (kinds.indexOf("tx") !== -1 || kinds.indexOf("rx") !== -1) return 0x1f7a4d;
    if (kinds.indexOf("pdm_clk") !== -1 || kinds.indexOf("pdm_data") !== -1) return 0x6d3d91;
    if (kinds.indexOf("haptic_p") !== -1 || kinds.indexOf("haptic_n") !== -1) return 0xb4532a;
    if (kinds.indexOf("gpio") !== -1) return 0xd06a1c;
    return 0x2a62b5;
  }

  function makeSprite(text, options) {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 512, 128);
    ctx.font = "600 " + (options.size || 48) + "px Segoe UI, sans-serif";
    ctx.fillStyle = options.color || "#f4efe6";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 256, 64);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(options.w || 1.2, options.h || 0.3, 1);
    sprite.raycast = function () {};
    return sprite;
  }

  function pick(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(world.children, true);
    for (let i = 0; i < hits.length; i++) {
      const data = hits[i].object.userData;
      if (data && (data.pinId || data.boardId || data.wireIndex != null)) return hits[i];
    }
    return null;
  }

  function groundPoint(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const point = new THREE.Vector3();
    const hit = raycaster.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.25), point);
    return hit ? point : null;
  }

  function placeCamera() {
    const offset = new THREE.Vector3().setFromSpherical(spherical);
    camera.position.copy(target).add(offset);
    camera.lookAt(target);
  }

  function pan(dx, dy) {
    const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0);
    right.y = 0;
    if (right.lengthSq() < 1e-6) right.set(1, 0, 0);
    right.normalize();
    const forward = new THREE.Vector3().crossVectors(right, new THREE.Vector3(0, 1, 0)).normalize();
    const scale = spherical.radius * 0.0016;
    target.addScaledVector(right, -dx * scale);
    target.addScaledVector(forward, -dy * scale);
  }

  function dolly(factor) {
    spherical.radius = clamp(spherical.radius * factor, 3, 28);
    placeCamera();
  }

  function resize() {
    const width = Math.max(1, wrap.clientWidth);
    const height = Math.max(1, wrap.clientHeight);
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  function disposeGroup(group) {
    group.traverse((child) => {
      if (child.geometry) child.geometry.dispose();
      if (!child.material) return;
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach((material) => {
        if (material.map) material.map.dispose();
        material.dispose();
      });
    });
  }

  function boardById(id) {
    return Bench.boards.find((board) => board.id === id) || null;
  }

  function bindSeg(elementId, key) {
    $(elementId).addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button) return;
      state.scenario[key] = button.getAttribute("data-" + key);
      Array.from($(elementId).querySelectorAll("button")).forEach((item) => item.classList.toggle("on", item === button));
      restimulate();
    });
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function escapeXml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
})();
