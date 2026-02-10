import MyAccountContent from "../../../components/Common/MyAccountContent";
import OwnerLayout from "../../../layouts/OwnerLayout";

export default function OwnerMyAccount() {
  return (
    <OwnerLayout active="my">
      <MyAccountContent />
    </OwnerLayout>
  );
}
