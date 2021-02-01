declare const _default: <T extends Record<string, any>>(target: T) => {
    on<U extends keyof T & string>(name: U, func: (arg: T[U]) => void): () => () => any;
    once<U_1 extends keyof T & string>(name: U_1, func: (arg: T[U_1]) => void): () => () => any;
    set<U_2 extends keyof T & string>(name: U_2, value: T[U_2]): void;
    target: T;
    clear(): void;
};
export = _default;
