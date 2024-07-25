import useMe from './useMe';

export enum Role {
  ADMIN = '系統管理者',
  ASSISTANT = '助理',
  EXHIBITION = '展務',
  SALE = '業務',
}

export enum Action {
  CREATE_ADMIN = 'CREATE_ADMIN',
  UPDATE_ADMIN = 'UPDATE_ADMIN',
  DELETE_ADMIN = 'DELETE_ADMIN',
  CREATE_ARTWORK = 'CREATE_ARTWORK',
  UPDATE_ARTWORK = 'UPDATE_ARTWORK',
  DELETE_ARTWORK = 'DELETE_ARTWORK',
  UPDATE_ROLE = 'UPDATE_ROLE',
  CREATE_ORDER = 'CREATE_ORDER',
  UPDATE_ORDER = 'UPDATE_ORDER',
  DELETE_ORDER = 'DELETE_ORDER',
  CREATE_ARTIST = 'CREATE_ARTIST',
  DELETE_ARTIST = 'DELETE_ARTIST',
  CREATE_COMPANY = 'CREATE_COMPANY',
  DELETE_COMPANY = 'DELETE_COMPANY',
  CREATE_COLLECTOR = 'CREATE_COLLECTOR',
  DELETE_COLLECTOR = 'DELETE_COLLECTOR',
  READ_ASSETSTYPE_A = 'READ_ASSETSTYPE_A',
  READ_ASSETSTYPE_B = 'READ_ASSETSTYPE_B',
  READ_ASSETSTYPE_C = 'READ_ASSETSTYPE_C',
  UPDATE_SALES_INFO = 'UPDATE_SALES_INFO',
}

const config: Record<string, Record<string, boolean>> = {
  [Role.ADMIN]: {
    [Action.CREATE_ARTWORK]: true,
    [Action.UPDATE_ARTWORK]: true,
    [Action.DELETE_ARTWORK]: true,
    [Action.UPDATE_ROLE]: true,
    [Action.CREATE_ORDER]: true,
    [Action.UPDATE_ORDER]: true,
    [Action.DELETE_ORDER]: true,
    [Action.CREATE_ADMIN]: true,
    [Action.UPDATE_ADMIN]: true,
    [Action.DELETE_ADMIN]: true,
    [Action.CREATE_ARTIST]: true,
    [Action.DELETE_ARTIST]: true,
    [Action.CREATE_COMPANY]: true,
    [Action.DELETE_COMPANY]: true,
    [Action.CREATE_COLLECTOR]: true,
    [Action.DELETE_COLLECTOR]: true,
    [Action.READ_ASSETSTYPE_A]: true,
    [Action.READ_ASSETSTYPE_B]: true,
    [Action.READ_ASSETSTYPE_C]: true,
    [Action.UPDATE_SALES_INFO]: true,
  },
  [Role.EXHIBITION]: {
    [Action.CREATE_ARTWORK]: true,
    [Action.UPDATE_ARTWORK]: true,
    [Action.DELETE_ARTWORK]: true,
    [Action.CREATE_ORDER]: true,
    [Action.UPDATE_ORDER]: true,
    [Action.DELETE_ORDER]: true,
    [Action.CREATE_ARTIST]: true,
    [Action.DELETE_ARTIST]: true,
    [Action.CREATE_COMPANY]: true,
    [Action.DELETE_COMPANY]: true,
    [Action.READ_ASSETSTYPE_A]: true,
    [Action.READ_ASSETSTYPE_B]: true,
  },
  [Role.SALE]: {
    [Action.CREATE_COLLECTOR]: true,
    [Action.DELETE_COLLECTOR]: true,
    [Action.READ_ASSETSTYPE_A]: true,
    [Action.READ_ASSETSTYPE_B]: true,
    [Action.UPDATE_SALES_INFO]: true,
  },
  [Role.ASSISTANT]: {
    [Action.CREATE_ARTWORK]: true,
    [Action.UPDATE_ARTWORK]: true,
    [Action.CREATE_ORDER]: true,
    [Action.CREATE_ARTIST]: true,
    [Action.DELETE_ARTIST]: true,
    [Action.READ_ASSETSTYPE_A]: true,
    [Action.READ_ASSETSTYPE_B]: true,
  },
};

const usePermission = () => {
  const { data } = useMe();

  const hasPermission = (actions: Action[]) => {
    return actions.every((action) => data?.name && config[data.name]?.[action]);
  };

  return { hasPermission };
};
4;
export default usePermission;
