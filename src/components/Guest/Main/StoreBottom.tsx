import { useNavigate } from "react-router-dom";
import { StoreHeaderCard } from "../../../components/Guest/Store";
import type { StoreDetail } from "../../../types/store";

type Props = {
  store: StoreDetail;
  onClose?: () => void;
  px?: number;
};

function toStoreIdNum(id: string): number {
  return Number(String(id).replace("store_", ""));
}

export default function StoreBottom({ store, onClose, px = 16 }: Props) {
  const navigate = useNavigate();
  const storeIdNum = toStoreIdNum(store.id);

  return (
    <main style={{ paddingLeft: px, paddingRight: px }} className="pt-[7px]">
      <StoreHeaderCard
        store={store}
        onClose={onClose}
        onOwnerPositClick={() => {
          navigate(`/guest/stores/${storeIdNum}/posit/concerns`, {
            state: { storeName: store.name },
          });
        }}
        onMyPositClick={() => {
          navigate(`/stores/${storeIdNum}/posit/new`, {
            state: { storeName: store.name },
          });
        }}
      />
    </main>
  );
}
