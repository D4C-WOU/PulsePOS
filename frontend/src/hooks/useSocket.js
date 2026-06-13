import { useEffect, useMemo, useState } from "react";
import { createSocket } from "../services/socket";
import { useRealtimeStore } from "../store/realtimeStore";

const getOrderId = (payload) => {
  if (!payload) return null;
  if (typeof payload === "string") return payload;
  return payload.orderId || payload.id || payload.order?.id || null;
};

const getOrderObject = (payload) => {
  if (!payload) return null;
  if (payload.order) return payload.order;
  if (payload.id && payload.items) return payload;
  return null;
};

export const useSocket = (enabled = true) => {
  const socket = useMemo(() => createSocket(), []);
  const addOrder = useRealtimeStore((s) => s.addOrder);
  const acceptOrder = useRealtimeStore((s) => s.acceptOrder);
  const moveToPreparing = useRealtimeStore((s) => s.moveToPreparing);
  const moveToCompleted = useRealtimeStore((s) => s.moveToCompleted);
  const markPaymentSuccess = useRealtimeStore((s) => s.markPaymentSuccess);

  const [connected, setConnected] = useState(false);
  const [status, setStatus] = useState("connecting");

  useEffect(() => {
    if (!enabled) return;

    const onConnect = () => {
      setConnected(true);
      setStatus("connected");
    };

    const onDisconnect = () => {
      setConnected(false);
      setStatus("disconnected");
    };

    const onConnectError = () => {
      setConnected(false);
      setStatus("error");
    };

    const onOrderNew = (payload) => {
      const order = getOrderObject(payload);
      if (order) addOrder(order);
    };

    const onOrderAccepted = (payload) => {
      const orderId = getOrderId(payload);
      if (orderId) acceptOrder(orderId);
    };

    const onOrderPreparing = (payload) => {
      const orderId = getOrderId(payload);
      if (orderId) moveToPreparing(orderId);
    };

    const onOrderCompleted = (payload) => {
      const orderId = getOrderId(payload);
      if (orderId) moveToCompleted(orderId);
    };

    const onPaymentSuccess = (payload) => {
      const orderId = getOrderId(payload);
      if (orderId) markPaymentSuccess(orderId);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);

    socket.on("order:new", onOrderNew);
    socket.on("order:accepted", onOrderAccepted);
    socket.on("order:preparing", onOrderPreparing);
    socket.on("order:completed", onOrderCompleted);
    socket.on("payment:success", onPaymentSuccess);

    socket.connect();


    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);

      socket.off("order:new", onOrderNew);
      socket.off("order:accepted", onOrderAccepted);
      socket.off("order:preparing", onOrderPreparing);
      socket.off("order:completed", onOrderCompleted);
      socket.off("payment:success", onPaymentSuccess);

      socket.disconnect();
    };
  }, [
    socket,
    enabled,
    addOrder,
    acceptOrder,
    moveToPreparing,
    moveToCompleted,
    markPaymentSuccess,
  ]);

  return { socket, connected, status };
};