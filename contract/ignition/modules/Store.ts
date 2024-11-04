import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

const _version = "1";

const StoreModule = buildModule("StoreModule", (m) => {
    const version = m.getParameter("version", _version)
    const store = m.contract("Store", [version], {

    })

    return { store }
})

export default StoreModule