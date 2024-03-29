import {CoreConfig} from "@stargate-system/core";

const config = {
  discoveryKeyword: CoreConfig.discoveryKeyword,
  discoveryPort: CoreConfig.discoveryPort,
  hubDiscoveryPort: CoreConfig.hubDiscoveryPort,
  discoveryInterval: CoreConfig.discoveryInterval,
  queryTimeout: 5000,
  handshakeTimeout: 5000,
  useFixedUrl: false,
  fixedUrl: 'localhost:10002'
}

export default config;