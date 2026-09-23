import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const UssdModal: React.FC = () => {
  const { showUssdModal, setShowUssdModal, playSpeech, showToast } = useApp();
  const [inputVal, setInputVal] = useState('');
  const [menuLevel, setMenuLevel] = useState<'main' | 'prices' | 'demand' | 'commitments' | 'transport' | 'weather'>('main');
  const [message, setMessage] = useState<string>('');

  if (!showUssdModal) return null;

  const handleSend = () => {
    const trimmed = inputVal.trim();
    setInputVal('');

    if (menuLevel === 'main') {
      if (trimmed === '1') {
        setMenuLevel('prices');
      } else if (trimmed === '2') {
        setMenuLevel('demand');
      } else if (trimmed === '3') {
        setMessage('Harvest listed! 50 crates Roma Tomato registered via USSD. Buyers alerted.');
        showToast('USSD: Expected harvest registered!');
      } else if (trimmed === '4') {
        setMenuLevel('commitments');
      } else if (trimmed === '5') {
        setMenuLevel('transport');
      } else if (trimmed === '6') {
        setMenuLevel('weather');
      } else {
        setMessage('Invalid choice. Reply 1-6.');
      }
    } else {
      if (trimmed === '0') {
        setMenuLevel('main');
        setMessage('');
      } else if (menuLevel === 'commitments' && trimmed === '1') {
        setMessage('Pre-Commitment ACCEPTED! SMS dispatched to Buyer Ama Serwaa. Pickup locked.');
        showToast('Commitment accepted via USSD');
      } else if (menuLevel === 'transport' && trimmed === '1') {
        setMessage('Shared Haulage Booked! Kofi Mensah (0244119022) assigned. Saved GH₵ 180.');
        showToast('Shared transport booked via USSD');
      } else {
        setMenuLevel('main');
        setMessage('');
      }
    }
  };

  const handleReadScreen = () => {
    let textToRead = '';
    if (menuLevel === 'main') {
      textToRead = 'Nkabom AgriLink USSD. 1 for Tomato Prices, 2 for Market Demand, 3 to List Expected Harvest, 4 for Buyer Pre-Commitments, 5 for Shared Transport, 6 for Weather and Spoilage.';
    } else if (menuLevel === 'prices') {
      textToRead = 'Central Region Tomato Prices: Kasoa Wholesale 180 Cedis, Mankessim Farmgate 150 Cedis, Makola Accra 175 Cedis, Cape Coast 140 Cedis.';
    } else if (menuLevel === 'commitments') {
      textToRead = 'Pending Pre-Commitments: Ama Serwaa wants 30 crates at 160 Cedis. Reply 1 to Accept.';
    }
    playSpeech(textToRead, 'USSD Audio Readout • Twi & English');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      {/* Retro / Modern Feature Phone Frame */}
      <div className="w-full max-w-sm bg-[#1c221e] rounded-[36px] p-5 shadow-2xl border-4 border-[#334238] flex flex-col gap-4 text-white relative">
        {/* Phone Earpiece */}
        <div className="w-16 h-1.5 bg-[#414940] rounded-full mx-auto mb-1"></div>

        {/* Header Bar */}
        <div className="flex items-center justify-between text-xs text-[#aeeecb] px-1">
          <div className="flex items-center gap-1 font-mono">
            <span className="material-symbols-outlined text-[14px]">signal_cellular_alt</span>
            <span>MTN GH • 2G</span>
          </div>
          <span className="font-mono font-bold text-[11px]">*920*44#</span>
          <button
            onClick={() => setShowUssdModal(false)}
            className="w-7 h-7 rounded-full bg-[#2a352c] text-white flex items-center justify-center hover:bg-[#3d4d40] text-xs cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Nokia / Feature Phone Backlit LCD Screen */}
        <div className="w-full bg-[#9bc53d] text-[#1c2e06] p-4 rounded-2xl shadow-inner font-mono min-h-[220px] flex flex-col justify-between border-2 border-[#82a830] select-text">
          <div className="text-xs leading-relaxed space-y-1.5">
            <div className="font-black border-b border-[#77992c] pb-1 text-[11px] uppercase tracking-wider flex items-center justify-between">
              <span>NKABOM AGRILINK USSD</span>
              <span className="text-[10px]">PILOT v1.0</span>
            </div>

            {message ? (
              <div className="py-2 font-bold text-xs bg-[#8eb834]/40 p-2 rounded">
                {message}
              </div>
            ) : menuLevel === 'main' ? (
              <>
                <p className="font-bold text-[11px]">Welcome Kwame Mensah (Mankessim):</p>
                <p>1. Tomato Prices (Spot &amp; Wholesale)</p>
                <p>2. High Demand Alerts (Kasoa/Makola)</p>
                <p>3. List Harvest (Pre-Cut / Today)</p>
                <p>4. Buyer Pre-Commitments (2 New)</p>
                <p>5. Book Shared Transport (-40% Cost)</p>
                <p>6. Spoilage &amp; Weather Guide</p>
              </>
            ) : menuLevel === 'prices' ? (
              <>
                <p className="font-bold text-[11px] underline">TODAY'S TOMATO SPOT (GH₵/CRATE):</p>
                <p>• Kasoa Wholesale: GH₵ 180 (Surge)</p>
                <p>• Mankessim Gate: GH₵ 150 (Fair)</p>
                <p>• Makola Accra: GH₵ 175 (High)</p>
                <p>• Cape Coast: GH₵ 140 (Stable)</p>
                <p className="pt-1 text-[10px] italic">Reply 0 to Go Back</p>
              </>
            ) : menuLevel === 'demand' ? (
              <>
                <p className="font-bold text-[11px] underline">AI DEMAND ALERT:</p>
                <p>🔥 Kasoa + Makola demand PEAK expected in 3 days (+15% price rise).</p>
                <p>Advise: Hold ready crates or lock pre-commitments above GH₵ 165.</p>
                <p className="pt-1 text-[10px] italic">Reply 0 to Go Back</p>
              </>
            ) : menuLevel === 'commitments' ? (
              <>
                <p className="font-bold text-[11px] underline">BUYER PRE-COMMITMENTS:</p>
                <p>1. Ama Serwaa: 30 crates @ GH₵ 160</p>
                <p>2. David Osei: 15 crates @ GH₵ 155</p>
                <p className="pt-1 font-bold">Reply 1 to Accept Offer #1</p>
                <p className="text-[10px] italic">Reply 0 to Return</p>
              </>
            ) : menuLevel === 'transport' ? (
              <>
                <p className="font-bold text-[11px] underline">SHARED HAULAGE MATCH:</p>
                <p>Truck #CR-441-22 heading to Makola at 2 PM.</p>
                <p>Space: 60 crates available.</p>
                <p>Shared Rate: GH₵ 10.50/crate (Saved GH₵ 4.50)</p>
                <p className="pt-1 font-bold">Reply 1 to Reserve 40 Crates</p>
                <p className="text-[10px] italic">Reply 0 to Return</p>
              </>
            ) : (
              <>
                <p className="font-bold text-[11px] underline">CENTRAL WEATHER &amp; SPOILAGE:</p>
                <p>Temp: 31°C • Humidity: 82%</p>
                <p>Spoilage Risk: MODERATE</p>
                <p>Refrigerated or shaded transit required within 36 hours.</p>
                <p className="pt-1 text-[10px] italic">Reply 0 to Return</p>
              </>
            )}
          </div>

          <div className="pt-2 border-t border-[#77992c] flex items-center justify-between text-[11px]">
            <span className="font-bold">Entry: {inputVal || '_'}</span>
            <button
              onClick={handleReadScreen}
              className="px-2 py-0.5 bg-[#82a830] text-[#1c2e06] font-bold rounded flex items-center gap-1 hover:bg-[#77992c] text-[10px] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[13px]">volume_up</span>
              <span>Listen</span>
            </button>
          </div>
        </div>

        {/* Input & Action Buttons */}
        <div className="flex gap-2">
          <input
            type="text"
            inputMode="numeric"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Enter option (e.g. 1)"
            className="flex-1 bg-[#2a352c] border border-[#414940] rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-[#aeeecb]"
            autoFocus
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-[#2c694e] hover:bg-[#3a8865] text-white font-bold rounded-xl text-sm active:scale-95 transition-all cursor-pointer flex items-center gap-1 shadow-xs"
          >
            <span>Send</span>
            <span className="material-symbols-outlined text-[16px]">send</span>
          </button>
        </div>

        {/* Keypad Quick Helper */}
        <div className="grid grid-cols-4 gap-1.5 pt-1">
          {['1', '2', '3', '4', '5', '6', '0', 'Back'].map((btn) => (
            <button
              key={btn}
              onClick={() => {
                if (btn === 'Back') {
                  setMenuLevel('main');
                  setMessage('');
                } else {
                  setInputVal(btn);
                }
              }}
              className="py-1.5 rounded-lg bg-[#273229] hover:bg-[#344437] text-xs font-mono font-bold text-[#c1c9bd] active:scale-90 transition-transform cursor-pointer text-center"
            >
              {btn}
            </button>
          ))}
        </div>

        <p className="text-[10px] text-[#71796f] text-center font-mono">
          Nkabom AgriLink Low-Bandwidth USSD Gateway (Central Region Pilot)
        </p>
      </div>
    </div>
  );
};
