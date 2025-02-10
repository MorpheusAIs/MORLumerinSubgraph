# The Graph For Morpheus Smart Contracts

This is the graph for Morpheus Smart Contracts.

# Deployment
- `npm run prepare:arbitrum-mainnet` or `npm run arbitrum:ethereum-sepolia`
- `npm run codegen`
- `npm run build`
- `npx graph auth --studio YOUR_STUDIO_KEY`
- `npx graph deploy --studio YOUR_STUDIO_NAME`


graph deploy morpheus-mainnet-base \
  --version-label v0.0.1 \
  --node https://subgraphs.alchemy.com/api/subgraphs/deploy \
  --deploy-key kupuSoAbTVQ7h \
  --ipfs https://ipfs.satsuma.xyz