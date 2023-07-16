import { Method } from 'axios';
export interface S3ImageUploadInfo {
  uploadVerb: Method;
  uploadUrl: string;
  uploadHeaders: Record<string, string>;
  displayUrl: string;
  thumbnailUrl: string;
  expiredTime: Date;
}
