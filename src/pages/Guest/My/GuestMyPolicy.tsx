import PolicyContent from "../../../components/Common/PolicyContent";
import BottomBar from "../../../components/BottomBar/BottomBar";

export default function GuestMyPolicy() {
  return (
    <PolicyContent 
      bottomBar={<BottomBar active="my" />} // 게스트용 바 전달
    />
  );
}