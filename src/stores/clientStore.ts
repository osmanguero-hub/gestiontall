// ===========================================
// Client Store - Zustand
// Con lógica de Saldos Duales
// ===========================================

import { create } from 'zustand';
import type { Client, Payment } from '../types';
import { mockClients } from '../data/mockData';
import { useProductStore } from './productStore';

interface ClientState {
    clients: Client[];
    payments: Payment[];

    // Actions
    addClient: (client: Client) => void;
    updateClient: (id: string, updates: Partial<Client>) => void;

    // Pagos Duales
    processPayment: (payment: Payment) => void;
    addDebt: (clientId: string, type: 'money' | 'gold10k' | 'gold14k', amount: number) => void;

    // Getters
    getClientById: (id: string) => Client | undefined;
    getClientsWithDebt: () => Client[];
    getPaymentsByClient: (clientId: string) => Payment[];
}

export const useClientStore = create<ClientState>((set, get) => ({
    clients: mockClients,
    payments: [],

    addClient: (client) =>
        set((state) => ({ clients: [...state.clients, client] })),

    updateClient: (id, updates) =>
        set((state) => ({
            clients: state.clients.map((c) =>
                c.id === id ? { ...c, ...updates } : c
            ),
        })),

    // =============================================
    // LÓGICA DE PAGOS DUALES (CRÍTICA)
    // =============================================
    processPayment: (payment) => {
        const { clients } = get();
        const client = clients.find((c) => c.id === payment.clientId);
        if (!client) return;

        set((state) => ({
            payments: [...state.payments, payment],
        }));

        if (payment.type === 'Efectivo' && payment.amount) {
            // Pago en efectivo: resta del saldo de mano de obra
            set((state) => ({
                clients: state.clients.map((c) =>
                    c.id === payment.clientId
                        ? { ...c, balanceMoney: Math.max(0, c.balanceMoney - payment.amount!) }
                        : c
                ),
            }));
        } else if (payment.type === 'Material' && payment.grams && payment.karat) {
            // Pago en material:
            // 1. Resta del saldo correspondiente del cliente
            // 2. Suma al inventario de "Oro Chatarra"

            const balanceField = payment.karat === '10k' ? 'balanceGold10k' : 'balanceGold14k';

            set((state) => ({
                clients: state.clients.map((c) =>
                    c.id === payment.clientId
                        ? { ...c, [balanceField]: Math.max(0, c[balanceField] - payment.grams!) }
                        : c
                ),
            }));

            // Actualizar inventario de chatarra
            const productStore = useProductStore.getState();
            const chatarraProductName = payment.karat === '10k' ? 'Oro Chatarra 10k' : 'Oro Chatarra 14k';
            const chatarraProduct = productStore.products.find(p => p.name === chatarraProductName);

            if (chatarraProduct) {
                productStore.updateStock(chatarraProduct.id, payment.grams);
            }
        }
    },

    addDebt: (clientId, type, amount) => {
        set((state) => ({
            clients: state.clients.map((c) => {
                if (c.id !== clientId) return c;

                switch (type) {
                    case 'money':
                        return { ...c, balanceMoney: c.balanceMoney + amount };
                    case 'gold10k':
                        return { ...c, balanceGold10k: c.balanceGold10k + amount };
                    case 'gold14k':
                        return { ...c, balanceGold14k: c.balanceGold14k + amount };
                    default:
                        return c;
                }
            }),
        }));
    },

    getClientById: (id) => get().clients.find((c) => c.id === id),

    getClientsWithDebt: () =>
        get().clients.filter(
            (c) => c.balanceMoney > 0 || c.balanceGold10k > 0 || c.balanceGold14k > 0
        ),

    getPaymentsByClient: (clientId) =>
        get().payments.filter((p) => p.clientId === clientId),
}));
