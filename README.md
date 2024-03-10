# Descrption

The solution presented is a bridge that employs a State connector on Coston (the main ETF chain) and Sepolia (the side ETF chain) to allow tokens to be wrapped on one supported chain and moved to another. We are building on top of this solution to develop a decentralized, multichain variant of ETFs. An ETF fund tracks specific indices of tokens and consists of a particular asset mix. Traditionally, financial entities deposit large amounts of funds into a single vault and subsequently issue ETF share tokens. In our decentralized model, we aim to enable small investors to contribute to the fund. This is achieved by dividing the large pool into smaller vaults, maintaining the same asset mix but in reduced quantities. Investors can contribute any amount to these vaults. Once a vault accumulates the necessary assets, ETF share tokens are minted and distributed proportionally to each contributor based on their investment. Users can contribute on the main chain by directly depositing tokens into the vaults or on a side chain by using the State Connector and Relay to attest that tokens were deposited. We utilize FTSO price data to ensure fair contribution calculation. This means that users contributing larger amounts of more expensive tokens will receive a greater number of ETF share tokens. Contrary to traditional financial processes, users can redeem the vault's underlying assets using the same quantity of ETF tokens. When a user (burner) burns a vault, the contract returns the main chain token to the address that burned the vault, burned all the wrapped assets, and emits a message that will be used for creating a burn attestation. The burn attestation proof will be later submitted to all the sidechains and will allow the burner to redeem the asset deposited on the side chain contracts. - ETF MAIN CHAIN BRIDGE CONTRACT: https://github.com/GaetanoMondelli/ETH-OXFORD/blob/main/packages/hardhat/contracts/ETF.sol - ETF SIDE CHAIN BRIDGE LOCK CONTRACT: https://github.com/GaetanoMondelli/ETH-OXFORD/blob/main/packages/hardhat/contracts/ETFLock.sol


# Video Demo

https://www.youtube.com/watch?v=g6GdrsePvfI



Steps





- deploy on sepolia

- set the transaction in the verify eth to create attestation 
```
npm run verifySepolia
 ```

- deploy coston

npm run coston