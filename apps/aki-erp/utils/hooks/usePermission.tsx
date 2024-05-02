import useMe from './useMe';

export enum Role {
  ADMIN = 'admin',
  ASSISTANT = 'assistant',
  EXHIBITION = 'exhibition',
  SALE = 'sale',
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
  },
  [Role.SALE]: {
    [Action.UPDATE_ARTWORK]: true,
    [Action.CREATE_COLLECTOR]: true,
    [Action.DELETE_COLLECTOR]: true,
  },
  [Role.ASSISTANT]: {
    [Action.CREATE_ARTWORK]: true,
    [Action.UPDATE_ARTWORK]: true,
    [Action.CREATE_ORDER]: true,
    [Action.UPDATE_ORDER]: true,
    [Action.DELETE_ORDER]: true,
    [Action.CREATE_ARTIST]: true,
    [Action.DELETE_ARTIST]: true,
  },
};

const usePermission = () => {
  const { data } = useMe();

  const hasPermission = (actions: Action[]) => {
    return actions.every((action) => data?.account && config[data.account][action]);
  };

  return { hasPermission };
};
4;
export default usePermission;
