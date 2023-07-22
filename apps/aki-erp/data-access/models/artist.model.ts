export interface Artist {
  id: number;
  countryCode: string;
  zhName: string;
  zhLastname: string;
  enName: string;
  enLastname: string;
  createTime: string;
  modifyTime: string;
  zhOverview: string;
  enOverview: string;
  type: string;
  rawAvatarFilename: string;
  displayAvatarFilename: string;
  metadata: string;
  rawAvatarUrl: string;
  displayAvatarUrl: string;
}