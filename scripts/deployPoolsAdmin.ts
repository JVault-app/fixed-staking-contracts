import { Address, toNano } from 'ton-core';
import { PoolsAdmin } from '../wrappers/PoolsAdmin';
import { compile, NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const poolsAdmin = provider.open(PoolsAdmin.createFromConfig({
        stakingPoolCode: await compile("LockupNftCollection"),
        nftItemCode: await compile('NftItem'),
        creationFee: 100000000n,
        ownerAddress1: Address.parse("EQCovSj8c8Ik1I-RZt7dbIOEulYe-MfJ2SN5eMhxwfACvsM0") as Address,
        ownerAddress2: Address.parse("UQC228vvLVzjK4t7CUfRhlQuxJqfB5sJzAZNEilvbpY6CzZk") as Address
    }, await compile('PoolsAdmin')));

    await poolsAdmin.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(poolsAdmin.address);

    // run methods on `poolsAdmin`
}
