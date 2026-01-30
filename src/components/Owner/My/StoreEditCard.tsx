
type StoreEditProps = {
  label: string;
  onClick?: () => void; // 나중에 라우팅 연결
};

export default function StoreEditCard({ label, onClick }: StoreEditProps){
    return(
        <button 
            type="button"
            onClick={onClick}
            className="
                bg-white 
                px-[27px] 
                flex justify-between items-center
                w-[343px] h-[100px]
                rounded-[8px]
                cursor-pointer
                shadow-[0_0_10px_0_rgba(0,0,0,0.1)]
        ">
            <span className="typo-13-semibold">{label}</span>
            <span className="typo-12-medium text-neutrals-08">수정하기</span>
            
        </button>
    )
}