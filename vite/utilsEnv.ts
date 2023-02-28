import _ from 'lodash';
export default function parseEnv(env: { [key: string]: string }) {
  const envs = _.cloneDeep<{
    [key: string]: string | number | boolean | null | undefined;
  }>(env);
  Object.entries(env).forEach(([key, value]) => {
    if (value === 'true' || value === 'false')
      envs[key] = value === 'true' ? true : false;
    else if (/^\d+$/.test(value)) envs[key] = Number(value);
    else if (value === 'null') envs[key] = null;
    else if (value === 'undefined') envs[key] = undefined;
  });
  return envs;
}
