import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EscrowPaymentQRModal } from './EscrowPaymentQRModal';

export interface EscrowTransaction {
  id: string;
  orderNumber: string;
  buyerName: string;
  buyerRole: string;
  buyerAvatar: string;
  cropTitle: string;
  quantity: string;
  amountGhs: number;
  depositDate: string;
  momoRef: string;
  escrowVault: string;
  currentStep: 1 | 2 | 3 | 4; // 1: Funds Locked, 2: In Transit, 3: Quality Check, 4: Released
  statusLabel: string;
  statusType: 'locked' | 'transit' | 'inspecting' | 'released';
  deliveryHub: string;
  haulerName: string;
  estimatedReleaseTime: string;
  inspectionSummary: string;
  twiSpeech: string;
}

const INITIAL_ESCROW_TRANSACTIONS: EscrowTransaction[] = [
  {
    id: 'esc-1',
    orderNumber: 'ESC-2026-9041',
    buyerName: 'Ama Serwaa',
    buyerRole: 'Makola Wholesale Aggregator',
    buyerAvatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCUEMaSW5o-zBK9C3cIhxC8uXUU0dJqDqxtQ612jLfZ4kvklXb3wuuzjD25ALm0VJcCvNpnvaCJu5kfsxHzouqNC6qWYv0tx8Okw2el3UlpdDBxlfiZ7UZoaeArMrn2S57C77ASLvszS8EEd9_uzz5tTUJ5nicbDRPdxqn2_6F1FvoMz4wei4vVnLaruLJ9dwFKGp9pMCkG_odmrNxq45yaYx_6hNSr7IfLUkKqzgLEnm62RiaFrRUX2Q',
    cropTitle: 'Roma Tomatoes (Bontanga)',
    quantity: '40 Crates (~1,000 kg)',
    amountGhs: 6000,
    depositDate: 'Today, 08:30 AM',
    momoRef: 'MTN-ESC-99382104-GH',
    escrowVault: 'Stanbic Agri-Vault / MTN MoMo Escrow',
    currentStep: 3,
    statusLabel: 'Depot Quality Check • Release Imminent',
    statusType: 'inspecting',
    deliveryHub: 'Makola Terminal Bay 4, Accra',
    haulerName: 'Kofi Mensah Logistics (GW-4192-20)',
    estimatedReleaseTime: 'Today at 3:15 PM (Upon Sign-off)',
    inspectionSummary:
      '40 crates arrived in Makola. Grade A firmness confirmed by depot supervisor. Final sign-off pending for automated MoMo release.',
    twiSpeech:
      'Order ESC-9041: Ama Serwaa asie sika GH₵ 6,000 wɔ MTN MoMo Escrow mu. Ntɔs no aduru Makola, wɔreyɛ quality check. Sɛ wɔwie a sika no bɛba wo MoMo so ntɛm ara.',
  },
  {
    id: 'esc-2',
    orderNumber: 'ESC-2026-8812',
    buyerName: 'Kofi Boateng',
    buyerRole: 'Central Caterers Cooperative',
    buyerAvatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDVb9Cb6JPD90kJqR2EtxmAorul1Xt9oa9WvzudwanI6-i6lbPNnM0yNdfFOSpNQuiD_0lozusojQMI0nnLSlffwXvMPuBwpSDmKiIiTWqOBrGobuoK7ljWWY8mwlXPK6PqhbyN4GiWoBnaGnjGjpGoBUMphUYx9vi6OlMZ9fa5fWmjmQ3EARprjzJihdQErbxbQteh3TgJ4f-JO3Yv8Ehf_wChCm-p_Z61knsVk3r9R5OwOjZSEIhomg',
    cropTitle: 'Scotch Bonnet & Shito Pepper',
    quantity: '25 Baskets (~500 kg)',
    amountGhs: 3000,
    depositDate: 'Yesterday, 4:15 PM',
    momoRef: 'VOD-ESC-44102911-GH',
    escrowVault: 'Telecel Cash / Ecobank Escrow Portal',
    currentStep: 2,
    statusLabel: 'Produce In Transit • Escrow Vault Locked',
    statusType: 'transit',
    deliveryHub: 'Kasoa Aggregator Gate, Central Region',
    haulerName: 'Assin Express Haulage (CR-8831-23)',
    estimatedReleaseTime: 'Today at 5:00 PM',
    inspectionSummary:
      'Driver loaded at Assin Fosu. 25 baskets sealed with tamper-proof tags. Buyer funds locked in escrow vault.',
    twiSpeech:
      'Order ESC-8812: Kofi Boateng de GH₵ 3,000 asie escrow mu. Mako no wɔ kwan so rekɔ Kasoa. Sika no abɔ mu dennedenden.',
  },
  {
    id: 'esc-3',
    orderNumber: 'ESC-2026-7643',
    buyerName: 'Akosua Frimpong',
    buyerRole: 'Takoradi Fresh Mart',
    buyerAvatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAgLvEmvuwsEgoQioq_5fPd2iybtnlKBKP4uuje6DGNqLTuxDh4vbhy44JU__Ldje5iGkI1Cp7byK94dlyqX2jrympQbSA7MtoMS8KZL4yz9P-XfnQvgBE5Fj3-EKFJ1E30Bkic6B8bGUWSo93TJuwwhHyU2S7SCjUaujwPquT9U9BWs0u2xAawzNbC0nb4k-w1-2rvDlN7QX7PkeM0tgNbob0rCKl8Z91d9skiYGDGWb-fv7vAv0CK4Q',
    cropTitle: 'Pre-Harvest Roma Tomatoes (Deposit)',
    quantity: '30 Crates (Pre-Commitment)',
    amountGhs: 2250,
    depositDate: 'Sep 22, 11:00 AM',
    momoRef: 'MTN-ESC-77884102-GH',
    escrowVault: 'GCB Bank / MoMo Settlement Vault',
    currentStep: 1,
    statusLabel: 'Pre-Harvest Advance Held in Escrow',
    statusType: 'locked',
    deliveryHub: 'Cape Coast Wholesale Depot',
    haulerName: 'Central Agri-Cold Transit (GT-5501-19)',
    estimatedReleaseTime: 'Upon Harvest Loading (Sep 26)',
    inspectionSummary:
      'Advance 50% commitment deposit held in escrow vault. Buyer cannot cancel without mutual consent.',
    twiSpeech:
      'Order ESC-7643: Akosua Frimpong de advance GH₵ 2,250 asie ma pre-harvest ntɔs. Sika no sisi hɔ pɛpɛɛpɛ ansa na woatwa.',
  },
];

