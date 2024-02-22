interface CallDurationType {
  duration: number;
  status: string;
  agent: string;
}
interface CallResponseType {
  [key: string]: string | undefined;
  // Call duration is number type :- to fix
}
interface LocationDataType {
  apiKey: string;
  email: string;
  didNumbers: string;
  callerNumbers: string;
}
export type { LocationDataType, CallDurationType, CallResponseType };
