import type { StoreMenuItem } from "../../../pages/Guest/Store/store";

export default function MenuList({ menus }: { menus: StoreMenuItem[] }) {
  const fmtPrice = (n: number) => n.toLocaleString("ko-KR") + "원";

  return (
    <section>
      <h3 className="typo-16-bold">대표 메뉴</h3>

      <div className="mt-[30px] flex flex-col gap-[30px]">
        {menus.map((m) => (
          <div
            key={m.id}
            className="flex items-center justify-between gap-[12px]"
          >
            <div className="min-w-0">
              <p className="typo-14-medium text-shades-02 line-clamp-2">
                {m.category ? `[${m.category}] ` : ""}
                {m.name}
              </p>
              <p className="mt-[4px] typo-14-semibold">{fmtPrice(m.price)}</p>
            </div>

            <div className="w-[90px] h-[90px] rounded-[12px] bg-neutrals-03 overflow-hidden shrink-0">
              {m.imageUrl ? (
                <img
                  src={m.imageUrl}
                  alt={m.name}
                  className="w-full h-full object-cover"
                />
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
