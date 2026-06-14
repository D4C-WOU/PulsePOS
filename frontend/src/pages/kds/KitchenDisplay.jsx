import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Play, CheckSquare, RefreshCw, Radio, BellRing, ChefHat, History } from "lucide-react";
import { toast } from "react-hot-toast";

import Spinner from "../../components/common/Spinner";
import Button from "../../components/common/Button";
import { getKdsTicketsApi, updateKdsTicketStageApi, updateKdsItemCompletionApi } from "../../api/kds.api";
import useSocket from "../../hooks/useSocket";

// Synthesized audio beep via Web Audio API
const playNotificationBeep = () => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(800, audioCtx.currentTime); // A5 note
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.18); // 180ms beep
  } catch (err) {
    console.error("Audio beep synthesis error:", err);
  }
};

export const KitchenDisplay = () => {
  const queryClient = useQueryClient();
  const socket = useSocket("kds");

  const [tickets, setTickets] = useState([]);
  const [showHistory, setShowHistory] = useState(false); // toggle completed tickets view
  const [isConnected, setIsConnected] = useState(false);
  const [, forceUpdate] = useState(0); // Trigger periodic re-renders for elapsed timers

  // Fetch initial KDS tickets
  const { data: ticketsRes, isLoading, refetch } = useQuery({
    queryKey: ["kds_tickets", showHistory],
    queryFn: () => getKdsTicketsApi({ all: showHistory ? "true" : "false" }),
    onSuccess: (res) => {
      setTickets(res.data || []);
    },
  });

  // Socket connection listeners
  useEffect(() => {
    if (socket) {
      setIsConnected(socket.connected);

      const handleConnect = () => setIsConnected(true);
      const handleDisconnect = () => setIsConnected(false);

      socket.on("connect", handleConnect);
      socket.on("disconnect", handleDisconnect);

      // Realtime new ticket event
      socket.on("kds:new_order", (newTicket) => {
        playNotificationBeep();
        toast.success(`New order ${newTicket.order_number} routed to kitchen!`, {
          icon: "🍳",
          duration: 5000,
        });
        setTickets((prev) => {
          // Prevent duplicates
          if (prev.some((t) => t.id === newTicket.id)) return prev;
          return [...prev, newTicket];
        });
      });

      // Realtime stage change event
      socket.on("kds:stage_updated", ({ ticket_id, new_stage }) => {
        setTickets((prev) =>
          prev
            .map((t) => (t.id === ticket_id ? { ...t, stage: new_stage } : t))
            .filter((t) => showHistory || new_stage !== "completed")
        );
      });

      // Realtime item checkbox toggle event
      socket.on("kds:item_updated", ({ kds_item_id, is_completed }) => {
        setTickets((prev) =>
          prev.map((t) => ({
            ...t,
            items: t.items.map((item) =>
              item.kds_item_id === kds_item_id ? { ...item, is_completed } : item
            ),
          }))
        );
      });

      return () => {
        socket.off("connect", handleConnect);
        socket.off("disconnect", handleDisconnect);
        socket.off("kds:new_order");
        socket.off("kds:stage_updated");
        socket.off("kds:item_updated");
      };
    }
  }, [socket, showHistory]);

  // Sync state when API data changes
  useEffect(() => {
    if (ticketsRes?.data) {
      setTickets(ticketsRes.data);
    }
  }, [ticketsRes]);

  // Dynamic timer updater: refresh UI every 10 seconds to update elapsed time labels
  useEffect(() => {
    const timer = setInterval(() => {
      forceUpdate((x) => x + 1);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // Stage mutations
  const updateStageMutation = useMutation({
    mutationFn: ({ ticketId, stage }) => updateKdsTicketStageApi(ticketId, stage),
    onSuccess: (_, variables) => {
      toast.success(`Ticket status updated to ${variables.stage}`);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Failed to update cooking stage");
    },
  });

  // Item checkbox toggle mutation
  const toggleItemMutation = useMutation({
    mutationFn: ({ kdsItemId, isCompleted }) => updateKdsItemCompletionApi(kdsItemId, isCompleted),
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Failed to update item status");
    },
  });

  const handleStartCooking = (ticketId) => {
    updateStageMutation.mutate({ ticketId, stage: "preparing" });
  };

  const handleCompleteOrder = (ticketId) => {
    updateStageMutation.mutate({ ticketId, stage: "completed" });
  };

  const handleToggleItem = (kdsItemId, currentVal) => {
    toggleItemMutation.mutate({ kdsItemId, isCompleted: !currentVal });
  };

  // Helper: Get elapsed time text
  const getElapsedTimeText = (sentAt) => {
    const start = new Date(sentAt);
    const now = new Date();
    const diffMs = now - start;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    return `${diffMins} min ago`;
  };

  // Group tickets by stage
  const toCookTickets = tickets.filter((t) => t.stage === "to_cook");
  const preparingTickets = tickets.filter((t) => t.stage === "preparing");
  const completedTickets = tickets.filter((t) => t.stage === "completed");

  return (
    <div className="min-h-screen bg-cafe-bg-dark text-cafe-text-primary flex flex-col h-screen overflow-hidden select-none">
      {/* KDS Control Header */}
      <header className="bg-cafe-bg-card border-b border-cafe-border px-6 py-4.5 flex justify-between items-center shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <ChefHat size={26} className="text-cafe-beige-mid" />
          <div>
            <h1 className="text-lg font-black tracking-wider text-cafe-beige-mid uppercase leading-none">
              Kitchen Display System (KDS)
            </h1>
            <p className="text-[10px] text-cafe-text-muted mt-1 flex items-center gap-1.5 font-bold uppercase">
              <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-cafe-success animate-pulse" : "bg-cafe-danger"}`} />
              {isConnected ? "KDS Live Stream Connected" : "Connection Lost - Retrying"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* History Toggle */}
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-bold transition-all ${
              showHistory
                ? "bg-cafe-beige-mid text-[#1C1814] border-cafe-beige-mid"
                : "bg-cafe-bg-dark border-cafe-border text-cafe-text-secondary hover:bg-cafe-bg-input"
            }`}
          >
            {showHistory ? <ChefHat size={14} /> : <History size={14} />}
            <span>{showHistory ? "Cooking Screen" : "Recall History"}</span>
          </button>

          {/* Sound test button */}
          <button
            onClick={playNotificationBeep}
            className="p-2 bg-cafe-bg-dark border border-cafe-border hover:bg-cafe-bg-input text-cafe-text-secondary rounded-lg transition-colors"
            title="Test Sound Alert"
          >
            <BellRing size={15} />
          </button>

          {/* Manual Refresh */}
          <button
            onClick={() => refetch()}
            className="p-2 bg-cafe-bg-dark border border-cafe-border hover:bg-cafe-bg-input text-cafe-text-secondary rounded-lg transition-colors"
            title="Manual Reload"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </header>

      {isLoading ? (
        <div className="flex-1 flex justify-center items-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="flex-1 flex overflow-hidden">
          {showHistory ? (
            // Recall Completed Tickets Grid (Full width)
            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
              <h2 className="text-sm font-bold text-cafe-beige-mid mb-4 border-b border-cafe-border/50 pb-2 flex items-center gap-1.5">
                <History size={16} /> Completed Orders Recall (Archive)
              </h2>
              {completedTickets.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-cafe-text-muted text-xs">
                  No completed tickets logged today.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {completedTickets.map((t) => (
                    <div key={t.id} className="bg-cafe-bg-card/40 border border-cafe-border/60 rounded-xl p-4.5 opacity-70">
                      <div className="flex justify-between items-center border-b border-cafe-border pb-2.5 mb-2.5">
                        <span className="font-extrabold text-cafe-text-primary text-sm">{t.order_number}</span>
                        <span className="text-[10px] text-cafe-text-muted">{getElapsedTimeText(t.sent_at)}</span>
                      </div>
                      <div className="flex flex-col gap-2">
                        {t.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs line-through text-cafe-text-muted">
                            <span>{item.product_name}</span>
                            <span className="font-bold">x{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            // Active Cooking Screen: Three Columns (To Cook, Preparing, Completed)
            <div className="flex-grow grid grid-cols-1 md:grid-cols-3 divide-x divide-cafe-border/60">
              {/* 1. TO COOK */}
              <div className="flex flex-col h-full overflow-hidden">
                <div className="bg-cafe-bg-card border-b border-cafe-border px-5 py-3.5 flex justify-between items-center shrink-0">
                  <span className="text-xs font-black text-cafe-beige-mid uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cafe-warning" /> New Checks (To Cook)
                  </span>
                  <span className="text-xs bg-cafe-warning/10 text-cafe-warning font-extrabold border border-cafe-warning/20 px-2 py-0.5 rounded-full">
                    {toCookTickets.length}
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar">
                  {toCookTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="bg-cafe-bg-card border border-cafe-border hover:border-cafe-text-muted rounded-xl p-4 flex flex-col gap-4 shadow transition-all animate-slide-in relative overflow-hidden"
                    >
                      {/* Accent color strip */}
                      <div className="absolute top-0 left-0 w-full h-1.5 bg-cafe-warning" />

                      <div className="flex justify-between items-center border-b border-cafe-border pb-2">
                        <span className="font-extrabold text-sm text-cafe-text-primary">
                          {ticket.order_number}
                        </span>
                        <span className="text-[10px] text-cafe-text-muted font-mono font-bold">
                          {getElapsedTimeText(ticket.sent_at)}
                        </span>
                      </div>

                      <div className="flex flex-col gap-2.5">
                        {ticket.items.map((item) => (
                          <div key={item.kds_item_id} className="flex justify-between items-start text-xs font-medium">
                            <span className="text-cafe-text-primary leading-tight">{item.product_name}</span>
                            <span className="font-extrabold text-cafe-beige-mid shrink-0 pl-3">x{item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      <Button
                        onClick={() => handleStartCooking(ticket.id)}
                        className="w-full text-xs font-bold bg-cafe-warning text-[#1C1814] hover:bg-amber-400 mt-2 flex items-center justify-center gap-1"
                      >
                        <Play size={13} fill="currentColor" /> Start Cooking
                      </Button>
                    </div>
                  ))}
                  {toCookTickets.length === 0 && (
                    <div className="h-full flex items-center justify-center text-cafe-text-muted text-xs py-16">
                      No pending checks.
                    </div>
                  )}
                </div>
              </div>

              {/* 2. PREPARING */}
              <div className="flex flex-col h-full overflow-hidden">
                <div className="bg-cafe-bg-card border-b border-cafe-border px-5 py-3.5 flex justify-between items-center shrink-0">
                  <span className="text-xs font-black text-cafe-beige-mid uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cafe-green-mid" /> In Progress (Cooking)
                  </span>
                  <span className="text-xs bg-cafe-green-mid/10 text-cafe-green-mid font-extrabold border border-cafe-green-mid/20 px-2 py-0.5 rounded-full">
                    {preparingTickets.length}
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar">
                  {preparingTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="bg-cafe-bg-card border border-cafe-border hover:border-cafe-text-muted rounded-xl p-4 flex flex-col gap-4 shadow transition-all relative overflow-hidden"
                    >
                      {/* Accent color strip */}
                      <div className="absolute top-0 left-0 w-full h-1.5 bg-cafe-green-mid" />

                      <div className="flex justify-between items-center border-b border-cafe-border pb-2">
                        <span className="font-extrabold text-sm text-cafe-text-primary">
                          {ticket.order_number}
                        </span>
                        <span className="text-[10px] text-cafe-text-muted font-mono font-bold">
                          {getElapsedTimeText(ticket.sent_at)}
                        </span>
                      </div>

                      {/* Items with checkboxes */}
                      <div className="flex flex-col gap-2.5">
                        {ticket.items.map((item) => (
                          <label
                            key={item.kds_item_id}
                            className={`flex justify-between items-center text-xs font-medium cursor-pointer py-1 px-1.5 rounded transition-colors ${
                              item.is_completed
                                ? "bg-cafe-green-mid/5 text-cafe-text-muted line-through opacity-70"
                                : "hover:bg-cafe-bg-input/20 text-cafe-text-primary"
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <input
                                type="checkbox"
                                checked={item.is_completed}
                                onChange={() => handleToggleItem(item.kds_item_id, item.is_completed)}
                                className="w-4 h-4 accent-cafe-green-mid cursor-pointer shrink-0 border border-cafe-border rounded"
                              />
                              <span className="truncate">{item.product_name}</span>
                            </div>
                            <span className={`font-extrabold shrink-0 pl-3 ${item.is_completed ? "text-cafe-text-muted" : "text-cafe-beige-mid"}`}>
                              x{item.quantity}
                            </span>
                          </label>
                        ))}
                      </div>

                      <Button
                        onClick={() => handleCompleteOrder(ticket.id)}
                        className="w-full text-xs font-bold bg-cafe-green-mid text-[#FFFFFF] hover:bg-cafe-green-light mt-2 flex items-center justify-center gap-1 shadow-md shadow-cafe-green-mid/5"
                      >
                        <CheckSquare size={13} /> Complete Order
                      </Button>
                    </div>
                  ))}
                  {preparingTickets.length === 0 && (
                    <div className="h-full flex items-center justify-center text-cafe-text-muted text-xs py-16">
                      No items currently cooking.
                    </div>
                  )}
                </div>
              </div>

              {/* 3. COMPLETED COLUMN */}
              <div className="flex flex-col h-full overflow-hidden">
                <div className="bg-cafe-bg-card border-b border-cafe-border px-5 py-3.5 flex justify-between items-center shrink-0">
                  <span className="text-xs font-black text-cafe-beige-mid uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cafe-beige-dark" /> Completed (Served)
                  </span>
                  <span className="text-xs bg-cafe-beige-mid/10 text-cafe-beige-mid font-extrabold border border-cafe-beige-mid/20 px-2 py-0.5 rounded-full">
                    {completedTickets.length}
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar">
                  {completedTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="bg-cafe-bg-card border border-cafe-border/50 rounded-xl p-4 flex flex-col gap-3.5 shadow opacity-65 relative overflow-hidden"
                    >
                      {/* Accent color strip */}
                      <div className="absolute top-0 left-0 w-full h-1.5 bg-cafe-beige-dark" />

                      <div className="flex justify-between items-center border-b border-cafe-border/40 pb-2">
                        <span className="font-extrabold text-sm text-cafe-text-primary">
                          {ticket.order_number}
                        </span>
                        <span className="text-[10px] text-cafe-text-muted font-mono font-bold">
                          {getElapsedTimeText(ticket.sent_at)}
                        </span>
                      </div>

                      <div className="flex flex-col gap-2">
                        {ticket.items.map((item) => (
                          <div key={item.kds_item_id} className="flex justify-between items-center text-xs line-through text-cafe-text-muted">
                            <span>{item.product_name}</span>
                            <span className="font-extrabold">x{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {completedTickets.length === 0 && (
                    <div className="h-full flex items-center justify-center text-cafe-text-muted text-xs py-16">
                      No completed checks shown in active view.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default KitchenDisplay;
