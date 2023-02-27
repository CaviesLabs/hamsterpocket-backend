import { IdlAccounts } from '@project-serum/anchor';
import { Pocket } from './pocket.idl';

export type OcPocket = IdlAccounts<Pocket>['pocket'];

export type OcPocketStatus = OcPocket['status'];

export type OcBuyCondition = OcPocket['buyCondition'];

export type OcStopConditions = OcPocket['stopConditions'];
