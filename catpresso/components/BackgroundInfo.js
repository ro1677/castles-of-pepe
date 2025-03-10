// BackgroundInfo.js
export default function BackgroundInfo({ selectedLanguage }) {
  return (
    <div className="py-4">
      <div className="text-center text-black">
        {selectedLanguage === "ko" ? (
          <>
            <h1 className="text-2xl font-bold">= Catpresso Cho-cho-ro 밈코인</h1>
            <p className="mt-4">[카페 멤버쉽, AI GPT 오픈 예정]</p>
            <p>
              캣프레소 토큰은 다양한 디지털 서비스를 <br /> 이용할 수 있는 멤버십 토큰입니다.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold">= Catpresso Cho-cho-ro Membership Meme Coin</h1>
            <p>[Cafe Membership, AI GPT, Castles of Pepe Coin Mining Coming Soon]</p>
            <p>
              This project is not an investment presale, and Catpresso Tokens are not financial investment products.
            </p>
            <p>
              Catpresso Tokens are membership tokens that enable access to various digital services such as cafe membership, AI GPT services, and Castles of Pepe token mining.
            </p>
            <p>
              For user convenience, we plan to list on exchanges—this decision is aimed at increasing brand recognition and improving service accessibility.
            </p>
            <p>
              After the presale ends, the service usage price will be fixed, and membership services will be provided at the same value regardless of the exchange price.
            </p>
            <p className="mt-4">
              * If you do not have a wallet, please enter the token amount and your email, then click the KRW purchase button. Tokens will be sent to your email address.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

