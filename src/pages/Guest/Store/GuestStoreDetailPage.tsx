import AppBar from "../../../components/Common/AppBar";
import type { StoreDetail } from "../../../types/store";
import { storeDetailMock } from "./store.mock";
import StoreDetailBody from "../../../components/Guest/Store/StoreDetailBody";
import GuestLayout from "../../../layouts/GuestLayout";

type Props = { store?: StoreDetail };

export default function GuestStoreDetailPage({
  store = storeDetailMock,
}: Props) {
  return (
    <GuestLayout active="home">
      <AppBar
        title={store.name}
        layout="left"
        leftType="left"
        rightType="close"
      />
      <StoreDetailBody store={store} headerOffset={64} />
    </GuestLayout>
  );
}
