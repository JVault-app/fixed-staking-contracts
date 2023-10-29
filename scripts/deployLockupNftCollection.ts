import { Address, beginCell, toNano, Dictionary, DictionaryKeyTypes, DictionaryKey} from 'ton-core';
import { NftCollection, buildNftCollectionContentCell } from '../wrappers/LockupNftCollection';
import { compile, NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    let stakingParams = Dictionary.empty(Dictionary.Keys.Uint(32), Dictionary.Values.Uint(32));
    const oneDay = 24 * 60 * 60;
    stakingParams.set(30 * oneDay, 100);  // 1%
    stakingParams.set(90 * oneDay, 1000);  // 10%
    stakingParams.set(180, 10000);  /// 100%
    stakingParams.set(360, 1000);
    
    const nftCollection = provider.open(NftCollection.createFromConfig({
        nextItemIndex: 0,
        collectionContent: buildNftCollectionContentCell(
            {
                collectionContent: 'https://raw.githubusercontent.com/ArkadiyStena/testJson/main/nft-content/lave_collection_content.json',  // ПОМЕНЯТЬ
                commonContent: 'https://api.tongochi.org/stakingapi/nft/content/?collection=LAVE_staking&filename='
            }
        ),
        nftItemCode: await compile('NftItem'),
        royaltyParams: {
            tvlFactor: 1440,  // full position for every minute
            tvlBase: 100000,
            rewardsFactor: 30,
            rewardsBase: 100, 
            royaltyAddress: Address.parse("EQAz2fQ6CbjW9IhexJTMWvt6nQRVIIsfoNLGUmvRNLvUSVaM") as Address
        },
        stakingParams: stakingParams,
        withdrawalFactorTon1: 30,  // 0.3 TON 
        withdrawalFactorJetton: 1000, // 10%
    }, await compile('LockupNftCollection')));

    await nftCollection.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(nftCollection.address);

    // run methods on `nftCollection`
}