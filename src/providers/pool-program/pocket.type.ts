import { IdlAccounts, IdlTypes, IdlEvents } from '@project-serum/anchor';
import { Pocket } from './pocket.idl';

export type OcPocket = IdlAccounts<Pocket>['pocket'];

export type OcBuyCondition = OcPocket['buyCondition'];

export type OcStopConditions = OcPocket['stopConditions'];

type PocketTypes = IdlTypes<Pocket>;

export type OcPocketStatus = PocketTypes['PocketStatus'];

type PocketEvents = IdlEvents<Pocket>;

export type OcEventName =
  | 'PocketCreated'
  | 'PocketDeposited'
  | 'PocketUpdated'
  | 'PocketWithdrawn';

export type PocketEventPocketCreated = PocketEvents['PocketCreated'];
export type PocketEventPocketDeposited = PocketEvents['PocketDeposited'];
export type PocketEventPocketUpdated = PocketEvents['PocketUpdated'];
export type PocketEventPocketWithdrawn = PocketEvents['PocketWithdrawn'];

export type OcPocketEvent =
  | PocketEventPocketCreated
  | PocketEventPocketDeposited
  | PocketEventPocketUpdated
  | PocketEventPocketWithdrawn;
