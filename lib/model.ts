import model from "../content/organization/organization-model.json";
import catalog from "../content/agency-agents/divisions.json";
export type Unit = {
  id: string;
  label: string;
  status?: string;
  economicType?: string;
  note?: string;
};
export type Layer = {
  id: string;
  label: string;
  purpose: string;
  status: string;
  rank: number;
  units: Unit[];
};
export const layers: Layer[] = model.layers;
export const { source, divisions } = catalog;
export const formatStatus = (status: string) => status.replaceAll("-", " ");
export const yFor = (index: number) => (2 - index) * 1.13;
