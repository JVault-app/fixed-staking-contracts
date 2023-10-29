import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, toNano } from 'ton-core';
import { PoolsAdmin } from '../wrappers/PoolsAdmin';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('PoolsAdmin', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('PoolsAdmin');
    });

    let blockchain: Blockchain;
    let poolsAdmin: SandboxContract<PoolsAdmin>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        poolsAdmin = blockchain.openContract(PoolsAdmin.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await poolsAdmin.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: poolsAdmin.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and poolsAdmin are ready to use
    });
});
