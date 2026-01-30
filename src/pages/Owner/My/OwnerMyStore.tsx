import OwnerBottomBar from "../../../components/BottomBar/OwnerBottomBar";
import AppBar from "../../../components/Common/AppBar";
import { useNavigate } from "react-router-dom";
import StoreEditCard from "../../../components/Owner/My/StoreEditCard";

type EditMenu = {
    key : string;
    label : string;
    onClick : () => void;
};

export default function OwnerMyStore(){

    const navigate = useNavigate();

    const storeEdit : EditMenu[] = [
        {
            key: "service",
            label : "편의시설 및 서비스",
            // TODO 라우팅 연결
            onClick: () => console.log("편의시설 및 서비스"),
        },
        {
            key: "menu",
            label : "기본 가게 정보 및 대표 메뉴",
            // TODO 라우팅 연결
            onClick: () => console.log("기본 가게 정보 및 대표 메뉴"),
        },
        {
            key: "photo",
            label : "가게 사진 및 영상",
            // TODO 라우팅 연결
            onClick: () => console.log("가게 사진 및 영상"),
        },
        {
            key: "holidays",
            label : "운영시간 및 휴무일",
            onClick : () => console.log("운영시간 및 휴무일"),
        },
    ];

    return (
        <div className="min-h-dvh w-full bg-white">
            <AppBar leftType="left" onBack={ () => navigate(-1)}></AppBar>

            <div className="px-[16px]">
                <h1 className="typo-sub-title mt-[5px]">내 가게 관리</h1>
                <nav className="flex flex-col mt-[23px] gap-[26px]">
                    {storeEdit.map((m) => (
                        <StoreEditCard key={m.key} label={m.label} onClick={m.onClick} />
                    ))}
                </nav>
            </div>

            <OwnerBottomBar active="my"></OwnerBottomBar>
        </div>
    )
}