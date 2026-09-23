import React, { useState, useRef, useId } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useApp } from '../context/AppContext';
import { EscrowTransaction } from './EscrowStatus';

interface EscrowPaymentQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: EscrowTransaction[];
  selectedInitialTxId?: string | null;
  onSimulatePaymentSuccess?: (orderId: string, amount: number, cropTitle: string) => void;
}

export const EscrowPaymentQRModal: React.FC<EscrowPaymentQRModalProps> = ({
  isOpen,
  onClose,
  transactions,
  selectedInitialTxId,
  onSimulatePaymentSuccess,
}) => {
  const { playSpeech, showToast, language, t } = useApp();
  const qrRef = useRef<SVGSVGElement | null>(null);

  // Mode: existing order or instant farmgate/custom amount
  const [mode, setMode] = useState<'existing' | 'custom'>(
    selectedInitialTxId ? 'existing' : 'existing'
  );

  // Selected existing order ID
  const [selectedTxId, setSelectedTxId] = useState<string>(
    selectedInitialTxId || (transactions[0] ? transactions[0].id : '')
  );

  // Custom Farmgate Order Form State
  const [customCrop, setCustomCrop] = useState<string>('Roma Tomatoes (Grade A)');
  const [customQuantity, setCustomQuantity] = useState<string>('20 Crates (~500 kg)');
  const [customAmount, setCustomAmount] = useState<number>(3000);
  const [customBuyerName, setCustomBuyerName] = useState<string>('Farmgate Wholesale Buyer');

  // Selected Payment Wallet
  const [paymentWallet, setPaymentWallet] = useState<'mtn' | 'telecel' | 'at' | 'stanbic'>('mtn');

  // Simulation State
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [simulatedSuccess, setSimulatedSuccess] = useState<boolean>(false);
  const [verifiedTxNumber, setVerifiedTxNumber] = useState<string>('');

  // Active Transaction for 'existing' mode
  const activeTx = transactions.find((t) => t.id === selectedTxId) || transactions[0];

  // Derive current display values based on active mode
  const currentOrderNumber =
    mode === 'existing' && activeTx ? activeTx.orderNumber : 'ESC-2026-FARM-994';
  const currentAmount = mode === 'existing' && activeTx ? activeTx.amountGhs : customAmount;
  const currentCrop = mode === 'existing' && activeTx ? activeTx.cropTitle : customCrop;
  const currentQuantity = mode === 'existing' && activeTx ? activeTx.quantity : customQuantity;
  const currentBuyer = mode === 'existing' && activeTx ? activeTx.buyerName : customBuyerName;

  const walletDetails = {
    mtn: { name: 'MTN Mobile Money', short: 'MTN MoMo', number: '+233 24 582 9104', color: '#e5a000' },
    telecel: { name: 'Telecel Cash', short: 'Telecel', number: '+233 20 812 4491', color: '#e21b22' },
    at: { name: 'AT Money', short: 'AT Money', number: '+233 26 319 0281', color: '#005baa' },
    stanbic: { name: 'Stanbic Co-op Escrow Vault', short: 'Stanbic Vault', number: 'ACT-987-STANBIC', color: '#0033a0' },
  }[paymentWallet];

  // Dynamic QR Payload
  const qrPayload = JSON.stringify({
    app: 'NkabomAgriLink',
    version: '1.0',
    type: 'ESCROW_PAYMENT_REQUEST',
    orderNumber: currentOrderNumber,
    farmer: 'Kwame Mensah',
    farmerPhone: '+233245829104',
    location: 'Asempa Farms, Techiman (Bono East)',
    crop: currentCrop,
    quantity: currentQuantity,
    amountGhs: currentAmount,
    currency: 'GHS',
    destinationWallet: walletDetails.name,
    recipientNumber: walletDetails.number,
    escrowCustodian: 'Stanbic Agri-Vault / Bank of Ghana Act 987',
    securityToken: `NKB-SEC-${currentOrderNumber.replace(/[^0-9]/g, '').slice(-4)}-VALID`,
    generatedAt: new Date().toISOString(),
  });

  // Audio Guide
  const handlePlayVoice = () => {
    playSpeech(
      `Fa QR code yi kyerɛ ɔtɔfoɔ no wɔ afuo ano anaasɛ depot. Sɛ ɔ-scan a, sika GH₵ ${currentAmount.toLocaleString()} no bɛkɔ bank escrow vault mu ntɛm ara. Sɛ wɔgye nnuane no tom a, sika no bɛba wo ${walletDetails.short} so ntɛm.`,
      'Escrow Payment QR Guide',
      `Present this dynamic QR code to the buyer or loading supervisor. Once scanned, GH₵ ${currentAmount.toLocaleString()} is locked in the escrow vault and released straight to your ${walletDetails.short} upon inspection.`
    );
  };

  // Simulate Buyer Scan & Pay
  const handleSimulateBuyerScan = () => {
    if (isScanning || simulatedSuccess) return;

    setIsScanning(true);
    setSimulatedSuccess(false);

    // Audio hint
    playSpeech(
      'Buyer scanning QR code. Connecting to Stanbic Escrow Vault and verifying Mobile Money funds...',
      'Escrow Scan Verification'
    );

    setTimeout(() => {
      setIsScanning(false);
      setSimulatedSuccess(true);
      const generatedRef = `TXN-MOMO-${Math.floor(10000000 + Math.random() * 90000000)}`;
      setVerifiedTxNumber(generatedRef);

      showToast(`GH₵ ${currentAmount.toLocaleString()} secured in Escrow! Receipt generated.`);

      playSpeech(
        `Wɔagye sika no atom! GH₵ ${currentAmount.toLocaleString()} abɔ mu den wɔ escrow vault mu ma ${currentCrop}. Sika no bɛba wo MoMo so bere a wɔahwɛ nnuane no wie.`,
        'Payment Verified & Escrow Locked',
        `Payment confirmed! GH₵ ${currentAmount.toLocaleString()} has been safely locked in the escrow vault for ${currentCrop}. Funds will disburse to your wallet upon inspection sign-off.`
      );

      if (onSimulatePaymentSuccess) {
        onSimulatePaymentSuccess(currentOrderNumber, currentAmount, currentCrop);
      }
    }, 1800);
  };

  // USSD Copy helper
  const handleCopyUssd = () => {
    const ussdString = `*170*1*1*0245829104*${currentAmount}*${currentOrderNumber}#`;
    navigator.clipboard?.writeText(ussdString);
    showToast(`USSD Code Copied: ${ussdString}`);
  };

  // Share via WhatsApp / SMS
  const handleShare = () => {
    const message = `🌿 Nkabom AgriLink Escrow Payment Request\nOrder: ${currentOrderNumber}\nFarmer: Kwame Mensah (Asempa Farms)\nProduce: ${currentCrop} (${currentQuantity})\nAmount: GH₵ ${currentAmount.toLocaleString()}\nWallet: ${walletDetails.name} (${walletDetails.number})\nProtected under Bank of Ghana Mobile Money Escrow Regulations.`;
    navigator.clipboard?.writeText(message);
    showToast('Payment request link & details copied to clipboard!');
  };

  // Download / Save QR Code as PNG
  const handleDownloadQR = () => {
    try {
      const svgElement = qrRef.current;
      if (!svgElement) return;

      const svgData = new XMLSerializer().serializeToString(svgElement);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = 600;
        canvas.height = 600;
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 50, 50, 500, 500);

          const pngFile = canvas.toDataURL('image/png');
          const downloadLink = document.createElement('a');
          downloadLink.download = `Nkabom-Payment-QR-${currentOrderNumber}.png`;
          downloadLink.href = pngFile;
          downloadLink.click();
          showToast('Payment QR Code downloaded successfully!');
        }
      };

      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    } catch {
      showToast('QR Code captured. Ready to print or display.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="escrow-qr-modal-title"
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#edefe9] overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="px-5 py-4 bg-[#013a13] text-white flex items-center justify-between flex-shrink-0 relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-28 h-28 bg-[#aeeecb]/20 rounded-full blur-xl pointer-events-none"></div>

          <div className="flex items-center gap-2.5 relative z-10">
            <div className="w-10 h-10 rounded-2xl bg-white/15 text-[#b1f0ce] flex items-center justify-center border border-white/20 shadow-xs">
              <span className="material-symbols-outlined text-[22px]">qr_code_2</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 id="escrow-qr-modal-title" className="text-base font-black leading-tight text-white">
                  {t('escrow.generateQr', 'Generate QR Code')}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#b1f0ce] text-[#002108] text-[9px] font-black uppercase tracking-wider">
                  Live MoMo
                </span>
              </div>
              <p className="text-[11px] text-[#b1f0ce] font-medium leading-tight mt-0.5">
                {t('escrow.qrSubtitle', 'Dynamic QR code for secure, instant buyer payments & escrow lock')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 relative z-10">
            <button
              onClick={handlePlayVoice}
              aria-label="Listen to voice guide"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-[#b1f0ce] flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
              title="Voice Guide in Akan Twi"
            >
              <span className="material-symbols-outlined text-[18px]">volume_up</span>
            </button>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#f8faf4]">
          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 gap-1.5 bg-[#e8eae4] p-1 rounded-2xl text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setMode('existing');
                setSimulatedSuccess(false);
              }}
              className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'existing'
                  ? 'bg-white text-[#013a13] shadow-xs'
                  : 'text-[#414940] hover:text-[#191c19]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">receipt_long</span>
              <span>{t('escrow.existingOrders', 'Linked Escrow Orders')}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('custom');
                setSimulatedSuccess(false);
              }}
              className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'custom'
                  ? 'bg-white text-[#013a13] shadow-xs'
                  : 'text-[#414940] hover:text-[#191c19]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">add_circle</span>
              <span>{t('escrow.instantFarmgate', 'Instant Farmgate Sale')}</span>
            </button>
          </div>

          {/* Mode 1: Existing Escrow Order Selector */}
          {mode === 'existing' ? (
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#191c19] flex items-center justify-between">
                <span>Select Escrow Order:</span>
                <span className="text-[11px] text-[#2c694e] font-semibold">
                  {transactions.length} Active Orders
                </span>
              </label>

              <div className="space-y-1.5">
                {transactions.map((tx) => {
                  const isSelected = tx.id === selectedTxId;
                  return (
                    <button
                      key={tx.id}
                      type="button"
                      onClick={() => {
                        setSelectedTxId(tx.id);
                        setSimulatedSuccess(false);
                      }}
                      className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between gap-2.5 cursor-pointer ${
                        isSelected
                          ? 'bg-[#b1f0ce]/25 border-[#013a13] ring-1 ring-[#013a13]/25 shadow-xs'
                          : 'bg-white border-[#edefe9] hover:bg-[#f2f4ee]'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={tx.buyerAvatar}
                          alt={tx.buyerName}
                          className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-[#edefe9]"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-black text-[#191c19] truncate">
                              {tx.buyerName}
                            </span>
                            <span className="text-[10px] text-[#71796f] font-mono truncate">
                              • {tx.orderNumber}
                            </span>
                          </div>
                          <span className="text-[11px] text-[#414940] block truncate">
                            {tx.cropTitle} ({tx.quantity})
                          </span>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <span className="text-xs font-black text-[#013a13] block">
                          GH₵ {tx.amountGhs.toLocaleString()}
                        </span>
                        <span className="text-[10px] font-semibold text-[#2c694e]">
                          {tx.statusType === 'released' ? 'Paid' : 'Escrow Locked'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Mode 2: Custom Instant Farmgate Order */
            <div className="bg-white p-3.5 rounded-2xl border border-[#edefe9] shadow-xs space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#191c19] mb-1">
                  Produce &amp; Variety
                </label>
                <select
                  value={customCrop}
                  onChange={(e) => {
                    setCustomCrop(e.target.value);
                    setSimulatedSuccess(false);
                  }}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-[#f8faf4] border border-[#edefe9] text-[#191c19] focus:outline-none focus:ring-1 focus:ring-[#013a13]"
                >
                  <option value="Roma Tomatoes (Grade A)">Roma Tomatoes (Grade A Bontanga)</option>
                  <option value="Scotch Bonnet & Shito Pepper">Scotch Bonnet & Shito Pepper</option>
                  <option value="Bawku Red & White Onions">Bawku Red & White Onions</option>
                  <option value="Fresh Bankye Cassava">Fresh Bankye Cassava</option>
                  <option value="Premium Pona Yam">Premium Pona Yam (Bundles)</option>
                  <option value="Apem Green Plantain">Apem Green Plantain</option>
                  <option value="Fresh Garden Eggs (Ntrowa)">Fresh Garden Eggs (Ntrowa)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-[#191c19] mb-1">
                    Quantity / Crates
                  </label>
                  <input
                    type="text"
                    value={customQuantity}
                    onChange={(e) => setCustomQuantity(e.target.value)}
                    placeholder="e.g. 20 Crates (~500kg)"
                    className="w-full text-xs font-semibold px-2.5 py-2 rounded-xl bg-[#f8faf4] border border-[#edefe9] text-[#191c19] focus:outline-none focus:ring-1 focus:ring-[#013a13]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#191c19] mb-1">
                    Payment Amount (GH₵)
                  </label>
                  <input
                    type="number"
                    min="10"
                    step="50"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(Math.max(10, Number(e.target.value)));
                      setSimulatedSuccess(false);
                    }}
                    className="w-full text-xs font-black px-2.5 py-2 rounded-xl bg-[#f8faf4] border border-[#edefe9] text-[#013a13] focus:outline-none focus:ring-1 focus:ring-[#013a13]"
                  />
                </div>
              </div>

              {/* Quick Amount Increment Chips */}
              <div className="flex items-center gap-1.5 pt-0.5">
                <span className="text-[10px] text-[#71796f] font-semibold">Quick Add:</span>
                {[500, 1000, 2500, 5000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setCustomAmount(amt);
                      setSimulatedSuccess(false);
                    }}
                    className="px-2 py-0.5 rounded-lg bg-[#f2f4ee] hover:bg-[#e7e9e3] text-[10px] font-bold text-[#013a13] transition-all cursor-pointer"
                  >
                    +GH₵ {amt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Destination Mobile Money Wallet */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#191c19]">Receive To Wallet:</span>
              <span className="text-[11px] font-semibold text-[#2c694e]">
                {walletDetails.number}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              {[
                { id: 'mtn' as const, label: 'MTN MoMo', icon: 'payments', badge: 'Active' },
                { id: 'telecel' as const, label: 'Telecel', icon: 'cell_tower', badge: 'Ready' },
                { id: 'at' as const, label: 'AT Money', icon: 'account_balance_wallet', badge: 'Ready' },
                { id: 'stanbic' as const, label: 'Stanbic', icon: 'shield', badge: 'Vault' },
              ].map((w) => {
                const isSelected = paymentWallet === w.id;
                return (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => {
                      setPaymentWallet(w.id);
                      setSimulatedSuccess(false);
                    }}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#013a13] text-white border-[#013a13] shadow-xs'
                        : 'bg-white text-[#414940] border-[#edefe9] hover:bg-[#f2f4ee]'
                    }`}
                  >
                    <span className="text-[10px] font-extrabold block truncate">{w.label}</span>
                    <span
                      className={`text-[9px] block ${
                        isSelected ? 'text-[#b1f0ce]' : 'text-[#71796f]'
                      }`}
                    >
                      {w.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* DYNAMIC QR CODE PRESENTATION CONTAINER */}
          <div className="relative bg-white rounded-3xl p-5 border border-[#edefe9] shadow-sm flex flex-col items-center text-center space-y-3 overflow-hidden">
            {/* Bank Security Watermark */}
            <div className="flex items-center justify-between w-full pb-2 border-b border-[#edefe9] text-[10px] font-bold text-[#414940]">
              <span className="flex items-center gap-1 text-[#013a13]">
                <span className="material-symbols-outlined text-[14px]">verified_user</span>
                <span>Bank of Ghana Act 987 Escrow</span>
              </span>
              <span className="font-mono text-[#71796f]">{currentOrderNumber}</span>
            </div>

            {/* QR Card with Scan Beam Effect */}
            <div className="relative p-4 bg-[#f8faf4] rounded-2xl border-2 border-[#013a13]/20 shadow-inner group">
              {/* Dynamic QR Code Render */}
              <div className="bg-white p-2.5 rounded-xl shadow-xs inline-block">
                <QRCodeSVG
                  ref={qrRef}
                  value={qrPayload}
                  size={190}
                  level="H"
                  includeMargin={true}
                  fgColor="#013a13"
                  bgColor="#ffffff"
                />
              </div>

              {/* Scanning Animation Beam */}
              {isScanning && (
                <div className="absolute inset-x-4 top-4 bottom-4 pointer-events-none overflow-hidden rounded-xl">
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#b1f0ce] to-transparent shadow-[0_0_12px_#b1f0ce] animate-pulse absolute top-1/2 -translate-y-1/2" />
                  <div className="w-full h-full bg-[#013a13]/10 backdrop-blur-2xs flex items-center justify-center">
                    <span className="px-3 py-1 rounded-full bg-[#013a13] text-[#b1f0ce] text-xs font-black shadow-md flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                      <span>Verifying Buyer Escrow...</span>
                    </span>
                  </div>
                </div>
              )}

              {/* Simulated Success Stamp Overlay */}
              {simulatedSuccess && (
                <div className="absolute inset-0 bg-[#013a13]/90 backdrop-blur-xs rounded-2xl flex flex-col items-center justify-center text-white p-4 animate-fadeIn space-y-2">
                  <div className="w-12 h-12 rounded-full bg-[#b1f0ce] text-[#013a13] flex items-center justify-center shadow-lg animate-bounce">
                    <span className="material-symbols-outlined text-3xl font-black">check</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">Payment Locked in Escrow!</h3>
                    <p className="text-[11px] text-[#b1f0ce] mt-0.5">
                      GH₵ {currentAmount.toLocaleString()} safely secured
                    </p>
                    <span className="text-[9px] font-mono text-white/70 block mt-1">
                      Ref: {verifiedTxNumber}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSimulatedSuccess(false)}
                    className="px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white text-[10px] font-bold cursor-pointer"
                  >
                    View QR Again
                  </button>
                </div>
              )}
            </div>

            {/* Details Beneath QR */}
            <div className="w-full space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#71796f] tracking-wider block">
                Total Payment Escrow Value
              </span>
              <div className="flex items-center justify-center gap-1">
                <span className="text-3xl font-black text-[#013a13] tracking-tight">
                  GH₵ {currentAmount.toLocaleString()}
                </span>
              </div>
              <p className="text-xs font-bold text-[#191c19] truncate">
                {currentCrop} • {currentQuantity}
              </p>
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#414940] pt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2c694e]"></span>
                <span>Farmer: Kwame Mensah (Asempa Farms)</span>
              </div>
            </div>

            {/* Quick Action Button: Simulate Buyer Scan */}
            <div className="w-full pt-1">
              <button
                type="button"
                onClick={handleSimulateBuyerScan}
                disabled={isScanning}
                className="w-full py-3 px-4 rounded-2xl bg-[#013a13] hover:bg-[#1e5128] text-white font-extrabold text-xs shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {simulatedSuccess ? 'verified' : 'qr_code_scanner'}
                </span>
                <span>
                  {isScanning
                    ? 'Verifying MoMo Escrow Vault...'
                    : simulatedSuccess
                    ? 'Scan Successful • Re-Test'
                    : t('escrow.simulateScan', 'Simulate Buyer Scan & Pay')}
                </span>
              </button>
            </div>

            {/* Auxiliary Sharing Actions Row */}
            <div className="grid grid-cols-3 gap-1.5 w-full pt-1">
              <button
                type="button"
                onClick={handleCopyUssd}
                className="py-2 px-1.5 rounded-xl bg-[#f2f4ee] hover:bg-[#e7e9e3] text-[#013a13] text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                title="Copy USSD Dial Code for Buyer"
              >
                <span className="material-symbols-outlined text-[14px]">dialpad</span>
                <span className="truncate">{t('escrow.copyUssd', 'Copy USSD')}</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="py-2 px-1.5 rounded-xl bg-[#f2f4ee] hover:bg-[#e7e9e3] text-[#013a13] text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                title="Share Payment Request via SMS/WhatsApp"
              >
                <span className="material-symbols-outlined text-[14px]">share</span>
                <span className="truncate">Share Link</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadQR}
                className="py-2 px-1.5 rounded-xl bg-[#f2f4ee] hover:bg-[#e7e9e3] text-[#013a13] text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                title="Download QR code image for print / offline"
              >
                <span className="material-symbols-outlined text-[14px]">download</span>
                <span className="truncate">{t('escrow.downloadQr', 'Save QR')}</span>
              </button>
            </div>
          </div>

          {/* Reassurance Guarantee Footnote */}
          <div className="p-3 rounded-2xl bg-[#aeeecb]/20 border border-[#2c694e]/20 flex items-start gap-2 text-xs text-[#013a13]">
            <span
              className="material-symbols-outlined text-[18px] text-[#2c694e] flex-shrink-0 mt-0.5"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              security
            </span>
            <div className="leading-tight">
              <span className="font-extrabold">Instant Settlement Guarantee:</span>
              <p className="text-[11px] text-[#414940] mt-0.5">
                When the buyer scans this QR code at the farmgate or loading bay, payment is locked
                in escrow and immediately credited to your MoMo wallet upon quality check.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-white border-t border-[#edefe9] flex items-center justify-end flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-[#f2f4ee] hover:bg-[#e7e9e3] text-[#191c19] text-xs font-bold transition-all cursor-pointer"
          >
            Close &amp; Return
          </button>
        </div>
      </div>
    </div>
  );
};
