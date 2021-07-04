# wallets-updater

Automatic updater for  [wallets](https://github.com/LePetitBloc/wallets).

## Why?

Manually checking wallets for update and updating version numbers in the manifest is time consuming. 
This is a machine task. 

## Installation

```bash
npm install
```

## Usage

```bash
node index.js
```

```markdown
docker build . -t wallets-updater && docker run --env-file=./.env updater
```
## Testing  
- Fork the [wallets](https://github.com/LePetitBloc/wallets) and add a deployment key.

- Set up the .env file according to the [.env.dist](.env.dist)

```markdown
docker-compose -f docker-compose.test.yml run updater
```

## Code of conduct

See the [CODE OF CONDUCT](CODE_OF_CONDUCT.md) file.

## Contributing

See the [CONTRIBUTING](CONTRIBUTING.md) file.

## License

This project is under [MIT License](LICENSE.md).

## Support

See the [SUPPORT](SUPPORT.md) file.

## Donation

We love cryptocurrencies, consider making a donation:

| Currency         | Address                                    |
| ---------------- | ------------------------------------------ |
| Bitcoin          | 14VRBrDZ47HR1pWjmAnyC5CJCXDkhLeANb         |
| Ethereum         | 0x1accf4c2bd6010100a2aeac36f336fb963a1716a |
| Ethereum Classic | 0x3b33bdcc70f06dad7068594a0cd8fbfd7b203aae |
| Litecoin         | LdH6Sbq5M9p6dqG7GaRvBjoCqJ2CHnz9wr         |
| Dash             | XuPyN4Ns12qaMKzUjffzeKrCjCL4XYwUCY         |
| ZCash            | t1U2e4TV6zmg6gXAByBp59NtBP2HsEvY5T5        |
| Doge             | DKbojeYrguCL2Suh9ujmU49m4QK9DixBXL         |
