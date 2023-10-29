import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, toNano } from 'ton-core';
import { LockupNftCollection } from '../wrappers/LockupNftCollection';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('LockupNftCollection', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('LockupNftCollection');
    });

    let blockchain: Blockchain;
    let lockupNftCollection: SandboxContract<LockupNftCollection>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        lockupNftCollection = blockchain.openContract(LockupNftCollection.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await lockupNftCollection.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: lockupNftCollection.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and lockupNftCollection are ready to use
    });
});
