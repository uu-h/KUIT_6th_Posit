import MyAccountContent from "../../../components/Common/MyAccountContent";
import GuestLayout from "../../../layouts/GuestLayout";

export default function GuestMyAccount() {
  return (
    <GuestLayout active="my">
      <MyAccountContent />
    </GuestLayout>
  );
}
