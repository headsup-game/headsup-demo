import './App.css';
import '@rainbow-me/rainbowkit/styles.css';
import { WagmiProvider } from 'wagmi';
import {
  QueryClientProvider,
} from "@tanstack/react-query";
import {
  RainbowKitProvider,
  ConnectButton
} from '@rainbow-me/rainbowkit';
import {
  config,
  queryClient
} from "./config";
import Betting from './Betting';
import ViewRounds from './ViewRounds';

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
            <div className="App">
              <header className="App-header">
                <ConnectButton />
                <Betting />
                <ViewRounds />
              </header>
            </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
