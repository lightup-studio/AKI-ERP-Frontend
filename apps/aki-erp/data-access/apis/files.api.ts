import { S3ImageUploadInfo } from '@data-access/models';
import axios from 'axios';

export async function createS3ImageUploadInfo() {
  const res = await axios.post<S3ImageUploadInfo>('/api/Files/images');
  return res.data;
}

export async function uploadImageToS3(file: File) {
  const { uploadVerb, uploadHeaders, uploadUrl, displayUrl, thumbnailUrl } =
    await createS3ImageUploadInfo();

  const s3Axios = axios.create({
    headers: {
      ...uploadHeaders,
      'Content-Type': file.type,
    },
  });

  s3Axios.defaults.headers['common'] = {};

  await s3Axios.request({
    method: uploadVerb,
    url: uploadUrl,
    data: file,
  });

  return {
    displayUrl,
    thumbnailUrl,
  };
}
