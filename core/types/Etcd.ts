import { Etcd3PrefixedKey, EtcdSchema } from '@core/models/EtcdModel';
import { ILeaseOptions, IKeyValue, IWatchResponse } from 'etcd3';


export type ElectionEvent = 'elected';
export type ElectionListener = (elected: boolean) => void;

export type WatchEvent = 'data' | 'delete' | 'put';
export type WatchListener<EVT extends WatchEvent> = 
  EVT extends 'data' 
  ? (watchResp: IWatchResponse) => void
  : (keyVal: IKeyValue) => void;

export type InitWatchOpts<EVT extends 'key' | 'prefix', K extends string = undefined, PRF extends string = undefined> = 
  EVT extends 'key'
  ? (K extends undefined ? never : { key: Etcd3PrefixedKey<K, PRF> })
  : (PRF extends undefined ? never : { prefix: PRF });

export type WatchEventData<EVT extends WatchEvent> = 
  EVT extends 'data'
  ? IWatchResponse
  : IKeyValue;

export interface CreateLeaseOptions {
  ttl: number;
  opts?: ILeaseOptions;
}

type __baseDataProcessOpts = {
  limit?: number;
  sort?: {
    on: 'Create' | 'Key' | 'Value' | 'Version' | 'Mod';
    direction: 'Ascend' | 'Descend';
  };
};

export type ETCDDataProcessingOpts<K extends string, V, PRF extends string, TYP extends 'iterate' | 'range' = 'iterate'> =
  TYP extends 'iterate' 
  ? { prefix: (EtcdSchema<K, V, PRF>)['prefix'] } & __baseDataProcessOpts
  : TYP extends 'range'
  ? { range: { start: (EtcdSchema<K, V>)['formattedKeyType'], end: (EtcdSchema<K, V>)['formattedKeyType'] } } & __baseDataProcessOpts
  : never;

export type GetAllResponse<K extends string, V = (string | Buffer), PRF extends string = undefined> = { [key in Etcd3PrefixedKey<K, PRF>]: V };

export const ELECTION_EVENTS: { [event in ElectionEvent]: event } = { elected: 'elected' };
export const WATCH_EVENTS: { [event in WatchEvent]: event } = { data: 'data', delete: 'delete', put: 'put' };

export const ELECTION_ERROR_TIMEOUT_IN_MS = 5000;