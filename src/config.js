import {
  getDefaultConfig
} from '@rainbow-me/rainbowkit';
import {
  QueryClient
} from "@tanstack/react-query";
import { http } from 'viem';

const blastSepolia = {
    id: 168587773,
    name: 'Blast Sepolia',
    iconUrl: 'https://assets.coingecko.com/coins/images/35494/standard/Blast.jpg?1719385662',
    iconBackground: '#fff',
    nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
      default: { http: ['https://sepolia.blast.io'] },
    },
    blockExplorers: {
      default: { name: 'Sepolia BlastScan', url: 'sepolia.blastexplorer.io' },
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 756690,
      },
    },
  };

export const config = getDefaultConfig({
    appName: 'HeadsUp',
    projectId: 'fb1831c754537301a512f2f79a0db66a',
    chains: [blastSepolia],
    transports: {
        [blastSepolia.id]: http("https://sepolia.blast.io")
    }
  });

export const queryClient = new QueryClient();
