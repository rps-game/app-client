import type { ComponentObjectPropsOptions, Prop, PropType } from 'vue';
import { computed } from 'vue';
import axios from 'axios';
import router from '@/router';
import { useUserStore } from '@/stores/user';

export function useModelWrapper<T extends object>(props: T, emit: Function, name = 'modelValue') {
  return computed({
  // @ts-ignore
    get: () => props[name],
    set: (value) => emit(`update:${name}`, value),
  });
}

export function propsFactory<
  PropsOptions extends ComponentObjectPropsOptions
>(props: PropsOptions, source: string) {
  return <Defaults extends PartialKeys<PropsOptions> = {}>(
    defaults?: Defaults,
  ): AppendDefault<PropsOptions, Defaults> => {
    return Object.keys(props).reduce<any>((obj, prop) => {
      const isObjectDefinition = typeof props[prop] === 'object' && props[prop] != null && !Array.isArray(props[prop]);
      const definition = isObjectDefinition ? props[prop] : { type: props[prop] };

      if (defaults && prop in defaults) {
        obj[prop] = {
          ...definition,
          default: defaults[prop],
        };
      } else {
        obj[prop] = definition;
      }

      if (source && !obj[prop].source) {
        obj[prop].source = source;
      }

      return obj;
    }, {});
  };
}

/**
 * Like `Partial<T>` but doesn't care what the value is
 */
type PartialKeys<T> = { [P in keyof T]?: unknown }
type MergeDefault<T, D> = unknown extends D ? InferPropType<T> : (NonNullable<InferPropType<T>> | D)
type AppendDefault<T extends ComponentObjectPropsOptions, D extends PartialKeys<T>> = {
  [P in keyof T]-?: unknown extends D[P]
    ? T[P]
    : T[P] extends Record<string, unknown>
      ? Omit<T[P], 'type' | 'default'> & {
      type: PropType<MergeDefault<T[P], D[P]>>
      default: MergeDefault<T[P], D[P]>
    }
      : {
        type: PropType<MergeDefault<T[P], D[P]>>
        default: MergeDefault<T[P], D[P]>
      }
}
type IfAny<T, Y, N> = 0 extends (1 & T) ? Y : N;
type InferPropType<T> = [T] extends [null]
  ? any // null & true would fail to infer
  : [T] extends [{ type: null | true }]
    // As TS issue https://github.com/Microsoft/TypeScript/issues/14829
    // somehow `ObjectConstructor` when inferred from { (): T } becomes `any`
    // `BooleanConstructor` when inferred from PropConstructor(with PropMethod) becomes `Boolean`
    ? any
    : [T] extends [ObjectConstructor | { type: ObjectConstructor }]
      ? Record<string, any>
      : [T] extends [BooleanConstructor | { type: BooleanConstructor }]
        ? boolean
        : [T] extends [DateConstructor | { type: DateConstructor }]
          ? Date
          : [T] extends [(infer U)[] | { type: (infer U)[] }]
            ? U extends DateConstructor
              ? Date | InferPropType<U>
              : InferPropType<U>
            : [T] extends [Prop<infer V, infer D>]
              ? unknown extends V
                ? IfAny<V, V, D>
                : V
              : T

const axiosInstance = axios.create({
  baseURL: '/api/v1',
});

axiosInstance.interceptors.response.use(response => {
  return response;
}, error => {
  alert(error.response?.data.message ?? error);
  if (error.response.status === 401) {
    void logout();
    void router.push({ name: 'login' });
  }
  throw error;
});

export async function logout() {
  const store = useUserStore();
  store.setAuth(false);
}

export const AXIOS = axiosInstance;

export interface IPlayer {
  id: string
  name: string;
  isWinner?: boolean;
  delta?: number;
  choice?: number;
}

export enum Results {
  TIE='tie',
  WIN='win',
  LOSE='lose',
  STALEMATE='stalemate',
}

export interface IGame {
  id: string;
  members: IPlayer[];
  result?: {
    value: Results,
    choice: number | number[]
  };
}
