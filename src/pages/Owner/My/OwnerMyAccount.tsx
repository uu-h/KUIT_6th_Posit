import MyAccountContent from "../../../components/Common/MyAccountContent";
import OwnerBottomBar from "../../../components/BottomBar/OwnerBottomBar";

export default function OwnerMyAccount() {
  return <MyAccountContent bottomBar={<OwnerBottomBar active="my" />} />;
}