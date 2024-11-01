import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("Store", function () {
    // Fixture để triển khai hợp đồng Store và thực hiện các thiết lập ban đầu
    async function deployStoreFixture() {
        const [owner, otherAccount] = await hre.ethers.getSigners();

        const version = "1.0";
        const Store = await hre.ethers.getContractFactory("Store");
        const store = await Store.deploy(version);

        return { store, version, owner, otherAccount };
    }

    describe("Deployment", function () {
        it("Should set the right version", async function () {
            const { store, version } = await loadFixture(deployStoreFixture);

            expect(await store.version()).to.equal(version);
        });
    });

    describe("Setting Items", function () {
        it("Should set an item correctly", async function () {
            const { store } = await loadFixture(deployStoreFixture);

            const key = hre.ethers.utils.formatBytes32String("key1");
            const value = hre.ethers.utils.formatBytes32String("value1");

            // Thực hiện hành động setItem và kiểm tra giá trị trong mapping
            await store.setItem(key, value);
            expect(await store.items(key)).to.equal(value);
        });

        it("Should emit an ItemSet event on setting an item", async function () {
            const { store } = await loadFixture(deployStoreFixture);

            const key = hre.ethers.utils.formatBytes32String("key2");
            const value = hre.ethers.utils.formatBytes32String("value2");

            // Kiểm tra sự kiện emit khi setItem được gọi
            await expect(store.setItem(key, value))
                .to.emit(store, "ItemSet")
                .withArgs(key, value);
        });
    });
});
