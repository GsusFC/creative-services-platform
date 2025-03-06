// Mock del conector de Farcaster/Web3 para evitar errores en la consola
// Este archivo reemplaza la implementación original que intentaba conectarse a servicios blockchain

import { createConnector } from "wagmi";

frameConnector.type = "frameConnector" as const;

export function frameConnector() {
  // Este objeto almacenará el estado simulado de conexión
  const mockState = {
    connected: false,
    chainId: 8453, // ID de la cadena Base
    accounts: ["0x0000000000000000000000000000000000000000"] as readonly `0x${string}`[],
  };

  return createConnector((config) => ({
    id: "farcaster",
    name: "Farcaster Wallet",
    type: frameConnector.type,

    // Método de inicialización sin lógica real
    async setup() {
      return;
    },

    // Simula una conexión exitosa sin hacer llamadas reales
    async connect() {
      mockState.connected = true;
      return {
        accounts: mockState.accounts,
        chainId: mockState.chainId,
      };
    },

    // Método de desconexión simulado
    async disconnect() {
      mockState.connected = false;
    },

    // Devuelve cuentas simuladas
    async getAccounts() {
      return mockState.accounts;
    },

    // Devuelve chainId simulado
    async getChainId() {
      return mockState.chainId;
    },

    // Simula verificación de autorización
    async isAuthorized() {
      return mockState.connected;
    },

    // Simula cambio de cadena
    async switchChain({ chainId }) {
      mockState.chainId = chainId;
      const chain = config.chains.find((x) => x.id === chainId);
      return chain || config.chains[0];
    },

    // Manejadores de eventos simulados
    onAccountsChanged() {},
    onChainChanged() {},
    onDisconnect() {},

    // Proveedor simulado
    async getProvider() {
      return {
        request: async () => {
          return [];
        }
      };
    },
  }));
}
