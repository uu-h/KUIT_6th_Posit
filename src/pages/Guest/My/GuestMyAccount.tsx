import MyAccountContent from "../../../components/Common/MyAccountContent";
import BottomBar from "../../../components/BottomBar/BottomBar";

export default function GuestMyAccount() {
  return <MyAccountContent bottomBar={<BottomBar active="my" />} />;
}