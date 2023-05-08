import { IdlAccounts, IdlTypes, IdlEvents } from '@project-serum/anchor';
import { Pocket } from './pocket.idl';

export type OcPocket = IdlAccounts<Pocket>['pocket'];

export type OcBuyCondition = OcPocket['buyCondition'];

export type OcStopConditions = OcPocket['stopConditions'];

type PocketTypes = IdlTypes<Pocket>;

export type OcPocketStatus = PocketTypes['PocketStatus'];

type PocketEvents = IdlEvents<Pocket>;

export type OcEventName = keyof PocketEvents;

export type PocketEventCreated = PocketEvents['PocketCreated'];
export type PocketEventDeposited = PocketEvents['PocketDeposited'];
export type PocketEventUpdated = PocketEvents['PocketUpdated'];
export type PocketEventDidSwap = PocketEvents['DidSwap'];
export type PocketEventWithdrawn = PocketEvents['PocketWithdrawn'];
export type PocketEventVaultCreated = PocketEvents['VaultCreated'];
export type PocketEventConfigUpdated = PocketEvents['PocketConfigUpdated'];

export type OcPocketEvent =
  | PocketEventCreated
  | PocketEventDeposited
  | PocketEventUpdated
  | PocketEventDidSwap
  | PocketEventWithdrawn
  | PocketEventVaultCreated
  | PocketEventConfigUpdated;
