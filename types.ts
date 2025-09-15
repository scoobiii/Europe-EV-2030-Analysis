export interface ProductionData {
  category: string;
  domestic: number;
  imported: number;
  share: number;
  companies: string[];
}

export interface ElectricityDemandData {
  year: number;
  current: number;
  projected: number;
  percentage: number;
}

export interface EnergyMixData {
  source: string;
  current2024: number;
  projected2030: number;
  internal2030: number;
  external2030: number;
  externalProviders?: { name: string; twh: number; color: string }[];
  color: string;
}


export interface ChargingInfraData {
  country: string;
  points2024: number;
  points2030: number;
  publicPoints: number;
}