export interface EscrowStatusProps {
  externalOpenQr?: boolean;
  onCloseExternalQr?: () => void;
}

export const EscrowStatus: React.FC<EscrowStatusProps> = ({
  externalOpenQr = false,
  onCloseExternalQr,
}) => {
  const { playSpeech, showToast, t } = useApp();

  const [transactions, setTransactions] = useState<EscrowTransaction[]>(
    INITIAL_ESCROW_TRANSACTIONS
  );
  const [selectedTxFilter, setSelectedTxFilter] = useState<'all' | 'locked' | 'transit' | 'inspecting'>('all');
  const [activeReceiptModalTx, setActiveReceiptModalTx] = useState<EscrowTransaction | null>(null);

  // Escrow Payment QR Modal State
  const [internalQrModalOpen, setInternalQrModalOpen] = useState(false);
  const [selectedQrTxId, setSelectedQrTxId] = useState<string | null>(null);

  const isQrModalOpen = externalOpenQr || internalQrModalOpen;

  const handleOpenQR = (txId?: string) => {
    setSelectedQrTxId(txId || null);
    setInternalQrModalOpen(true);
  };

  const handleCloseQR = () => {
    setInternalQrModalOpen(false);
    setSelectedQrTxId(null);
    if (onCloseExternalQr) {
      onCloseExternalQr();
    }
  };

  const handleSimulatePaymentSuccess = (orderId: string, amount: number, cropTitle: string) => {
    setTransactions((prev) => {
      const exists = prev.find((t) => t.orderNumber === orderId || t.id === orderId);
      if (exists) {
        return prev.map((t) =>
          t.id === exists.id
            ? {
                ...t,
                currentStep: 4,
                statusLabel: `Payment Released to MTN MoMo (+GH₵ ${t.amountGhs.toLocaleString()})`,
                statusType: 'released',
              }
            : t
        );
      } else {
        const newTx: EscrowTransaction = {
          id: `esc-${Date.now()}`,
          orderNumber: orderId,
          buyerName: 'Farmgate Wholesale Buyer',
          buyerRole: 'Direct Depot Purchaser',
          buyerAvatar:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAgLvEmvuwsEgoQioq_5fPd2iybtnlKBKP4uuje6DGNqLTuxDh4vbhy44JU__Ldje5iGkI1Cp7byK94dlyqX2jrympQbSA7MtoMS8KZL4yz9P-XfnQvgBE5Fj3-EKFJ1E30Bkic6B8bGUWSo93TJuwwhHyU2S7SCjUaujwPquT9U9BWs0u2xAawzNbC0nb4k-w1-2rvDlN7QX7PkeM0tgNbob0rCKl8Z91d9skiYGDGWb-fv7vAv0CK4Q',
          cropTitle: cropTitle,
          quantity: 'Instant Verified Lot',
          amountGhs: amount,
          depositDate: 'Just Now',
          momoRef: `MTN-ESC-${Math.floor(10000000 + Math.random() * 90000000)}-GH`,
          escrowVault: 'Stanbic Agri-Vault / MTN MoMo Escrow',
          currentStep: 4,
          statusLabel: `Payment Released to MTN MoMo (+GH₵ ${amount.toLocaleString()})`,
          statusType: 'released',
          deliveryHub: 'Asempa Farmgate, Techiman',
          haulerName: 'Direct Buyer Haulage',
          estimatedReleaseTime: 'Completed Instantly via QR',
          inspectionSummary:
            'Dynamic QR code scanned and authenticated. Payment locked in Stanbic vault and instantly released into MTN Mobile Money.',
          twiSpeech: `Order ${orderId}: Sika GH₵ ${amount} no aduru wo MoMo so ntɛm ara afiri QR code scan mu.`,
        };
        return [newTx, ...prev];
      }
    });
  };

  // Totals
  const totalHeldGhs = transactions.reduce((acc, tx) => acc + tx.amountGhs, 0);

  const filteredTransactions = transactions.filter((tx) => {
    if (selectedTxFilter === 'all') return true;
    return tx.statusType === selectedTxFilter;
  });

  const handleSimulateManualRelease = (txId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTransactions((prev) =>
      prev.map((t) => {
        if (t.id === txId) {
          return {
            ...t,
            currentStep: 4,
            statusLabel: 'Payment Released to MTN MoMo (+GH₵ ' + t.amountGhs + ')',
            statusType: 'released',
          };
        }
        return t;
      })
    );
    showToast('Depot inspection approved! Funds disbursed to your MoMo wallet.');
    playSpeech(
      'Inspection sign-off confirmed! Funds have been released directly from the escrow vault into your MTN Mobile Money wallet.',
      'MoMo Payout Released'
    );
  };

  const handleOpenReceipt = (tx: EscrowTransaction, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveReceiptModalTx(tx);
  };

  const handlePlayVoice = (tx: EscrowTransaction, e: React.MouseEvent) => {
    e.stopPropagation();
    playSpeech(tx.twiSpeech, `Escrow Status: ${tx.orderNumber}`);
  };

  return (
    <div className="w-full bg-white rounded-3xl p-5 shadow-xs border border-[#edefe9] space-y-4">
      {/* Header with Title and Bilingual Audio */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-[#013a13] text-[#b1f0ce] flex items-center justify-center shadow-xs">
            <span
              className="material-symbols-outlined text-[24px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              lock
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-black text-[#191c19] leading-tight">
                Escrow Payment Protection
              </h2>
              <span className="px-1.5 py-0.5 rounded-full bg-[#b1f0ce] text-[#002114] text-[9px] font-black uppercase">
                Bank-Secured
              </span>
            </div>
            <p className="text-xs text-[#2c694e] font-semibold">
              Sika Sie Akwanya • Guaranteed MoMo Settlement
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => handleOpenQR()}
            className="h-10 px-3 rounded-2xl bg-[#013a13] hover:bg-[#1e5128] text-white flex items-center gap-1.5 active:scale-95 transition-transform cursor-pointer shadow-xs font-bold text-xs"
            title="Generate dynamic escrow payment QR code"
          >
            <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
            <span>{t('escrow.generateQr', 'Generate QR')}</span>
          </button>

          <button
            onClick={() =>
              playSpeech(
                'Escrow Payment Protection: Sika no nyinaa da bank vault ansa na woayi nnuane no afiri afuo mu. Atɔfoɔ no ntumi nngye sika no bio gye sɛ wogye nnuane no tom.',
                'Escrow Protection Guide'
              )
            }
            className="w-10 h-10 rounded-full bg-[#f2f4ee] hover:bg-[#e7e9e3] text-[#013a13] flex items-center justify-center active:scale-95 transition-transform cursor-pointer shadow-2xs"
            title="Listen in Twi"
            type="button"
            aria-label="Listen to escrow explanation in Akan Twi"
          >
            <span className="material-symbols-outlined text-[20px]">volume_up</span>
          </button>
        </div>
      </div>

      {/* Main Secure Vault Metric Card */}
      <div className="p-4 bg-gradient-to-br from-[#013a13] to-[#1e5128] text-white rounded-3xl shadow-sm space-y-3 relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] text-[#b1f0ce] uppercase font-bold tracking-wider block">
              Active Escrow Custody
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-3xl font-black text-white">
                GH₵ {totalHeldGhs.toLocaleString()}
              </span>
              <span className="text-xs text-[#b1f0ce] font-semibold">Held Securely</span>
            </div>
            <span className="text-xs text-[#aeeecb] font-medium block mt-0.5">
              3 Pending Orders • Protected against non-payment
            </span>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#b1f0ce] border border-white/15">
            <span
              className="material-symbols-outlined text-[28px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified_user
            </span>
          </div>
        </div>

        {/* 3-Pillar Security Strip */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/15 text-center text-[10px]">
          <div className="p-2 rounded-xl bg-white/10">
            <span className="text-white/70 block uppercase">Default Risk</span>
            <span className="text-xs font-black text-[#b1f0ce] block mt-0.5">0.0%</span>
            <span className="text-[9px] text-white/80 block">Pre-Funded</span>
          </div>

          <div className="p-2 rounded-xl bg-white/10">
            <span className="text-white/70 block uppercase">Settlement</span>
            <span className="text-xs font-black text-white block mt-0.5">MTN MoMo</span>
            <span className="text-[9px] text-[#b1f0ce] block">Instant Payout</span>
          </div>

          <div className="p-2 rounded-xl bg-white/10">
            <span className="text-white/70 block uppercase">Dispute Shield</span>
            <span className="text-xs font-black text-[#b1f0ce] block mt-0.5">Co-op Escrow</span>
            <span className="text-[9px] text-white/80 block">100% Insured</span>
          </div>
        </div>

        {/* Quick QR Present Banner inside Metric Card */}
        <div className="pt-2 border-t border-white/15 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs text-[#b1f0ce] min-w-0">
            <span className="material-symbols-outlined text-[18px] flex-shrink-0">qr_code_scanner</span>
            <span className="font-semibold truncate">Present dynamic QR code for buyer scan</span>
          </div>
          <button
            type="button"
            onClick={() => handleOpenQR()}
            className="py-1.5 px-3 rounded-xl bg-white text-[#013a13] hover:bg-[#b1f0ce] text-xs font-black flex items-center gap-1 active:scale-95 transition-transform cursor-pointer shadow-xs flex-shrink-0"
          >
            <span className="material-symbols-outlined text-[15px]">qr_code_2</span>
            <span>{t('escrow.generateQr', 'Generate QR')}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1 text-xs font-semibold">
        {[
          { id: 'all', label: `All Orders (${transactions.length})` },
          { id: 'inspecting', label: 'Depot Check (1)' },
          { id: 'transit', label: 'In Transit (1)' },
          { id: 'locked', label: 'Pre-Harvest (1)' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSelectedTxFilter(tab.id as any)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              selectedTxFilter === tab.id
                ? 'bg-[#013a13] text-white font-bold shadow-xs'
                : 'bg-[#f2f4ee] text-[#414940] hover:bg-[#e7e9e3]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Transactions List */}
      <div className="space-y-3 pt-1">
        {filteredTransactions.map((tx) => (
          <div
            key={tx.id}
            className="p-4 bg-white rounded-2xl border border-[#edefe9] shadow-2xs space-y-3 transition-all hover:border-[#c1c9bd]"
          >
            {/* Top row: Buyer & Amount */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={tx.buyerAvatar}
                  alt={tx.buyerName}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0 border border-[#d8dbd5] shadow-2xs"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-[#191c19] truncate">
                      {tx.buyerName}
                    </span>
                    <span
                      className="material-symbols-outlined text-[15px] text-[#2c694e]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      verified
                    </span>
                  </div>
                  <span className="text-[11px] text-[#414940] font-medium block truncate">
                    {tx.buyerRole}
                  </span>
                  <span className="text-[10px] text-[#71796f] font-mono block">
                    {tx.orderNumber} • {tx.depositDate}
                  </span>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <span className="text-base font-black text-[#013a13] block">
                  GH₵ {tx.amountGhs.toLocaleString()}
                </span>
                <span className="text-[10px] font-bold text-[#2c694e] inline-flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[12px]">lock</span>
                  <span>Escrow Locked</span>
                </span>
              </div>
            </div>

            {/* Produce Summary Pill */}
            <div className="p-2.5 bg-[#f8faf4] rounded-xl border border-[#e1e3dd] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="material-symbols-outlined text-[#013a13] text-[18px]">
                  inventory_2
                </span>
                <div className="min-w-0">
                  <span className="font-bold text-[#191c19] truncate block">
                    {tx.cropTitle}
                  </span>
                  <span className="text-[11px] text-[#414940] block">
                    {tx.quantity} ➔ {tx.deliveryHub}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => handlePlayVoice(tx, e)}
                className="w-8 h-8 rounded-full bg-white hover:bg-[#e7e9e3] text-[#2c694e] flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform"
                title="Listen in Twi"
              >
                <span className="material-symbols-outlined text-[16px]">volume_up</span>
              </button>
            </div>

            {/* 4-Step Escrow Pipeline Visual Stepper */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="text-[#013a13] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">checklist</span>
                  <span>Escrow Settlement Progress:</span>
                </span>
                <span
                  className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                    tx.currentStep === 4
                      ? 'bg-[#aeeecb] text-[#002114]'
                      : tx.currentStep === 3
                      ? 'bg-amber-100 text-amber-900 animate-pulse'
                      : 'bg-[#e7e9e3] text-[#414940]'
                  }`}
                >
                  Step {tx.currentStep} of 4
                </span>
              </div>

              {/* Step Indicators */}
              <div className="grid grid-cols-4 gap-1.5 relative">
                {[
                  { step: 1, label: 'Locked' },
                  { step: 2, label: 'In Transit' },
                  { step: 3, label: 'Quality Check' },
                  { step: 4, label: 'Payout' },
                ].map((s) => {
                  const isDone = tx.currentStep >= s.step;
                  const isCurrent = tx.currentStep === s.step;
                  return (
                    <div key={s.step} className="flex flex-col items-center text-center">
                      <div
                        className={`w-full h-1.5 rounded-full mb-1 transition-all ${
                          isDone
                            ? 'bg-[#013a13]'
                            : 'bg-[#edefe9]'
                        }`}
                      ></div>
                      <span
                        className={`text-[9px] font-bold ${
                          isCurrent
                            ? 'text-[#013a13] font-black'
                            : isDone
                            ? 'text-[#2c694e]'
                            : 'text-[#71796f]'
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live Status Description */}
            <div className="p-2.5 rounded-xl bg-[#f2f4ee] border border-[#edefe9] space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-[#191c19] flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#2c694e] animate-ping"></span>
                  <span>{tx.statusLabel}</span>
                </span>
                <span className="text-[10px] text-[#71796f] font-mono">
                  {tx.estimatedReleaseTime}
                </span>
              </div>
              <p className="text-[11px] text-[#414940] leading-snug">
                {tx.inspectionSummary}
              </p>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-1 gap-1.5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenQR(tx.id);
                }}
                className="flex-1 h-9 rounded-xl bg-[#013a13] hover:bg-[#1e5128] text-white text-xs font-bold flex items-center justify-center gap-1 active:scale-95 transition-transform cursor-pointer shadow-xs"
                title="Present QR code for this specific order"
              >
                <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
                <span>{t('escrow.presentQr', 'Present QR')}</span>
              </button>

              <button
                type="button"
                onClick={(e) => handleOpenReceipt(tx, e)}
                className="flex-1 h-9 rounded-xl bg-[#f2f4ee] hover:bg-[#e7e9e3] text-[#013a13] text-xs font-bold flex items-center justify-center gap-1 active:scale-95 transition-transform cursor-pointer border border-[#c1c9bd]/50"
              >
                <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                <span>Receipt</span>
              </button>

              {tx.currentStep === 3 && (
                <button
                  type="button"
                  onClick={(e) => handleSimulateManualRelease(tx.id, e)}
                  className="flex-1 h-9 rounded-xl bg-[#013a13] hover:bg-[#1e5128] text-[#b1f0ce] text-xs font-bold flex items-center justify-center gap-1 active:scale-95 transition-transform cursor-pointer shadow-xs border border-[#b1f0ce]/30"
                >
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  <span>Sign-Off</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Escrow Guarantee Footer Note */}
      <div className="p-3 bg-[#aeeecb]/30 rounded-2xl border border-[#2c694e]/20 flex items-start gap-2.5 text-xs text-[#013a13]">
        <span
          className="material-symbols-outlined text-[20px] text-[#2c694e] flex-shrink-0 mt-0.5"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          security
        </span>
        <div className="min-w-0">
          <span className="font-extrabold block">
            Central Region Co-op Escrow Covenant:
          </span>
          <span className="text-[11px] text-[#414940] leading-tight block mt-0.5">
            Buyer funds are verified and frozen before your truck departs the farmgate. Payouts are
            disbursed directly to your MTN Mobile Money phone upon depot delivery sign-off.
          </span>
        </div>
      </div>

      {/* Escrow Receipt Modal */}
      {activeReceiptModalTx && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-[#edefe9] space-y-3.5">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-[#edefe9]">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[#013a13] text-[#b1f0ce] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                </span>
                <div>
                  <h3 className="text-sm font-black text-[#191c19]">Escrow Security Receipt</h3>
                  <span className="text-[10px] text-[#71796f] font-mono">
                    {activeReceiptModalTx.orderNumber}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveReceiptModalTx(null)}
                className="w-8 h-8 rounded-full bg-[#f2f4ee] flex items-center justify-center text-[#71796f] hover:text-[#191c19]"
              >
                ✕
              </button>
            </div>

            {/* Big Amount */}
            <div className="p-3 bg-[#f8faf4] rounded-2xl text-center border border-[#e1e3dd]">
              <span className="text-[10px] text-[#71796f] uppercase font-bold block">
                Protected Escrow Balance
              </span>
              <span className="text-2xl font-black text-[#013a13] block mt-0.5">
                GH₵ {activeReceiptModalTx.amountGhs.toLocaleString()}
              </span>
              <span className="text-[10px] font-bold text-[#2c694e] inline-flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2c694e]"></span>
                <span>Verified in {activeReceiptModalTx.escrowVault}</span>
              </span>
            </div>

            {/* Line items */}
            <div className="space-y-1.5 text-xs text-[#414940]">
              <div className="flex justify-between py-1 border-b border-[#edefe9]">
                <span className="text-[#71796f]">Buyer / Debtor:</span>
                <span className="font-bold text-[#191c19]">{activeReceiptModalTx.buyerName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#edefe9]">
                <span className="text-[#71796f]">Produce / Lot:</span>
                <span className="font-bold text-[#191c19]">{activeReceiptModalTx.cropTitle}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#edefe9]">
                <span className="text-[#71796f]">Quantity:</span>
                <span className="font-bold text-[#191c19]">{activeReceiptModalTx.quantity}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#edefe9]">
                <span className="text-[#71796f]">MoMo Escrow Ref:</span>
                <span className="font-mono text-[11px] font-bold text-[#013a13]">
                  {activeReceiptModalTx.momoRef}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#edefe9]">
                <span className="text-[#71796f]">Assigned Hauler:</span>
                <span className="font-bold text-[#191c19]">{activeReceiptModalTx.haulerName}</span>
              </div>
            </div>

            {/* Cryptographic Trust Seal */}
            <div className="p-2.5 rounded-xl bg-[#013a13]/5 border border-[#013a13]/10 flex items-center gap-2 text-[10px] text-[#013a13]">
              <span className="material-symbols-outlined text-[20px] text-[#2c694e] flex-shrink-0">
                lock_clock
              </span>
              <span className="leading-tight">
                Funds are irrevocably locked under Bank of Ghana Mobile Money Escrow Regulations
                (Act 987). Disbursed immediately upon quality validation.
              </span>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveReceiptModalTx(null)}
              className="w-full h-11 bg-[#013a13] text-white rounded-2xl text-xs font-bold active:scale-95 transition-transform cursor-pointer"
            >
              Done / Close
            </button>
          </div>
        </div>
      )}

      {/* Escrow Dynamic Payment QR Code Modal */}
      <EscrowPaymentQRModal
        isOpen={isQrModalOpen}
        onClose={handleCloseQR}
        transactions={transactions}
        selectedInitialTxId={selectedQrTxId}
        onSimulatePaymentSuccess={handleSimulatePaymentSuccess}
      />
    </div>
  );
};
