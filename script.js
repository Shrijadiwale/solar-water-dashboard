
document.addEventListener("DOMContentLoaded", () => {
  // Mobile navigation
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");

  menuToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.textContent = isOpen ? "✕" : "☰";
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.textContent = "☰";
    });
  });

  // Footer year
  document.getElementById("year").textContent =
    new Date().getFullYear();

  // Demo readings: replace with actual sensor data when available.
  const readings = {
    solarPower: document.getElementById("solarPower"),
    waterProduced: document.getElementById("waterProduced"),
    temperature: document.getElementById("temperature"),
    tankLevel: document.getElementById("tankLevel"),
    phValue: document.getElementById("phValue"),
    tdsValue: document.getElementById("tdsValue"),
    efficiency: document.getElementById("efficiency")
  };

  const tankProgress = document.getElementById("tankProgress");
  const phBar = document.getElementById("phBar");
  const tdsBar = document.getElementById("tdsBar");
  const efficiencyBar = document.getElementById("efficiencyBar");
  const solarChart = document.getElementById("solarChart");
  const refreshBtn = document.getElementById("refreshBtn");
  const systemStatus = document.getElementById("systemStatus");

  function randomBetween(min, max, decimals = 0) {
    const value = Math.random() * (max - min) + min;
    return Number(value.toFixed(decimals));
  }

  function renderChart(values) {
    solarChart.replaceChildren();

    values.forEach((value, index) => {
      const bar = document.createElement("div");
      bar.className = "chart-bar";
      bar.style.height = `${(value / 5) * 100}%`;
      bar.title = `Time point ${index + 1}: ${value} kW`;
      bar.setAttribute("aria-label", `${value} kilowatts`);
      solarChart.appendChild(bar);
    });
  }

  function updateDashboard() {
    const solar = randomBetween(1.2, 4.5, 1);
    const water = randomBetween(80, 180);
    const temperature = randomBetween(24, 36, 1);
    const tank = randomBetween(25, 100);
    const ph = randomBetween(6.5, 8.2, 1);
    const tds = randomBetween(100, 450);
    const efficiency = randomBetween(65, 96);

    readings.solarPower.textContent = solar.toFixed(1);
    readings.waterProduced.textContent = water;
    readings.temperature.textContent = temperature.toFixed(1);
    readings.tankLevel.textContent = tank;
    readings.phValue.textContent = ph.toFixed(1);
    readings.tdsValue.textContent = tds;
    readings.efficiency.textContent = efficiency;

    tankProgress.style.width = `${tank}%`;

    // Illustrative visual scales, not water safety assessments.
    phBar.style.width = `${((ph - 5) / 5) * 100}%`;
    tdsBar.style.width = `${Math.min((tds / 1000) * 100, 100)}%`;
    efficiencyBar.style.width = `${efficiency}%`;

    const chartValues = [
      randomBetween(0.4, 1.2, 1),
      randomBetween(1.2, 2.8, 1),
      randomBetween(2.5, 4.8, 1),
      randomBetween(2.2, 4.2, 1),
      randomBetween(1.1, 3.0, 1),
      randomBetween(0.2, 1.2, 1)
    ];

    renderChart(chartValues);

    systemStatus.textContent = "Demo Readings Updated";
  }

  refreshBtn.addEventListener("click", () => {
    refreshBtn.disabled = true;
    refreshBtn.textContent = "Updating...";

    updateDashboard();

    refreshBtn.disabled = false;
    refreshBtn.textContent = "↻ Refresh Readings";
  });

  // Initial dashboard readings
  updateDashboard();
});


  // Electricity consumption calculator
  const waterInput = document.getElementById("waterInput");
  const energyInput = document.getElementById("energyInput");
  const solarHoursInput = document.getElementById("solarHours");
  const systemLossInput = document.getElementById("systemLoss");
  const calculateEnergyBtn = document.getElementById("calculateEnergy");

  const perLitreOutput = document.getElementById("perLitre");
  const dailyEnergyOutput = document.getElementById("dailyEnergy");
  const monthlyEnergyOutput = document.getElementById("monthlyEnergy");
  const solarCapacityOutput = document.getElementById("solarCapacity");
  const energySummaryOutput = document.getElementById("energySummary");
  const energyProgress = document.getElementById("energyProgress");
  const energyExplanation = document.getElementById("energyExplanation");

  function calculateEnergy() {
    const waterLitres = Number(waterInput.value);
    const energyPer1000L = Number(energyInput.value);
    const solarHours = Number(solarHoursInput.value);
    const lossPercent = Number(systemLossInput.value);

    const valid =
      waterInput.value.trim() !== "" &&
      energyInput.value.trim() !== "" &&
      solarHoursInput.value.trim() !== "" &&
      systemLossInput.value.trim() !== "" &&
      Number.isFinite(waterLitres) &&
      Number.isFinite(energyPer1000L) &&
      Number.isFinite(solarHours) &&
      Number.isFinite(lossPercent) &&
      waterLitres >= 1 &&
      waterLitres <= 1000000 &&
      energyPer1000L >= 0.01 &&
      energyPer1000L <= 1000 &&
      solarHours >= 1 &&
      solarHours <= 24 &&
      lossPercent >= 0 &&
      lossPercent <= 90;

    if (!valid) {
      energyExplanation.textContent =
        "Please enter valid values within the permitted ranges.";
      return;
    }

    // Convert kWh per 1,000 litres into Wh per litre.
    const wattHoursPerLitre = energyPer1000L;

    // Daily electrical energy consumed by desalination.
    const dailyKWh = (waterLitres / 1000) * energyPer1000L;

    // Estimate monthly energy for 30 operating days.
    const monthlyKWh = dailyKWh * 30;

    // Approximate PV capacity allowing for stated system losses.
    const usableSolarFraction = 1 - lossPercent / 100;
    const solarCapacityKW =
      dailyKWh / (solarHours * usableSolarFraction);

    perLitreOutput.textContent =
      wattHoursPerLitre.toFixed(2) + " Wh";

    dailyEnergyOutput.textContent =
      dailyKWh.toFixed(3) + " kWh";

    monthlyEnergyOutput.textContent =
      monthlyKWh.toFixed(2) + " kWh";

    solarCapacityOutput.textContent =
      solarCapacityKW.toFixed(3) + " kW";

    energySummaryOutput.textContent =
      dailyKWh.toFixed(3) + " kWh/day";

    // Visual indicator only; not a system efficiency score.
    const progressPercent = Math.min(
      (dailyKWh / Math.max(monthlyKWh, 0.001)) * 100,
      100
    );

    energyProgress.style.width = progressPercent + "%";

    energyExplanation.textContent =
      `Producing ${waterLitres.toLocaleString()} litres per day at ` +
      `${energyPer1000L} kWh per 1,000 litres requires approximately ` +
      `${dailyKWh.toFixed(3)} kWh/day and ` +
      `${monthlyKWh.toFixed(2)} kWh over 30 days. ` +
      `Estimated PV capacity is ${solarCapacityKW.toFixed(3)} kW, ` +
      `before battery sizing and other design considerations.`;
  }

  calculateEnergyBtn.addEventListener("click", calculateEnergy);

  // Recalculate when an input changes.
  [
    waterInput,
    energyInput,
    solarHoursInput,
    systemLossInput
  ].forEach((input) => {
    input.addEventListener("input", calculateEnergy);
  });

  calculateEnergy();


  // Future features: interactive information panels

  const featureInfo = {
    iot: {
      title: "ESP32 / Arduino Integration",
      text:
        "Connect an ESP32 or Arduino-compatible controller to suitable " +
        "sensors. The controller can collect water temperature, tank " +
        "level, flow rate and other measurements. To display actual " +
        "readings, connect the controller to this website through a " +
        "backend, MQTT service or supported IoT platform."
    },

    database: {
      title: "Database and Live Updates",
      text:
        "A database can store timestamped sensor readings for future " +
        "analysis. A backend or IoT service can send new readings to " +
        "the dashboard. Possible options include Firebase or a custom " +
        "API with a database. A database connection is not configured " +
        "by this demonstration section."
    },

    analytics: {
      title: "Advanced Analytics",
      text:
        "Use measured energy consumption and water production to " +
        "calculate specific energy consumption in kWh per cubic metre. " +
        "Compare daily solar generation, electricity usage, water " +
        "output and system efficiency to identify opportunities " +
        "for better performance."
    }
  };

  const detailPanel = document.getElementById("futureDetails");
  const detailTitle = document.getElementById("detailTitle");
  const detailText = document.getElementById("detailText");
  const closeDetails = document.getElementById("closeDetails");

  document.querySelectorAll(".future-btn[data-feature]").forEach((button) => {
    button.addEventListener("click", () => {
      const selectedFeature = featureInfo[button.dataset.feature];

      if (!selectedFeature) return;

      detailTitle.textContent = selectedFeature.title;
      detailText.textContent = selectedFeature.text;
      detailPanel.hidden = false;

      detailPanel.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    });
  });

  closeDetails.addEventListener("click", () => {
    detailPanel.hidden = true;
  });


  
  // Live Solar Energy Monitoring - DEMO MODE

  const liveSolarPower = document.getElementById("liveSolarPower");
  const liveSolarEnergy = document.getElementById("liveSolarEnergy");
  const liveSolarVoltage = document.getElementById("liveSolarVoltage");
  const liveSolarCurrent = document.getElementById("liveSolarCurrent");
  const liveSolarChart = document.getElementById("liveSolarChart");
  const solarLiveStatus = document.getElementById("solarLiveStatus");
  const solarLastUpdated = document.getElementById("solarLastUpdated");

  if (
    liveSolarPower &&
    liveSolarEnergy &&
    liveSolarVoltage &&
    liveSolarCurrent &&
    liveSolarChart
  ) {
    let solarPowerHistory = [0.4, 0.8, 1.2, 1.8, 2.1, 2.4];
    let dailyEnergyKWh = 8.5;

    function renderLiveSolarChart() {
      liveSolarChart.replaceChildren();

      solarPowerHistory.forEach((power, index) => {
        const bar = document.createElement("div");

        bar.className = "solar-live-bar";

        if (index === solarPowerHistory.length - 1) {
          bar.classList.add("latest");
        }

        // Scale chart against a 5 kW reference.
        bar.style.height = `${Math.max(3, (power / 5) * 100)}%`;
        bar.title = `${power.toFixed(2)} kW`;
        bar.setAttribute(
          "aria-label",
          `Solar output: ${power.toFixed(2)} kilowatts`
        );

        liveSolarChart.appendChild(bar);
      });
    }

    function updateLiveSolar() {
      // Simulated instantaneous readings.
      const hour = new Date().getHours();

      // Mimic lower generation in the evening and at night.
      const daylightFactor =
        hour >= 7 && hour <= 18
          ? Math.sin(((hour - 7) / 11) * Math.PI)
          : 0;

      const power =
        daylightFactor > 0
          ? Math.max(0, daylightFactor * (2.5 + Math.random() * 1.5))
          : 0;

      const voltage = power > 0
        ? 30 + Math.random() * 10
        : 0;

      const current = voltage > 0
        ? (power * 1000) / voltage
        : 0;

      liveSolarPower.textContent = power.toFixed(2);
      liveSolarVoltage.textContent = voltage.toFixed(1);
      liveSolarCurrent.textContent = current.toFixed(2);

      // Illustrative daily total, not a physical meter reading.
      dailyEnergyKWh += power / 3600;
      liveSolarEnergy.textContent = dailyEnergyKWh.toFixed(2);

      solarPowerHistory.push(Number(power.toFixed(2)));

      if (solarPowerHistory.length > 12) {
        solarPowerHistory.shift();
      }

      renderLiveSolarChart();

      solarLiveStatus.textContent = "Demo Monitoring Active";
      solarLastUpdated.textContent =
        "Last demo update: " +
        new Date().toLocaleTimeString();
    }

    // Initial readings
    renderLiveSolarChart();
    updateLiveSolar();

    // Refresh demo readings every 3 seconds.
    // Clear the interval if you later replace this with real sensor data.
    const liveSolarTimer = setInterval(updateLiveSolar, 3000);
  }


  
  // Smart Water Tank Monitoring - DEMO MODE

  const tankLevelInput = document.getElementById("tankLevelInput");
  const tankSliderValue = document.getElementById("tankSliderValue");
  const tankWater = document.getElementById("tankWater");
  const tankGraphic = document.getElementById("tankGraphic");
  const tankPercentage = document.getElementById("tankPercentage");
  const availableWater = document.getElementById("availableWater");
  const tankLevelPercent = document.getElementById("tankLevelPercent");
  const tankLevelBar = document.getElementById("tankLevelBar");
  const tankAlertCard = document.getElementById("tankAlertCard");
  const tankAlertIcon = document.getElementById("tankAlertIcon");
  const tankAlertTitle = document.getElementById("tankAlertTitle");
  const tankAlertMessage = document.getElementById("tankAlertMessage");

  const tankCapacityLitres = 1000;

  function updateTankMonitoring() {
    if (!tankLevelInput) return;

    const level = Number(tankLevelInput.value);
    const waterLitres = Math.round(
      tankCapacityLitres * level / 100
    );

    // Update water-level visualization and readings.
    tankSliderValue.textContent = level;
    tankPercentage.textContent = `${level}%`;
    availableWater.textContent = waterLitres.toLocaleString();
    tankLevelPercent.textContent = level;

    tankWater.style.height = `${level}%`;
    tankLevelBar.style.width = `${level}%`;

    tankGraphic.setAttribute(
      "aria-label",
      `Water tank is ${level} percent full`
    );

    // Reset previous alert styles.
    tankAlertCard.classList.remove("warning", "danger");

    if (level === 0) {
      tankWater.style.background =
        "linear-gradient(180deg, #e5b3a9, #cf5d50)";

      tankAlertCard.classList.add("danger");
      tankAlertIcon.textContent = "!";
      tankAlertTitle.textContent = "Tank Empty";
      tankAlertMessage.textContent =
        "No water is available in the simulated storage tank.";
    } else if (level < 20) {
      tankWater.style.background =
        "linear-gradient(180deg, #ffd27a, #e5a02d)";

      tankAlertCard.classList.add("warning");
      tankAlertIcon.textContent = "!";
      tankAlertTitle.textContent = "Low Water Level";
      tankAlertMessage.textContent =
        "Water storage is below 20%. Consider checking water supply.";
    } else if (level >= 95) {
      tankWater.style.background =
        "linear-gradient(180deg, #f5a09a, #dc5049)";

      tankAlertCard.classList.add("danger");
      tankAlertIcon.textContent = "!";
      tankAlertTitle.textContent = "Tank Almost Full";
      tankAlertMessage.textContent =
        "Water level is at least 95%. Check the tank to prevent overflow.";
    } else {
      tankWater.style.background =
        "linear-gradient(180deg, #59c7e8, #1388c5)";

      tankAlertIcon.textContent = "✓";
      tankAlertTitle.textContent = "Tank Level Normal";
      tankAlertMessage.textContent =
        "Water storage is within the configured operating range.";
    }
  }

  if (tankLevelInput) {
    tankLevelInput.addEventListener(
      "input",
      updateTankMonitoring
    );

    // Show initial readings.
    updateTankMonitoring();
  }


  
  // AquaSustain Solar - Download System Report

  const downloadReportBtn = document.getElementById("downloadReportBtn");
  const reportMessage = document.getElementById("reportMessage");

  function getReportValue(id, fallback = "Not available") {
    const element = document.getElementById(id);

    if (!element) return fallback;

    const value = element.textContent.trim();
    return value || fallback;
  }

  function downloadSystemReport() {
    const generatedAt = new Date();

    // Read the latest values displayed on the website.
    const reportRows = [
      ["AquaSustain Solar - System Monitoring Report", ""],
      ["Report generated", generatedAt.toLocaleString()],
      ["Data type", "Website readings; demo values may be simulated"],
      ["", ""],
      ["Category", "Measurement", "Value", "Unit"],
      ["Solar Monitoring", "Current Solar Power",
        getReportValue("liveSolarPower"), "kW"],
      ["Solar Monitoring", "Energy Today",
        getReportValue("liveSolarEnergy"), "kWh"],
      ["Solar Monitoring", "Solar Voltage",
        getReportValue("liveSolarVoltage"), "V"],
      ["Solar Monitoring", "Solar Current",
        getReportValue("liveSolarCurrent"), "A"],
      ["Water Production", "Water Produced Today",
        getReportValue("waterProduced"), "L/day (displayed estimate)"],
      ["Electricity", "Energy per Litre",
        getReportValue("perLitre"), "Wh/L"],
      ["Electricity", "Daily Energy Consumption",
        getReportValue("dailyEnergy"), "kWh/day"],
      ["Electricity", "Monthly Energy Consumption",
        getReportValue("monthlyEnergy"), "kWh/30 days"],
      ["Water Tank", "Tank Capacity",
        getReportValue("tankCapacityLabel"), "L"],
      ["Water Tank", "Water Available",
        getReportValue("availableWater"), "L"],
      ["Water Tank", "Tank Fill Level",
        getReportValue("tankLevelPercent"), "%"],
      ["Water Tank", "Tank Status",
        getReportValue("tankAlertTitle"), ""],
      ["Water Quality", "pH Reading",
        getReportValue("phValue"), "pH"],
      ["Water Quality", "TDS Reading",
        getReportValue("tdsValue"), "ppm (displayed estimate)"],
      ["System Performance", "Efficiency",
        getReportValue("efficiency"), "%"]
    ];

    // Escape CSV values safely.
    const csvContent = reportRows.map(row =>
      row.map(value => {
        const safeValue = String(value ?? "");
        return '"' + safeValue.replace(/"/g, '""') + '"';
      }).join(",")
    ).join("\r\n");

    // BOM improves compatibility with Excel.
    const blob = new Blob(
      ["\uFEFF" + csvContent],
      { type: "text/csv;charset=utf-8;" }
    );

    const downloadUrl = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");

    const dateStamp = generatedAt.toISOString()
      .slice(0, 10);

    downloadLink.href = downloadUrl;
    downloadLink.download =
      `AquaSustain_Solar_Report_${dateStamp}.csv`;

    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();

    URL.revokeObjectURL(downloadUrl);

    if (reportMessage) {
      reportMessage.textContent =
        "Your CSV report has been generated. Check your Downloads folder.";
    }
  }

  if (downloadReportBtn) {
    downloadReportBtn.addEventListener(
      "click",
      downloadSystemReport
    );
  }
