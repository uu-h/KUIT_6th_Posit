import PolicyContent from "../../../components/Common/PolicyContent";
import OwnerBottomBar from "../../../components/BottomBar/OwnerBottomBar";

export default function OwnerMyPolicy() {
  return (
    <PolicyContent 
      bottomBar={<OwnerBottomBar active="my" />} // 게스트용 바 전달
    />
  );
};