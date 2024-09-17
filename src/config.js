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

const playfiAlbireo = {
    id: 1612127,
    name: 'PlayFi Albireo',
    iconUrl: 'https://3292822671-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FVFwVdZmYLNYAfVYbLIF2%2Fuploads%2Fo1Tmwa9ffVk2j1xwzEIk%2FLogomark%20Colored.png?alt=media&token=f247f0c6-732e-48f5-831d-71864cde1d7d',
    iconBackground: '#fff',
    nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
      default: { http: ['https://albireo-rpc.playfi.ai/'] },
    },
    blockExplorers: {
      default: { name: 'Albireo Blockscanner', url: 'https://albireo-explorer.playfi.ai/' },
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 756690,
      },
    },
};

export function getCardRankShortForm(rank) {
  switch(rank.toLowerCase()) {
    case 'one':
      return '1';
    case 'two':
      return '2';
    case 'three':
      return '3';
    case 'four':
      return '4';
    case 'five':
      return '5';
    case 'six':
      return '6';
    case 'seven':
      return '7';
    case 'eight':
      return '8';
    case 'nine':
      return '9';
    case 'ten':
      return '0';
    case 'jack':
      return 'J';
    case 'queen':
      return 'Q';
    case 'king':
      return 'K';
    case 'ace':
      return 'A';
    default:
      return 'Invalid rank';
  }
}

export const config = getDefaultConfig({
    appName: 'HeadsUp',
    projectId: 'fb1831c754537301a512f2f79a0db66a',
    chains: [playfiAlbireo, blastSepolia],
    transports: {
        [blastSepolia.id]: http("https://sepolia.blast.io"),
        [playfiAlbireo.id]: http("https://albireo-rpc.playfi.ai/")
    }
  });

export const contractAddress = "0xB56CAF51A15A8a0217A64FCe9fa395cfE0441291";
export const graphEndpoint = "https://playfi-indexer-production.up.railway.app/";

export const queryClient = new QueryClient();
