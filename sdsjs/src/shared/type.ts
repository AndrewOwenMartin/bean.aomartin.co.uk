export type Hyp = number;
export interface Agent {
  hyp: Hyp;
  active: boolean;
}

export type Clusters = Map<Hyp, number>;
