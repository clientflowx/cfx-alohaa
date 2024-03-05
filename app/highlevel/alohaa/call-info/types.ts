interface CallDurationType {
  duration: number | string;
  status: string;
  agent: string;
}
interface CallResponseType {
  [key: string]: string;
  // Call duration is number type :- to fix
}
interface LocationDataType {
  apiKey: string;
  email: string;
  didNumbers: string;
  callerNumbers: string;
}

type AlohaaAccType = {
  key: string;
  name: string;
  id: string;
};

export type {
  LocationDataType,
  CallDurationType,
  CallResponseType,
  AlohaaAccType,
};
