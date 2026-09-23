import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PRODUCE_HISTORIES, ProducePriceHistory } from '../data/mockData';
import { AlertCondition, PriceThresholdAlert } from '../types';

export const PricesScreen: React.FC = () => {
  const {
    setActiveTab,
    playSpeech,
    stopSpeech,
    isPlayingAudio,
    priceAlerts,
    addPriceAlert,
    togglePriceAlert,
    removePriceAlert,
    checkPriceThresholds,
    testTriggerPriceAlert,
    smsMode,
    showToast,
  } = useApp();
  const [selectedProduceId, setSelectedProduceId] = useState<string>('roma');
  const [activePointIndex, setActivePointIndex] = useState<number>(6); // Default to "Today"
  const [isPlayingTwiLocal, setIsPlayingTwiLocal] = useState(false);

  // Threshold Alerts State
  const [showSetAlertModal, setShowSetAlertModal] = useState(false);
  const [showManageAlertsModal, setShowManageAlertsModal] = useState(false);
  const [alertProduceId, setAlertProduceId] = useState<string>('roma');
  const [alertCondition, setAlertCondition] = useState<AlertCondition>('above_or_equal');
  const [alertTargetPrice, setAlertTargetPrice] = useState<number>(165);
  const [alertMarket, setAlertMarket] = useState<string>('Techiman Wholesale Market');
  const [alertNotifySms, setAlertNotifySms] = useState<boolean>(true);
  const [simulationOffset, setSimulationOffset] = useState<number>(15);

  const selectedProduce = useMemo(() => {
    return (
      PRODUCE_HISTORIES.find((p) => p.id === selectedProduceId) ||
      PRODUCE_HISTORIES[0]
    );
  }, [selectedProduceId]);

  // Compute 7-day fluctuation stats
  const {
    currentSpot,
    startPrice,
    minPrice,
    maxPrice,
    priceDiff,
    percentDiff,
    isPositive,
  } = useMemo(() => {
    const prices = selectedProduce.history.map((h) => h.price);
    const start = prices[0];
    const current = prices[prices.length - 1];
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const diff = current - start;
    const pct = ((diff / start) * 100).toFixed(1);
    return {
      currentSpot: current,
      startPrice: start,
      minPrice: min,
      maxPrice: max,
      priceDiff: diff,
      percentDiff: pct,
      isPositive: diff >= 0,
    };
  }, [selectedProduce]);

  // Compute SVG line chart coordinates (viewBox: 0 0 340 160)
  const chartConfig = useMemo(() => {
    const width = 340;
    const height = 150;
    const padding = { top: 22, right: 20, bottom: 26, left: 40 };
    const plotW = width - padding.left - padding.right;
    const plotH = height - padding.top - padding.bottom;

    // Cushion Y-axis for aesthetic curves
    const diff = maxPrice - minPrice;
    const cushion = Math.max(4, Math.round(diff * 0.2));
    const yMin = Math.max(0, Math.floor((minPrice - cushion) / 5) * 5);
    const yMax = Math.ceil((maxPrice + cushion) / 5) * 5;
    const yRange = yMax - yMin || 1;

    const points = selectedProduce.history.map((pt, i) => {
      const x = padding.left + (i / (selectedProduce.history.length - 1)) * plotW;
      const y = padding.top + (1 - (pt.price - yMin) / yRange) * plotH;
      return { ...pt, x, y };
    });

    const linePath = points.reduce(
      (acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)},${pt.y.toFixed(1)}`,
      ''
    );

    const bottomY = padding.top + plotH;
    const firstX = points[0].x.toFixed(1);
    const lastX = points[points.length - 1].x.toFixed(1);
    const areaPath = `${linePath} L ${lastX},${bottomY.toFixed(1)} L ${firstX},${bottomY.toFixed(1)} Z`;

    const midPrice = Math.round((yMax + yMin) / 2);

    return {
      width,
      height,
      padding,
      plotW,
      plotH,
      yMin,
      yMax,
      midPrice,
      points,
      linePath,
      areaPath,
    };
  }, [selectedProduce, minPrice, maxPrice]);

  const activePoint = chartConfig.points[activePointIndex] || chartConfig.points[6];

  const handleToggleAudio = () => {
    if (isPlayingTwiLocal || isPlayingAudio) {
      stopSpeech();
      setIsPlayingTwiLocal(false);
    } else {
      setIsPlayingTwiLocal(true);
      playSpeech(
        selectedProduce.advisory.twiSpeech,
        `${selectedProduce.name} Advisory • Twi Audio`
      );
    }
  };

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto px-4 pt-16 pb-28 gap-4 bg-[#f8faf4] min-h-screen">
      {/* Header Info */}
      <div className="flex items-center justify-between mt-2 mb-1">
        <div className="flex flex-col min-w-0">
          <span className="text-[20px] font-black text-[#013a13] truncate">
            Market Price &amp; Demand
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="material-symbols-outlined text-[#2c694e] text-[18px]">
              location_on
            </span>
            <span className="text-xs text-[#2c694e] font-bold truncate">
              {selectedProduce.marketLocation}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#e7e9e3] rounded-full">
          <span className="w-2 h-2 rounded-full bg-[#2c694e]"></span>
          <span className="text-xs font-bold text-[#414940] uppercase">
            {selectedProduce.name.split(' ')[0]}
          </span>
        </div>
      </div>

      {/* Produce Selector Chips */}
      <section className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-bold text-[#414940] uppercase tracking-wider flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px] text-[#2c694e]">
              category
            </span>
            <span>Select Produce to Inspect</span>
          </span>
          <span className="text-[11px] font-extrabold text-[#2c694e]">
            {PRODUCE_HISTORIES.length} Items Available
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pt-0.5 pb-1 -mx-4 px-4 scrollbar-none">
          {PRODUCE_HISTORIES.map((prod) => {
            const isSelected = prod.id === selectedProduceId;
            return (
              <button
                key={prod.id}
                type="button"
                onClick={() => {
                  setSelectedProduceId(prod.id);
                  setActivePointIndex(6); // reset to Today
                  if (isPlayingTwiLocal || isPlayingAudio) {
                    stopSpeech();
                    setIsPlayingTwiLocal(false);
                  }
                }}
                className={`whitespace-nowrap px-3.5 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-2xs active:scale-95 transition-all flex-shrink-0 cursor-pointer border ${
                  isSelected
                    ? 'bg-[#013a13] text-white border-[#013a13] shadow-xs'
                    : 'bg-white text-[#191c19] border-[#edefe9] hover:bg-[#f2f4ee]'
                }`}
              >
                <span className="text-base">{prod.icon}</span>
                <span>{prod.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 7-Day Price Fluctuation Data Visualization Card */}
      <div className="bg-white rounded-3xl p-4 shadow-xs border border-[#edefe9] flex flex-col gap-3">
        {/* Card Header & Metrics */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black text-[#013a13]">
                7-Day Price Fluctuation
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-black flex items-center gap-0.5 ${
                  isPositive
                    ? 'bg-[#b8f1b9] text-[#002108]'
                    : 'bg-[#ffdad6] text-[#93000a]'
                }`}
              >
                <span className="material-symbols-outlined text-[13px]">
                  {isPositive ? 'trending_up' : 'trending_down'}
                </span>
                <span>
                  {isPositive ? '+' : ''}
                  {percentDiff}%
                </span>
              </span>
            </div>
            <p className="text-xs text-[#71796f] font-medium truncate mt-0.5">
              {selectedProduce.unit}
            </p>
          </div>

          <div className="text-right flex flex-col items-end flex-shrink-0">
            <span className="text-[10px] uppercase font-bold text-[#414940] tracking-wider">
              Spot Today
            </span>
            <span className="text-[22px] font-black text-[#013a13] leading-none mt-0.5">
              GH₵ {currentSpot}
            </span>
            <span className="text-[10px] text-[#2c694e] font-semibold mt-0.5">
              Low: GH₵ {minPrice} • High: GH₵ {maxPrice}
            </span>
          </div>
        </div>

        {/* Simple SVG Line Chart */}
        <div className="relative w-full overflow-hidden rounded-2xl bg-[#f8faf4] border border-[#edefe9] pt-2 pb-1">
          <svg
            viewBox={`0 0 ${chartConfig.width} ${chartConfig.height}`}
            className="w-full h-44 overflow-visible select-none"
          >
            <defs>
              {/* Line Gradient Fill */}
              <linearGradient
                id={`priceAreaGradient-${selectedProduce.id}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#2c694e" stopOpacity="0.32" />
                <stop offset="60%" stopColor="#2c694e" stopOpacity="0.10" />
                <stop offset="100%" stopColor="#2c694e" stopOpacity="0.0" />
              </linearGradient>

              {/* Stroke Gradient */}
              <linearGradient
                id={`lineStrokeGradient-${selectedProduce.id}`}
                x1="0"
                y1="0"
                x2="1"
                y2="0"
              >
                <stop offset="0%" stopColor="#2c694e" />
                <stop offset="100%" stopColor="#013a13" />
              </linearGradient>
            </defs>

            {/* Y-Axis Grid Reference Lines & Value Labels */}
            {/* Top Grid Line (yMax) */}
            <line
              x1={chartConfig.padding.left}
              y1={chartConfig.padding.top}
              x2={chartConfig.width - chartConfig.padding.right}
              y2={chartConfig.padding.top}
              stroke="#edefe9"
              strokeDasharray="3 3"
              strokeWidth="1"
            />
            <text
              x={chartConfig.padding.left - 6}
              y={chartConfig.padding.top + 3}
              textAnchor="end"
              className="text-[9px] fill-[#71796f] font-semibold"
            >
              GH₵{chartConfig.yMax}
            </text>

            {/* Mid Grid Line */}
            <line
              x1={chartConfig.padding.left}
              y1={chartConfig.padding.top + chartConfig.plotH / 2}
              x2={chartConfig.width - chartConfig.padding.right}
              y2={chartConfig.padding.top + chartConfig.plotH / 2}
              stroke="#edefe9"
              strokeDasharray="3 3"
              strokeWidth="1"
            />
            <text
              x={chartConfig.padding.left - 6}
              y={chartConfig.padding.top + chartConfig.plotH / 2 + 3}
              textAnchor="end"
              className="text-[9px] fill-[#71796f] font-semibold"
            >
              GH₵{chartConfig.midPrice}
            </text>

            {/* Bottom Grid Line (yMin) */}
            <line
              x1={chartConfig.padding.left}
              y1={chartConfig.padding.top + chartConfig.plotH}
              x2={chartConfig.width - chartConfig.padding.right}
              y2={chartConfig.padding.top + chartConfig.plotH}
              stroke="#edefe9"
              strokeDasharray="3 3"
              strokeWidth="1"
            />
            <text
              x={chartConfig.padding.left - 6}
              y={chartConfig.padding.top + chartConfig.plotH + 3}
              textAnchor="end"
              className="text-[9px] fill-[#71796f] font-semibold"
            >
              GH₵{chartConfig.yMin}
            </text>

            {/* Gradient Area Under the Curve */}
            <path
              d={chartConfig.areaPath}
              fill={`url(#priceAreaGradient-${selectedProduce.id})`}
            />

            {/* Smooth Fluctuation Line */}
            <path
              d={chartConfig.linePath}
              fill="none"
              stroke={`url(#lineStrokeGradient-${selectedProduce.id})`}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Vertical Guide Line to Active Data Point */}
            <line
              x1={activePoint.x}
              y1={chartConfig.padding.top}
              x2={activePoint.x}
              y2={chartConfig.padding.top + chartConfig.plotH}
              stroke="#013a13"
              strokeDasharray="3 3"
              strokeWidth="1.5"
              strokeOpacity="0.45"
            />

            {/* Data Point Nodes and Touch Targets */}
            {chartConfig.points.map((pt, i) => {
              const isActive = i === activePointIndex;
              return (
                <g
                  key={pt.day}
                  className="cursor-pointer"
                  onClick={() => setActivePointIndex(i)}
                  onMouseEnter={() => setActivePointIndex(i)}
                >
                  {/* Invisible enlarged hit target for easy mobile tapping */}
                  <circle cx={pt.x} cy={pt.y} r="18" fill="transparent" />

                  {/* Outer pulse ring for active node */}
                  {isActive && (
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="9"
                      fill="#2c694e"
                      fillOpacity="0.3"
                    />
                  )}

                  {/* Main data point node */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isActive ? 5.5 : 3.5}
                    fill={isActive ? '#013a13' : '#ffffff'}
                    stroke={isActive ? '#ffffff' : '#2c694e'}
                    strokeWidth={isActive ? '2' : '2'}
                  />

                  {/* X-Axis Day Label */}
                  <text
                    x={pt.x}
                    y={chartConfig.height - 6}
                    textAnchor="middle"
                    className={`text-[10px] font-bold ${
                      isActive
                        ? 'fill-[#013a13] font-black'
                        : 'fill-[#71796f]'
                    }`}
                  >
                    {pt.day}
                  </text>
                </g>
              );
            })}

            {/* Active Data Point Floating Badge */}
            <g
              transform={`translate(${Math.max(
                chartConfig.padding.left + 32,
                Math.min(chartConfig.width - 48, activePoint.x)
              )}, ${Math.max(14, activePoint.y - 12)})`}
            >
              <rect
                x="-36"
                y="-14"
                width="72"
                height="18"
                rx="6"
                fill="#013a13"
                className="drop-shadow-xs"
              />
              <text
                x="0"
                y="-2"
                textAnchor="middle"
                fill="#ffffff"
                className="text-[10px] font-extrabold tracking-tight"
              >
                GH₵ {activePoint.price}
              </text>
            </g>
          </svg>

          {/* Interactive Day Inspection Strip */}
          <div className="mx-2 mt-1 p-2 rounded-xl bg-white flex items-center justify-between border border-[#edefe9] shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#2c694e]"></span>
              <span className="text-xs text-[#191c19] font-bold">
                {activePoint.day} ({activePoint.date}):
              </span>
              <span className="text-xs font-black text-[#013a13]">
                GH₵ {activePoint.price} / crate
              </span>
            </div>

            <div className="text-[11px] text-[#414940] font-semibold">
              {activePoint.price >= startPrice ? '+' : ''}
              {activePoint.price - startPrice} GHS vs Day 1
            </div>
          </div>
        </div>

        {/* 3 Metric Tiles for Selected Produce */}
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col p-2.5 rounded-xl bg-[#f2f4ee]">
            <span className="text-[11px] text-[#414940] font-medium">30-Day Avg</span>
            <span className="text-[18px] text-[#191c19] font-black mt-1">
              GH₵ {selectedProduce.thirtyDayAvg}
            </span>
            <span className="text-[10px] text-[#71796f] mt-0.5 font-medium">
              Baseline
            </span>
          </div>

          <div className="flex flex-col p-2.5 rounded-xl bg-[#aeeecb] text-[#316e52]">
            <span className="text-[11px] font-bold">Spot Today</span>
            <span className="text-[18px] font-black mt-1 text-[#002114]">
              GH₵ {currentSpot}
            </span>
            <span className="text-[10px] flex items-center gap-0.5 mt-0.5 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2c694e]"></span> Active
            </span>
          </div>

          <div className="flex flex-col p-2.5 rounded-xl bg-[#b8f1b9] text-[#002108]">
            <span className="text-[11px] font-bold">Forecast Peak</span>
            <span className="text-[18px] font-black mt-1 text-[#013a13]">
              GH₵ {selectedProduce.nextWeekPeak}
            </span>
            <span className="text-[10px] font-bold flex items-center gap-0.5 mt-0.5 text-[#013a13]">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              {selectedProduce.advisory.trendBadge}
            </span>
          </div>
        </div>

        {/* Trend Comparison Bars */}
        <div className="p-3 bg-[#f2f4ee] rounded-xl border border-[#edefe9]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#191c19]">Trend Comparison</span>
            <span className="text-xs text-[#2c694e] font-bold">
              Growth +{(((selectedProduce.nextWeekPeak - selectedProduce.thirtyDayAvg) / selectedProduce.thirtyDayAvg) * 100).toFixed(1)}% vs 30d
            </span>
          </div>

          <div className="space-y-3 pt-1">
            <div>
              <div className="flex justify-between text-xs text-[#414940] mb-1">
                <span>Past Month (Avg)</span>
                <span className="font-bold">GH₵ {selectedProduce.thirtyDayAvg}</span>
              </div>
              <div className="w-full h-3 bg-[#e1e3dd] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#71796f] rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.min(100, Math.round((selectedProduce.thirtyDayAvg / selectedProduce.nextWeekPeak) * 100))}%`,
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-[#2c694e] mb-1">
                <span className="font-bold">Today (Spot Rate)</span>
                <span className="font-bold">GH₵ {currentSpot}</span>
              </div>
              <div className="w-full h-3 bg-[#e1e3dd] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#2c694e] rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.min(100, Math.round((currentSpot / selectedProduce.nextWeekPeak) * 100))}%`,
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-[#013a13] mb-1">
                <span className="font-bold">Next Week (Predicted Peak)</span>
                <span className="font-black text-[#013a13]">GH₵ {selectedProduce.nextWeekPeak}</span>
              </div>
              <div className="w-full h-3.5 bg-[#e1e3dd] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#013a13] rounded-full transition-all duration-700"
                  style={{ width: '100%' }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Target Price Threshold Alerts Section */}
      <div className="bg-white rounded-3xl p-4 shadow-xs border border-[#edefe9] flex flex-col gap-3.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#013a13] text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[18px]">
                notifications_active
              </span>
            </div>
            <div>
              <h2 className="text-base font-black text-[#013a13] leading-tight">
                Price Target Alerts
              </h2>
              <span className="text-[11px] text-[#71796f] font-medium">
                Automated notification when market hits your goal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="px-2.5 py-1 rounded-full bg-[#aeeecb] text-[#002114] text-xs font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2c694e] animate-pulse"></span>
              {priceAlerts.filter((a) => a.active).length} Active
            </span>
            <button
              onClick={() => setShowManageAlertsModal(true)}
              className="px-2.5 py-1 rounded-full bg-[#f2f4ee] hover:bg-[#edefe9] text-[#191c19] text-xs font-bold transition-all active:scale-95 cursor-pointer"
            >
              Manage ({priceAlerts.length})
            </button>
          </div>
        </div>

        {/* Active Alert for Selected Produce */}
        {(() => {
          const activeForCurrent = priceAlerts.find(
            (a) => a.produceId === selectedProduce.id && a.active
          );
          const allForCurrent = priceAlerts.filter(
            (a) => a.produceId === selectedProduce.id
          );

          if (activeForCurrent) {
            const isRise = activeForCurrent.condition === 'above_or_equal';
            const priceDistance = activeForCurrent.targetPrice - currentSpot;
            return (
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#f2f6ee] to-[#e8efe2] border border-[#d6e2cf] flex flex-col gap-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl p-1.5 rounded-xl bg-white shadow-xs">
                      {selectedProduce.icon}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#414940] uppercase">
                          Active Threshold
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            isRise
                              ? 'bg-[#b8f1b9] text-[#002108]'
                              : 'bg-[#d0e4ff] text-[#001d36]'
                          }`}
                        >
                          {isRise ? '≥ Rises To' : '≤ Drops To'}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-[20px] font-black text-[#013a13]">
                          GH₵ {activeForCurrent.targetPrice}
                        </span>
                        <span className="text-xs text-[#71796f]">
                          / {selectedProduce.unit.split(' ')[0]}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    {activeForCurrent.triggered ? (
                      <span className="px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#93000a] text-[10px] font-black flex items-center gap-1 animate-pulse">
                        <span className="material-symbols-outlined text-[12px]">check_circle</span>
                        Triggered @ GH₵ {activeForCurrent.lastTriggeredPrice}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-[#b8f1b9] text-[#002108] text-[10px] font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2c694e] animate-ping"></span>
                        Monitoring Live
                      </span>
                    )}
                    <span className="text-[11px] text-[#414940] font-semibold">
                      {priceDistance > 0 ? `+${priceDistance}` : priceDistance} GH₵ from spot today
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-[#414940] pt-1 border-t border-[#d8e4d2]">
                  <span className="flex items-center gap-1 truncate text-[11px]">
                    <span className="material-symbols-outlined text-[15px] text-[#2c694e]">
                      storefront
                    </span>
                    {activeForCurrent.marketLocation}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() =>
                        testTriggerPriceAlert(activeForCurrent.id, activeForCurrent.targetPrice)
                      }
                      className="px-2.5 py-1 bg-[#013a13] hover:bg-[#1e5128] text-white rounded-lg text-[11px] font-bold active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                      title="Simulate this alert being hit now"
                    >
                      <span className="material-symbols-outlined text-[14px]">bolt</span>
                      <span>Test Trigger</span>
                    </button>

                    <button
                      onClick={() => togglePriceAlert(activeForCurrent.id)}
                      className="px-2 py-1 bg-white hover:bg-[#e7e9e3] text-[#414940] rounded-lg text-[11px] font-bold border border-[#c1c9bd] transition-all cursor-pointer"
                    >
                      Pause
                    </button>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div className="p-3 rounded-2xl bg-[#f8faf4] border border-dashed border-[#c1c9bd] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-2xl p-1.5 rounded-xl bg-white shadow-2xs">
                  {selectedProduce.icon}
                </span>
                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-[#191c19] truncate">
                    No active alert for {selectedProduce.name}
                  </h3>
                  <p className="text-[11px] text-[#71796f] truncate mt-0.5">
                    Get alerted when prices hit your selling or buying target
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setAlertProduceId(selectedProduce.id);
                  setAlertCondition('above_or_equal');
                  setAlertTargetPrice(Math.round(currentSpot * 1.08));
                  setAlertMarket(selectedProduce.marketLocation);
                  setShowSetAlertModal(true);
                }}
                className="px-3.5 py-2 bg-[#013a13] hover:bg-[#1e5128] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs active:scale-95 transition-all flex-shrink-0 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">add_alert</span>
                <span>Set Alert</span>
              </button>
            </div>
          );
        })()}

        {/* Live Market Price Shift Simulator */}
        <div className="p-3 bg-[#f2f4ee] rounded-2xl border border-[#edefe9] flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-[#191c19] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#2c694e]">
                tune
              </span>
              <span>Test Alert Trigger (Price Simulation)</span>
            </span>
            <span className="text-[11px] font-bold text-[#2c694e]">
              Spot Today: GH₵ {currentSpot}
            </span>
          </div>

          <p className="text-[11px] text-[#71796f] leading-tight">
            Select a price shift to test how threshold notifications react when market prices change:
          </p>

          <div className="grid grid-cols-4 gap-1.5">
            {[
              { label: '+GH₵ 10', delta: 10 },
              { label: '+GH₵ 15 (Surge)', delta: 15 },
              { label: '+GH₵ 25 (Peak)', delta: 25 },
              { label: '-GH₵ 10 (Dip)', delta: -10 },
            ].map((preset) => {
              const isSelected = simulationOffset === preset.delta;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setSimulationOffset(preset.delta)}
                  className={`py-1.5 px-1 rounded-xl text-[11px] font-bold text-center transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-[#013a13] text-white border-[#013a13]'
                      : 'bg-white text-[#414940] border-[#edefe9] hover:bg-[#e7e9e3]'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 pt-0.5">
            <button
              onClick={() => {
                const simulatedPrice = currentSpot + simulationOffset;
                const count = checkPriceThresholds(
                  selectedProduce.id,
                  simulatedPrice,
                  selectedProduce.marketLocation
                );
                if (count === 0) {
                  showToast(
                    `Market simulated at GH₵ ${simulatedPrice}. No active threshold was crossed for ${selectedProduce.name}.`
                  );
                }
              }}
              className="flex-1 h-10 bg-[#2c694e] hover:bg-[#1e5128] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-98 transition-all shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">play_circle</span>
              <span>Simulate Spot at GH₵ {currentSpot + simulationOffset}</span>
            </button>

            <button
              onClick={() => {
                setAlertProduceId(selectedProduce.id);
                setAlertCondition('above_or_equal');
                setAlertTargetPrice(Math.round(currentSpot * 1.08));
                setAlertMarket(selectedProduce.marketLocation);
                setShowSetAlertModal(true);
              }}
              className="h-10 px-3 bg-white text-[#013a13] border border-[#c1c9bd] hover:bg-[#edefe9] rounded-xl text-xs font-bold flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>New Alert</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Action Advisory Callout for Selected Produce */}
      <div className="relative overflow-hidden rounded-2xl bg-[#ffdbcf] text-[#380d00] p-4 shadow-sm border border-[#ffb59a]/60">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#802a00] text-[#ffdbcf]">
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                lightbulb
              </span>
            </span>
            <span className="text-base font-bold">Action Advisory • {selectedProduce.name.split(' ')[0]}</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-[#812a00] text-[#ffdbcf] text-xs font-bold tracking-wide">
            {selectedProduce.advisory.badge}
          </span>
        </div>

        <p className="text-xs text-[#380d00] font-medium leading-relaxed mb-3">
          {selectedProduce.advisory.summary}
        </p>

        <button
          onClick={handleToggleAudio}
          className="flex items-center justify-center gap-2 w-full h-13 px-4 bg-[#5b1b00] hover:bg-[#812a00] text-white rounded-xl text-xs font-bold transition-transform active:scale-95 shadow-sm cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">
            {isPlayingTwiLocal || isPlayingAudio ? 'pause_circle' : 'volume_up'}
          </span>
          <span>
            {isPlayingTwiLocal || isPlayingAudio
              ? 'Gyae / Stop Listening'
              : `Listen Advisory for ${selectedProduce.name.split(' ')[0]} (Twi)`}
          </span>
        </button>

        {(isPlayingTwiLocal || isPlayingAudio) && (
          <div className="mt-3 pt-1 flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-3 bg-[#5b1b00] animate-pulse rounded-full"></span>
            <span className="w-1.5 h-6 bg-[#5b1b00] animate-pulse rounded-full"></span>
            <span className="w-1.5 h-4 bg-[#5b1b00] animate-pulse rounded-full"></span>
            <span className="w-1.5 h-7 bg-[#5b1b00] animate-pulse rounded-full"></span>
            <span className="w-1.5 h-3 bg-[#5b1b00] animate-pulse rounded-full"></span>
            <span className="text-xs text-[#380d00] ml-2 italic font-semibold">
              Playing {selectedProduce.name} vernacular advisory...
            </span>
          </div>
        )}
      </div>

      {/* Regional Buyer Pressure */}
      <div className="flex items-center justify-between mt-1 mb-1">
        <div className="flex items-center gap-2">
          <span
            className="material-symbols-outlined text-[#812a00] text-[20px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            local_fire_department
          </span>
          <h2 className="text-[19px] font-bold text-[#191c19]">
            Regional Buyer Pressure
          </h2>
        </div>
        <span className="text-xs text-[#71796f] font-semibold">Realtime Bids</span>
      </div>

      <div className="space-y-3">
        {/* Kasoa Market */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#edefe9]">
          <div className="flex items-start justify-between">
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold text-[#191c19] truncate">
                  Kasoa Market
                </span>
                <span className="text-xs text-[#414940]">(Central)</span>
              </div>
              <span className="text-xs text-[#71796f] mt-0.5">
                Heavy bulk purchase active for {selectedProduce.name.split(' ')[0]}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[19px] font-black text-[#013a13]">
                GH₵ {selectedProduce.regionalPrices.kasoa}
              </span>
              <span className="block text-xs text-[#414940]">avg / unit</span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#ffdbcf] text-[#380d00] text-xs font-black">
              <span
                className="material-symbols-outlined text-[15px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                local_fire_department
              </span>
              VERY HIGH DEMAND
            </span>
            <div className="flex items-center gap-1">
              <span className="w-3.5 h-2 rounded bg-[#812a00]"></span>
              <span className="w-3.5 h-2 rounded bg-[#812a00]"></span>
              <span className="w-3.5 h-2 rounded bg-[#812a00]"></span>
              <span className="w-3.5 h-2 rounded bg-[#812a00]"></span>
            </div>
          </div>
        </div>

        {/* Makola Market */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#edefe9]">
          <div className="flex items-start justify-between">
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold text-[#191c19] truncate">
                  Makola Market
                </span>
                <span className="text-xs text-[#414940]">(Accra)</span>
              </div>
              <span className="text-xs text-[#71796f] mt-0.5">
                Steady retail off-take
              </span>
            </div>
            <div className="text-right">
              <span className="text-[19px] font-black text-[#013a13]">
                GH₵ {selectedProduce.regionalPrices.makola}
              </span>
              <span className="block text-xs text-[#414940]">avg / unit</span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#b1f0ce] text-[#0e5138] text-xs font-black">
              <span className="material-symbols-outlined text-[15px]">trending_up</span>
              HIGH DEMAND
            </span>
            <div className="flex items-center gap-1">
              <span className="w-3.5 h-2 rounded bg-[#2c694e]"></span>
              <span className="w-3.5 h-2 rounded bg-[#2c694e]"></span>
              <span className="w-3.5 h-2 rounded bg-[#2c694e]"></span>
              <span className="w-3.5 h-2 rounded bg-[#e1e3dd]"></span>
            </div>
          </div>
        </div>

        {/* Kejetia Market */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#edefe9]">
          <div className="flex items-start justify-between">
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold text-[#191c19] truncate">
                  Kejetia Market
                </span>
                <span className="text-xs text-[#414940]">(Kumasi)</span>
              </div>
              <span className="text-xs text-[#71796f] mt-0.5">
                Sufficient regional inventory
              </span>
            </div>
            <div className="text-right">
              <span className="text-[19px] font-black text-[#013a13]">
                GH₵ {selectedProduce.regionalPrices.kejetia}
              </span>
              <span className="block text-xs text-[#414940]">avg / unit</span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#e7e9e3] text-[#414940] text-xs font-bold">
              <span className="material-symbols-outlined text-[15px]">drag_handle</span>
              MODERATE
            </span>
            <div className="flex items-center gap-1">
              <span className="w-3.5 h-2 rounded bg-[#71796f]"></span>
              <span className="w-3.5 h-2 rounded bg-[#71796f]"></span>
              <span className="w-3.5 h-2 rounded bg-[#e1e3dd]"></span>
              <span className="w-3.5 h-2 rounded bg-[#e1e3dd]"></span>
            </div>
          </div>
        </div>
      </div>

      {/* Direct Bulk Aggregator Notice */}
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-white shadow-xs border border-[#edefe9]">
        <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-[#f2f4ee]">
          <img
            className="w-full h-full object-cover"
            alt="Aggregator Notice"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuA4WyeaObCwomituxiQ9WCALYDUSLP3FR_Ava-U2IJgSESlJS6iLFKLAF4dqT15ySh_UyNadjNdcA0Uv660oopw9lc5d0bsHGegddasb0JSTznuc_AQlcbGU_vtIYRoU7YNdb-IqhdW1XOMEgv9g0i6JXXFK-4M5dz3Mn362dWZnmkyYTTy_OwdNdfh_R5_GyyzhHmwDgy2xSIhlANALG3BRY-f1g8acq6oCd2Ng66f2uzFNA7XtZ1A"
          />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-bold text-[#013a13] truncate">
            Direct Bulk Aggregator Notice
          </span>
          <span className="text-xs text-[#414940] leading-snug line-clamp-2">
            Haulage trucks ready to dispatch to Techiman and Offinso hubs from
            Sunday midnight for verified {selectedProduce.name.toLowerCase()} lots.
          </span>
        </div>
      </div>

      {/* Advisory Disclaimer */}
      <div className="p-3 bg-[#edefe9] rounded-xl flex items-start gap-2.5">
        <span className="material-symbols-outlined text-[#71796f] text-[20px] flex-shrink-0 mt-0.5">
          warning
        </span>
        <p className="text-xs text-[#414940] leading-relaxed">
          <strong>Advisory Only:</strong> Market rates fluctuate based on rainfall,
          fuel shifts, and road accessibility along the Techiman-Ejura corridor.
          This does not constitute a guaranteed contract price.
        </p>
      </div>

      {/* Sticky Bottom Action */}
      <div className="pt-2">
        <button
          onClick={() => setActiveTab('sell')}
          className="flex items-center justify-center gap-3 w-full h-14 bg-[#013a13] hover:bg-[#1e5128] text-white rounded-2xl text-base font-bold shadow-md transition-all active:scale-[0.98] cursor-pointer"
        >
          <span className="material-symbols-outlined text-[24px]">post_add</span>
          <span>List at Recommended Price (GH₵ {selectedProduce.recommendedListPrice})</span>
        </button>
      </div>

      {/* MODAL 1: Set Price Target Alert Modal */}
      {showSetAlertModal && (() => {
        const activeModalProduce =
          PRODUCE_HISTORIES.find((p) => p.id === alertProduceId) || selectedProduce;
        const activeModalSpot =
          activeModalProduce.history[activeModalProduce.history.length - 1].price;

        return (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-start justify-between pb-2 border-b border-[#edefe9]">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#aeeecb] text-[#002114] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[22px]">
                      notification_add
                    </span>
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-[#191c19]">
                      Set Price Target Alert
                    </h2>
                    <p className="text-xs text-[#71796f]">
                      Get notified the moment market spot reaches your target
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowSetAlertModal(false)}
                  aria-label="Close modal"
                  className="w-8 h-8 rounded-full bg-[#f2f4ee] hover:bg-[#e7e9e3] text-[#414940] flex items-center justify-center cursor-pointer transition-all active:scale-90"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              {/* 1. Produce Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#191c19]">
                  Select Crop to Monitor:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {PRODUCE_HISTORIES.map((p) => {
                    const isSelected = p.id === alertProduceId;
                    const spot = p.history[p.history.length - 1].price;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setAlertProduceId(p.id);
                          setAlertMarket(p.marketLocation);
                          setAlertTargetPrice(
                            alertCondition === 'above_or_equal'
                              ? Math.round(spot * 1.08)
                              : Math.round(spot * 0.92)
                          );
                        }}
                        className={`p-2.5 rounded-2xl flex flex-col items-center text-center gap-1 transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-[#013a13] text-white border-[#013a13] shadow-xs'
                            : 'bg-[#f8faf4] text-[#191c19] border-[#edefe9] hover:bg-[#f2f4ee]'
                        }`}
                      >
                        <span className="text-2xl">{p.icon}</span>
                        <span className="text-xs font-bold truncate w-full">
                          {p.name.split(' ')[0]}
                        </span>
                        <span
                          className={`text-[10px] font-semibold ${
                            isSelected ? 'text-[#aeeecb]' : 'text-[#71796f]'
                          }`}
                        >
                          GH₵ {spot}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Target Condition */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#191c19]">
                  Notify Me When:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAlertCondition('above_or_equal');
                      setAlertTargetPrice(Math.round(activeModalSpot * 1.08));
                    }}
                    className={`p-3 rounded-2xl flex flex-col gap-1 text-left transition-all cursor-pointer border ${
                      alertCondition === 'above_or_equal'
                        ? 'bg-[#b8f1b9] text-[#002108] border-[#2c694e] ring-1 ring-[#2c694e]'
                        : 'bg-white text-[#414940] border-[#edefe9] hover:bg-[#f2f4ee]'
                    }`}
                  >
                    <div className="flex items-center gap-1 font-black text-xs">
                      <span className="material-symbols-outlined text-[16px]">
                        trending_up
                      </span>
                      <span>Rises To or Above (≥)</span>
                    </div>
                    <span className="text-[11px] opacity-80 leading-tight">
                      Best for Farmers selling at peak rates
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAlertCondition('below_or_equal');
                      setAlertTargetPrice(Math.round(activeModalSpot * 0.92));
                    }}
                    className={`p-3 rounded-2xl flex flex-col gap-1 text-left transition-all cursor-pointer border ${
                      alertCondition === 'below_or_equal'
                        ? 'bg-[#d0e4ff] text-[#001d36] border-[#004a77] ring-1 ring-[#004a77]'
                        : 'bg-white text-[#414940] border-[#edefe9] hover:bg-[#f2f4ee]'
                    }`}
                  >
                    <div className="flex items-center gap-1 font-black text-xs">
                      <span className="material-symbols-outlined text-[16px]">
                        trending_down
                      </span>
                      <span>Drops To or Below (≤)</span>
                    </div>
                    <span className="text-[11px] opacity-80 leading-tight">
                      Best for Buyers looking for bargains
                    </span>
                  </button>
                </div>
              </div>

              {/* 3. Target Price Input with Stepper */}
              <div className="flex flex-col gap-2 p-3.5 rounded-2xl bg-[#f2f4ee] border border-[#edefe9]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#191c19]">
                    Target Price Threshold:
                  </span>
                  <span className="text-xs text-[#2c694e] font-bold">
                    Current Spot: GH₵ {activeModalSpot}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-[#d8dbd5]">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setAlertTargetPrice((prev) => Math.max(10, prev - 10))}
                      className="w-9 h-9 rounded-xl bg-[#edefe9] hover:bg-[#e1e3dd] text-[#191c19] text-xs font-bold transition-all active:scale-90"
                    >
                      -10
                    </button>
                    <button
                      type="button"
                      onClick={() => setAlertTargetPrice((prev) => Math.max(5, prev - 5))}
                      className="w-9 h-9 rounded-xl bg-[#edefe9] hover:bg-[#e1e3dd] text-[#191c19] text-xs font-bold transition-all active:scale-90"
                    >
                      -5
                    </button>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-xs font-bold text-[#71796f]">GH₵</span>
                    <input
                      type="number"
                      value={alertTargetPrice}
                      onChange={(e) => setAlertTargetPrice(Number(e.target.value) || 0)}
                      className="w-20 text-center text-2xl font-black text-[#013a13] bg-transparent focus:outline-hidden"
                    />
                    <span className="text-[11px] text-[#71796f]">/ unit</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setAlertTargetPrice((prev) => prev + 5)}
                      className="w-9 h-9 rounded-xl bg-[#edefe9] hover:bg-[#e1e3dd] text-[#191c19] text-xs font-bold transition-all active:scale-90"
                    >
                      +5
                    </button>
                    <button
                      type="button"
                      onClick={() => setAlertTargetPrice((prev) => prev + 10)}
                      className="w-9 h-9 rounded-xl bg-[#edefe9] hover:bg-[#e1e3dd] text-[#191c19] text-xs font-bold transition-all active:scale-90"
                    >
                      +10
                    </button>
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="flex items-center gap-1.5 overflow-x-auto pt-1 scrollbar-none">
                  {[
                    { label: 'Spot Today', val: activeModalSpot },
                    { label: '+5% Target', val: Math.round(activeModalSpot * 1.05) },
                    { label: '+10% Surge', val: Math.round(activeModalSpot * 1.1) },
                    { label: 'Forecast Peak', val: activeModalProduce.nextWeekPeak },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setAlertTargetPrice(preset.val)}
                      className={`whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] font-bold transition-all active:scale-95 cursor-pointer border ${
                        alertTargetPrice === preset.val
                          ? 'bg-[#013a13] text-white border-[#013a13]'
                          : 'bg-white text-[#414940] border-[#edefe9] hover:bg-[#e7e9e3]'
                      }`}
                    >
                      {preset.label} (GH₵ {preset.val})
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Market Location Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#191c19]">
                  Market to Monitor:
                </label>
                <select
                  value={alertMarket}
                  onChange={(e) => setAlertMarket(e.target.value)}
                  className="w-full h-11 px-3 bg-[#f2f4ee] border border-[#edefe9] rounded-xl text-xs font-bold text-[#191c19] focus:outline-hidden focus:ring-2 focus:ring-[#013a13]"
                >
                  <option value="Techiman Wholesale Market">
                    Techiman Wholesale Market (Bono East Hub)
                  </option>
                  <option value="Makola Market (Accra)">
                    Makola Market (Accra Central Retail)
                  </option>
                  <option value="Kejetia Market (Kumasi)">
                    Kejetia Market (Kumasi Wholesale)
                  </option>
                  <option value="Kasoa Aggregator Hub">
                    Kasoa Aggregator Hub (Coastal Belt)
                  </option>
                  <option value="All Regional Markets">
                    All Regional Markets (Any Market Cross)
                  </option>
                </select>
              </div>

              {/* 5. SMS & Audio Guidance Options */}
              <div className="flex flex-col gap-2 p-3 rounded-2xl bg-[#f8faf4] border border-[#edefe9]">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px] text-[#2c694e]">
                      sms
                    </span>
                    <div>
                      <span className="text-xs font-bold text-[#191c19] block">
                        Send Instant SMS Alert
                      </span>
                      <span className="text-[10px] text-[#71796f]">
                        Sent to Kwame Mensah (024 582 9104)
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={alertNotifySms}
                    onChange={(e) => setAlertNotifySms(e.target.checked)}
                    className="w-5 h-5 accent-[#013a13] rounded cursor-pointer"
                  />
                </label>

                <button
                  type="button"
                  onClick={() =>
                    playSpeech(
                      `Sɛ ${activeModalProduce.name} boɔ duru ${alertTargetPrice} Cedis ${
                        alertCondition === 'above_or_equal' ? 'soro' : 'fom'
                      } wɔ ${alertMarket} a, yɛbɛbɔ wo amanneɛ ntɛm wɔ wo fon so ne SMS so.`,
                      `${activeModalProduce.name} Alert Voice Guide`
                    )
                  }
                  className="flex items-center justify-center gap-1.5 py-1.5 bg-[#edefe9] hover:bg-[#e7e9e3] text-[#2c694e] rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer mt-1"
                >
                  <span className="material-symbols-outlined text-[16px]">volume_up</span>
                  <span>Tie wɔ Twi mu (Listen in Twi)</span>
                </button>
              </div>

              {/* 6. Save & Cancel Actions */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSetAlertModal(false)}
                  className="flex-1 h-12 rounded-2xl bg-[#f2f4ee] hover:bg-[#edefe9] text-[#414940] text-xs font-bold transition-all active:scale-98 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const prod =
                      PRODUCE_HISTORIES.find((p) => p.id === alertProduceId) || selectedProduce;
                    addPriceAlert({
                      produceId: prod.id,
                      produceName: prod.name,
                      twiName: prod.twiName,
                      icon: prod.icon,
                      unit: prod.unit,
                      targetPrice: alertTargetPrice,
                      condition: alertCondition,
                      marketLocation: alertMarket,
                      active: true,
                      notifyViaSms: alertNotifySms,
                      smsPhone: '024 582 9104',
                      twiSpokenGuidance: `Sɛ ${prod.name} boɔ duru ${alertTargetPrice} Cedis ${
                        alertCondition === 'above_or_equal'
                          ? 'anaa ɛkɔ soro sen saa'
                          : 'anaa ɛsian kɔfam'
                      } a, yɛbɛbɔ wo amanneɛ ntɛm.`,
                    });
                    setShowSetAlertModal(false);
                  }}
                  className="flex-2 h-12 rounded-2xl bg-[#013a13] hover:bg-[#1e5128] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    check_circle
                  </span>
                  <span>Save Target Alert</span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* MODAL 2: Manage All Price Threshold Alerts Modal */}
      {showManageAlertsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-2 border-b border-[#edefe9]">
              <div>
                <h2 className="text-lg font-black text-[#191c19]">
                  Active Price Threshold Alerts
                </h2>
                <p className="text-xs text-[#71796f]">
                  {priceAlerts.length} total alert(s) monitored for market fluctuations
                </p>
              </div>

              <button
                onClick={() => setShowManageAlertsModal(false)}
                aria-label="Close modal"
                className="w-8 h-8 rounded-full bg-[#f2f4ee] hover:bg-[#e7e9e3] text-[#414940] flex items-center justify-center cursor-pointer transition-all active:scale-90"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* List of configured alerts */}
            <div className="flex flex-col gap-3 max-h-[50vh] overflow-y-auto pr-1">
              {priceAlerts.length === 0 ? (
                <div className="p-8 text-center flex flex-col items-center gap-2 bg-[#f8faf4] rounded-2xl border border-dashed border-[#d8dbd5]">
                  <span className="material-symbols-outlined text-[36px] text-[#71796f]">
                    notifications_off
                  </span>
                  <p className="text-xs text-[#71796f] font-medium">
                    No price threshold alerts configured yet.
                  </p>
                </div>
              ) : (
                priceAlerts.map((alert) => {
                  const isRise = alert.condition === 'above_or_equal';
                  return (
                    <div
                      key={alert.id}
                      className={`p-3.5 rounded-2xl border flex flex-col gap-2.5 transition-all ${
                        alert.active
                          ? 'bg-white border-[#d8e4d2] shadow-2xs'
                          : 'bg-[#f2f4ee] border-[#e1e3dd] opacity-75'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl p-1.5 rounded-xl bg-[#f8faf4]">
                            {alert.icon}
                          </span>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-bold text-[#191c19]">
                                {alert.produceName}
                              </span>
                              <span
                                className={`px-2 py-0.2 rounded-full text-[10px] font-extrabold uppercase ${
                                  isRise
                                    ? 'bg-[#b8f1b9] text-[#002108]'
                                    : 'bg-[#d0e4ff] text-[#001d36]'
                                }`}
                              >
                                {isRise ? '≥' : '≤'} GH₵ {alert.targetPrice}
                              </span>
                            </div>
                            <span className="text-[11px] text-[#71796f] block mt-0.5">
                              {alert.marketLocation}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => togglePriceAlert(alert.id)}
                            className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                              alert.active
                                ? 'bg-[#b8f1b9] text-[#002108]'
                                : 'bg-[#e1e3dd] text-[#414940]'
                            }`}
                          >
                            {alert.active ? 'Active' : 'Paused'}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-[#414940] pt-1.5 border-t border-[#edefe9]">
                        <div className="flex items-center gap-1 text-[11px]">
                          {alert.triggered ? (
                            <span className="text-[#93000a] font-bold flex items-center gap-0.5">
                              <span className="material-symbols-outlined text-[14px]">
                                error
                              </span>
                              Triggered ({alert.lastTriggeredAt || 'recent'})
                            </span>
                          ) : (
                            <span className="text-[#2c694e] font-semibold flex items-center gap-0.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#2c694e]"></span>
                              Monitoring market rates
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => testTriggerPriceAlert(alert.id)}
                            className="px-2.5 py-1 bg-[#013a13] hover:bg-[#1e5128] text-white rounded-lg text-[11px] font-bold active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                            title="Simulate hitting target"
                          >
                            <span className="material-symbols-outlined text-[13px]">bolt</span>
                            <span>Test Fire</span>
                          </button>

                          <button
                            onClick={() => removePriceAlert(alert.id)}
                            className="w-7 h-7 rounded-lg bg-[#ffdad6] text-[#93000a] flex items-center justify-center hover:bg-[#ffb4ab] transition-all cursor-pointer"
                            title="Delete alert"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              delete
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-[#edefe9]">
              <button
                onClick={() => {
                  setShowManageAlertsModal(false);
                  setShowSetAlertModal(true);
                }}
                className="flex-1 h-12 bg-[#013a13] hover:bg-[#1e5128] text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-98 transition-all cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-[18px]">add_alert</span>
                <span>Add New Alert</span>
              </button>

              <button
                onClick={() => setShowManageAlertsModal(false)}
                className="px-5 h-12 bg-[#f2f4ee] hover:bg-[#edefe9] text-[#191c19] rounded-2xl text-xs font-bold active:scale-98 transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

