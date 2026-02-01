export type AdoptionSource = "CONCERN" | "FREE";

export type AdoptedAnswer = {
  name: string;
  age: number;
  gender: string;
  title: string;
  content: string;
  date: string;
  imageUrl?: string;
};

export type ConcernInfo = {
  title: string;
};

export type CouponAdoptionDetail =
  | {
      source: "CONCERN";
      concern: ConcernInfo;
      answer: AdoptedAnswer;
    }
  | {
      source: "FREE";
      answer: AdoptedAnswer;
    };
