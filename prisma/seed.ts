import { prisma } from './index';

async function main() {
  const BLOCKCHAINS = [
    { name: 'Bitcoin', symbol: 'BTC', decimals: 8 },
    { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
    { name: 'Polygon', symbol: 'MATIC', decimals: 18 },
  ];
  const bcs = BLOCKCHAINS.map(async b => {
    const data = {
      name: b.name,
    };
    const bc = await prisma.blockchain.create({ data });
    const tokenData = {
      name: b.name,
      symbol: b.symbol,
      blockchainId: bc.id,
      isNative: true,
      decimals: b.decimals,
    };
    const token = await prisma.token.create({ data: tokenData });
    await prisma.blockchain.update({
      where: {
        id: bc.id,
      },
      data: {
        tokenId: token.id,
      },
    });
    return { bc, token };
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
