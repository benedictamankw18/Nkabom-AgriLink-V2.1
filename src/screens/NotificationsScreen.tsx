import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const NotificationsScreen: React.FC = () => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    acceptOffer,
    declineOffer,
    playSpeech,
    setActiveTab,
    smsMode,
    setSmsMode,
    showToast,
    priceAlerts,
    transportRequests,
    updateTransportStatus,
    role,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'offer' | 'price' | 'transport'>('all');
  const [showAudioBanner, setShowAudioBanner] = useState(false);
  const [acceptedDeals, setAcceptedDeals] = useState<Record<string, boolean>>({});
  const [declinedDeals, setDeclinedDeals] = useState<Record<string, boolean>>({});

  const filterTabs = [
    { id: 'all' as const, label: `All (${notifications.length})` },
    {
      id: 'transport' as const,
      label: `🚚 Transport Dashboard (${transportRequests.length})`,
    },
    {
      id: 'offer' as const,
      label: `Offers & Deals (${notifications.filter((n) => n.type === 'offer').length})`,
    },
    {
      id: 'price' as const,
      label: `Price Alerts (${notifications.filter((n) => n.type === 'price').length})`,
    },
  ];

  const filteredNotifications = notifications.filter(
    (n) => activeFilter === 'all' || n.type === activeFilter
  );

  const handleAcceptDeal = (notifId: string, offerId?: string) => {
    setAcceptedDeals((prev) => ({ ...prev, [notifId]: true }));
    if (offerId) {
      acceptOffer(offerId);
    }
    markNotificationAsRead(notifId);
    playSpeech(
      'Deal confirmed! Ama Serwaa notified and crates reserved for pickup.',
      'Deal Confirmed'
    );
  };

  const handleDeclineDeal = (notifId: string, offerId?: string) => {
    setDeclinedDeals((prev) => ({ ...prev, [notifId]: true }));
    if (offerId) {
      declineOffer(offerId);
    }
    markNotificationAsRead(notifId);
    playSpeech('Offer politely declined.', 'Offer Declined');
  };

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto px-4 pt-16 pb-28 gap-4 bg-[#f8faf4] min-h-screen">
      {/* Top Controls */}
      <div className="pt-2">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-[#013a13] text-[28px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              notifications_active
            </span>
            <span className="text-[22px] font-black text-[#191c19]">
              Notifications
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setShowAudioBanner(!showAudioBanner);
                playSpeech(
                  'Reading your notifications: Ama Serwaa offered 160 Cedis per crate for 30 crates. Makola market prices crossed 175 Cedis. Transporter Kofi Mensah has arrived at Techiman depot.',
                  'All Notifications Summary'
                );
              }}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#edefe9] rounded-full text-[#191c19] hover:bg-[#e7e9e3] active:scale-95 transition-all cursor-pointer"
            >
              <span
                className="material-symbols-outlined text-[#2c694e] text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                volume_up
              </span>
              <span className="text-xs text-[#2c694e] font-bold">Audio / Tie</span>
            </button>

            <button
              onClick={markAllNotificationsAsRead}
              className="px-3 py-2 bg-[#f2f4ee] hover:bg-[#edefe9] text-[#013a13] rounded-full text-xs font-bold transition-all active:scale-95 cursor-pointer"
            >
              Mark all read
            </button>
          </div>
        </div>

        {/* Vernacular Audio Helper Banner */}
        {showAudioBanner && (
          <div className="mb-4 p-3.5 bg-[#aeeecb] text-[#316e52] rounded-2xl flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#2c694e] text-[22px] animate-pulse">
                graphic_eq
              </span>
              <p className="text-xs font-bold leading-tight">
                Mfonini a ɛwɔ ha bɛkenkan wo nkratoɔ no nyinaa wɔ Twi mu.
              </p>
            </div>
            <button
              aria-label="Dismiss banner"
              className="p-1 rounded-full hover:bg-black/10 cursor-pointer"
              onClick={() => setShowAudioBanner(false)}
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`flex-shrink-0 px-4 py-2.5 rounded-full text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer border ${
                  isActive
                    ? 'bg-[#013a13] text-white border-[#013a13]'
                    : 'bg-[#edefe9] text-[#414940] hover:bg-[#e7e9e3] border-transparent'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Threshold Alerts Live Summary Strip */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-[#eaf2e4] to-[#f4f7ee] border border-[#d2e2cd] shadow-2xs">
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex items-center justify-center w-7 h-7 rounded-xl bg-[#013a13] text-white">
            <span className="material-symbols-outlined text-[16px]">notifications_active</span>
          </span>
          <div className="min-w-0">
            <span className="text-xs font-black text-[#013a13] block truncate">
              {priceAlerts.filter((a) => a.active).length} Target Thresholds Active
            </span>
            <span className="text-[10px] text-[#414940] truncate block">
              Auto-monitoring farmgate & wholesale market spot prices
            </span>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('prices')}
          className="px-3 py-1.5 bg-[#013a13] hover:bg-[#1e5128] text-white text-[11px] font-bold rounded-xl active:scale-95 transition-all flex items-center gap-1 cursor-pointer flex-shrink-0 shadow-2xs"
        >
          <span>Set / Manage</span>
          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </button>
      </div>

      {/* Live Transport Dashboard (SRS FR-33 to FR-36) */}
      {(activeFilter === 'all' || activeFilter === 'transport') && transportRequests.length > 0 && (
        <div className="bg-white rounded-3xl p-4 shadow-xs border border-[#edefe9] space-y-3.5">
          <div className="flex items-center justify-between pb-1 border-b border-[#edefe9]">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#013a13] text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">local_shipping</span>
              </div>
              <div>
                <h3 className="text-sm font-black text-[#191c19]">
                  Live Transport &amp; Haulage Dashboard
                </h3>
                <p className="text-[11px] text-[#414940]">
                  Central Region Pilot Logistics Corridor (FR-33 to FR-36)
                </p>
              </div>
            </div>

            <span className="px-2.5 py-0.5 rounded-full bg-[#aeeecb] text-[#316e52] text-xs font-bold">
              {transportRequests.length} Active Trips
            </span>
          </div>

          <div className="space-y-3">
            {transportRequests.map((tr) => {
              const statusSteps = [
                { id: 'pending', label: 'Requested' },
                { id: 'matched', label: 'Matched' },
                { id: 'driver_assigned', label: 'Driver Assigned' },
                { id: 'in_transit', label: 'In Transit' },
                { id: 'delivered', label: 'Delivered' },
              ];

              const currentStepIdx = statusSteps.findIndex((s) => s.id === tr.status);

              return (
                <div
                  key={tr.id}
                  className="p-3.5 rounded-2xl bg-[#f8faf4] border border-[#e1e3dd] space-y-3"
                >
                  {/* Produce & Route Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-sm font-black text-[#191c19]">
                          {tr.produceTitle}
                        </span>
                        <span className="text-xs font-bold text-[#013a13]">
                          • {tr.cratesCount} Crates
                        </span>
                        {tr.isShared && (
                          <span className="px-2 py-0.5 rounded-full bg-[#b1f0ce] text-[#002114] text-[10px] font-bold">
                            Shared Haul (-40%)
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#414940] mt-0.5 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-[#013a13]">
                          near_me
                        </span>
                        <span>{tr.pickupLocation}</span>
                        <span className="text-[#c1c9bd]">➔</span>
                        <span className="font-semibold">{tr.deliveryLocation}</span>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-black text-[#013a13] block">
                        GH₵ {tr.estimatedCost}
                      </span>
                      <span className="text-[10px] text-[#71796f] block">
                        {tr.departureTime}
                      </span>
                    </div>
                  </div>

                  {/* Visual Status Progress Tracker */}
                  <div className="pt-1">
                    <div className="flex items-center justify-between text-[10px] font-bold text-[#414940] mb-1">
                      <span>Milestone Progress</span>
                      <span className="capitalize text-[#013a13]">
                        {tr.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="grid grid-cols-5 gap-1">
                      {statusSteps.map((step, idx) => {
                        const isDone = idx <= currentStepIdx;
                        const isCurrent = idx === currentStepIdx;
                        return (
                          <div key={step.id} className="flex flex-col items-center">
                            <div
                              className={`w-full h-2 rounded-full transition-all ${
                                isDone
                                  ? isCurrent
                                    ? 'bg-[#812a00]'
                                    : 'bg-[#013a13]'
                                  : 'bg-[#e1e3dd]'
                              }`}
                            ></div>
                            <span
                              className={`text-[9px] mt-1 text-center truncate max-w-[55px] ${
                                isDone ? 'font-bold text-[#191c19]' : 'text-[#71796f]'
                              }`}
                            >
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Transporter & Vehicle Metadata */}
                  <div className="p-2.5 rounded-xl bg-white border border-[#edefe9] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-[#f2f4ee] flex items-center justify-center text-[#013a13]">
                        <span className="material-symbols-outlined text-[18px]">badge</span>
                      </span>
                      <div>
                        <span className="font-bold text-[#191c19] block">
                          {tr.transporterName || 'Fleet Assigned'}
                        </span>
                        <span className="text-[11px] text-[#71796f] block font-mono">
                          {tr.vehicleNumber}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {tr.transporterPhone && (
                        <a
                          href={`tel:${tr.transporterPhone}`}
                          className="px-2.5 py-1.5 bg-[#013a13] text-white rounded-xl text-xs font-bold flex items-center gap-1 active:scale-95 transition-transform"
                        >
                          <span className="material-symbols-outlined text-[14px]">call</span>
                          <span>Call</span>
                        </a>
                      )}

                      <button
                        onClick={() =>
                          playSpeech(
                            `Transport update for ${tr.produceTitle}: Driver ${tr.transporterName} with vehicle ${tr.vehicleNumber} is currently ${tr.status.replace('_', ' ')}. Destination: ${tr.deliveryLocation}.`,
                            'Logistics Voice Broadcast'
                          )
                        }
                        className="p-1.5 bg-[#f2f4ee] text-[#013a13] rounded-xl hover:bg-[#e7e9e3] active:scale-90 transition-transform cursor-pointer"
                        title="Listen to logistics update"
                      >
                        <span className="material-symbols-outlined text-[16px]">volume_up</span>
                      </button>
                    </div>
                  </div>

                  {/* Interactive Status Switcher (SRS Simulation & Stakeholder Workflow) */}
                  <div className="flex items-center justify-between pt-1 border-t border-[#edefe9] text-[11px]">
                    <span className="text-[#71796f] font-semibold">Simulate Status:</span>
                    <div className="flex items-center gap-1">
                      {(['matched', 'driver_assigned', 'in_transit', 'delivered'] as const).map(
                        (st) => (
                          <button
                            key={st}
                            onClick={() => {
                              updateTransportStatus(tr.id, st);
                              showToast(`Transport status updated to ${st.replace('_', ' ')}`);
                            }}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer capitalize ${
                              tr.status === st
                                ? 'bg-[#013a13] text-white'
                                : 'bg-[#e7e9e3] text-[#414940] hover:bg-[#d8dbd5]'
                            }`}
                          >
                            {st === 'driver_assigned' ? 'Driver' : st.replace('_', ' ')}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Notifications List */}
      <div className="flex flex-col gap-4">
        {filteredNotifications.map((notif) => {
          const isAccepted = acceptedDeals[notif.id];
          const isDeclined = declinedDeals[notif.id];

          return (
            <div
              key={notif.id}
              onClick={() => markNotificationAsRead(notif.id)}
              className="bg-white rounded-3xl p-4 shadow-xs border border-[#edefe9] relative flex flex-col gap-3 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="relative flex-shrink-0">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      notif.type === 'offer'
                        ? 'bg-[#aeeecb] text-[#2c694e]'
                        : notif.type === 'price'
                        ? 'bg-[#ffdbcf] text-[#812a00]'
                        : notif.type === 'transport'
                        ? 'bg-[#e7e9e3] text-[#013a13]'
                        : 'bg-[#aeeecb] text-[#2c694e]'
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-[26px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      {notif.type === 'offer'
                        ? 'shopping_bag'
                        : notif.type === 'price'
                        ? 'local_fire_department'
                        : notif.type === 'transport'
                        ? 'local_shipping'
                        : 'payments'}
                    </span>
                  </div>

                  {!notif.read && !isAccepted && !isDeclined && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#812a00] rounded-full ring-2 ring-white"></span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                        notif.type === 'offer'
                          ? 'bg-[#aeeecb] text-[#316e52]'
                          : notif.type === 'price'
                          ? 'bg-[#ffdbcf] text-[#380d00]'
                          : notif.type === 'transport'
                          ? 'bg-[#e7e9e3] text-[#191c19]'
                          : 'bg-[#b1f0ce] text-[#002114]'
                      }`}
                    >
                      {isAccepted
                        ? 'Deal Locked'
                        : isDeclined
                        ? 'Declined'
                        : notif.badgeText}
                    </span>
                    <span className="text-[#71796f] text-xs font-medium">
                      {notif.timeAgo}
                    </span>
                  </div>

                  <h2 className="text-[17px] font-black text-[#191c19] truncate">
                    {notif.title}
                  </h2>
                  <p className="text-xs text-[#414940] mt-1 leading-relaxed">
                    {notif.message}
                  </p>
                </div>
              </div>

              {/* Specific Content for Offer Type */}
              {notif.type === 'offer' && (
                <>
                  {isAccepted ? (
                    <div className="w-full py-3 px-4 bg-[#aeeecb] text-[#316e52] rounded-2xl flex items-center justify-center gap-2 text-xs font-bold">
                      <span className="material-symbols-outlined text-[20px]">
                        verified
                      </span>
                      <span>Deal Confirmed! Ama Serwaa notified via SMS.</span>
                    </div>
                  ) : isDeclined ? (
                    <div className="w-full py-3 px-4 bg-[#f2f4ee] text-[#414940] rounded-2xl flex items-center justify-center gap-2 text-xs font-bold">
                      <span className="material-symbols-outlined text-[20px]">
                        cancel
                      </span>
                      <span>Offer politely declined.</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2.5 mt-1 pt-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAcceptDeal(notif.id, notif.offerId);
                        }}
                        className="h-14 flex-1 bg-[#013a13] hover:bg-[#1e5128] text-white text-sm font-bold rounded-2xl flex items-center justify-center gap-2 shadow-xs active:scale-98 transition-all cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[22px]">
                          check_circle
                        </span>
                        <span>Accept Deal</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeclineDeal(notif.id, notif.offerId);
                        }}
                        className="h-14 flex-1 bg-[#edefe9] hover:bg-[#e7e9e3] text-[#191c19] text-sm font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[22px]">
                          close
                        </span>
                        <span>Decline</span>
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[#71796f] mt-0.5 px-1">
                    <span className="text-xs flex items-center gap-1 font-medium">
                      <span className="material-symbols-outlined text-[16px]">
                        location_on
                      </span>
                      {notif.location || 'Techiman Agromarket'}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playSpeech(
                          'New offer: Ama Serwaa offered 160 Cedis per crate for 30 crates of Roma tomatoes. Pickup scheduled today at 3:30 PM.',
                          'Ama Serwaa Offer Details'
                        );
                      }}
                      className="flex items-center gap-1 text-xs text-[#2c694e] font-bold hover:underline cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        volume_up
                      </span>
                      <span>Tie bio (Listen)</span>
                    </button>
                  </div>
                </>
              )}

              {/* Specific Content for Price Alert */}
              {notif.type === 'price' && (
                <>
                  {notif.isThresholdAlert ? (
                    <div className="p-3.5 bg-gradient-to-br from-[#f2f7ef] to-[#e8f1e3] rounded-2xl border border-[#cbe0c5] flex flex-col gap-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-full bg-[#013a13] text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px]">
                              target
                            </span>
                            Target Met
                          </span>
                          <span className="text-xs font-bold text-[#2c694e]">
                            {notif.condition === 'above_or_equal' ? '≥ Surge' : '≤ Dip'}
                          </span>
                        </div>

                        <div className="flex items-baseline gap-1">
                          <span className="text-[11px] text-[#71796f]">Current Spot:</span>
                          <span className="text-sm font-black text-[#013a13]">
                            GH₵ {notif.currentPrice}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-[#414940] bg-white p-2.5 rounded-xl border border-[#d8e4d2]">
                        <span className="font-semibold text-[11px]">
                          Target was:{' '}
                          <strong className="text-[#013a13]">
                            GH₵ {notif.targetPrice}
                          </strong>
                        </span>
                        <span className="text-[11px] font-extrabold text-[#2c694e]">
                          {notif.currentPrice && notif.targetPrice
                            ? notif.currentPrice >= notif.targetPrice
                              ? `+GH₵ ${notif.currentPrice - notif.targetPrice} above target!`
                              : `-GH₵ ${notif.targetPrice - notif.currentPrice} below target!`
                            : 'Target Reached'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveTab('sell');
                          }}
                          className="flex-1 h-9 px-3 bg-[#013a13] hover:bg-[#1e5128] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer shadow-2xs"
                        >
                          <span className="material-symbols-outlined text-[15px]">
                            post_add
                          </span>
                          <span>List Produce Now</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveTab('prices');
                          }}
                          className="px-3 h-9 bg-white border border-[#c1c9bd] text-[#013a13] hover:bg-[#f2f4ee] rounded-xl text-xs font-bold flex items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[15px]">
                            monitoring
                          </span>
                          <span>Chart</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            playSpeech(
                              notif.message,
                              `${notif.title} • Voice Alert`
                            );
                          }}
                          className="w-9 h-9 bg-white border border-[#c1c9bd] text-[#2c694e] hover:bg-[#f2f4ee] rounded-xl flex items-center justify-center active:scale-90 transition-all cursor-pointer"
                          title="Listen in Twi"
                        >
                          <span className="material-symbols-outlined text-[17px]">
                            volume_up
                          </span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-[#f2f4ee] rounded-2xl flex items-center justify-between border border-[#edefe9]">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#2c694e] text-[22px]">
                          trending_up
                        </span>
                        <span className="text-xs text-[#191c19] font-bold">
                          +18% vs Last Tuesday
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveTab('prices');
                        }}
                        className="px-3.5 py-1.5 bg-[#2c694e] text-white rounded-xl text-xs font-bold active:scale-95 transition-all cursor-pointer"
                      >
                        View Demand
                      </button>
                    </div>
                  )}
                </>
              )}

              {/* Specific Content for Transport */}
              {notif.type === 'transport' && (
                <div className="flex items-center gap-2.5">
                  <a
                    href="tel:0244119022"
                    onClick={(e) => e.stopPropagation()}
                    className="h-12 px-4 bg-[#edefe9] hover:bg-[#e7e9e3] text-[#191c19] rounded-2xl text-xs font-bold flex items-center justify-center gap-2 active:scale-98 transition-all flex-1"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      call
                    </span>
                    <span>Call Driver (024 411 9022)</span>
                  </a>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      showToast('Driver location: Entering Techiman Depot Gate B');
                    }}
                    aria-label="Track on map"
                    className="h-12 w-12 bg-[#e7e9e3] hover:bg-[#d8dbd5] rounded-2xl flex items-center justify-center text-[#013a13] active:scale-95 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[22px]">
                      navigation
                    </span>
                  </button>
                </div>
              )}

              {/* Specific Content for Paid */}
              {notif.type === 'paid' && (
                <div className="flex items-center justify-between bg-[#f2f4ee] p-3 rounded-2xl border border-[#edefe9]">
                  <span className="text-xs text-[#71796f] font-mono">
                    Ref: TXN-8902481-MM
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      showToast('Payment receipt TXN-8902481-MM downloaded');
                    }}
                    className="text-[#2c694e] text-xs font-bold flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <span>View Receipt</span>
                    <span className="material-symbols-outlined text-[16px]">
                      arrow_forward
                    </span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Offline & SMS Mode Card */}
      <div className="mt-2 p-4 rounded-3xl bg-[#f2f4ee] border border-[#edefe9] flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#edefe9] flex items-center justify-center text-[#414940] flex-shrink-0">
            <span className="material-symbols-outlined text-[22px]">sms</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-[#191c19]">
              Offline &amp; SMS Mode
            </h3>
            <p className="text-xs text-[#414940] mt-0.5 leading-relaxed">
              Need SMS alerts instead of internet app notifications?
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            const next = !smsMode;
            setSmsMode(next);
            showToast(
              next
                ? 'SMS Alerts Active (024 582 9104)'
                : 'SMS Alerts Disabled'
            );
          }}
          className={`h-12 w-full font-bold text-xs rounded-2xl flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer ${
            smsMode
              ? 'bg-[#aeeecb] text-[#316e52]'
              : 'bg-[#e1e3dd] text-[#191c19] hover:bg-[#d8dbd5]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">cell_tower</span>
          <span>
            {smsMode ? 'SMS Alerts Active (024 582 9104)' : 'Turn on SMS Alerts'}
          </span>
        </button>
      </div>
    </div>
  );
};
