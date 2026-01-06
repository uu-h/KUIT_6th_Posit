export default function Onboarding() {
  return (
    <div className="h-[100vh] flex flex-col items-center justify-center">
      <div className="animate-fade-in">
        <img src="Logo.svg" alt="로고 이미지" />
      </div>

      <h1 className="text-shades-02 text-[34px] text-center font-bold">
        POSiT!
      </h1>

      <p className="typo-14-regular text-shades-02 text-center">
        post your idea .
      </p>
    </div>
  );
}
