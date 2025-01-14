import createStore from 'unistore';
import type { User } from 'firebase/auth';

export interface AppState {
    user: User | null | undefined;
}

const initialState: AppState = {
    user: undefined,
};

export default createStore(initialState);
