'use client';

import { ProfileForm } from '@components/profile';
import { useMe } from '@utils/hooks';

const ProfileSettings = () => {
  const { data, refetch } = useMe();

  return <>{data && <ProfileForm data={data} refetch={refetch} />}</>;
};

export default ProfileSettings;
