const tabelColumnsIncoming = [
  { key: "s_mobile_no", text: "S Mobile No." },
  { key: "v_mobile_no", text: "V Mobile No." },
  { key: "agent_name", text: "Agent Name" },
  { key: "agent_no", text: "Agent No." },
  { key: "call_status", text: "Call Status" },
  { key: "call_duration", text: "Call duration" },
  { key: "call_recording_url", text: "Call Recording" },
  { key: "call_blocked", text: "Call Blocked" },
  { key: "received_at", text: "Received at" },
  { key: "ended_at", text: "Ended at" },
];
const tableColumnsOutgoing = [
  { key: "caller_number", text: "Caller Number" },
  { key: "receiver_number", text: "Receiver Number" },
  { key: "did_number", text: "DID Number" },
  { key: "agent_name", text: "Agent name" },
  { key: "recording_url", text: "Call Recording" },
  { key: "call_duration", text: "Call duration" },
  { key: "status", text: "Call status" },
  { key: "updatedAt", text: "Updated At" },
];

export { tabelColumnsIncoming, tableColumnsOutgoing };
