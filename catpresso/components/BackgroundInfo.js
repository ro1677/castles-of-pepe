// BackgroundInfo.js
export default function BackgroundInfo({ selectedLanguage }) {
  return (
    <div className="py-8">
      <div className="text-center text-[#A52A2A]">
        {selectedLanguage === "ko" ? (
          <>
            <h1 className="text-2xl font-bold">= Catpresso Cho-cho-ro 멤버쉽 밈코인</h1>
            <p>[카페 멤버쉽, AI GPT, Castles of pepe 코인 채굴 오픈 예정]</p>
            <p>
              본 프로젝트는 투자형 프리세일이 아니며, 캣프레소 토큰은 금융투자 상품이 아닙니다.
            </p>
            <p>
              캣프레소 토큰은 카페 멤버십, AI GPT 서비스, 캐슬오브페페 토큰 채굴 등 다양한 디지털 서비스를 이용할 수 있는 멤버십 토큰입니다.
            </p>
            <p>
              사용자의 편의를 위해 거래소 상장을 계획하고 있으며, 이는 브랜드 인지도 확대와 서비스 접근성을 높이기 위한 결정입니다.
            </p>
            <p>
              프리세일 종료 후 서비스 이용 가격은 고정되며, 거래소 가격과 관계없이 동일한 가치로 멤버십 서비스가 제공됩니다.
            </p>
            <p className="mt-4">
              * 지갑이 없으신 경우, 수량과 이메일 입력 후, 원화 구매 버튼을 누르십시오. 토큰이 이메일 주소로 발송됩니다.
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

