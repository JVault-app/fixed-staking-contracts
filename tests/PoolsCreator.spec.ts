import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, toNano } from 'ton-core';
import { PoolsCreator } from '../wrappers/PoolsCreator';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('PoolsCreator', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('PoolsCreator');
    });

    let blockchain: Blockchain;
    let poolsCreator: SandboxContract<PoolsCreator>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        poolsCreator = blockchain.openContract(PoolsCreator.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await poolsCreator.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: poolsCreator.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and poolsCreator are ready to use
    });
});
