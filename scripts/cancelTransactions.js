const path = require('path');
const ethers = require('ethers');  // 改为直接导入 ethers

async function cancelPendingTransactions() {
    // 直接使用 Holesky RPC URL
    const provider = new ethers.JsonRpcProvider(
        `https://holesky.infura.io/v3/75f9cf45be674b659fc5ef69db6fa517`
    );

    const wallet = new ethers.Wallet("私钥", provider);

    const pendingNonce = await wallet.getNonce('pending');    // 方法名更新
    const latestNonce = await wallet.getNonce('latest');      // 方法名更新

    for (let i = latestNonce; i < pendingNonce; i++) {
        try {
            const tx = await wallet.sendTransaction({
                to: wallet.address,
                value: 0,
                nonce: i,
                gasPrice: ethers.parseUnits('50', 'gwei'),    // 更新 utils 方法调用
                gasLimit: 21000
            });
            console.log(`Cancelling transaction with nonce: ${i}`);
            await tx.wait();
        } catch (error) {
            console.error(`Error cancelling nonce ${i}:`, error);
        }
    }
}

cancelPendingTransactions().catch((error) => {
    console.error('Error in script execution:', error);
    process.exit(1);
});