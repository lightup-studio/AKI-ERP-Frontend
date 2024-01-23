export interface Partner<TPartnerType extends PartnerType | undefined | null = PartnerType> {
  id: number;
  type: TPartnerType;
  zhName: string;
  enName: string;
  createTime: string;
  lastModifyTime: string;
  status: string;
  address: string;
  telephone: string;
  metadata: TPartnerType extends PartnerType
    ? PartnerMetadataMap[TPartnerType]
    : PartnerMetadataMap[keyof PartnerMetadataMap];
}

export type UnknownPartner = Partner<'Unknown'>;
export type ArtistPartner = Partner<'Artist'>;
export type CustomerPartner = Partner<'Customer'>;
export type CompanyPartner = Partner<'Company'>;

export type PartnerType = 'Unknown' | 'Artist' | 'Customer' | 'Company';

export type PartnerMetadataMap = {
  Unknown: UnknownMetadata;
  Artist: ArtistMetadata;
  Customer: CustomerMetadata;
  Company: CompanyMetadata;
};

export interface UnknownMetadata {}

export interface ArtistMetadata {
  email: string;
}

export interface CustomerMetadata {
  email: string;
  else: string;
}

export interface CompanyMetadata {
  email: string;
}
