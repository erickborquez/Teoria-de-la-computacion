class Semaforo {
  constructor(id = "") {
    this.state = 0;
    this.ticking = false;
    this.idle = true;
    this.id = id;
  }

  reset() {
    this.state = 1;
    this.ticking = false;
    this.idle = false;
  }

  getState() {
    return this.states[this.state];
  }

  next() {
    if (this.idle) return;
    if (this.ticking) {
      this.state = (this.state + 1) % this.totalStates;
      this.ticking = false;
    } else {
      this.ticking = true;
    }
    if (this.getState() == "STOP") this.idle = true;
    else this.idle = false;

    return this.getTime();
  }
  getTime() {
    const times = this.times[this.getState()];
    if (this.ticking) return times.ticking;
    return times.normal;
  }

  print() {
    console.log(
      this.getState(),
      `ticking: ${this.ticking}`,
      `idle: ${this.idle}`,
      this.getTime()
    );
  }

  getDomElement() {
    const container = document.createElement("div");
    container.setAttribute("id", `semaforo-${this.id}`);
    container.setAttribute("class", "semaforo");
    const red = document.createElement("div");
    red.setAttribute("class", "light red");
    const yellow = document.createElement("div");
    yellow.setAttribute("class", "light yellow");
    const green = document.createElement("div");
    green.setAttribute("class", "light green");

    container.appendChild(red);
    container.appendChild(yellow);
    container.appendChild(green);

    return container;
  }

  updateDomElement() {
    const container = document.getElementById(`semaforo-${this.id}`);
    switch (this.getState()) {
      case "STOP": {
        container.setAttribute("class", "semaforo red");
        break;
      }
      case "GO": {
        if (this.ticking)
          container.setAttribute("class", "semaforo green ticking");
        else container.setAttribute("class", "semaforo green");
        break;
      }
      case "WARNING": {
        if (this.ticking)
          container.setAttribute("class", "semaforo yellow ticking");
        else container.setAttribute("class", "semaforo yellow");
        break;
      }
      default: {
      }
    }
  }
}

Semaforo.prototype.totalStates = 3;
Semaforo.prototype.states = ["STOP", "GO", "WARNING"];
Semaforo.prototype.times = {
  STOP: {
    normal: 0,
    ticking: 0,
  },
  GO: {
    normal: 5000,
    ticking: 3000,
  },
  WARNING: {
    normal: 4000,
    ticking: 3000,
  },
};

class SemaforoController {
  constructor(amount = 1) {
    this.amount = amount;
    this.current = 0;
    this.semaforos = Array(amount)
      .fill(null)
      .map((_, i) => new Semaforo(i));
    this.semaforos[0].reset();
  }

  next() {
    this.semaforos[this.current].next();
    if (this.semaforos[this.current].idle) {
      this.current = (this.current + 1) % this.amount;
      this.semaforos[this.current].reset();
    }
    return this.getTime();
  }

  getTime() {
    return this.semaforos[this.current].getTime();
  }

  print() {
    for (let i = 0; i < this.amount; i++) {
      this.semaforos[i].print();
    }
  }

  createDom() {
    const container = document.getElementById("container");
    this.semaforos.forEach((semaforo) =>
      container.appendChild(semaforo.getDomElement())
    );
  }

  updateDom() {
    this.semaforos.forEach((semaforo) => semaforo.updateDomElement());
  }
}

const start = () => {
  const controller = new SemaforoController(4);

  let nexUpdate = Date.now() + controller.getTime();
  controller.createDom();
  controller.updateDom();

  const update = () => {
    const time = Date.now();

    if (nexUpdate < time) {
      nexUpdate = time + controller.next();
      controller.updateDom();

      controller.print();
    }
    requestAnimationFrame(update);
  };
  update();
};

start();
