// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Importa o localStorage
import authReducer from './authSlice';
import menuReducer from './menuSlice';


// Configuração do persist
const persistConfig = {
    key: 'auth',
    storage,
    blacklist: ['auth']
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
    reducer: {
        auth: persistedAuthReducer,
        menu: menuReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Desativa a verificação de serialização para evitar warnings
        }),
});

// Criando o persistor
export const persistor = persistStore(store);

// Inferir o tipo da aplicação
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;